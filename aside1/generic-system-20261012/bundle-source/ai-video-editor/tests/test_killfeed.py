"""Unit tests for the lightweight Valorant HUD candidate scanner."""
from __future__ import annotations

import unittest

from aive.killfeed import _best_per_transient, _merge_windows, detect_changes


class KillFeedTests(unittest.TestCase):
    def test_overlapping_scan_windows_merge(self):
        self.assertEqual(
            _merge_windows([(2.0, 3.0), (1.0, 2.1), (5.0, 6.0)]),
            [(1.0, 3.0), (5.0, 6.0)],
        )

    def test_empty_candidates_do_not_scan_media(self):
        self.assertEqual(detect_changes("missing.mp4", []), [])

    def test_repeated_hud_changes_collapse_to_nearest_transient_match(self):
        changes = [
            {"t": 1.1, "associated_transient_t": 2.0,
             "transient_delta_s": 0.9, "change_score": 0.8},
            {"t": 1.8, "associated_transient_t": 2.0,
             "transient_delta_s": 0.2, "change_score": 0.3},
            {"t": 3.0, "associated_transient_t": 4.0,
             "transient_delta_s": 1.0, "change_score": 0.6},
        ]
        kept = _best_per_transient(changes)
        self.assertEqual([item["t"] for item in kept], [1.8, 3.0])


if __name__ == "__main__":
    unittest.main()
