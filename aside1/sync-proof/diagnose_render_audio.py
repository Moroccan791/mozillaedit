import sys,json,subprocess
from pathlib import Path
import numpy as np
from scipy.signal import correlate
root=Path(__file__).parent
job=Path(sys.argv[1])
c=json.loads((job/'input.json').read_text()); timing=json.loads((job/'timing.json').read_text())
def pcm(file):
 p=subprocess.run(['ffmpeg','-v','error','-i',str(file),'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True,check=True)
 return np.frombuffer(p.stdout,np.float32)
def corr(a,b): return np.corrcoef(a,b)[0,1]
x=pcm(c['source']);m=pcm(c['music']);y=pcm(job/'sync-proof.mp4')
for e in timing['events']:
 t=e['output_event'];st=e['source_audio_event'];mt=e['music_event']
 n=int(.3*48000);before=.1
 sr=x[round((st-before)*48000):round((st-before)*48000)+n]
 mr=m[round((mt-before)*48000):round((mt-before)*48000)+n]
 rows=[]
 for lag in range(-40,41):
  heard=y[round((t-before)*48000)+lag*48:round((t-before)*48000)+lag*48+n]
  A=np.stack([sr,mr],axis=1)
  coef=np.linalg.lstsq(A,heard,rcond=None)[0]
  fitted=A@coef
  rows.append((corr(fitted,heard),lag,coef.tolist(),corr(sr,heard),corr(mr,heard)))
 print('EVENT',e['id'],'best combined',max(rows,key=lambda r:r[0]),'zero',rows[40])
