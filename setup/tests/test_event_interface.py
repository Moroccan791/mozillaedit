"""Regression tests for event records and the legacy rough-cut boundary."""
from __future__ import annotations

import unittest

from aive.events import CandidateWindow, EventCandidate, candidate_windows
from aive.roughcut import BeatGrid, estimate_bpm_from_shots, pack_to_grid


class EventInterfaceTests(unittest.TestCase):
    def test_audio_transient_serializes_as_unconfirmed_candidate(self):
        event = EventCandidate(
            source="match.mp4", t=12.34567, strength=9.2, peak_db=-8.0,
        )
        data = event.to_dict()
        self.assertEqual(data["event_type"], "audio_transient")
        self.assertFalse(data["confirmed"])
        self.assertEqual(data["t"], 12.3457)
        self.assertEqual(data["confirmation"], "not_checked")

    def test_confirmation_requires_a_recorded_method(self):
        with self.assertRaisesRegex(ValueError, "confirmation method"):
            EventCandidate("match.mp4", 1.0, 3.0, confirmed=True)

    def test_candidate_windows_preserve_event_time_and_bounds(self):
        events = [
            EventCandidate("match.mp4", 0.3, 4.0),
            EventCandidate("match.mp4", 2.8, 5.0),
        ]
        windows = candidate_windows(
            events, source_duration=3.0, pre=0.8, post=1.5,
            minimum_context=0.25,
        )
        self.assertEqual(len(windows), 1)
        window = windows[0]
        self.assertEqual(window.start, 0.0)
        self.assertEqual(window.end, 1.8)
        self.assertEqual(window.event_t, 0.3)
        self.assertFalse(window.confirmed)

    def test_legacy_roughcut_accepts_typed_candidate_windows(self):
        events = [
            EventCandidate("match.mp4", 1.0, 5.0),
            EventCandidate("match.mp4", 1.5, 4.0),
            EventCandidate("match.mp4", 2.0, 3.0),
        ]
        self.assertEqual(estimate_bpm_from_shots(events), 120.0)
        windows = [
            CandidateWindow("match.mp4", 0.0, 2.0, 1.0, 5.0),
            CandidateWindow("match.mp4", 0.5, 2.5, 1.5, 4.0),
        ]
        segments = pack_to_grid(windows, BeatGrid(bpm=120), 2.0)
        self.assertEqual(len(segments), 1)
        self.assertEqual(segments[0].label, "unconfirmed-transient")


if __name__ == "__main__":
    unittest.main()
