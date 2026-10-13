"""Diagnostic: planned cut times vs beat grid vs detected cuts in the render."""
from __future__ import annotations
import json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, r"E:\ai-video-editor")
from aive import beats as beats_mod
from aive.project import Segment

ROOT = Path(r"E:\ai-video-editor")
PLAN = ROOT / "montage_full.json"
RENDER = ROOT / "output" / "YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p_killmontage.mp4"


def detect_cuts(path: str, thr: float = 0.3) -> list[float]:
    cmd = ["ffmpeg", "-hide_banner", "-i", path, "-filter:v",
           f"select='gt(scene,{thr})',showinfo", "-f", "null", "-"]
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                       text=True, encoding="utf-8", errors="ignore")
    times = [float(m) for m in re.findall(r"pts_time:([0-9.]+)", p.stderr)]
    return times


def main():
    d = json.load(open(PLAN, encoding="utf-8"))
    segs = [Segment(**{k: v for k, v in s.items()
                       if k in Segment.__dataclass_fields__})
            for s in d["segments"]]
    music = d["music"]
    mstart = float(d.get("music_start", 0.0))

    info = beats_mod.detect(music)
    bl = info.beat_len
    print(f"music={Path(music).name}")
    print(f"BPM={info.bpm:.2f} beat_len={bl:.4f}s offset={info.offset:.3f}s "
          f"music_start(win)={mstart:.3f}s")

    # planned render-timeline boundaries
    bounds, t = [], 0.0
    for s in segs:
        bounds.append(t)
        t += s.out_duration
    bounds.append(t)
    print(f"\nsegments={len(segs)} planned video length={t:.3f}s")

    print("\n=== PLANNED CUTS vs BEAT GRID (song time = music_start + video t) ===")
    print(f"{'#':>2} {'vid_t':>7} {'song_t':>7} {'near_beat':>9} {'off_ms':>7} "
          f"{'seg_len':>7}")
    cuts = bounds[1:-1]
    bad = 0
    for i, c in enumerate(cuts):
        sng = mstart + c
        nb = info.nearest_beat(sng)
        off = (sng - nb) * 1000.0
        ln = bounds[i + 1] - bounds[i]
        flag = "" if abs(off) <= 50 else "  <-- OFF GRID"
        if abs(off) > 50:
            bad += 1
        print(f"{i+1:>2} {c:7.3f} {sng:7.3f} {nb:9.3f} {off:7.1f} {ln:7.3f}{flag}")
    print(f"\n{len(cuts)-bad}/{len(cuts)} cuts within 50ms of a beat  "
          f"(beat={bl:.3f}s; a cut every 1 beat={bl:.3f}s, "
          f"2 beats={2*bl:.3f}s, 4 beats={4*bl:.3f}s)")

    # detected cuts in the actual render
    print("\n=== DETECTED CUTS IN RENDER (scene>0.3) ===")
    dc = detect_cuts(str(RENDER))
    print(f"detected={len(dc)}: " + ", ".join(f"{x:.2f}" for x in dc))
    if len(dc) > 1:
        g = [round(dc[i+1]-dc[i], 3) for i in range(len(dc)-1)]
        print("gaps: " + ", ".join(str(x) for x in g))

    # compare
    print("\n=== PLANNED vs DETECTED (nearest) ===")
    for i, c in enumerate(cuts):
        if dc:
            nd = min(dc, key=lambda x: abs(x - c))
            print(f"  planned {c:7.3f}  detected {nd:7.3f}  d={1000*(nd-c):+7.1f}ms")
        else:
            print(f"  planned {c:7.3f}  detected  (none)")


if __name__ == "__main__":
    main()
