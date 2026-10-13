"""ASS subtitle generation (libass).

Far more capable than drawtext: styled, positioned, animated captions with
fade effects and word-by-word emphasis. Emits a .ass file consumed by the
`subtitles` FFmpeg filter.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

ASS_HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 2
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
{styles}

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
{events}
"""


def _ass_color(hex_rgb: str, alpha: int = 0) -> str:
    """#RRGGBB -> &HAABBGGRR (ASS uses BGR order, 00=opaque)."""
    h = hex_rgb.lstrip("#")
    r, g, b = h[0:2], h[2:4], h[4:6]
    return f"&H{alpha:02X}{b}{g}{r}"


def _ts(seconds: float) -> str:
    """Format seconds as H:MM:SS.cc (centiseconds)."""
    if seconds < 0:
        seconds = 0.0
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h}:{m:02d}:{s:05.2f}"


@dataclass
class CaptionStyle:
    name: str = "Title"
    font: str = "Bahnschrift"
    size: int = 72
    primary: str = "#FFFFFF"
    outline_colour: str = "#000000"
    bold: int = 1
    spacing: float = 2.0
    outline: float = 3.0
    shadow: float = 1.0
    alignment: int = 5  # 5 = centre-middle
    margin_v: int = 60

    def line(self) -> str:
        return (
            f"Style: {self.name},{self.font},{self.size},"
            f"{_ass_color(self.primary)},&H000000FF,{_ass_color(self.outline_colour)},"
            f"&H64000000,{self.bold},0,0,0,100,100,{self.spacing},0,1,"
            f"{self.outline},{self.shadow},{self.alignment},40,40,{self.margin_v},1"
        )


@dataclass
class Caption:
    text: str
    start: float
    end: float
    style: str = "Title"
    fade_in: float = 0.4
    fade_out: float = 0.4
    slide: bool = False
    anim: str = ""  # "" | pop | slide-up | punch | glitch
    rgb_split: bool = False


def _effect(cap: Caption) -> str:
    tags = ""
    if cap.anim == "pop":
        tags += r"\fscx35\fscy35\t(0,180,\fscx100\fscy100)"
    elif cap.anim == "punch":
        tags += r"\fscx140\fscy140\t(0,120,\fscx100\fscy100)"
    elif cap.anim == "glitch":
        tags += (r"\t(0,25,\fscx125\fscy75)\t(25,50,\fscx75\fscy125)"
                 r"\t(50,75,\fscx110\fscy90)\t(75,100,\fscx100\fscy100)")
    elif cap.anim == "slide-up":
        tags += r"\move(960,1200,960,780,0,260)"
    if cap.fade_in > 0 or cap.fade_out > 0:
        tags += f"\\fad({int(cap.fade_in * 1000)},{int(cap.fade_out * 1000)})"
    if cap.slide:
        tags += r"\move(960,700,960,620,0,400)"
    return f"{{{tags}}}" if tags else ""


def build_ass(
    captions: list[Caption],
    styles: list[CaptionStyle],
    *,
    width: int = 1920,
    height: int = 1080,
) -> str:
    style_lines = "\n".join(s.line() for s in styles)
    ev = []
    cx, cy = width // 2, height // 2
    for c in captions:
        tag = _effect(c)
        if c.rgb_split:
            layers = [
                ("&H0000FF&", cx - 4, cy),   # red left
                ("&HFFFF00&", cx + 4, cy),   # cyan right
                ("&HFFFFFF&", cx, cy),       # white center
            ]
            for col, px, py in layers:
                ev.append(
                    f"Dialogue: 0,{_ts(c.start)},{_ts(c.end)},{c.style},,0,0,0,,"
                    f"{{\\c{col}\\pos({px},{py})}}{tag}{c.text}"
                )
        else:
            ev.append(
                f"Dialogue: 0,{_ts(c.start)},{_ts(c.end)},{c.style},,0,0,0,,{tag}{c.text}"
            )
    return ASS_HEADER.format(
        w=width, h=height, styles=style_lines, events="\n".join(ev)
    )


def write_ass(path: str | Path, captions: list[Caption], styles: list[CaptionStyle],
              *, width: int = 1920, height: int = 1080) -> Path:
    p = Path(path)
    p.write_text(build_ass(captions, styles, width=width, height=height),
                 encoding="utf-8")
    return p


def default_styles() -> list[CaptionStyle]:
    return [
        CaptionStyle(name="Title", font="Bahnschrift", size=70, spacing=14,
                     alignment=5, margin_v=0, bold=1),
        CaptionStyle(name="Heavy", font="Arial Black", size=120, spacing=0,
                     alignment=5, margin_v=0, bold=1),
        CaptionStyle(name="Lower", font="Bahnschrift", size=52, spacing=1,
                     alignment=2, margin_v=90, bold=1),
        CaptionStyle(name="Hook", font="Arial Black", size=88, spacing=2,
                     alignment=8, margin_v=220, bold=1, outline=4.0),
        # end-card stacked slots (top / middle / bottom)
        CaptionStyle(name="OutroTop", font="Bahnschrift", size=64, spacing=12,
                     alignment=8, margin_v=170, bold=1),
        CaptionStyle(name="OutroMid", font="Arial Black", size=118, spacing=0,
                     alignment=5, margin_v=0, bold=1),
        CaptionStyle(name="OutroBottom", font="Bahnschrift", size=42, spacing=2,
                     alignment=2, margin_v=170, bold=1),
    ]


OUTRO_SLOTS = ["OutroTop", "OutroMid", "OutroBottom", "OutroBottom", "OutroBottom"]


def outro_style_for(index: int) -> str:
    """Pick a stacked vertical slot for the nth end-card line."""
    return OUTRO_SLOTS[index] if index < len(OUTRO_SLOTS) else "OutroBottom"
