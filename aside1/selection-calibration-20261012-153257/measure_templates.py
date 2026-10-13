import json,subprocess,sys
from pathlib import Path
import numpy as np
from scipy.ndimage import sobel
root=Path(__file__).parent
reyna=json.loads(Path('E:/aside/burn-preview-20261012-151632/selection.json').read_text())['source']
one=json.loads(Path('E:/aside/sync-proof/confirmed-1v9-dracula.json').read_text())['source']
def decode(source,start,duration,fps=15):
 cmd=['ffmpeg','-v','error','-ss',str(start),'-i',source,'-t',str(duration),'-vf',f'fps={fps},crop=128:112:576:528,scale=96:84,format=gray','-f','rawvideo','-']
 p=subprocess.run(cmd,capture_output=True,check=True)
 return np.frombuffer(p.stdout,np.uint8).reshape(-1,84,96)
refs=[('reyna_head',reyna,9.83),('reyna_tree',reyna,73.17),('reyna_mid',reyna,262.79)]
templates=[]
for name,s,t in refs:
 f=decode(s,t,.1,15)[0];e=np.hypot(sobel(f.astype(float),axis=0),sobel(f.astype(float),axis=1))
 # Restrict to actual central icon/ring, excluding ability widgets.
 yy,xx=np.indices(f.shape);mask=((xx-48)/39)**2+((yy-36)/35)**2<1
 e*=mask
 e/=np.linalg.norm(e)
 templates.append(e)
 np.save(root/f'{name}.npy',e)
 subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',s,'-frames:v','1','-vf','crop=128:112:576:528,scale=384:336','-update','1',str(root/f'{name}.jpg')],check=True)
T=np.stack(templates)
for label,source in [('reyna',reyna),('one',one)]:
 frames=decode(source,0,530.1 if label=='reyna' else 505.1)
 e=np.hypot(sobel(frames.astype(float),axis=1),sobel(frames.astype(float),axis=2));e*=mask[None,:,:]
 norms=np.linalg.norm(e,axis=(1,2)); scores=np.einsum('nhw,khw->nk',e,T)/np.maximum(norms[:,None],1e-6)
 best=scores.max(axis=1)
 from scipy.signal import find_peaks
 peaks,_=find_peaks(best,height=.65,distance=round(1.2*15))
 rows=[{'t':round(p/15,4),'score':round(float(best[p]),4),'template':refs[int(scores[p].argmax())][0]} for p in peaks]
 (root/f'{label}-matches.json').write_text(json.dumps(rows,indent=2));np.savez_compressed(root/f'{label}-scores.npz',scores=scores)
 print(label,'match count',len(rows),'top',sorted(rows,key=lambda r:-r['score'])[:15],flush=True)
 # include labeled windows score maxima
 probes=[9.8,57.1,73.2,92.4,97.9,104.9,188.2,262.8,339.1,414.9,468.7,501.7,516.5] if label=='reyna' else [221.1,221.7,232.07,234.5,265.73]
 for t in probes:
  a=round((t-.2)*15);z=round((t+.3)*15);print(label,t,float(best[a:z].max()),flush=True)
