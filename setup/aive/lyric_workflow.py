"""Generic selected-music lyric preflight, never alignment or aesthetic approval.

Call prepare_lyrics BEFORE rendering the supplied encounter plan, then
apply_prepared_lyrics AFTER its renderer. No all-word caption fallback exists.
Candidates are a separate, explicitly UNVERIFIED local extraction workflow.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass
import hashlib
import json
import math
from pathlib import Path

from . import lyric_track as lyrics
from .lyric_design import compile_lyric_design
from .encounter_render import RenderConfig, _rounded, validate_plan

TRACK_BYTES = 2 * 1024 * 1024
DESIGN_BYTES = 128000


def _encoded(value, limit):
    try:
        raw = json.dumps(value, ensure_ascii=False, allow_nan=False, sort_keys=True,
                         indent=2).encode("utf-8")
    except (TypeError, ValueError) as exc:
        raise lyrics.LyricValidationError("bounded JSON-safe document required") from exc
    if len(raw) > limit:
        raise lyrics.LyricValidationError("lyric document exceeds byte bound")
    return raw


def _document(source, limit):
    if isinstance(source, dict):
        raw = _encoded(source, limit)
    else:
        with Path(source).open("rb") as handle:
            raw = handle.read(limit + 1)
        if len(raw) > limit:
            raise lyrics.LyricValidationError("lyric document exceeds byte bound")
    try:
        doc = json.loads(raw.decode("utf-8"))
    except (ValueError, UnicodeError) as exc:
        raise lyrics.LyricValidationError("UTF-8 JSON without BOM required") from exc
    if type(doc) is not dict:
        raise lyrics.LyricValidationError("lyric document must be an object")
    _encoded(doc, limit)
    return doc, raw


def _sha(raw):
    return hashlib.sha256(raw).hexdigest()


def _finite(value, name):
    if type(value) not in (int, float) or not math.isfinite(value) or value < 0:
        raise lyrics.LyricValidationError(f"finite nonnegative {name} required")
    return float(value)


@dataclass(frozen=True)
class SparseTypographyPolicy:
    """Deterministic sparse graphic words, or explicit ORIGINAL word indices.

    At most eight accents, >=0.5s silence between selected moments, and <=35%
    excerpt occupancy. Unrenderable explicit choices are rejected, not replaced.
    """
    accent_word_indices: tuple[int, ...] | None = None
    max_moments: int = 3
    min_gap: float = 1.0
    max_coverage: float = .35
    font_family: str = "Anton"
    palette: str = "ice"
    box: tuple[float, ...] = (.04, .055, .64, .16)
    size: float = .055

    def __post_init__(self):
        if type(self.max_moments) is not int or not 1 <= self.max_moments <= 8:
            raise lyrics.LyricValidationError("max_moments must be within 1..8")
        if _finite(self.min_gap, "min_gap") < .5:
            raise lyrics.LyricValidationError("sparse min_gap must be >=0.5s")
        if not .01 <= _finite(self.max_coverage, "max_coverage") <= .35:
            raise lyrics.LyricValidationError("sparse coverage must be within .01..35")
        if self.font_family not in {"Anton", "Fredoka", "Archivo Black", "Luckiest Guy",
                                    "Oswald", "Bebas Neue"}:
            raise lyrics.LyricValidationError("licensed graphic role font required; no fallback")
        if self.accent_word_indices is not None:
            indices = tuple(self.accent_word_indices)
            if not indices or len(indices) > self.max_moments or any(type(i) is not int or i < 0 for i in indices) or len(set(indices)) != len(indices):
                raise lyrics.LyricValidationError("bounded unique original accent indices required")
            object.__setattr__(self, "accent_word_indices", indices)


@dataclass(frozen=True)
class PreparedLyrics:
    song: str
    track_path: str
    design_path: str
    track_sha256: str
    design_sha256: str
    audio_sha256: str
    fonts_root: str
    protected_impacts: tuple[float, ...]
    excerpt: dict
    canvas: dict
    config: dict
    authored_design: dict | None
    audit: dict
    font_identity: tuple[dict, ...]

    def to_dict(self):
        return json.loads(_encoded(asdict(self), 4 * 1024 * 1024))


def _font_identity(root):
    fonts = lyrics.discover_licensed_fonts(root)
    static = [f for f in fonts if "VariableFont" not in f.file.name]
    if not {"Oswald", "Bebas Neue"} <= {f.family for f in static}:
        raise lyrics.LyricValidationError("licensed static Oswald and Bebas Neue required; no fallback")
    return tuple(dict(family=f.family, file=str(f.file.resolve()),
                      sha256=lyrics.audio_sha256(f.file), license=str(f.license_file.resolve()),
                      license_sha256=lyrics.audio_sha256(f.license_file)) for f in static)


def protected_output_events(plan, config):
    """Protect BOTH clocks, including candidates WITHOUT changing their status.

    Bare candidates use their source 'time' for both clocks; explicit source or
    output audio/visual clocks are additionally protected. Candidate attack
    interval boundaries are protected too. Authored v2 frame windows are retained.
    """
    impacts = []
    for row in plan["timeline"]:
        for event in row.get("events", []):
            impacts.extend(_finite(event[f"output_{kind}_event"], "event") for kind in ("audio", "visual"))
        if "anchor" in row:
            impacts.extend(row["output_start"] + _finite(row["anchor"][f"source_{kind}_event"], "anchor") - row["source_start"] for kind in ("audio", "visual"))
        candidates = row.get("candidate_events", [])
        if type(candidates) is not list or len(candidates) > 32:
            raise lyrics.LyricValidationError("bounded candidate list required")
        for candidate in candidates:
            if type(candidate) is not dict or candidate.get("confirmed") is not False:
                raise lyrics.LyricValidationError("candidates must remain explicitly unconfirmed")
            times = [_finite(candidate.get("time"), "candidate source time")]
            interval = candidate.get("attack_interval")
            if type(interval) is not list or len(interval) != 2:
                raise lyrics.LyricValidationError("candidate attack interval required")
            lo, hi = [_finite(v, "candidate interval") for v in interval]
            if not row["source_start"] <= lo <= times[0] <= hi <= row["source_end"]:
                raise lyrics.LyricValidationError("candidate interval outside source excerpt")
            times.extend([lo, hi])
            # Fill the interval, not just endpoints: compiler +/-0.2s guards
            # must cover sustained/burst uncertainty without unprotected holes.
            if math.ceil((hi-lo)/.2) > 4096:
                raise lyrics.LyricValidationError("candidate protected interval exceeds bound")
            times.extend(lo + step*.2 for step in range(1, math.ceil((hi-lo)/.2)))
            for kind in ("audio", "visual"):
                key = f"source_{kind}_event"
                if key in candidate:
                    times.append(_finite(candidate[key], key))
                key = f"output_{kind}_event"
                if key in candidate:
                    t = _finite(candidate[key], key)
                    if not row["output_start"] <= t <= row["output_end"]:
                        raise lyrics.LyricValidationError("candidate output clock outside clip")
                    impacts.append(t)
            for t in times:
                if not row["source_start"] <= t <= row["source_end"]:
                    raise lyrics.LyricValidationError("candidate source clock outside clip")
                impacts.append(row["output_start"] + t - row["source_start"])
            if len(set(impacts)) > 4096:
                raise lyrics.LyricValidationError("protected impacts exceed design bound")
    for impact in plan.get("authored_design", {}).get("impacts", []):
        t = _finite(impact["output_time"], "authored impact")
        # Frame window + .2s compiler guard covers the full authored impact.
        center, n = _rounded(t, config.fps), impact["frames"]
        impacts.extend([t, (center-(n-1)//2)/config.fps,
                        (center-(n-1)//2+n-1)/config.fps])
    if len(set(impacts)) > 4096:
        raise lyrics.LyricValidationError("protected impacts exceed design bound")
    return tuple(sorted(set(impacts)))


def _generated_design(track, excerpt, canvas, impacts, policy):
    start = excerpt["music_start_sample"] / excerpt["sample_rate"]
    duration = excerpt["sample_count"] / excerpt["sample_rate"]
    complete = [i for i, w in enumerate(track.words) if w.start >= start and w.end <= start+duration
                and math.ceil((w.start-start)*100) < math.floor((w.end-start)*100)]
    def safe(i):
        w = track.words[i]
        return not any(w.start-start <= t+.2 and w.end-start >= t-.2 for t in impacts)
    explicit = policy.accent_word_indices is not None
    candidates = list(policy.accent_word_indices) if explicit else sorted(complete, key=lambda i: (-(track.words[i].end-track.words[i].start), i))
    selected, occupied = [], 0.0
    for i in candidates:
        if i not in complete or not safe(i):
            if explicit:
                raise lyrics.LyricValidationError("explicit accent is partial, invalid or collides with protected event")
            continue
        w = track.words[i]
        gap_ok = all(w.start >= track.words[j].end+policy.min_gap or track.words[j].start >= w.end+policy.min_gap for j in selected)
        if not gap_ok or occupied+w.end-w.start > duration*policy.max_coverage:
            if explicit:
                raise lyrics.LyricValidationError("explicit accents exceed sparse occupancy/gap budget")
            continue
        selected.append(i)
        occupied += w.end-w.start
        if len(selected) >= policy.max_moments:
            break
    if not selected:
        raise lyrics.LyricValidationError("no complete safe sparse lyric moments; no caption fallback")
    moments = [dict(id=f"accent-{i}", word_indices=[i], role="giant_word", font_family=policy.font_family,
                    palette=policy.palette, box=list(policy.box), size=policy.size, opacity=.8,
                    animation=dict(entrance_ms=0, exit_ms=0, from_scale=1, echo_offset=[0, 0], glow=0)) for i in sorted(selected)]
    return dict(schema="lyric-design/v1", enabled=True,
                source=dict(music_source=str(track.audio_path.resolve()), audio_sha256=track.audio_sha256),
                excerpt=excerpt, canvas=canvas, moments=moments, visual_impacts=list(impacts),
                allow_impact_collision=False, allow_protected_overlap=False, protected_zones=[])


def prepare_lyrics(song, plan, config, job, lyric_track, lyric_design=None, *, policy=None, fonts_root=r"E:\fonts"):
    """Validate exact music/plan, compile selective graphics, snapshot BEFORE video.

    Inputs may be JSON paths or dicts. Original files are never overwritten.
    A failed preflight raises and never enables optional fallback rendering.
    """
    config = RenderConfig(**config) if isinstance(config, dict) else config
    if not isinstance(config, RenderConfig):
        raise lyrics.LyricValidationError("RenderConfig required")
    validate_plan(plan, config)
    song = str(Path(song).resolve())
    from .music_lyrics import AUDIO_EXTENSIONS
    if Path(song).suffix.lower() not in AUDIO_EXTENSIONS:
        raise lyrics.LyricValidationError("explicit audio-only selected song required, not gameplay/video")
    track_doc, track_raw = _document(lyric_track, TRACK_BYTES)
    if type(track_doc.get("words")) is not list or len(track_doc["words"]) > 6000:
        raise lyrics.LyricValidationError("bounded verified words required")
    digest = lyrics.audio_sha256(song)
    lyrics._validate_document(track_doc, digest, config.max_source_duration)
    track = lyrics.load_lyric_track(track_doc, song, ffmpeg=config.ffmpeg, ffprobe=config.ffprobe,
                                   max_seconds=config.max_source_duration, timeout=config.timeout)
    if track.decoded_duration > config.max_source_duration:
        raise lyrics.LyricValidationError("selected music exceeds configured decoded bound")
    excerpt = dict(music_start_sample=_rounded(plan["music_start"], config.sample_rate),
                   sample_rate=config.sample_rate, sample_count=round(plan["duration"]*config.sample_rate), output_start=0)
    canvas = dict(width=config.width, height=config.height, mode="gameplay")
    impacts = protected_output_events(plan, config)
    fonts_root = str(Path(fonts_root).resolve())
    font_identity = _font_identity(fonts_root)
    if lyric_design is None:
        policy = SparseTypographyPolicy() if policy is None else policy
        if not isinstance(policy, SparseTypographyPolicy):
            raise lyrics.LyricValidationError("SparseTypographyPolicy required")
        design_doc = _generated_design(track, excerpt, canvas, impacts, policy)
        design_raw = _encoded(design_doc, DESIGN_BYTES)
    else:
        design_doc, design_raw = _document(lyric_design, DESIGN_BYTES)
    if (design_doc.get("source") != dict(music_source=song, audio_sha256=digest)
            or design_doc.get("excerpt") != excerpt or design_doc.get("canvas") != canvas):
        raise lyrics.LyricValidationError("design must match selected song, excerpt and canvas")
    if design_doc.get("allow_impact_collision") is not False or design_doc.get("allow_protected_overlap") is not False:
        raise lyrics.LyricValidationError("protected gameplay/event guards required")
    supplied = design_doc.get("visual_impacts")
    if type(supplied) is not list or any(not any(abs(t-_finite(v, "design impact")) < 1e-7 for v in supplied) for t in impacts):
        raise lyrics.LyricValidationError("design omits confirmed/candidate audio/visual protection")
    designed = compile_lyric_design(track, design_doc, fonts_root=fonts_root)
    if "Dialogue:" not in designed.ass:
        raise lyrics.LyricValidationError("no complete safe representable lyric dialogue; no fallback")
    if lyrics.audio_sha256(song) != digest or _font_identity(fonts_root) != font_identity:
        raise lyrics.LyricValidationError("music/fonts changed during preflight")
    root = Path(job).resolve()
    root.mkdir(parents=True, exist_ok=True)
    for i in range(1, 10000):
        directory = root / f"lyrics-prepared-v{i:04d}"
        try:
            directory.mkdir()
            break
        except FileExistsError:
            continue
    else:
        raise lyrics.LyricValidationError("prepared lyric job limit reached")
    track_path, design_path = directory / "verified-track.json", directory / "lyric-design.json"
    track_path.write_bytes(track_raw)
    design_path.write_bytes(design_raw)
    audit = dict(status="pass", generated=lyric_design is None, design=designed.audit,
                 protected_output_events=list(impacts), plan_sha256=_sha(_encoded(plan, 4*1024*1024)),
                 perceptual_approval=False, alignment_verification="supplied assertion only")
    prepared = PreparedLyrics(song, str(track_path), str(design_path), _sha(track_raw), _sha(design_raw), digest,
                              fonts_root, impacts, excerpt, canvas, asdict(config),
                              json.loads(json.dumps(plan.get("authored_design"))), audit, font_identity)
    (directory / "preflight.json").write_bytes(_encoded(prepared.to_dict(), 4*1024*1024))
    return prepared


def apply_prepared_lyrics(manifest, prepared):
    """Bind a rendered manifest to successful preflight; stream-copy mixed audio.

    Existing encounter_text owns the video burn, immutable original check and
    exact CFR validation. No music/game stem regeneration or silent fallback.
    """
    if not isinstance(prepared, PreparedLyrics):
        raise lyrics.LyricValidationError("PreparedLyrics required")
    if not isinstance(manifest, dict) or manifest.get("schema_version") != "encounter-render/v1":
        raise lyrics.LyricValidationError("encounter-render/v1 manifest required")
    if (str(Path(manifest.get("music_source", "")).resolve()) != prepared.song
            or manifest.get("config") != prepared.config
            or manifest.get("music_start_sample") != prepared.excerpt["music_start_sample"]
            or round(_finite(manifest.get("plan_duration"), "plan duration")*prepared.excerpt["sample_rate"]) != prepared.excerpt["sample_count"]
            or manifest.get("authored_design") != prepared.authored_design):
        raise lyrics.LyricValidationError("rendered song/config/excerpt/authored design differs from preflight")
    for file, digest in ((prepared.track_path, prepared.track_sha256), (prepared.design_path, prepared.design_sha256), (prepared.song, prepared.audio_sha256)):
        if lyrics.audio_sha256(file) != digest:
            raise lyrics.LyricValidationError("prepared snapshot or selected music changed")
    if _font_identity(prepared.fonts_root) != prepared.font_identity:
        raise lyrics.LyricValidationError("licensed font identity changed since preflight")
    required = []
    for chunk in manifest.get("chunks", []):
        for event in chunk.get("events", []):
            required.extend(event[f"output_{kind}_event"] for kind in ("audio", "visual") if f"output_{kind}_event" in event)
        required.extend(i["output_time"] for i in chunk.get("authored_impacts", []))
    if any(not any(abs(_finite(t, "rendered impact")-v) < 1e-7 for v in prepared.protected_impacts) for t in required):
        raise lyrics.LyricValidationError("render contains unprotected event absent from preflight")
    from .encounter_text import apply_verified_lyrics
    return apply_verified_lyrics(manifest, prepared.track_path, prepared.song, design_path=prepared.design_path,
                                 visual_impacts=prepared.protected_impacts, fonts_root=prepared.fonts_root)


def extract_lyric_candidates(song, job, **kwargs):
    """Snapshot LOCAL music-only candidates, keeping UNVERIFIED provenance.

    This does NOT return a PreparedLyrics or a verified track. Optional provider
    absence raises without installing/downloading or rendering lyric-free output.
    """
    from .music_lyrics import extract_music_lyric_candidates, MAX_RESULT_BYTES
    doc = extract_music_lyric_candidates(song, source_kind="music", **kwargs)
    if doc.get("status") != "UNVERIFIED" or doc.get("provenance", {}).get("alignment_verified") is not False:
        raise lyrics.LyricValidationError("candidate extraction must remain UNVERIFIED")
    raw = _encoded(doc, MAX_RESULT_BYTES)
    root = Path(job).resolve()
    root.mkdir(parents=True, exist_ok=True)
    target = root / "music-lyric-candidates.json"
    with target.open("xb") as handle:
        handle.write(raw)
    return dict(document=doc, snapshot_path=str(target), sha256=_sha(raw), status="UNVERIFIED")
