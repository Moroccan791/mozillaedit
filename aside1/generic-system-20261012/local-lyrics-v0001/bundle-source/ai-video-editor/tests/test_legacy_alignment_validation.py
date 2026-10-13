"""Model-free legacy regression tests; no proof of singing alignment."""
import contextlib
import hashlib
import importlib.util
import io
import json
import math
import tempfile
import unittest
import warnings
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

SCRIPT = Path(__file__).resolve().parents[1] / "transcribe_align.py"
spec = importlib.util.spec_from_file_location("legacy_alignment_under_test", SCRIPT)
legacy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(legacy)


def word(text="hello", start=0.0, end=0.25):
    return {"word": text, "start": start, "end": end}


def result(words):
    return SimpleNamespace(segments=[SimpleNamespace(words=[SimpleNamespace(**item) for item in words])])


class LegacyAlignmentValidationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="legacy-alignment-test-")
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.music = self.root / "song.mp3"
        self.music.write_bytes(b"synthetic identity, not audio")
        self.text = self.root / "lyrics.txt"
        self.text.write_text("hello world", encoding="utf-8")
        self.output = self.root / "candidate.json"
        self.existing = self.root / "words.json"
        self.existing.write_bytes(b"historical output\x00\n")
        self.old = self.existing.read_bytes()
        self.valid = [word(), word("world", .25, .5)]

    def model(self, words=None):
        return Mock(align=Mock(return_value=result(self.valid if words is None else words)))

    def candidate(self, model=None):
        return legacy.align_candidate(self.music, self.text, model=model or self.model())

    def test_import_has_no_provider_dependency(self):
        module = importlib.util.module_from_spec(spec)
        with patch("importlib.import_module", side_effect=AssertionError("provider import forbidden")):
            spec.loader.exec_module(module)
            self.assertEqual(module.validate_words(self.valid), self.valid)

    def test_zero_duration(self):
        with self.assertRaisesRegex(legacy.AlignmentError, "positive duration"):
            legacy.validate_words([word(start=1, end=1)])

    def test_reversed_duration(self):
        with self.assertRaisesRegex(legacy.AlignmentError, "positive duration"):
            legacy.validate_words([word(start=2, end=1)])

    def test_nonfinite_times(self):
        for value in (math.nan, math.inf, -math.inf):
            for name in ("start", "end"):
                with self.subTest(value=value, name=name), self.assertRaisesRegex(legacy.AlignmentError, "finite"):
                    legacy.validate_words([dict(word(), **{name: value})])

    def test_nonnumeric_bool_negative_times(self):
        for value in (None, "0.1", True, False, -.1):
            with self.subTest(value=value), self.assertRaises(legacy.AlignmentError):
                legacy.validate_words([word(start=value)])

    def test_order_and_overlap_not_repaired(self):
        for words in ([word(start=1, end=2), word("world", 0, .5)],
                      [word(), word("world", .2, .5)]):
            with self.subTest(words=words), self.assertRaisesRegex(legacy.AlignmentError, "order or overlapping"):
                legacy.validate_words(words)

    def test_valid_touching_intervals_and_precision_preserved(self):
        self.assertEqual(legacy.validate_words(self.valid), self.valid)
        tiny = [word(start=.00001, end=.00002)]
        self.assertEqual(legacy.validate_words(tiny), tiny)

    def test_empty_missing_word_or_segments_rejected(self):
        for words in ([], [word(" ")], [dict(start=0, end=1)]):
            with self.subTest(words=words), self.assertRaises(legacy.AlignmentError):
                legacy.validate_words(words)
        for value in (None, SimpleNamespace(segments=[]), SimpleNamespace(segments=[SimpleNamespace(words=None)])):
            with self.subTest(value=value), self.assertRaises(legacy.AlignmentError):
                legacy.candidate_words(value, "hello")

    def test_historical_102_of_179_zero_durations_rejected(self):
        words = [word(str(index), index, index + (0 if index < 102 else .5)) for index in range(179)]
        with self.assertRaises(legacy.AlignmentError):
            legacy.validate_words(words)

    def test_partial_lexical_output_rejected(self):
        for words in ([word()], [word("wrong"), word("world", .25, .5)]):
            with self.subTest(words=words), self.assertRaisesRegex(legacy.AlignmentError, "partial or mismatched"):
                self.candidate(self.model(words))

    def test_lexical_split_punctuation_not_false_partial_failure(self):
        self.assertEqual(len(legacy.candidate_words(result([word("can't!", 0, .2)]), "can ' t")), 1)

    def test_provider_warnings_fail_even_with_valid_times(self):
        for message in ("Failed to align the last 28/179 words after 01:18.420.",
                        "2/15 segments failed to align.", "unknown provider warning"):
            def warn(*args, **kwargs):
                warnings.warn(message, UserWarning)
                return result(self.valid)
            model = self.model()
            model.align.side_effect = warn
            with self.subTest(message=message), self.assertRaisesRegex(legacy.AlignmentError, "provider alignment warning"):
                self.candidate(model)
            model.transcribe.assert_not_called()
            self.assertFalse(self.output.exists())
            self.assertEqual(self.existing.read_bytes(), self.old)

    def test_provider_exception_never_transcribes(self):
        model = self.model()
        model.align.side_effect = RuntimeError("alignment broke")
        with self.assertRaisesRegex(legacy.AlignmentError, "no transcription fallback"):
            self.candidate(model)
        model.transcribe.assert_not_called()

    def test_invalid_does_not_write_or_touch_existing(self):
        document = self.candidate()
        for invalid in ([word(start=0, end=0)], [word(start=1, end=0)],
                        [word(start=0, end=math.inf)], list(reversed(self.valid)),
                        [word(), word("world", .1, .4)]):
            document["words"] = invalid
            for target in (self.output, self.existing):
                with self.subTest(invalid=invalid, target=target), self.assertRaises(legacy.AlignmentError):
                    legacy.write_candidate(document, target)
            self.assertFalse(self.output.exists())
            self.assertEqual(self.existing.read_bytes(), self.old)
            self.assertEqual(list(self.root.glob(".legacy-align-*")), [])

    def test_valid_candidate_unverified_hashed_not_accepted(self):
        doc = self.candidate()
        self.assertEqual(doc["audio_sha256"], hashlib.sha256(self.music.read_bytes()).hexdigest())
        self.assertEqual(doc["source"]["kind"], "selected_music")
        self.assertEqual(doc["status"], "UNVERIFIED")
        self.assertFalse(doc["provenance"]["alignment_verified"])
        self.assertFalse(doc["provenance"]["accepted_lyric_track"])
        saved = legacy.write_candidate(doc, self.output)
        self.assertEqual(json.loads(saved.read_text(encoding="utf-8")), doc)
        self.assertEqual(self.existing.read_bytes(), self.old)
        self.assertEqual(list(self.root.glob(".legacy-align-*")), [])

    def test_valid_output_cannot_overwrite(self):
        with self.assertRaisesRegex(legacy.AlignmentError, "overwrite"):
            legacy.write_candidate(self.candidate(), self.existing)
        self.assertEqual(self.existing.read_bytes(), self.old)

    def test_verified_or_accepted_cannot_be_saved(self):
        for key in ("alignment_verified", "accepted_lyric_track"):
            document = self.candidate()
            document["provenance"][key] = True
            with self.subTest(key=key), self.assertRaises(legacy.AlignmentError):
                legacy.write_candidate(document, self.output)
        self.assertFalse(self.output.exists())

    def test_changed_selected_music_rejected(self):
        model = self.model()
        def mutate(*args, **kwargs):
            self.music.write_bytes(b"changed")
            return result(self.valid)
        model.align.side_effect = mutate
        with self.assertRaisesRegex(legacy.AlignmentError, "changed"):
            self.candidate(model)

    def test_missing_checkpoint_never_imports(self):
        with patch.object(legacy.importlib, "import_module", side_effect=AssertionError("no import")):
            with self.assertRaisesRegex(legacy.AlignmentError, "LOCAL"):
                legacy.align_candidate(self.music, self.text)
            with self.assertRaises(FileNotFoundError):
                legacy._load_local_model(self.root / "base")

    def cli_args(self):
        return ["--music", str(self.music), "--text", str(self.text),
                "--model-checkpoint", str(self.root / "unused-model.pt")]

    def test_cli_invalid_no_success_output(self):
        model = self.model([word(start=0, end=0), word("world", .25, .5)])
        stdout, stderr = io.StringIO(), io.StringIO()
        with patch.object(legacy, "_load_local_model", return_value=model), contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            status = legacy.main(self.cli_args() + ["--out", str(self.output)])
        self.assertEqual(status, 1)
        self.assertIn("rejected", stderr.getvalue())
        self.assertNotIn("Saved", stdout.getvalue())
        self.assertFalse(self.output.exists())
        self.assertEqual(self.existing.read_bytes(), self.old)

    def test_cli_existing_output_rejected_before_model(self):
        with patch.object(legacy, "_load_local_model") as load, contextlib.redirect_stderr(io.StringIO()):
            status = legacy.main(self.cli_args() + ["--out", str(self.existing)])
        self.assertEqual(status, 1)
        load.assert_not_called()
        self.assertEqual(self.existing.read_bytes(), self.old)

    def test_cli_default_unique_output_not_historical(self):
        with patch.object(legacy, "_load_local_model", return_value=self.model()), contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(legacy.main(self.cli_args()), 0)
            self.assertEqual(legacy.main(self.cli_args()), 0)
        self.assertEqual(len(list(self.root.glob("legacy-alignment-candidates.*.json"))), 2)
        self.assertEqual(self.existing.read_bytes(), self.old)

    def test_publish_race_preserves_competing_output(self):
        def competitor(source, target):
            Path(target).write_bytes(b"competing output")
            raise FileExistsError("output created concurrently")
        with patch.object(legacy.os, "link", side_effect=competitor), self.assertRaises(legacy.AlignmentError):
            legacy.write_candidate(self.candidate(), self.output)
        self.assertEqual(self.output.read_bytes(), b"competing output")
        self.assertEqual(list(self.root.glob(".legacy-align-*")), [])


if __name__ == "__main__":
    unittest.main()
