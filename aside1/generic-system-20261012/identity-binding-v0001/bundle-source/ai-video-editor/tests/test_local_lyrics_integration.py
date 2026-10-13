"""Generic runner orchestration only; synthetic inputs are not reviewed vocals."""
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from contextlib import ExitStack
from aive.local_preview_runner import run_local_preview


class Prepared:
    def to_dict(self):
        return {'schema_version':'lyric-preparation/v1','synthetic':True}


class LocalLyricsIntegrationTests(unittest.TestCase):
    def files(self, root):
        for name in ('song.wav','raw.mp4','profile.json','track.json'):
            (root/name).write_bytes(b'synthetic')
        return dict(song=str(root/'song.wav'),source=str(root/'raw.mp4'),
                    profile=str(root/'profile.json'),output_root=str(root/'jobs'))

    def patches(self, stack, order, prepare_error=None):
        stack.enter_context(patch('aive.acoustic_cache.cached_firing_map',return_value=({'candidate_events':[]},True)))
        stack.enter_context(patch('aive.acoustic_cache.cached_hit_map',return_value=({},True)))
        stack.enter_context(patch('aive.povkills.scan_cached',return_value=[]))
        stack.enter_context(patch('aive.local_authored_planner.plan_local_authored',return_value={
            'duration':35.,'timeline':[{}],'schema_version':'encounters/v1','music_start':8.}))
        stack.enter_context(patch('aive.calibration_report.audit_local_evidence',return_value={'status':'unverified'}))
        stack.enter_context(patch('aive.closure_qa.audit_closure',return_value={'status':'warn'}))
        def prepare(*a,**k):
            order.append('prepare')
            if prepare_error: raise ValueError(prepare_error)
            return Prepared()
        prep=stack.enter_context(patch('aive.lyric_workflow.prepare_lyrics',side_effect=prepare))
        def render(*a,**k):
            order.append('render')
            return dict(style='authored-footage',authored_design={'schema_version':'authored-footage/v2'},
                        manifest_path='base-manifest.json',output='base.mp4')
        render_mock=stack.enter_context(patch('aive.encounter_render.render_encounters',side_effect=render))
        def apply(manifest,prepared):
            order.append('lyrics')
            return dict(manifest,manifest_path='text-manifest.json',output='text.mp4',typography_audit={'enabled':True})
        stack.enter_context(patch('aive.lyric_workflow.apply_prepared_lyrics',side_effect=apply))
        def quality(*a): order.append('quality');return {'status':'warn','ok':True}
        stack.enter_context(patch('aive.encounter_qa.verify_encounters',side_effect=quality))
        stack.enter_context(patch('aive.attack_qa.measure_attack_alignment',return_value={'status':'warn'}))
        return prep,render_mock

    def test_generic_verified_preflight_before_render_and_text_before_qa(self):
        for title,start in (('song-a',8),('song-b',31)):
            with self.subTest(song=title),tempfile.TemporaryDirectory() as tmp,ExitStack() as stack:
                root=Path(tmp);args=self.files(root);order=[]
                prep,render=self.patches(stack,order)
                result=run_local_preview(**args,music_start=start,lyrics_mode='verified',lyric_track=str(root/'track.json'))
                self.assertEqual(result['status'],'rendered-local-candidate-preview',result.get('error'))
                self.assertEqual(order,['prepare','render','lyrics','quality'])
                self.assertEqual(result['output'],'text.mp4')
                self.assertFalse(result['lyrics']['alignment_verified'])
                self.assertEqual(result['lyrics']['status'],'rendered-verified-input')
                self.assertEqual(prep.call_args.args[0],args['song'])
                self.assertEqual(result['render_manifest'],'text-manifest.json')

    def test_invalid_lyrics_blocks_before_video_and_no_fallback(self):
        with tempfile.TemporaryDirectory() as tmp,ExitStack() as stack:
            root=Path(tmp);args=self.files(root);order=[]
            _,render=self.patches(stack,order,prepare_error='unverified track')
            result=run_local_preview(**args,lyrics_mode='verified',lyric_track=str(root/'track.json'))
            self.assertEqual(result['status'],'failed');self.assertIsNone(result['output'])
            self.assertEqual(result['lyrics']['status'],'blocked');render.assert_not_called()
            self.assertFalse(result['fallback_allowed'])

    def test_candidates_save_and_stop_before_footage_analysis(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);args=self.files(root)
            with patch('aive.lyric_workflow.extract_lyric_candidates',return_value={'status':'UNVERIFIED','snapshot_path':'candidates.json'}) as extract,patch('aive.acoustic_cache.cached_firing_map') as firing:
                result=run_local_preview(**args,lyrics_mode='candidates',lyric_model=str(root/'local-model'))
            self.assertEqual(result['status'],'blocked');self.assertIsNone(result['output'])
            self.assertEqual(result['lyrics']['status'],'awaiting-independent-verification')
            self.assertFalse(result['lyrics']['alignment_verified']);firing.assert_not_called()
            self.assertEqual(extract.call_args.args[0],args['song'])
            self.assertTrue(Path(result['job_dir'],'job-report.json').is_file())

    def test_no_silent_ignored_lyrics_or_mode_switch(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);args=self.files(root)
            for kw in ({'lyric_track':str(root/'track.json')},{'lyrics_mode':'verified'},
                       {'lyrics_mode':'candidates'},{'lyrics_mode':'verified','lyric_track':str(root/'track.json'),'lyric_model':'x'}):
                with self.assertRaises(ValueError):run_local_preview(**args,**kw)

    def test_plan_only_still_preflights_requested_lyrics(self):
        with tempfile.TemporaryDirectory() as tmp,ExitStack() as stack:
            root=Path(tmp);args=self.files(root);order=[]
            _,render=self.patches(stack,order)
            result=run_local_preview(**args,plan_only=True,lyrics_mode='verified',lyric_track=str(root/'track.json'))
            self.assertEqual(result['status'],'planned-local-preview');self.assertEqual(order,['prepare'])
            render.assert_not_called();self.assertIsNone(result['output'])


if __name__=='__main__':unittest.main()
