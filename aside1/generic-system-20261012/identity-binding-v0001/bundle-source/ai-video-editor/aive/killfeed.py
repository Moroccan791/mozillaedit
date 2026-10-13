"""Lightweight Valorant HUD kill-feed change candidates.

This profile finds new colored rows in a default 16:9 Valorant kill-feed ROI.
It does not read player names or prove a row belongs to the POV player, so its
output is deliberately marked unconfirmed. Different HUD layouts need their
own measured profile.
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

from .events import EventCandidate
from .ffprobe import probe

PROFILE_VERSION = "valorant-killfeed-roi-v2"
SAMPLE_HZ = 30.0


def _read_roi(path: Path, start: float, end: float,
              width: int, height: int, sample_hz: float) -> np.ndarray:
    # Calibrated to the right-side kill-feed band on 16:9 Valorant captures.
    x = max(0, round(width * 0.79375))
    y = max(0, round(height * 0.08055))
    roi_w = max(2, min(width - x, round(width * 0.203125)))
    roi_h = max(2, min(height - y, round(height * 0.083333)))
    out_w = 128
    out_h = max(24, round(out_w * roi_h / roi_w))
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{start:.6f}",
        "-i", str(path), "-t", f"{max(0.0, end - start):.6f}",
        "-vf", (f"fps={sample_hz},crop={roi_w}:{roi_h}:{x}:{y},"
                f"scale={out_w}:{out_h}:flags=area,format=rgb24"),
        "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
    ]
    proc = subprocess.run(cmd, capture_output=True, timeout=120)
    frame_bytes = out_w * out_h * 3
    if proc.returncode != 0:
        raise RuntimeError(
            "FFmpeg failed to scan the Valorant kill-feed ROI: "
            + proc.stderr.decode("utf-8", "replace")[-400:]
        )
    usable = len(proc.stdout) - (len(proc.stdout) % frame_bytes)
    if usable == 0:
        return np.zeros((0, out_h, out_w, 3), dtype=np.uint8)
    return np.frombuffer(proc.stdout[:usable], dtype=np.uint8).reshape(
        -1, out_h, out_w, 3
    )


def _merge_windows(ranges: list[tuple[float, float]]) -> list[tuple[float, float]]:
    merged: list[list[float]] = []
    for start, end in sorted(ranges):
        if merged and start <= merged[-1][1] + 0.05:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return [(a, b) for a, b in merged]


def _best_per_transient(changes: list[dict]) -> list[dict]:
    """Keep the closest/highest-scoring visual change per audio candidate."""
    best: dict[float, dict] = {}
    for item in changes:
        key = float(item["associated_transient_t"])
        current = best.get(key)
        rank = (abs(float(item["transient_delta_s"])),
                -float(item["change_score"]))
        if current is None:
            best[key] = item
            continue
        current_rank = (abs(float(current["transient_delta_s"])),
                        -float(current["change_score"]))
        if rank < current_rank:
            best[key] = item
    return sorted(best.values(), key=lambda x: x["t"])


def detect_changes(path: str | Path, transients: list[EventCandidate], *,
                   pre: float = 1.5, post: float = 0.15,
                   sample_hz: float = SAMPLE_HZ,
                   delta_threshold: float = 0.05,
                   active_threshold: float = 0.15,
                   min_gap: float = 0.20) -> list[dict]:
    """Find colored kill-feed row appearances near transient candidates.

    The score is a change in saturated-pixel fraction, not a kill probability.
    A row still needs player/weapon/target identity confirmation.
    """
    if pre <= 0 or post < 0 or sample_hz <= 0:
        raise ValueError("pre/sample_hz must be positive and post non-negative")
    if not transients:
        return []
    media = probe(path)
    if not media.video or not media.video.width or not media.video.height:
        raise ValueError("kill-feed scan requires a video stream with dimensions")
    duration = media.duration
    source = str(Path(path).resolve())
    ranges = _merge_windows([
        (max(0.0, event.t - pre), min(duration, event.t + post))
        for event in transients
    ])
    changes: list[dict] = []
    for start, end in ranges:
        frames = _read_roi(Path(path), start, end, media.video.width,
                           media.video.height, sample_hz)
        if len(frames) < 3:
            continue
        maxc = frames.max(axis=3).astype(np.int16)
        minc = frames.min(axis=3).astype(np.int16)
        saturated = ((maxc - minc) >= 35) & (maxc >= 70)
        active = saturated.mean(axis=(1, 2))
        last_change = -1e9
        history = max(3, round(sample_hz * 0.35))
        for i in range(1, len(frames)):
            lo = max(0, i - history)
            baseline = float(np.median(active[lo:i])) if i > lo else float(active[i - 1])
            delta = float(active[i] - baseline)
            t = start + i / sample_hz
            if delta < delta_threshold or active[i] < active_threshold:
                continue
            if t - last_change < min_gap:
                continue
            last_change = t
            nearest = min(transients, key=lambda e: abs(e.t - t))
            if abs(nearest.t - t) > pre + post:
                continue
            changes.append({
                "source": source,
                "t": round(t, 4),
                "event_type": "killfeed_row_change",
                "change_score": round(delta, 4),
                "active_fraction": round(float(active[i]), 4),
                "associated_transient_t": round(nearest.t, 4),
                "transient_delta_s": round(nearest.t - t, 4),
                "confirmed": False,
                "confirmation": "killfeed_change_only_player_identity_unchecked",
                "profile": PROFILE_VERSION,
            })
    # The same row may be found in overlapping audio-trigger windows.
    unique: list[dict] = []
    for item in sorted(changes, key=lambda x: x["t"]):
        if unique and item["t"] - unique[-1]["t"] < min_gap:
            if item["change_score"] > unique[-1]["change_score"]:
                unique[-1] = item
        else:
            unique.append(item)
    # Emit at most one HUD-change candidate for each audio candidate. This
    # suppresses repeated animation frames; multi-kill grouping is a later step.
    return _best_per_transient(unique)
