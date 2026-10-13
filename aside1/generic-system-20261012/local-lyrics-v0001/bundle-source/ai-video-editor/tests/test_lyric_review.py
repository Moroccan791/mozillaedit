"""Synthetic tones/injected candidates only: no sung or authenticated approval."""
import copy
import hashlib
import json
import shutil
import struct
import tempfile
import unittest
import wave
from pathlib import Path
from unittest.mock import patch

from aive.music_lyrics import Limits, MusicLyricsError, SAMPLE_RATE, _decode_music
from aive.lyric_review import (MAX_DEPTH, MAX_WORDS, SCHEMA, audit_lyric_review,
                               prepare_lyric_review)


class LyricReviewTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="aive-lyric-review-test-")
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.music = self.root / "song.wav"
        self.pcm = struct.pack("<h", 1234) * SAMPLE_RATE
        with wave.open(str(self.music), "wb") as stream:
            stream.setnchannels(1)
            stream.setsampwidth(2)
            stream.setframerate(SAMPLE_RATE)
            stream.writeframes(self.pcm)
        self.limits = Limits(decode_seconds=.5)
        self.decode = {"method": "ffmpeg sample-zero mono pcm_s16le",
                       "clock": "selected_music_first_decoded_sample", "start": 0.0,
                       "sample_rate": 16000, "channels": 1, "sample_count": 8000,
                       "duration": .5, "pcm_sha256": hashlib.sha256(self.pcm[:16000]).hexdigest(),
                       "prefix_limit_seconds": .5, "possibly_truncated": True}
        self.candidates = {"schema": "music-lyric-candidates/v1", "status": "UNVERIFIED",
                           "audio_sha256": hashlib.sha256(self.music.read_bytes()).hexdigest(),
                           "source": {"path": str(self.music.resolve()), "kind": "selected_music",
                                      "bytes": self.music.stat().st_size},
                           "decode": copy.deepcopy(self.decode),
                           "words": [{"text": "hello", "start": .05, "end": .15, "gap_before": .05},
                                     {"text": "music", "start": .2, "end": .4, "gap_before": .2 - .15}],
                           "provenance": {"alignment_verified": False}}
        self.patch_decode = patch("aive.lyric_review._decode_music", return_value=copy.deepcopy(self.decode))
        self.decoder = self.patch_decode.start()
        self.addCleanup(self.patch_decode.stop)

    def prepare(self, candidates=None, **kwargs):
        return prepare_lyric_review(self.candidates if candidates is None else candidates,
                                    self.music, limits=self.limits, **kwargs)

    def audit(self, review, candidates=None, **kwargs):
        return audit_lyric_review(review, self.candidates if candidates is None else candidates,
                                  self.music, limits=self.limits, **kwargs)

    def ready(self):
        review = self.prepare()
        review["coverage"] = [[0, .5]]
        review["reviewer"] = "supplied test reviewer"
        review["method"] = "synthetic fixture, not listening acceptance"
        for entry in review["entries"]:
            entry["disposition"] = "corrected"
            entry["correction"] = entry["original"].copy()
        return review

    def test_pending_canonical_binding_no_mutation(self):
        original = copy.deepcopy(self.candidates)
        audio = self.music.read_bytes()
        review = self.prepare()
        self.assertEqual(self.candidates, original)
        self.assertEqual(self.music.read_bytes(), audio)
        self.assertEqual(review["schema"], SCHEMA)
        self.assertEqual(review["status"], "PENDING")
        self.assertIs(review["alignment_verified"], False)
        canonical = json.dumps(self.candidates, sort_keys=True, separators=(",", ":"),
                               ensure_ascii=True, allow_nan=False).encode("ascii")
        self.assertEqual(review["candidate_sha256"], hashlib.sha256(canonical).hexdigest())
        reordered = dict(reversed(list(self.candidates.items())))
        self.assertEqual(self.prepare(reordered)["candidate_sha256"], review["candidate_sha256"])
        self.assertEqual(review["coverage"], [])
        self.assertIsNone(review["reviewer"])
        self.assertIsNone(review["method"])
        self.assertTrue(review["decode"]["possibly_truncated"])
        self.assertEqual(review["decode"]["duration"], .5)
        self.assertEqual([e["candidate_index"] for e in review["entries"]], [0, 1])
        self.assertTrue(all(e["disposition"] == "pending" and e["correction"] is None for e in review["entries"]))
        review_before = copy.deepcopy(review)
        report = self.audit(review)
        self.assertEqual(review, review_before)
        self.assertEqual(report["status"], "PENDING")
        self.assertFalse(report["issues"])
        self.assertIn("reviewer missing", report["pending"])
        self.assertIn("explicit decoded-prefix coverage missing", report["pending"])
        self.assertNotIn("words", report)
        self.assertNotIn("track", report)
        json.dumps(report, allow_nan=False)

    def test_candidate_source_pcm_schema_mismatch(self):
        for field, value in (("schema", "lyric-track/v1"), ("status", "VERIFIED"),
                             ("audio_sha256", "0" * 64), ("source", {}), ("decode", {})):
            with self.subTest(field=field), self.assertRaises(MusicLyricsError):
                self.prepare({**self.candidates, field: value})
        for key, value in (("pcm_sha256", "1" * 64), ("start", 1.0),
                           ("possibly_truncated", 1), ("prefix_limit_seconds", 1)):
            candidate = copy.deepcopy(self.candidates)
            candidate["decode"][key] = value
            with self.subTest(key=key), self.assertRaises(MusicLyricsError):
                self.prepare(candidate)
        self.music.write_bytes(self.music.read_bytes() + b"changed")
        with self.assertRaisesRegex(MusicLyricsError, "source identity"):
            self.prepare()

    def test_changed_during_decode_rejected(self):
        self.decoder.side_effect = lambda *args: (self.music.write_bytes(b"changed"), self.decode)[1]
        with self.assertRaisesRegex(MusicLyricsError, "changed during"):
            self.prepare()

    def test_audit_identity_schema_and_original_mismatch(self):
        for field, value in (("schema", "lyric-track/v1"), ("status", "COMPLETE"),
                             ("alignment_verified", True), ("candidate_sha256", "0" * 64),
                             ("source", {}), ("decode", {}), ("coverage_clock", "output")):
            review = self.ready()
            review[field] = value
            with self.subTest(field=field):
                report = self.audit(review)
                self.assertEqual(report["status"], "PENDING")
                self.assertTrue(report["issues"])
                self.assertIs(report["alignment_verified"], False)
        review = self.ready()
        review["entries"][0]["original"]["text"] = "invented"
        self.assertTrue(self.audit(review)["issues"])
        review = self.ready()
        review["verified_words"] = []
        self.assertTrue(self.audit(review)["issues"])
        review = self.ready()
        changed = copy.deepcopy(self.candidates)
        changed["notes"] = "new candidate document"
        self.assertTrue(self.audit(review, changed)["issues"])

    def test_supplied_completion_never_verified_or_promoted(self):
        review = self.ready()
        review["entries"][1]["disposition"] = "rejected"
        review["entries"][1]["correction"] = None
        review["additions"] = [{"text": "missed", "start": .3, "end": .4}]
        original = copy.deepcopy(review)
        report = self.audit(review)
        self.assertEqual(report["status"], "structurally_ready_for_independent_track")
        self.assertEqual(report["counts"], {"pending": 0, "corrected": 1, "rejected": 1, "additions": 1})
        self.assertIs(report["alignment_verified"], False)
        self.assertIs(report["claims_authenticated"], False)
        self.assertEqual(review, original)
        self.assertEqual(review["status"], "PENDING")
        self.assertNotIn("lyric_track", report)
        review["entries"][0]["disposition"] = "pending"
        review["entries"][0]["correction"] = None
        self.assertEqual(self.audit(review)["status"], "PENDING")

    def test_coverage_metadata_missing_and_out_of_prefix(self):
        for field, value in (("reviewer", None), ("method", None), ("limitations", [])):
            review = self.ready()
            review[field] = value
            with self.subTest(field=field):
                self.assertEqual(self.audit(review)["status"], "PENDING")
        for coverage in ([[0, 1]], [[.1, .5]], [[0, .3], [.2, .5]], [[False, .5]], [], [[0, 0]]):
            review = self.ready()
            review["coverage"] = coverage
            with self.subTest(coverage=coverage):
                self.assertEqual(self.audit(review)["status"], "PENDING")
        review = self.ready()
        review["reviewer"] = "bad\nreviewer"
        self.assertTrue(self.audit(review)["issues"])
        review = self.ready()
        review["additions"] = [{"text": "tail", "start": .45, "end": .6}]
        self.assertTrue(self.audit(review)["issues"])

    def test_unsafe_overlap_wrong_dispositions_and_count(self):
        for correction in ({"text": "{\\pos(1,2)}", "start": .05, "end": .15},
                           {"text": "a\n", "start": .05, "end": .15},
                           {"text": "a", "start": float("nan"), "end": .15},
                           {"text": "a", "start": .3, "end": .45}):
            review = self.ready()
            review["entries"][0]["correction"] = correction
            with self.subTest(correction=correction):
                self.assertTrue(self.audit(review)["issues"])
        for disposition in ("accepted", "verified", None, {}):
            review = self.ready()
            review["entries"][0]["disposition"] = disposition
            self.assertTrue(self.audit(review)["issues"])
        review = self.ready()
        review["additions"] = [{"text": "overlap", "start": .1, "end": .12}]
        self.assertTrue(self.audit(review)["issues"])
        review = self.ready()
        review["entries"].pop()
        self.assertTrue(self.audit(review)["issues"])
        review = self.ready()
        review["additions"] = [{"text": "a", "start": 0, "end": .1}] * MAX_WORDS
        self.assertTrue(self.audit(review)["issues"])

    def test_json_resource_controls(self):
        for bad in (float("nan"), object(), 2 ** 100, {1: "not string"}, "x" * (4 * 1024 * 1024 + 1)):
            candidate = copy.deepcopy(self.candidates)
            candidate["extra"] = bad
            with self.subTest(kind=type(bad)), self.assertRaises(MusicLyricsError):
                self.prepare(candidate)
        deep = []
        for _ in range(MAX_DEPTH + 1):
            deep = [deep]
        candidate = copy.deepcopy(self.candidates)
        candidate["extra"] = deep
        with self.assertRaisesRegex(MusicLyricsError, "depth"):
            self.prepare(candidate)
        cycle = []
        cycle.append(cycle)
        candidate["extra"] = cycle
        with self.assertRaisesRegex(MusicLyricsError, "cycle"):
            self.prepare(candidate)
        review = self.ready()
        review["extra"] = cycle
        self.assertTrue(self.audit(review)["issues"])

    def test_invalid_limits_and_candidate_words_fail_closed(self):
        with self.assertRaisesRegex(MusicLyricsError, "Limits"):
            prepare_lyric_review(self.candidates, self.music, limits={})
        with self.assertRaisesRegex(MusicLyricsError, "source byte"):
            prepare_lyric_review(self.candidates, self.music, limits=Limits(source_bytes=2))
        for key, value in (("text", "bad\\nword"), ("start", False),
                           ("gap_before", True), ("gap_before", .4)):
            candidate = copy.deepcopy(self.candidates)
            candidate["words"][0][key] = value
            with self.subTest(key=key), self.assertRaises(MusicLyricsError):
                self.prepare(candidate)
        candidate = copy.deepcopy(self.candidates)
        candidate["words"] = candidate["words"] * (MAX_WORDS // 2 + 1)
        with self.assertRaises(MusicLyricsError):
            self.prepare(candidate)
        review = self.prepare()
        self.decoder.return_value["pcm_sha256"] = "9" * 64
        self.assertTrue(self.audit(review)["issues"])

    def test_real_local_decode_rebinds_prefix_pcm(self):
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            self.skipTest("local FFmpeg absent; no install/download attempted")
        self.patch_decode.stop()
        # Actual shared decoder, no ASR dependency/provider.
        self.candidates["decode"] = _decode_music(self.music, self.root / "decoded.wav",
                                                  self.limits, "ffmpeg", "ffprobe")
        review = self.prepare()
        self.assertEqual(review["decode"]["pcm_sha256"], hashlib.sha256(self.pcm[:16000]).hexdigest())
        self.assertTrue(review["decode"]["possibly_truncated"])
        self.assertFalse(self.audit(review)["issues"])
        review["decode"]["pcm_sha256"] = "0" * 64
        self.assertTrue(self.audit(review)["issues"])


if __name__ == "__main__":
    unittest.main()
