"""Step 6: overlay fx verification - A/B diff of with-overlays vs no-overlays."""
from __future__ import annotations
import json
import os
import cv2
import numpy as np

ROOT = r"E:\ai-video-editor"
WITH = os.path.join(ROOT, "output", "step6_with_ov.mp4")
NO = os.path.join(ROOT, "output", "step6_no_ov.mp4")
PLAN = os.path.join(ROOT, "step6_plan.json")


def read(path):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 60.0
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    cap.release()
    return frames, fps


def main():
    plan = json.load(open(PLAN, encoding="utf-8"))
    wins = [(float(o["start"]), float(o["end"]), o["path"].split("\\")[-1])
            for o in plan.get("overlays", [])]
    a, fps = read(WITH)
    b, _ = read(NO)
    n = min(len(a), len(b))
    print(f"with={len(a)} no={len(b)} fps={fps:.1f}")

    diff = np.array([float(cv2.absdiff(a[i], b[i]).mean()) for i in range(n)])
    res = {"fps": round(fps, 2), "frames": n, "windows": [], "baseline": None}
    mask = np.zeros(n, dtype=bool)
    for t0, t1, name in wins:
        f0, f1 = int(t0 * fps), int(t1 * fps)
        seg = diff[f0:f1]
        mask[f0:f1] = True
        res["windows"].append({
            "name": name, "start": t0, "end": t1,
            "mean_diff": round(float(seg.mean()), 2) if len(seg) else 0,
            "max_diff": round(float(seg.max()), 2) if len(seg) else 0,
        })
    base = diff[~mask]
    res["baseline"] = {"mean_diff": round(float(base.mean()), 2),
                       "max_diff": round(float(base.max()), 2)}

    # strips: a middle frame of the first window, with vs without
    t0 = wins[0][0] if wins else 3.0
    strip_dir = os.path.join(ROOT, "output", "strips")
    os.makedirs(strip_dir, exist_ok=True)
    frames = []
    for tag, arr in (("with", a), ("no", b)):
        idx = int((t0 + 0.3) * fps)
        f = cv2.resize(arr[idx], (270, 480))
        cv2.putText(f, tag, (8, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                    (0, 255, 255), 2)
        frames.append(f)
    cv2.imwrite(os.path.join(strip_dir, "step6_overlay_ab.png"),
                np.hstack(frames))

    json.dump(res, open(os.path.join(ROOT, "step6_results.json"), "w",
                        encoding="utf-8"), indent=2)
    print("=== OVERLAY WINDOWS (with vs no overlays frame diff) ===")
    for w in res["windows"]:
        print(f"  {w['name']:28s} @{w['start']:.2f}s "
              f"mean={w['mean_diff']} max={w['max_diff']}")
    print(f"  BASELINE (outside windows) mean={res['baseline']['mean_diff']} "
          f"max={res['baseline']['max_diff']}")
    print("saved step6_results.json; strip -> output/strips/step6_overlay_ab.png")


if __name__ == "__main__":
    main()
