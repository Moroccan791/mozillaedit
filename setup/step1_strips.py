"""Generate frame strips around beats and print comparison numbers."""
import json
import cv2
import os
import numpy as np

def generate_frame_strips():
    vid_path = "output/step1_test.mp4"
    cap = cv2.VideoCapture(vid_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    
    # We will pick a cut point around t = 2.0s or 3.0s in the test video
    # Offsets: t - 0.1, t - 0.03, t + 0.03, t + 0.1
    offsets = [-0.1, -0.03, 0.03, 0.1]
    test_t = 2.0
    
    strip_dir = "output/strips"
    os.makedirs(strip_dir, exist_ok=True)
    
    print("=== FRAME STRIPS & NUMBERS AROUND BEATS ===")
    slick = json.load(open("style_profiles/slick.json", encoding="utf-8"))
    results = json.load(open("step1_results.json", encoding="utf-8"))
    
    print(f"Reference Metrics (slick.json):")
    print(f"  Width (frames): {slick['transition']['width_frames']}")
    print(f"  Sharpness Dip (%): {slick['transition']['sharpness_dip_pct']}")
    print(f"  Brightness Spike (%): {slick['transition']['brightness_spike_pct']}")
    
    print(f"\nYour Render Metrics (measured across cuts):")
    for i, cut in enumerate(results['yours']['cuts'][:3]):
        sharp = cut['sharpness']
        bright = cut['brightness']
        print(f"  Cut {i+1} at t={cut['t']:.2f}s:")
        print(f"    Sharpness (Laplacian var) at offsets {offsets}: {[round(s, 1) for s in sharp]}")
        print(f"    Brightness (mean) at offsets {offsets}: {[round(b, 1) for b in bright]}")
    
    # Export frame strip images
    for i, off in enumerate(offsets):
        t = test_t + off
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000.0)
        ret, frame = cap.read()
        if ret:
            out_img = os.path.join(strip_dir, f"beat_strip_{i}_off_{off}s.png")
            cv2.imwrite(out_img, frame)
            print(f"Saved frame strip image: {out_img} (offset {off}s)")
    cap.release()

if __name__ == "__main__":
    generate_frame_strips()
