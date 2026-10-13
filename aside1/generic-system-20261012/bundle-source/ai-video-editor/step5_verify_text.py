"""Step 5: Optimized Text verification with shifted timestamps + ASS generation."""
from __future__ import annotations
import json
import os
from pathlib import Path
import cv2
import numpy as np
from aive.project import Project, Segment
from aive import render as render_mod
from aive import conductor

def main():
    source = r"E:\raw clips val\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p.mp4"
    music = r"E:\audio\Dracula (Slowed Best Part) - Tame Impala & JENNIE [Edit Audio].mp3"
    
    segments = [
        Segment(start=0.0, end=4.0),
    ]
    
    proj = Project(
        name="step5_text_test",
        source=source,
        music=music,
        music_start=0.0,
        music_gain_db=-6.0,
        platform="reels",
        aspect="9:16",
        reframe="crop",
        vibe="montage",
        transition={"type": "zoom-blur", "duration": 0.1},
        segments=segments,
        captions_mode="lyrics"
    )
    
    os.makedirs("output", exist_ok=True)
    out_with = "output/step5_with_text.mp4"
    out_without = "output/step5_without_text.mp4"
    
    # Generate ASS file via conductor step_captions
    proj.root = Path("projects/step5_text_test")
    proj.root.mkdir(parents=True, exist_ok=True)
    ass_path = conductor.step_captions(proj)
    print(f"Generated ASS: {ass_path}")
    
    # Render with text
    render_mod.render(proj, out_with, ass_path=ass_path, quality=22)
    # Render without text
    render_mod.render(proj, out_without, ass_path=None, quality=22)
    
    cap_w = cv2.VideoCapture(out_with)
    cap_no = cv2.VideoCapture(out_without)
    fps = cap_w.get(cv2.CAP_PROP_FPS) or 60.0
    frame_h = cap_w.get(cv2.CAP_PROP_FRAME_HEIGHT) or 1920.0
    
    print("\n=== TIMELINE SCAN FOR TEXT DIFF (Shifted Timestamps) ===")
    found = False
    frame_idx = 0
    while True:
        ret_w, fw = cap_w.read()
        ret_no, fno = cap_no.read()
        if not ret_w or not ret_no:
            break
            
        t = frame_idx / fps
        diff = cv2.absdiff(fw, fno)
        gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        if gray_diff.max() > 20:
            _, thresh = cv2.threshold(gray_diff, 20, 255, cv2.THRESH_BINARY)
            coords = cv2.findNonZero(thresh)
            if coords is not None:
                x, y, w, h = cv2.boundingRect(coords)
                height_pct = (h / frame_h) * 100.0
                print(f"Found diff at t={t:.2f}s (frame {frame_idx}): bbox h={h} ({height_pct:.1f}% of frame height)")
                if height_pct >= 15.0:
                    print(f"  [PASS] Height {height_pct:.1f}% >= 15% threshold.")
                    found = True
                    break
        frame_idx += 1
        if frame_idx > int(fps * 4.0):
            break
            
    cap_w.release()
    cap_no.release()
    if not found:
        print("  [WARN] No text bounding box >= 15% height found.")

if __name__ == "__main__":
    main()