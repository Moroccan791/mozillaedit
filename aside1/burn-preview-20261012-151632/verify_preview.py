"""Check exact delivered excerpt and each retained source attack, no listening claims."""
import json,subprocess,sys
from pathlib import Path
import numpy as np
root=Path(__file__).parent;t=json.loads((root/'timeline.json').read_text());out=root/'Let-The-World-Burn-35s-preview.mp4'
def pcm(p):
 r=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True)
 return np.frombuffer(r.stdout,np.float32)
def corr(a,b):return float(np.corrcoef(a,b)[0,1]) if np.std(a)>1e-8 and np.std(b)>1e-8 else 0
def frame(p,sec):
 r=subprocess.run(['ffmpeg','-v','error','-ss',str(sec),'-i',str(p),'-frames:v','1','-vf','scale=160:90,format=gray','-f','rawvideo','-'],capture_output=True,check=True)
 return np.frombuffer(r.stdout,np.uint8)
x=pcm(t['source']);m=pcm(t['music']);game=pcm(root/'game-stem.wav');y=pcm(out)
rows=[]
for e in t['events']:
 sr=16000;n=round(.25*sr);before=.06
 src=x[round((e['source_event']-before)*sr):round((e['source_event']-before)*sr)+n]
 mus=m[round((e['music_event']-before)*sr):round((e['music_event']-before)*sr)+n]
 base=round((e['output_event']-before)*sr)
 trials=[]
 for shift in range(-30,31):
  heard=game[base+shift*16:base+shift*16+n]
  trials.append((corr(src,heard),shift))
 gs,gd=max(trials,key=lambda r:r[0])
 # Joint linear reference fit checks continuous song alongside game, gains may vary with ducking.
 joint=[];A=np.stack([src,mus],axis=1)
 for shift in range(-30,31):
  heard=y[base+shift*16:base+shift*16+n]
  gains=np.linalg.lstsq(A,heard,rcond=None)[0]
  joint.append((corr(A@gains,heard),shift,gains.tolist()))
 js,jd,gains=max(joint,key=lambda r:r[0])
 reference=frame(t['source'],e['source_event']+.1)
 v=[]
 for shift in (-2,-1,0,1,2):
  heard=frame(out,e['output_event']+.1+shift/60)
  v.append((corr(reference,heard),shift))
 vs,vd=max(v,key=lambda r:r[0])
 row={'event':e['id'],'output_event':e['output_event'],'game_corr':round(gs,3),'game_offset_ms':gd,'mix_corr':round(js,3),'mix_offset_ms':jd,'gains':gains,'frame_corr':round(vs,3),'frame_offset':vd,'ok':gs>.65 and abs(gd)<=17 and js>.75 and abs(jd)<=17 and vs>.7 and abs(vd)<=2}
 rows.append(row);print(row,flush=True)
(root/'timing-qa.json').write_text(json.dumps({'events':rows,'all_pass':all(r['ok'] for r in rows),'caveats':'Numerical waveform/frame reference checks; not perceptual audio judgment or automated kill certification'},indent=2))
print('ALL TIMING',all(r['ok'] for r in rows),flush=True)
