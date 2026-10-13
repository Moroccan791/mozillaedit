"""Explicit lyric-design/v1 compiler, never a transcription or caption stream.

Input is ONLY an already validated LyricTrack plus a strict JSON design.
Music lineage is supplied metadata checked against the track, not evidence of
sung-word truth or the provenance of an eventual mixed video's audio.
No renderer integration, raw footage input, subprocess, font installation or download.
"""
from __future__ import annotations

import copy
from decimal import Decimal, ROUND_CEILING, ROUND_FLOOR
import json
import math
from pathlib import Path
import re
import struct
from dataclasses import dataclass

from . import lyric_track as lyrics

SCHEMA = "lyric-design/v1"
ROLES = {"giant_word", "accent_echo", "quiet_italic", "quiet_serif"}
PALETTES = {"ice": ("D6FFFF", "48D9DF"), "violet": ("F3E8FF", "A985FF"),
            "paper": ("F2EFE8", "C9C1B5"), "maroon": ("800000", "B03060"),
            "red": ("FF0000", "FF6060")}
COLOR_NAMES = {"maroon": "800000", "red": "FF0000", "white": "FFFFFF",
               "black": "000000", "purple": "800080", "blue": "0000FF",
               "green": "008000", "yellow": "FFFF00", "pink": "FFC0CB",
               "cyan": "00FFFF", "orange": "FFA500", "gold": "FFD700"}
# Normalized conservative gameplay zones: aiming/enemy region, kill feed,
# bottom weapon/HUD. Callers can add boxes, never silently remove these.
GAMEPLAY_ZONES = ((.30, .25, .40, .50), (.74, 0, .26, .25), (0, .82, 1, .18))
SERIF_FAMILIES = {"Libre Baskerville", "Cormorant Garamond", "Lora", "Source Serif 4", "Noto Serif",
                  "Tinos"}
# Reference-matched graphic faces (see aside1 style study): Anton = heavy condensed
# impact caps, Fredoka/Luckiest Guy = rounded lyrical words, Archivo Black = wide
# outlined display. Bebas Neue/Oswald remain permitted for older designs.
DISPLAY_FAMILIES = {"Anton", "Fredoka", "Archivo Black", "Luckiest Guy",
                    "Bebas Neue", "Oswald"}


class LyricDesignError(lyrics.LyricValidationError):
    pass


def normalize_lyric_color(value):
    """Accept a named shade or exact #RRGGBB; never accept ASS/CSS code."""
    if type(value) is not str or len(value) > 32:
        raise LyricDesignError("color must be a name or #RRGGBB hex code")
    value = value.strip()
    if value.lower() in COLOR_NAMES:
        return COLOR_NAMES[value.lower()]
    if re.fullmatch(r"#?[0-9A-Fa-f]{6}", value):
        return value.lstrip("#").upper()
    raise LyricDesignError("unknown color; use an exact #RRGGBB hex code")


def _palette_colors(palette):
    if type(palette) is str:
        if palette not in PALETTES:
            raise LyricDesignError("unknown bounded palette")
        return PALETTES[palette]
    _keys(palette, {"primary", "accent"}, "custom palette")
    return normalize_lyric_color(palette["primary"]), normalize_lyric_color(palette["accent"])


def with_lyric_colors(document, color, *, glow_color=None, moment_ids=None):
    """Copy an explicit design with local color overrides; no AI or audio changes.

    Applies to every authored moment by default, or explicit moment ids.
    Default glow/echo matches fill. Full track/design validation still happens
    at compile time. Colors do not change timing, positions or safety guards.
    """
    primary = normalize_lyric_color(color)
    accent = normalize_lyric_color(color if glow_color is None else glow_color)
    if type(document) is not dict or document.get("schema") != SCHEMA:
        raise LyricDesignError("lyric-design/v1 required")
    moments = document.get("moments")
    if type(moments) is not list or not 1 <= len(moments) <= 64:
        raise LyricDesignError("bounded authored moments required")
    ids = []
    for moment in moments:
        if type(moment) is not dict or type(moment.get("id")) is not str:
            raise LyricDesignError("moment ids required")
        ids.append(moment["id"])
    if len(set(ids)) != len(ids):
        raise LyricDesignError("unique moment ids required")
    if moment_ids is not None:
        if type(moment_ids) not in (list, tuple) or not moment_ids or any(type(i) is not str for i in moment_ids):
            raise LyricDesignError("explicit nonempty moment ids required")
        if len(set(moment_ids)) != len(moment_ids) or not set(moment_ids) <= set(ids):
            raise LyricDesignError("unknown or duplicate moment id")
    selected = set(ids if moment_ids is None else moment_ids)
    result = copy.deepcopy(document)
    for moment in result["moments"]:
        if moment["id"] in selected:
            moment["palette"] = dict(primary="#"+primary, accent="#"+accent)
    return result


def _keys(obj, expected, name):
    if type(obj) is not dict or set(obj) != set(expected):
        raise LyricDesignError(f"{name} requires exactly {sorted(expected)}")


def _num(value, lo, hi, name):
    if type(value) not in (int, float) or not lo <= value <= hi or not math.isfinite(value):
        raise LyricDesignError(f"{name} must be finite in [{lo}, {hi}]")
    return float(value)


def _int(value, lo, hi, name):
    if type(value) is not int or not lo <= value <= hi:
        raise LyricDesignError(f"{name} must be an integer in [{lo}, {hi}]")
    return value


def _bool(value, name):
    if type(value) is not bool:
        raise LyricDesignError(f"{name} must be explicit boolean")
    return value


def _box(value):
    if type(value) is not list or len(value) != 4:
        raise LyricDesignError("box requires [x,y,width,height]")
    x, y, w, h = [_num(n, 0, 1, "box coordinate") for n in value]
    if w <= 0 or h <= 0 or x + w > 1 or y + h > 1:
        raise LyricDesignError("box must be positive and wholly inside canvas")
    return x, y, w, h


def _intersects(a, b):
    return a[0] < b[0]+b[2] and b[0] < a[0]+a[2] and a[1] < b[1]+b[3] and b[1] < a[1]+a[3]


def _font_metrics(font, text):
    """Read bundled TTF metrics; reject missing glyphs rather than font fallback.

    Conservative global ink bounds include overhang; this is not a pixel proof.
    No dependency on PIL, fontconfig or system-installed fonts.
    """
    data = font.file.read_bytes()
    tables = {}
    for i in range(struct.unpack_from(">H", data, 4)[0]):
        tag, _, offset, length = struct.unpack_from(">4sIII", data, 12+i*16)
        tables[tag] = data[offset:offset+length]
    head, hhea, cmap, hmtx = [tables[k] for k in (b"head", b"hhea", b"cmap", b"hmtx")]
    units = struct.unpack_from(">H", head, 18)[0]
    xmin, ymin, xmax, ymax = struct.unpack_from(">hhhh", head, 36)
    count = struct.unpack_from(">H", hhea, 34)[0]
    subtables = []
    for i in range(struct.unpack_from(">H", cmap, 2)[0]):
        platform, encoding, offset = struct.unpack_from(">HHI", cmap, 4+i*8)
        fmt = struct.unpack_from(">H", cmap, offset)[0]
        if platform in (0, 3) and fmt in (4, 12):
            subtables.append((fmt, offset))
    def glyph(code):
        for fmt, off in sorted(subtables, reverse=True):
            if fmt == 12:
                groups = struct.unpack_from(">I", cmap, off+12)[0]
                for i in range(groups):
                    a, b, first = struct.unpack_from(">III", cmap, off+16+i*12)
                    if a <= code <= b:
                        return first+code-a
            elif code <= 65535:
                n = struct.unpack_from(">H", cmap, off+6)[0] // 2
                ends, starts, deltas, ranges = off+14, off+16+2*n, off+16+4*n, off+16+6*n
                for i in range(n):
                    a = struct.unpack_from(">H", cmap, starts+2*i)[0]
                    b = struct.unpack_from(">H", cmap, ends+2*i)[0]
                    if a <= code <= b:
                        delta = struct.unpack_from(">h", cmap, deltas+2*i)[0]
                        relative = struct.unpack_from(">H", cmap, ranges+2*i)[0]
                        if not relative:
                            return (code+delta) & 65535
                        g = struct.unpack_from(">H", cmap, ranges+2*i+relative+2*(code-a))[0]
                        return (g+delta) & 65535 if g else 0
        return 0
    advance = 0
    for c in text:
        g = glyph(ord(c))
        if not g:
            raise LyricDesignError(f"selected font has no glyph for U+{ord(c):04X}")
        advance += struct.unpack_from(">H", hmtx, min(g, count-1)*4)[0]
    return (advance + max(0, -xmin) + max(0, xmax-units))/units, (ymax-ymin)/units


@dataclass(frozen=True)
class DesignedLyrics:
    ass: str
    audit: dict


def compile_lyric_design(track: lyrics.LyricTrack, document: dict, *,
                         fonts_root: str | Path = r"E:\fonts") -> DesignedLyrics:
    """Select authored moments only. Return ASS plus JSON-safe lineage/audit.

    Excerpt is continuous selected-music decoded sample-zero clock. No retiming,
    word fabrication, audio handling or automatic phrase generation. A moment
    containing ANY clipped boundary word is omitted, never clamped/substituted.
    Times quantize inward to ASS centiseconds. Role lifetimes never expand.
    """
    if not isinstance(track, lyrics.LyricTrack) or track._validation is not lyrics._VALIDATED:
        raise LyricDesignError("load_lyric_track must validate music lyrics first")
    if lyrics.audio_sha256(track.audio_path) != track.audio_sha256:
        raise LyricDesignError("selected music changed since validation")
    try:
        encoded = json.dumps(document, allow_nan=False, ensure_ascii=False)
    except (TypeError, ValueError) as exc:
        raise LyricDesignError("design must be JSON-safe") from exc
    if len(encoded) > 128000:
        raise LyricDesignError("design exceeds 128000 characters")
    _keys(document, {"schema", "enabled", "source", "excerpt", "canvas", "moments", "visual_impacts", "allow_impact_collision", "allow_protected_overlap", "protected_zones"}, "design")
    if document["schema"] != SCHEMA or document["enabled"] is not True:
        raise LyricDesignError("explicit enabled=true and lyric-design/v1 required")
    source = document["source"]
    _keys(source, {"music_source", "audio_sha256"}, "source")
    if type(source["music_source"]) is not str or not 1 <= len(source["music_source"]) <= 4096 or any(ord(c)<32 for c in source["music_source"]):
        raise LyricDesignError("invalid selected music path")
    if Path(source["music_source"]).resolve() != track.audio_path.resolve() or source["audio_sha256"] != track.audio_sha256:
        raise LyricDesignError("source must match validated selected music lineage")
    excerpt = document["excerpt"]
    _keys(excerpt, {"music_start_sample", "sample_rate", "sample_count", "output_start"}, "excerpt")
    rate = _int(excerpt["sample_rate"], 8000, 192000, "sample_rate")
    first = _int(excerpt["music_start_sample"], 0, 2**53-1, "music_start_sample")
    count = _int(excerpt["sample_count"], 1, rate*300, "sample_count")
    out = _num(excerpt["output_start"], 0, 86400, "output_start")
    start, duration = first/rate, count/rate
    if start+duration > track.decoded_duration:
        raise LyricDesignError("excerpt exceeds decoded selected music")
    canvas = document["canvas"]
    _keys(canvas, {"width", "height", "mode"}, "canvas")
    width = _int(canvas["width"], 320, 7680, "width")
    height = _int(canvas["height"], 180, 4320, "height")
    if canvas["mode"] not in ("gameplay", "diagnostic"):
        raise LyricDesignError("canvas mode must be gameplay or diagnostic")
    allow_collision = _bool(document["allow_impact_collision"], "allow_impact_collision")
    allow_overlap = _bool(document["allow_protected_overlap"], "allow_protected_overlap")
    if type(document["visual_impacts"]) is not list or len(document["visual_impacts"]) > 4096:
        raise LyricDesignError("visual_impacts must be bounded output-clock list")
    impacts = [_num(t, 0, 86400, "visual impact") for t in document["visual_impacts"]]
    if type(document["protected_zones"]) is not list or len(document["protected_zones"]) > 32:
        raise LyricDesignError("protected_zones must be bounded list")
    zones = (list(GAMEPLAY_ZONES) if canvas["mode"] == "gameplay" else []) + [_box(b) for b in document["protected_zones"]]
    moments = document["moments"]
    if type(moments) is not list or not 1 <= len(moments) <= 64:
        raise LyricDesignError("1..64 explicitly selected moments required")
    fonts = lyrics.discover_licensed_fonts(fonts_root)
    fonts = [f for f in fonts if "VariableFont" not in f.file.name]
    lines, audit, ids = [], [], set()
    for moment in moments:
        _keys(moment, {"id", "word_indices", "role", "font_family", "palette", "box", "size", "opacity", "animation"}, "moment")
        mid, role = moment["id"], moment["role"]
        if type(mid) is not str or not re.fullmatch(r"[A-Za-z0-9_-]{1,40}", mid) or mid in ids:
            raise LyricDesignError("moment ids must be unique safe identifiers")
        ids.add(mid)
        if type(role) is not str or role not in ROLES:
            raise LyricDesignError("unknown role")
        indices = moment["word_indices"]
        if type(indices) is not list or not 1 <= len(indices) <= 7:
            raise LyricDesignError("word_indices must explicitly select 1..7 original indices")
        for i in indices:
            _int(i, 0, len(track.words)-1, "original word index")
        if indices != list(range(indices[0], indices[0]+len(indices))):
            raise LyricDesignError("phrase indices must be contiguous, ascending, unique")
        if role != "quiet_serif" and role != "quiet_italic" and len(indices) != 1:
            raise LyricDesignError("graphic word roles require one original word")
        selected = [track.words[i] for i in indices]
        text = lyrics.safe_ass_text(" ".join(w.text for w in selected))
        if any(b.start-a.end > .6 for a, b in zip(selected, selected[1:])):
            raise LyricDesignError("selected phrase has a gap >0.6s")
        family = moment["font_family"]
        permitted = SERIF_FAMILIES if role == "quiet_serif" else DISPLAY_FAMILIES
        if type(family) is not str or family not in permitted:
            raise LyricDesignError("font does not match explicit role")
        candidates = [f for f in fonts if f.family == family]
        if role == "quiet_serif":
            candidates = [f for f in candidates if "italic" in f.file.name.lower()]
        else:
            candidates.sort(key=lambda f: ("regular" not in f.file.name.lower(), str(f.file)))
        if not candidates:
            raise LyricDesignError("required bundled OFL font face unavailable; no fallback")
        font = candidates[0]
        palette = moment["palette"]
        primary, accent = _palette_colors(palette)
        box = _box(moment["box"])
        size = _num(moment["size"], .018, .40, "size fraction of height")
        opacity = _num(moment["opacity"], .15, 1, "opacity")
        animation = moment["animation"]
        _keys(animation, {"entrance_ms", "exit_ms", "from_scale", "echo_offset", "glow"}, "animation")
        entrance = _int(animation["entrance_ms"], 0, 300, "entrance_ms")
        exit_ms = _int(animation["exit_ms"], 0, 250, "exit_ms")
        scale = _num(animation["from_scale"], .80, 1.15, "from_scale")
        if type(animation["echo_offset"]) is not list or len(animation["echo_offset"]) != 2:
            raise LyricDesignError("echo_offset requires x/y")
        dx, dy = [_num(v, -.025, .025, "echo offset") for v in animation["echo_offset"]]
        glow = _num(animation["glow"], 0, .012, "glow fraction")
        if role != "accent_echo" and (dx or dy):
            raise LyricDesignError("offset layers only permitted for accent_echo")
        if role in ("quiet_italic", "quiet_serif") and (size > .07 or glow > .003):
            raise LyricDesignError("quiet role exceeds size/glow budget")
        fw, fh = _font_metrics(font, text)
        px = size*height
        # Include global font ink bounds, 25% italic overhang, maximum scale,
        # offset, outline and blur safety padding. Reject instead of auto-fit.
        padding = 4 + glow*height*4
        rw = fw*px*max(1, scale)*(1.25 if role.startswith("quiet") else 1) + abs(dx)*width*2 + padding*2
        rh = fh*px*max(1, scale) + abs(dy)*height*2 + padding*2
        if rw > box[2]*width or rh > box[3]*height:
            raise LyricDesignError(f"{mid}: text/layers exceed explicit box; choose larger box or smaller size")
        entry = {"id": mid, "role": role, "original_word_indices": indices[:], "text": text,
                 "source_times": [[w.start, w.end] for w in selected], "box": list(box),
                 "design": copy.deepcopy(moment),
                 "resolved_colors": {"primary": "#"+primary, "accent": "#"+accent},
                 "font": {"family": font.family, "file": str(font.file), "license": str(font.license_file)}}
        a, b = selected[0].start-start+out, selected[-1].end-start+out
        reason = None
        if any(w.start < start or w.end > start+duration for w in selected):
            reason = "clipped_boundary_word"
        elif not allow_overlap and any(_intersects(box, z) for z in zones):
            reason = "protected_gameplay_zone"
        elif role in ("giant_word", "accent_echo") and not allow_collision and any(a <= t+.2 and b >= t-.2 for t in impacts):
            reason = "visual_impact_collision"
        # Decimal conversion avoids binary floats expanding times across boundary.
        mapped_a = Decimal(str(selected[0].start)) - Decimal(first)/Decimal(rate) + Decimal(str(out))
        mapped_b = Decimal(str(selected[-1].end)) - Decimal(first)/Decimal(rate) + Decimal(str(out))
        q0 = int((mapped_a*100).to_integral_value(rounding=ROUND_CEILING))
        q1 = int((mapped_b*100).to_integral_value(rounding=ROUND_FLOOR))
        if q1 <= q0:
            reason = reason or "sub_centisecond_interval"
        entry.update(status="omitted" if reason else "rendered", reason=reason, output_centiseconds=[q0, q1])
        audit.append(entry)
        if reason:
            continue
        life = (q1-q0)*10
        if entrance+exit_ms > life:
            raise LyricDesignError(f"{mid}: entrance/exit exceed inward-quantized lifetime")
        x, y = (box[0]+box[2]/2)*width, (box[1]+box[3]/2)*height
        clip = f"\\clip({math.ceil(box[0]*width)},{math.ceil(box[1]*height)},{math.floor((box[0]+box[2])*width)},{math.floor((box[1]+box[3])*height)})"
        def color(rgb):
            return "&H" + rgb[4:6]+rgb[2:4]+rgb[0:2] + "&"
        def layer(number, offset_x, offset_y, alpha, rgb, blur, border):
            tags = (f"{{\\an5\\pos({x+offset_x:.3f},{y+offset_y:.3f})\\fn{family}\\fs{px:.3f}"
                    f"\\i{1 if role.startswith('quiet') else 0}\\b0\\fscx{scale*100:.3f}\\fscy{scale*100:.3f}"
                    f"\\1c{color(rgb)}\\3c{color(rgb)}\\alpha&H{alpha:02X}&\\bord{border:.3f}\\shad0"
                    f"\\blur{blur:.3f}\\fad({entrance},{exit_ms})"
                    + (f"\\t(0,{entrance},\\fscx100\\fscy100)" if entrance else "\\fscx100\\fscy100") + clip + "}")
            lines.append(f"Dialogue: {number},{lyrics._ass_time(q0)},{lyrics._ass_time(q1)},Design,{mid},0,0,0,,{tags}{text}")
        if role == "accent_echo":
            layer(0, dx*width, dy*height, max(160, round(255*(1-opacity))), accent, 1, 0)
        if glow:
            layer(1, 0, 0, max(140, round(255*(1-opacity))), accent, glow*height, 1)
        layer(2, 0, 0, round(255*(1-opacity)), primary, .3, .6)
    ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Design,Anton,30,&H00FFFFFF,&H00FFFFFF,&H00000000,&HFF000000,0,0,0,0,100,100,0,0,1,0,0,5,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(lines) + "\n"
    if lyrics.audio_sha256(track.audio_path) != track.audio_sha256:
        raise LyricDesignError("selected music changed while compiling")
    result = {"schema": SCHEMA, "enabled": True, "source": dict(source),
              "alignment_method_assertion": track.method, "excerpt": dict(excerpt),
              "canvas": dict(canvas), "protected_zones": [list(z) for z in zones],
              "allow_protected_overlap": allow_overlap, "allow_impact_collision": allow_collision,
              "visual_impacts": impacts, "moments": audit,
              "limitations": ["No independent sung-word or vocal alignment verification.",
                              "Sample rate/excerpt lineage is a caller assertion; no mixed audio verification.",
                              "Conservative TTF ink bounds plus hard ASS rectangle clips, not gameplay semantic occlusion proof.",
                              "No automatic captions; no renderer integration or audio processing."]}
    json.dumps(result, allow_nan=False)
    return DesignedLyrics(ass, result)
