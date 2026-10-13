"""Colour grading: named looks built from FFmpeg primitives.

Each look is a filter fragment. `teal-orange` reproduces the cinematic grade
used on the Avengers edit (cool shadows, warm highlights, vignette).
"""
from __future__ import annotations

LOOKS: dict[str, str] = {
    "none": "",
    "teal-orange": (
        "eq=brightness=0.02:contrast=1.18:saturation=1.3:gamma=0.95,"
        "colorbalance=rs=-0.10:gs=0.05:bs=0.12:rm=-0.03:bm=0.05:"
        "rh=0.15:gh=0.02:bh=-0.15,"
        "vignette=angle=PI/5"
    ),
    "warm-film": (
        "eq=brightness=0.02:contrast=1.1:saturation=1.15:gamma=0.98,"
        "colorbalance=rs=0.08:gs=0.03:bs=-0.08:rm=0.05:bm=-0.06:"
        "rh=0.10:gh=0.04:bh=-0.10,"
        "vignette=angle=PI/6"
    ),
    "cold-noir": (
        "eq=brightness=-0.02:contrast=1.25:saturation=0.7:gamma=0.9,"
        "colorbalance=bs=0.18:rs=-0.10:bh=-0.10:rh=-0.05,"
        "vignette=angle=PI/4"
    ),
    "fade-film": (
        "eq=contrast=1.12:saturation=0.9:brightness=0.03,"
        "curves=preset=vintage,vignette=angle=PI/6"
    ),
    "vibrant-sports": (
        "eq=brightness=0.03:contrast=1.22:saturation=1.45:gamma=0.97,"
        "colorbalance=rs=0.03:bs=0.06:rm=0.02:bm=0.02,"
        "unsharp=5:5:0.6:5:5:0.0,vignette=angle=PI/7"
    ),
    "broadcast-hd": (
        "eq=contrast=1.12:saturation=1.2:brightness=0.02,"
        "unsharp=5:5:0.4,curves=all='0/0 0.5/0.52 1/1'"
    ),
}


def get_look(name: str) -> str:
    if name not in LOOKS:
        raise ValueError(f"unknown grade look '{name}'. options: {sorted(LOOKS)}")
    return LOOKS[name]


def apply(name: str) -> str:
    """Return the filter fragment for a look (empty string == passthrough)."""
    return get_look(name)


def list_looks() -> list[str]:
    return sorted(LOOKS)
