"""Step 2: Motion-Matched Cuts using OpenCV optical flow."""
from __future__ import annotations
import cv2
import numpy as np
import glob
import os

def compute_optical_flow_score(clip_a_path: str, clip_b_path: str) -> float:
    """Compare last 0.2s of clip A and first 0.2s of clip B using Farneback optical flow."""
    cap_a = cv2.VideoCapture(clip_a_path)
    fps_a = cap_a.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames_a = int(cap_a.get(cv2.CAP_PROP_FRAME_COUNT) or 300)
    
    # Read last ~0.2s of A (e.g. 6 frames)
    frames_a = []
    start_a = max(0, total_frames_a - int(fps_a * 0.2))
    cap_a.set(cv2.CAP_PROP_POS_FRAMES, start_a)
    while True:
        ret, frame = cap_a.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frames_a.append(cv2.resize(gray, (160, 90)))
    cap_a.release()
    
    cap_b = cv2.VideoCapture(clip_b_path)
    fps_b = cap_b.get(cv2.CAP_PROP_FPS) or 30.0
    frames_b = []
    cap_b.set(cv2.CAP_PROP_POS_FRAMES, 0)
    read_count = int(fps_b * 0.2)
    for _ in range(read_count):
        ret, frame = cap_b.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frames_b.append(cv2.resize(gray, (160, 90)))
    cap_b.release()
    
    if not frames_a or not frames_b:
        return 0.5
    
    # Compute flow of last frame of A
    flow = cv2.calcOpticalFlowFarneback(frames_a[-2], frames_a[-1], None, 0.5, 3, 15, 3, 5, 1.2, 0)
    mag_a, ang_a = cv2.cartToPolar(flow[..., 0], flow[..., 1])
    
    # Compute flow of first frame of B
    flow_b = cv2.calcOpticalFlowFarneback(frames_b[0], frames_b[1] if len(frames_b)>1 else frames_b[0], None, 0.5, 3, 15, 3, 5, 1.2, 0)
    mag_b, ang_b = cv2.cartToPolar(flow_b[..., 0], flow_b[..., 1])
    
    # Compare flow histograms or mean magnitude/angle difference
    diff_mag = np.abs(mag_a.mean() - mag_b.mean())
    diff_ang = np.abs(ang_a.mean() - ang_b.mean())
    
    # Score from 0 to 1 (1 = identical motion)
    score = float(np.exp(- (diff_mag / 10.0 + diff_ang / np.pi)))
    return round(score, 3)

def main():
    clips_dir = r"E:\raw clips val"
    clips = sorted(glob.glob(os.path.join(clips_dir, "*.mp4")))
    print(f"Found {len(clips)} clips for motion matching.")
    
    print("\n=== STEP 2 MOTION-MATCHED CUTS SCORES ===")
    scores = []
    for i in range(len(clips)):
        for j in range(len(clips)):
            if i == j:
                continue
            sc = compute_optical_flow_score(clips[i], clips[j])
            flag = " [FLAGGED < 0.5]" if sc < 0.5 else ""
            print(f"Cut {os.path.basename(clips[i])[:15]} -> {os.path.basename(clips[j])[:15]}: score = {sc}{flag}")
            scores.append((os.path.basename(clips[i]), os.path.basename(clips[j]), sc))
            
    # Save scores
    import json
    with open("step2_motion_scores.json", "w", encoding="utf-8") as f:
        json.dump(scores, f, indent=2)
    print("Saved step2_motion_scores.json")

if __name__ == "__main__":
    main()
