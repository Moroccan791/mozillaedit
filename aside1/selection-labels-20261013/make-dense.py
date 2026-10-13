#!/usr/bin/env python3
"""Generate dense resample sheets (8fps, 0.1s stamps) for the 15 canonical
probable_kill windows + 8 disputed windows flagged by parallel passes.

Run from this directory:  PATH=/home/user/tools:$PATH python3 make-dense.py
Output: dense/<tag>-dNN.jpg + dense/index.json
"""
import glob, json, os, subprocess, textwrap
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.abspath(os.path.join(HERE, "..", "..", "raw"))
OUT = os.path.join(HERE, "dense")
FFMPEG = "/home/user/tools/ffmpeg"
FONT_DIR = os.path.join(os.path.dirname(HERE), "..", "setup", r"E:\fonts")
TSF = os.path.join(FONT_DIR, "Tinos", "Tinos_700Bold.ttf")

# (tag, id, lo, hi, purpose)
DENSE = [
    ("2Ywo4r3D9DM", "d05", 330.5, 337.0, "canonical probable; kill~333; file lo/hi broken (210.8)"),
    ("2Ywo4r3D9DM", "d06", 258.0, 267.5, "canonical probable; muzzle-flash kill~262.8"),
    ("2Ywo4r3D9DM", "d08", 287.2, 296.7, "canonical probable; kill~292.5 red diamond"),
    ("2Ywo4r3D9DM", "d09", 311.9, 321.4, "canonical probable; kill~318.5 emblem"),
    ("56-Wg-oTX6M",  "d00",  47.4,  56.9, "canonical probable; banner-edge kill~54.2"),
    ("56-Wg-oTX6M",  "d10", 413.5, 423.5, "canonical probable; pre-window kill claim~416.5"),
    ("ObWy97A6INU",  "d01",  43.5,  54.7, "canonical probable; pre-window kill~45.5 + transition"),
    ("ObWy97A6INU",  "d07", 340.3, 349.5, "canonical probable; kill~341.5 AND scope shot~348"),
    ("ObWy97A6INU",  "d08", 355.0, 366.2, "canonical probable; pre-window kill~358 (corpse+devour)"),
    ("ObWy97A6INU",  "d11", 504.4, 513.6, "canonical probable; kill~505.5 aftermath"),
    ("iufseng8xEs",  "d08", 299.7, 310.9, "DISPUTE: canon 301.5/306.5 vs e023fb2 304.1/308.5 vs alt 304.5"),
    ("z0ALKJiFRDU",  "d00",  42.8,  52.0, "canonical probable; kill~44.5"),
    ("z0ALKJiFRDU",  "d08", 354.9, 364.1, "canonical probable; kill~358.9"),
    ("z0ALKJiFRDU",  "d09", 366.6, 375.8, "canonical probable; kill~367.8"),
    ("z0ALKJiFRDU",  "d11", 448.3, 457.5, "canonical probable; kill~449.8"),
    ("Z210dNkaapY",  "d02",  97.0, 106.5, "DISPUTE: alt flags 97.5/102.7 probable vs canonical exclude"),
    ("Z210dNkaapY",  "d03", 105.0, 115.5, "DISPUTE: CLUTCH kill 107.5?"),
    ("Z210dNkaapY",  "d06", 284.0, 290.5, "DISPUTE: shot-no-kill edge 287"),
    ("Z210dNkaapY",  "d08", 301.5, 310.0, "DISPUTE: alt probable 304.5 vs canonical good 307.0"),
    ("Z210dNkaapY",  "d09", 352.0, 363.5, "DISPUTE: pre-window kill 355.5 vs canonical good 361.4"),
    ("Z210dNkaapY",  "d11", 414.0, 421.0, "DISPUTE: WON-kill 416 vs canonical exclude"),
    ("iufseng8xEs",  "d01",  64.5,  73.0, "DISPUTE: e023fb2 probable (edge kill~70) vs canonical exclude"),
    ("iufseng8xEs",  "d09", 357.0, 367.5, "DISPUTE: e023fb2 second kill 364.1"),
]

TILE_W, TILE_H, COLS, ROWS = 304, 171, 9, 8
HEADER = 40
MAXF = COLS * ROWS


def source(tag):
    hits = glob.glob(os.path.join(RAW, f"YTDown.com_YouTube_Media_{tag}_*.mp4"))
    if len(hits) != 1:
        raise SystemExit(f"source lookup failed for {tag}: {hits}")
    return hits[0]


def stamp(sec):
    m, s = divmod(max(sec, 0.0), 60.0)
    return f"{int(m)}:{s:04.1f}"


def build(tag, wid, lo, hi, purpose):
    dur = hi - lo
    fps = min(8.0, MAXF / dur)
    src = source(tag)
    tmpdir = os.path.join(OUT, "_tmp")
    os.makedirs(tmpdir, exist_ok=True)
    for f in glob.glob(os.path.join(tmpdir, "*.jpg")):
        os.remove(f)
    subprocess.run(
        [FFMPEG, "-v", "error", "-ss", f"{lo:.3f}", "-t", f"{dur:.3f}",
         "-i", src, "-vf", f"fps={fps:.4f},scale={TILE_W}:{TILE_H}",
         "-frames:v", str(MAXF), "-q:v", "3",
         os.path.join(tmpdir, "f%03d.jpg")],
        check=True)
    frames = sorted(glob.glob(os.path.join(tmpdir, "*.jpg")))
    rows = (len(frames) + COLS - 1) // COLS
    sheet = Image.new("RGB", (COLS * TILE_W, HEADER + rows * TILE_H), (10, 10, 14))
    d = ImageDraw.Draw(sheet)
    f_hdr = ImageFont.truetype(TSF, 22)
    f_ts = ImageFont.truetype(TSF, 15)
    header = f"{tag}  {wid}  {stamp(lo)}-{stamp(hi)}  fps={fps:.1f}  {purpose}"
    d.text((8, 8), header, font=f_hdr, fill=(255, 255, 255))
    for i, fp in enumerate(frames):
        t = lo + i / fps
        x, y = (i % COLS) * TILE_W, HEADER + (i // COLS) * TILE_H
        sheet.paste(Image.open(fp), (x, y))
        lab = stamp(t)
        w = d.textlength(lab, font=f_ts)
        d.rectangle([x + 2, y + 2, x + 6 + w, y + 22], fill=(0, 0, 0))
        d.text((x + 5, y + 3), lab, font=f_ts, fill=(255, 214, 0))
    out = os.path.join(OUT, f"{tag}-{wid}.jpg")
    sheet.save(out, quality=82)
    print(f"{os.path.basename(out):34s} frames={len(frames):2d}  {purpose[:60]}")
    return {"tag": tag, "id": wid, "lo": lo, "hi": hi, "fps": fps,
            "frames": len(frames), "purpose": purpose,
            "sheet": os.path.relpath(out, HERE)}


def main():
    os.makedirs(OUT, exist_ok=True)
    index = [build(*row) for row in DENSE]
    with open(os.path.join(OUT, "index.json"), "w") as f:
        json.dump(index, f, indent=1)
    print(f"\n{len(index)} dense sheets -> {OUT}")


if __name__ == "__main__":
    main()
