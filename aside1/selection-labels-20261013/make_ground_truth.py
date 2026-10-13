#!/usr/bin/env python3
"""Merge canonical review-*.json + dense-review.json into ground-truth.json.

Canonical files are never edited; dense verdicts override them.
Unresolved items (out-of-window kill times, corpse-only probables) are
flagged, never silently kept as exact truth.
"""
import glob
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    windows = {}  # (tag, w) -> record
    for path in sorted(glob.glob(os.path.join(HERE, "review-*.json"))):
        if ".alt-" in path:
            continue
        doc = json.load(open(path))
        for clip, v in doc["clips"].items():
            tag = clip.split("_")[0]
            for w in v["windows"]:
                windows[(tag, w["w"])] = {
                    "tag": tag, "clip": clip, "w": w["w"],
                    "lo": w["lo"], "hi": w["hi"], "peak": w.get("peak"),
                    "verdict": w["verdict"], "kill_times": list(w.get("kill_times", [])),
                    "signals": w.get("signals", []), "source": "canonical",
                }
    dense = json.load(open(os.path.join(HERE, "dense-review.json")))
    for s in dense["sheets"]:
        if s["window"] is None:
            continue
        key = (s["tag"], int(s["window"][1:]))
        rec = windows[key]
        rec["verdict"] = s["dense_verdict"]
        rec["kill_times"] = list(s.get("kill_times", []))
        if s.get("kill_bounds"):
            rec["kill_bounds"] = s["kill_bounds"]
        rec["source"] = "dense"
        rec["dense_signals"] = s.get("signals", [])
    flagged = []
    for rec in windows.values():
        for k in rec["kill_times"]:
            if not (rec["lo"] - 6 <= k <= rec["hi"] + 6):
                rec.setdefault("flags", []).append(
                    f"kill_time {k} outside window {rec['lo']}-{rec['hi']} (suspected mm:ss corruption; unresolved)")
                flagged.append((rec["tag"], rec["w"], k))
        if rec["verdict"] == "probable_kill_verify":
            rec.setdefault("flags", []).append("corpse-only probable; no exact kill time; exclude from timing scoring")
    out = {
        "schema": "selection-ground-truth/v1",
        "provenance": "canonical Stage-1 visual review reconciled by dense-resample review 2026-10-13; exact kill times are emblem/firing frames, not audio peaks",
        "tolerances": {"timing_match_s": 0.5, "edge_scoring_s": 2.0},
        "windows": [windows[k] for k in sorted(windows)],
        "unresolved_flags": flagged,
    }
    with open(os.path.join(HERE, "ground-truth.json"), "w") as f:
        json.dump(out, f, indent=1)
    from collections import Counter
    c = Counter(w["verdict"] for w in out["windows"])
    kills = sum(len(w["kill_times"]) for w in out["windows"])
    print("ground-truth.json:", dict(c), "| exact kill times:", kills, "| flagged:", flagged)


if __name__ == "__main__":
    main()
