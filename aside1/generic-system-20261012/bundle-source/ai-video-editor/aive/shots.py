"""Audio-transient candidate detection for raw gameplay clips.

This detector finds sharp envelope changes in the source audio. Those events
may be gunshots or other transients; they are not kill confirmations. Visual
HUD/kill-feed checks are a separate stage and must set ``confirmed=True``.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from scipy.signal import find_peaks

from .beats import decode_audio
from .events import EventCandidate

# Backwards-compatible type name. The records are explicitly unconfirmed
# audio-transient candidates, not gameplay kill events.
Shot = EventCandidate

DETECTOR_VERSION = "audio-transient-v1"
SR = 22050
HOP_MS = 1.0
WIN_MS = 6.0


def _envelope(x: np.ndarray, sr: int = SR) -> tuple[np.ndarray, np.ndarray]:
    hop = max(1, int(HOP_MS / 1000.0 * sr))
    win = max(2, int(WIN_MS / 1000.0 * sr))
    n = (len(x) - win) // hop
    if n <= 1:
        return np.zeros(0), np.zeros(0)
    idx = np.arange(win)[None, :] + hop * np.arange(n)[:, None]
    rms = np.sqrt(np.mean(x[idx] ** 2, axis=1) + 1e-12)
    db = 20.0 * np.log10(rms + 1e-9)
    times = (np.arange(n) * hop + win / 2) / sr
    return db, times


def detect(path: str, *, sr: int = SR, t0: float = 0.0, t1: float | None = None,
           pct: float = 99.3, min_gap: float = 0.25, floor_db: float | None = None,
           max_events: int | None = None) -> list[Shot]:
    """Detect gunshot events. Bursts within ``min_gap`` collapse to one event."""
    x = decode_audio(path, sr=sr)
    if t1 is not None:
        x = x[int(t0 * sr):int(t1 * sr)]
    elif t0 > 0:
        x = x[int(t0 * sr):]
    db, times = _envelope(x, sr)
    if db.size < 4:
        return []
    on = np.diff(db)
    on[on < 0] = 0.0
    thr = max(np.percentile(on, pct), 2.0)
    hop = max(1, int(HOP_MS / 1000.0 * sr))
    pk, props = find_peaks(on, height=thr, distance=max(1, int(0.05 * sr / hop)))
    if pk.size == 0:
        return []
    h = props["peak_heights"]
    tt = times[pk]
    peak = db[pk]
    if floor_db is not None:
        keep = peak >= floor_db
        pk, h, tt, peak = pk[keep], h[keep], tt[keep], peak[keep]
    # consolidate bursts: strongest peak wins within min_gap
    order = np.argsort(-h)
    kept: list[int] = []
    for i in order:
        if all(abs(tt[i] - tt[j]) > min_gap for j in kept):
            kept.append(i)
    kept.sort()
    source = str(Path(path).resolve())
    shots = [Shot(source=source, t=float(tt[i] + t0), strength=float(h[i]),
                  peak_db=float(peak[i])) for i in kept]
    if max_events and len(shots) > max_events:
        shots = sorted(sorted(shots, key=lambda s: -s.strength)[:max_events],
                       key=lambda s: s.t)
    return shots


def rank(shots: list[Shot]) -> list[Shot]:
    """Rank transient candidates by measured attack strength."""
    return sorted(shots, key=lambda s: (-s.strength, s.t))


def pick(shots: list[Shot], n: int, *, min_sep: float = 0.0) -> list[Shot]:
    """Top-n strongest shots (optionally spaced at least min_sep apart)."""
    chosen: list[Shot] = []
    for s in sorted(shots, key=lambda s: -s.strength):
        if min_sep and any(abs(s.t - c.t) < min_sep for c in chosen):
            continue
        chosen.append(s)
        if len(chosen) >= n:
            break
    return sorted(chosen, key=lambda s: s.t)


def describe(shots: list[Shot], duration: float = 0.0) -> str:
    if not shots:
        return "shots: none"
    rate = f" ({len(shots)/duration:.2f}/s)" if duration else ""
    strong = [round(s.t, 2) for s in sorted(shots, key=lambda s: -s.strength)[:8]]
    return f"shots: {len(shots)}{rate}\n  strongest at: {strong}"
