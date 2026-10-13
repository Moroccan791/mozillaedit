"""Mocked orchestration only: no footage rendering or external installation."""
import copy
import hashlib
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

from aive.beats import BeatInfo
from aive.daily_runner import JobConfig, run_job
from aive.music import MusicProfile


class DailyAuthoredTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.clips = self.root / 'clips'
        self.clips.mkdir()
        self.sources = []
        for i in range(4):
            source = self.clips / f'{i}.mp4'
            source.write_bytes(f'mocked footage {i}'.encode())
            self.sources.append(str(source.resolve()))
        self.song = self.root / 'song.wav'
        self.song.write_bytes(b'mocked music')
        self.sha = hashlib.sha256(self.song.read_bytes()).hexdigest()
        self.ev = self.root / 'events.json'
        self.events = [dict(source=s, confirmed=True, source_duration=20.,
            source_audio_event=2.9, source_visual_event=3., confidence=.9) for s in self.sources]
        self.ev.write_text(json.dumps(self.events))
        self.plan = dict(schema_version='encounters/v1', music_continuous=True, gaps=[],
            duration=8., requested_duration=8., music_start=0., music_end=8., warnings=[], timeline=[])
        for i, source in enumerate(self.sources):
            self.plan['timeline'].append(dict(source=source, source_start=2., source_end=4.,
                output_start=2.*i, output_end=2.*i+2., music_start=2.*i, music_end=2.*i+2., speed=1.,
                events=[dict(self.events[i], output_audio_event=2.*i+.9, output_visual_event=2.*i+1.)]))
        self.design = dict(schema_version='authored-footage/v1',
            shots=[dict(role=r, composition='inset' if r=='contrast' else 'full')
                for r in ('setup', 'impact', 'contrast', 'payoff')],
            bridges=[dict(boundary=2, direction='right', frames=8)], ending=dict(fade_frames=12))
        self.dp = self.root / 'footage.json'
        self.dp.write_text(json.dumps(self.design))
        self.track = self.root / 'track.json'
        self.track_doc = dict(schema='lyric-track/v1', audio_sha256=self.sha,
            provenance=dict(alignment_verified=True, method='mocked supplied review'),
            words=[dict(text='WORD', start=.2, end=.5)])
        self.track.write_text(json.dumps(self.track_doc))
        self.ld = self.root / 'lyrics.json'
        self.lyric_doc = dict(source=dict(music_source=str(self.song.resolve()), audio_sha256=self.sha),
            excerpt=dict(music_start_sample=0, sample_rate=48000, sample_count=384000, output_start=0),
            canvas=dict(width=1280, height=720, mode='gameplay'),
            visual_impacts=[2.*i+t for i in range(4) for t in (.9, 1.)],
            allow_impact_collision=False, allow_protected_overlap=False)
        self.ld.write_text(json.dumps(self.lyric_doc))
        self.rendered = dict(output=str(self.root/'original.mp4'), manifest_path=str(self.root/'manifest.json'))
        self.texted = dict(output=str(self.root/'text.mp4'), manifest_path=str(self.root/'text-manifest.json'),
            typography_audit=dict(audio_mode='copy'))

    def cfg(self, **kw):
        return JobConfig(**(dict(song=str(self.song), clip_folder=str(self.clips),
            output_root=str(self.root/'out'), event_files=(str(self.ev),), duration=8.,
            style='authored-footage', authored_design=str(self.dp)) | kw))

    def run_mocked(self, config=None, plan=None, **options):
        with patch('aive.beats.detect_cached', return_value=BeatInfo(bpm=120, offset=0, duration=20.)), \
             patch('aive.music.analyze_cached', return_value=MusicProfile(duration=20.)), \
             patch('aive.encounters.plan_encounters', return_value=copy.deepcopy(self.plan if plan is None else plan)) as planner, \
             patch('aive.encounter_render.render_encounters', return_value=self.rendered) as render, \
             patch('aive.encounter_qa.verify_encounters', return_value=dict(status='pass', ok=True, issues=[])) as qa, \
             patch('aive.lyric_track.load_lyric_track', **options.get('load', dict(return_value=object()))) as load, \
             patch('aive.lyric_design.compile_lyric_design', **options.get('compile', dict(return_value=SimpleNamespace(ass='Dialogue: mocked', audit={})))) as compile_design, \
             patch('aive.encounter_text.apply_verified_lyrics', **options.get('text', dict(return_value=self.texted))) as text:
            result = run_job(config or self.cfg())
            return result, planner, render, qa, load, compile_design, text

    def test_attaches_exact_design_to_actual_plan_without_retiming(self):
        result, planner, render, qa, *_ = self.run_mocked()
        self.assertEqual(result['status'], 'rendered')
        plan = render.call_args.args[0]
        self.assertEqual(plan['timeline'], self.plan['timeline'])
        self.assertEqual(plan['authored_design'], self.design)
        self.assertEqual(render.call_args.kwargs['config'].style, 'authored-footage')
        self.assertEqual(qa.call_args.args[0], self.rendered)
        provenance = result['pipeline_provenance']
        self.assertFalse(provenance['perceptual_approval'])
        self.assertEqual(provenance['authored_design']['sha256'], hashlib.sha256(self.dp.read_bytes()).hexdigest())
        self.assertIn(provenance['authored_design']['sha256'], Path(result['job_dir'], 'REPORT.md').read_text())
        self.assertEqual(planner.call_args.args[0], self.events)

    def test_missing_design_wrong_style_and_long_proof_rejected(self):
        for change in (dict(authored_design=None), dict(style='clean'), dict(duration=13.),
                       dict(authored_design=str(self.root/'missing.json'))):
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.cfg(**change).validate()

    def test_malformed_bounded_design_never_plans_or_renders(self):
        for payload in ('{', '[]', '{"a":NaN}', '{"a":1,"a":2}', ' '*128001):
            with self.subTest(payload=payload[:20]):
                self.dp.write_text(payload)
                result, planner, render, *_ = self.run_mocked()
                self.assertEqual(result['status'], 'failed')
                planner.assert_not_called()
                render.assert_not_called()

    def test_invalid_strict_design_and_timing_never_render_or_downgrade(self):
        for design in (dict(self.design, extra='unsafe'), dict(self.design, shots=[]),
                       dict(self.design, ending=dict(fade_frames=90))):
            self.dp.write_text(json.dumps(design))
            result, _, render, *_ = self.run_mocked()
            self.assertEqual(result['status'], 'failed')
            render.assert_not_called()
        self.dp.write_text(json.dumps(self.design))
        plan = copy.deepcopy(self.plan)
        plan['timeline'][0]['events'][0]['output_visual_event'] = 1.2
        result, _, render, *_ = self.run_mocked(plan=plan)
        self.assertEqual(result['status'], 'failed')
        self.assertIn('event timing', result['error'])
        render.assert_not_called()

    def test_unconfirmed_and_empty_events_never_promoted(self):
        self.ev.write_text(json.dumps([]))
        result, planner, render, *_ = self.run_mocked()
        self.assertEqual(result['status'], 'blocked')
        planner.assert_not_called()
        render.assert_not_called()
        self.ev.write_text(json.dumps(self.events))
        plan = copy.deepcopy(self.plan)
        plan['timeline'][0]['events'][0]['confirmed'] = False
        result, _, render, *_ = self.run_mocked(plan=plan)
        self.assertEqual(result['status'], 'failed')
        render.assert_not_called()

    def test_lyric_pair_missing_files_rejected(self):
        for change in (dict(lyric_track=str(self.track)), dict(lyric_design=str(self.ld)),
                       dict(lyric_track=str(self.track), lyric_design='missing.json')):
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.cfg(**change).validate()

    def test_invalid_track_fails_before_analysis_or_render(self):
        for document in ('{', '[]', '{}', json.dumps(dict(self.track_doc, audio_sha256='0'*64)),
                         json.dumps(dict(self.track_doc, provenance=dict(alignment_verified=False)))):
            self.track.write_text(document)
            result, planner, render, *_ = self.run_mocked(self.cfg(lyric_track=str(self.track), lyric_design=str(self.ld)))
            self.assertEqual(result['status'], 'failed')
            planner.assert_not_called()
            render.assert_not_called()

    def test_lyric_preflight_render_text_qa_order_and_both_clocks(self):
        order=[]
        def validate(*a, **kw):order.append('preflight');return object()
        def compiled(*a, **kw):order.append('compile');return SimpleNamespace(ass='Dialogue: mocked', audit={})
        def render(*a, **kw):order.append('render');return self.rendered
        def text(*a, **kw):order.append('text');return self.texted
        def qa(*a, **kw):order.append('qa');return dict(status='pass', ok=True, issues=[])
        with patch('aive.encounter_render.render_encounters', side_effect=render), \
             patch('aive.encounter_qa.verify_encounters', side_effect=qa), \
             patch('aive.beats.detect_cached', return_value=BeatInfo(bpm=120, offset=0, duration=20.)), \
             patch('aive.music.analyze_cached', return_value=MusicProfile(duration=20.)), \
             patch('aive.encounters.plan_encounters', return_value=copy.deepcopy(self.plan)), \
             patch('aive.lyric_track.load_lyric_track', side_effect=validate), \
             patch('aive.lyric_design.compile_lyric_design', side_effect=compiled), \
             patch('aive.encounter_text.apply_verified_lyrics', side_effect=text) as burn:
            result=run_job(self.cfg(lyric_track=str(self.track), lyric_design=str(self.ld)))
        self.assertEqual(order, ['preflight', 'compile', 'render', 'text', 'qa'])
        self.assertEqual(result['output'], self.texted['output'])
        self.assertEqual(burn.call_args.kwargs['visual_impacts'], sorted(self.lyric_doc['visual_impacts']))
        self.assertEqual(Path(burn.call_args.args[1]).read_bytes(), self.track.read_bytes())
        self.assertEqual(Path(burn.call_args.kwargs['design_path']).read_bytes(), self.ld.read_bytes())
        self.assertFalse(result['lyric_preflight']['perceptual_approval'])

    def test_lyric_clock_protection_and_collision_optouts_fail_before_render(self):
        mutations = [lambda d:d['excerpt'].update(sample_count=1),
            lambda d:d['source'].update(audio_sha256='0'*64),
            lambda d:d['canvas'].update(mode='diagnostic'),
            lambda d:d.update(visual_impacts=[1.,3.,5.,7.]),
            lambda d:d.update(allow_impact_collision=True),
            lambda d:d.update(allow_protected_overlap=True)]
        for mutate in mutations:
            document=copy.deepcopy(self.lyric_doc);mutate(document)
            self.ld.write_text(json.dumps(document))
            result, _, render, *_ = self.run_mocked(self.cfg(lyric_track=str(self.track), lyric_design=str(self.ld)))
            self.assertEqual(result['status'], 'failed')
            render.assert_not_called()

    def test_malformed_missing_or_oversized_lyric_design_never_renders(self):
        for payload in ('{', '[]', '{}', '{"enabled":NaN}', ' '*128001):
            self.ld.write_text(payload)
            result, _, render, *_ = self.run_mocked(self.cfg(lyric_track=str(self.track), lyric_design=str(self.ld)))
            self.assertEqual(result['status'], 'failed')
            render.assert_not_called()

    def test_input_snapshots_preserve_lineage_if_original_changes(self):
        expected=self.dp.read_bytes()
        def mutate(*a, **kw):
            self.dp.write_text('{}')
            return copy.deepcopy(self.plan)
        with patch('aive.beats.detect_cached', return_value=BeatInfo(bpm=120, offset=0, duration=20.)), \
             patch('aive.music.analyze_cached', return_value=MusicProfile(duration=20.)), \
             patch('aive.encounters.plan_encounters', side_effect=mutate), \
             patch('aive.encounter_render.render_encounters', return_value=self.rendered) as render, \
             patch('aive.encounter_qa.verify_encounters', return_value=dict(status='pass', ok=True, issues=[])):
            result=run_job(self.cfg())
        self.assertEqual(result['status'], 'rendered')
        self.assertEqual(render.call_args.args[0]['authored_design'], self.design)
        lineage=result['pipeline_provenance']['authored_design']
        self.assertEqual(lineage['sha256'], hashlib.sha256(expected).hexdigest())
        self.assertEqual(Path(lineage['snapshot_path']).read_bytes(), expected)

    def test_reviewed_closure_gate_precedes_render_and_lyrics(self):
        config=self.cfg(closure_review=str(self.dp), lyric_track=str(self.track), lyric_design=str(self.ld))
        review=dict(phrases=[dict(id='phrase-1', end=8., end_interval=[7.9,8.1], decision='phrase_end')])
        events=[dict(e, reviewed_fight_id=f'fight-{i}') for i,e in enumerate(self.events)]
        required=['timeline','evidence_binding','fight_bounds','join_outcomes','ending_fight','phrase_end','closure_gap']
        for fail in (False, True):
            audit=dict(status='fail' if fail else 'pass', checks=[dict(name=n,
                status='fail' if fail and n=='fight_bounds' else 'pass', reason='mocked review gate') for n in required],
                perceptual_approval=False)
            with patch('aive.daily_runner._reviewed_closure_inputs', return_value=(review,{}, {},self.sha,'1'*64)), \
                 patch('aive.daily_runner._bind_reviewed_closure_events', return_value=(events,{})), \
                 patch('aive.closure_qa.audit_closure', return_value=audit):
                result, planner, render, qa, load, _, text=self.run_mocked(config)
            self.assertTrue(planner.call_args.kwargs['require_reviewed_phrase_end'])
            self.assertEqual(planner.call_args.kwargs['reviewed_phrase_ends'][0]['id'], 'phrase-1')
            self.assertFalse(result['closure_review_gate']['perceptual_approval'])
            if fail:
                self.assertEqual(result['status'], 'blocked')
                render.assert_not_called();load.assert_not_called();text.assert_not_called();qa.assert_not_called()
            else:
                self.assertEqual(result['status'], 'rendered')
                render.assert_called_once();text.assert_called_once();qa.assert_called_once()
                self.assertEqual(render.call_args.args[0]['reviewed_closure']['file_sha256'], '1'*64)

    def test_decoded_track_or_design_compile_failure_never_renders(self):
        for options in (dict(load=dict(side_effect=ValueError('invalid decoded track'))),
                        dict(compile=dict(side_effect=ValueError('invalid strict lyric design'))),
                        dict(compile=dict(return_value=SimpleNamespace(ass='', audit={})))):
            result, _, render, *_ = self.run_mocked(self.cfg(lyric_track=str(self.track), lyric_design=str(self.ld)), **options)
            self.assertEqual(result['status'], 'failed')
            render.assert_not_called()

    def test_lyric_failure_preserves_original_and_never_runs_qa(self):
        result, _, render, qa, *_ = self.run_mocked(self.cfg(lyric_track=str(self.track), lyric_design=str(self.ld)),
            text=dict(side_effect=ValueError('text failure')))
        self.assertEqual(result['status'], 'failed')
        self.assertEqual(result['output'], self.rendered['output'])
        render.assert_called_once()
        qa.assert_not_called()

    def test_plan_only_validates_but_never_renders_or_texts(self):
        result, _, render, qa, load, compiled, text = self.run_mocked(
            self.cfg(plan_only=True, lyric_track=str(self.track), lyric_design=str(self.ld)))
        self.assertEqual(result['status'], 'planned')
        load.assert_called_once();compiled.assert_called_once()
        render.assert_not_called();text.assert_not_called();qa.assert_not_called()


if __name__ == '__main__':
    unittest.main()
