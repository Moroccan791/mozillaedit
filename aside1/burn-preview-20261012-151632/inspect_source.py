import json,sys,subprocess
from pathlib import Path
import numpy as np
from scipy.signal import butter,sosfilt,find_peaks
root=Path(__file__).parent
c=json.loads((root/'selection.json').read_text(encoding='utf-8-sig'))
p=subprocess.run(['ffmpeg','-hide_banner','-v','error','-i',c['source'],'-ac','1','-ar','22050','-f','f32le','-'],capture_output=True,check=True)
x=np.frombuffer(p.stdout,np.float32)
y=sosfilt(butter(3,1800,fs=22050,btype='highpass',output='sos'),x)
hop=44;n=len(y)//hop
rms=np.sqrt(np.mean(y[:n*hop].reshape(n,hop)**2,axis=1))
# sharp attacks with enough absolute high-frequency sound; isolated candidates
rise=np.maximum(0,np.diff(rms,prepend=0)); peaks,_=find_peaks(rise,distance=round(4*22050/hop),prominence=.006)
ranked=sorted(peaks,key=lambda p:float(rise[p]*np.sqrt(rms[p])),reverse=True)
ranked=[p for p in ranked if rms[p]>.018 and 8<p*hop/22050< len(x)/22050-5][:40]
rows=[{'id':i+1,'t':round(float(p*hop/22050),5),'attack_score':round(float(rise[p]),5),'hf_rms':round(float(rms[p]),5)} for i,p in enumerate(sorted(ranked))]
(root/'source-candidates.json').write_text(json.dumps(rows,indent=2))
print('SOURCE seconds',len(x)/22050,'candidate count',len(rows),flush=True)
frames=root/'review';frames.mkdir(exist_ok=True)
for row in rows:
 t=row['t']+.15
 out=frames/f"candidate-{row['id']:02d}.jpg"
 vf=f"scale=426:-1,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='{row['id']} at {row['t']:.3f}s':fontsize=24:fontcolor=yellow:box=1:boxcolor=black@0.8:x=8:y=8"
 subprocess.run(['ffmpeg','-hide_banner','-v','error','-ss',str(t),'-i',c['source'],'-frames:v','1','-vf',vf,'-update','1',str(out)],check=True)
print('Candidate frames ready',flush=True)
# create sheets from labeled ordered frames, no Pillow needed
for batch in range((len(rows)+19)//20):
 files=rows[batch*20:(batch+1)*20]
 manifest=frames/f'list{batch}.txt'
 lines=[]
 for r in files:
  image=frames/('candidate-%02d.jpg' % r['id'])
  lines.append("file '%s'\nduration 1\n" % image.as_posix())
 manifest.write_text(''.join(lines))
 subprocess.run(['ffmpeg','-hide_banner','-v','error','-f','concat','-safe','0','-i',str(manifest),'-vf',f'fps=1,tile=5x4','-frames:v','1','-update','1',str(root/f'source-sheet{batch}.jpg')],check=True)
print('Sheets ready',flush=True)
