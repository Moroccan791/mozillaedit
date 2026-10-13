"""Reviewed single-source current-build preview. Originals untouched."""
import json,sys,subprocess
from pathlib import Path
import numpy as np
from scipy.signal import butter,sosfilt,find_peaks
sys.path.insert(0,'E:/ai-video-editor')
from aive.beats import BeatInfo
root=Path(__file__).parent
c=json.loads((root/'selection.json').read_text(encoding='utf-8-sig'))
m=json.loads((root/'music-analysis.json').read_text())
print('Music keys',list(m),flush=True)
b=BeatInfo(**m['full_track_beats'])
start=16.254; duration=35; fps=60
# Frame-review anchors: selected POV firearm + outcome, not every loud candidate.
rough=[9.64608,92.25832,104.77388,188.02667,262.5912,338.92372,414.03,467.64,501.53,516.27]
targets=[.9055,4.1331,8.5855,10.9482,14.0190,18.6804,21.2694,26.4243,29.0191,32.8968]
source_pcm=subprocess.run(['ffmpeg','-v','error','-i',c['source'],'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True,check=True)
x=np.frombuffer(source_pcm.stdout,np.float32)
y=sosfilt(butter(3,1800,fs=48000,btype='highpass',output='sos'),x)
rms=np.sqrt(np.mean(y[:len(y)//48*48].reshape(-1,48)**2,axis=1));rise=np.maximum(0,np.diff(rms,prepend=0))
shots=[]
for center in rough:
 a=max(0,round((center-.1)*1000));z=round((center+.13)*1000)
 peaks,_=find_peaks(rise[a:z],prominence=.008)
 if len(peaks):
  p=min(peaks,key=lambda k:abs(a+k-center*1000)-min(float(rise[a+k]),.15)*100)
  shot=(a+p)/1000
 else:shot=center
 shots.append(shot)
markers=b.excerpt_markers(start,duration)
bounds=[0]
for left,right in zip(targets,targets[1:]):
 ideal=(left+right)/2
 beat=min(markers,key=lambda t:abs(t-ideal))
 bounds.append(round(round(beat*fps)/fps,6))
bounds.append(duration)
rows=[]
for i,(shot,target) in enumerate(zip(shots,targets)):
 lo,hi=bounds[i],bounds[i+1]
 source_start=shot-(target-lo)
 rows.append({'id':i+1,'source_event':shot,'output_event':target,'music_event':start+target,'output_start':lo,'output_end':hi,'source_start':round(source_start,6),'source_end':round(source_start+hi-lo,6),'duration':round(hi-lo,6),'confirmation':'assistant sampled POV firing and skull/outcome frames; numerical local waveform refinement, not automatic kill certification'})
for i,r in enumerate(rows):
 for s in rows[:i]:
  if r['source_start']<s['source_end'] and r['source_end']>s['source_start']:raise ValueError('overlap')
timeline={'source':c['source'],'music':c['music'],'music_start':start,'duration':duration,'fps':fps,'events':rows,'cut_markers':markers,'effects':'Existing restrained cold-noir/vibrant-sports grade plus short impact-local exposure pulses; 1x shots, hard cuts, no lyrics/overlays/ramps','limitations':'Current-build hand-reviewed preview, not unattended pipeline; source may have original creator edits/audio/text.'}
(root/'timeline.json').write_text(json.dumps(timeline,indent=2))
print(json.dumps(rows,indent=2),flush=True)
