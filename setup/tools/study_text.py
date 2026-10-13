"""Measure on-screen text in reference montages (Espresso, Let World Burn).

Two passes:
  1. OCR every Nth frame (rapidocr) -> group into text events
  2. Whisper transcribe the audio -> match on-screen words to vocal timing

Outputs refs_text.json with per-event measurements.
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import cv2
import numpy as np
from rapidocr_onnxruntime import RapidOCR

from tools.transcribe import transcribe

SAMPLE_RATE = 6  # OCR every 6th frame (10fps at 60fps video)


def _norm(s: str) -> str:
    return "".join(c.lower() for c in s if c.isalnum())


def _similar(a: str, b: str) -> bool:
    a, b = _norm(a), _norm(b)
    if not a or not b:
        return False
    if a in b or b in a:
        return True
    common = sum(1 for c in a if c in b)
    return common / max(len(a), len(b)) > 0.7


def measure_video(path: str, engine: RapidOCR) -> dict:
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    nframes = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    events: list[dict] = []
    current: dict | None = None
    frame_idx = 0
    t0 = time.time()
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % SAMPLE_RATE == 0:
            result, _ = engine(frame)
            texts = []
            if result:
                for r in result:
                    texts.append((r[1].strip(), r[2], r[0]))
            if texts:
                best = max(texts, key=lambda x: x[1])
                text, score, bbox = best
            else:
                text, score, bbox = "", 0.0, None
            if text and current and _similar(text, current["text"]):
                current["end_frame"] = frame_idx
                current["samples"].append((frame_idx, text, bbox, score))
            else:
                if current and current["text"]:
                    events.append(current)
                current = {
                    "text": text,
                    "start_frame": frame_idx,
                    "end_frame": frame_idx,
                    "samples": [(frame_idx, text, bbox, score)] if text else [],
                }
        frame_idx += 1
        if frame_idx % 300 == 0:
            print(f"    frame {frame_idx}/{nframes} ({time.time() - t0:.0f}s)", flush=True)
    cap.release()
    if current and current["text"]:
        events.append(current)

    measured = []
    for ev in events:
        if not ev["samples"] or ev["samples"][0][2] is None:
            continue
        bbox = ev["samples"][0][2]
        xs = [p[0] for p in bbox]
        ys = [p[1] for p in bbox]
        x_center = (min(xs) + max(xs)) / 2 / w
        y_center = (min(ys) + max(ys)) / 2 / h
        height_frac = (max(ys) - min(ys)) / h
        width_frac = (max(xs) - min(xs)) / w
        duration = ev["end_frame"] - ev["start_frame"]

        entry = "unknown"
        areas = []
        for _, _, b, _ in ev["samples"][:5]:
            if b is not None:
                xs2 = [p[0] for p in b]
                ys2 = [p[1] for p in b]
                areas.append((max(xs2) - min(xs2)) * (max(ys2) - min(ys2)))
        if len(areas) >= 3 and areas[0] > 0:
            if areas[-1] > areas[0] * 1.3:
                entry = "scale_pop"
            elif areas[-1] < areas[0] * 0.7:
                entry = "shrink"
            else:
                entry = "hard_cut"

        exit_anim = "hard_cut"
        if len(ev["samples"]) >= 2:
            last_scores = [s for _, _, _, s in ev["samples"][-3:]]
            if len(last_scores) >= 2 and last_scores[-1] < last_scores[0] * 0.5:
                exit_anim = "fade"

        color = None
        cap2 = cv2.VideoCapture(path)
        cap2.set(cv2.CAP_PROP_POS_FRAMES, ev["start_frame"])
        ret, frame = cap2.read()
        cap2.release()
        if ret:
            x1, y1 = int(min(xs)), int(min(ys))
            x2, y2 = int(max(xs)), int(max(ys))
            roi = frame[y1:y2, x1:x2]
            if roi.size > 0:
                gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
                thresh = np.percentile(gray, 80)
                mask = gray > thresh
                if mask.sum() > 0:
                    mean_bgr = roi[mask].mean(axis=0)
                    color = {
                        "r": round(float(mean_bgr[2]), 0),
                        "g": round(float(mean_bgr[1]), 0),
                        "b": round(float(mean_bgr[0]), 0),
                    }

        measured.append({
            "text": ev["text"],
            "start_frame": ev["start_frame"],
            "end_frame": ev["end_frame"],
            "duration_frames": duration,
            "x_center": round(x_center, 3),
            "y_center": round(y_center, 3),
            "height_frac": round(height_frac, 3),
            "width_frac": round(width_frac, 3),
            "size_class": "big" if height_frac > 0.15 else "small",
            "entry_anim": entry,
            "exit_anim": exit_anim,
            "color": color,
        })

    return {
        "fps": fps, "width": w, "height": h, "nframes": nframes,
        "duration_s": round(nframes / fps, 2),
        "text_events": len(measured),
        "events": measured,
    }


def main() -> None:
    refs = [
        r"E:\reference\YTDown.com_YouTube_Media_Vp5ClXhplkU_Espresso-Valorant-Montage_002_720p.mp4",
        r"E:\reference\YTDown.com_YouTube_Media_YJWDatNCoCM_Let-The-World-Burn-Valorant-Montage_002_720p.mp4",
    ]
    engine = RapidOCR()
    report = {}
    for ref in refs:
        name = Path(ref).stem[:40]
        print(f"Processing {name}...", flush=True)
        m = measure_video(ref, engine)
        print(f"  Transcribing audio...", flush=True)
        vocal = transcribe(ref, size="base")
        m["vocal_words"] = len(vocal["words"])
        for ev in m["events"]:
            ev["vocal_match"] = None
            ev["timing_error_ms"] = None
            for vw in vocal["words"]:
                vtext = _norm(vw["word"])
                mtext = _norm(ev["text"])
                if vtext and mtext and (vtext in mtext or mtext in vtext):
                    ev["vocal_match"] = vw["word"]
                    ev["timing_error_ms"] = round(
                        (ev["start_frame"] / m["fps"] - vw["start"]) * 1000, 1)
                    break
        report[name] = m
        print(f"  {m['text_events']} events, {m['vocal_words']} vocal words", flush=True)

    out = Path("refs_text.json")
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {out}")


if __name__ == "__main__":
    main()
