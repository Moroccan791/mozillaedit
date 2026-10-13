"""No media probing, decoding, installations or network: mocked builders only."""
import copy
import hashlib
import importlib
import json
import math
import os
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch

from aive import acoustic_cache as cache


def hit(source, start, duration):
    first = max(0, math.floor((start - 1) * 24000)) / 24000
    last = min(600 * 24000, math.ceil((start + duration + 1) * 24000)) / 24000
    return dict(schema_version='hit-map/v1', song_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
        excerpt=dict(start=start, duration=duration, end=start + duration),
        review_status='unreviewed', instrumentation='unknown', interpretation='UNVERIFIED acoustic candidates',
        metadata={'status': 'UNVERIFIED', 'note': 'do not certify'}, candidates=[dict(
            id='hit-001', time=start + duration / 2, refined_time=None, refined_interval=None,
            strength=.8, preview_eligible=False, confirmed=False, review_status='unreviewed',
            instrumentation='unknown', interpretation='UNVERIFIED', evidence=dict(
                method='multiband_positive_percussive_stft_flux/v1', accent_audit={'status': 'UNVERIFIED'}))],
        decode=dict(method='ffmpeg_sample_zero_input_bounded_atrim', sample_rate=24000,
                    channels=1, pcm_start=first, pcm_end=last, input_end=last))


def firing(source, *, max_source_seconds, max_windows):
    duration = 4.
    end = min(duration, max_source_seconds)
    event = dict(id='candidate-00001', source=str(source), time=end / 2,
        source_start=end / 2 - .001, source_end=end / 2 + .001,
        attack_interval=[end / 2 - .001, end / 2 + .001], confirmed=False,
        type='audio_transient', instrument='unknown', origin='unknown', strength=.8,
        uncertainty=dict(timing_seconds=.005, identity='unknown', note='UNVERIFIED'),
        evidence=dict(method='multiband-energy-rise/v1', band_count=3, local_salience=10., score=2.))
    st = source.stat()
    identity = dict(path=str(source), size_bytes=st.st_size, mtime_ns=st.st_mtime_ns)
    return dict(schema_version='firing-map/v1', mode='candidate', confirmed=False,
        source=str(source), source_duration=duration, sources=[dict(id=str(source), duration=duration,
            analyzed_start=0., analyzed_end=end, sample_rate=24000, channels=1,
            file_identity=identity, audio_sha256='a' * 64,
            audio_identity=dict(encoding='f32le', sample_zero=True, sample_rate=24000,
                                channels=1, sample_count=round(end * 24000)),
            probe=dict(duration=duration, audio_stream={'codec_type': 'audio'}))],
        candidate_events=[event], candidate_windows=[dict(id='window-001', source=str(source),
            source_duration=duration, source_start=0., source_end=end, candidate_events=[event],
            visual_review='unreviewed', outcome='unknown', confirmed=False)],
        limitations=['UNVERIFIED acoustic identity'], metadata={'status': 'UNVERIFIED'},
        analysis=dict(method='multiband-energy-rise/v1', max_source_seconds=end, max_windows=max_windows))


class AcousticCacheTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / 'source.bin'
        self.source.write_bytes(b'not real media')
        self.cache_dir = self.root / 'cache'
        # Avoid even importing the expensive builder dependencies.
        self.hit_module = types.ModuleType('aive.hit_map')
        self.firing_module = types.ModuleType('aive.firing_map')
        self.hit_module.build_hit_map = unittest.mock.Mock(side_effect=hit)
        self.firing_module.extract_firing_map = unittest.mock.Mock(side_effect=firing)
        self.modules = patch.dict(sys.modules, {'aive.hit_map': self.hit_module,
                                                'aive.firing_map': self.firing_module})
        self.modules.start()
        self.addCleanup(self.modules.stop)

    def hits(self, start=0., duration=2.):
        return cache.cached_hit_map(self.source, start, duration, self.cache_dir)

    def shots(self, seconds=4., windows=16):
        return cache.cached_firing_map(self.source, seconds, windows, self.cache_dir)

    def entry(self, stage='hit-map'):
        return next(self.cache_dir.glob(stage + '-*.json'))

    def corrupt(self, mutator, stage='hit-map'):
        path = self.entry(stage)
        data = json.loads(path.read_text())
        mutator(data)
        path.write_text(json.dumps(data))

    def test_repeat_no_builder_calls_and_unverified_metadata_preserved(self):
        for call, builder in ((self.hits, self.hit_module.build_hit_map),
                              (self.shots, self.firing_module.extract_firing_map)):
            first, reused = call()
            self.assertFalse(reused)
            second, reused = call()
            self.assertTrue(reused)
            self.assertEqual(first, second)
            self.assertEqual(second['metadata']['status'], 'UNVERIFIED')
            self.assertEqual(builder.call_count, 1)
        self.assertEqual(self.source.read_bytes(), b'not real media')
        self.assertFalse(list(self.cache_dir.glob('*.tmp')))

    def test_parameters_and_explicit_analysis_version_invalidate(self):
        self.hits(); self.hits(start=1.); self.hits(duration=3.)
        self.assertEqual(self.hit_module.build_hit_map.call_count, 3)
        self.shots(); self.shots(seconds=3.); self.shots(windows=8)
        self.assertEqual(self.firing_module.extract_firing_map.call_count, 3)
        with patch.object(cache, 'HIT_ANALYSIS_VERSION', 'hit-map-analysis/v2'):
            self.assertFalse(self.hits()[1])
        with patch.object(cache, 'FIRING_ANALYSIS_VERSION', 'firing-map-analysis/v2'):
            self.assertFalse(self.shots()[1])

    def test_all_bytes_hash_even_with_same_size_and_mtime(self):
        self.hits(); self.shots()
        st = self.source.stat()
        self.source.write_bytes(b'NOT REAL MEDIA')
        os.utime(self.source, ns=(st.st_atime_ns, st.st_mtime_ns))
        self.assertFalse(self.hits()[1]); self.assertFalse(self.shots()[1])
        self.assertEqual(self.hit_module.build_hit_map.call_count, 2)
        self.assertEqual(self.firing_module.extract_firing_map.call_count, 2)

    def test_corrupt_json_duplicate_keys_nonfinite_and_oversize_recompute(self):
        self.hits()
        for raw in (b'{broken', b'{"schema_version":1,"schema_version":2}',
                    b'{"data":NaN}', b' ' * (cache.MAX_CACHE_BYTES + 1)):
            self.entry().write_bytes(raw)
            self.assertFalse(self.hits()[1])
            self.assertTrue(self.hits()[1])
        self.assertEqual(self.hit_module.build_hit_map.call_count, 5)

    def test_hit_schema_clocks_and_promotion_rejected(self):
        self.hits()
        mutations = [lambda e: e.update(analysis_version='wrong'),
                     lambda e: e.update(source_sha256='b' * 64),
                     lambda e: e['settings'].update(start=True),
                     lambda e: e['data'].update(schema_version='reviewed-hit-map/v1'),
                     lambda e: e['data'].update(song_sha256='b' * 64),
                     lambda e: e['data']['excerpt'].update(start=1.),
                     lambda e: e['data']['decode'].update(pcm_start=1.),
                     lambda e: e['data']['candidates'][0].update(time=3.),
                     lambda e: e['data']['candidates'][0].update(confirmed=True),
                     lambda e: e['data']['candidates'][0].update(refined_time=.5)]
        for mutate in mutations:
            with self.subTest(mutation=mutate):
                self.corrupt(mutate)
                data, reused = self.hits()
                self.assertFalse(reused)
                self.assertFalse(data['candidates'][0]['confirmed'])

    def test_firing_schema_identity_clocks_and_promotion_rejected(self):
        self.shots()
        mutations = [lambda e: e['data'].update(mode='reviewed'),
                     lambda e: e['data'].update(confirmed=True),
                     lambda e: e['data']['sources'][0]['file_identity'].update(path='wrong'),
                     lambda e: e['data']['sources'][0].update(analyzed_start=1.),
                     lambda e: e['data']['sources'][0]['audio_identity'].update(sample_count=1),
                     lambda e: e['data']['analysis'].update(max_windows=8),
                     lambda e: e['data']['candidate_events'][0].update(confirmed=True),
                     lambda e: e['data']['candidate_events'][0].update(time=5.),
                     lambda e: e['data']['candidate_windows'][0].update(outcome='kill'),
                     lambda e: e['data']['candidate_windows'][0]['candidate_events'][0].update(id='unknown')]
        for mutate in mutations:
            with self.subTest(mutation=mutate):
                self.corrupt(mutate, 'firing-map')
                data, reused = self.shots()
                self.assertFalse(reused)
                self.assertEqual(data['mode'], 'candidate')
                self.assertFalse(data['candidate_events'][0]['confirmed'])

    def test_source_changed_during_builder_fails_without_publication(self):
        for call, builder in ((self.hits, self.hit_module.build_hit_map),
                              (self.shots, self.firing_module.extract_firing_map)):
            original = builder.side_effect
            def change(*args, **kwargs):
                data = original(*args, **kwargs)
                st = self.source.stat()
                self.source.write_bytes(self.source.read_bytes()[::-1])
                os.utime(self.source, ns=(st.st_atime_ns, st.st_mtime_ns))
                return data
            builder.side_effect = change
            with self.assertRaisesRegex(RuntimeError, 'source changed'):
                call()
        self.assertFalse(self.cache_dir.exists())

    def test_source_changed_during_cache_read_fails_not_recompute(self):
        self.hits()
        original = cache._hit
        def change(*args):
            original(*args)
            self.source.write_bytes(b'different bytes')
        with patch.object(cache, '_hit', side_effect=change):
            with self.assertRaisesRegex(RuntimeError, 'source changed'):
                self.hits()
        self.assertEqual(self.hit_module.build_hit_map.call_count, 1)

    def test_invalid_builder_result_never_written(self):
        self.hit_module.build_hit_map.side_effect = lambda *a: {'schema_version': 'hit-map/v1'}
        with self.assertRaises(ValueError):
            self.hits()
        self.assertFalse(self.cache_dir.exists())

    def test_atomic_replace_failure_leaves_no_partial_cache(self):
        with patch.object(cache.os, 'replace', side_effect=OSError('write blocked')):
            with self.assertRaises(OSError):
                self.hits()
        self.assertEqual(list(self.cache_dir.iterdir()), [])
        self.assertEqual(self.source.read_bytes(), b'not real media')

    def test_invalid_parameters_fail_before_import_or_build(self):
        for start, duration in ((True, 2), (0, 0), (-1, 2), (599, 2), (0, 13), (float('nan'), 2)):
            with self.assertRaises(ValueError):
                self.hits(start, duration)
        for seconds, windows in ((0, 16), (601, 16), (True, 16), (4, True), (4, 0), (4, 17)):
            with self.assertRaises(ValueError):
                self.shots(seconds, windows)
        self.assertEqual(self.hit_module.build_hit_map.call_count, 0)
        self.assertEqual(self.firing_module.extract_firing_map.call_count, 0)


if __name__ == '__main__':
    unittest.main()
