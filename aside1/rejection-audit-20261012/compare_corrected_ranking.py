"""Isolate ranking/downbeat corrections using preserved historical analyses.
Does NOT certify generic cached onsets as musical hits or render a new preview.
"""
import json
from pathlib import Path
from aive.beats import BeatInfo
from aive.music import MusicProfile,Section
from aive.event_io import load_confirmed_events
from aive.encounters import plan_encounters
ROOT=Path(r'E:\aside\rejection-audit-20261012')
PRIOR=Path(r'E:\aside\other-stages-20261012\jobs\job-v0001')
events,summary=load_confirmed_events([r'E:\aside\other-stages-20261012\reviewed-context-events.json'])
b=BeatInfo(**json.loads((PRIOR/'music-beats.json').read_text()));b.downbeats=[]
m=json.loads((PRIOR/'music-profile.json').read_text());m['sections']=[Section(**s) for s in m['sections']];profile=MusicProfile(**m)
plan=plan_encounters(events,b,profile,duration=30,music_start=16.254,phrase_aware=True)
plan['warnings'].append('Diagnostic only: generic spectral onsets and historical shot labels not validated acoustic accents. Do not render this as a corrected final.')
(ROOT/'ranking-only-plan.json').write_text(json.dumps(plan,indent=2))
old=json.loads((PRIOR/'timeline.json').read_text())
print(json.dumps({'old':[{'label':r['events'][0]['label_id'],'music':r['anchor']['music_time'],'strength':r['anchor']['provenance']['strength']} for r in old['timeline']], 'diagnostic_new':[{'label':r['events'][0]['label_id'],'music':r['anchor']['music_time'],'strength':r['anchor']['provenance']['strength']} for r in plan['timeline']]},indent=2))
