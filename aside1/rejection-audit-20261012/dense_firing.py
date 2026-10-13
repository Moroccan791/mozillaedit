import json,subprocess
from pathlib import Path
TMP=Path(r'C:\Users\Junayed\.aside\u\3\sessions\2026-10-12_BD3SnMn4J708Lutn\tmp')
plan=json.loads(Path(r'E:\aside\other-stages-20261012\jobs\job-v0001\timeline.json').read_text())
for i,row in enumerate(plan['timeline']):
    t=row['anchor']['source_audio_event']-.25
    out=TMP/f'firing-dense-{i:02d}.jpg'
    # HUD ammo, muzzle and target all retained at 640 pixels. 30fps 0.6s.
    subprocess.run(['ffmpeg','-hide_banner','-v','error','-nostdin','-ss',str(t),'-i',row['source'],'-t','0.6','-vf','fps=30,scale=640:360,tile=3x6','-frames:v','1','-update','1','-y',str(out)],capture_output=True,check=True,timeout=60)
    print(json.dumps({'index':i,'start':t,'fps':30,'sheet':str(out)}),flush=True)
