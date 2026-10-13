"""Structural checks are not audible lyric alignment verification."""
import copy
import json
import math
import shutil
import subprocess
import tempfile
import unittest
import wave
from pathlib import Path
from unittest.mock import patch

from aive.lyric_track import (
    SCHEMA, LyricTrack, LyricValidationError, ass_fonts_directory, audio_sha256,
    build_lyric_ass, compile_excerpt, decoded_audio_duration,
    discover_licensed_fonts, load_lyric_track, optional_lyric_track, safe_ass_text,
)


class LyricTrackTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.music = Path(self.tmp.name) / "music.wav"
        with wave.open(str(self.music), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(8000)
            w.writeframes(b"\0\0" * 80000)
        self.doc = {"schema": SCHEMA, "audio_sha256": audio_sha256(self.music),
                    "provenance": {"alignment_verified": True,
                                   "method": "synthetic test fixture, not song alignment"},
                    "words": [{"text": "before", "start": 1.0, "end": 1.5},
                              {"text": "quiet", "start": 1.6, "end": 1.9},
                              {"text": "burn", "start": 2.0, "end": 2.4},
                              {"text": "after", "start": 2.5, "end": 3.0}]}

    def load(self, doc=None):
        with patch("aive.lyric_track.decoded_audio_duration", return_value=10.0):
            return load_lyric_track(self.doc if doc is None else doc, self.music)

    def test_schema_and_provenance_fail_closed(self):
        cases = []
        for key in ("schema", "audio_sha256", "provenance", "words"):
            d = copy.deepcopy(self.doc)
            del d[key]
            cases.append(d)
        for verified in (False, None, 1, "true"):
            d = copy.deepcopy(self.doc)
            d["provenance"]["alignment_verified"] = verified
            cases.append(d)
        for method in (None, "", "  ", 2):
            d = copy.deepcopy(self.doc)
            d["provenance"]["method"] = method
            cases.append(d)
        for d in cases:
            with self.subTest(d=d), self.assertRaises(LyricValidationError):
                self.load(d)

    def test_hash_requires_actual_audio(self):
        d = copy.deepcopy(self.doc)
        d["audio_sha256"] = "f" * 64
        with self.assertRaisesRegex(LyricValidationError, "does not match"):
            self.load(d)
        track = self.load()
        self.music.write_bytes(b"changed")
        with self.assertRaisesRegex(LyricValidationError, "changed"):
            compile_excerpt(track, music_start=0, clip_duration=2)

    def test_render_refuses_unloaded_track(self):
        track = LyricTrack(self.music, self.doc["audio_sha256"], 10, (), "assertion")
        with self.assertRaisesRegex(LyricValidationError, "validate provenance"):
            compile_excerpt(track, music_start=0, clip_duration=2)

    def test_finite_sorted_positive_within_decoded_duration(self):
        cases = [("start", -1), ("start", True), ("start", "1"),
                 ("start", float("nan")), ("end", float("inf")),
                 ("end", 1), ("end", 0), ("end", 11)]
        for field, value in cases:
            d = copy.deepcopy(self.doc)
            d["words"][0][field] = value
            with self.subTest(field=field, value=value), self.assertRaises(LyricValidationError):
                self.load(d)
        d = copy.deepcopy(self.doc)
        d["words"][1]["start"] = 1.49
        with self.assertRaisesRegex(LyricValidationError, "overlapping"):
            self.load(d)
        d["words"] = list(reversed(self.doc["words"]))
        with self.assertRaisesRegex(LyricValidationError, "unsorted"):
            self.load(d)
        d["words"] = [{"text": "long", "start": 0, "end": 16}]
        with self.assertRaises(LyricValidationError):
            self.load(d)

    def test_touching_words_and_zero_start_are_valid(self):
        d = copy.deepcopy(self.doc)
        d["words"] = [{"text": "a", "start": 0, "end": 1},
                      {"text": "b", "start": 1, "end": 2}]
        self.assertEqual(len(self.load(d).words), 2)

    def test_ass_injection_and_line_breaks_are_rejected(self):
        for text in (r"{\pos(1,2)}burn", r"burn\Nfire", "{", "}", "\\",
                     "one\ntwo", "one\rtwo", "one\ttwo", "\0", "\u2028", "\u2029", "\x85"):
            with self.subTest(text=text), self.assertRaises(LyricValidationError):
                safe_ass_text(text)
        self.assertEqual(safe_ass_text("  can't, café & <burn>  "), "can't, café & <burn>")
        for text in ("", " ", "x" * 121):
            with self.assertRaises(LyricValidationError):
                safe_ass_text(text)

    def test_partial_boundaries_skipped_and_absolute_song_clock(self):
        events = compile_excerpt(self.load(), music_start=1.4, clip_duration=1.3,
                                 output_start=5, impact_indices=(2,))
        phrase = next(e for e in events if e.role == "Phrase")
        impact = next(e for e in events if e.role == "Impact")
        self.assertEqual(phrase.text, "quiet burn")
        self.assertAlmostEqual(phrase.start, 5.2)
        self.assertAlmostEqual(phrase.end, 6.0)
        self.assertAlmostEqual(impact.start, 5.6)
        self.assertAlmostEqual(impact.end, 6.0)
        self.assertTrue(all(5 <= e.start < e.end <= 6.3 for e in events))
        self.assertEqual(compile_excerpt(self.load(), music_start=4, clip_duration=1), ())

    def test_no_automatic_big_words_and_collision_guard(self):
        track = self.load()
        opts = dict(music_start=1, clip_duration=2)
        self.assertTrue(all(e.role == "Phrase" for e in compile_excerpt(track, **opts)))
        for t in (0.81, 1.2, 1.59):
            events = compile_excerpt(track, impact_indices=(2,), visual_impacts=(t,), **opts)
            self.assertFalse(any(e.role == "Impact" for e in events))
            self.assertTrue(any(e.role == "Phrase" for e in events))
        events = compile_excerpt(track, impact_indices=(2,), visual_impacts=(1.2,),
                                 allow_impact_collision=True, **opts)
        self.assertTrue(any(e.role == "Impact" for e in events))
        events = compile_excerpt(track, impact_indices=(2,), visual_impacts=(.79,), **opts)
        self.assertTrue(any(e.role == "Impact" for e in events))

    def test_excerpt_bad_options(self):
        track = self.load()
        cases = [{"music_start": -1}, {"clip_duration": 0}, {"clip_duration": 20},
                 {"output_start": -1}, {"phrase_gap": float("nan")},
                 {"impact_indices": (-1,)}, {"impact_indices": (True,)},
                 {"visual_impacts": (float("inf"),)}, {"allow_impact_collision": "yes"}]
        for bad in cases:
            opts = dict(music_start=0, clip_duration=3)
            opts.update(bad)
            with self.subTest(opts=opts), self.assertRaises(LyricValidationError):
                compile_excerpt(track, **opts)

    def test_optional_disabled_reason_and_no_mutation(self):
        legacy = {"words": [{"word": "burn", "start": 0, "end": 0}]}
        original = copy.deepcopy(legacy)
        with patch("aive.lyric_track.decoded_audio_duration", return_value=10):
            result = optional_lyric_track(legacy, self.music)
        self.assertFalse(result.enabled)
        self.assertIsNone(result.track)
        self.assertIn("legacy lyrics remain disabled", result.reason)
        self.assertEqual(legacy, original)

    def test_json_path(self):
        p = Path(self.tmp.name) / "lyrics.json"
        p.write_text(json.dumps(self.doc), encoding="utf-8")
        with patch("aive.lyric_track.decoded_audio_duration", return_value=10):
            self.assertEqual(load_lyric_track(p, self.music).words[2].text, "burn")

    def test_real_decoded_duration(self):
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            self.skipTest("ffmpeg/ffprobe unavailable")
        self.assertEqual(decoded_audio_duration(self.music), 10)
        self.assertEqual(load_lyric_track(self.doc, self.music).decoded_duration, 10)

    def test_font_discovery_and_ass_centisecond_carry(self):
        fonts = discover_licensed_fonts()
        if not {"Oswald", "Bebas Neue"} <= {f.family for f in fonts}:
            self.skipTest("licensed local fonts unavailable")
        self.assertTrue(all(f.file.is_file() and f.license_file.is_file() for f in fonts))
        d = copy.deepcopy(self.doc)
        d["words"] = [{"text": "burn", "start": 1.001, "end": 1.999}]
        ass = build_lyric_ass(self.load(d), music_start=0, clip_duration=2,
                             output_start=58, impact_indices=(0,))
        self.assertIn("0:00:59.01,0:00:59.99", ass)
        self.assertNotIn("0:00:60.", ass)
        self.assertIn("Style: Phrase,Oswald", ass)
        self.assertIn("Style: Impact,Bebas Neue", ass)
        with self.assertRaisesRegex(LyricValidationError, "licensed local"):
            build_lyric_ass(self.load(), music_start=0, clip_duration=2, fonts_root=self.tmp.name)

    def test_real_ffmpeg_ass_renders_text(self):
        if not shutil.which("ffmpeg"):
            self.skipTest("ffmpeg unavailable")
        filters = subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True)
        if " ass " not in filters.stdout and " subtitles " not in filters.stdout:
            self.skipTest("libass unavailable")
        fonts = discover_licensed_fonts()
        if not {"Oswald", "Bebas Neue"} <= {f.family for f in fonts}:
            self.skipTest("licensed fonts unavailable")
        d = copy.deepcopy(self.doc)
        d["words"] = [{"text": "burn", "start": .1, "end": .9}]
        ass = build_lyric_ass(self.load(d), music_start=0, clip_duration=1,
                             width=320, height=180, impact_indices=(0,))
        root = Path(self.tmp.name)
        (root / "test.ass").write_text(ass, encoding="utf-8")
        with ass_fonts_directory() as staged:
            shutil.copytree(staged, root / "fonts")
            rendered = subprocess.run(["ffmpeg", "-nostdin", "-v", "verbose", "-f", "lavfi",
                                       "-i", "color=black:s=320x180:r=10:d=1",
                                       "-vf", "ass=test.ass:fontsdir=fonts", "-ss", "0.4",
                                       "-frames:v", "1", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"],
                                      cwd=root, capture_output=True, check=True)
        self.assertEqual(len(rendered.stdout), 320 * 180 * 3)
        self.assertGreater(sum(rendered.stdout), 10000)
        log = rendered.stderr.decode(errors="replace")
        self.assertIn("BebasNeue", log.replace(" ", ""))
        self.assertIn("Oswald", log)


if __name__ == "__main__":
    unittest.main()
