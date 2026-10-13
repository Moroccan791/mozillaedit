"""Fresh sparse visual inspection of the existing screened candidate preview."""
from pathlib import Path
import json
import subprocess
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
JOB = ROOT.parent / 'automation-20261012' / 'jobs' / 'job-v0004'
plan = json.loads((JOB / 'timeline.json').read_text())
video = JOB / 'renders' / 'encounters-v0001' / 'encounters.mp4'
width, height = 360, 202
samples = []
for i, row in enumerate(plan['timeline']):
    points = [row['output_start'] + .12]
    for event in row['candidate_events']:
        points += [event['output_audio_event'] - .06, event['output_audio_event'] + .06]
    points += [row['output_end'] - .25, row['output_end'] - .02]
    samples.append((i, points))
cols = max(len(points) for _, points in samples)
sheet = Image.new('RGB', (cols*width, len(samples)*(height+26)+40), '#101418')
draw = ImageDraw.Draw(sheet)
draw.text((8, 8), 'SCREENED JOB v0004: fresh sparse frames, not all-frame safety, firing confirmation or musical/listening approval.', fill='white')
for i, points in samples:
    for j, t in enumerate(points):
        args = ['ffmpeg', '-hide_banner', '-v', 'error', '-nostdin', '-i', str(video), '-ss', f'{t:.6f}', '-frames:v', '1', '-vf', f'scale={width}:{height}', '-pix_fmt', 'rgb24', '-f', 'rawvideo', 'pipe:1']
        raw = subprocess.run(args, capture_output=True, check=True, timeout=60).stdout
        if len(raw) != width*height*3:
            raise RuntimeError(f'Unexpected frame bytes at {t}')
        sheet.paste(Image.frombytes('RGB', (width, height), raw), (j*width, 40+i*(height+26)))
        draw.text((j*width+5, 40+i*(height+26)+height+4), f'clip{i} t={t:.3f}s {plan["authored_design"]["shots"][i]["role"]}', fill='white')
sheet.save(ROOT / 'screened-preview-review.jpg', quality=95)
(ROOT / 'screened-review-samples.json').write_text(json.dumps({'video': str(video), 'samples': samples}, indent=2))
print(ROOT / 'screened-preview-review.jpg')
