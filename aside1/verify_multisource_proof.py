"""Decoded audio/frame alignment for the clean multi-source proof only."""
import sys,json,subprocess,time
from pathlib import Path
sys.path.insert(0,'E:/ai-video-editor')
sys.path.insert(0,'E:/aside/sync-proof')
from aive.qa import verify
from render_existing import _verify_timing
ROOT=Path('E:/aside/multisource-proof-20261012')
job=sorted(ROOT.glob('encounters-v*'))[-1]
manifest=json.loads((job/'render-manifest.json').read_text())
plan=json.loads((job/'plan.json').read_text())
output=Path(manifest['output']);music=Path(plan['music'])
report=verify(str(output),want_audio=True)
lines=[report.render()];ok=report.ok
for i,row in enumerate(plan['timeline'],1):
 events=[]
 for e in row['events']:
  events.append({'source_event':e['source_visual_event'],'source_audio_event':e['source_audio_event'],
    'output_event':e['output_visual_event'],'predicted_audio_event':e['output_audio_event'],
    'predicted_visual_event':e['output_visual_event'],
    'music_event':plan['music_start']+e['output_audio_event']})
 result,passed=_verify_timing(Path(row['source']),music,output,events,60)
 lines.append(f'Encounter {i}, source {Path(row["source"]).name}')
 lines.extend(result);ok=ok and passed
loud=subprocess.run(['ffmpeg','-hide_banner','-i',str(output),'-af','loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
(job/'loudness.txt').write_text(loud.stderr)
lines.append('OVERALL: '+('PASS' if ok else 'FAIL'))
(job/'timing-qa.txt').write_text('\n'.join(lines))
print('\n'.join(lines),flush=True)
# Full-frame visual sample; no fonts/overlays required.
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(output),'-vf','fps=2,scale=480:270,tile=4x5','-frames:v','1','-update','1',str(job/'contact-sheet.jpg')],check=True)
raise SystemExit(0 if ok else 1)
