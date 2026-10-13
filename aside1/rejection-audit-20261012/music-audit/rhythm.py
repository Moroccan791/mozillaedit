import json
from pathlib import Path
import numpy as np
from scipy import signal,ndimage
import librosa
R=Path(r'E:\aside\rejection-audit-20261012\music-audit'); D=json.loads((R/'audit.json').read_text()); F=json.loads((R/'refined-audit.json').read_text()); J=Path(r'E:\aside\other-stages-20261012\jobs\job-v0001'); B=json.loads((J/'music-beats.json').read_text()); P=json.loads((J/'music-profile.json').read_text()); T=json.loads((J/'timeline.json').read_text()); y=np.load(R/'decoded-mono-48000.npy'); sr=48000
for d,f in zip(D['targets'],F['targets']):
 print('\n',d['label'],'env stored/recomputed',d['cached_strength'],d['recomputed_env_strength'],'cached local',d['cached_onsets_pm1s']); print('feasible',f['cached_candidates'])
 print('strong independent perc',f['top3_merged_percussive'])
# Full feasible end candidates, phrase-first counterfactual on the selected group.
phrase=sorted(set(B['downbeats']+[s['start'] for s in P['sections']]+[s['end'] for s in P['sections']]+[i['music_end'] for i in T['timeline'] if 'section_boundary' in i['boundary_provenance']['music_end']['kinds']]))
bound=sorted(set(B['beats']+phrase)); ranked=[]
for item,ff in zip(T['timeline'],F['targets']):
 cursor=item['music_start']; ctx=item['context_provenance']; anchor=item['anchor']['source_audio_event']; groupend=ctx['end']; upper=groupend+1.5
 arr=[]
 for c in ff['cached_candidates']:
  ac=c['time']; st=c['strength']; sourcea=anchor-(ac-cursor); earliest=ac+groupend-anchor; latest=cursor+upper-sourcea
  pe=next((q for q in phrase if q>=earliest-1e-8),None); fit=pe is not None and pe<=latest+1e-8
  en=pe if fit else next((q for q in bound if q>=earliest-1e-8),None)
  if en is None or en>latest+1e-8:continue
  sec=next(s for s in P['sections'] if s['start']<=ac<s['end']); idx=min(int(ac*P['energy_hz']),len(P['energy'])-1); energy=max(P['energy'][idx],sec['energy']); score=.5+.5*st+.5*energy
  arr.append({'time':ac,'strength':st,'phrase_fit':fit,'end':en,'score':score})
 arr.sort(key=lambda q:(int(q['phrase_fit']),q['score'],-q['end']),reverse=True); ranked.append({'label':ff['label'],'ranked_candidates':arr}); print('REPLAY',ff['label'],arr)
# Independent rhythmic proxy: 48ms STFT, 5ms hop HPSS with frequency-time median; 14-40s then band 50-900Hz.
a=14.;b=41.; seg=y[int(a*sr):int(b*sr)]; S=np.abs(librosa.stft(seg,n_fft=2048,hop_length=240)); H,Q=librosa.decompose.hpss(S,kernel_size=(61,31),margin=(2,2)); fr=librosa.fft_frequencies(sr=sr,n_fft=2048); ft=a+np.arange(S.shape[1])*.005
m=(fr>=50)&(fr<900); flux=np.r_[0,np.mean(np.maximum(Q[m,1:]-Q[m,:-1],0),axis=0)]; flux=ndimage.gaussian_filter1d(flux,1)
peaks,_=signal.find_peaks(flux,distance=22,prominence=np.percentile(flux,75)*.35)
out=[]
for lo,hi in [(16,24.5),(25,39.8)]:
 mask=(ft>=lo)&(ft<=hi); z=flux[mask]; z=z-z.mean(); ac=signal.correlate(z,z,mode='full',method='fft')[len(z)-1:]; ac=ac/ac[0]; lags=np.arange(len(ac))*.005; inds=np.where((lags>=.35)&(lags<=.65))[0]; lag=inds[np.argmax(ac[inds])]; period=lags[lag]
 pp=peaks[(ft[peaks]>=lo)&(ft[peaks]<=hi)]; pts=ft[pp]; vals=flux[pp]
 # Search a fixed local phase weighted by narrow distance kernel, report confidence not certainty.
 phasegrid=np.arange(lo,lo+period,.001); scores=[]
 for phase in phasegrid:
  dist=abs(((pts-phase+period/2)%period)-period/2); scores.append(float(np.sum(vals*np.exp(-.5*(dist/.025)**2))))
 phase=phasegrid[np.argmax(scores)]; grid=np.arange(phase,hi+period,period)
 near=[]
 for d in D['targets']:
  t=d['target']
  if lo<=t<=hi:
   q=grid[np.argmin(abs(grid-t))]; near.append({'label':d['label'],'target':t,'nearest_fixed_percussive_grid':float(q),'distance_ms':float(1000*(t-q))})
 out.append({'interval':[lo,hi],'best_autocorrelation_period':float(period),'tempo':float(60/period),'autocorrelation':float(ac[lag]),'phase':float(phase),'peak_list':[{'time':float(q),'strength':float(v)} for q,v in zip(pts,vals)],'targets':near}); print('RHYTHM',out[-1])
(R/'selector-rhythm.json').write_text(json.dumps({'selector_same_group_replay_approximate_rounded_profile':ranked,'independent_lowmid_percussive_rhythm':out},indent=2),encoding='utf-8')
