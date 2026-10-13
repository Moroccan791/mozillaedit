"""Full-track onset and continuous beat-grid regression tests."""
from __future__ import annotations

import unittest
from unittest.mock import patch

import numpy as np

from aive.beats import BeatInfo, HOP, SR, detect, onset_envelope, transient_frames


class BeatTimelineTests(unittest.TestCase):
    def test_librosa_onset_envelope_covers_late_track_frames(self):
        duration = 10.0
        x = np.zeros(int(SR * duration), dtype=np.float32)
        tone = np.sin(2 * np.pi * 1100 * np.arange(int(0.04 * SR)) / SR)
        for t in (1.0, 4.0, 9.2):
            start = int(t * SR)
            x[start:start + tone.size] += 0.8 * tone
        env, times = onset_envelope(x, sr=SR, hop=HOP)
        self.assertGreaterEqual(float(times[-1]), duration - 2 * HOP / SR)
        self.assertEqual(env.size, times.size)
        late = np.flatnonzero(times >= 9.0)
        self.assertGreater(late.size, 0)
        self.assertGreater(float(env[late].max()), 0.05)

    def test_local_threshold_keeps_quieter_late_transient(self):
        x = np.zeros(int(SR * 10), dtype=np.float32)
        tone = np.sin(2 * np.pi * 1500 * np.arange(int(0.04 * SR)) / SR)
        for t, gain in ((1.0, 1.0), (4.0, 0.8), (9.2, 0.03)):
            start = int(t * SR)
            x[start:start + tone.size] += gain * tone
        env, times = onset_envelope(x)
        found = times[transient_frames(env)]
        for expected in (1.0, 4.0, 9.2):
            self.assertTrue(np.any(np.abs(found - expected) < .05), found)

    def test_excerpt_markers_keep_track_origin_and_reach_both_edges(self):
        info = BeatInfo(bpm=120, offset=.25, duration=30,
                        beats=[.25 + .5*i for i in range(60)])
        markers = info.excerpt_markers(19.923, 10)
        self.assertEqual(markers[0], 0)
        self.assertEqual(markers[-1], 10)
        self.assertAlmostEqual(markers[1] + 19.923, 20)
        self.assertLessEqual(max(np.diff(markers)), .25 + 1e-6)
        self.assertTrue(any(9 < t < 10 for t in markers))

    def test_beat_tracker_cannot_invent_downbeat_phase(self):
        with patch('aive.beats.decode_audio', return_value=np.zeros(SR, dtype=np.float32)), \
             patch('aive.beats.onset_envelope', return_value=(np.ones(200), np.arange(200)*HOP/SR)), \
             patch('librosa.beat.beat_track', return_value=(np.array([120.]), np.array([5, 40, 75, 110, 145]))), \
             patch('aive.beats.transient_frames', return_value=np.array([], dtype=int)):
            profile = detect('unused.wav')
        self.assertGreaterEqual(len(profile.beats), 4)
        self.assertEqual(profile.downbeats, [])

    def test_silence_has_no_transients(self):
        self.assertEqual(transient_frames(np.zeros(2000)).size, 0)

    def test_half_beat_markers_are_continuous_for_full_duration(self):
        info = BeatInfo(bpm=120.0, offset=0.25, duration=10.0,
                        beats=[0.25 + 0.5 * i for i in range(20)])
        markers = info.grid(step=0.5)
        self.assertEqual(len(markers), 40)
        self.assertAlmostEqual(markers[0], 0.25)
        self.assertAlmostEqual(markers[-1], 10.0)
        deltas = np.diff(markers)
        self.assertTrue(np.allclose(deltas, 0.25))


if __name__ == "__main__":
    unittest.main()
