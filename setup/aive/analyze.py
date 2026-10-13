"""Excitement analysis for long-form footage (matches, streams, etc.).

Scores every second of a clip on how "highlight-worthy" it is, by combining:
  * loudness   -- crowd roar / commentator peak (strongest sports signal)
  * motion     -- frame-to-frame change (fast action, camera pans)
  * cuts       -- nearby scene changes (edited highlight boundaries)

Produces a per-second score curve and lets you pick the top N non-overlapping
windows to build a tight edit from a long video.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

from .shell import FFmpeg


@dataclass
class Window:
    start: float
    end: float
    score: float
    loud: float
    motion: float

    @property
    def duration(self) -> float:
        return self.end - self.start

    def to_dict(self) -> dict:
        return {"start": round(self.start, 2), "end": round(self.end, 2),
                "score": round(self.score, 3), "loud": round(self.loud, 3),
                "motion": round(self.motion, 3)}


def _rms_per_second(path: str) -> dict[int, float]:
    """Mean RMS loudness (dB) per whole second."""
    ff = FFmpeg()
    proc = ff.run([
        "-i", path,
        "-af", "astats=metadata=1:reset=1,ametadata=print"
               ":key=lavfi.astats.Overall.RMS_level:file=-",
        "-vn", "-f", "null", "-",
    ])
    out = (proc.stdout or "") + (proc.stderr or "")
    buckets: dict[int, list[float]] = {}
    t = 0.0
    for line in out.splitlines():
        mt = re.search(r"pts_time:([0-9.]+)", line)
        if mt:
            t = float(mt.group(1))
        mr = re.search(r"RMS_level=(-?[0-9.]+|-inf)", line)
        if mr and "inf" not in mr.group(1):
            buckets.setdefault(int(t), []).append(float(mr.group(1)))
    return {s: sum(v) / len(v) for s, v in buckets.items() if v}


def _motion_per_second(path: str, analyze_secs: float | None = None) -> dict[int, float]:
    """Mean frame-difference (motion) per whole second, via signalstats YDIF."""
    ff = FFmpeg()
    args = ["-i", path]
    if analyze_secs:
        args = ["-t", str(analyze_secs), "-i", path]
    proc = ff.run([
        *args,
        "-vf", "fps=4,signalstats,metadata=print:key=lavfi.signalstats.YDIF:file=-",
        "-an", "-f", "null", "-",
    ])
    out = (proc.stdout or "") + (proc.stderr or "")
    buckets: dict[int, list[float]] = {}
    t = 0.0
    for line in out.splitlines():
        mt = re.search(r"pts_time:([0-9.]+)", line)
        if mt:
            t = float(mt.group(1))
        mr = re.search(r"YDIF=([0-9.]+)", line)
        if mr:
            buckets.setdefault(int(t), []).append(float(mr.group(1)))
    return {s: sum(v) / len(v) for s, v in buckets.items() if v}


def analyze(path: str, *, motion: bool = True,
            analyze_secs: float | None = None) -> dict[int, dict]:
    """Return per-second {second: {loudness_db, motion, score}}."""
    loud = _rms_per_second(path)
    mot = _motion_per_second(path, analyze_secs) if motion else {}
    seconds = sorted(set(loud) | set(mot))
    # normalise to 0..1
    def norm(d: dict[int, float], invert: bool = False) -> dict[int, float]:
        if not d:
            return {}
        vals = list(d.values())
        lo, hi = min(vals), max(vals)
        span = (hi - lo) or 1.0
        out = {k: (v - lo) / span for k, v in d.items()}
        return {k: (1 - v) for k, v in out.items()} if invert else out

    nl, nm = norm(loud), norm(mot)
    result: dict[int, dict] = {}
    for s in seconds:
        l = nl.get(s, 0.0)
        m = nm.get(s, 0.0)
        score = 0.65 * l + 0.35 * (m if mot else 0.0)
        result[s] = {"loudness_db": round(loud.get(s, -60), 1),
                     "motion": round(mot.get(s, 0), 3),
                     "score": round(score, 4)}
    return result


def top_windows(scores: dict[int, dict], *, window: float = 8.0,
                count: int = 20, min_gap: float = 4.0) -> list[Window]:
    """Pick the top-scoring non-overlapping windows across the timeline."""
    if not scores:
        return []
    secs = sorted(scores)
    ranked = sorted(secs, key=lambda s: -scores[s]["score"])
    picked: list[Window] = []
    used: list[tuple[float, float]] = []

    def overlap(a: float, b: float) -> bool:
        return any(not (b <= c or a >= d) for c, d in used)

    for s in ranked:
        a, b = s - window * 0.4, s + window * 0.6
        if a < 0:
            a, b = 0.0, window
        if overlap(a, b) or any(abs(s - w.start) < min_gap for w in picked):
            continue
        picked.append(Window(start=a, end=b, score=scores[s]["score"],
                             loud=scores[s]["loudness_db"],
                             motion=scores[s]["motion"]))
        used.append((a, b))
        if len(picked) >= count:
            break
    return sorted(picked, key=lambda w: w.start)


def save(analysis: dict, path: str | Path) -> Path:
    import json

    p = Path(path)
    p.write_text(json.dumps({str(k): v for k, v in analysis.items()}, indent=2),
                 encoding="utf-8")
    return p
