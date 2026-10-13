import json,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from aive.daily_runner import JobConfig,inventory_clips,run_job

class RunnerTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.clips=self.root/'clips';self.clips.mkdir()
  self.clip=self.clips/'one.mp4';self.clip.write_bytes(b'media placeholder')
  self.song=self.root/'song.mp3';self.song.write_bytes(b'song placeholder')
  self.ev=self.root/'events.json';self.ev.write_text(json.dumps({'schema_version':'povkills/v1','events':[]}))
 def tearDown(self):self.tmp.cleanup()
 def cfg(self,**kw):
  return JobConfig(**({'song':str(self.song),'clip_folder':str(self.clips),'output_root':str(self.root/'out'),'event_files':(str(self.ev),)}|kw))
 def test_inventory_scope_bounds_and_sort(self):
  (self.clips/'two.mov').write_bytes(b'x');(self.clips/'notes.json').write_text('{}')
  sub=self.clips/'nested';sub.mkdir();(sub/'no.mp4').write_bytes(b'x')
  self.assertEqual([p.name for p in inventory_clips(self.clips)],['one.mp4','two.mov'])
  with self.assertRaises(ValueError):inventory_clips(self.clips,1)
 def test_missing_confirmation_source_rejected(self):
  with self.assertRaisesRegex(ValueError,'reviewed events'):self.cfg(event_files=()).validate()
  with self.assertRaises(ValueError):self.cfg(duration=float('nan')).validate()
  with self.assertRaises(ValueError):self.cfg(style='random').validate()
 def test_empty_events_block_no_analysis_render(self):
  with patch('aive.beats.detect_cached') as analysis:
   result=run_job(self.cfg());self.assertEqual(result['status'],'blocked');analysis.assert_not_called()
  job=Path(result['job_dir']);self.assertTrue((job/'REPORT.md').exists());self.assertIsNone(result['output'])
 def test_versioned_jobs_preserved(self):
  one=run_job(self.cfg());before=Path(one['job_dir'],'job-report.json').read_bytes();two=run_job(self.cfg())
  self.assertNotEqual(one['job_dir'],two['job_dir']);self.assertEqual(Path(one['job_dir'],'job-report.json').read_bytes(),before)
 def test_outside_folder_event_failure_report(self):
  event={'source':str(self.root/'outside.mp4'),'source_audio_event':2.,'source_visual_event':2.1,'source_duration':8.,'confidence':1.,'confirmed':True}
  self.ev.write_text(json.dumps([event]));result=run_job(self.cfg())
  self.assertEqual(result['status'],'failed');self.assertIn('outside',result['error']);self.assertTrue(Path(result['job_dir'],'error.txt').exists())
 def test_plan_only_records_provenance(self):
  from aive.beats import BeatInfo
  from aive.music import MusicProfile
  event={'source':str(self.clip.resolve()),'source_audio_event':2.,'source_visual_event':2.1,'source_duration':8.,'confidence':1.,'confirmed':True}
  self.ev.write_text(json.dumps([event]))
  beat=BeatInfo(bpm=120,offset=0,duration=10,beats=[1.5,3,4],onsets=[1.5],onset_strengths=[.8])
  plan={'schema_version':'encounters/v1','duration':3.,'warnings':[],'timeline':[{'source':str(self.clip)}]}
  with patch('aive.beats.detect_cached',return_value=beat),patch('aive.music.analyze_cached',return_value=MusicProfile(duration=10)),patch('aive.encounters.plan_encounters',return_value=plan) as planner:
   result=run_job(self.cfg(plan_only=True));self.assertEqual(result['status'],'planned')
   self.assertEqual(planner.call_args.kwargs['phrase_aware'],True)
  self.assertTrue(Path(result['job_dir'],'timeline.json').exists());self.assertFalse(result['selection']['automatic_selection'])
 def test_uncalibrated_profile_blocks_without_detection(self):
  profile=self.root/'profile.json';profile.write_text('{}')
  with patch('aive.povkills.load_profile',return_value={'calibrated_profile':False}),patch('aive.shots.detect') as detector:
   result=run_job(self.cfg(event_files=(),pov_profile=str(profile)))
   self.assertEqual(result['status'],'blocked');detector.assert_not_called()
 def test_source_profile_cannot_expand_to_unlisted_footage(self):
  profile=self.root/'profile.json';profile.write_text('{}')
  with patch('aive.povkills.load_profile',return_value={'calibrated_profile':True,'calibrated_sources':[{'source':str(self.root/'different.mp4')}]}),patch('aive.shots.detect') as detector:
   result=run_job(self.cfg(event_files=(),pov_profile=str(profile)))
   self.assertEqual(result['status'],'failed');self.assertIn('every clip',result['error']);detector.assert_not_called()
 def test_render_then_independent_qa_failure_retained(self):
  from aive.beats import BeatInfo
  from aive.music import MusicProfile
  event={'source':str(self.clip.resolve()),'source_audio_event':2.,'source_visual_event':2.1,'source_duration':8.,'confidence':1.,'confirmed':True}
  self.ev.write_text(json.dumps([event]));beat=BeatInfo(bpm=120,offset=0,duration=10)
  plan={'duration':3.,'warnings':[],'timeline':[{'source':str(self.clip)}]}
  manifest={'output':str(self.root/'render.mp4'),'manifest_path':str(self.root/'manifest.json')}
  with patch('aive.beats.detect_cached',return_value=beat),patch('aive.music.analyze_cached',return_value=MusicProfile(duration=10)),patch('aive.encounters.plan_encounters',return_value=plan),patch('aive.encounter_render.render_encounters',return_value=manifest),patch('aive.encounter_qa.verify_encounters',return_value={'status':'fail','ok':False,'issues':[{'detail':'shifted audio'}]}):
   result=run_job(self.cfg());self.assertEqual(result['status'],'failed-qa')
  self.assertEqual(result['output'],manifest['output']);self.assertTrue(Path(result['job_dir'],'quality-report.json').exists())
 def test_warning_render_status_and_human_report(self):
  from aive.beats import BeatInfo
  from aive.music import MusicProfile
  event={'source':str(self.clip.resolve()),'source_audio_event':2.,'source_visual_event':2.1,'source_duration':8.,'confidence':1.,'confirmed':True}
  self.ev.write_text(json.dumps([event]))
  plan={'duration':3.,'warnings':['shorter than requested; no filler'],'timeline':[{'source':str(self.clip)}]}
  manifest={'output':str(self.root/'render.mp4'),'manifest_path':str(self.root/'manifest.json')}
  quality={'status':'warn','ok':True,'issues':[{'component':'anchor_visual','status':'warn','detail':'masking-sensitive frame match'}]}
  with patch('aive.beats.detect_cached',return_value=BeatInfo(bpm=120,offset=0,duration=10)),patch('aive.music.analyze_cached',return_value=MusicProfile(duration=10)),patch('aive.encounters.plan_encounters',return_value=plan),patch('aive.encounter_render.render_encounters',return_value=manifest),patch('aive.encounter_qa.verify_encounters',return_value=quality):
   result=run_job(self.cfg());self.assertEqual(result['status'],'rendered-with-warnings')
  report=Path(result['job_dir'],'REPORT.md').read_text()
  self.assertIn('anchor_visual',report);self.assertIn('masking-sensitive',report);self.assertIn('shorter than requested',report)
  with patch('aive.beats.detect_cached',return_value=BeatInfo(bpm=120,offset=0,duration=10)),patch('aive.music.analyze_cached',return_value=MusicProfile(duration=10)),patch('aive.encounters.plan_encounters',return_value=plan),patch('aive.encounter_render.render_encounters',return_value=manifest),patch('aive.encounter_qa.verify_encounters',return_value={'status':'pass','ok':True,'issues':[]}):
   planned_warning=run_job(self.cfg());self.assertEqual(planned_warning['status'],'rendered-with-warnings')
  self.assertIn('shorter than requested',Path(planned_warning['job_dir'],'REPORT.md').read_text())
if __name__=='__main__':unittest.main()
