#!/usr/bin/env python3
"""Score detector event times against ground-truth.json.

Usage: score_detector.py <events.json ...>   (povkills scan outputs)
Event time fields accepted: source_visual_event | t | time.
Scoring (per project tolerances in ground-truth.json):
  - exact hit: detector event within TIMING_TOL of a GT exact kill time
  - window hit: detector event inside a good window expanded by EDGE on both sides
  - false positive: event inside an exclude window (expanded), or inside a
    corpse-only probable window, or outside every GT window
Multiple events for one kill count once (nearest kept); duplicates reported.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TIMING_TOL = 0.5
EDGE = 2.0


def event_time(e):
    for k in ("source_visual_event", "t", "time"):
        if isinstance(e.get(k), (int, float)):
            return float(e[k])
    return None


def main(paths):
    gt = json.load(open(os.path.join(HERE, "ground-truth.json")))
    by_tag = {}
    for w in gt["windows"]:
        by_tag.setdefault(w["tag"], []).append(w)
    totals = {"kills": 0, "exact_hits": 0, "window_only": 0, "missed": 0,
              "fp_exclude": 0, "fp_probable": 0, "fp_nowhere": 0, "events": 0, "dupes": 0}
    report = {"tolerances": {"timing_tol_s": TIMING_TOL, "edge_s": EDGE}, "clips": {}}
    for path in paths:
        doc = json.load(open(path))
        tag = os.path.basename(path).replace("povkills-", "").replace(".json", "")
        wins = by_tag.get(tag, [])
        good = [w for w in wins if w["verdict"] == "good_kill_window" and w["kill_times"]
                and not w.get("flags")]
        # flagged good windows (corrupt times) are audited separately
        flagged_good = [w for w in wins if w["verdict"] == "good_kill_window" and w.get("flags")]
        excl = [w for w in wins if w["verdict"] == "exclude"]
        prob = [w for w in wins if w["verdict"] == "probable_kill_verify"]
        events = sorted(t for t in (event_time(e) for e in doc["events"]) if t is not None)
        kills = [k for w in good for k in w["kill_times"]]
        hit_kills, details = set(), []
        used = set()
        for k in kills:
            near = [(abs(t - k), t) for t in events if abs(t - k) <= TIMING_TOL]
            if near:
                d, t = min(near)
                hit_kills.add(k); used.add(t)
                details.append({"kill": k, "event": t, "offset": round(t - k, 3), "kind": "exact"})
        window_only = 0
        for w in good:
            if any(k in hit_kills for k in w["kill_times"]):
                continue
            inside = [t for t in events if t not in used and w["lo"] - EDGE <= t <= w["hi"] + EDGE]
            if inside:
                window_only += 1
                used.update(inside[:1])
                details.append({"window": w["w"], "kill_times": w["kill_times"], "event": inside[0], "kind": "window_only"})
        fp = {"exclude": [], "probable": [], "nowhere": []}
        for t in events:
            if t in used:
                continue
            if any(w["lo"] - EDGE <= t <= w["hi"] + EDGE for w in excl):
                fp["exclude"].append(t)
            elif any(w["lo"] - EDGE <= t <= w["hi"] + EDGE for w in prob):
                fp["probable"].append(t)
            elif any(w["lo"] - EDGE <= t <= w["hi"] + EDGE for w in good):
                totals["dupes"] += 1  # extra event inside a hit good window
            else:
                fp["nowhere"].append(t)
        missed = [k for k in kills if k not in hit_kills]
        clip = {"kills": len(kills), "exact_hits": len(hit_kills), "window_only_hits": window_only,
                "missed_kills": missed, "flagged_good_windows_skipped": [w["w"] for w in flagged_good],
                "fp_in_exclude_windows": len(fp["exclude"]), "fp_in_probable_windows": len(fp["probable"]),
                "fp_outside_all_windows": len(fp["nowhere"]), "total_events": len(events),
                "fp_times": fp, "hits": details}
        report["clips"][tag] = clip
        totals["kills"] += len(kills); totals["exact_hits"] += len(hit_kills)
        totals["window_only"] += window_only; totals["missed"] += len(missed)
        totals["fp_exclude"] += len(fp["exclude"]); totals["fp_probable"] += len(fp["probable"])
        totals["fp_nowhere"] += len(fp["nowhere"]); totals["events"] += len(events)
    report["totals"] = totals
    out = os.path.join(HERE, "detector-audit", "povkills-score.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(report, open(out, "w"), indent=1)
    print(json.dumps(totals, indent=1))
    print("->", out)


if __name__ == "__main__":
    main(sys.argv[1:])
