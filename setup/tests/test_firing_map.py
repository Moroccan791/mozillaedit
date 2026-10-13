"""Bounded gameplay candidate detection and explicit reviewed-only validation."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
from aive.firing_map import (analyze_sample_windows, extract_firing_map,
                             validate_reviewed_firing_map, _probe)


def pulse_audio(times, duration=4, sr=24000):
    samples = np.zeros(round(duration * sr), dtype=np.float32)
    rng = np.random.default_rng(412)
    for t in times:
        start = round(t * sr)
        n = min(round(.018 * sr), len(samples)-start)
        samples[start:start+n] += (.65 * rng.normal(size=n) * np.exp(-np.arange(n)/(sr*.003))).astype('float32')
    return samples


def reviewed():
    identity = dict(path='source.mp4', size_bytes=1000, mtime_ns=123)
    source = dict(id='source.mp4', duration=4., analyzed_start=0., analyzed_end=4.,
        file_identity=identity, audio_sha256='a'*64,
        audio_identity=dict(encoding='f32le', sample_rate=24000, channels=1,
                            sample_zero=True, sample_count=96000))
    event = dict(id='reviewed-1', source='source.mp4', confirmed=True, type='audio_transient',
        source_audio_event=1., source_visual_event=1.015, audio_attack_interval=[.99, 1.01],
        visual_attack_interval=[1., 1.03], audio_sha256='a'*64, file_identity=identity,
        provenance=[dict(reviewer='human-name', method='frame/audio inspection', reference='review-001')],
        context_review=dict(status='reviewed', source_start=.5, source_end=2., notes='HUD and nearby frames inspected'),
        outcome_review=dict(status='reviewed', outcome='unknown', notes='No reliable kill confirmation'),
        visual_review='reviewed', instrument='unknown', origin='unknown')
    return dict(schema_version='firing-map/v1', mode='reviewed', sources=[source], events=[event])


class CandidateTests(unittest.TestCase):
    def test_silence_and_finite_contract(self):
        result = analyze_sample_windows(np.zeros(24000, dtype='float32'), 24000)
        self.assertEqual(result['candidate_events'], [])
        self.assertEqual(result['candidate_windows'], [])
        self.assertFalse(result['confirmed'])
        json.dumps(result, allow_nan=False)
        for value in (np.nan, np.inf, -np.inf, 17.):
            audio = np.zeros(24000, dtype='float32'); audio[4000] = value
            with self.assertRaises(ValueError):
                analyze_sample_windows(audio, 24000)

    def test_burst_retains_50ms_candidates_with_intervals(self):
        times = [1., 1.05, 1.10, 1.15, 2.5]
        result = analyze_sample_windows(pulse_audio(times), 24000,
            source_start=10, source_duration=20, source_id='game.mp4')
        events = result['candidate_events']
        for t in times:
            self.assertTrue(any(abs(e['time']-(t+10)) <= .015 for e in events), (t, events))
        for event in events:
            self.assertFalse(event['confirmed'])
            self.assertEqual(event['type'], 'audio_transient')
            self.assertEqual(event['instrument'], 'unknown')
            self.assertEqual(event['origin'], 'unknown')
            self.assertLess(event['attack_interval'][0], event['attack_interval'][1])
            self.assertLessEqual(event['attack_interval'][0], event['time'])
            self.assertGreaterEqual(event['attack_interval'][1], event['time'])
            self.assertTrue(0 < event['strength'] <= 1)
            self.assertIn('uncertainty', event)
        self.assertEqual(len({e['id'] for e in events}), len(events))
        self.assertEqual(result['source'], 'game.mp4')
        json.dumps(result, allow_nan=False)

    def test_dense_windows_are_bounded_nonoverlapping_and_not_reviewed(self):
        result = analyze_sample_windows(pulse_audio(np.arange(.3, 60, .8), duration=60), 24000)
        windows = result['candidate_windows']
        self.assertEqual(len(windows), 16)
        for w in windows:
            self.assertTrue(0 <= w['source_start'] < w['source_end'] <= 60)
            self.assertLessEqual(w['source_end']-w['source_start'], 3 + 1e-9)
            self.assertEqual(w['source_duration'], 60)
            self.assertEqual(w['visual_review'], 'unreviewed')
            self.assertEqual(w['outcome'], 'unknown')
            for e in w['candidate_events']:
                self.assertLessEqual(w['source_start'], e['source_start'])
                self.assertGreaterEqual(w['source_end'], e['source_end'])
        for a, b in zip(windows, windows[1:]):
            self.assertLessEqual(a['source_end'], b['source_start'])
        with self.assertRaisesRegex(ValueError, 'reviewed'):
            validate_reviewed_firing_map(result)

    def test_isolated_window_has_context_and_safe_edges(self):
        result = analyze_sample_windows(pulse_audio([2], duration=5), 24000)
        window = result['candidate_windows'][0]
        self.assertGreaterEqual(window['source_end']-window['source_start'], 2)
        self.assertLessEqual(window['source_start'], 1.65)
        self.assertGreaterEqual(window['source_end'], 2.35)
        edge = analyze_sample_windows(pulse_audio([0, .95], duration=1), 24000)
        for w in edge['candidate_windows']:
            self.assertTrue(0 <= w['source_start'] < w['source_end'] <= 1)

    def test_long_dense_bursts_never_trim_member_intervals(self):
        data = analyze_sample_windows(pulse_audio(np.arange(.4, 8, .05), duration=9), 24000)
        for w in data['candidate_windows']:
            self.assertLessEqual(w['source_end']-w['source_start'], 3 + 1e-9)
            for e in w['candidate_events']:
                self.assertLessEqual(w['source_start'], e['attack_interval'][0])
                self.assertGreaterEqual(w['source_end'], e['attack_interval'][1])
        self.assertEqual(data['candidate_window_selection']['available_event_count'], len(data['candidate_events']))

    def test_continuous_tone_not_identified_as_firing(self):
        t = np.arange(24000*4)/24000
        audio = (.1*np.sin(2*np.pi*800*t)).astype('float32')
        result = analyze_sample_windows(audio, 24000)
        self.assertLessEqual(len(result['candidate_events']), 1)
        self.assertNotIn('kill_count', result)

    def test_budgets_and_invalid_arguments_fail_before_decode(self):
        audio = np.zeros(24000, dtype='float32')
        for kwargs in ({'max_windows':17}, {'max_windows':0}, {'source_start':float('nan')}, {'source_duration':.5}):
            with self.assertRaises(ValueError): analyze_sample_windows(audio, 24000, **kwargs)
        for sr in (22050, 48000.0, True):
            with self.assertRaises(ValueError): analyze_sample_windows(audio, sr)
        for samples in ([], audio.reshape(1,-1), np.array(['x'])):
            with self.assertRaises(ValueError): analyze_sample_windows(samples, 24000)
        # Zero-stride oversized array: rejection must happen before allocation/filtering.
        oversized = np.lib.stride_tricks.as_strided(audio[:1], shape=(600*24000+1,), strides=(0,))
        with self.assertRaises(ValueError): analyze_sample_windows(oversized, 24000)
        with patch('aive.firing_map._probe') as probe:
            with self.assertRaises(ValueError): extract_firing_map('no-file', max_source_seconds=601)
            probe.assert_not_called()

    def test_48k_and_low_level_noise(self):
        result = analyze_sample_windows(pulse_audio([.5, .55], duration=1, sr=48000), 48000)
        self.assertGreaterEqual(len(result['candidate_events']), 2)
        quiet = np.random.default_rng(12).normal(0, 1e-6, 24000).astype('float32')
        self.assertEqual(analyze_sample_windows(quiet, 24000)['candidate_events'], [])


class ReviewedTests(unittest.TestCase):
    def test_accepts_complete_explicit_review_without_mutation(self):
        data = reviewed(); before = copy.deepcopy(data)
        self.assertIs(validate_reviewed_firing_map(data, expected_sources={'source.mp4': data['sources'][0]}), data)
        self.assertEqual(data, before)

    def test_missing_fields_and_candidate_promotion_rejected(self):
        for key in ('source', 'source_audio_event', 'source_visual_event', 'audio_attack_interval',
                    'visual_attack_interval', 'provenance', 'context_review', 'outcome_review',
                    'audio_sha256', 'file_identity', 'visual_review'):
            data = reviewed(); del data['events'][0][key]
            with self.subTest(key=key), self.assertRaises(ValueError): validate_reviewed_firing_map(data)
        for key in ('sources', 'events', 'mode'):
            data = reviewed(); del data[key]
            with self.assertRaises(ValueError): validate_reviewed_firing_map(data)
        candidate = analyze_sample_windows(pulse_audio([1]), 24000)
        candidate['mode'] = 'reviewed'
        with self.assertRaises(ValueError): validate_reviewed_firing_map(candidate)

    def test_identity_timing_context_and_outcome_fail_closed(self):
        mutations = [lambda e: e.update(confirmed=1), lambda e: e.update(provenance=[]),
            lambda e: e.update(source_audio_event=float('nan')),
            lambda e: e.update(source_visual_event=4.1),
            lambda e: e.update(audio_attack_interval=[1.01, .99]),
            lambda e: e.update(audio_sha256='b'*64),
            lambda e: e.update(source='other.mp4'),
            lambda e: e['context_review'].update(source_start=1.005),
            lambda e: e['outcome_review'].update(notes=''),
            lambda e: e['outcome_review'].update(status='unreviewed'),
            lambda e: e['provenance'][0].update(reference='')]
        for mutation in mutations:
            data = reviewed(); mutation(data['events'][0])
            with self.assertRaises(ValueError): validate_reviewed_firing_map(data)
        data = reviewed()
        with self.assertRaises(ValueError): validate_reviewed_firing_map(data, expected_sources={})
        data['sources'][0]['audio_identity']['sample_count'] = 1000
        with self.assertRaises(ValueError): validate_reviewed_firing_map(data)


@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'FFmpeg required')
class DecodeTests(unittest.TestCase):
    def test_probe_invalid_metadata_and_budget(self):
        invalid = [dict(format=dict(duration='nan'), streams=[dict(codec_type='audio')]),
                   dict(format=dict(duration='1'), streams=[]),
                   dict(format=dict(duration='inf'), streams=[dict(codec_type='audio')])]
        for metadata in invalid:
            def run(command, **kwargs):
                kwargs['stdout'].write(json.dumps(metadata).encode())
                return subprocess.CompletedProcess(command, 0)
            with patch('aive.firing_map.subprocess.run', side_effect=run):
                with self.assertRaises(ValueError): _probe(Path('fake.wav'), 'ffprobe')
        def huge(command, **kwargs):
            kwargs['stdout'].write(b'x'*65537)
            return subprocess.CompletedProcess(command, 0)
        with patch('aive.firing_map.subprocess.run', side_effect=huge):
            with self.assertRaisesRegex(ValueError, 'budget'): _probe(Path('fake.wav'), 'ffprobe')

    def test_decode_output_budget_and_source_change_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)/'file.mp4'; source.write_bytes(b'test')
            def oversized(command, **kwargs):
                kwargs['stdout'].write(b'x' * 300000)
                return subprocess.CompletedProcess(command, 0)
            with patch('aive.firing_map._probe', return_value=dict(duration=2.)), \
                 patch('aive.firing_map.subprocess.run', side_effect=oversized):
                with self.assertRaisesRegex(ValueError, 'byte budget'):
                    extract_firing_map(source, max_source_seconds=.01)
            def changed(command, **kwargs):
                kwargs['stdout'].write(np.zeros(240, dtype='<f4').tobytes())
                source.write_bytes(b'changed-file')
                return subprocess.CompletedProcess(command, 0)
            with patch('aive.firing_map._probe', return_value=dict(duration=2.)), \
                 patch('aive.firing_map.subprocess.run', side_effect=changed):
                with self.assertRaisesRegex(ValueError, 'changed'):
                    extract_firing_map(source, max_source_seconds=.01)

    def test_real_ffmpeg_sample_zero_duration_and_identity(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp)/'audio.wav'
            import wave
            samples = pulse_audio([.2, 1.2], duration=2)
            with wave.open(str(path), 'wb') as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000)
                w.writeframes((np.clip(samples, -1, 1)*32767).astype('<i2').tobytes())
            real_run = subprocess.run
            commands = []
            def run(command, **kwargs):
                commands.append(command)
                return real_run(command, **kwargs)
            with patch('aive.firing_map.subprocess.run', side_effect=run):
                data = extract_firing_map(path, max_source_seconds=.75)
            command = next(c for c in commands if '-ac' in c)
            self.assertLess(command.index('-t'), command.index('-i'))
            self.assertNotIn('-ss', command)
            self.assertIn('-fs', command)
            self.assertIn('-vn', command)
            source = data['sources'][0]
            self.assertAlmostEqual(source['analyzed_end'], .75, places=3)
            self.assertEqual(source['audio_identity']['sample_count'], 18000)
            self.assertTrue(source['audio_identity']['sample_zero'])
            self.assertEqual(source['file_identity']['size_bytes'], path.stat().st_size)
            self.assertEqual(len(source['audio_sha256']), 64)
            self.assertTrue(any(abs(e['time']-.2)<.02 for e in data['candidate_events']))
            self.assertTrue(all(e['time']<.75 for e in data['candidate_events']))
            with self.assertRaises(ValueError): validate_reviewed_firing_map(data)


if __name__ == '__main__':
    unittest.main()


