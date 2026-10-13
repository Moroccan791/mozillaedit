"""Step 4: speed ramp + per-clip grade + flash verification on the real render.

Measures the rendered montage (not a skeleton): per-frame luma for flash spikes,
frame-to-frame motion for slow-mo tails, and centre-ROI colour for per-clip
grades. Writes numbers to step4_results.json and frame strips to output/strips.
"""
from __future__ import annotations
import json
import os
import cv2
import numpy as np
from aive.project import Project


PLAN = r"E:\ai-video-editor\step4_plan.json"


def main():
    proj = Project.load(PLAN)
    out = str(proj.root / "output" / f"{proj.name}.mp4")
    segs = proj.segments

    starts, acc = [], 0.0
    for s in segs:
        starts.append(acc)
        acc += s.out_duration
    total = acc

    cap = cv2.VideoCapture(out)
    fps = cap.get(cv2.CAP_PROP_FPS) or 60.0
    luma, rois, prev, diff = [], [], None, []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
        luma.append(float(g.mean()))
        h, w = g.shape
        rois.append(f[h // 3:2 * h // 3, w // 3:2 * w // 3].mean(axis=(0, 1)))
        diff.append(0.0 if prev is None else float(cv2.absdiff(g, prev).mean()))
        prev = g
    cap.release()
    luma = np.array(luma)
    diff = np.array(diff)
    rois = np.array(rois)
    print(f"frames={len(luma)} fps={fps:.1f} total={total:.2f}s out={len(luma)/fps:.2f}s")

    results = {"fps": round(fps, 2), "total_s": round(total, 3),
               "segments": [], "flash": [], "grade": []}

    # ---- per-segment: slow-mo tail (motion) + grade -------------------------
    for i, s in enumerate(segs):
        a = int(starts[i] * fps)
        b = int((starts[i] + s.out_duration) * fps)
        seg_diff = diff[a:b]
        head = float(seg_diff[:int(1.5 * fps)].mean()) if len(seg_diff) else 0
        tail = float(seg_diff[-int(1.0 * fps):].mean()) if len(seg_diff) else 0
        seg_luma = luma[a:b]
        results["segments"].append({
            "i": i, "start": round(starts[i], 3),
            "out_dur": round(s.out_duration, 3),
            "ramp": f"{s.ramp_in}s @ {s.ramp_speed}x",
            "head_motion": round(head, 2), "tail_motion": round(tail, 2),
            "tail_slower": bool(tail < head * 0.95),
            "median_luma": round(float(np.median(seg_luma)), 1),
            "grade": s.grade or proj.grade,
        })

    # ---- flash: brightness spike in first 3 frames of kill clips ------------
    for i, s in enumerate(segs):
        if not s.flash:
            continue
        a = int(starts[i] * fps)
        peak = float(luma[a:a + 3].max()) if a + 3 <= len(luma) else 0
        base = float(np.median(luma[a + 3:a + 40])) if a + 40 <= len(luma) else 0
        results["flash"].append({
            "i": i, "start": round(starts[i], 3),
            "peak_luma": round(peak, 1), "base_luma": round(base, 1),
            "spike": round(peak - base, 1), "white": bool(peak >= 200)})

    # ---- per-clip grade: colour distance seg0 (teal-orange) vs seg1 --------
    def roi_at(i):
        a = int(starts[i] * fps)
        return rois[a + int(0.8 * fps)]
    c0, c1 = roi_at(0), roi_at(1)
    results["grade"] = {"seg0_bgr": [round(x, 1) for x in c0],
                        "seg1_bgr": [round(x, 1) for x in c1],
                        "dist": round(float(np.abs(c0 - c1).mean()), 1)}

    # ---- frame strips around each kill boundary -----------------------------
    strip_dir = os.path.join(proj.root, "output", "strips")
    os.makedirs(strip_dir, exist_ok=True)
    cap = cv2.VideoCapture(out)
    for i, s in enumerate(segs):
        if not s.flash:
            continue
        t0 = starts[i]
        tiles = []
        for off in (-0.10, -0.03, 0.03, 0.10):
            cap.set(cv2.CAP_PROP_POS_MSEC, max(0.0, (t0 + off) * 1000))
            ok, f = cap.read()
            if ok:
                f = cv2.resize(f, (270, 480))
                cv2.putText(f, f"{off:+.2f}s", (8, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                tiles.append(f)
        if tiles:
            strip = np.hstack(tiles)
            cv2.imwrite(os.path.join(strip_dir, f"step4_flash_seg{i}.png"), strip)
    cap.release()

    with open(os.path.join(proj.root, "step4_results.json"), "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2)

    print("\n=== SPEED RAMP (tail motion should be < head) ===")
    for r in results["segments"]:
        print(f"  seg{r['i']} @{r['start']:.2f}s dur={r['out_dur']}s "
              f"head={r['head_motion']} tail={r['tail_motion']} "
              f"slower={r['tail_slower']} grade={r['grade']}")
    print("\n=== FLASH (peak luma at clip start) ===")
    for r in results["flash"]:
        print(f"  seg{r['i']} @{r['start']:.2f}s peak={r['peak_luma']} "
              f"base={r['base_luma']} spike=+{r['spike']} white={r['white']}")
    print("\n=== PER-CLIP GRADE ===")
    print(f"  {results['grade']}")
    print(f"\nstrips -> {strip_dir}")
    print("saved step4_results.json")


if __name__ == "__main__":
    main()
