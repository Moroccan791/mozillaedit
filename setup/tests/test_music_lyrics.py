"""Focused local-only tests. Synthetic audio is not proof of singing alignment."""
import hashlib
import json
import multiprocessing
import shutil
import struct
import subprocess
import sys
import tempfile
import time
import unittest
import wave
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from aive.music_lyrics import (
    AUDIO_EXTENSIONS, Limits, MAX_SOURCE_BYTES, MAX_WORDS, MusicLyricsError,
    MusicLyricsUnavailable, SAMPLE_RATE, SCHEMA, _bounded_command, _decode_music,
    _provider_worker, _validated_words, extract_music_lyric_candidates,
)


class LocalMockProvider:
    """Picklable trusted local fixture, checking the exact PCM handed to it."""
    def __init__(self, mode="good"):
        self.mode = mode

    def transcribe(self, audio, **options):
        if self.mode == "hang":
            time.sleep(30)
        with wave.open(audio, "rb") as stream:
            assert stream.getnchannels() == 1
            assert stream.getsampwidth() == 2
            assert stream.getframerate() == SAMPLE_RATE
            assert stream.readframes(1) == struct.pack("<h", 1234)
        assert Path(audio).name == "selected-music.wav"
        assert options["word_timestamps"] is True
        assert options["vad_filter"] is False
        assert options["condition_on_previous_text"] is False
        words = [SimpleNamespace(word=" hello", start=.05, end=.15),
                 SimpleNamespace(word="music", start=.2, end=.4)]
        if self.mode == "overlap":
            words[1].start = .1
        if self.mode == "empty":
            return iter(()), SimpleNamespace()
        if self.mode == "no_words":
            return iter([SimpleNamespace(text="not word timestamps", words=None)]), None
        return iter([SimpleNamespace(words=words)]), SimpleNamespace()


class MusicLyricsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="aive-music-test-")
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.music = self.root / "song.wav"
        self.pcm = struct.pack("<h", 1234) * SAMPLE_RATE
        with wave.open(str(self.music), "wb") as stream:
            stream.setnchannels(1)
            stream.setsampwidth(2)
            stream.setframerate(SAMPLE_RATE)
            stream.writeframes(self.pcm)

    def extract(self, **kwargs):
        options = {"source_kind": "music", "provider": LocalMockProvider()}
        options.update(kwargs)
        return extract_music_lyric_candidates(self.music, **options)

    def require_ffmpeg(self):
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            self.skipTest("local FFmpeg/ffprobe unavailable; no installation attempted")

    def test_explicit_music_only_rejected_before_decode(self):
        for kind in (None, "gameplay", "video", "raw", True):
            with self.subTest(kind=kind), self.assertRaises(MusicLyricsError):
                self.extract(source_kind=kind)
        for source in (b"PCM", {"words": []}, "clip.mp4", "clip.mkv", "song.pcm",
                       "https://example.com/song.mp3", self.root / "gameplay.wav",
                       self.root / "raw_music.wav"):
            with self.subTest(source=source), self.assertRaises(MusicLyricsError):
                extract_music_lyric_candidates(source, source_kind="music", provider=LocalMockProvider())
        with self.assertRaises(TypeError):
            extract_music_lyric_candidates(self.music, provider=LocalMockProvider())
        self.assertTrue({".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg"} <= AUDIO_EXTENSIONS)

    def test_optional_local_model_required_no_import_or_download(self):
        with patch("aive.music_lyrics.importlib.import_module") as imported:
            for model in (None, "tiny", self.root / "missing"):
                with self.subTest(model=model), self.assertRaisesRegex(MusicLyricsUnavailable, "LOCAL model directory"):
                    self.extract(provider=None, model_directory=model)
            with self.assertRaisesRegex(MusicLyricsUnavailable, "tokenizer.json"):
                self.extract(provider=None, model_directory=self.root)
            imported.assert_not_called()
        with self.assertRaises(MusicLyricsUnavailable):
            self.extract(provider=object())

    def test_missing_dependency_is_clear_optional_unavailable(self):
        out = self.root / "result.json"
        with patch("aive.music_lyrics.importlib.import_module", side_effect=ImportError("missing")):
            _provider_worker(None, str(self.root), self.music, 1, out, None)
        doc = json.loads(out.read_text())
        self.assertTrue(doc["unavailable"])
        self.assertIn("optional faster-whisper unavailable", doc["error"])

    def test_existing_local_directory_and_local_files_only(self):
        out = self.root / "result.json"
        provider = LocalMockProvider()
        selected = self.root / "selected-music.wav"
        shutil.copyfile(self.music, selected)
        with patch("aive.music_lyrics.importlib.import_module") as imported:
            imported.return_value.WhisperModel.return_value = provider
            _provider_worker(None, str(self.root), selected, 1, out, "en")
            imported.assert_called_once_with("faster_whisper")
            self.assertTrue(imported.return_value.WhisperModel.call_args.kwargs["local_files_only"])
            self.assertEqual(imported.return_value.WhisperModel.call_args.args, (str(self.root),))
        self.assertEqual(len(json.loads(out.read_text())["words"]), 2)

    def test_hard_limits_and_settings(self):
        for kwargs in ({"decode_seconds": 601}, {"decode_seconds": 0}, {"decode_seconds": float("nan")},
                       {"source_bytes": MAX_SOURCE_BYTES + 1}, {"source_bytes": True},
                       {"decode_timeout": 121}, {"provider_timeout": 601}):
            with self.subTest(kwargs=kwargs), self.assertRaises(MusicLyricsError):
                Limits(**kwargs)
        with self.assertRaisesRegex(MusicLyricsError, "byte bound"):
            self.extract(limits=Limits(source_bytes=2))
        for kwargs in ({"line_gap": float("inf")}, {"line_gap": -1}, {"language": "english"}, {"limits": {}}):
            with self.subTest(kwargs=kwargs), self.assertRaises(MusicLyricsError):
                self.extract(**kwargs)

    def test_invalid_intervals_are_rejected_without_clamp(self):
        original = {"word": "ok", "start": .1, "end": .2}
        for key, value in (("start", True), ("start", "0"), ("start", float("nan")),
                           ("start", -1), ("end", float("inf")), ("end", .1),
                           ("end", 11), ("word", ""), ("word", "x" * 121),
                           ("word", "bad\nword"), ("word", r"{\pos(1,2)}")):
            with self.subTest(key=key, value=value), self.assertRaises(MusicLyricsError):
                _validated_words([{**original, key: value}], 10)
        for raw in ([original, {**original, "start": .15, "end": .3}],
                    [{**original, "start": 1, "end": 2}, original],
                    [{"word": "long", "start": 0, "end": 16}]):
            with self.assertRaises(MusicLyricsError):
                _validated_words(raw, 20)
        with self.assertRaisesRegex(MusicLyricsError, "word count"):
            _validated_words(({"word": "x", "start": i / 20, "end": (i + 1) / 20}
                              for i in range(MAX_WORDS + 1)), 600)

    def test_invalid_duration_reports_exact_index_and_times_without_clamping(self):
        raw = [{"word":"ok","start":.1,"end":.2}, {"word":"bad","start":.5,"end":.5}]
        with self.assertRaisesRegex(MusicLyricsError, r'index 1.*start=0.5, end=0.5'):
            _validated_words(raw, 1.)
        self.assertEqual(raw[1], {"word":"bad","start":.5,"end":.5})

    def test_zero_touching_and_long_gaps_preserve_absolute_clock(self):
        words = _validated_words([{"word": "a", "start": 0, "end": .1},
                                  {"word": "b", "start": .1, "end": .2},
                                  {"word": "c", "start": 590, "end": 591}], 600)
        self.assertEqual(words[0]["start"], 0)
        self.assertEqual(words[1]["gap_before"], 0)
        self.assertAlmostEqual(words[2]["gap_before"], 589.8)

    def test_decode_commands_have_no_seek_and_reject_video_stream(self):
        out = self.root / "decoded.wav"
        with patch("aive.music_lyrics._bounded_command", side_effect=[b'{"streams":[{"codec_type":"audio"}]}', self.pcm]) as command:
            identity = _decode_music(self.music, out, Limits(), "ffmpeg", "ffprobe")
        decode_args, max_bytes, _ = command.call_args.args
        self.assertNotIn("-ss", decode_args)
        self.assertNotIn("-sseof", decode_args)
        self.assertEqual(max_bytes, 600 * SAMPLE_RATE * 2)
        self.assertEqual(identity["duration"], 1)
        self.assertEqual(identity["pcm_sha256"], hashlib.sha256(self.pcm).hexdigest())
        for streams in ([{"codec_type": "video"}, {"codec_type": "audio"}],
                        [{"codec_type": "audio"}, {"codec_type": "audio"}], []):
            with patch("aive.music_lyrics._bounded_command", return_value=json.dumps({"streams": streams}).encode()), self.assertRaises(MusicLyricsError):
                _decode_music(self.music, out, Limits(), "ffmpeg", "ffprobe")

    def test_command_timeout_and_byte_bound(self):
        start = time.monotonic()
        with self.assertRaisesRegex(MusicLyricsError, "time bound"):
            _bounded_command([sys.executable, "-I", "-c", "import time; time.sleep(10)"], 10, .1)
        self.assertLess(time.monotonic() - start, 3)
        with self.assertRaisesRegex(MusicLyricsError, "byte bound"):
            _bounded_command([sys.executable, "-I", "-c", "import sys; sys.stdout.write('x'*10000)"], 10, 5)
        with self.assertRaises(MusicLyricsUnavailable):
            _bounded_command([str(self.root / "no-ffmpeg")], 10, 1)

    def test_real_decode_mock_provider_unverified_identity_read_only(self):
        self.require_ffmpeg()
        before = self.music.read_bytes()
        result = self.extract(line_gap=.02)
        self.assertEqual(result["schema"], SCHEMA)
        self.assertEqual(result["status"], "UNVERIFIED")
        self.assertIs(result["provenance"]["alignment_verified"], False)
        self.assertEqual(result["audio_sha256"], hashlib.sha256(before).hexdigest())
        self.assertEqual(result["decode"]["pcm_sha256"], hashlib.sha256(self.pcm).hexdigest())
        self.assertEqual(result["decode"]["sample_count"], SAMPLE_RATE)
        self.assertEqual(result["decode"]["start"], 0)
        self.assertEqual(result["words"][0]["start"], .05)
        self.assertEqual(result["words"][1]["end"], .4)
        self.assertEqual(len(result["line_candidates"]), 2)
        self.assertEqual(self.music.read_bytes(), before)
        self.assertNotIn("track", result)
        from aive.lyric_track import LyricValidationError, load_lyric_track
        with patch("aive.lyric_track.decoded_audio_duration", return_value=1), self.assertRaisesRegex(LyricValidationError, "schema"):
            load_lyric_track(result, self.music)
        json.dumps(result, allow_nan=False)

    def test_real_prefix_bound_and_no_false_full_duration(self):
        self.require_ffmpeg()
        result = self.extract(limits=Limits(decode_seconds=.5))
        self.assertEqual(result["decode"]["duration"], .5)
        self.assertEqual(result["decode"]["sample_count"], 8000)
        self.assertTrue(result["decode"]["possibly_truncated"])
        self.assertEqual(result["decode"]["pcm_sha256"], hashlib.sha256(self.pcm[:16000]).hexdigest())
        self.assertNotIn("decoded_duration", result)

    def test_real_hard_600_second_decode_cap(self):
        self.require_ffmpeg()
        with wave.open(str(self.music), "wb") as stream:
            stream.setnchannels(1)
            stream.setsampwidth(2)
            stream.setframerate(SAMPLE_RATE)
            for _ in range(601):
                stream.writeframes(self.pcm)
        result = self.extract()
        self.assertEqual(result["decode"]["duration"], 600)
        self.assertEqual(result["decode"]["sample_count"], 600 * SAMPLE_RATE)
        self.assertTrue(result["decode"]["possibly_truncated"])
        with wave.open(str(self.music), "rb") as stream:
            self.assertEqual(stream.getnframes(), 601 * SAMPLE_RATE)

    def test_real_empty_and_invalid_provider(self):
        self.require_ffmpeg()
        self.assertEqual(self.extract(provider=LocalMockProvider("empty"))["words"], [])
        for mode in ("overlap", "no_words"):
            with self.subTest(mode=mode), self.assertRaises(MusicLyricsError):
                self.extract(provider=LocalMockProvider(mode))

    def test_real_provider_time_bound_terminates_worker(self):
        self.require_ffmpeg()
        before = {p.pid for p in multiprocessing.active_children()}
        start = time.monotonic()
        with self.assertRaisesRegex(MusicLyricsError, "provider time bound"):
            self.extract(provider=LocalMockProvider("hang"), limits=Limits(provider_timeout=.2))
        self.assertLess(time.monotonic() - start, 5)
        self.assertEqual({p.pid for p in multiprocessing.active_children()}, before)

    def test_changed_source_discards_candidates(self):
        with patch("aive.music_lyrics._decode_music", return_value={"duration": 1}), \
             patch("aive.music_lyrics._run_provider", side_effect=lambda *args: self.music.write_bytes(b"changed") or []):
            with self.assertRaisesRegex(MusicLyricsError, "changed"):
                self.extract()

    def test_real_video_disguised_as_music_rejected(self):
        self.require_ffmpeg()
        disguised = self.root / "not-music.mp3"
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-f", "lavfi", "-i",
                        "color=black:s=16x16:d=0.2", "-f", "lavfi", "-i", "anullsrc=r=16000:cl=mono",
                        "-t", "0.2", "-c:v", "mpeg4", "-c:a", "pcm_s16le", "-f", "matroska", str(disguised)],
                       check=True, capture_output=True, timeout=10)
        with self.assertRaisesRegex(MusicLyricsError, "video/gameplay"):
            extract_music_lyric_candidates(disguised, source_kind="music", provider=LocalMockProvider())


if __name__ == "__main__":
    unittest.main()
