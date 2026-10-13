import json,sys
from pathlib import Path
sys.path.insert(0,r'E:\ai-video-editor')
from aive.firing_map import _windows
from aive.rhythm_planner import plan_candidate_rhythm,author_candidate_design
from aive.encounter_render import RenderConfig,render_encounters
from aive.encounter_qa import verify_encounters
from aive.attack_qa import measure_attack_alignment
root=Path(__file__).resolve().parent
job=root/'jobs'/'job-v0003'
maps=[]
for file in sorted(job.glob('firing-map-*.json')):
    data=json.loads(file.read_text())
    data['candidate_windows']=_windows(data['candidate_events'],0,data['source_duration'],16)
    maps.append(data)
hits=json.loads((job/'hit-map.json').read_text())
plan=plan_candidate_rhythm(maps,hits,duration=12,music_start=25)
print('planned',plan['duration'],len(plan['timeline']),plan['rhythm_summary'],flush=True)
if not plan['timeline']:raise SystemExit(1)
plan=author_candidate_design(plan)
song=json.loads((job/'config.json').read_text())['song'];plan['music']=song
(root/'cached-timeline.json').write_text(json.dumps(plan,indent=2))
print([(Path(r['source']).name,r['source_start'],r['source_end'],len(r['candidate_events'])) for r in plan['timeline']],flush=True)
manifest=render_encounters(plan,song,root/'cached-proof-renders',config=RenderConfig(width=640,height=360,fps=60,encoder='h264_qsv',style='authored-footage',game_gain_db=-8,music_gain_db=-7))
quality=verify_encounters(manifest,plan,output_path=root/'cached-quality.json')
attack=measure_attack_alignment(manifest,plan)
(root/'cached-attack-alignment.json').write_text(json.dumps(attack,indent=2))
print(manifest['output'],quality['status'],attack,flush=True)
