import json,subprocess
from pathlib import Path
root=Path(__file__).parent
c=json.loads((root/'selection.json').read_text(encoding='utf-8-sig')); rows=json.loads((root/'source-candidates.json').read_text())
selected=[1,5,7,13,21,24,32,34,37,38,39,40]
for idx in selected:
 row=rows[idx-1];t=row['t']-.2
 out=root/'review'/f'sequence-{idx:02d}.jpg'
 vf=f"fps=10,scale=426:-1,setpts=PTS+{t}/TB,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='%{{pts\\:flt}}':fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.8:x=8:y=8,tile=4x2"
 subprocess.run(['ffmpeg','-hide_banner','-v','error','-ss',str(t),'-i',c['source'],'-t','0.8','-vf',vf,'-frames:v','1','-update','1',str(out)],check=True)
print('12 selected sequences ready')
