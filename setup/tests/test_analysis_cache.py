"""Versioned cache reuse and source invalidation tests."""
from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from aive.beats import BeatInfo, detect_cached


class AnalysisCacheTests(unittest.TestCase):
    def test_beat_profile_is_reused_then_invalidated_on_source_change(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "song.wav"
            source.write_bytes(b"source-v1")
            cache_dir = root / "cache"
            result = BeatInfo(
                bpm=120.0, offset=0.1, duration=4.0,
                beats=[0.1, 0.6, 1.1], downbeats=[0.1], onsets=[0.2],
            )
            with patch("aive.beats.detect", return_value=result) as mocked:
                first = detect_cached(source, cache_dir=cache_dir)
                second = detect_cached(source, cache_dir=cache_dir)
                self.assertEqual(first.bpm, 120.0)
                self.assertEqual(second.beats, result.beats)
                mocked.assert_called_once()

                source.write_bytes(b"source-v2-changed")
                detect_cached(source, cache_dir=cache_dir)
                self.assertEqual(mocked.call_count, 2)


if __name__ == "__main__":
    unittest.main()
