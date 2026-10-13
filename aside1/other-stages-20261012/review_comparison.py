"""Temporary frame evidence around every anchor and source cut, not taste QA."""
import json, subprocess
from pathlib import Path
ROOT=Path(r'E:\aside\other-stages-20261012')
TMP=Path(r'C:\Users\Junayed\.aside\u\3\sessions\2026-10-12_BD3SnMn4J708Lutn\tmp')
plan=json.loads((ROOT/'jobs/job-v0001/timeline.json').read_text())
clean=ROOT/'resume-comparison-20261012/clean-renders/encounters-v0001/encounters.mp4'
styled=ROOT/'jobs/job-v0001/renders/encounters-v0001/encounters.mp4'
points=[]
for i,row in enumerate(plan['timeline']):
    points.append((f'event {i+1}',row['events'][0]['output_visual_event']))
    if i:points.append((f'cut {i}',row['output_start']))
points.extend([('opening',0),('ending',plan['duration']-.05)])
for name,video in [('clean',clean),('styled',styled)]:
    for i,(label,t) in enumerate(points):
        for j,delta in enumerate([-.05,0,.05]):
            time=max(0,min(plan['duration']-.02,t+delta))
            frame=TMP/f'{name}-review-{i*3+j:03d}.jpg'
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-ss',f'{time:.9f}','-i',str(video),'-frames:v','1','-vf','scale=384:216','-y',str(frame)],check=True,capture_output=True,timeout=30)
    out=TMP/f'{name}-review-sheet.jpg'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-i',str(TMP/f'{name}-review-%03d.jpg'),'-vf',f'tile=3x{len(points)}','-frames:v','1','-update','1','-y',str(out)],check=True,capture_output=True,timeout=30)
    print(out)
(TMP/'review-points.json').write_text(json.dumps(points,indent=2))
