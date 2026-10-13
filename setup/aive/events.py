"""Typed event records shared by analysis and edit planning.

Audio transients are candidate moments, not verified gameplay kills. Keeping
that distinction in the serialized data prevents downstream code from
silently treating every loud onset as a confirmed highlight.
"""
from __future__ import annotations

from dataclasses import dataclass
import math


@dataclass(frozen=True, slots=True)
class EventCandidate:
    """An observed signal event awaiting visual/gameplay confirmation."""

    source: str
    t: float
    strength: float
    peak_db: float = 0.0
    event_type: str = "audio_transient"
    confirmed: bool = False
    confirmation: str = "not_checked"

    def __post_init__(self) -> None:
        for name, value in (("t", self.t), ("strength", self.strength),
                            ("peak_db", self.peak_db)):
            if not math.isfinite(value):
                raise ValueError(f"{name} must be finite")
        if self.t < 0:
            raise ValueError("event time must be >= 0")
        if self.confirmed and self.confirmation == "not_checked":
            raise ValueError("confirmed events must record a confirmation method")

    def to_dict(self) -> dict:
        return {
            "source": self.source,
            "t": round(self.t, 4),
            "event_type": self.event_type,
            "strength": round(self.strength, 2),
            "peak_db": round(self.peak_db, 1),
            "confirmed": self.confirmed,
            "confirmation": self.confirmation,
        }


@dataclass(frozen=True, slots=True)
class CandidateWindow:
    """A source range around a candidate event, not a confirmed kill clip."""

    source: str
    start: float
    end: float
    event_t: float
    intensity: float
    event_type: str = "audio_transient"
    confirmed: bool = False

    @property
    def duration(self) -> float:
        return max(0.0, self.end - self.start)

    @property
    def label(self) -> str:
        return "confirmed-event" if self.confirmed else "unconfirmed-transient"

    @property
    def kind(self) -> str:
        return self.event_type

    def to_dict(self) -> dict:
        return {
            "source": self.source,
            "start": round(self.start, 4),
            "end": round(self.end, 4),
            "event_t": round(self.event_t, 4),
            "intensity": round(self.intensity, 3),
            "event_type": self.event_type,
            "confirmed": self.confirmed,
        }


def candidate_windows(events: list[EventCandidate], *, source_duration: float,
                      pre: float = 0.8, post: float = 1.5,
                      minimum_context: float = 0.25) -> list[CandidateWindow]:
    """Make bounded context windows while preserving each source event time."""
    values = (source_duration, pre, post, minimum_context)
    if any(not math.isfinite(v) for v in values):
        raise ValueError("durations and context must be finite")
    if source_duration <= 0 or pre < 0 or post < 0 or minimum_context < 0:
        raise ValueError("invalid source duration or context")

    out: list[CandidateWindow] = []
    for event in events:
        if event.t < minimum_context or source_duration - event.t < minimum_context:
            continue
        start = max(0.0, event.t - pre)
        end = min(source_duration, event.t + post)
        if not start < event.t < end:
            continue
        out.append(CandidateWindow(
            source=event.source,
            start=start,
            end=end,
            event_t=event.t,
            intensity=event.strength,
            event_type=event.event_type,
            confirmed=event.confirmed,
        ))
    return out
