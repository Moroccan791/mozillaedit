"""Frame strips around 6 cuts + bloom-at-cut measurement (grid render)."""
from __future__ import annotations
import json, os
import cv2
import numpy as np

ROOT = r"E:\ai-video-editor"
RENDER = os.path.join(ROOT, "output",
    "YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p_killmontage.mp4")
PLAN = os.path.join(ROOT, "step6_grid.json")
OUT = os.path.join(ROOT, "out", "strips")
os.makedirs(OUT, exist_ok=True)

plan = json.load(open(PLAN, encoding="utf-8"))
segs = plan["segments"]
# planned cut times
bounds, _ = [], 0.0
for s in segs:
    d = (s["end"] - s["start"]) / (s.get("speed", 1.0) or 1.0)
    bounds.append(_)
    _ += d
cuts = bounds[1:]

cap = cv2.VideoCapture(RENDER)
fps = cap.get(cv2.CAP_PROP_FPS) or 60.0
frames = []
while True:
    ok, f = cap.read()
    if not ok:
        break
    frames.append(f)
cap.release()
print(f"render frames={len(frames)} fps={fps:.1f} dur={len(frames)/fps:.2f}s")

pick = [0, 2, 4, 7, 10, 13]
offs = [-0.10, -0.033, 0.033, 0.10]
rows = []
bloom = []
for ci in pick:
    c = cuts[ci]
    strip = []
    for o in offs:
        idx = int(round((c + o) * fps))
        idx = max(0, min(len(frames) - 1, idx))
        f = cv2.resize(frames[idx], (180, 320))
        cv2.putText(f, f"{c+o:.2f}", (6, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.55,
                    (0, 255, 255), 2)
        strip.append(f)
    rows.append(np.hstack(strip))
    # bloom: mean luma in first 0.04s of the clip vs baseline later in clip
    i0 = int(round(c * fps))
    i1 = int(round((c + 0.04) * fps))
    ib0 = int(round((c + 0.35) * fps))
    ib1 = int(round((c + 0.55) * fps))
    g = lambda a: float(cv2.cvtColor(frames[a], cv2.COLOR_BGR2GRAY).mean())
    peak = float(np.mean([g(i) for i in range(i0, min(i1, len(frames)))]))
    base = float(np.mean([g(i) for i in range(ib0, min(ib1, len(frames)))]))
    bloom.append((c, peak, base, peak / base if base else 0))

cv2.imwrite(os.path.join(OUT, "grid_cuts_strip.png"), np.vstack(rows))

print("\n=== BLOOM AT CUT (peak luma in first 40ms / baseline later in clip) ===")
ok = 0
for c, p, b, r in bloom:
    good = 1.15 <= r <= 1.8
    ok += good
    print(f"  cut {c:6.3f}s  peak={p:6.1f} base={b:6.1f}  ratio={r:4.2f}x"
          f"{'  OK' if good else '  OUT'}")
print(f"{ok}/{len(bloom)} cuts within target 1.15-1.8x")
print(f"strip -> {os.path.join(OUT,'grid_cuts_strip.png')}")
