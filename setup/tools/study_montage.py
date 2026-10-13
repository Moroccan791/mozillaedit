"""Measure the style of reference montages (and later, our own output).

Two layers:
  1. Audio: BPM / beat grid (aive.beats) + cut->beat sync.
  2. Vision (OpenCV): per-frame brightness, saturation, hue, sharpness and
     frame-diff -> cut detection, transition length, effect classification
     (blur / flash / B&W / invert), colour shift between shots, slow-mo holds.

Writes refs_measurements.json. Nothing is guessed: each number is computed, and
anything we cannot measure is reported as null with a note.
"""
from __future__ import annotations

import glob
import json
import os
import sys

import cv2
import numpy as np

from aive import beats as B
from aive import music as M

FPS_HINT = 60.0
W = 320
REPORT: dict = {"references": {}, "aggregate": {}, "notes": []}


def probe_fps(path: str) -> float:
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or FPS_HINT
    cap.release()
    return float(fps)


def read_frames(path: str):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or FPS_HINT
    grays, sats, hues, vmean, lap = [], [], [], [], []
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        h, w0 = fr.shape[:2]
        small = cv2.resize(fr, (W, int(h * W / w0)))
        g = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
        S = hsv[:, :, 1].astype(np.float32)
        H = hsv[:, :, 0].astype(np.float32)
        ang = H * (np.pi / 90.0)
        mh = np.arctan2(np.mean(S * np.sin(ang)), np.mean(S * np.cos(ang)))
        grays.append(g.astype(np.float32))
        sats.append(float(S.mean()))
        hues.append(float(np.degrees(mh) % 360.0))
        vmean.append(float(g.mean()))
        lap.append(float(cv2.Laplacian(g, cv2.CV_32F).var()))
    cap.release()
    return (fps, grays, np.array(sats), np.array(hues),
            np.array(vmean), np.array(lap))


def find_cuts(grays: list[np.ndarray], fps: float) -> list[int]:
    d = np.array([np.mean(np.abs(grays[i] - grays[i - 1]))
                  for i in range(1, len(grays))])
    if d.size < 4:
        return []
    med = np.median(d)
    mad = np.median(np.abs(d - med)) + 1e-6
    thr = max(med + 0.0, med + 6.0 * mad, np.percentile(d, 96))
    cuts = []
    min_sep = max(2, int(0.03 * fps))
    for i in range(1, d.size - 1):
        if d[i] >= thr and d[i] >= d[i - 1] and d[i] >= d[i + 1]:
            if not cuts or i - cuts[-1] >= min_sep:
                cuts.append(i)
    return cuts


def classify_cut(idx: int, grays, sats, hues, vmean, lap, fps) -> dict:
    lo, hi = max(0, idx - 3), min(len(grays), idx + 4)
    base_v = np.median(vmean[max(0, idx - 8):idx]) if idx > 8 else np.median(vmean)
    base_s = np.median(sats[max(0, idx - 8):idx]) if idx > 8 else np.median(sats)
    base_lap = np.median(lap[max(0, idx - 12):idx]) + 1e-6
    win_v = vmean[lo:hi]
    win_s = sats[lo:hi]
    win_lap = lap[lo:hi]

    flash = bool((win_v.max() > base_v + 45) or (win_v.min() < base_v - 55))
    bw = bool(win_s.min() < 8 and base_s > 25)
    # invert: strong negative correlation across the cut
    a = grays[idx - 1].astype(np.float32).ravel()
    b = grays[idx].astype(np.float32).ravel()
    corr = float(np.corrcoef(a, b)[0, 1]) if a.std() > 0 and b.std() > 0 else 1.0

    # blur transition: sharpness collapses around the cut
    blur_len = 0
    for k in range(max(0, idx - 2), min(len(lap), idx + 4)):
        if lap[k] < 0.55 * base_lap:
            blur_len += 1
    blur = blur_len >= 2
    ftype = "hard"
    if bw:
        ftype = "bw"
    elif flash:
        ftype = "flash"
    elif corr < -0.25:
        ftype = "invert"
    elif blur:
        ftype = "blur"
    return {"type": ftype, "blur_len": blur_len, "flash": flash, "bw": bw,
            "corr": round(corr, 2), "sat": round(float(win_s.min()), 1)}


def analyze_file(path: str) -> dict:
    fps, grays, sats, hues, vmean, lap = read_frames(path)
    n = len(grays)
    dur = n / fps
    bt = B.detect(path)
    prof = M.analyze(path)
    beat_len = 60.0 / bt.bpm if bt.bpm else 0.0
    half = beat_len / 2

    cuts = find_cuts(grays, fps)
    infos = [classify_cut(c, grays, sats, hues, vmean, lap, fps) for c in cuts]
    types = {"hard": 0, "blur": 0, "flash": 0, "bw": 0, "invert": 0}
    blur_lens = []
    for inf in infos:
        types[inf["type"]] += 1
        if inf["type"] == "blur":
            blur_lens.append(inf["blur_len"])
    ncut = len(cuts)
    effect = ncut - types["hard"]
    frac_effect = effect / ncut if ncut else 0.0

    # cut -> beat alignment (reuse phase-optimised grid fit)
    bt_times = np.array(bt.beats)
    cut_t = np.array(cuts) / fps + 1.0 / fps
    d = np.array([np.min(np.abs(bt_times - t)) for t in cut_t]) if bt_times.size else np.array([])

    # effect cuts vs beats / downbeats
    beats_in = (bt_times <= dur)
    down = bt_times[::4]
    eff_t = cut_t[[i for i, inf in enumerate(infos) if inf["type"] != "hard"]]
    on_beat = int(sum(1 for t in eff_t if bt_times.size and np.min(np.abs(bt_times - t)) < 0.04))
    on_down = int(sum(1 for t in eff_t if down.size and np.min(np.abs(down - t)) < 0.05))

    # colour shift between consecutive shots
    shot_bounds = [0] + [c for c in cuts] + [n - 1]
    hue_diff, sat_diff = [], []
    for a, b in zip(shot_bounds[:-1], shot_bounds[1:]):
        if b <= a:
            continue
        ha, hb = hues[a], hues[b]
        dh = abs((hb - ha + 180) % 360 - 180)
        hue_diff.append(dh)
        sat_diff.append(abs(sats[a] - sats[b]))

    # slow-mo holds: near-duplicate frames
    dgr = np.array([np.mean(np.abs(grays[i] - grays[i - 1])) for i in range(1, n)])
    dup = dgr < (np.median(dgr) * 0.15 + 1e-4)
    runs, cur = [], 0
    for v in dup:
        cur = cur + 1 if v else 0
        if cur:
            runs.append(cur)
    longest_hold = int(max(runs)) if runs else 0

    return {
        "file": os.path.basename(path),
        "duration": round(dur, 2), "fps": round(fps, 1),
        "bpm": round(bt.bpm, 1), "beat_len": round(beat_len, 3),
        "cuts": ncut, "cuts_per_sec": round(ncut / dur, 2) if dur else 0,
        "cuts_per_beat": round((ncut / (dur / beat_len)), 2) if beat_len else 0,
        "transition": {
            "effect_fraction": round(frac_effect, 2),
            "hard_fraction": round(types["hard"] / ncut, 2) if ncut else 0,
            "blur_len_frames_mean": round(float(np.mean(blur_lens)), 1) if blur_lens else None,
            "blur_len_frames_max": (int(max(blur_lens)) if blur_lens else None),
        },
        "effect_types": types,
        "effects_per_beat": round(effect / (dur / beat_len), 2) if beat_len else 0,
        "effect_on_beat_pct": round(100 * on_beat / len(eff_t), 0) if len(eff_t) else None,
        "effect_on_downbeat_pct": round(100 * on_down / len(eff_t), 0) if len(eff_t) else None,
        "cut_to_beat_ms_mean": round(float(d.mean()) * 1000, 0) if d.size else None,
        "cut_to_beat_within40ms_pct": round(100 * float((d < 0.04).mean()), 0) if d.size else None,
        "colour_shift": {"hue_deg_mean": round(float(np.mean(hue_diff)), 1) if hue_diff else None,
                         "sat_mean": round(float(np.mean(sat_diff)), 1) if sat_diff else None},
        "slowmo_longest_hold_frames": longest_hold,
        "slowmo_hold_fraction": round(float(dup.mean()), 3),
        "clip_start_to_shot_s": None,
        "_note_clip_start_to_shot": "not measurable in references (no kill ground truth)",
    }


def main() -> None:
    files = sys.argv[1:] or sorted(glob.glob("E:/reference/*.mp4"))
    for f in files:
        try:
            m = analyze_file(f)
            REPORT["references"][m["file"]] = m
            print(json.dumps(m, indent=2))
        except Exception as e:  # noqa: BLE001
            print(f"{os.path.basename(f)} ERR {e}")
    # aggregate over the two named refs (all, really)
    vals = list(REPORT["references"].values())
    if vals:
        def avg(k, sub=None):
            xs = [(v.get("transition", {}).get(k) if sub else v.get(k))
                  for v in vals]
            xs = [x for x in xs if isinstance(x, (int, float))]
            return round(float(np.mean(xs)), 2) if xs else None
        REPORT["aggregate"] = {
            "n_files": len(vals),
            "cuts_per_sec_mean": avg("cuts_per_sec"),
            "effect_fraction_mean": avg("effect_fraction", "transition"),
            "blur_len_frames_mean": avg("blur_len_frames_mean", "transition"),
            "cut_to_beat_ms_mean": avg("cut_to_beat_ms_mean"),
            "hue_shift_deg_mean": avg("hue_deg_mean", "colour_shift"),
        }
    REPORT["notes"] = [
        "vision metrics from OpenCV frame analysis at 320px width",
        "cut = robust frame-diff spike; effect = blur/flash/bw/invert near cut",
        "cut->beat uses aive.beats grid (own detector, not librosa)",
        "clip_start_to_shot not measurable without kill ground truth",
    ]
    out = "refs_measurements.json"
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(REPORT, fh, indent=2)
    print(f"\nwrote {out}")


if __name__ == "__main__":
    main()
