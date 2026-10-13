"""Fail-closed optional lyrics, on the first decoded music sample's clock.

Schema: {"schema":"lyric-track/v1", "audio_sha256":"<64 hex>",
"provenance":{"alignment_verified":true,"method":"human checked ..."},
"words":[{"text":"word","start":1.2,"end":1.5}]}.
Acceptance checks identity/structure, NOT whether the words were actually sung.
Never transcribes, converts legacy assets or independently marks them verified.
"""
from __future__ import annotations
import hashlib
import os
import shutil
from contextlib import contextmanager
import json
import math
import re
import struct
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Mapping

SCHEMA = "lyric-track/v1"
_VALIDATED = object()

# Licensed-font root. Defaults to the original Windows project path; another
# machine may set AIVE_FONTS_ROOT to its own Oswald/Bebas Neue + OFL folder.
# This only relocates the search root. Discovery still requires a bundled SIL
# OFL license per family and never substitutes, installs or downloads a font.
DEFAULT_FONTS_ROOT = os.environ.get("AIVE_FONTS_ROOT", r"E:\fonts") or r"E:\fonts"


class LyricValidationError(ValueError):
    """Lyrics stay disabled until this problem is resolved."""


def _number(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise LyricValidationError(f"{name} must be a finite number")
    value = float(value)
    if not math.isfinite(value):
        raise LyricValidationError(f"{name} must be finite")
    return value


def safe_ass_text(text: str) -> str:
    """Reject braces/backslashes/breaks instead of ambiguous libass escaping."""
    if not isinstance(text, str) or not text.strip() or len(text) > 120:
        raise LyricValidationError("text must be nonempty and at most 120 characters")
    if any(c in "{}\\" or ord(c) < 32 or 127 <= ord(c) < 160
           or c in "\u2028\u2029" for c in text):
        raise LyricValidationError("unsafe ASS text: braces, backslashes or line/control breaks")
    return text.strip()


def audio_sha256(music: str | Path) -> str:
    h = hashlib.sha256()
    with Path(music).open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def decoded_audio_duration(music: str | Path, *, ffmpeg="ffmpeg", ffprobe="ffprobe",
                           max_seconds=None, timeout=None) -> float:
    """Decode PCM at native sample rate; count frames, not container duration.

    Decoding handles codec delay/padding. Absolute lyric zero is the first
    decoded sample, not container PTS. All decode errors are fatal.
    """
    if max_seconds is not None and (type(max_seconds) not in (int,float)
            or not math.isfinite(max_seconds) or not 0 < max_seconds <= 86400):
        raise LyricValidationError("max_seconds must be finite positive <=86400")
    if timeout is not None and (type(timeout) not in (int,float)
            or not math.isfinite(timeout) or not 1 <= timeout <= 600):
        raise LyricValidationError("timeout must be finite1..600 seconds")
    probe = subprocess.run([str(ffprobe), "-v", "error", "-select_streams", "a:0",
                            "-show_entries", "stream=sample_rate", "-of", "json", str(music)],
                           capture_output=True, check=True, text=True, timeout=timeout)
    try:
        rate = int(json.loads(probe.stdout)["streams"][0]["sample_rate"])
        if rate <= 0:
            raise ValueError()
    except (ValueError, KeyError, IndexError, TypeError) as e:
        raise LyricValidationError("music has no usable audio sample rate") from e
    with tempfile.TemporaryFile() as pcm:
        args=[str(ffmpeg), "-nostdin", "-v", "error", "-xerror", "-i", str(music)]
        if max_seconds is not None:
            args += ["-t", str(max_seconds+1)]
        args += ["-map", "0:a:0", "-vn", "-ac", "1", "-ar", str(rate),
                 "-c:a", "pcm_s16le", "-f", "s16le", "pipe:1"]
        subprocess.run(args,stdout=pcm,stderr=subprocess.PIPE,check=True,timeout=timeout)
        count = pcm.tell()
    if not count or count % 2:
        raise LyricValidationError("music decoded to no complete PCM frames")
    duration=count / (2 * rate)
    if max_seconds is not None and duration > max_seconds:
        raise LyricValidationError("decoded music exceeds configured duration bound")
    return duration


@dataclass(frozen=True)
class LyricWord:
    text: str
    start: float
    end: float


@dataclass(frozen=True)
class LyricTrack:
    audio_path: Path
    audio_sha256: str
    decoded_duration: float
    words: tuple[LyricWord, ...]
    method: str
    _validation: object = field(default=None, repr=False, compare=False)


def _validate_document(document, digest, duration):
    if not isinstance(document, Mapping) or document.get("schema") != SCHEMA:
        raise LyricValidationError("missing schema lyric-track/v1; legacy lyrics remain disabled")
    supplied = document.get("audio_sha256")
    if not isinstance(supplied, str) or not re.fullmatch(r"[0-9a-fA-F]{64}", supplied):
        raise LyricValidationError("audio_sha256 is required")
    if supplied.lower() != digest:
        raise LyricValidationError("audio_sha256 does not match the actual music file")
    provenance = document.get("provenance")
    if not isinstance(provenance, Mapping) or provenance.get("alignment_verified") is not True:
        raise LyricValidationError("provenance.alignment_verified must explicitly be true")
    method = provenance.get("method")
    if not isinstance(method, str) or not method.strip():
        raise LyricValidationError("verified provenance requires a nonempty method")
    raw = document.get("words")
    if not isinstance(raw, list) or not raw:
        raise LyricValidationError("words must be a nonempty list of text/start/end objects")
    words, last_end = [], 0.0
    for i, w in enumerate(raw):
        if not isinstance(w, Mapping) or not all(k in w for k in ("text", "start", "end")):
            raise LyricValidationError(f"word {i} requires text/start/end")
        text = safe_ass_text(w["text"])
        start, end = _number(w["start"], "start"), _number(w["end"], "end")
        if start < 0 or end <= start or end - start > 15:
            raise LyricValidationError(f"word {i} requires nonnegative start and positive duration <=15s")
        if start < last_end:
            raise LyricValidationError(f"word {i} is unsorted or overlapping; resolve alignment, do not clamp")
        if end > duration:
            raise LyricValidationError(f"word {i} exceeds decoded duration {duration:.6f}s")
        words.append(LyricWord(text, start, end))
        last_end = end
    return tuple(words), method.strip()


def load_lyric_track(source: str | Path | Mapping, music: str | Path, *,
                     ffmpeg="ffmpeg", ffprobe="ffprobe", max_seconds=None, timeout=None) -> LyricTrack:
    """Require supplied verified provenance, actual hash and decoded bounds.

    All overlaps are rejected, including sustained/simultaneous lyrics.
    This does not establish that a caller's alignment assertion is truthful.
    """
    doc = source if isinstance(source, Mapping) else json.loads(Path(source).read_text(encoding="utf-8"))
    music = Path(music).resolve()
    digest = audio_sha256(music)
    options=dict(ffmpeg=ffmpeg,ffprobe=ffprobe)
    if max_seconds is not None:options["max_seconds"]=max_seconds
    if timeout is not None:options["timeout"]=timeout
    duration = decoded_audio_duration(music, **options)
    if audio_sha256(music) != digest:
        raise LyricValidationError("music changed while decoding")
    words, method = _validate_document(doc, digest, duration)
    return LyricTrack(music, digest, duration, words, method, _VALIDATED)


@dataclass(frozen=True)
class OptionalLyrics:
    track: LyricTrack | None
    reason: str | None

    @property
    def enabled(self):
        return self.track is not None


def optional_lyric_track(source, music, **kwargs) -> OptionalLyrics:
    """Return disabled plus a reason on invalid/legacy assets or decode errors."""
    try:
        return OptionalLyrics(load_lyric_track(source, music, **kwargs), None)
    except (OSError, ValueError, subprocess.SubprocessError) as e:
        return OptionalLyrics(None, str(e))


@dataclass(frozen=True)
class LicensedFont:
    family: str
    file: Path
    license_file: Path


def _font_family(file):
    data = file.read_bytes()
    tables = struct.unpack_from(">H", data, 4)[0]
    for n in range(tables):
        tag, _, offset, _ = struct.unpack_from(">4sIII", data, 12 + n * 16)
        if tag != b"name":
            continue
        _, count, strings = struct.unpack_from(">HHH", data, offset)
        names = []
        for i in range(count):
            platform, _, language, name_id, length, relative = struct.unpack_from(">HHHHHH", data, offset + 6 + 12*i)
            if name_id not in (1, 16):
                continue
            raw = data[offset + strings + relative:offset + strings + relative + length]
            value = raw.decode("utf-16-be" if platform in (0, 3) else "mac_roman")
            names.append((name_id == 16, language == 1033, value))
        if names:
            family = max(names)[2]
            if any(c in family for c in ",\r\n{}\\"):
                raise ValueError("unsafe font family")
            return family
    raise ValueError("font has no family name")


def discover_licensed_fonts(root: str | Path = DEFAULT_FONTS_ROOT) -> tuple[LicensedFont, ...]:
    """Discover local TTFs with bundled SIL OFL. Never download or fallback."""
    root, found = Path(root).resolve(), []
    for font in sorted(root.rglob("*.ttf")):
        parent = font.parent
        while parent == root or root in parent.parents:
            license_file = parent / "OFL.txt"
            if license_file.is_file() and "SIL OPEN FONT LICENSE" in license_file.read_text(encoding="utf-8", errors="replace").upper():
                try:
                    found.append(LicensedFont(_font_family(font), font, license_file))
                except (ValueError, struct.error, UnicodeError):
                    pass
                break
            if parent == root:
                break
            parent = parent.parent
    return tuple(found)


@contextmanager
def ass_fonts_directory(root: str | Path = DEFAULT_FONTS_ROOT):
    """Stage licensed fonts flat for libass, which need not recurse fontsdir.

    Use this directory during ffmpeg rendering; it is deleted on context exit.
    No installation or downloads. Original license files remain untouched.
    """
    fonts = discover_licensed_fonts(root)
    if not {"Oswald", "Bebas Neue"} <= {f.family for f in fonts}:
        raise LyricValidationError("licensed local Oswald and Bebas Neue fonts are required")
    with tempfile.TemporaryDirectory(prefix="aive-ass-fonts-") as directory:
        # Prefer static fonts over variable faces for older libass builds.
        for i, font in enumerate(fonts):
            if "VariableFont" not in font.file.name:
                shutil.copyfile(font.file, Path(directory) / f"{i}-{font.file.name}")
                shutil.copyfile(font.license_file, Path(directory) / f"{i}-OFL.txt")
        yield Path(directory)


@dataclass(frozen=True)
class LyricEvent:
    role: str
    text: str
    start: float
    end: float


def compile_excerpt(track: LyricTrack, *, music_start: float, clip_duration: float,
                    output_start: float = 0, impact_indices: Iterable[int] = (),
                    visual_impacts: Iterable[float] = (), allow_impact_collision: bool = False,
                    phrase_gap: float = .6) -> tuple[LyricEvent, ...]:
    """Map continuous music excerpt to output seconds, without touching audio.

    Partial boundary words are skipped. Only explicit original word indices
    get big typography. Entire big-word intervals must avoid +/-0.2 seconds
    around visual impacts (OUTPUT clock), unless explicitly allowed.
    """
    if not isinstance(track, LyricTrack) or track._validation is not _VALIDATED:
        raise LyricValidationError("load_lyric_track must validate provenance before rendering")
    if audio_sha256(track.audio_path) != track.audio_sha256:
        raise LyricValidationError("music changed since lyric validation")
    a, duration, out = (_number(music_start, "music_start"), _number(clip_duration, "clip_duration"),
                        _number(output_start, "output_start"))
    gap = _number(phrase_gap, "phrase_gap")
    if a < 0 or out < 0 or duration <= 0 or a + duration > track.decoded_duration or gap < 0:
        raise LyricValidationError("excerpt must fit decoded music with positive duration and nonnegative offsets/gap")
    if type(allow_impact_collision) is not bool:
        raise LyricValidationError("allow_impact_collision must be an explicit boolean")
    impacts = tuple(_number(t, "visual impact") for t in visual_impacts)
    if any(t < 0 for t in impacts):
        raise LyricValidationError("visual impacts must be nonnegative output times")
    chosen = set(impact_indices)
    if any(type(i) is not int or i < 0 or i >= len(track.words) for i in chosen):
        raise LyricValidationError("impact_indices must reference original word indices")
    events, phrase = [], []
    def flush():
        if phrase:
            events.append(LyricEvent("Phrase", " ".join(w.text for w in phrase),
                                     phrase[0].start - a + out, phrase[-1].end - a + out))
            phrase.clear()
    for i, w in enumerate(track.words):
        if w.start < a or w.end > a + duration:
            flush()
            continue
        if phrase and (w.start - phrase[-1].end > gap or len(phrase) >= 7
                       or len(" ".join(x.text for x in phrase)) + len(w.text) + 1 > 65):
            flush()
        phrase.append(w)
        start, end = w.start - a + out, w.end - a + out
        if i in chosen and (allow_impact_collision or not any(start <= t + .2 and end >= t - .2 for t in impacts)):
            events.append(LyricEvent("Impact", w.text, start, end))
    flush()
    return tuple(sorted(events, key=lambda e: (e.start, e.role)))


def _ass_time(cs):
    hours, rem = divmod(cs, 360000)
    minutes, rem = divmod(rem, 6000)
    seconds, centis = divmod(rem, 100)
    return f"{hours}:{minutes:02d}:{seconds:02d}.{centis:02d}"


def build_lyric_ass(track: LyricTrack, *, width=1920, height=1080,
                    fonts_root: str | Path = DEFAULT_FONTS_ROOT, **excerpt_options) -> str:
    """Build ASS using licensed local Oswald/Bebas Neue, no HTML.

    Use ass_fonts_directory(fonts_root) for libass fontsdir. Phrases are quiet lower
    band; selected impacts centered. No music splice, restart or stretch.
    ASS times are quantized INWARD to centiseconds, tiny events omitted.
    """
    if type(width) is not int or type(height) is not int or width < 64 or height < 64:
        raise LyricValidationError("ASS dimensions must be integers >=64")
    families = {f.family for f in discover_licensed_fonts(fonts_root)}
    if not {"Oswald", "Bebas Neue"} <= families:
        raise LyricValidationError("licensed local Oswald and Bebas Neue fonts are required")
    events = compile_excerpt(track, **excerpt_options)
    lines = []
    for e in events:
        text = safe_ass_text(e.text)
        start, end = math.ceil(e.start * 100 - 1e-9), math.floor(e.end * 100 + 1e-9)
        if end <= start:
            continue
        lines.append(f"Dialogue: 0,{_ass_time(start)},{_ass_time(end)},{e.role},,0,0,0,,{text}")
    return f"""[Script Info]
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Phrase,Oswald,{max(12, int(height*.038))},&H20EEEEEE,&H20EEEEEE,&H50000000,&H90000000,0,0,0,0,100,100,0.5,0,1,1.5,0,2,40,40,{int(height*.07)},1
Style: Impact,Bebas Neue,{max(24, int(height*.19))},&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,1,0,1,3,0,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(lines) + "\n"
