"""Export: platform presets + fast hardware encode + automatic pix_fmt safety."""
from __future__ import annotations

from dataclasses import dataclass, asdict

from .system import best_video_encoder, has_encoder


@dataclass
class Platform:
    name: str
    width: int
    height: int
    fps: int
    v_bitrate: str
    a_bitrate: str
    max_seconds: int | None = None


PLATFORMS: dict[str, Platform] = {
    "youtube":  Platform("youtube", 1920, 1080, 30, "12M", "192k"),
    "youtube-4k": Platform("youtube-4k", 3840, 2160, 30, "45M", "256k"),
    "tiktok":   Platform("tiktok", 1080, 1920, 30, "8M", "192k", max_seconds=180),
    "reels":    Platform("reels", 1080, 1920, 30, "8M", "192k", max_seconds=90),
    "shorts":   Platform("shorts", 1080, 1920, 30, "8M", "192k", max_seconds=60),
    "square":   Platform("square", 1080, 1080, 30, "8M", "192k"),
    "source":   Platform("source", 0, 0, 0, "0", "192k"),
}


def _encoder_args(encoder: str, quality: int = 20) -> list[str]:
    """Quality/speed args suited to each encoder family."""
    if encoder.endswith("_qsv"):
        # ICQ (constant quality) for QuickSync
        return ["-global_quality", str(quality)]
    if encoder.endswith("_nvenc"):
        return ["-preset", "p5", "-cq", str(quality), "-rc", "vbr"]
    if encoder.endswith("_amf"):
        return ["-quality", "balanced", "-rc", "cqp", "-qp_i", str(quality),
                "-qp_p", str(quality)]
    # libx264 / fallback
    return ["-preset", "medium", "-crf", str(quality)]


def export_args(
    platform: str,
    *,
    encoder: str | None = None,
    quality: int = 20,
    scale_to_platform: bool = False,
    fps_lock: int = 0,
) -> list[str]:
    """Build the video+audio encode arguments for a target platform.

    Always forces yuv420p (playability) and -movflags +faststart.
    """
    p = PLATFORMS[platform] if platform in PLATFORMS else PLATFORMS["youtube"]
    enc = encoder or best_video_encoder()

    args: list[str] = []
    filters: list[str] = []
    if scale_to_platform and p.width and p.height:
        filters.append(f"scale={p.width}:{p.height}:force_original_aspect_ratio=decrease")
        filters.append(f"pad={p.width}:{p.height}:(ow-iw)/2:(oh-ih)/2")
    if fps_lock:
        filters.append(f"fps={fps_lock}")
    elif scale_to_platform and p.fps:
        filters.append(f"fps={p.fps}")
    if filters:
        args += ["-vf", ",".join(filters)]

    args += ["-c:v", enc]
    args += _encoder_args(enc, quality)
    args += ["-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0"]
    # Only force a target bitrate when we actually conform to the platform
    # resolution. Otherwise stay quality-based (avoids bloating 720p -> 12M).
    if scale_to_platform and p.v_bitrate and p.v_bitrate != "0":
        args += ["-b:v", p.v_bitrate, "-maxrate", p.v_bitrate, "-bufsize", "24M"]
    args += ["-c:a", "aac", "-b:a", p.a_bitrate, "-ar", "48000"]
    args += ["-movflags", "+faststart"]
    return args


def describe_platforms() -> str:
    lines = ["platform   resolution   fps   max"]
    for name, p in PLATFORMS.items():
        res = f"{p.width}x{p.height}" if p.width else "source"
        mx = f"{p.max_seconds}s" if p.max_seconds else "-"
        lines.append(f"{name:<11}{res:<13}{p.fps or '-':<6}{mx}")
    return "\n".join(lines)
