"""Bounded ROI scan; no full-drive/global dependency changes."""
import json,subprocess
from pathlib import Path
import numpy as np
from scipy.ndimage import sobel
from scipy.signal import find_peaks
root=Path(__file__).parent
reyna=json.loads(Path('E:/aside/burn-preview-20261012-151632/selection.json').read_text())['source']
T=np.stack([np.load(root/f'{n}.npy') for n in ('reyna_head','reyna_tree','reyna_mid')])
yy,xx=np.indices((84,96));mask=((xx-48)/39)**2+((yy-36)/35)**2<1
all_scores=[]
for start in range(0,540,20):
 if start>=530:break
 dur=min(20,530.04-start)
 cmd=['ffmpeg','-v','error','-ss',str(start),'-i',reyna,'-t',str(dur),'-vf','fps=15,crop=128:112:576:528,scale=96:84,format=gray','-f','rawvideo','-']
 p=subprocess.run(cmd,capture_output=True,check=True); f=np.frombuffer(p.stdout,np.uint8).reshape(-1,84,96).astype(np.float32)
 e=np.hypot(sobel(f,axis=1),sobel(f,axis=2));e*=mask[None,:,:]
 norms=np.linalg.norm(e,axis=(1,2));scores=(e.reshape(len(e),-1)@T.reshape(len(T),-1).T)/np.maximum(norms[:,None],1e-6)
 all_scores.append(scores)
 print('scanned',start+dur,flush=True)
scores=np.concatenate(all_scores);best=scores.max(axis=1)
np.savez_compressed(root/'reyna-scores.npz',scores=scores)
peaks,_=find_peaks(best,height=.65,distance=round(1*15))
rows=[{'t':round(p/15,4),'score':round(float(best[p]),4),'template':int(scores[p].argmax())} for p in peaks]
(root/'reyna-matches.json').write_text(json.dumps(rows,indent=2))
print('matches',len(rows),flush=True)
for t in [9.8,57.1,73.2,92.4,97.9,104.9,188.2,262.8,339.1,414.9,468.7,501.7,516.5]:
 a=round((t-.2)*15);z=round((t+.3)*15);print(t,float(best[a:z].max()),flush=True)
