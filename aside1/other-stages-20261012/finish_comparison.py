"""Resume integration without changing the prior job, plan, inputs or proofs."""
import json
from pathlib import Path
import time
from aive.encounter_render import RenderConfig, render_encounters
from aive.encounter_qa import verify_encounters

ROOT = Path(r'E:\aside\other-stages-20261012')
PRIOR = ROOT/'jobs'/'job-v0001'
OUT = ROOT/'resume-comparison-20261012'
OUT.mkdir(exist_ok=False)
plan = json.loads((PRIOR/'timeline.json').read_text(encoding='utf-8'))
config = json.loads((PRIOR/'config.json').read_text(encoding='utf-8'))
prior_manifest = PRIOR/'renders'/'encounters-v0001'/'render-manifest.json'
started = time.perf_counter()
print('Render clean with the exact existing timeline', flush=True)
clean = render_encounters(plan, config['song'], OUT/'clean-renders', config=RenderConfig(
    encoder=config['encoder'], style='clean', game_gain_db=config['game_gain_db'],
    music_gain_db=config['music_gain_db']))
render_seconds = time.perf_counter()-started
print('Verify clean', flush=True)
clean_qa = verify_encounters(clean, plan, output_path=OUT/'clean-quality.json')
print('Reverify styled with corrected style classification', flush=True)
styled_qa = verify_encounters(prior_manifest, plan, output_path=OUT/'styled-quality.json')

def summary(qa):
    components = qa['components']
    return {'status': qa['status'], 'issues': qa['issues'],
            'check_counts': {s: sum(v['status']==s for v in components.values()) for s in ('pass','warn','fail')},
            'audio_shifts_ms': {k: v.get('shift_ms') for k,v in components.items() if k.endswith(('_game_stem','_music_stem','_final_mix'))},
            'visual': {k: {'status':v['status'],'shift_frames':v.get('shift_frames'),'correlation':v.get('correlation'),'style_present':v.get('style_present')} for k,v in components.items() if k.endswith('_visual')},
            'loudness': components['loudness'], 'benchmark':qa['benchmark']}

result = {'schema_version':'comparison/v1','same_timeline':True,'plan_file':str(PRIOR/'timeline.json'),
          'clean_output':clean['output'],'styled_output':styled_qa['output'],
          'planned_duration':plan['duration'],'frames':clean['frame_count'],
          'clean_render_seconds':round(render_seconds,3),'elapsed_seconds':round(time.perf_counter()-started,3),
          'clean':summary(clean_qa),'styled':summary(styled_qa),
          'limitations':['Reviewed historical point events and sampled manual context, not automatic selection.',
                         'Numerical QA and sampled frames do not establish listening taste or reference-level cinematics.',
                         'Process peak memory excludes FFmpeg children; no whole-laptop benchmark.']}
(OUT/'comparison.json').write_text(json.dumps(result,indent=2,allow_nan=False)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2),flush=True)
