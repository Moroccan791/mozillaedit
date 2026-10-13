import sys,json,subprocess
from pathlib import Path
import numpy as np
sys.path.insert(0,'E:/ai-video-editor')
from aive import povkills as p
root=Path(__file__).parent
cfg=json.loads((root/'reyna-profile.json').read_text());source=json.loads(Path('E:/aside/burn-preview-20261012-151632/selection.json').read_text())['source']
for name,t in [('skull-normal',92.45),('variant-spike',104.98),('skull-large',188.3)]:
 loaded=p.load_profile(root/'reyna-profile.json')
 frame=p._read_roi(source,t,1,1280,720,loaded)[0]
 asset=root/f'{name}.npy';np.save(asset,frame)
 cfg['templates'].append({'name':name,'path':asset.name,'threshold':.80,'representation':'grayscale'})
(root/'reyna-expanded-profile.json').write_text(json.dumps(cfg,indent=2))
