"""Pure math invariants and decoded real FFmpeg protected-event proof."""
import json
import math
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import wave

from aive.impact_motion import build_time_map, audio_segments, effect_envelopes, envelope_expression
from aive.encounter_render import RenderConfig, render_encounters, validate_plan, _rounded
from tests.test_encounter_render import plan_for


class MotionMathTests(unittest.TestCase):
    def test_bounds_monotonic_endpoints_all_anchors_and_protected_identity(self):
        m = build_time_map(4., [1., 2.7], [1.0667, 2.8])
        self.assertEqual(m.map(0), 0)
        self.assertEqual(m.map(4), 4)
        for t in m.anchors:
            self.assertEqual(m.map(t), t)
        last = -1
        for i in range(4001):
            t = i/1000
            self.assertGreater(m.map(t), last)
            self.assertTrue(.75 <= m.speed(t) <= 1.35)
            if any(a <= t <= b for a, b in m.protected):
                self.assertEqual(m.map(t), t)
                self.assertEqual(m.speed(t), 1)
            last = m.map(t)
        self.assertGreater(m.map(.4), .4)
        for a, b in m.gaps:
            for t in (a, b):
                self.assertEqual(m.map(t), t)
                self.assertEqual(m.speed(t), 1)
        lo, hi = m.bounds()
        self.assertGreaterEqual(lo, .75)
        self.assertLessEqual(hi, 1.35)

    def test_impossible_and_nonfinite_clear_error(self):
        for kwargs in ({"strength": .5}, {"protect": .1}, {"min_speed": .99}, {"duration": float("nan")},
                       {"duration": 31}, {"max_speed": 2}):
            args = dict(duration=3, audio_events=[1])
            args.update(kwargs)
            with self.assertRaises(ValueError):
                build_time_map(**args)
        with self.assertRaisesRegex(ValueError, "outside"):
            build_time_map(2, [3])
        for invalid in (True, False, float("nan"), float("inf"), "bad", None):
            for kind in ("audio_events", "visual_events"):
                with self.subTest(invalid=invalid, kind=kind):
                    with self.assertRaises(ValueError):
                        build_time_map(2, **{kind: [invalid]})
        for kind in ("audio_events", "visual_events"):
            with self.assertRaises(ValueError):
                build_time_map(2, **{kind: None})

    def test_no_event_no_motion_and_overlap_protection(self):
        self.assertEqual(build_time_map(2).gaps, ())
        m = build_time_map(2, [.1, .2, .3, 1.8], [.34])
        self.assertEqual(m.protected[0][0], 0)
        self.assertAlmostEqual(m.protected[0][1], .52)
        self.assertEqual(effect_envelopes([.1, 1.9], 2), [])

    def test_absolute_sample_boundaries_no_accumulated_rounding(self):
        p = plan_for(lengths=(2.370013, 2.370013), starts=(7.113001, 6.219001))
        for row in p["timeline"]:
            st = row["source_start"]+1.1
            row["events"] = [dict(source=row["source"], confirmed=True, source_audio_event=st,
                                  source_visual_event=st+.04, output_audio_event=row["output_start"]+1.1,
                                  output_visual_event=row["output_start"]+1.14)]
        rows = validate_plan(p, RenderConfig(style="restrained-impact"))
        self.assertEqual(sum(r["sample_count"] for r in rows), _rounded(p["duration"], 48000))
        for r in rows:
            segs = r["audio_segments"]
            self.assertEqual(sum(s["count"] for s in segs), r["sample_count"])
            self.assertEqual(segs[0]["output_start_sample"], 0)
            for left, right in zip(segs, segs[1:]):
                self.assertEqual(left["output_end_sample"], right["output_start_sample"])
                self.assertEqual(left["source_end_sample"], right["source_start_sample"])
            self.assertTrue(any(not s["identity"] and abs(s["speed"]-1)>.01 for s in segs))
            self.assertTrue(all(.75 <= s["speed"] <= 1.35 for s in segs))

    def test_effect_envelopes_bounded_local_not_additive(self):
        envs = effect_envelopes([1., 1.01], 3)
        for env in envs:
            self.assertLessEqual(env["zoom_peak"], 1.045)
            self.assertLessEqual(env["brightness_peak"], .10)
            self.assertLessEqual(2*env["brightness_half_width"], .20)
        self.assertIn("max(", envelope_expression(envs, "t", "zoom"))
        self.assertEqual(RenderConfig().style, "clean")
        with self.assertRaisesRegex(ValueError, "style"):
            RenderConfig(style="fantasy").validate()


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "local FFmpeg required")
class ImpactFFmpegTests(unittest.TestCase):
    def ff(self, args):
        proc = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"]+args,
                              capture_output=True, timeout=60)
        self.assertEqual(proc.returncode, 0, proc.stderr.decode(errors="replace"))
        return proc.stdout

    def pcm(self, file):
        return self.ff(["-i", str(file), "-map", "0:a:0", "-vn", "-ar", "48000", "-ac", "2", "-f", "s16le", "pipe:1"])

    def test_two_source_real_ramp_effects_protected_impulses_frames_and_music_origin(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            sources = [root/"a.mkv", root/"b.mkv"]
            for source, color in zip(sources, ("red", "blue")):
                self.ff(["-f", "lavfi", "-i", f"color=c={color}:s=64x36:r=30:d=10,drawbox=color=lime:t=fill:enable='eq(n,242)'",
                         "-f", "lavfi", "-i", "aevalsrc=if(eq(n\\,384000)\\,0.8\\,0):s=48000:d=10",
                         "-map", "0:v", "-map", "1:a", "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
            music = root/"music.mp3"
            self.ff(["-f", "lavfi", "-i", "sine=frequency=123:sample_rate=48000:duration=5", "-c:a", "libmp3lame", str(music)])
            p = plan_for(sources, lengths=(2., 2.), starts=(7.1, 7.1))
            for r in p["timeline"]:
                r["events"] = [dict(source=r["source"], confirmed=True, source_audio_event=8., source_visual_event=242/30,
                                    output_audio_event=r["output_start"]+.9,
                                    output_visual_event=r["output_start"]+242/30-7.1)]
            try:
                result = render_encounters(p, music, root/"jobs", config=RenderConfig(width=64, height=36, fps=30, timeout=60, style="restrained-impact"))
            except Exception:
                for logfile in (root/"jobs").rglob("*.stderr.log"):
                    if logfile.read_text().strip():
                        print(logfile.read_text())
                raise
            self.assertEqual(result["frame_count"], 120)
            self.assertEqual(result["sample_count"], 192000)
            self.assertEqual(result["style"], "restrained-impact")
            self.assertEqual(result["motion_audio_granularity_seconds"], .10)
            game = self.pcm(result["game_stem"])
            for row in result["chunks"]:
                source_pcm = self.pcm(row["source"])
                center = _rounded(8., 48000)
                output_center = _rounded(row["output_start"]+.9, 48000)
                self.assertEqual(game[(output_center-4800)*4:(output_center+4800)*4], source_pcm[(center-4800)*4:(center+4800)*4])
                self.assertTrue(row["time_map"]["gaps"])
                self.assertTrue(row["effect_envelopes"])
            music_pcm = self.pcm(music)
            first = result["music_start_sample"]*4
            self.assertEqual(self.pcm(result["music_stem"]), music_pcm[first:first+192000*4])
            frames = self.ff(["-i", result["output"], "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"])
            size = 64*36*3
            green_frames = []
            for i in range(120):
                frame = frames[i*size:(i+1)*size]
                r, g, b = (sum(frame[c::3]) for c in range(3))
                if g > max(r, b)*2:
                    green_frames.append(i)
            for expected in (29, 89):
                self.assertTrue(any(abs(found-expected)<=1 for found in green_frames), green_frames)
            # Initial frame remains source colour, no all-white start pulse.
            frame = frames[:size]
            self.assertLess(sum(frame[1::3]), sum(frame[0::3])/3)
            saved = json.loads(Path(result["manifest_path"]).read_text())
            self.assertEqual(saved["chunks"][1]["sample_end"], 192000)


if __name__ == "__main__":
    unittest.main()
