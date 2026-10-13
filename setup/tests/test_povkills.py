"""Synthetic temporal, profile, ROI, association and stale-cache regression tests."""
import copy
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch

import numpy as np

from aive import povkills as pk
from aive.events import EventCandidate


class TemporalTests(unittest.TestCase):
    def detect(self, scores, **kwargs):
        return pk.detect_temporal(np.arange(len(scores)) / 15, scores, **kwargs)

    def test_persistent_emblem_once(self):
        result = self.detect([.1, .1, .8, .9] + [.95] * 30)
        self.assertEqual(len(result), 1)
        self.assertAlmostEqual(result[0]['t'], 2 / 15)
        self.assertEqual(result[0]['persistence'], 2)

    def test_already_visible_at_start_not_a_rising_edge(self):
        self.assertEqual(self.detect([.9] * 20), [])

    def test_spikes_and_outside_window(self):
        self.assertEqual(self.detect([.1, .1, .9, .5, .5, .5, .9, .1, .1]), [])
        self.assertEqual(len(self.detect([.1, .1, .9, .5, .5, .9])), 1)

    def test_multikill_rearms_only_after_two_strict_low_frames(self):
        self.assertEqual(len(self.detect([.1, .1, .9, .9, .8, .1, .5, .9, .9])), 1)
        scores = [.1, .1, .9, .9, .8, .1, .1, .9, .9]
        self.assertEqual(len(self.detect(scores)), 2)
        self.assertEqual(len(self.detect([.1, .1, .9, .9, .45, .45, .9, .9])), 1)

    def test_refractory(self):
        scores = [.1, .1, .9, .9, .1, .1, .9, .9]
        self.assertEqual(len(self.detect(scores, refractory_seconds=.4)), 1)
        self.assertEqual(len(self.detect(scores, refractory_seconds=.25)), 2)

    def test_invalid_frames_cannot_rearm_or_persist(self):
        scores = [.1, .1, .9, .9, .1, .1, .9, .9]
        valid = [True] * 4 + [False, False] + [True, True]
        self.assertEqual(len(self.detect(scores, valid=valid)), 1)
        self.assertEqual(self.detect([.1, .1, .9, .9], valid=[1, 1, 1, 0]), [])

    def test_validation(self):
        with self.assertRaises(ValueError):
            pk.detect_temporal([0, 0], [.2, .9])
        with self.assertRaises(ValueError):
            self.detect([.1, np.nan])
        with self.assertRaises(ValueError):
            self.detect([.1, .1], persistence=1)


class ProfileTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / 'video.mp4'
        self.source.write_bytes(b'synthetic source')
        icon = np.zeros((84, 96), np.uint8)
        icon[20:50, 30:60] = 220
        icon[26:44, 36:54] = 0
        self.icon = icon
        np.save(self.root / 'icon.npy', icon)
        self.raw = {'version': pk.PROFILE_VERSION, 'name': 'test',
                    'calibrated_profile': False, 'calibrated_sources': [],
                    'roi': [.4, .7, .2, .2], 'output_size': [96, 84], 'sample_hz': 15,
                    'templates': [{'name': 'kill', 'path': 'icon.npy', 'threshold': .8}]}
        self.profile_path = self.root / 'profile.json'
        self.profile_path.write_text(json.dumps(self.raw))
        self.profile = pk.load_profile(self.profile_path)

    def test_schema_assets_and_no_mutation(self):
        self.assertTrue(Path(self.profile['templates'][0]['path']).is_absolute())
        self.assertEqual(self.raw['templates'][0]['path'], 'icon.npy')
        for field, value in [('version', 'unknown'), ('roi', [.9, .9, .2, .2]),
                             ('calibrated_profile', True), ('sample_hz', 0)]:
            cfg = copy.deepcopy(self.profile)
            cfg[field] = value
            with self.assertRaises(ValueError):
                pk.load_profile(cfg)
        cfg = copy.deepcopy(self.profile)
        cfg['templates'][0]['path'] = 'missing.npy'
        with self.assertRaises(ValueError):
            pk.load_profile(cfg)
        np.save(self.root / 'flat.npy', np.zeros((84, 96)))
        cfg['templates'][0]['path'] = str(self.root / 'flat.npy')
        with self.assertRaises(ValueError):
            pk.load_profile(cfg)

    def test_spatial_only_gradient_and_mask(self):
        mask = pk.ellipse_mask(self.profile)
        single = pk.gradient_features(self.icon, mask)
        stack = pk.gradient_features(np.stack([self.icon, 255 - self.icon, self.icon]), mask)
        np.testing.assert_allclose(stack[0], single)
        np.testing.assert_allclose(stack[2], single)
        self.assertAlmostEqual(float(np.linalg.norm(single)), 1, places=6)
        self.assertEqual(float(single[0, 0]), 0)

    def test_missing_audio_uncalibrated_and_association_bounds(self):
        event = {'t': 1., 'score': .92, 'persistence': 2}
        self.assertIsNone(pk.associate_events(self.source, [event], self.profile)[0]['source_audio_event'])
        self.assertFalse(pk.associate_events(self.source, [event], self.profile)[0]['confirmed'])
        audio = [EventCandidate(str(self.source), .8, 1), {'t': 1.02, 'source': str(self.source)}]
        item = pk.associate_events(self.source, [event], self.profile, audio)[0]
        self.assertEqual(item['source_audio_event'], 1.02)
        self.assertFalse(item['confirmed'])
        calibrated = copy.deepcopy(self.profile)
        calibrated['calibrated_profile'] = True
        calibrated['calibrated_sources'] = [{'source': 'calibration.mp4', 'reviewed': True}]
        item = pk.associate_events(self.source, [event], calibrated, audio)[0]
        self.assertTrue(item['confirmed'])
        self.assertAlmostEqual(item['evidence']['audio_delta'], .02)
        for candidate in [{'t': .77}, {'t': 1.05}, {'t': .99, 'source': 'other.mp4'}]:
            self.assertIsNone(pk.associate_events(self.source, [event], calibrated, [candidate])[0]['source_audio_event'])
        self.assertFalse(pk.associate_events(self.source, [event], calibrated)[0]['confirmed'])

    def test_chunks_preserve_timeline_temporal_state_and_guards(self):
        frames = np.zeros((15, 84, 96), np.uint8)
        frames[:] = np.indices((84, 96)).sum(axis=0) % 7
        frames[5:9] = self.icon
        frames[12:] = 255
        media = SimpleNamespace(duration=1., video=SimpleNamespace(width=960, height=840))
        def reader(path, start, count, width, height, cfg):
            offset = round(start * 15)
            return frames[offset:offset + count]
        with patch.object(pk, 'probe', return_value=media), patch.object(pk, '_read_roi', side_effect=reader) as read:
            result = pk.scan(self.source, self.profile, chunk_seconds=.4)
        self.assertEqual(len(result), 1)
        self.assertAlmostEqual(result[0]['source_visual_event'], 5 / 15)
        self.assertEqual(read.call_count, 3)
        self.assertIsNone(result[0]['source_audio_event'])

    def test_bright_flat_and_abrupt_roi_change_guard(self):
        cfg = copy.deepcopy(self.profile)
        cfg['guard'] = {'max_change': 10}
        background = np.indices((84, 96)).sum(axis=0) % 7
        frames = np.stack([background, background, np.full((84, 96), 255),
                           np.full((84, 96), 255), self.icon, self.icon]).astype(np.uint8)
        media = SimpleNamespace(duration=.4, video=SimpleNamespace(width=960, height=840))
        with patch.object(pk, 'probe', return_value=media), patch.object(pk, '_read_roi', return_value=frames):
            # White frames and abrupt change cannot produce two valid hits.
            self.assertEqual(pk.scan(self.source, cfg), [])

    def test_cache_content_audio_threshold_and_version_identity(self):
        cache = self.root / 'cache'
        records = [{'source_visual_event': 1., 'confirmed': False}]
        with patch.object(pk, 'scan', return_value=records) as scanner:
            pk.scan_cached(self.source, self.profile, cache_dir=cache)
            pk.scan_cached(self.source, self.profile, cache_dir=cache)
            self.assertEqual(scanner.call_count, 1)
            # Same bytes count and mtime: content hash still invalidates.
            stat = self.source.stat()
            self.source.write_bytes(b'Synthetic source')
            os.utime(self.source, ns=(stat.st_atime_ns, stat.st_mtime_ns))
            pk.scan_cached(self.source, self.profile, cache_dir=cache)
            self.assertEqual(scanner.call_count, 2)
            old = (self.root / 'icon.npy').stat()
            np.save(self.root / 'icon.npy', np.roll(self.icon, 1, axis=1))
            os.utime(self.root / 'icon.npy', ns=(old.st_atime_ns, old.st_mtime_ns))
            pk.scan_cached(self.source, self.profile, cache_dir=cache)
            self.assertEqual(scanner.call_count, 3)
            cfg = copy.deepcopy(self.profile)
            cfg['templates'][0]['threshold'] = .85
            pk.scan_cached(self.source, cfg, cache_dir=cache)
            self.assertEqual(scanner.call_count, 4)
            pk.scan_cached(self.source, cfg, [{'t': .8}], cache_dir=cache)
            self.assertEqual(scanner.call_count, 5)
            pk.scan_cached(self.source, cfg, [{'t': .8, 'strength': 2}], cache_dir=cache)
            self.assertEqual(scanner.call_count, 6)
            with patch.object(pk, 'CACHE_VERSION', 'changed-version'):
                pk.scan_cached(self.source, cfg, cache_dir=cache)
            self.assertEqual(scanner.call_count, 7)

    def test_corrupt_cache_rescans(self):
        cache = self.root / 'cache'
        with patch.object(pk, 'scan', return_value=[]) as scanner:
            pk.scan_cached(self.source, self.profile, cache_dir=cache)
            for target in cache.glob('*.json'):
                target.write_text('broken')
            pk.scan_cached(self.source, self.profile, cache_dir=cache)
            self.assertEqual(scanner.call_count, 2)

    @unittest.skipUnless(shutil.which('ffmpeg'), 'FFmpeg unavailable')
    def test_ffmpeg_bounded_grayscale_chunk_reader(self):
        video = self.root / 'real.mkv'
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                        '-f', 'lavfi', '-i', 'testsrc2=size=320x240:rate=30:duration=1',
                        '-c:v', 'ffv1', str(video)], check=True, capture_output=True)
        a = pk._read_roi(video, 0, 6, 320, 240, self.profile)
        b = pk._read_roi(video, .4, 6, 320, 240, self.profile)
        self.assertEqual(a.shape, (6, 84, 96))
        self.assertEqual(b.shape, (6, 84, 96))
        self.assertEqual(a.dtype, np.uint8)
        full = pk._read_roi(video, 0, 12, 320, 240, self.profile)
        np.testing.assert_array_equal(a, full[:6])
        np.testing.assert_array_equal(b, full[6:12])


if __name__ == '__main__':
    unittest.main()
