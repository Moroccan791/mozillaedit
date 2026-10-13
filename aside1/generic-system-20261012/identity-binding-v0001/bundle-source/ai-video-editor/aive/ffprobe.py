"""Media probing: duration, streams, fps, resolution, pixel format."""
from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from pathlib import Path

from .shell import FFprobe


@dataclass
class StreamInfo:
    index: int
    codec_type: str
    codec_name: str
    width: int = 0
    height: int = 0
    fps: float = 0.0
    pix_fmt: str = ""
    sample_rate: int = 0
    channels: int = 0

    @property
    def is_video(self) -> bool:
        return self.codec_type == "video"

    @property
    def is_audio(self) -> bool:
        return self.codec_type == "audio"


@dataclass
class MediaInfo:
    path: str
    duration: float = 0.0
    size: int = 0
    bit_rate: int = 0
    streams: list[StreamInfo] = field(default_factory=list)

    @property
    def video(self) -> StreamInfo | None:
        return next((s for s in self.streams if s.is_video), None)

    @property
    def audio(self) -> StreamInfo | None:
        return next((s for s in self.streams if s.is_audio), None)

    @property
    def has_audio(self) -> bool:
        return self.audio is not None

    def to_dict(self) -> dict:
        return asdict(self)


def _fps(rate: str | None) -> float:
    if not rate or rate == "0/0":
        return 0.0
    try:
        num, den = rate.split("/")
        den = float(den)
        return float(num) / den if den else 0.0
    except (ValueError, ZeroDivisionError):
        return 0.0


def probe(path: str | Path, ffprobe: FFprobe | None = None) -> MediaInfo:
    """Probe a media file into a MediaInfo record."""
    fp = ffprobe or FFprobe()
    p = str(path)
    proc = fp.run(
        ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", p]
    )
    data = json.loads(proc.stdout or "{}")
    fmt = data.get("format", {})
    info = MediaInfo(
        path=p,
        duration=float(fmt.get("duration", 0.0) or 0.0),
        size=int(fmt.get("size", 0) or 0),
        bit_rate=int(fmt.get("bit_rate", 0) or 0),
    )
    for s in data.get("streams", []):
        info.streams.append(
            StreamInfo(
                index=int(s.get("index", 0)),
                codec_type=s.get("codec_type", ""),
                codec_name=s.get("codec_name", ""),
                width=int(s.get("width", 0) or 0),
                height=int(s.get("height", 0) or 0),
                fps=_fps(s.get("r_frame_rate")),
                pix_fmt=s.get("pix_fmt", ""),
                sample_rate=int(s.get("sample_rate", 0) or 0),
                channels=int(s.get("channels", 0) or 0),
            )
        )
    return info
