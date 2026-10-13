"""Planner regression tests for full-track beat timing and sparse montages."""
from __future__ import annotations

import unittest
from unittest.mock import patch

from aive.beats import BeatInfo
from aive.graph import timeline_duration
from aive.music import MusicProfile
from aive.planner import _slots, plan, plan_kills


class PlannerTimingTests(unittest.TestCase):
    def setUp(self):
        # Variable tracked intervals deliberately differ from the nominal BPM.
        self.grid = [10.0, 10.43, 10.94, 11.53, 12.17, 12.72,
                     13.21, 13.86, 14.57, 15.09, 15.68, 16.31,
                     16.97, 17.52, 18.13, 18.79, 19.37, 20.04]
        self.beats = BeatInfo(bpm=120.0, offset=10.0, duration=21.0,
                              beats=self.grid)
        self.profile = MusicProfile(bpm=120.0, offset=10.0, duration=21.0,
                                    drops=[13.21], energy=[0.9] * 42)

    def analyses(self, profile=None, beats=None):
        return (patch("aive.planner.music_mod.analyze_cached",
                      return_value=profile or self.profile),
                patch("aive.planner.beats_mod.detect_cached",
                      return_value=beats or self.beats))

    def boundaries(self, project):
        result = [project.music_start]
        for segment in project.segments:
            result.append(result[-1] + segment.out_duration)
        return result

    def test_slots_follow_actual_late_track_intervals_not_bpm(self):
        slots = _slots(self.grid, 0.5, {13.21}, 21.0, [1])
        self.assertEqual([s["start"] for s in slots], self.grid[:-1])
        self.assertEqual([s["end"] for s in slots], self.grid[1:])
        self.assertTrue(slots[6]["drop"])
        self.assertFalse(slots[5]["drop"])
        self.assertAlmostEqual(slots[-1]["end"], 20.04)

    def test_half_beats_interpolate_each_tracked_interval(self):
        slots = _slots([0.0, 0.4, 1.0, 1.8, 2.8], 0.5, {0.7},
                       3.0, [1, 0.5, 1, 0.5])
        expected = [0.4, 0.7, 1.4, 1.8, 2.8]
        for actual, target in zip([s["end"] for s in slots], expected):
            self.assertAlmostEqual(actual, target)
        self.assertEqual(len(slots), len(expected))
        self.assertTrue(slots[2]["drop"])

    def test_grid_ends_without_nominal_extrapolation_and_caps_duration(self):
        slots = _slots([0.0, 0.6, 1.3], 0.5, set(), 5.0, [1])
        self.assertEqual(slots[-1]["end"], 1.3)
        slots = _slots([0.0, 0.6, 1.3], 0.5, set(), 0.9, [1])
        self.assertEqual(slots[-1]["end"], 0.9)
        self.assertEqual(_slots([0.0], 0.5, set(), 2.0, [1]), [])

    def test_no_grid_fallback_covers_requested_duration(self):
        slots = _slots([], 0.0, set(), 2.4, [1])
        self.assertEqual([s["end"] for s in slots], [1.0, 2.0, 2.4])

    def test_normal_music_reel_origin_and_all_boundaries_match_track(self):
        music_patch, beat_patch = self.analyses()
        with music_patch, beat_patch, patch.object(
                self.profile, "best_window", return_value=10.2):
            project = plan("raw.mp4", "track.wav", duration=8.0,
                           windows=[{"start": 50.0, "end": 80.0}])
        self.assertEqual(project.music_start, 10.43)
        self.assertEqual(project.transition, {"type": "cut"})
        self.assertAlmostEqual(timeline_duration(project), project.total_duration, places=9)
        slots = _slots([t - 10.43 for t in self.grid if t >= 10.43],
                       0.5, {13.21 - 10.43}, 8.0, [1, 1, 2, 1, 1, 2])
        expected = [10.43] + [10.43 + s["end"] for s in slots]
        self.assertEqual(len(self.boundaries(project)), len(expected))
        for actual, target in zip(self.boundaries(project), expected):
            self.assertAlmostEqual(actual, target, places=9)
        self.assertAlmostEqual(project.total_duration, 8.0)
        # Effects remain intact; their ramp model preserves output length.
        self.assertTrue(any(s.ramp_in for s in project.segments))

    def test_gaming_half_beat_cuts_keep_full_timeline_precision(self):
        music_patch, beat_patch = self.analyses()
        with music_patch, beat_patch, patch.object(
                self.profile, "best_window", return_value=10.0):
            project = plan("raw.mp4", "track.wav", duration=9.0,
                           vibe="gaming", windows=[{"start": 50, "end": 70}])
        self.assertEqual(project.transition, {"type": "cut"})
        self.assertAlmostEqual(timeline_duration(project), project.total_duration, places=9)
        slots = _slots([t - 10 for t in self.grid], 0.5,
                       {3.21}, 9.0, [1, 0.5, 1, 1, 0.5, 0.5, 2])
        for actual, slot in zip(self.boundaries(project)[1:], slots):
            self.assertAlmostEqual(actual, 10 + slot["end"], places=9)

    def test_short_windows_do_not_compress_or_skip_beat_slots(self):
        music_patch, beat_patch = self.analyses()
        with music_patch, beat_patch, patch.object(
                self.profile, "best_window", return_value=10.0):
            project = plan("raw.mp4", "track.wav", duration=6.0,
                           windows=[{"start": 50, "end": 50.6}])
        # First two one-beat slots fit; next two-beat slot does not. Stop,
        # rather than emit the later populated slots with the gap removed.
        self.assertEqual(len(project.segments), 2)
        self.assertAlmostEqual(project.total_duration, 0.94)
        self.assertAlmostEqual(self.boundaries(project)[-1], 10.94)

    def test_missing_tempo_uses_safe_fallback_without_division_by_zero(self):
        profile = MusicProfile(duration=0.0)
        beats = BeatInfo(bpm=0.0, offset=0.0, duration=0.0)
        music_patch, beat_patch = self.analyses(profile=profile, beats=beats)
        with music_patch, beat_patch:
            project = plan("raw.mp4", "track.wav", duration=2.4,
                           windows=[{"start": 50, "end": 60}])
        self.assertAlmostEqual(project.total_duration, 2.4)
        self.assertEqual(project.transition, {"type": "cut"})
        self.assertAlmostEqual(timeline_duration(project), project.total_duration, places=9)

    def test_window_after_tracked_grid_does_not_invent_beat_slots(self):
        music_patch, beat_patch = self.analyses()
        with music_patch, beat_patch, patch.object(
                self.profile, "best_window", return_value=20.5):
            project = plan("raw.mp4", "track.wav", duration=2.0,
                           windows=[{"start": 50, "end": 60}])
        self.assertEqual(project.segments, [])

    def test_highlight_transition_behavior_is_not_rewritten(self):
        music_patch, beat_patch = self.analyses()
        with music_patch, beat_patch:
            project = plan("raw.mp4", "track.wav", vibe="sports",
                           windows=[{"start": 50, "end": 55}])
        self.assertEqual(project.transition, {"type": "fade", "duration": 0.35})

    def test_sparse_kills_start_at_drop_without_filler_or_repeated_moments(self):
        music_patch, beat_patch = self.analyses()
        with music_patch, beat_patch:
            project = plan_kills("raw.mp4", "track.wav", kills=[30, 40],
                                 duration=9.0, overlays=False)
        self.assertEqual(len(project.segments), 2)
        self.assertEqual([s.start for s in project.segments], [30, 40])
        self.assertEqual(project.music_start, 13.21)
        self.assertEqual(project.transition, {"type": "cut"})
        self.assertAlmostEqual(timeline_duration(project), project.total_duration, places=9)
        for actual, target in zip(self.boundaries(project), self.grid[6:9]):
            self.assertAlmostEqual(actual, target, places=9)
        self.assertEqual(project.segments[0].grade, "teal-orange")
        self.assertFalse(project.segments[0].flash)
        self.assertTrue(project.segments[1].flash)

    def test_sparse_kills_near_grid_end_use_contiguous_lead_and_drop_range(self):
        # There are only two post-drop slots; four moments must retain the
        # adjacent two lead slots, not the earlier lead slots with a hole.
        short_grid = self.grid[:9]
        beats = BeatInfo(bpm=120, offset=10, duration=14.57, beats=short_grid)
        music_patch, beat_patch = self.analyses(beats=beats)
        with music_patch, beat_patch:
            project = plan_kills("raw.mp4", "track.wav", kills=[30, 40, 50, 60],
                                 duration=9.0, overlays=False)
        self.assertEqual(len(project.segments), 4)
        expected = [short_grid[i] for i in (2, 4, 6, 7, 8)]
        for actual, target in zip(self.boundaries(project), expected):
            self.assertAlmostEqual(actual, target, places=9)
        # Strongest moments remain assigned to post-drop slots.
        self.assertEqual([s.start for s in project.segments[2:]], [30, 40])
        self.assertEqual(len({s.start for s in project.segments}), 4)
        # Lead-in slots land the source moment at the tracked inner beat,
        # not at the nominal period or the arithmetic midpoint of the slot.
        for segment, moment, index in zip(project.segments[:2], [50, 60], [2, 4]):
            offset = short_grid[index + 1] - short_grid[index]
            self.assertAlmostEqual(segment.start + offset, moment)
            self.assertAlmostEqual(segment.ramp_hold, offset)

    def test_requested_kill_count_is_a_cap_not_a_repetition_target(self):
        music_patch, beat_patch = self.analyses()
        with music_patch, beat_patch:
            project = plan_kills("raw.mp4", "track.wav", kills=[30, 30, 40],
                                 n=10, overlays=False)
        self.assertEqual(len(project.segments), 2)
        self.assertEqual(project.music_start, 13.21)


if __name__ == "__main__":
    unittest.main()
