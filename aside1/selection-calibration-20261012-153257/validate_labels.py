"""Small labeled-window calibration. Not full-source precision/recall."""
import sys,json
from pathlib import Path
import numpy as np
sys.path.insert(0,'E:/ai-video-editor')
from aive import povkills as p
root=Path(__file__).parent
source=json.loads(Path('E:/aside/burn-preview-20261012-151632/selection.json').read_text())['source']
profile_name=sys.argv[1] if len(sys.argv)>1 else 'reyna-profile.json'
cfg=p.load_profile(root/profile_name)
suffix='expanded' if 'expanded' in profile_name else 'baseline'
# Labels from frame review: positives first new POV emblem; hard negatives missed/non-POV/ability/menu.
labels=[('train-head',8.6,2.2,1),('train-tree',72.1,2.2,1),('train-multi',261.6,2.2,1),('held-kill-92',91.25,2.2,1),('held-kill-104',103.75,2.2,1),('held-kill-188',187.0,2.2,1),('held-kill-339',337.9,2.2,1),('held-kill-414',413.1,2.0,1),('held-kill-467',466.9,2.0,1),('held-kill-501',500.7,2.0,1),('held-kill-516',515.5,2.0,1),('negative-miss',55.9,2.2,0),('negative-ability',96.8,2.0,0),('negative-menu',7.0,1.5,0),('negative-health',502.7,1.5,0),('negative-walk',261.1,.8,0)]
cache=root/f'label-curves-{suffix}.npz'
curves=[]
if cache.exists():
 loaded=np.load(cache);curves=[(loaded[f't{i}'],loaded[f's{i}'],loaded[f'v{i}']) for i in range(len(labels))]
else:
 for label,start,dur,want in labels:
  frames=p._read_roi(source,start,round(dur*15),1280,720,cfg);mask=p.ellipse_mask(cfg)
  feat=p.gradient_features(frames,mask);mat=feat.reshape(len(frames),-1)@p._template_vectors(cfg).T
  scores=mat.max(axis=1);ts=start+np.arange(len(frames))/15
  masked=frames[:,mask.astype(bool)].astype(float);valid=(masked.std(axis=1)>=2)&(masked.mean(axis=1)<245)
  for k in range(1,len(frames)):
   if np.mean(np.abs(frames[k].astype(float)-frames[k-1]))>55:valid[k]=False
  curves.append((ts,scores,valid));print('decoded label',label,'max',float(scores.max()),flush=True)
 np.savez_compressed(cache,**{key:a for i,(ts,sc,va) in enumerate(curves) for key,a in [(f't{i}',ts),(f's{i}',sc),(f'v{i}',va)]})
results=[]
for threshold in [.68,.72,.75,.78,.8,.82,.85]:
 records=[];tp=fp=fn=tn=0
 for (name,start,dur,want),(ts,sc,va) in zip(labels,curves):
  found=p.detect_temporal(ts,sc,threshold=threshold,valid=va,**cfg['temporal'])
  got=len(found)
  if want:tp+=min(got,1);fn+=int(got==0);fp+=max(0,got-1)
  else:fp+=got;tn+=int(got==0)
  records.append({'label':name,'split':'train' if name.startswith('train') else 'held','expected_count':want,'observed_count':got,'max_score':round(float(sc.max()),4),'events':found})
 r={'threshold':threshold,'tp':tp,'fp':fp,'fn':fn,'tn':tn,'precision':tp/(tp+fp) if tp+fp else 0,'recall':tp/(tp+fn) if tp+fn else 0,'records':records};results.append(r)
 print('threshold',threshold,'TP FP FN TN',tp,fp,fn,tn,flush=True)
(root/f'labeled-results-{suffix}.json').write_text(json.dumps({'scope':'16 selected labeled windows on one source; template-training positives included, held windows explicitly identified; not full-source accuracy or cross-game certification','thresholds':results},indent=2))
