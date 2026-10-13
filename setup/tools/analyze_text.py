import json

r = json.load(open("refs_text.json", encoding="utf-8"))
for name, m in r.items():
    print("==", name[:50])
    evs = sorted(m["events"], key=lambda e: e["start_frame"])
    for e in evs:
        if e["size_class"] == "big" or (
            0.2 < e["x_center"] < 0.8 and 0.1 < e["y_center"] < 0.9 and e["duration_frames"] < 40
        ):
            print(
                f"  f{e['start_frame']:4d}-{e['end_frame']:4d} ({e['duration_frames']:3d}f)"
                f" h={e['height_frac']:.2f} x={e['x_center']:.2f} y={e['y_center']:.2f}"
                f" {e['size_class']:4s} {e['entry_anim']:10s} {e['text'][:30]!r}"
            )
