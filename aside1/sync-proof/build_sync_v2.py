"""Rebuild the 10s calibration from full-track timing and reviewed POV kills."""
import json, subprocess, sys
from pathlib import Path
sys.path.insert(0, 'E:/ai-video-editor')
import numpy as np
from aive import beats
root=Path(__file__).parent
c=json.loads((root/'confirmed-1v9-dracula.json').read_text())
b=beats.detect_cached(c['music'])
beats.save(b, root/'dracula-fulltrack-v2.json')
markers=b.excerpt_markers(c['music_start'],c['duration'])
c['music_cut_markers']=[round(c['music_start']+t,6) for t in markers[1:-1]]
c['max_cut_gap']=.4
c['max_accent_grid_error']=.065
c['confirmation_source']='POV firing/ammo and skull-emblem frame review plus high-frequency waveform attack; full-track librosa local-threshold onsets near tracked beats'
# Audio firing and HUD kill confirmation are deliberately separate anchors.
source_pairs=[(221.612,221.6667),(234.469,234.5),(265.7033,265.7333)]
old_targets=[a['output_event'] for a in c['anchors']]
onsets=[(t-c['music_start'],s) for t,s in zip(b.onsets,b.onset_strengths)
        if c['music_start']<=t<=c['music_start']+c['duration']]
for idx,(a,(shot,visual),old) in enumerate(zip(c['anchors'],source_pairs,old_targets)):
    options=[(t,s) for t,s in onsets if abs(t-old)<.22]
    if not options: raise ValueError('No actual onset close to the previous musical target')
    target=max(options,key=lambda row: row[1])[0]
    a['source_event']=shot
    a['source_audio_event']=shot
    a['source_visual_event']=visual
    a['output_event']=round(target,6)
    if idx<len(c['anchors'])-1:
        marker=min(markers[1:-1],key=lambda t:abs(t-a['output_end']))
        a['output_end']=round(round(marker*c['fps'])/c['fps'],6)
(root/'confirmed-1v9-dracula-v2.json').write_text(json.dumps(c,indent=2))
print('Track duration',b.duration,'beats',len(b.beats),'onsets',len(b.onsets))
print('Full 10-second markers',len(markers),'max gap',round(max(np.diff(markers)),4))
for a in c['anchors']:print(a)
print(subprocess.check_output(['node',str(root/'test-and-build.mjs'),'--build',str(root/'confirmed-1v9-dracula-v2.json')],text=True))
