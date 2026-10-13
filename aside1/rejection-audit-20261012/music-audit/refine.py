import json, subprocess
from pathlib import Path
import numpy as np
from scipy import signal,ndimage
import librosa
R=Path(r'E:\aside\rejection-audit-20261012\music-audit'); D=json.loads((R/'audit.json').read_text()); y=np.load(R/'decoded-mono-48000.npy'); sr=48000
B=json.loads(Path(r'E:\aside\other-stages-20261012\jobs\job-v0001\music-beats.json').read_text()); T=json.loads(Path(r'E:\aside\other-stages-20261012\jobs\job-v0001\timeline.json').read_text())
bands={'low30_180':(30,180),'mid180_800':(180,800),'upper800_3000':(800,3000),'high3000_12000':(3000,12000)}
# Calibrate a known burst onset to distinguish envelope peak time from acoustic attack.
s=22050; rng=np.random.default_rng(1); n=3*s; tt=np.arange(n)/s; onset=1.; gate=(tt>=onset)&(tt<onset+.16); baseline=.015*np.sin(2*np.pi*220*tt)
syn={ 'noise_burst':baseline+.4*rng.normal(size=n)*gate*np.exp(-np.maximum(0,tt-onset)/.06), 'bass_attack':baseline+.5*np.sin(2*np.pi*80*np.maximum(0,tt-onset))*gate*np.exp(-np.maximum(0,tt-onset)/.1)}
cal=[]
for name,x in syn.items():
 env=librosa.onset.onset_strength(y=x,sr=s,n_fft=2048,hop_length=128,aggregate=np.mean); et=np.arange(len(env))*128/s; inds=np.where(abs(et-onset)<.12)[0]; j=inds[np.argmax(env[inds])]
 cal.append({'signal':name,'known_attack':onset,'envelope_peak':float(et[j]),'peak_lateness_ms':float(1000*(et[j]-onset))})
ref=[]
for d,item in zip(D['targets'],T['timeline']):
 t=d['target']; a=t-.6; b=t+.6; seg=y[int(a*sr):int(b*sr)]; times=a+np.arange(len(seg))/sr
 acoustic={}
 for k,(lo,hi) in bands.items():
  q=signal.sosfiltfilt(signal.butter(4,[lo,hi],btype='bandpass',fs=sr,output='sos'),seg); e=np.sqrt(ndimage.uniform_filter1d(q*q,size=193))
  idx=np.arange(0,len(e),48); et=times[idx]; er=e[idx]
  # derivative of centered 4ms RMS over 8ms, can have carrier ripples especially low band.
  rise=np.r_[np.zeros(8),er[8:]-er[:-8]]; sel=np.where((et>=t-.085)&(et<=t+.015))[0]; j=sel[np.argmax(rise[sel])]
  # Identify pre-rise trough and rise endpoint, 10/20/50% crossing with held threshold >=3ms.
  aa=max(0,j-25); bb=min(len(et),j+12); trough=aa+np.argmin(er[aa:j+1]); top= j+np.argmax(er[j:bb]); base=er[trough]; amp=er[top]-base
  starts={}
  for f in (.1,.2,.5):
   ix=np.where(er[trough:top+1]>=base+f*amp)[0]; starts[str(f)]=float(et[trough+ix[0]]) if len(ix) else None
  acoustic[k]={'max_8ms_rise_time':float(et[j]),'attack_start_thresholds':starts,'rise_from_trough_ratio':float(er[top]/(base+1e-12)),'rms_max_time':float(et[top]),'rms_max':float(er[top])}
 # Merge intra-attack peaks: strongest wins within 80ms, then associate target to a cluster in +/-85ms.
 cs=sorted(d['independent_candidates_pm1s'],key=lambda c:c['composite'],reverse=True); merged=[]
 for c in cs:
  if all(abs(c['peak_time']-z['peak_time'])>.08 for z in merged):merged.append(c)
 for rank,c in enumerate(merged,1):c['merged_rank']=rank
 nearby=[c for c in merged if t-.085<=c['peak_time']<=t+.04]
 chosen=max(nearby,key=lambda c:c['composite']) if nearby else min(merged,key=lambda c:abs(c['peak_time']-t))
 pr=sorted(merged,key=lambda c:c['percussive_composite'],reverse=True); prank=next(i for i,c in enumerate(pr,1) if c is chosen)
 ctx=item['context_provenance']; shot=item['anchor']['source_audio_event']; cursor=item['music_start']; lo=cursor+shot-ctx['start']; hi=lo+1.5
 feas=[{'time':o,'strength':v} for o,v in zip(B['onsets'],B['onset_strengths']) if lo-1e-8<=o<=hi+1e-8]
 cachedrank=next((i for i,c in enumerate(sorted(feas,key=lambda c:c['strength'],reverse=True),1) if abs(c['time']-t)<.0001),None)
 ref.append({'label':d['label'],'target':t,'cached_strength_rank_in_context_candidate_interval':cachedrank,'context_candidate_interval':[lo,hi],'cached_candidates':feas,'attack_band_metrics':acoustic,'merged_associated_event':chosen,'percussive_rank_pm1s':prank,'merged_event_count_pm1s':len(merged),'top3_merged_percussive':[{'time':c['peak_time'],'percussive':c['percussive_composite'],'composite':c['composite']} for c in pr[:3]]})
 print(d['label'],t,'beat',round(d['beat_delta_ms'],1),'associated',chosen['peak_time'],'rank',chosen['merged_rank'],'perc-rank',prank,'cache-rank',cachedrank)
 for k,m in acoustic.items(): print(k, 'attack10/20/50', [round((v-t)*1000,1) for v in m['attack_start_thresholds'].values()], 'rmsrise',round((m['max_8ms_rise_time']-t)*1000,1))
print('Calibration',cal)
(R/'refined-audit.json').write_text(json.dumps({'calibration':cal,'targets':ref,'warning':'Threshold attack times are sensitivity estimates; low-band carrier oscillation can make multiple apparent rises. HPSS percussive ranks are instrument-agnostic proxies.'},indent=2),encoding='utf-8')
