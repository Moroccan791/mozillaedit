import json
from pathlib import Path
import numpy as np
from scipy import signal,ndimage
import librosa
R=Path(r'E:\aside\rejection-audit-20261012\music-audit'); y=np.load(R/'decoded-mono-48000.npy'); a=25.; b=40.; sr=48000; seg=y[int(a*sr):int(b*sr)]; S=np.abs(librosa.stft(seg,n_fft=2048,hop_length=240)); H,Q=librosa.decompose.hpss(S,kernel_size=(61,31),margin=(2,2)); fr=librosa.fft_frequencies(sr=sr,n_fft=2048); ft=a+np.arange(S.shape[1])*.005
out=[]
for name,lo,hi in [('lowmid',50,900),('upper',900,3000),('high',3000,12000),('broad',50,12000)]:
 for typ,spec in [('raw',S),('percussive',Q)]:
  m=(fr>=lo)&(fr<hi); z=np.r_[0,np.mean(np.maximum(spec[m,1:]-spec[m,:-1],0),axis=0)]; z=ndimage.gaussian_filter1d(z,1); zz=z-z.mean(); ac=signal.correlate(zz,zz,mode='full',method='fft')[len(z)-1:]; ac/=ac[0]; tt=np.arange(len(ac))*.005; peaks,_=signal.find_peaks(ac,distance=10); pk=peaks[(tt[peaks]>=.25)&(tt[peaks]<=1.5)]; order=pk[np.argsort(ac[pk])[::-1]]; top=[{'lag':round(float(tt[j]),3),'autocorrelation':round(float(ac[j]),3)} for j in order[:5]]
  peaks,_=signal.find_peaks(z,distance=35,prominence=np.percentile(z,75)*.7); inds=peaks[np.argsort(z[peaks])[::-1]][:18]
  at=[{'time':round(float(ft[j]),3),'strength':round(float(z[j]),3)} for j in inds]
  phases=[]
  for period in [.645,60/129.19921875]:
   pg=np.arange(a,a+period,.001); sc=[]
   for phase in pg:
    dist=abs(((ft-phase+period/2)%period)-period/2); sc.append(float(np.sum(z*np.exp(-.5*(dist/.025)**2))/z.sum()))
   phase=pg[np.argmax(sc)]; near=[]
   for target in [27.2022,31.0799,34.1507,37.5234]:
    distance=((target-phase+period/2)%period)-period/2; near.append(round(float(distance*1000),1))
   phases.append({'period':period,'best_phase':float(phase),'energy_near_grid_fraction':max(sc),'target_phase_ms':near})
  row={'band':name,'type':typ,'autocorr_top':top,'top_attacks':at,'phase_comparison':phases};out.append(row);print(json.dumps(row),flush=True)
(R/'periodicity.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
