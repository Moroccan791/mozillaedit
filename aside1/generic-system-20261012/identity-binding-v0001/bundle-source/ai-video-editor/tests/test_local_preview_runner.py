import tempfile
from pathlib import Path
import unittest
from unittest.mock import patch
from aive.local_preview_runner import run_local_preview


class LocalPreviewRunnerTests(unittest.TestCase):
    def setup_files(self,tmp):
        root=Path(tmp)
        for f in ('song.wav','source.mp4','profile.json'): (root/f).write_bytes(b'x')
        return dict(song=str(root/'song.wav'),source=str(root/'source.mp4'),profile=str(root/'profile.json'),output_root=str(root/'out'))
    def test_sparse_blocks_no_fallback_or_render(self):
        with tempfile.TemporaryDirectory() as tmp:
            args=self.setup_files(tmp)
            with patch('aive.acoustic_cache.cached_firing_map',return_value=({'candidate_events':[]},True)),patch('aive.acoustic_cache.cached_hit_map',return_value=({},True)),patch('aive.povkills.scan_cached',return_value=[]),patch('aive.local_authored_planner.plan_local_authored',return_value={'duration':0,'timeline':[]}),patch('aive.encounter_render.render_encounters') as render:
                result=run_local_preview(**args)
            self.assertEqual(result['status'],'blocked');self.assertIsNone(result['output'])
            self.assertFalse(result['visual_ai_used']);self.assertFalse(result['manual_source_windows'])
            render.assert_not_called()
    def test_plan_only_uses_absolute_bounded_excerpts(self):
        with tempfile.TemporaryDirectory() as tmp:
            args=self.setup_files(tmp)
            with patch('aive.acoustic_cache.cached_firing_map',return_value=({'candidate_events':[]},True)),patch('aive.acoustic_cache.cached_hit_map',return_value=({},True)) as hit,patch('aive.povkills.scan_cached',return_value=[]),patch('aive.local_authored_planner.plan_local_authored',return_value={'duration':35,'timeline':[{}]}),patch('aive.encounter_render.render_encounters') as render:
                result=run_local_preview(**args,plan_only=True)
            self.assertEqual(result['status'],'planned-local-preview')
            self.assertEqual([(c.args[1],c.args[2]) for c in hit.call_args_list],[(8,10),(18,10),(28,10),(38,5)])
            render.assert_not_called()
    def test_invalid_duration_and_missing_input(self):
        with tempfile.TemporaryDirectory() as tmp:
            args=self.setup_files(tmp)
            for d in (0,29,51):
                with self.assertRaises(ValueError): run_local_preview(**args,duration=d)
            args['source']='missing'
            with self.assertRaises(ValueError):run_local_preview(**args)
    def test_analysis_error_is_saved_no_fallback(self):
        with tempfile.TemporaryDirectory() as tmp:
            args=self.setup_files(tmp)
            with patch('aive.acoustic_cache.cached_firing_map',side_effect=ValueError('invalid source')),patch('aive.encounter_render.render_encounters') as render:
                result=run_local_preview(**args)
            self.assertEqual(result['status'],'failed');self.assertTrue(Path(result['job_dir'],'error.txt').is_file())
            render.assert_not_called()


if __name__=='__main__':unittest.main()
