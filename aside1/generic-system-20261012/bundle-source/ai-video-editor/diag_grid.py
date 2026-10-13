"""Print planned cuts vs beat grid for a plan JSON (no render needed)."""
from __future__ import annotations
import json, sys
from pathlib import Path
sys.path.insert(0, r"E:\ai-video-editor")
from aive import beats as beats_mod
from aive.project import Segment, Project

plan = sys.argv[1] if len(sys.argv) > 1 else r"E:\ai-video-editor\step6_grid.json"
d = json.load(open(plan, encoding="utf-8"))
segs = [Segment(**{k: v for k, v in s.items()
                   if k in Segment.__dataclass_fields__}) for s in d["segments"]]
info = beats_mod.detect(d["music"])
mstart = float(d.get("music_start", 0.0))
bl = info.beat_len
print(f"BPM={info.bpm:.2f} beat_len={bl:.4f}s music_start={mstart:.4f}s "
      f"segments={len(segs)}")

bounds, t = [0.0], 0.0
for s in segs:
    t += s.out_duration
    bounds.append(t)
print(f"planned video length={t:.3f}s")
print(f"\n{'#':>2} {'cut_t':>7} {'song_t':>7} {'near_beat':>9} {'off_ms':>7} "
      f"{'slot':>7}")
bad = 0
for i in range(1, len(bounds) - 1):
    c = bounds[i]
    sng = mstart + c
    nb = info.nearest_beat(sng)
    off = (sng - nb) * 1000.0
    ln = bounds[i + 1] - bounds[i]
    flag = "" if abs(off) <= 16.7 else "  <-- OFF"
    if abs(off) > 16.7:
        bad += 1
    print(f"{i:>2} {c:7.3f} {sng:7.3f} {nb:9.3f} {off:7.1f} {ln:7.3f}{flag}")
print(f"\n{len(bounds)-2-bad}/{len(bounds)-2} cuts within 1 frame (16.7ms) of a beat")
