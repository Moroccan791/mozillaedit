"""Explicit verified lyric post-process. Never called by the renderer by default.

The lyric metadata is a caller assertion, not evidence the words were sung.
All original media/stems/manifests remain untouched, including on failure.
"""
from __future__ import annotations

import copy
import hashlib
from fractions import Fraction
import json
import math
from pathlib import Path
import re
import shutil

from . import lyric_track as lyrics
from .encounter_render import RenderConfig, RenderError, _json, _path, _probe, _run

__all__ = ["apply_verified_lyrics"]


def _finite(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not -1e15 <= value <= 1e15 or not math.isfinite(value):
        raise lyrics.LyricValidationError(f"invalid {name}")
    return float(value)


def _graph_path(path):
    # No shell is involved. This whitelist deliberately rejects graph syntax,
    # quotes, backslashes and controls rather than accepting ambiguous escaping.
    # Windows drive colons still need escaping at the AVOption parsing layer.
    value = Path(path).resolve().as_posix()
    if not re.fullmatch(r"[A-Za-z0-9_:/ .-]+", value):
        raise lyrics.LyricValidationError("unsafe FFmpeg graph path")
    return "'" + value.replace(":", r"\:") + "'"


def _new_text_job(root):
    for n in range(1, 100000):
        child = root / f"text-v{n:04d}"
        try:
            child.mkdir()
            return child
        except FileExistsError:
            pass
    raise FileExistsError("no free text version")


def _video_signature(meta):
    try:
        videos = [s for s in meta["streams"] if s.get("codec_type") == "video"]
        if len(videos) != 1:
            raise ValueError()
        s = videos[0]
        count = int(s["nb_frames"])
        fps = Fraction(s["avg_frame_rate"])
        rate = Fraction(s["r_frame_rate"])
        duration = Fraction(s["duration_ts"]) * Fraction(s["time_base"])
        if count <= 0 or fps <= 0 or fps != rate or duration != Fraction(count, 1) / fps:
            raise ValueError()
        if abs(float(s.get("start_time", 0))) > 1e-7:
            raise ValueError()
        return count, fps, duration, int(s["width"]), int(s["height"])
    except (KeyError, TypeError, ValueError, ZeroDivisionError) as exc:
        raise RenderError("expected exact zero-origin CFR video with frame/duration metadata") from exc


def _load_logged_track(doc, music, digest, job, config):
    meta, _ = _probe(music, job, "probe-music", config)
    streams = [s for s in meta["streams"] if s.get("codec_type") == "audio"]
    if not streams:
        raise lyrics.LyricValidationError("music has no audio")
    rate = int(streams[0]["sample_rate"])
    if not 8000 <= rate <= 192000:
        raise lyrics.LyricValidationError("music sample rate outside bounded range")
    pcm = job / "verified-music.s16le"
    _run([config.ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin", "-n", "-xerror",
          "-threads", "1", "-i", str(music), "-t", str(config.max_source_duration + 1),
          "-map", "0:a:0", "-vn", "-ac", "1", "-ar", str(rate), "-c:a", "pcm_s16le",
          "-f", "s16le", str(pcm)], job, "decode-music", config.timeout)
    size = pcm.stat().st_size
    duration = size / (2 * rate)
    if not size or size % 2 or duration > config.max_source_duration:
        raise lyrics.LyricValidationError("decoded music exceeds bounds or has no complete frames")
    if lyrics.audio_sha256(music) != digest:
        raise lyrics.LyricValidationError("music changed during validation")
    words, method = lyrics._validate_document(doc, digest, duration)
    # Use the SAME validator/token as lyric_track, with bounded, logged decoding.
    return lyrics.LyricTrack(music, digest, duration, words, method, lyrics._VALIDATED)


def apply_verified_lyrics(manifest, track_path, music, *, design_path=None, visual_impacts=(),
                          fonts_root=r"E:\fonts"):
    """Return a deep-copied encounter-render/v1 manifest with a new text output.

    Raises LyricValidationError/ValueError/RenderError, never enables missing or
    unverified lyrics. Metadata/hash/text/time checks precede any subprocess;
    decoded duration checks precede the burn. Original mixed audio is stream
    copied, not regenerated from music. A text-vNNNN child retains ASS, licensed
    fonts, exact command logs, validation PCM and a new manifest. No fallback,
    frame-rate filter, -r, -t, -shortest or frame cap on the video burn.
    """
    if not isinstance(manifest, dict) or manifest.get("schema_version") != "encounter-render/v1":
        raise lyrics.LyricValidationError("expected encounter-render/v1 manifest")
    config = RenderConfig(**manifest["config"])
    config.validate()
    job_root = Path(_path(manifest["job_dir"], "job_dir"))
    original = Path(_path(manifest["output"], "output"))
    music = Path(_path(str(music), "music"))
    if not job_root.is_dir() or not original.is_file() or job_root not in original.parents:
        raise lyrics.LyricValidationError("original output must exist inside its render job")
    if Path(_path(manifest["music_source"], "music_source")) != music:
        raise lyrics.LyricValidationError("music does not match manifest music_source")
    _graph_path(job_root)  # reject unsafe graph paths before any child/subprocess
    if type(manifest.get("frame_count")) is not int or manifest["frame_count"] <= 0:
        raise lyrics.LyricValidationError("invalid manifest frame_count")
    duration = _finite(manifest["video_duration"], "video_duration")
    excerpt = _finite(manifest["plan_duration"], "plan_duration")
    if not 0 < duration <= config.max_duration or duration != manifest["frame_count"] / config.fps:
        raise lyrics.LyricValidationError("inconsistent manifest video duration")
    if not 0 < excerpt <= config.max_duration or abs(excerpt - duration) > .5 / config.fps + 1e-7:
        raise lyrics.LyricValidationError("inconsistent manifest excerpt")
    first = manifest.get("music_start_sample")
    if type(first) is not int or first < 0:
        raise lyrics.LyricValidationError("invalid music_start_sample")
    start = first / config.sample_rate
    if start + excerpt > config.max_source_duration:
        raise lyrics.LyricValidationError("excerpt exceeds configured music bounds")
    if track_path is None:
        raise lyrics.LyricValidationError("verified lyric track is required")
    track_path = Path(track_path).resolve()
    track_bytes = track_path.read_bytes()
    track_digest = hashlib.sha256(track_bytes).hexdigest()
    doc = json.loads(track_bytes.decode("utf-8"))
    digest = lyrics.audio_sha256(music)
    lyrics._validate_document(doc, digest, config.max_source_duration)
    design_doc, design_digest = None, None
    if design_path is not None:
        design_path = Path(design_path).resolve()
        design_bytes = design_path.read_bytes()
        design_digest = hashlib.sha256(design_bytes).hexdigest()
        design_doc = json.loads(design_bytes.decode("utf-8"))
        # Bind design to exact rendered song clock and canvas before subprocess.
        if not isinstance(design_doc, dict):
            raise lyrics.LyricValidationError("lyric design must be an object")
        expected_source = dict(music_source=str(music), audio_sha256=digest)
        expected_excerpt = dict(music_start_sample=first, sample_rate=config.sample_rate,
                                sample_count=round(excerpt*config.sample_rate), output_start=0)
        expected_canvas = dict(width=config.width, height=config.height, mode="gameplay")
        if (design_doc.get("source") != expected_source or design_doc.get("excerpt") != expected_excerpt
                or design_doc.get("canvas") != expected_canvas):
            raise lyrics.LyricValidationError("lyric design must match manifest song, excerpt and gameplay canvas")
        required_impacts = list(visual_impacts)
        for chunk in manifest.get("chunks", []):
            for event in chunk.get("events", []):
                if "output_visual_event" in event:
                    required_impacts.append(event["output_visual_event"])
        supplied_impacts = design_doc.get("visual_impacts")
        if not isinstance(supplied_impacts, list):
            raise lyrics.LyricValidationError("lyric design requires explicit visual impacts")
        for impact in required_impacts:
            impact = _finite(impact, "visual impact")
            if not any(abs(impact-_finite(t,"design visual impact")) < 1e-7 for t in supplied_impacts):
                raise lyrics.LyricValidationError("lyric design omits known gameplay impact protection")
    if not {"Oswald", "Bebas Neue"} <= {f.family for f in lyrics.discover_licensed_fonts(fonts_root)}:
        raise lyrics.LyricValidationError("licensed local Oswald and Bebas Neue fonts are required")
    result = copy.deepcopy(manifest)
    job = _new_text_job(job_root)
    track = _load_logged_track(doc, music, digest, job, config)
    design_audit = None
    if design_doc is None:
        ass = lyrics.build_lyric_ass(track, width=config.width, height=config.height,
                                     music_start=start, clip_duration=excerpt)
    else:
        from .lyric_design import compile_lyric_design
        designed = compile_lyric_design(track, design_doc, fonts_root=fonts_root)
        ass, design_audit = designed.ass, designed.audit
        if lyrics.audio_sha256(design_path) != design_digest:
            raise lyrics.LyricValidationError("lyric design changed during validation")
        _json(job / "lyric-design.json", design_doc)
        _json(job / "lyric-design-audit.json", design_audit)
    if "Dialogue:" not in ass:
        raise lyrics.LyricValidationError("no complete, representable verified words in excerpt")
    if lyrics.audio_sha256(track_path) != track_digest:
        raise lyrics.LyricValidationError("lyric track changed during validation")
    _json(job / "verified-track.json", doc)
    source_meta, _ = _probe(original, job, "probe-original", config)
    signature = _video_signature(source_meta)
    expected = (manifest["frame_count"], Fraction(config.fps), Fraction(manifest["frame_count"], config.fps),
                config.width, config.height)
    if signature != expected or not any(s.get("codec_type") == "audio" for s in source_meta["streams"]):
        raise RenderError("original output does not match manifest canvas/frame clock or lacks audio")
    original_hash = lyrics.audio_sha256(original)
    ass_path, fonts_dir = job / "lyrics.ass", job / "fonts"
    ass_path.write_text(ass, encoding="utf-8")
    fonts_dir.mkdir()
    font_audit = []
    with lyrics.ass_fonts_directory(fonts_root) as staged:
        for i, f in enumerate(sorted(staged.iterdir())):
            dest = fonts_dir / f"font-{i:04d}{f.suffix.lower()}"
            shutil.copyfile(f, dest)
    for f in lyrics.discover_licensed_fonts(fonts_root):
        font_audit.append({"family": f.family, "file": str(f.file), "license": str(f.license_file)})
    graph = job / "lyrics.filter.txt"
    graph.write_text(f"[0:v:0]ass=filename={_graph_path(ass_path)}:fontsdir={_graph_path(fonts_dir)}[text]", encoding="utf-8")
    output = job / "encounters-text.mp4"
    codec = (["-c:v", "libx264", "-preset", config.preset, "-crf", str(config.quality)]
             if config.encoder == "libx264" else ["-c:v", "h264_qsv", "-global_quality", str(config.quality)])
    _run([config.ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin", "-n", "-threads", "1",
          "-copyts", "-i", str(original), "-filter_complex_threads", "1", "-/filter_complex", str(graph),
          "-map", "[text]", "-map", "0:a", "-fps_mode", "passthrough", "-pix_fmt", "yuv420p"] + codec +
         ["-c:a", "copy", "-movflags", "+faststart", str(output)], job, "burn-lyrics", config.timeout)
    final_meta, _ = _probe(output, job, "probe-text", config)
    if _video_signature(final_meta) != signature:
        raise RenderError("text burn changed exact video frame count/fps/duration/canvas")
    if lyrics.audio_sha256(original) != original_hash or lyrics.audio_sha256(music) != digest:
        raise RenderError("original output or music changed during text burn")
    result.update(output=str(output), output_metadata=final_meta, manifest_path=str(job / "render-manifest.json"))
    result["typography_audit"] = {
        "schema": "encounter-text/v1", "enabled": True, "original_output": str(original),
        "original_output_sha256": original_hash, "ass_path": str(ass_path), "graph_path": str(graph),
        "track_path": str(Path(track_path).resolve()), "track_sha256": track_digest,
        "audio_sha256": digest, "provenance": copy.deepcopy(doc["provenance"]),
        "music_start": start, "excerpt_duration": excerpt, "fonts": font_audit,
        "audio_mode": "copy", "frame_count": signature[0], "fps": str(signature[1]),
        "video_duration": float(signature[2]), "roles": (["Phrase"] if design_audit is None else
            sorted({m["role"] for m in design_doc["moments"]})),
        "design_path": str(design_path) if design_path is not None else None,
        "design_sha256": design_digest, "design_audit": design_audit,
        "limitations": ["Lyric metadata alignment verification is a supplied assertion, not truth or independent listening verification.",
                        "Manifest music_source linkage is supplied metadata, not independent proof of the mixed audio provenance.",
                        "Partial boundary words omitted; ASS times quantized inward to centiseconds.",
                        "Video is re-encoded for text; original mixed audio is stream copied; no aesthetic certification."]}
    _json(Path(result["manifest_path"]), result)
    return result

