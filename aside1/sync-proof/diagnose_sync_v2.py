"""Inspect exact-song full-track beats and source transients for sync v2."""
import json, sys, subprocess
from pathlib import Path
sys.path.insert(0, 'E:/ai-video-editor')
import numpy as np
from scipy.signal import find_peaks, butter, sosfilt
from aive import beats

root = Path(__file__).parent
c = json.loads((root/'confirmed-1v9-dracula.json').read_text())
b = beats.detect_cached(c['music'], hop=128)
beats.save(b, root/'dracula-fulltrack-diagnostic.json')
start, end = c['music_start'], c['music_start'] + c['duration']
print('FULL TRACK', b.duration, 'bpm', b.bpm, 'beat count', len(b.beats), 'onset count', len(b.onsets))
print('EXCERPT BEATS', [(round(t-start, 4),t) for t in b.beats if start <= t <= end])
print('EXCERPT ONSETS', [(round(t-start, 4),s) for t,s in zip(b.onsets,b.onset_strengths) if start <= t <= end])
print('HALF BEAT GRID', [round(t-start,4) for t in b.grid(.5) if start <= t <= end])
rows=[]
for idx,center in enumerate((221.7, 234.4, 265.7333),1):
    begin=center-0.5
    proc=subprocess.run(['ffmpeg','-v','error','-ss',str(begin),'-i',c['source'],'-t','1.2','-ac','1','-ar','48000','-f','f32le','-'],capture_output=True,check=True)
    x=np.frombuffer(proc.stdout,np.float32)
    filtered=sosfilt(butter(4,1500,fs=48000,btype='highpass',output='sos'),x)
    hop=48; n=len(filtered)//hop
    rms=np.sqrt(np.mean(filtered[:n*hop].reshape(n,hop)**2,axis=1))
    peaks,_=find_peaks(rms,distance=60,prominence=max(rms)*.12)
    candidates=[]
    for p in peaks:
        threshold=rms[p]*.20
        q=p
        while q>0 and rms[q-1]>threshold and p-q<45: q-=1
        candidates.append({'attack':round(begin+q/1000,6),'peak':round(begin+p/1000,6),'rms':round(float(rms[p]),5)})
    row={'event':idx,'visual':center,'candidates':candidates}
    rows.append(row); print('SOURCE',row)
(root/'source-transient-diagnostic.json').write_text(json.dumps(rows,indent=2))
