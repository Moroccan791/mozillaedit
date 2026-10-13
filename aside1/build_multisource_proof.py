"""Two-source renderer integration using historical manual calibration labels.
Not automatic kill selection. Original media untouched, no effects or lyrics.
"""
import sys,json,time
from pathlib import Path
sys.path.insert(0,'E:/ai-video-editor')
from aive.encounters import plan_encounters
from aive.beats import BeatInfo
from aive.music import MusicProfile, Section
from aive.ffprobe import probe
ROOT=Path('E:/aside/multisource-proof-20261012')
ROOT.mkdir(exist_ok=True)
old=json.loads(Path('E:/aside/sync-proof/confirmed-1v9-dracula-v2.json').read_text())
burn=json.loads(Path('E:/aside/burn-preview-20261012-151632/timeline.json').read_text())
analysis=json.loads(Path('E:/aside/burn-preview-20261012-151632/music-analysis.json').read_text())
# Use already reviewed explicit visual+audio timestamps from the clean 1v9 proof.
# Reyna first emblem was measured by the new production scan, but manually
# associated to the original preview firing reference. No candidate promotion.
events=[]
for anchor in old['anchors'][:2]:
 events.append({'source':old['source'],'source_audio_event':anchor['source_audio_event'],
  'source_visual_event':anchor['source_visual_event'],'source_duration':old['source_duration'],
  'confidence':1.,'confirmed':True,'confirmation':old['confirmation_source'],
  'confidence_kind':'manual_calibration_label_not_probability'})
a=burn['events'][0]
events.append({'source':burn['source'],'source_audio_event':a['source_event'],
 'source_visual_event':9.733333333333333,'source_duration':probe(burn['source']).duration,
 'confidence':1.,'confirmed':True,'confirmation':'historical manual preview firing/outcome review + production first-emblem timing; renderer calibration only',
 'confidence_kind':'manual_calibration_label_not_probability'})
(ROOT/'manual-events.json').write_text(json.dumps({'schema_version':'povkills/v1','events':events,'limitations':['Historical manual calibration, not automatic selection.']},indent=2))
beat=BeatInfo(**analysis['full_track_beats'])
mp=dict(analysis['full_track_music']);mp['sections']=[Section(**s) for s in mp['sections']]
profile=MusicProfile(**mp)
plan=plan_encounters(events,beat,profile,duration=12,music_start=16.254)
plan['music']=burn['music'];plan['calibration_only']=True
plan['limitations']=['Manual labels reused for renderer integration; not an automatic detector result. No effects or lyrics.']
(ROOT/'timeline.json').write_text(json.dumps(plan,indent=2))
print('Planned',plan['duration'],'seconds',len(plan['timeline']),'encounters',len(set(r['source'] for r in plan['timeline'])),'sources',flush=True)
for warning in plan['warnings']:print(warning,flush=True)
if '--render' in sys.argv:
 from aive.encounter_render import RenderConfig,render_encounters
 started=time.perf_counter()
 manifest=render_encounters(plan,plan['music'],ROOT,config=RenderConfig(encoder='h264_qsv',music_gain_db=-7,game_gain_db=-8))
 print('Rendered',manifest['output'],'wall_seconds',time.perf_counter()-started,flush=True)
