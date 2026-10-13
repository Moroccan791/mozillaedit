#!/usr/bin/env python3
"""Run existing uncalibrated Reyna povkills profile over all 7 raw clips.
Output: detector-audit/povkills-<tag>.json (visual event times only).
"""
import glob
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "setup"))

from aive.povkills import load_profile, scan  # noqa: E402

PROFILE = os.path.join(ROOT, "aside1", "selection-calibration-20261012-153257", "reyna-profile.json")
OUT = os.path.join(HERE, "detector-audit")
os.makedirs(OUT, exist_ok=True)


def main():
    profile = load_profile(PROFILE)
    for src in sorted(glob.glob(os.path.join(ROOT, "raw", "*.mp4"))):
        tag = os.path.basename(src).split("_")[4] if "_" in os.path.basename(src) else os.path.basename(src)
        # tag = video id segment after Media_
        tag = os.path.basename(src).split("Media_")[-1].split("_")[0]
        out = os.path.join(OUT, f"povkills-{tag}.json")
        if os.path.exists(out):
            print(f"skip {tag} (exists)", flush=True)
            continue
        t0 = time.time()
        events = scan(src, profile)
        doc = {"schema": "povkills-audit-run/v1", "profile": "valorant-reyna-default-720p-calibration (uncalibrated)",
               "source": src, "events": events}
        with open(out, "w") as f:
            json.dump(doc, f, indent=1)
        print(f"{tag}: {len(events)} visual events in {time.time()-t0:.1f}s -> {out}", flush=True)


if __name__ == "__main__":
    main()
