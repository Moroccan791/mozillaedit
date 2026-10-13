"""Reuse accepted numeric screen evidence plus NEW decoded-frame exclusions.
No new automatic semantic acceptance, no render, no modifications to old jobs.
"""
import copy
import json
from pathlib import Path
import sys
sys.path.insert(0, 'E:/ai-video-editor')
from aive.visual_gate import validate_exclusions
from aive.rhythm_planner import plan_candidate_rhythm, author_candidate_design
root = Path(__file__).resolve().parent
old = root.parent/'automation-20261012'/'jobs'/'job-v0004'
screen = json.loads((old/'visual-screen.json').read_text())
maps = [json.loads(p.read_text()) for p in sorted(old.glob('firing-map-*.json'))]
exclusions = validate_exclusions(json.loads((root/'observed-exclusions-v2.json').read_text()), [m['source'] for m in maps])
rejected = []
for fmap in maps:
    keep = []
    for window in fmap['candidate_windows']:
        source = str(Path(fmap['source']).resolve())
        a, b = window['source_start'], window['source_end']
        already = any(r['source']==source and r['start']==a and r['end']==b for r in screen['rejected'])
        new = [e for e in exclusions if e['source']==source and a<e['end'] and b>e['start']]
        if already or new:
            rejected.append(dict(source=source,start=a,end=b,reason='historical numeric rejection' if already else 'fresh observed exclusion',evidence=new))
        else:
            keep.append(window)
    fmap['candidate_windows'] = keep
hits = json.loads((old/'hit-map.json').read_text())
plan = plan_candidate_rhythm(maps,hits,duration=12,music_start=25)
plan['music'] = json.loads((old/'config.json').read_text())['song']
if plan['timeline']:
    plan = author_candidate_design(plan,fps=60)
(root/'exclusion-replan.json').write_text(json.dumps(plan,indent=2))
report = dict(schema_version='observed-exclusion-replan/v1',mode='plan-only',rendered=False,automatic_pov_confirmation=False,
              retained=sum(len(m['candidate_windows']) for m in maps),rejected=len(rejected),new_rejections=[r for r in rejected if r['reason']=='fresh observed exclusion'],
              duration=plan['duration'],rhythm_summary=plan['rhythm_summary'],limitations=['Replanning is not new semantic gameplay acceptance.','Previously numeric-screened windows can still contain abilities, menus, false transients or unresolved fights.'])
(root/'exclusion-replan-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
