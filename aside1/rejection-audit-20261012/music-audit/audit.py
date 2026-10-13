import os, sys, json, subprocess, hashlib, inspect
from pathlib import Path
import numpy as np
from scipy import signal, ndimage
import librosa
ROOT=Path(r'E:\aside\rejection-audit-20261012\music-audit')
JOB=Path(r'E:\aside\other-stages-20261012\jobs\job-v0001')
AUDIO=Path(r'E:\audio\YTDown.com_YouTube_Media_MpoZ0NVXswY_Let-the-world-burn-Audio-Edit_009_128k.mp3')
T=json.loads((JOB/'timeline.json').read_text()); B=json.loads((JOB/'music-beats.json').read_text()); P=json.loads((JOB/'music-profile.json').read_text())
print('Decoding exact selected MP3',flush=True)
cmd=['ffmpeg','-hide_banner','-v','error','-i',str(AUDIO),'-ac','1','-ar','48000','-f','f32le','-']
p=subprocess.run(cmd,capture_output=True,check=True); y=np.frombuffer(p.stdout,dtype=np.float32).copy(); sr=48000
np.save(ROOT/'decoded-mono-48000.npy',y)
x=librosa.resample(y,orig_sr=sr,target_sr=22050)
# Independently reproduce production FFmpeg resampling, not librosa resampling.
p=subprocess.run(['ffmpeg','-hide_banner','-v','error','-i',str(AUDIO),'-ac','1','-ar','22050','-f','f32le','-'],capture_output=True,check=True)
x=np.frombuffer(p.stdout,dtype=np.float32).copy()
env=librosa.onset.onset_strength(y=x,sr=22050,hop_length=128,n_fft=2048,aggregate=np.mean)
env=env/env.max(); et=librosa.frames_to_time(np.arange(len(env)),sr=22050,hop_length=128)
local=ndimage.maximum_filter1d(env,size=max(3,int(round(2*22050/128))|1),mode='nearest')
frames=librosa.onset.onset_detect(onset_envelope=env/np.maximum(local,.05),sr=22050,hop_length=128,normalize=False,backtrack=False,units='frames',sparse=True,delta=.07)
frames=frames[env[frames]>=.005]
(ROOT/'librosa-onset-source.txt').write_text(inspect.getsource(librosa.onset.onset_strength_multi),encoding='utf-8')
print('Computing independent centered 2ms spectra and HPSS',flush=True)
# Centered short-time spectra, no onset-strength time shift. 21.3ms window, 2ms hop.
a=14.; z=42.; seg=y[int(a*sr):int(z*sr)]; hop=96; nfft=1024
S=np.abs(librosa.stft(seg,n_fft=nfft,hop_length=hop,center=True)); ft=a+np.arange(S.shape[1])*hop/sr
freq=librosa.fft_frequencies(sr=sr,n_fft=nfft)
H,Q=librosa.decompose.hpss(S,kernel_size=(31,31),power=2,margin=(2,2))
bands={'low30_180':(30,180),'mid180_800':(180,800),'upper800_3000':(800,3000),'high3000_12000':(3000,12000)}
eng={}; flux={}; pflux={}; hflux={}; pen={}; hen={}; rawrise={}
for k,(lo,hi) in bands.items():
 m=(freq>=lo)&(freq<hi)
 eng[k]=np.sqrt(np.mean(S[m]**2,axis=0)); pen[k]=np.sqrt(np.mean(Q[m]**2,axis=0)); hen[k]=np.sqrt(np.mean(H[m]**2,axis=0))
 # Positive linear flux: attacks rather than relative change of arbitrarily quiet bins.
 for spec,dest in [(S,flux),(Q,pflux),(H,hflux)]:
  d=np.maximum(spec[m,1:]-spec[m,:-1],0)
  dest[k]=np.r_[0,np.mean(d,axis=0)]
 # Zero-phase waveform band RMS, centered 6ms averaging. 8ms energy rise.
 filt=signal.sosfiltfilt(signal.butter(4,[lo,hi],btype='bandpass',fs=sr,output='sos'),seg)
 e=np.sqrt(ndimage.uniform_filter1d(filt*filt,size=289,mode='nearest'))
 rawrise[k]=np.interp(ft-a,np.arange(len(e))/sr,e)
# Normalize each band by 95th percentile within 2s around each target. Composite excludes mostly harmonic low narrow bins.
reports=[]
for item in T['timeline']:
 t=item['anchor']['music_time']; label=item['events'][0]['label_id']; near=np.abs(ft-t)<=1.; tight=np.abs(ft-t)<=.13
 scale={k:float(np.percentile(flux[k][near],95))+1e-12 for k in bands}
 comp=sum(flux[k]/scale[k] for k in bands)/4
 pc=sum(pflux[k]/scale[k] for k in bands)/4
 peaks,_=signal.find_peaks(comp,distance=22,prominence=.12)
 pk=peaks[near[peaks]]
 candidates=[]
 for j in pk:
  tp=float(ft[j]); aa=max(0,j-50); bb=min(len(ft),j+6)
  # Acoustic attack start: earliest >=20% of local rise, after most recent trough, not envelope peak.
  # Require increase of at least 25% from preceding 40ms baseline. Ambiguous bands retain null.
  rises={}; bp={}; ratios={}
  for k in bands:
   e=rawrise[k]; base=float(np.percentile(e[max(0,j-30):max(1,j-10)],25)); top=float(np.max(e[max(0,j-3):min(len(e),j+8)])); delta=top-base
   cross=None
   if delta>max(.25*base,1e-5):
    inds=np.where(e[aa:bb]>=base+.2*delta)[0]; # last continuous rise preceding j
    below=np.where(e[aa:j+1]<base+.2*delta)[0]
    if len(below): cross=float(ft[min(j,aa+below[-1]+1)])
   rises[k]={'start20':cross,'baseline':base,'peak_rms':top,'rise_ratio':top/(base+1e-12)}
   bp[k]=float(flux[k][j]/scale[k]); ratios[k]=float(pen[k][j]/(hen[k][j]+pen[k][j]+1e-12))
  # Weighted percussive share, explicitly HPSS proxy not instrument identification.
  share=float(sum(pflux[k][j] for k in bands)/(sum(pflux[k][j]+hflux[k][j] for k in bands)+1e-12))
  candidates.append({'peak_time':tp,'delta_to_target_ms':1000*(tp-t),'composite':float(comp[j]),'percussive_composite':float(pc[j]),'flux_band_normalized':bp,'percussive_flux_share':share,'energy_percussive_share_by_band':ratios,'attack_rises':rises})
 candidates.sort(key=lambda q:q['composite'],reverse=True)
 for rank,c in enumerate(candidates,1):c['rank_pm1s']=rank
 # strongest near target and nearest independent peak may differ
 selected=min(candidates,key=lambda q:abs(q['peak_time']-t))
 onset_near=[{'time':float(et[f]),'strength':float(env[f]),'delta_ms':1000*(float(et[f])-t)} for f in frames if abs(et[f]-t)<=1]
 bt=np.asarray(B['beats']); bi=int(np.argmin(abs(bt-t))); beat=float(bt[bi]); halfgrid=np.sort(np.r_[bt,(bt[:-1]+bt[1:])/2]); hi=int(np.argmin(abs(halfgrid-t)))
 report={'label':label,'target':t,'output_audio_event':item['events'][0]['output_audio_event'],'cached_strength':item['anchor']['provenance']['strength'],'recomputed_env_strength':float(env[int(round(t*22050/128))]),'nearest_tracked_beat':beat,'beat_delta_ms':1000*(t-beat),'nearest_tracked_halfbeat':float(halfgrid[hi]),'halfbeat_delta_ms':1000*(t-halfgrid[hi]),'cached_onsets_pm1s':[{'time':o,'strength':s} for o,s in zip(B['onsets'],B['onset_strengths']) if abs(o-t)<=1],'recomputed_onsets_pm1s':onset_near,'nearest_shortwindow_flux_peak':selected,'independent_candidates_pm1s':candidates}
 reports.append(report)
 # SVG plots avoid installing matplotlib. Raw waveform and multiband envelope/flux, +/-0.45s.
 lo=t-.45; hi=t+.45; mask=(ft>=lo)&(ft<=hi); tt=ft[mask]; W=1200; L=90; R=30; pw=W-L-R
 def xx(v):return L+(v-lo)/(hi-lo)*pw
 svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="900" viewBox="0 0 {W} 900"><rect width="100%" height="100%" fill="white"/><style>text{{font:14px sans-serif}}</style><text x="90" y="25">{label}: target {t:.4f}s; red = cached onset/shot time; blue = cached beats; all measurement, not listening</text>']
 curves=[('production onset env (46ms shifted)',np.interp(tt,et,env))]+[(k+' raw RMS',rawrise[k][mask]) for k in bands]+[(k+' positive flux',flux[k][mask]) for k in bands]
 for r,(name,v) in enumerate(curves):
  top=50+r*86; val=v/(np.max(v)+1e-12); points=' '.join(f'{xx(q):.1f},{top+67-55*vv:.1f}' for q,vv in zip(tt,val))
  svg += [f'<text x="5" y="{top+15}">{name}</text>',f'<polyline points="{points}" fill="none" stroke="#202020" stroke-width="1.3"/>',f'<line x1="{xx(t)}" x2="{xx(t)}" y1="{top}" y2="{top+70}" stroke="red"/>']
  for b in bt[(bt>=lo)&(bt<=hi)]:svg.append(f'<line x1="{xx(b)}" x2="{xx(b)}" y1="{top}" y2="{top+70}" stroke="#5aa0f0"/>')
  for q in np.arange(np.ceil(lo*10)/10,hi,.1):svg.append(f'<text x="{xx(q)-15:.1f}" y="{top+82}">{q:.1f}</text>')
 svg.append('</svg>'); (ROOT/f'{label}-multiband.svg').write_text(''.join(svg),encoding='utf-8')
result={'audio':str(AUDIO),'sha256':hashlib.sha256(AUDIO.read_bytes()).hexdigest(),'decoded_duration':len(y)/sr,'sr':sr,'librosa_version':librosa.__version__,'method':'Exact FFmpeg mono decode; production full-track onset independently reproduced; separate centered 1024-point/2ms-hop spectrum; four linear positive-flux bands; HPSS proxy, not instrument labels; zero-phase bandpass 6ms RMS and 20%-rise attack estimates; each band normalized to own local +/-1s flux p95. Local ranks are heuristic, not calibrated loudness.','targets':reports}
(ROOT/'audit.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
for r in reports:
 c=r['nearest_shortwindow_flux_peak']; print(json.dumps({'label':r['label'],'target':r['target'],'beat_ms':r['beat_delta_ms'],'halfbeat_ms':r['halfbeat_delta_ms'],'nearest_flux':c,'top3':r['independent_candidates_pm1s'][:3]}),flush=True)
