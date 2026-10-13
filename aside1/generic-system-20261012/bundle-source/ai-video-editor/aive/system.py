"""System capability detection: encoders, hardware accel, optional models."""
from __future__ import annotations

import functools
import importlib.util

from .shell import FFmpeg, run, which


@functools.lru_cache(maxsize=1)
def ffmpeg_encoders() -> frozenset[str]:
    """Names of encoders this FFmpeg build supports."""
    try:
        proc = run([FFmpeg().exe, "-hide_banner", "-encoders"])
    except FileNotFoundError:
        return frozenset()
    names = set()
    for line in (proc.stdout or "").splitlines():
        parts = line.split()
        if len(parts) >= 2 and parts[0][:1] in {"V", "A"}:
            names.add(parts[1])
    return frozenset(names)


def has_encoder(name: str) -> bool:
    return name in ffmpeg_encoders()


def has_filter(name: str) -> bool:
    try:
        proc = run([FFmpeg().exe, "-hide_banner", "-filters"])
    except FileNotFoundError:
        return False
    return f" {name} " in (proc.stdout or "")


def best_video_encoder(prefer_hardware: bool = True) -> str:
    """Pick the fastest available H.264 encoder.

    Prefers hardware (QuickSync/NVENC/AMF) when present, else libx264.
    """
    if prefer_hardware:
        for enc in ("h264_qsv", "h264_nvenc", "h264_amf", "h264_videotoolbox"):
            if has_encoder(enc):
                return enc
    return "libx264" if has_encoder("libx264") else "mpeg4"


def _has_module(name: str) -> bool:
    return importlib.util.find_spec(name) is not None


@functools.lru_cache(maxsize=1)
def capabilities() -> dict:
    """Report optional free tooling available on this machine."""
    return {
        "ffmpeg": which("ffmpeg") or "",
        "ffprobe": which("ffprobe") or "",
        "video_encoder": best_video_encoder(),
        "encoders": sorted(ffmpeg_encoders()),
        "has_libass": has_filter("subtitles"),
        "whisper_faster": _has_module("faster_whisper"),
        "whisper_openai": _has_module("whisper"),
        "torch": _has_module("torch"),
        "librosa": _has_module("librosa"),
        "numpy": _has_module("numpy"),
        "scipy": _has_module("scipy"),
        "ollama": which("ollama") or "",
    }


def describe() -> str:
    cap = capabilities()
    lines = ["aive - system capabilities", "=" * 30]
    lines.append(f"ffmpeg        : {cap['ffmpeg'] or 'MISSING'}")
    lines.append(f"ffprobe       : {cap['ffprobe'] or 'MISSING'}")
    lines.append(f"video encoder : {cap['video_encoder']}")
    lines.append(f"libass (ASS)  : {'yes' if cap['has_libass'] else 'no'}")
    lines.append(
        "signal analysis: "
        + ("ready (NumPy + SciPy + librosa)"
           if cap["numpy"] and cap["scipy"] and cap["librosa"]
           else f"not ready (numpy={'yes' if cap['numpy'] else 'missing'}, "
                f"scipy={'yes' if cap['scipy'] else 'missing'}, "
                f"librosa={'yes' if cap['librosa'] else 'missing'})")
    )
    lines.append(f"faster-whisper: {'yes' if cap['whisper_faster'] else 'no (optional)'}")
    lines.append(f"ollama        : {cap['ollama'] or 'no (optional)'}")
    return "\n".join(lines)
