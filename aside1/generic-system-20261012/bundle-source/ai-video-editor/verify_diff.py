import subprocess, os, json, numpy as np
from PIL import Image

# Verify both videos exist and have same duration
with_text = r'output\with_text.mp4'
without_text = r'output\without_text.mp4'

for v in [with_text, without_text]:
    result = subprocess.run(['ffprobe', '-v', 'quiet', '-select_streams', 'v:0', '-show_entries', 'stream=duration', '-of', 'default=noprint_algebra=1:nokey=1', v], capture_output=True, text=True)
    dur = result.stdout.strip()
    print(f'{os.path.basename(v)}: duration={dur}s')

print()

# Compare frames at key timestamps using PIL
timestamps = [0.0, 2.0, 5.0, 8.0, 11.0, 13.8]
for i, ts in enumerate(timestamps):
    # Export frame from without_text
    subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(ts), '-i', without_text, '-frames:v', '1', '-q:v', '3', f'fn_{i}.png'], capture_output=True)
    # Export frame from with_text
    subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(ts), '-i', with_text, '-frames:v', '1', '-q:v', '3', f'ft_{i}.png'], capture_output=True)
    
    # Load and compare
    try:
        img1 = Image.open(f'fn_{i}.png').convert('RGB')
        img2 = Image.open(f'ft_{i}.png').convert('RGB')
        arr1 = np.array(img1)
        arr2 = np.array(img2)
        diff = np.abs(arr1.astype(int) - arr2.astype(int))
        total_diff = diff.sum()
        pct_diff = total_diff / (arr1.size * 3 * 256) * 100  # max possible diff
        print(f'Frame at t={ts}s: {pct_diff:.2f}% pixels differ')
    except Exception as e:
        print(f'Frame at t={ts}s: Error - {e}')
    
    # Cleanup
    for f in [f'fn_{i}.png', f'ft_{i}.png']:
        try:
            os.remove(f)
        except:
            pass

# Parse ASS and check word-level changes
ass_path = r'E:\ai-video-editor\projects\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p\cache\captions.ass'
with open(ass_path, 'r', encoding='utf-8') as f:
    content = f.read()

dialogues = []
for line in content.split(chr(10)):
    if line.startswith('Dialogue:'):
        parts = line.split(',')
        start_str = parts[1]
        end_str = parts[2]
        text = parts[-1].strip()
        
        def parse_time(s):
            parts_t = s.split(':')
            h = int(parts_t[0])
            m = int(parts_t[1])
            s = float(parts_t[2])
            return h * 3600 + m * 60 + s
        
        start_s = parse_time(start_str)
        end_s = parse_time(end_str)
        
        dialogues.append({
            'start': start_s,
            'end': end_s,
            'text': text,
        })

print(f'\\nTotal dialogue lines: {len(dialogues)}')

# For each dialogue, check visual difference at midpoint
for d in dialogues:
    mid = (d['start'] + d['end']) / 2
    subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(mid), '-i', without_text, '-frames:v', '1', '-q:v', '3', f'nm_{int(d["start"]*10)}.png'], capture_output=True)
    subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(mid), '-i', with_text, '-frames:v', '1', '-q:v', '3', f'wt_{int(d["start"]*10)}.png'], capture_output=True)
    
    try:
        img1 = Image.open(f'nm_{int(d["start"]*10)}.png').convert('RGB')
        img2 = Image.open(f'wt_{int(d["start"]*10)}.png').convert('RGB')
        arr1 = np.array(img1)
        arr2 = np.array(img2)
        diff = np.abs(arr1.astype(int) - arr2.astype(int))
        total_diff = diff.sum()
        pct_diff = total_diff / (arr1.size * 3 * 256) * 100
        changed = pct_diff > 0.1  # threshold: >0.1% pixel difference
    except Exception as e:
        pct_diff = 0
        changed = False
        print(f'  Error comparing t={d["start"]:.1f}-{d["end"]:.1f}s: {e}')
    
    print(f'  t={d["start"]:.1f}-{d["end"]:.1f}s text="{d["text"][:40]}" mid={mid:.1f}s pct_diff={pct_diff:.2f}% changed={changed}')

# Cleanup remaining temp files
import os
for prefix in ['nm_', 'wt_']:
    for f in os.listdir('.'):
        if f.startswith(prefix):
            try:
                os.remove(f)
            except:
                pass

print('\\nDone with verification')