"""Conductor: run pipeline steps in order against a project.json."""
from __future__ import annotations

import hashlib
import json
import logging
from pathlib import Path

from . import captions as cap
from . import graph as graph_mod
from . import qa
from . import transcribe as tr
from .project import Project
from .render import render

log = logging.getLogger("aive.conductor")

STEPS = ["probe", "transcribe", "shots", "roughcut", "captions", "render", "qa"]


def cache_dir(project: Project) -> Path:
    d = project.root / "cache"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _find_lyrics(project: Project) -> Path | None:
    """Find lyrics_words.json for the project's music track."""
    mp = project.music_path
    if not mp:
        return None
    candidate = mp.parent / f"{mp.stem}_words.json"
    return candidate if candidate.exists() else None


def step_probe(project: Project) -> dict:
    from .ffprobe import probe

    info = probe(project.source_path)
    return info.to_dict()


def step_transcribe(project: Project, model: str = "base") -> dict:
    if not tr.available():
        log.warning("faster-whisper not installed; skipping transcript")
        return {"skipped": True, "reason": "faster-whisper missing"}
    transcript = tr.transcribe(str(project.source_path), model_size=model)
    out = cache_dir(project) / "transcript.json"
    tr.save(transcript, out)
    return transcript.to_dict()


def _analysis_cache_path(project: Project, stage: str, version: str) -> Path:
    source = project.source_path.resolve()
    stat = source.stat()
    identity = f"{source}|{stat.st_size}|{stat.st_mtime_ns}|{version}"
    key = hashlib.sha256(identity.encode("utf-8")).hexdigest()[:20]
    d = cache_dir(project) / "analysis"
    d.mkdir(parents=True, exist_ok=True)
    return d / f"{stage}-{key}.json"


def step_shots(project: Project) -> list[dict]:
    """Cache audio-transient candidates without claiming they are confirmed kills."""
    from .shots import DETECTOR_VERSION, detect

    source = project.source_path.resolve()
    cache = _analysis_cache_path(project, "transients", DETECTOR_VERSION)
    if cache.exists():
        payload = json.loads(cache.read_text(encoding="utf-8"))
        if payload.get("source") == str(source):
            log.info("reusing cached transient candidates: %s", cache)
            return payload.get("candidates", [])

    found = detect(str(source))
    candidates = [event.to_dict() for event in found]
    payload = {
        "schema_version": 1,
        "detector_version": DETECTOR_VERSION,
        "source": str(source),
        "status": "unconfirmed_audio_transient_candidates",
        "candidates": candidates,
    }
    cache.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return candidates


def step_killfeed(project: Project, candidates: list[dict]) -> list[dict]:
    """Cache Valorant HUD row-change candidates; this is not player-ID OCR."""
    if not candidates:
        return []
    from .events import EventCandidate
    from .killfeed import PROFILE_VERSION, detect_changes

    source = project.source_path.resolve()
    cache = _analysis_cache_path(project, "killfeed", PROFILE_VERSION)
    if cache.exists():
        payload = json.loads(cache.read_text(encoding="utf-8"))
        if payload.get("source") == str(source):
            log.info("reusing cached kill-feed change candidates: %s", cache)
            return payload.get("candidates", [])

    ranked = sorted(candidates, key=lambda item: -float(item.get("strength", 0.0)))[:200]
    events = [EventCandidate(
        source=str(item.get("source", source)),
        t=float(item["t"]),
        strength=float(item.get("strength", 0.0)),
        peak_db=float(item.get("peak_db", 0.0)),
    ) for item in ranked]
    found = detect_changes(str(source), events, sample_hz=15.0)
    payload = {
        "schema_version": 1,
        "profile_version": PROFILE_VERSION,
        "source": str(source),
        "status": "unconfirmed_killfeed_row_changes",
        "candidates": found,
    }
    cache.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return found


def _wrap_caption(text: str, max_chars: int = 38) -> list[str]:
    """Split a spoken line into short lower-third chunks."""
    text = " ".join(text.split())
    if not text:
        return []
    words, lines, cur = text.split(), [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > max_chars:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return lines


def step_captions(project: Project) -> str | None:
    """Build an ASS file from title/outro graphics + real captions.

    Captions come from the transcript (``captions_mode="auto"``) or from
    explicit ``project.captions`` (``captions_mode="manual"``). Invented text
    is never generated: the default mode is ``"off"``.
    """
    items: list[cap.Caption] = []
    title = project.title
    if title.get("enabled") and title.get("lines"):
        lines = title["lines"]
        sizes = title.get("font_size", [70] * len(lines))
        t_in = float(title.get("in", 0.4))
        t_out = float(title.get("out", 3.2))
        anim = title.get("anim", "pop")
        text = r"\N".join(str(t) for t in lines)
        size = max(sizes) if sizes else 90
        style = "Heavy" if size >= 110 else ("Hook" if size >= 82 else "Title")
        items.append(cap.Caption(text=text, start=t_in, end=t_out, style=style,
                                 anim=anim, fade_in=0.6, fade_out=0.5))

    mode = (project.captions_mode or "off").lower()
    if mode == "manual":
        for c in project.captions:
            items.append(cap.Caption(
                text=c["text"], start=c["start"], end=c["end"],
                style=c.get("style", "Lower"),
            ))
    elif mode == "auto":
        tr_path = cache_dir(project) / "transcript.json"
        if tr_path.exists():
            transcript = tr.load(tr_path)
            for seg in transcript.segments:
                for line in _wrap_caption(seg.text):
                    items.append(cap.Caption(
                        text=line, start=seg.start, end=seg.end,
                        style="Lower",
                    ))
        else:
            log.warning("captions_mode=auto but no transcript at %s", tr_path)
    elif mode == "lyrics":
        from . import text as text_mod
        lyrics_path = _find_lyrics(project)
        if lyrics_path and lyrics_path.exists():
            import json
            ldata = json.loads(lyrics_path.read_text(encoding="utf-8"))
            words = ldata.get("words", [])
            if words:
                sub_cfg, imp_cfg = text_mod.load_config("style_profiles/montage.json")
                m_start = project.music_start or 0.0
                shifted_words = [
                    {**w, "start": max(0.0, w["start"] - m_start), "end": max(0.0, w["end"] - m_start)}
                    for w in words if w["end"] > m_start
                ]
                phrases = text_mod.group_phrases(shifted_words)
                emotional = set(text_mod.DEFAULT_IMPACT_WORDS)
                impact_idx = text_mod.pick_impact_words(shifted_words, phrases, emotional)
                subs = text_mod.make_subtitles(phrases, sub_cfg)
                imps = text_mod.make_impacts(shifted_words, impact_idx, imp_cfg, fps=60.0)
                for imp in imps:
                    imp.anim = imp_cfg.entry_anim
                    imp.rgb_split = imp_cfg.rgb_split
                items.extend(subs)
                items.extend(imps)
        else:
            log.warning("captions_mode=lyrics but no lyrics file found")
    elif mode not in ("off",):
        raise ValueError(f"unknown captions_mode: {mode!r}")

    outro = project.outro
    if outro.get("enabled") and outro.get("lines"):
        total = graph_mod.timeline_duration(project)
        start = total + 1.0
        end = total + float(outro.get("hold", 6.0)) - 0.6
        for i, text in enumerate(outro["lines"]):
            items.append(cap.Caption(text=text, start=start, end=end,
                                     style=cap.outro_style_for(i)))
    if not items:
        return None
    ass = cache_dir(project) / "captions.ass"
    cap.write_ass(ass, items, cap.default_styles())
    return str(ass)


def step_render(project: Project, ass_path: str | None, encoder: str | None = None,
                quality: int = 20) -> str:
    out_dir = project.root / "output"
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{project.name}.mp4"
    render(project, str(out), encoder=encoder, quality=quality,
           ass_path=ass_path, platform=project.platform, log=log)
    return str(out)


def step_qa(project: Project, out_path: str) -> qa.Report:
    total = project.computed_duration or graph_mod.timeline_duration(project)
    text_times = (
        [float(project.title.get("in", 0.4)) + 0.8]
        if project.title.get("enabled") and project.title.get("lines") else None
    )
    black_times = None
    if project.outro.get("enabled"):
        # a moment inside the black hold, before the end card text appears
        black_times = [total + 0.3]
    return qa.verify(out_path, want_audio=True, text_times=text_times,
                     black_times=black_times)


def run(project: Project, *, encoder: str | None = None, quality: int = 20,
        do_transcribe: bool = True) -> str:
    """Run the full pipeline and return the output path."""
    log.info("probing %s", project.source_path)
    step_probe(project)

    if do_transcribe and tr.available():
        log.info("transcribing")
        step_transcribe(project, model="base")

    if not project.segments:
        log.info("detecting unconfirmed audio-transient candidates")
        try:
            candidates = step_shots(project)
            feed_changes = step_killfeed(project, candidates)
        except ModuleNotFoundError as exc:
            if exc.name in {"numpy", "scipy"}:
                raise RuntimeError(
                    "Audio analysis needs NumPy and SciPy. Install the declared "
                    "analysis dependencies with: python -m pip install -r requirements.txt"
                ) from exc
            raise
        cache = _analysis_cache_path(project, "transients", "audio-transient-v1")
        raise RuntimeError(
            f"No edit timeline was supplied. Cached {len(candidates)} unconfirmed "
            f"audio-transient candidates and {len(feed_changes)} unconfirmed "
            f"kill-feed row changes in {cache.parent}. Feed changes do not identify the "
            "POV player; add confirmed segments or a planned timeline before rendering."
        )
    log.info("using explicit timeline: %d segments (%.1fs)",
             len(project.segments), project.total_duration)

    ass_path = step_captions(project)
    log.info("rendering (encoder=%s)", encoder or "auto")
    out = step_render(project, ass_path, encoder=encoder, quality=quality)

    log.info("QA")
    report = step_qa(project, out)
    print(report.render())
    if not report.ok:
        raise RuntimeError("QA failed; see report above.")
    return out
