"""Validation plus actual local FFmpeg two-source hard-cut timing proof."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import wave

from aive.encounter_render import RenderConfig, RenderError, render_encounters, validate_plan, _video_filter, _run


def plan_for(sources=("a.mp4", "b.mp4"), lengths=(.37, .37), starts=(.113, .219)):
    rows, cursor = [], 0.
    for source, length, start in zip(sources, lengths, starts):
        end = cursor+length
        rows.append(dict(source=str(source), source_start=start, source_end=start+length,
                         output_start=cursor, output_end=end, music_start=.127+cursor,
                         music_end=.127+end, speed=1.))
        cursor = end
    return dict(schema_version="encounters/v1", duration=cursor, requested_duration=cursor,
                music_start=.127, music_end=.127+cursor, music_continuous=True, gaps=[], timeline=rows)


class ValidationTests(unittest.TestCase):
    def test_global_rounding_not_sum_of_rounded_durations(self):
        config = RenderConfig(fps=10)
        rows = validate_plan(plan_for(lengths=(.37, .37)), config)
        self.assertEqual([r["frame_count"] for r in rows], [4, 3])
        self.assertEqual(rows[-1]["frame_end"], 7)
        self.assertAlmostEqual(rows[1]["video_phase_seconds"], -.03)
        graph = _video_filter(rows[1], config)
        self.assertIn("setpts=PTS-0.219000000000/TB", graph)
        self.assertNotIn("PTS-STARTPTS", graph)
        self.assertNotIn("atempo", graph)

    def test_invalid_plans_before_any_subprocess(self):
        mutations = [lambda p: p.update(timeline=[]), lambda p: p.update(duration=float("nan")),
                     lambda p: p.update(schema_version="other"), lambda p: p.update(gaps=[1]),
                     lambda p: p.update(music_continuous=False), lambda p: p.update(lyrics="words"),
                     lambda p: p["timeline"][0].pop("speed"),
                     lambda p: p["timeline"][0].update(speed=1.001),
                     lambda p: p["timeline"][0].update(speed=True),
                     lambda p: p["timeline"][0].update(source_end=float("inf")),
                     lambda p: p["timeline"][0].update(source_start=-1),
                     lambda p: p["timeline"][1].update(output_start=.4),
                     lambda p: p["timeline"][1].update(music_start=.9),
                     lambda p: p["timeline"][0].update(source_end=.9),
                     lambda p: p["timeline"][0].update(ramp_in=.2),
                     lambda p: p["timeline"][0].update(source=""),
                     lambda p: p.update(duration=True),
                     lambda p: p.update(requested_duration=.1)]
        with patch("aive.encounter_render.subprocess.run") as run:
            for mutate in mutations:
                with self.subTest(mutation=mutate):
                    plan = plan_for()
                    mutate(plan)
                    with self.assertRaises(ValueError):
                        render_encounters(plan, "music.wav", "unused")
            run.assert_not_called()

    def test_aliases_overlap_rejected(self):
        with self.assertRaisesRegex(ValueError, "overlapping"):
            validate_plan(plan_for(("a.mp4", "./a.mp4")))

    def test_contiguous_same_source_ranges_allowed(self):
        rows = validate_plan(plan_for(("a.mp4", "a.mp4"), starts=(.113, .483)))
        self.assertEqual(len(rows), 2)

    def test_bounds_and_collapsed_clips(self):
        with self.assertRaisesRegex(ValueError, "actual source"):
            validate_plan(plan_for(), source_durations={"a.mp4": .2, "b.mp4": 1})
        with self.assertRaisesRegex(ValueError, "music excerpt"):
            validate_plan(plan_for(), music_duration=.2)
        with self.assertRaisesRegex(ValueError, "collapses"):
            validate_plan(plan_for(lengths=(.001, .001)))
        with self.assertRaisesRegex(ValueError, "bounded"):
            validate_plan(plan_for(), RenderConfig(max_clip_duration=.1))
        with self.assertRaisesRegex(ValueError, "duration"):
            validate_plan(plan_for(), RenderConfig(max_duration=.1))

    def test_event_validation(self):
        p = plan_for()
        row = p["timeline"][0]
        row["events"] = [dict(source="a.mp4", confirmed=True, source_audio_event=.213,
                              source_visual_event=.223, output_audio_event=.1, output_visual_event=.11)]
        result = validate_plan(p)
        self.assertAlmostEqual(result[0]["events"][0]["predicted_audio_event"], .1)
        row["events"][0]["output_audio_event"] = .2
        with self.assertRaisesRegex(ValueError, "event timing"):
            validate_plan(p)

    def test_config_rejects_implicit_or_wrong_fallback(self):
        self.assertIsNone(RenderConfig(encoder="h264_qsv").fallback_encoder)
        RenderConfig(encoder="h264_qsv", fallback_encoder="libx264").validate()
        for config in (RenderConfig(width=1279), RenderConfig(encoder="other"),
                       RenderConfig(fallback_encoder="libx264"), RenderConfig(timeout=float("inf"))):
            with self.assertRaises(ValueError):
                config.validate()

    def test_nonzero_exit_and_timeout_logs(self):
        with tempfile.TemporaryDirectory() as tmp:
            job = Path(tmp)
            with patch("aive.encounter_render.subprocess.run", return_value=subprocess.CompletedProcess(["ffmpeg"], 9)):
                with self.assertRaisesRegex(RenderError, "exited 9"):
                    _run(["ffmpeg"], job, "exit", 1)
            self.assertEqual(json.loads((job/"exit.status.json").read_text())["returncode"], 9)
            with patch("aive.encounter_render.subprocess.run", side_effect=subprocess.TimeoutExpired(["ffmpeg"], 1)):
                with self.assertRaisesRegex(RenderError, "args=.*stderr="):
                    _run(["ffmpeg"], job, "timeout", 1)
            self.assertTrue((job/"timeout.status.json").is_file())

    def test_subprocess_errors_have_persistent_arguments_and_logs(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(RenderError, "args=.*stderr="):
                _run(["definitely-missing-encounter-tool"], Path(tmp), "fail", 1)
            self.assertTrue((Path(tmp)/"fail.args.json").is_file())
            self.assertTrue((Path(tmp)/"fail.stderr.log").is_file())


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "local FFmpeg required")
class FFmpegEndToEndTests(unittest.TestCase):
    def run_ffmpeg(self, args):
        proc = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"]+args,
                              capture_output=True, timeout=40)
        self.assertEqual(proc.returncode, 0, proc.stderr.decode(errors="replace"))
        return proc.stdout

    def test_two_sources_frames_stems_hard_cut_and_versioning(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            a, b, music = root/"a.mkv", root/"b.mkv", root/"music.mp3"
            for target, color, freq in ((a, "red", 400), (b, "blue", 900)):
                self.run_ffmpeg(["-f", "lavfi", "-i", f"color=c={color}:s=64x36:r=30:d=9",
                                 "-f", "lavfi", "-i", f"sine=frequency={freq}:sample_rate=48000:duration=9",
                                 "-map", "0:v", "-map", "1:a", "-c:v", "ffv1", "-c:a", "pcm_s16le", str(target)])
            self.run_ffmpeg(["-f", "lavfi", "-i", "sine=frequency=123:sample_rate=48000:duration=2",
                             "-c:a", "libmp3lame", str(music)])
            p = plan_for((a, b), starts=(7.113, 6.219))
            config = RenderConfig(width=64, height=36, fps=10, timeout=40)
            result = render_encounters(p, music, root/"jobs", config=config)
            self.assertGreater(float(result["music_metadata"]["streams"][0]["start_time"]), .001)
            self.assertIn("decoded sample zero", result["music_time_origin"])
            self.assertEqual(result["frame_count"], 7)
            self.assertEqual([r["frame_count"] for r in result["chunks"]], [4, 3])
            self.assertEqual(result["sample_count"], 35520)
            self.assertAlmostEqual(result["video_duration"], .7)
            self.assertAlmostEqual(result["audio_duration"], .74)
            frames = self.run_ffmpeg(["-i", result["output"], "-map", "0:v:0", "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"])
            size = 64*36*3
            self.assertEqual(len(frames), 7*size)
            for index in range(7):
                pixels = frames[index*size:(index+1)*size]
                red, blue = sum(pixels[0::3]), sum(pixels[2::3])
                self.assertGreater(red if index < 4 else blue, 5*(blue if index < 4 else red))
            # PCM stem is exactly the source sample slice, including fractional
            # source start; continuous music was decoded once, not per cut.
            def stereo_pcm(file):
                return self.run_ffmpeg(["-i", str(file), "-map", "0:a:0", "-vn", "-ar", "48000", "-ac", "2", "-f", "s16le", "pipe:1"])
            expected = b""
            for row in result["chunks"]:
                pcm = stereo_pcm(row["source"])
                start = row["source_sample_start"]*4
                expected += pcm[start:start+row["sample_count"]*4]
            self.assertEqual(stereo_pcm(result["game_stem"]), expected)
            source_music = stereo_pcm(music)
            first = result["music_start_sample"]*4
            self.assertEqual(stereo_pcm(result["music_stem"]), source_music[first:first+35520*4])
            self.assertTrue(Path(result["manifest_path"]).is_file())
            self.assertEqual(json.loads(Path(result["manifest_path"]).read_text())["frame_count"], 7)
            self.assertNotIn("-ss", json.loads((Path(result["job_dir"])/"game-000.args.json").read_text()))
            # Second real render must allocate a different version and preserve
            # the original output and manifest bytes.
            old_output = Path(result["output"]).read_bytes()
            second = render_encounters(p, music, root/"jobs", config=config)
            self.assertNotEqual(result["job_dir"], second["job_dir"])
            self.assertEqual(old_output, Path(result["output"]).read_bytes())


if __name__ == "__main__":
    unittest.main()
