import subprocess, os, json

with_text = r'output\with_text.mp4'
ass_path = r'E:\ai-video-editor\projects\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p\cache\captions.ass'

# Parse ASS to get impact word timestamps
dialogues = []
with open(ass_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith('Dialogue:') and 'Impact' in line:
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
            dialogues.append({'start': start_s, 'end': end_s, 'text': text})

# The impact words from our analysis are very brief (3-5 frames at 60fps)
# Export screenshots at each impact word's midpoint + some buffer
# Also export at subtitle midpoints for the subtitles

screenshots = []

# 1. Export at impact word midpoints (from ASS)
for d in dialogues[:8]:  # First 8 impact word dialogues
    mid = (d['start'] + d['end']) / 2
    # Export +/- 0.5s buffer to capture the word clearly
    t = max(0, mid - 0.3)
    outpath = f'impact_word_{d["start"]:.2f}.png'
    subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(t), '-i', with_text, '-frames:v', '1', '-q:v', '3', outpath], capture_output=True)
    screenshots.append((outpath, f'impact t={d["start"]:.1f}-{d["end"]:.1f}s, text="{d["text"][:20]}"'))

# 2. Export at subtitle midpoints (for comparison)
# Get all subtitles (Substyle, not Impact)
sub_dialogues = []
with open(ass_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith('Dialogue:') and 'Impact' not in line and 'Subtitle' in line:
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
            sub_dialogues.append({'start': parse_time(start_str), 'end': parse_time(end_str), 'text': text})

for d in sub_dialogues[:4]:  # First 4 subtitle events
    mid = (d['start'] + d['end']) / 2
    t = max(0, mid - 0.3)
    outpath = f'subtitle_{d["start"]:.1f}.png'
    subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(t), '-i', with_text, '-frames:v', '1', '-q:v', '3', outpath], capture_output=True)
    screenshots.append((outpath, f'subtitle t={d["start"]:.1f}-{d["end"]:.1f}s'))

# Export 8 screenshots total - pick the most important ones
print('=== 8 SCREENSHOT EXPORTS ===')
exported = 0
for path, desc in screenshots:
    if exported >= 8:
        break
    if os.path.exists(path):
        print(f' exported: {path} ({desc})')
        exported += 1
    else:
        # Try exporting at the word midpoint
        t = float(desc.split('t=')[1].split('.')[0]) / 100 if 't=' in desc else 2.0
        outpath = f'export_{exported+1}.png'
        subprocess.run(['ffmpeg', '-v', 'quiet', '-ss', str(t), '-i', with_text, '-frames:v', '1', '-q:v', '3', outpath], capture_output=True)
        if os.path.exists(outpath):
            print(f' exported: {outpath} (at t={t:.1f}s)')
            exported += 1

# List all exported files
print('\\nExported files:')
for f in sorted(os.listdir('.')):
    if f.startswith('export_') or f.startswith('impact_word_') or f.startswith('subtitle_'):
        print(f'  {f}')

# Cleanup unwanted files
for f in os.listdir('.'):
    if f.startswith('frame_') or f.startswith('fn_') or f.startswith('diff_') or f.startswith('no_mid_') or f.startswith('with_text_mid_') or f.startswith('nm_') or f.startswith('wt_'):
        try:
            os.remove(f)
        except:
            pass