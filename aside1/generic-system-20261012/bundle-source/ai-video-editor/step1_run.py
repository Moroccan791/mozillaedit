"""Step 1: Beat Transition Test & Measurement on 6-8s render (fixed time range)."""
from __future__ import annotations
import json
import os
import cv2
import numpy as np
from aive.project import Project, Segment
from aive import render as render_mod
from aive import beats as beats_mod

def measure_render(vid_path: str, cut_times: list[float]) -> dict:
    cap = cv2.VideoCapture(vid_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    
    offsets = [-0.1, -0.03, 0.0, 0.03, 0.1]
    cut_metrics = []
    for ct in cut_times:
        m_sharp = []
        m_bright = []
        for off in offsets:
            t = ct + off
            cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000.0)
            ret, frame = cap.read()
            if not ret or frame is None:
                m_sharp.append(0.0)
                m_bright.append(0.0)
                continue
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            lap = float(cv2.Laplacian(gray, cv2.CV_32F).var())
            bri = float(gray.mean())
            m_sharp.append(lap)
            m_bright.append(bri)
        cut_metrics.append({"t": ct, "sharpness": m_sharp, "brightness": m_bright})
    cap.release()
    return {"fps": fps, "cuts": cut_metrics}

def main():
    source = r"E:\raw clips val\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p.mp4"
    music = r"E:\audio\Dracula (Slowed Best Part) - Tame Impala & JENNIE [Edit Audio].mp3"
    
    beat_info = beats_mod.detect(music)
    bpm = beat_info.bpm
    beat_len = beat_info.beat_len
    
    # Render 6-8s video starting from offset 2.0s
    start_t = 2.0
    dur_total = 7.0
    end_t = start_t + dur_total
    
    cut_times = [t for t in beat_info.beats if start_t <= t <= end_t]
    if not cut_times:
        cut_times = [start_t + i * beat_len for i in range(12)]
    
    # Create segments spanning 7s
    segments = []
    curr = start_t
    seg_dur = 0.5
    for i in range(12):
        segments.append(Segment(start=round(curr, 2), end=round(curr + seg_dur, 2)))
        curr += seg_dur
    
    proj = Project(
        name="step1_test",
        source=source,
        music=music,
        music_start=start_t,
        music_gain_db=-6.0,
        platform="reels",
        aspect="9:16",
        vibe="montage",
        transition={"type": "zoom-blur", "duration": 0.1},
        segments=segments,
        captions_mode="off"
    )
    
    out_path = "output/step1_test.mp4"
    os.makedirs("output", exist_ok=True)
    
    res = render_mod.render(proj, out_path, quality=22)
    print(f"Rendered test video: {res.path}, duration: {res.duration}s")
    
    # Measure cut points relative to video start (0.0 to res.duration)
    # The cuts in video time occur at each segment boundary (0.5s, 1.0s, 1.5s, etc.)
    video_cut_times = [0.5 * i for i in range(1, 12)]
    metrics = measure_render(out_path, video_cut_times[:6])
    
    slick = json.load(open("style_profiles/slick.json", encoding="utf-8"))
    
    results = {
        "reference": slick["transition"],
        "yours": metrics
    }
    with open("step1_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("Saved step1_results.json successfully.")

if __name__ == "__main__":
    main()
