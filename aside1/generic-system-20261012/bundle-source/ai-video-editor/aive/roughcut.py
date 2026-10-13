"""Rough-cut planning: decide which moments make the cut and at what pace.

Two modes:
  * beat-aware  -- pack selected shots onto a beat grid (music-driven)
  * transcript  -- cut filler from speech using word timings (talking-head)

Works rule-based by default; an LLM can re-rank/summarise when Ollama exists.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from .events import CandidateWindow, EventCandidate
from .project import Segment


@dataclass
class BeatGrid:
    bpm: float
    offset: float = 0.0
    divisions: list[float] = field(default_factory=lambda: [1.0, 2.0, 0.5])

    @property
    def beat_len(self) -> float:
        return 60.0 / self.bpm if self.bpm else 0.0

    def markers(self, duration: float, step: float = 1.0) -> list[float]:
        """Beat timestamps spanning `duration`, every `step` beats."""
        b = self.beat_len * step
        if b <= 0:
            return []
        out, t = [], self.offset
        while t <= duration + 1e-6:
            out.append(round(t, 3))
            t += b
        return out


def estimate_bpm_from_shots(
    shots: list[EventCandidate | CandidateWindow],
) -> float:
    """Crude tempo guess from candidate event spacing (fallback only)."""
    starts = sorted(
        float(s.event_t if isinstance(s, CandidateWindow) else s.t)
        for s in shots
    )
    if len(starts) < 3:
        return 0.0
    gaps = [b - a for a, b in zip(starts, starts[1:]) if 0 < (b - a) < 4]
    if not gaps:
        return 0.0
    avg = sum(gaps) / len(gaps)
    return round(60.0 / avg, 1) if avg else 0.0


def pack_to_grid(
    shots: list[CandidateWindow],
    grid: BeatGrid,
    target_duration: float,
    *,
    min_shot: float = 0.5,
) -> list[Segment]:
    """Fill a target duration with the highest-intensity shots, snapped to beats.

    Each chosen shot is trimmed to fit a beat-aligned slot. Selection is
    greedy by intensity so the punchiest moments survive.
    """
    if not shots or grid.beat_len <= 0:
        return []
    ranked = sorted(shots, key=lambda s: -s.intensity)
    slots: list[Segment] = []
    selected_ranges: list[tuple[float, float]] = []
    used = 0.0
    beat = grid.beat_len
    # candidate slot lengths in beats, longest-first for a varied rhythm
    slot_lens = [beat * d for d in sorted(grid.divisions, reverse=True)]

    for shot in ranked:
        if used >= target_duration:
            break
        for L in slot_lens:
            if shot.duration < L or used + L > target_duration + 1e-6:
                continue
            take = min(L, shot.duration)
            end = shot.start + take
            if any(shot.start < b - 1e-6 and end > a + 1e-6
                   for a, b in selected_ranges):
                continue
            seg = Segment(start=round(shot.start, 3),
                          end=round(end, 3),
                          label=shot.label or shot.kind)
            slots.append(seg)
            selected_ranges.append((shot.start, end))
            used += take
            break
    # keep chronological for a coherent cut
    return sorted(slots, key=lambda s: s.start)


def cut_filler_from_transcript(
    words: list, max_gap: float = 0.6
) -> list[Segment]:
    """Merge spoken words into segments, bridging short pauses only."""
    if not words:
        return []
    segs: list[Segment] = []
    cur_start = words[0].start
    cur_end = words[0].end
    for w in words[1:]:
        if w.start - cur_end <= max_gap:
            cur_end = w.end
        else:
            segs.append(Segment(start=round(cur_start, 3), end=round(cur_end, 3),
                                label="speech"))
            cur_start, cur_end = w.start, w.end
    segs.append(Segment(start=round(cur_start, 3), end=round(cur_end, 3),
                        label="speech"))
    return segs
