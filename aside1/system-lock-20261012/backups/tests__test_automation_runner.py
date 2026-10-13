import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from aive.automation_runner import AutomationConfig,run_automation
from test_rhythm_planner import fixtures


class AutomationTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
        self.clips=self.root/'clips';self.clips.mkdir();self.clip=self.clips/'a.mp4';self.clip.write_bytes(b'x')
        self.song=self.root/'song.wav';self.song.write_bytes(b'x')
    def tearDown(self):self.tmp.cleanup()
    def cfg(self,**kwargs):
        return AutomationConfig(song=str(self.song),clip_folder=str(self.clips),output_root=str(self.root/'out'),music_start=0,visual_screen=False,**kwargs)
    def test_plan_only_unreviewed_readiness_and_versioning(self):
        maps,hits=fixtures();maps[0]['source']=str(self.clip)
        with patch('aive.hit_map.build_hit_map',return_value=hits),patch('aive.firing_map.extract_firing_map',return_value=maps[0]),patch('aive.encounter_render.render_encounters') as render:
            a=run_automation(self.cfg(plan_only=True));b=run_automation(self.cfg(plan_only=True))
            render.assert_not_called()
        self.assertEqual(a['status'],'planned-candidate-preview')
        self.assertFalse(a['readiness']['unattended_ready'])
        self.assertFalse(a['readiness']['automatic_pov_confirmation'])
        self.assertNotEqual(a['job_dir'],b['job_dir'])
        p=json.loads(Path(a['job_dir'],'timeline.json').read_text())
        self.assertTrue(p['authored_design'])
        self.assertTrue(all(not e['confirmed'] for r in p['timeline'] for e in r['candidate_events']))
    def test_no_four_windows_blocks_without_render(self):
        maps,hits=fixtures();maps[0]['candidate_windows']=[]
        with patch('aive.hit_map.build_hit_map',return_value=hits),patch('aive.firing_map.extract_firing_map',return_value=maps[0]),patch('aive.encounter_render.render_encounters') as render:
            result=run_automation(self.cfg());render.assert_not_called()
        self.assertEqual(result['status'],'blocked')
        self.assertIsNone(result['output'])
        self.assertIn('No filler',result['blocked_reason'])
    def test_candidate_export_status_quality_and_optional_lyrics(self):
        maps,hits=fixtures();maps[0]['source']=str(self.clip)
        track=self.root/'track.json';track.write_text('{}')
        design=self.root/'design.json';design.write_text('{}')
        manifest={'output':str(self.root/'original.mp4'),'manifest_path':str(self.root/'manifest.json')}
        text_manifest=dict(manifest,output=str(self.root/'text.mp4'))
        qa={'status':'warn','ok':True,'issues':[{'component':'musical_sync','detail':'unverified'}]}
        with patch('aive.hit_map.build_hit_map',return_value=hits),patch('aive.firing_map.extract_firing_map',return_value=maps[0]),patch('aive.encounter_render.render_encounters',return_value=manifest),patch('aive.encounter_text.apply_verified_lyrics',return_value=text_manifest) as text,patch('aive.encounter_qa.verify_encounters',return_value=qa),patch('aive.attack_qa.measure_attack_alignment',return_value={'musical_sync':'unverified'}):
            result=run_automation(self.cfg(lyric_track=str(track),lyric_design=str(design)))
            text.assert_called_once()
        self.assertEqual(result['status'],'rendered-candidate-preview')
        self.assertEqual(result['output'],text_manifest['output'])
        self.assertFalse(result['readiness']['perceptual_listening'])
        self.assertTrue(Path(result['job_dir'],'attack-alignment.json').is_file())
    def test_designed_lyrics_are_explicit_and_bound_to_selected_song(self):
        maps,hits=fixtures();maps[0]['source']=str(self.clip)
        track=self.root/'track.json';track.write_text('{}')
        design=self.root/'design.json';design.write_text('{}')
        manifest={'output':str(self.root/'original.mp4'),'manifest_path':str(self.root/'manifest.json')}
        qa={'status':'warn','issues':[]}
        with patch('aive.hit_map.build_hit_map',return_value=hits),patch('aive.firing_map.extract_firing_map',return_value=maps[0]),patch('aive.encounter_render.render_encounters',return_value=manifest),patch('aive.encounter_text.apply_verified_lyrics',return_value=manifest) as text,patch('aive.encounter_qa.verify_encounters',return_value=qa),patch('aive.attack_qa.measure_attack_alignment',return_value={'musical_sync':'unverified'}):
            result=run_automation(self.cfg(lyric_track=str(track),lyric_design=str(design)))
            text.assert_called_once()
            self.assertEqual(text.call_args.args,(manifest,str(track),str(self.song)))
            self.assertEqual(text.call_args.kwargs['design_path'],str(design))
            self.assertTrue(text.call_args.kwargs['visual_impacts'])
        self.assertEqual(result['status'],'rendered-candidate-preview')
        with self.assertRaisesRegex(ValueError,'verified music lyric track'):
            self.cfg(lyric_design=str(design)).validate()
        with self.assertRaisesRegex(ValueError,'basic caption stream is disabled'):
            self.cfg(lyric_track=str(track)).validate()

    def test_failures_keep_report(self):
        with patch('aive.hit_map.build_hit_map',side_effect=ValueError('bad decode')):
            result=run_automation(self.cfg())
        self.assertEqual(result['status'],'failed')
        self.assertTrue(Path(result['job_dir'],'REPORT.md').is_file())
    def test_invalid_configuration(self):
        for kw in (dict(duration=True),dict(duration=13),dict(max_source_seconds=601),dict(fps=0),dict(plan_only='yes')):
            with self.assertRaises(ValueError):self.cfg(**kw).validate()


if __name__=='__main__':unittest.main()
