"""Reproducible production-path audit, not full-source accuracy certification.

Unlike validate_labels.py, this uses per-template threshold margins, guard rules,
source-start temporal state, and separates template-derived windows from held out.
It does not change thresholds or promote the experimental profile to calibrated.
"""
import json, sys, time, hashlib, subprocess
from pathlib import Path
import numpy as np
sys.path.insert(0, 'E:/ai-video-editor')
from aive import povkills
from aive.shots import detect

ROOT=Path(__file__).parent
SOURCE=json.loads(Path('E:/aside/burn-preview-20261012-151632/selection.json').read_text())['source']
TIMELINE=json.loads(Path('E:/aside/burn-preview-20261012-151632/timeline.json').read_text())
OUT=ROOT/'production-audit-v1'
OUT.mkdir(exist_ok=True)

def main():
    started=time.perf_counter()
    audio=detect(SOURCE, min_gap=.10)
    (OUT/'audio-candidates.json').write_text(json.dumps([e.to_dict() for e in audio],indent=2))
    profile=ROOT/'reyna-expanded-profile.json'
    cfg=povkills.load_profile(profile)
    observations=povkills.scan_cached(SOURCE, cfg, audio, cache_dir=OUT/'cache')
    (OUT/'observations.json').write_text(json.dumps({'schema_version':'povkills/v1','source':SOURCE,'events':observations,'profile_calibrated':cfg['calibrated_profile']},indent=2))
    # Three preview windows contributed expanded templates, two contributed baseline templates.
    template_derived={1,2,3,4,5}
    rows=[]
    for expected in TIMELINE['events']:
        anchor=expected['source_event']
        # Visual outcome may lag a shot, but an earlier emblem must not prove a later shot.
        eligible=[e for e in observations if -.04<=e['source_visual_event']-anchor<=.5]
        match=min(eligible,key=lambda e:abs(e['source_visual_event']-anchor)) if eligible else None
        row={'label':f"preview-{expected['id']}",'source_audio_reference':anchor,
             'split':'template-derived' if expected['id'] in template_derived else 'held-out',
             'visual_match_window':[-.04,.5], 'detected':match is not None,
             'observation':match,'reference_method':expected['confirmation'],
             'caveat':'The preview label confirms gameplay outcome, not the exact onset or presence of this ROI icon.'}
        rows.append(row)
        print(row['label'],row['split'],'detected',row['detected'],flush=True)
    summary={'scope':'Production full-source scan compared against 10 selected manually reviewed preview shot/outcome references. NOT exhaustive source labels, NOT full-source precision/recall. Template-derived examples excluded from held-out tally. No auto-calibration.',
             'source':SOURCE,'profile':str(profile),'profile_calibrated':cfg['calibrated_profile'],
             'profile_sha256':hashlib.sha256(profile.read_bytes()).hexdigest(),
             'audio_candidate_count':len(audio),'visual_observation_count':len(observations),
             'confirmed_count':sum(e['confirmed'] for e in observations),
             'elapsed_seconds':round(time.perf_counter()-started,3),'rows':rows,
             'held_out_hits':sum(r['detected'] for r in rows if r['split']=='held-out'),
             'held_out_reference_count':sum(r['split']=='held-out' for r in rows),
             'limitations':povkills.LIMITATIONS}
    (OUT/'RESULTS.json').write_text(json.dumps(summary,indent=2))
    # Contact sheets show full frame including the tested icon ROI around missed references.
    for row in rows:
        if row['detected']:continue
        t=row['source_audio_reference']
        # Sheet samples are row-major at 0.2s intervals from max(0, t-.8).
        # Keep timestamp metadata in RESULTS.json, avoiding platform font/escape issues.
        vf='fps=5,scale=480:270,tile=4x3'
        cmd=['ffmpeg','-hide_banner','-loglevel','error','-ss',str(max(0,t-.8)),'-i',SOURCE,'-t','2.4','-an','-vf',vf,'-frames:v','1','-update','1',str(OUT/f"{row['label']}-sheet.jpg")]
        subprocess.run(cmd,check=True,timeout=120)
    print(json.dumps({k:summary[k] for k in ['visual_observation_count','confirmed_count','held_out_hits','held_out_reference_count','elapsed_seconds']},indent=2),flush=True)

if __name__=='__main__':main()
