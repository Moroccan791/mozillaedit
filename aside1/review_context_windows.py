"""Review complete-fight context independently of detector tuning."""
import json,subprocess
from pathlib import Path
ROOT=Path('E:/aside/other-stages-20261012');ROOT.mkdir(exist_ok=True)
old=json.loads(Path('E:/aside/sync-proof/confirmed-1v9-dracula-v2.json').read_text())
preview=json.loads(Path('E:/aside/burn-preview-20261012-151632/timeline.json').read_text())
rows=[]
for i,a in enumerate(old['anchors']):rows.append({'id':f'1v9-{i+1}','source':old['source'],'audio':a['source_audio_event'],'visual':a['source_visual_event'],'duration':old['source_duration'],'method':old['confirmation_source']})
# Only reviewed preview moments with newly appearing icon evidence retained here.
for idx,visual in [(0,9.733333333333333),(1,92.33333333333333),(3,188.13333333333333),(4,262.7333333333333)]:
 e=preview['events'][idx];rows.append({'id':f'reyna-{idx+1}','source':preview['source'],'audio':e['source_event'],'visual':visual,'duration':530.041905,'method':'Historical manual POV shot/outcome preview review plus production temporal first-emblem observation; not automatic profile certification'})
(ROOT/'review-references.json').write_text(json.dumps(rows,indent=2))
for r in rows:
 start=max(0,r['audio']-2.5)
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-ss',str(start),'-i',r['source'],'-t','5','-an','-vf','fps=4,scale=480:270,tile=5x4','-frames:v','1','-update','1',str(ROOT/f"{r['id']}-context.jpg")]
 subprocess.run(cmd,check=True,timeout=120);print(r['id'],'start',start,flush=True)
