"""Synthetic acoustic evidence only; no footage/perceptual certification."""
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

from aive.attack_qa import (MAX_DECODE_BYTES, SAMPLE_RATE, EvidenceError,
                            _attack, _decode, measure_attack_alignment)


def fixture(game=.5, music=.5):
    event = dict(id="shot-1", time=10.5, source_audio_event=10.5,
                 attack_interval=[10.497, 10.505], output_audio_event=game)
    plan = dict(duration=1.2, music_start=20., timeline=[dict(candidate_events=[event])],
                rhythm_assignments=[dict(clip_index=0, event_id="shot-1", source_time=10.5,
                                         output_time=game, music_hit_id="hit-1", music_time=20.+music,
                                         music_interval=[20.+music-.004, 20.+music+.004],
                                         planned_error_ms=0., matched=True)])
    return dict(audio_duration=1.2, config=dict(sample_rate=48000), music_start_sample=960000), plan


def pulses(times, seed=19, impulse=False):
    x = np.zeros((round(1.2*SAMPLE_RATE), 2))
    rng = np.random.default_rng(seed)
    for t in times:
        start = round(t*SAMPLE_RATE)
        if impulse:
            x[start] = [.7, -.7]
        else:
            n = round(.009*SAMPLE_RATE)
            # Abrupt broadband attack with decaying noise tail.
            burst = rng.normal(size=n) * np.exp(-np.arange(n)/(SAMPLE_RATE*.003))
            burst *= .65 / max(abs(burst))
            x[start:start+n, 0] += burst
            x[start:start+n, 1] -= burst
    return x


class UnitTests(unittest.TestCase):
    def test_independent_shift_not_supplied_clock(self):
        game = _attack(pulses([.530]), .5, "game")
        music = _attack(pulses([.5], seed=32), .5, "music")
        self.assertEqual(game["status"], "measured", game)
        self.assertEqual(music["status"], "measured", music)
        self.assertAlmostEqual(game["time"]-music["time"], .030, delta=.004)
        self.assertAlmostEqual(game["time"], .530, delta=.004)

    def test_impulse_and_opposite_phase_stereo(self):
        result = _attack(pulses([.5], impulse=True), .5, "game")
        self.assertEqual(result["status"], "measured", result)
        self.assertAlmostEqual(result["time"], .5, delta=.004)

    def test_silent_multiple_attacks_and_continuous_noise_abstain(self):
        self.assertEqual(_attack(np.zeros((28800, 2)), .5, "game")["status"], "unmeasurable")
        for kind in ("game", "music"):
            result = _attack(pulses([.48, .52]), .5, kind)
            self.assertEqual(result["status"], "ambiguous", result)
            self.assertIsNone(result["time"])
            self.assertGreaterEqual(len(result["candidates"]), 2)
        noise = np.random.default_rng(21).normal(0, .1, (28800, 2))
        self.assertNotEqual(_attack(noise, .5, "game")["status"], "measured")

    def test_bounds_before_decode_and_json_safe(self):
        manifest, plan = fixture()
        for mutate in (lambda m, p: m.update(audio_duration=121),
                       lambda m, p: p.update(duration=121),
                       lambda m, p: p.update(rhythm_assignments=p["rhythm_assignments"]*33),
                       lambda m, p: m.update(attack_qa_options=dict(max_decode_bytes=MAX_DECODE_BYTES+1))):
            m, p = copy.deepcopy(manifest), copy.deepcopy(plan)
            mutate(m, p)
            with patch("aive.attack_qa._decode") as decode:
                report = measure_attack_alignment(m, p)
                decode.assert_not_called()
            self.assertEqual(report["acoustic_alignment"], "warn")
            self.assertTrue(report["issues"])
            json.dumps(report, allow_nan=False)

    def test_event_identity_is_clip_specific_not_source_path(self):
        manifest, plan = fixture()
        plan["rhythm_assignments"][0]["event_id"] = "unknown-shot"
        with patch("aive.attack_qa._decode") as decode:
            report = measure_attack_alignment(manifest, plan)
            decode.assert_not_called()
        self.assertEqual(report["assignments"][0]["status"], "warn")
        self.assertIn("event_id", report["assignments"][0]["detail"])

    def test_decode_budget_and_timeout(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)/"source.wav"
            source.touch()
            with patch("aive.attack_qa.subprocess.run") as run:
                with self.assertRaisesRegex(EvidenceError, "byte limit"):
                    _decode(source, Path(temp)/"pcm", 1., "ffmpeg", 2, 100)
                run.assert_not_called()
            with patch("aive.attack_qa.subprocess.run") as run:
                with self.assertRaisesRegex(ValueError, "decode duration"):
                    _decode(source, Path(temp)/"pcm", 121., "ffmpeg", 2, MAX_DECODE_BYTES)
                run.assert_not_called()
            with patch("aive.attack_qa.subprocess.run", side_effect=subprocess.TimeoutExpired("ffmpeg", 1)):
                with self.assertRaisesRegex(EvidenceError, "decode failed"):
                    _decode(source, Path(temp)/"pcm", 1., "ffmpeg", 1, MAX_DECODE_BYTES)


@unittest.skipUnless(shutil.which("ffmpeg"), "local FFmpeg required")
class StemTests(unittest.TestCase):
    def run_report(self, game, music, mutate=None):
        with tempfile.TemporaryDirectory() as temp:
            manifest, plan = fixture()
            for kind, x in (("game", game), ("music", music)):
                target = Path(temp)/(kind+".wav")
                with wave.open(str(target), "wb") as handle:
                    handle.setnchannels(2)
                    handle.setsampwidth(2)
                    handle.setframerate(SAMPLE_RATE)
                    handle.writeframes((x*32767).astype("<i2").tobytes())
                manifest[kind+"_stem"] = str(target)
            if mutate:
                mutate(manifest, plan)
            report = measure_attack_alignment(manifest, plan)
            json.dumps(report, allow_nan=False)
            return report

    def test_two_decoded_stems_aligned_but_semantics_unverified(self):
        report = self.run_report(pulses([.5]), pulses([.5], 4))
        self.assertEqual(report["schema_version"], "attack-qa/v1")
        self.assertEqual(report["acoustic_alignment"], "pass", report)
        self.assertEqual(report["status"], "warn")
        self.assertEqual(report["musical_sync"], "unverified")
        self.assertEqual(report["final_mix"]["status"], "not_inspected")
        self.assertEqual(report["decode"]["origin"], "PCM sample zero")
        self.assertEqual(report["decode"]["sample_rate"], 24000)
        self.assertGreater(report["assignments"][0]["attack_range_overlap_ms"], 0)

    def test_actual_shift_overrides_zero_planned_error(self):
        report = self.run_report(pulses([.530]), pulses([.5], 4))
        row = report["assignments"][0]
        self.assertEqual(row["status"], "warn")
        self.assertAlmostEqual(row["offset_ms"], 30, delta=4)
        self.assertGreater(row["offset_range_ms"][0], 12)

    def test_silent_and_ambiguous_cannot_pass(self):
        for game in (np.zeros((28800, 2)), pulses([.48, .52])):
            report = self.run_report(game, pulses([.5], 4))
            self.assertEqual(report["acoustic_alignment"], "warn")
            self.assertEqual(report["assignments"][0]["status"], "warn")
            self.assertIsNone(report["assignments"][0]["offset_ms"])

    def test_unmatched_remains_warn_and_keeps_game_measurement(self):
        def unmatched(m, p):
            p["rhythm_assignments"][0].update(matched=False, music_time=None,
                                              music_hit_id=None, music_interval=None)
        report = self.run_report(pulses([.5]), pulses([.5]), unmatched)
        row = report["assignments"][0]
        self.assertEqual(row["status"], "warn")
        self.assertEqual(row["game_attack"]["status"], "measured")
        self.assertIsNone(row["music_attack"])

    def test_each_assignment_measured_independently(self):
        def second(m, p):
            event = dict(id="shot-2", time=10.8, source_audio_event=10.8,
                         attack_interval=[10.795, 10.805], output_audio_event=.8)
            p["timeline"][0]["candidate_events"].append(event)
            p["rhythm_assignments"].append(dict(clip_index=0, event_id="shot-2", source_time=10.8,
                output_time=.8, music_hit_id="hit-2", music_time=20.8, music_interval=[20.795, 20.805],
                planned_error_ms=0, matched=True))
        report = self.run_report(pulses([.5, .830]), pulses([.5, .8], 4), second)
        self.assertEqual([r["status"] for r in report["assignments"]], ["pass", "warn"])
        self.assertAlmostEqual(report["assignments"][1]["offset_ms"], 30, delta=4)

    def test_missing_stem_and_small_aggregate_budget_warn(self):
        def missing(m, p):
            m["music_stem"] = "nonexistent-music-stem.wav"
        report = self.run_report(pulses([.5]), pulses([.5]), missing)
        self.assertEqual(report["assignments"][0]["music_attack"]["status"], "unmeasurable")
        def limited(m, p):
            m["attack_qa_options"] = dict(max_decode_bytes=140000)
        report = self.run_report(pulses([.5]), pulses([.5]), limited)
        self.assertEqual(report["acoustic_alignment"], "warn")
        self.assertLessEqual(report["decode"]["bytes_written"], 140000)


if __name__ == "__main__":
    unittest.main()
