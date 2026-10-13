"""Prototype gunshot-onset detector for raw gameplay clips (game audio only).

Gunshots are sharp, loud broadband transients. We build a 1 ms amplitude
envelope, take its positive derivative (attack strength in dB/ms), and pick the
sharpest peaks. Prints detected shots so we can eyeball the rate.
"""
from __future__ import annotations

import sys

import numpy as np
from scipy.signal import find_peaks

from aive.beats import decode_audio


def detect(path: str, sr: int = 22050, t0: float = 0.0, t1: float | None = None,
           pct: float = 99.3, min_gap: float = 0.08):
    x = decode_audio(path, sr)
    if t1 is not None:
        x = x[int(t0 * sr):int(t1 * sr)]
    else:
        x = x[int(t0 * sr):]
    hop = int(0.001 * sr)
    win = int(0.006 * sr)
    n = (len(x) - win) // hop
    idx = np.arange(win)[None, :] + hop * np.arange(n)[:, None]
    rms = np.sqrt(np.mean(x[idx] ** 2, axis=1) + 1e-12)
    db = 20.0 * np.log10(rms + 1e-9)
    on = np.diff(db)
    on[on < 0] = 0.0
    thr = np.percentile(on, pct)
    pk, props = find_peaks(on, height=thr, distance=int(min_gap * sr / hop))
    times = (pk * hop + win / 2) / sr + t0
    # refine: within +/-20ms find true local max of the envelope
    return times, props["peak_heights"], db


if __name__ == "__main__":
    f = sys.argv[1] if len(sys.argv) > 1 else (
        r"E:\raw clips val\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p.mp4")
    t0 = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
    t1 = float(sys.argv[3]) if len(sys.argv) > 3 else 180.0
    times, h, db = detect(f, t0=t0, t1=t1)
    print(f"window {t0:.0f}-{t1:.0f}s: raw shots={len(times)}  ({len(times)/(t1-t0):.2f}/s)")
    print("strongest:", np.round(np.sort(h)[::-1][:10], 1))
    order = np.argsort(-h)
    for sep in (0.15, 0.25, 0.4, 0.7):
        kept = []
        for i in order:
            if all(abs(times[i] - times[j]) > sep for j in kept):
                kept.append(i)
        kept = sorted(kept)
        print(f"  burst sep={sep:.2f}s -> events={len(kept):3d} ({len(kept)/(t1-t0):.2f}/s)  "
              f"times[:12]={np.round(times[kept][:12],2)}")
    print("rms dB p5..p99.9:", round(np.percentile(db, 5), 1), round(np.percentile(db, 99.9), 1))
