#!/usr/bin/env python3
"""Detector audit: aive.povkills + aive.killfeed vs corrected ground truth.

Ground truth = review-*.json reconciled by dense-review.json (this folder).
Evaluation is windowed to the 84 labeled windows expanded by +-2s (edge
scoring, per DENSE-REVIEW lessons); it is NOT a full-source scan and makes
no full-source precision/recall claim. Both detectors run through their
production scoring code (povkills._read_roi/gradient_features/
detect_temporal; killfeed.detect_changes) -- only the scan loop is
windowed, and pov temporal state resets per window (the 2s pad gives the
detector its required low-frame arming time).

Run:  PATH=<venv>/bin:$PATH <venv>/bin/python detector-audit.py
Output: detector-audit.json in this folder.
"""
import json, math, os, sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(ROOT / "setup"))
from aive import povkills, killfeed  # noqa: E402
from aive.events import EventCandidate  # noqa: E402
from aive.ffprobe import probe  # noqa: E402

EDGE = 2.0            # +-s window expansion for scoring
TOL_STRICT = 0.5      # |detector_t - kill_t| for an exact-time hit
KILLFEED_POST = 1.5   # kill-feed row may lag the kill

PROFILES = {
    "baseline": ROOT / "aside1/selection-calibration-20261012-153257/reyna-profile.json",
    "expanded": ROOT / "aside1/selection-calibration-20261012-153257/reyna-expanded-profile.json",
}

FP_KEYWORDS = [
    ("scoreboard", ["scoreboard", "TAB"]),
    ("round-end sting", ["WON", "CLUTCH", "THRIFTY", "VICTORY", "round-end", "round win", "BUY PHASE", "buy-phase", "buy phase"]),
    ("death/spectate", ["death", "dead-state", "spectate", "corpse-cam"]),
    ("sponsor/voiceover", ["sponsor", "voiceover", "subscribe"]),
    ("source-edit transition", ["whip", "rainbow", "green-flash", "green flash", "transition", "smear", "blood"]),
    ("ability cast", ["ability", "ult", "Thrash", "nade", "explosion", "scope (orange", "devour"]),
    ("shots-no-kill", ["shots-no-kill", "shot-no-kill", "no-kill", "duel"]),
    ("rotation/walking", ["rotation", "walking", "corridor", "repositioning"]),
    ("buy/pickup", ["knife", "pickup"]),
    ("black/idle", ["black", "intro", "passive", "hold", "aiming"]),
]


def fp_class(win):
    text = " ".join(win.get("signals", [])) + " " + win.get("notes", "")
    for name, keys in FP_KEYWORDS:
        if any(k in text for k in keys):
            return name
    return "other"


def ground_truth():
    dense = json.loads((HERE / "dense-review.json").read_text())
    by_win = {}
    for s in dense["sheets"]:
        if s["window"]:
            by_win[(s["tag"], int(s["window"][1:]))] = s
    gt = {}  # (tag, w) -> dict
    for f in sorted(HERE.glob("review-*.json")):
        if "alt" in f.name:
            continue
        d = json.loads(f.read_text())
        for clip, v in d["clips"].items():
            tag = clip.split("_")[0]
            src = next((ROOT / "raw").glob(f"YTDown.com_YouTube_Media_{tag}_*.mp4"))
            for w in v["windows"]:
                key = (tag, w["w"])
                verdict, kills = w["verdict"], list(w.get("kill_times", []))
                suspect = any(not (w["lo"] - 6 <= k <= w["hi"] + 6) for k in kills)
                if key in by_win:
                    s = by_win[key]
                    verdict = s["dense_verdict"]
                    kills = list(s.get("kill_times", []))
                    suspect = False
                gt[key] = {"tag": tag, "w": w["w"], "lo": w["lo"], "hi": w["hi"],
                           "verdict": verdict, "kill_times": kills,
                           "suspect_time": suspect, "source": str(src),
                           "fp_class": fp_class(w) if verdict == "exclude" else None}
    return gt


def povkills_window(src, lo, hi, media, cfgs):
    """Score one span with every profile; frames decoded once (shared ROI)."""
    cfg0 = cfgs[0][1]
    hz = cfg0["sample_hz"]
    start = max(0.0, lo)
    count = max(1, round((hi - start) * hz))
    frames = povkills._read_roi(Path(src), start, count,
                                media.video.width, media.video.height, cfg0)
    out = {}
    if not len(frames):
        return {name: {"events": [], "max_score": None} for name, _ in cfgs}
    mask = povkills.ellipse_mask(cfg0)
    feats = povkills.gradient_features(frames, mask).reshape(len(frames), -1)
    masked = frames[:, mask.astype(bool)].astype(np.float32)
    guard = cfg0.get("guard", {})
    good = ((masked.std(axis=1) >= float(guard.get("min_std", 2.0)))
            & (masked.mean(axis=1) < float(guard.get("max_mean", 245.0))))
    prev = None
    for i, fr in enumerate(frames):
        if prev is not None and np.mean(np.abs(fr.astype(np.float32) - prev)) > float(guard.get("max_change", 55.0)):
            good[i] = False
        prev = fr.astype(np.float32)
    times = start + np.arange(len(frames)) / hz
    for name, cfg in cfgs:
        vectors = povkills._template_vectors(cfg)
        matrix = np.clip(feats @ vectors.T, 0, 1)
        thresholds = np.array([t["threshold"] for t in cfg["templates"]])
        best = np.argmax(matrix - thresholds, axis=1)
        scores = matrix[np.arange(len(frames)), best]
        events = povkills.detect_temporal(
            times, scores, threshold=thresholds[np.asarray(best)],
            valid=good, **cfg["temporal"])
        out[name] = {
            "events": [{"t": round(e["t"], 3), "score": round(e["score"], 3)} for e in events],
            "max_score": round(float(scores.max()), 3),
            "max_t": round(float(times[int(scores.argmax())]), 3),
            "valid_frac": round(float(good.mean()), 3),
        }
    return out


def main():
    gt = ground_truth()
    cfgs = [(name, povkills.load_profile(p)) for name, p in PROFILES.items()]
    firing = {}
    for f in sorted((HERE / "firing-maps").glob("*.json")):
        d = json.loads(f.read_text())
        firing[f.name.split("_")[0]] = d["candidate_events"]

    by_source = {}
    for item in gt.values():
        by_source.setdefault(item["source"], []).append(item)

    results = []
    for src, wins in sorted(by_source.items()):
        media = probe(src)
        tag = wins[0]["tag"]
        transients_all = [EventCandidate(source=src, t=float(e["time"]),
                                         strength=float(e.get("strength", 0.0)))
                          for e in firing[tag]]
        for w in sorted(wins, key=lambda x: x["w"]):
            lo, hi = w["lo"] - EDGE, w["hi"] + EDGE
            pov = povkills_window(src, lo, hi, media, cfgs)
            win_transients = [t for t in transients_all if lo <= t.t <= hi]
            kf = []
            if win_transients:
                try:
                    kf = killfeed.detect_changes(src, win_transients)
                except Exception as e:  # keep audit going; record failure
                    kf = [{"error": str(e)[:200]}]
            results.append({**{k: w[k] for k in ("tag", "w", "lo", "hi", "verdict",
                                                 "kill_times", "suspect_time", "fp_class")},
                            "povkills": pov,
                            "killfeed": [{"t": c.get("t"), "change_score": c.get("change_score")}
                                         for c in kf if "t" in c],
                            "killfeed_errors": [c["error"] for c in kf if "error" in c],
                            "n_audio_candidates_in_window": len(win_transients)})
            print(f"{tag} w{w['w']:02d} {w['verdict']:22s} done", flush=True)

    (HERE / "detector-audit.json").write_text(json.dumps(
        {"edge_s": EDGE, "tol_strict_s": TOL_STRICT, "killfeed_post_s": KILLFEED_POST,
         "profiles": {k: str(v) for k, v in PROFILES.items()}, "windows": results},
        indent=1))
    print(f"\n{len(results)} windows -> detector-audit.json")


if __name__ == "__main__":
    main()
