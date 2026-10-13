"""Synthetic-only QA proof. Requires local FFmpeg, never edits originals."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import wave

import numpy as np

from aive.encounter_qa import (EvidenceError, _PCMCache, _corr_trials, _duplicates,
                               _frame_match, _has_visual_style, _loudness, _parse_loudnorm, _run, _visual_samples, verify_encounters)
from aive.encounter_render import RenderConfig, render_encounters


class UnitTests(unittest.TestCase):
    def test_vectorized_shift_and_silence(self):
        rng = np.random.default_rng(7)
        ref = rng.normal(size=(1000, 2))
        heard = rng.normal(size=(1100, 2))
        heard[65:1065] = ref
        score, shift, _, _ = _corr_trials(ref, heard, 50, 1)
        self.assertAlmostEqual(score, 1)
        self.assertEqual(shift, 15)
        with self.assertRaisesRegex(EvidenceError, "silent"):
            _corr_trials(np.zeros_like(ref), heard, 50, 1)

    def test_duplicate_independent_alias_check(self):
        rows = [dict(source="a.mp4", source_start=0, source_end=1),
                dict(source="./a.mp4", source_start=.7, source_end=2)]
        self.assertEqual(_duplicates(rows)["status"], "fail")
        rows[1]["source_start"] = 1
        self.assertEqual(_duplicates(rows)["status"], "pass")

    def test_loudnorm_reads_input_not_output_and_json_safe_silence(self):
        data = dict(input_i="-12.3", input_tp="1.2", input_lra="2", input_thresh="-22",
                    output_i="-24", output_tp="-8")
        result = _parse_loudnorm("noise\n"+json.dumps(data))
        self.assertEqual(result["input_tp"], 1.2)
        self.assertNotIn("output_tp", result)
        data["input_i"] = "-inf"
        self.assertIsNone(_parse_loudnorm(json.dumps(data))["input_i"])
        json.dumps(_parse_loudnorm(json.dumps(data)), allow_nan=False)

    def test_missing_manifest_fails_json_safe_and_writes(self):
        with tempfile.TemporaryDirectory() as temp:
            target = Path(temp)/"qa.json"
            result = verify_encounters({}, output_path=target)
            self.assertEqual(result["status"], "fail")
            self.assertFalse(result["ok"])
            self.assertEqual(json.loads(target.read_text()), result)

    def test_timeout_and_loudness_clipping_use_input_fields(self):
        with patch("aive.encounter_qa.subprocess.run", side_effect=subprocess.TimeoutExpired(["ffmpeg"], 1)):
            with self.assertRaises(EvidenceError):
                _run(["ffmpeg"], 1, stdout=subprocess.PIPE)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)/"audio.wav"
            source.touch()
            data = dict(input_i="-12", input_tp="1.2", input_lra="1", input_thresh="-22",
                        output_i="-24", output_tp="-8")
            proc = subprocess.CompletedProcess([], 0, stderr=json.dumps(data).encode())
            with patch("aive.encounter_qa._run", return_value=proc):
                result = _loudness(source, "ffmpeg", 1)
            self.assertEqual(result["status"], "fail")
            self.assertTrue(result["possible_true_peak_clipping"])

    def test_styled_visual_mismatch_is_warning_only(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)/"source.mp4"
            output = Path(temp)/"output.mp4"
            source.touch()
            output.touch()
            rng = np.random.default_rng(84)
            ref, other = rng.normal(size=100), rng.normal(size=100)
            with patch("aive.encounter_qa._gray", side_effect=lambda p, *args: ref.copy() if Path(p) == source else other.copy()):
                result = _frame_match(source, 1, output, .5, 30, "ffmpeg", 1, True)
            self.assertEqual(result["status"], "warn")
            self.assertTrue(result["style_present"])
            self.assertTrue(result["masking_sensitive"])

    def test_clean_style_is_not_masking_but_actual_treatments_are(self):
        self.assertFalse(_has_visual_style({"style": "clean"}, {}))
        self.assertFalse(_has_visual_style({}, {"time_map": {"gaps": [], "strength": .06}}))
        self.assertTrue(_has_visual_style({"style": "restrained-impact"}, {}))
        self.assertTrue(_has_visual_style({"style": "clean"}, {"effect_envelopes": [{"center": 1}]}))
        self.assertTrue(_has_visual_style({}, {"time_map": {"gaps": [[0, 1]], "strength": .06}}))
        self.assertTrue(_has_visual_style({}, {}, {"overlays": ["graphic"]}))

    def test_cache_limit_before_subprocess(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)/"source.wav"
            source.touch()
            cache = _PCMCache(temp, "ffmpeg", 16000, 1, 10, 1000)
            with patch("aive.encounter_qa.subprocess.run") as run:
                with self.assertRaisesRegex(EvidenceError, "byte limit"):
                    cache.prepare(source, 1)
                with self.assertRaisesRegex(ValueError, "decode end"):
                    cache.prepare(source, 11)
                run.assert_not_called()
            cache.close()


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "local FFmpeg required")
class FFmpegTests(unittest.TestCase):
    def ff(self, args):
        proc = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"]+args,
                              capture_output=True, timeout=40)
        self.assertEqual(proc.returncode, 0, proc.stderr.decode(errors="replace"))
        return proc.stdout

    def noise_wav(self, target, seed):
        rng = np.random.default_rng(seed)
        # Non-periodic, band-limited stereo reference. Sines alone make shifts
        # ambiguous and cannot honestly establish synchronization.
        count = 4*48000
        data = rng.normal(size=(count, 2))
        kernel = np.hanning(31)
        kernel /= kernel.sum()
        data = np.stack([np.convolve(data[:, i], kernel, mode="same") for i in range(2)], axis=1)
        data *= .15/np.max(np.abs(data))
        with wave.open(str(target), "wb") as handle:
            handle.setnchannels(2)
            handle.setsampwidth(2)
            handle.setframerate(48000)
            handle.writeframes((data*32767).astype("<i2").tobytes())

    def test_real_aligned_stems_and_deliberate_delay(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            game, song = root/"game.wav", root/"song.wav"
            source, music = root/"source.mkv", root/"music.mp3"
            self.noise_wav(game, 31)
            self.noise_wav(song, 57)
            self.ff(["-f", "lavfi", "-i", "testsrc2=s=96x54:r=30:d=4", "-i", str(game),
                     "-map", "0:v", "-map", "1:a", "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
            self.ff(["-i", str(song), "-c:a", "libmp3lame", str(music)])
            event = dict(source=str(source), confirmed=True, source_audio_event=1.,
                         source_visual_event=1., output_audio_event=.5, output_visual_event=.5)
            row = dict(source=str(source), source_start=.5, source_end=1.7,
                       output_start=0., output_end=1.2, music_start=.3, music_end=1.5,
                       speed=1., events=[event])
            plan = dict(schema_version="encounters/v1", duration=1.2, requested_duration=1.2,
                        music_start=.3, music_end=1.5, music_continuous=True, gaps=[], timeline=[row])
            manifest = render_encounters(plan, music, root/"jobs",
                config=RenderConfig(width=96, height=54, fps=30, timeout=40))
            originals = {p: Path(p).read_bytes() for p in (manifest["game_stem"], manifest["music_stem"],
                                                         manifest["output"], str(source), str(music))}
            report_path = root/"quality.json"
            good = verify_encounters(manifest, plan, output_path=report_path)
            self.assertTrue(good["ok"], good["issues"])
            for kind in ("game", "music"):
                check = good["components"][f"anchor_0_0_{kind}_stem"]
                self.assertEqual(check["status"], "pass", check)
                self.assertLess(abs(check["shift_ms"]), 2)
                self.assertGreater(check["correlation"], .95)
                self.assertTrue(Path(check["sample_path"]).is_file())
            self.assertFalse(good["components"]["anchor_0_0_visual"]["style_present"])
            self.assertEqual(good["components"]["musical_sync"]["status"], "warn")
            self.assertEqual(good["status"], "warn")
            self.assertIn("not established", good["evidence_scope"]["gunshot_to_musical_hit"])
            self.assertEqual(good["components"]["structural"]["status"], "pass")
            self.assertEqual(good["components"]["anchor_0_0_final_mix"]["status"], "pass")
            self.assertEqual(json.loads(report_path.read_text()), good)
            self.assertEqual(good["decode_cache"]["decodes"], 5)
            self.assertGreater(good["benchmark"]["elapsed_seconds"], 0)
            protected = copy.deepcopy(manifest)
            protected["qa_options"] = {"final_mix": False}
            protected["chunks"][0]["time_map"] = {"protected": [[.42, .68]]}
            # The QA consumes declared safe bounds only, not a motion algorithm.
            bounded = verify_encounters(protected, plan)
            self.assertEqual(bounded["components"]["anchor_0_0_game_stem"]["status"], "pass")
            for kind in ("game", "music"): 
                changed = copy.deepcopy(manifest)
                stem = Path(manifest[f"{kind}_stem"])
                delayed = root/f"delayed-{kind}.wav"
                with wave.open(str(stem), "rb") as handle:
                    params, pcm = handle.getparams(), handle.readframes(handle.getnframes())
                delay = round(.017*params.framerate)*params.nchannels*params.sampwidth
                with wave.open(str(delayed), "wb") as handle:
                    handle.setparams(params)
                    handle.writeframes(bytes(delay)+pcm[:-delay])
                changed[f"{kind}_stem"] = str(delayed)
                changed["qa_options"] = {"final_mix": False}
                bad = verify_encounters(changed, plan)
                check = bad["components"][f"anchor_0_0_{kind}_stem"]
                self.assertEqual(check["status"], "fail", check)
                self.assertAlmostEqual(check["shift_ms"], 17, delta=1)
                self.assertEqual(bad["status"], "fail")
                self.assertFalse(bad["ok"])
            for filename, original in originals.items():
                self.assertEqual(Path(filename).read_bytes(), original)

    def test_blank_and_frozen_are_distinct_warnings(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            results = {}
            for label, spec in (("blank", "color=c=black:s=96x54:r=10:d=1"),
                                ("frozen", "color=c=red:s=96x54:r=10:d=1"),
                                ("moving", "testsrc2=s=96x54:r=10:d=1")):
                target = root/f"{label}.mkv"
                self.ff(["-f", "lavfi", "-i", spec, "-c:v", "ffv1", str(target)])
                results[label] = _visual_samples(target, 1, "ffmpeg", 20)
            self.assertEqual(results["blank"]["status"], "warn")
            self.assertTrue(results["blank"]["black_samples"])
            self.assertTrue(results["blank"]["possible_freeze"])
            self.assertEqual(results["frozen"]["status"], "warn")
            self.assertFalse(results["frozen"]["black_samples"])
            self.assertTrue(results["frozen"]["possible_freeze"])
            self.assertFalse(results["moving"]["possible_freeze"])
            for result in results.values():
                self.assertNotEqual(result["status"], "fail")
                self.assertTrue(all(Path(e["path"]).is_file() for e in result["sampled_frames"]))

    def test_pcm_origin_cache_uses_no_seek_and_bounds_decode(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            wav, mp3 = root/"noise.wav", root/"noise.mp3"
            self.noise_wav(wav, 91)
            self.ff(["-i", str(wav), "-c:a", "libmp3lame", str(mp3)])
            cache = _PCMCache(root, "ffmpeg", 16000, 20, 10, 1024**2)
            try:
                with patch("aive.encounter_qa.subprocess.run", wraps=subprocess.run) as run:
                    cache.prepare(mp3, 1.2)
                    cache.prepare(mp3, .7)
                    self.assertEqual(run.call_count, 1)
                    self.assertNotIn("-ss", run.call_args.args[0])
                    self.assertIn("-t", run.call_args.args[0])
                self.assertLess(cache.decoded_bytes, 16000*2*4*1.25)
                whole = np.frombuffer(self.ff(["-i", str(mp3), "-map", "0:a:0", "-vn", "-ac", "2",
                                               "-ar", "16000", "-f", "f32le", "pipe:1"]), dtype="<f4").reshape(-1, 2)
                np.testing.assert_array_equal(cache.window(mp3, .5, 4000), whole[8000:12000])
            finally:
                cache.close()


if __name__ == "__main__":
    unittest.main()
