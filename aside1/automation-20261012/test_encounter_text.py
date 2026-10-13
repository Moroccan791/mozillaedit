"""Real decoded typography proof plus fail-closed pre-subprocess tests."""
import copy
from dataclasses import asdict
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import wave
from unittest.mock import patch

from aive.encounter_render import RenderConfig
from aive.encounter_text import apply_verified_lyrics, _graph_path
from aive.lyric_track import audio_sha256, discover_licensed_fonts, LyricValidationError


class EncounterTextValidationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="aive-text-")
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.music = self.root / "music.wav"
        with wave.open(str(self.music), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(8000)
            w.writeframes(b"\0\0" * 24000)
        self.original = self.root / "encounters.mp4"
        self.original.write_bytes(b"not decoded in rejection tests")
        self.track = self.root / "track.json"
        self.doc = {"schema": "lyric-track/v1", "audio_sha256": audio_sha256(self.music),
                    "provenance": {"alignment_verified": True, "method": "verified synthetic fixture, not a song"},
                    "words": [{"text": "VERIFIED TEXT", "start": 1.2, "end": 2.8}]}
        self.manifest = {"schema_version": "encounter-render/v1", "job_dir": str(self.root),
                         "output": str(self.original), "music_source": str(self.music),
                         "config": asdict(RenderConfig(width=320, height=180, fps=30, sample_rate=8000,
                                                       quality=0, preset="ultrafast")),
                         "frame_count": 60, "video_duration": 2.0, "plan_duration": 2.0,
                         "music_start_sample": 8000, "authored_design": {"unchanged": True}}
        self.track.write_text(json.dumps(self.doc), encoding="utf-8")

    def reject(self, doc=None, manifest=None, track=True):
        if doc is not None:
            self.track.write_text(json.dumps(doc), encoding="utf-8")
        with patch("subprocess.run") as process, self.assertRaises((LyricValidationError, ValueError, OSError)):
            apply_verified_lyrics(self.manifest if manifest is None else manifest,
                                  self.track if track else None, self.music)
        process.assert_not_called()
        self.assertFalse(list(self.root.glob("text-v*")))

    def test_identity_rejected_before_any_subprocess(self):
        doc = copy.deepcopy(self.doc)
        doc["audio_sha256"] = "f" * 64
        self.reject(doc)

    def test_unverified_missing_legacy_unsafe_and_bad_times_before_subprocess(self):
        cases = []
        for key in ("schema", "audio_sha256", "provenance", "words"):
            d = copy.deepcopy(self.doc)
            del d[key]
            cases.append(d)
        for verified in (False, "true", 1, None):
            d = copy.deepcopy(self.doc)
            d["provenance"]["alignment_verified"] = verified
            cases.append(d)
        for word in ({"text": r"{\pos(0,0)}injected", "start": 1, "end": 2},
                     {"text": "bad", "start": -1, "end": 2},
                     {"text": "bad", "start": 1, "end": float("nan")},
                     {"text": "bad", "start": 1, "end": 100000}):
            d = copy.deepcopy(self.doc)
            d["words"] = [word]
            cases.append(d)
        for d in cases:
            with self.subTest(document=d):
                self.reject(d)
        self.reject(track=False)

    def test_music_manifest_identity_and_config_bounds(self):
        for key, value in (("music_source", str(self.root / "other.wav")), ("frame_count", 61),
                           ("video_duration", 500), ("music_start_sample", -1)):
            m = copy.deepcopy(self.manifest)
            m[key] = value
            self.reject(manifest=m)
        m = copy.deepcopy(self.manifest)
        m["config"]["width"] = 10000
        self.reject(manifest=m)

    def test_graph_path_rejects_filter_and_quote_syntax(self):
        for name in ("injected'file", "file;movie", "file[bad]", "file,ass", "file\nname"):
            with self.subTest(name=name), self.assertRaises(LyricValidationError):
                _graph_path(self.root / name)
        self.assertIn("lyrics.ass", _graph_path(self.root / "safe path" / "lyrics.ass"))
        if os.name == "nt":
            self.assertIn(r"\:", _graph_path(self.root / "lyrics.ass"))


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg required")
class EncounterTextRenderTests(EncounterTextValidationTests):
    def test_decoded_duration_rejection_never_burns(self):
        if not {"Oswald", "Bebas Neue"} <= {f.family for f in discover_licensed_fonts()}:
            self.skipTest("licensed local fonts required")
        self.doc["words"][0]["end"] = 4.0
        self.track.write_text(json.dumps(self.doc), encoding="utf-8")
        with self.assertRaisesRegex(LyricValidationError, "exceeds decoded duration"):
            apply_verified_lyrics(self.manifest, self.track, self.music)
        child = self.root / "text-v0001"
        self.assertTrue((child / "decode-music.args.json").is_file())
        self.assertFalse((child / "burn-lyrics.args.json").exists())
        self.assertFalse((child / "encounters-text.mp4").exists())
        self.assertEqual(self.original.read_bytes(), b"not decoded in rejection tests")

    def test_verified_render_decoded_text_exact_frames_pcm_and_original(self):
        if not {"Oswald", "Bebas Neue"} <= {f.family for f in discover_licensed_fonts()}:
            self.skipTest("licensed local fonts required")
        evidence = os.environ.get("AIVE_TEXT_EVIDENCE")
        if evidence:
            root = Path(evidence)
            root.mkdir(parents=True, exist_ok=True)
            # Preserve fixture artifacts and the logged resulting render.
            self.root = Path(tempfile.mkdtemp(prefix="text-proof-", dir=root))
            self.music = self.root / "music.wav"
            self.original = self.root / "encounters.mp4"
            self.track = self.root / "track.json"
            self.manifest.update(job_dir=str(self.root), output=str(self.original), music_source=str(self.music))
        subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-y", "-f", "lavfi", "-i",
                        "sine=frequency=440:sample_rate=8000:duration=3", "-c:a", "pcm_s16le", str(self.music)], check=True)
        self.doc["audio_sha256"] = audio_sha256(self.music)
        self.track.write_text(json.dumps(self.doc), encoding="utf-8")
        subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-y", "-f", "lavfi", "-i",
                        "color=c=black:s=320x180:r=30:d=2", "-i", str(self.music),
                        "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "0", "-preset", "ultrafast",
                        "-c:a", "aac", "-t", "2", str(self.original)], check=True)
        before = audio_sha256(self.original)
        unchanged = copy.deepcopy(self.manifest)
        result = apply_verified_lyrics(self.manifest, self.track, self.music)
        self.assertEqual(self.manifest, unchanged)
        self.assertEqual(before, audio_sha256(self.original))
        self.assertTrue(self.original.is_file())
        self.assertNotEqual(result["output"], str(self.original))
        self.assertEqual(result["authored_design"], self.manifest["authored_design"])
        audit = result["typography_audit"]
        self.assertEqual(audit["original_output"], str(self.original))
        self.assertEqual(audit["audio_mode"], "copy")
        self.assertIn("assertion", audit["limitations"][0])
        ass = Path(audit["ass_path"]).read_text(encoding="utf-8")
        self.assertIn("PlayResX: 320", ass)
        self.assertIn("0:00:00.20,0:00:01.80", ass)
        output = Path(result["output"])
        job = output.parent
        args = json.loads((job / "burn-lyrics.args.json").read_text())
        self.assertEqual(args[args.index("-c:a") + 1], "copy")
        for flag in ("-shortest", "-r", "-t", "-frames:v"):
            self.assertNotIn(flag, args)

        def decode(file, kind):
            options = (["-map", "0:a:0", "-c:a", "pcm_s16le", "-f", "s16le"] if kind == "audio" else
                       ["-map", "0:v:0", "-pix_fmt", "rgb24", "-f", "rawvideo"])
            return subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-i", str(file)] + options + ["pipe:1"],
                                  capture_output=True, check=True).stdout
        self.assertEqual(decode(self.original, "audio"), decode(output, "audio"))
        original_frames, text_frames = decode(self.original, "video"), decode(output, "video")
        stride = 320 * 180 * 3
        self.assertEqual(len(original_frames), 60 * stride)
        self.assertEqual(len(text_frames), 60 * stride)
        self.assertEqual(original_frames[:stride], text_frames[:stride])
        self.assertNotEqual(original_frames[30*stride:31*stride], text_frames[30*stride:31*stride])
        for file in (self.original, output):
            meta = json.loads(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0",
                                             "-show_streams", "-of", "json", str(file)], capture_output=True, text=True, check=True).stdout)
            s = meta["streams"][0]
            self.assertEqual((s["nb_read_frames"], s["avg_frame_rate"], s["duration"]), ("60", "30/1", "2.000000"))
        # Also compare compressed packets, beyond decoded PCM equality.
        def packets(file):
            return json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_packets",
                                               "-show_data_hash", "sha256", "-of", "json", str(file)],
                                              capture_output=True, text=True, check=True).stdout)["packets"]
        fields = ("pts", "dts", "duration", "size", "data_hash")
        self.assertEqual([tuple(p.get(k) for k in fields) for p in packets(self.original)],
                         [tuple(p.get(k) for k in fields) for p in packets(output)])
        second = apply_verified_lyrics(self.manifest, self.track, self.music)
        self.assertEqual(Path(second["output"]).parent.name, "text-v0002")
        self.assertTrue(output.is_file())
        if evidence:
            (self.root / "proof.json").write_text(json.dumps({"passed": True, "frames": 60, "fps": 30,
                "duration": 2, "decoded_text_differs": True, "pcm_equal": True, "audio_packets_equal": True,
                "original_sha256": before, "manifest": result}, indent=2), encoding="utf-8")


if __name__ == "__main__":
    unittest.main()

