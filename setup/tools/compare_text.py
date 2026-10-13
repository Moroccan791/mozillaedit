"""Measure text in our render and compare to references."""
import json
import sys
from pathlib import Path

sys.path.insert(0, ".")
from tools.study_text import measure_video
from rapidocr_onnxruntime import RapidOCR

OURS = r"projects\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p\output\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p_killmontage.mp4"

engine = RapidOCR()
m = measure_video(OURS, engine)

# Load lyrics for timing comparison
lyrics_path = Path(r"E:\audio\Dracula (Slowed Best Part) - Tame Impala & JENNIE [Edit Audio]_words.json")
ldata = json.loads(lyrics_path.read_text(encoding="utf-8"))
vocal_words = ldata["words"]

def _norm(s):
    return "".join(c.lower() for c in s if c.isalnum())

for ev in m["events"]:
    ev["vocal_match"] = None
    ev["timing_error_ms"] = None
    for vw in vocal_words:
        vtext = _norm(vw["word"])
        mtext = _norm(ev["text"])
        if vtext and mtext and (vtext in mtext or mtext in vtext):
            ev["vocal_match"] = vw["word"]
            ev["timing_error_ms"] = round(
                (ev["start_frame"] / m["fps"] - vw["start"]) * 1000, 1)
            break

# Summary
big = [e for e in m["events"] if e["size_class"] == "big"]
small = [e for e in m["events"] if e["size_class"] == "small"]
timing_errs = [e["timing_error_ms"] for e in m["events"] if e["timing_error_ms"] is not None]

print("=== OUR OUTPUT ===")
print(f"duration: {m['duration_s']}s  events: {m['text_events']}  big: {len(big)}  small: {len(small)}")
print(f"big height_frac range: ({min(e['height_frac'] for e in big):.3f}, {max(e['height_frac'] for e in big):.3f})" if big else "no big")
print(f"small height_frac range: ({min(e['height_frac'] for e in small):.3f}, {max(e['height_frac'] for e in small):.3f})" if small else "no small")
print(f"timing errors (ms): {timing_errs[:15]}")
print(f"mean timing error: {sum(timing_errs)/len(timing_errs):.1f}ms" if timing_errs else "no matches")
print()
print("Big words:")
for e in big[:10]:
    print(f"  f{e['start_frame']:4d} h={e['height_frac']:.2f} x={e['x_center']:.2f} y={e['y_center']:.2f} {e['text'][:25]!r}")
print("Small words:")
for e in small[:10]:
    print(f"  f{e['start_frame']:4d} h={e['height_frac']:.2f} x={e['x_center']:.2f} y={e['y_center']:.2f} {e['text'][:25]!r}")

# Compare to refs
refs = json.load(open("refs_text.json", encoding="utf-8"))
print("\n=== REFERENCE COMPARISON ===")
for name, rm in refs.items():
    rbig = [e for e in rm["events"] if e["size_class"] == "big"]
    rsmall = [e for e in rm["events"] if e["size_class"] == "small"]
    print(f"{name[:40]}: events={rm['text_events']} big={len(rbig)} small={len(rsmall)} "
          f"big_h=({min(e['height_frac'] for e in rbig):.2f}-{max(e['height_frac'] for e in rbig):.2f}) "
          f"small_h=({min(e['height_frac'] for e in rsmall):.2f}-{max(e['height_frac'] for e in rsmall):.2f})"
          if rbig and rsmall else f"{name[:40]}: events={rm['text_events']}")
