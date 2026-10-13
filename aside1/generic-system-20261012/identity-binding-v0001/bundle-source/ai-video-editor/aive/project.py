"""Project schema: a single editable JSON describing one edit job."""
from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any

SCHEMA_VERSION = 1


@dataclass
class Segment:
    """A source in/out range, in seconds, from the raw media."""

    start: float
    end: float
    label: str = ""
    speed: float = 1.0
    motion: str = "none"        # none | zoom-in | zoom-out | punch | shake
    zoom: float = 1.15          # peak zoom factor for motion effects
    transition: str | None = None  # override of the project transition
    # speed ramp: slow-mo into kill, snap back
    ramp_in: float = 0.0         # seconds before cut to start ramp
    ramp_out: float = 0.0        # seconds after cut to end ramp
    ramp_speed: float = 0.3      # slow-mo factor (0.3 = 30% speed)
    ramp_hold: float = 0.0       # source seconds at 1x at clip start (beat hold)
    # per-clip color grade override
    grade: str | None = None
    # flash frame on beat
    flash: bool = False

    @property
    def duration(self) -> float:
        return max(0.0, (self.end - self.start) / (self.speed or 1.0))

    @property
    def out_duration(self) -> float:
        """Timeline length. The grid ramp is length-preserving, so == duration."""
        return self.duration


@dataclass
class Project:
    name: str = "untitled"
    source: str = ""
    segments: list[Segment] = field(default_factory=list)
    grade: str = "teal-orange"
    target_lufs: float = -14.0
    music: str | None = None
    music_gain_db: float = -8.0
    music_start: float = 0.0     # offset into the track (ride the best part)
    captions: list[dict[str, Any]] = field(default_factory=list)
    captions_mode: str = "off"  # off | manual | auto (from transcript)
    overlays: list[dict[str, Any]] = field(default_factory=list)  # full-frame fx
    title: dict[str, Any] = field(default_factory=dict)
    outro: dict[str, Any] = field(default_factory=dict)
    platform: str = "youtube"
    hook: str = ""
    # look / pacing
    aspect: str = "source"      # source | 16:9 | 9:16 | 1:1
    reframe: str = "blur"       # blur | crop (how to fit source into aspect)
    fps: int = 0                # 0 = source fps
    vibe: str = "clean"         # clean | punch | gaming | music-reel
    transition: dict[str, Any] = field(default_factory=dict)  # {type, duration}
    audio_mode: str = "mix"     # mix | source | music
    sfx: bool = False           # synthesise risers/impacts on cuts
    sfx_gain_db: float = -8.0
    schema_version: int = SCHEMA_VERSION

    # paths resolved at load time
    root: Path = field(default_factory=Path.cwd, repr=False)
    computed_duration: float = field(default=0.0, repr=False)

    @property
    def source_path(self) -> Path:
        p = Path(self.source)
        return p if p.is_absolute() else (self.root / p)

    @property
    def music_path(self) -> Path | None:
        if not self.music:
            return None
        p = Path(self.music)
        return p if p.is_absolute() else (self.root / p)

    @property
    def total_duration(self) -> float:
        return sum(seg.out_duration for seg in self.segments)

    def to_dict(self) -> dict:
        d = {k: v for k, v in asdict(self).items()
             if k not in ("root", "computed_duration")}
        d["segments"] = [asdict(s) for s in self.segments]
        return d

    @classmethod
    def load(cls, path: str | Path) -> "Project":
        p = Path(path)
        data = json.loads(p.read_text(encoding="utf-8"))
        segs = [Segment(**s) for s in data.pop("segments", [])]
        known = {f for f in cls.__dataclass_fields__ if f != "root"}
        unknown = set(data) - known
        if unknown:
            raise ValueError(f"unknown project keys: {sorted(unknown)}")
        proj = cls(**data, segments=segs)
        proj.root = p.parent.parent if p.parent.name == "projects" else p.parent
        return proj

    def save(self, path: str | Path) -> None:
        Path(path).write_text(
            json.dumps(self.to_dict(), indent=2), encoding="utf-8"
        )


def scaffold(name: str, source: str) -> Project:
    """Create a starter project with sensible defaults."""
    return Project(
        name=name,
        source=source,
        grade="teal-orange",
        platform="youtube",
        title={
            "enabled": True,
            "lines": ["A V E N G E R S", "DOOMSDAY"],
            "font_size": [70, 130],
            "in": 0.4,
            "out": 3.2,
        },
        outro={
            "enabled": True,
            "lines": ["A V E N G E R S", "DOOMSDAY", "IN THEATERS DECEMBER 18"],
            "hold": 8.0,
        },
    )
