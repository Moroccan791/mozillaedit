"""Opt-in candidate-render integration for reviewed multishot timing maps."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from aive.encounter_render import RenderConfig, render_encounters, validate_plan, _video_filter
from aive.multishot_map import build_multishot_map


def reviewed_map(source_start=1.0, target_start=.127, source_sha256="a"*64):
    return build_multishot_map([
        dict(source_shot_time=2.0, source_audio_attack_interval=[1.95, 2.05],
             target_acoustic_hit_time=target_start+1.0625),
        dict(source_shot_time=4.0, source_audio_attack_interval=[3.95, 4.05],
             target_acoustic_hit_time=target_start+3.03125),
    ], source_start=source_start, source_end=source_start+4.0,
       target_start=target_start, target_end=target_start+4.0, reviewed=True,
       source_sha256=source_sha256)


def plan_for(source="source.mkv"):
    source = str(source)
    start, end, music_start = 1.0, 5.0, .127
    events = []
    for source_audio, source_visual, output in ((2.0, 2.0, 1.0625), (4.0, 4.0, 3.03125)):
        events.append(dict(source=source, confirmed=True,
            source_audio_event=source_audio, source_visual_event=source_visual,
            output_audio_event=output, output_visual_event=output))
    return dict(schema_version="encounters/v1", duration=4.0, requested_duration=4.0,
        music_start=music_start, music_end=music_start+4.0, music_continuous=True, gaps=[],
        timeline=[dict(source=source, source_start=start, source_end=end,
            output_start=0.0, output_end=4.0, music_start=music_start,
            music_end=music_start+4.0, speed=1.0, events=events)])


class MultiShotRenderValidationTests(unittest.TestCase):
    def test_map_binds_source_music_clocks_events_and_preserves_attacks(self):
        plan = plan_for()
        mapping = reviewed_map()
        rows = validate_plan(plan, RenderConfig(style="multishot"), multishot_maps={0: mapping})
        row = rows[0]
        self.assertEqual(row["frame_count"], 240)
        self.assertEqual(row["sample_count"], 192000)
        self.assertEqual(row["multishot_map"]["renderer_integration"], "encounter_render-multishot-opt-in")
        self.assertEqual(row["events"][0]["predicted_visual_event"], 1.0625)
        for source_start, output_start in ((1.95, 1.0125), (3.95, 2.98125)):
            segment = next(s for s in row["audio_segments"]
                if s["source_start_sample"] == round(source_start*48000))
            self.assertTrue(segment["identity"])
            self.assertEqual(segment["count"], 4800)
            self.assertEqual(segment["output_start_sample"], round(output_start*48000))
            self.assertEqual(segment["source_end_sample"], round((source_start+.1)*48000))

    def test_filter_uses_generated_map_expression_not_identity_pts(self):
        row = validate_plan(plan_for(), RenderConfig(style="multishot"),
                            multishot_maps={0: reviewed_map()})[0]
        graph = _video_filter(row, RenderConfig(style="multishot", fps=30))
        self.assertIn("pow(", graph)
        self.assertIn("between((PTS*TB-1.000000000000)", graph)
        self.assertIn("fps=30:start_time=0", graph)
        self.assertNotIn("setpts=PTS-1.000000000000/TB", graph)

    def test_missing_wrong_or_unmatched_maps_fail_closed(self):
        config = RenderConfig(style="multishot")
        with self.assertRaisesRegex(ValueError, "one explicit map"):
            validate_plan(plan_for(), config)
        with self.assertRaisesRegex(ValueError, "requires a reviewed source SHA256"):
            validate_plan(plan_for(), config, multishot_maps={0: reviewed_map(source_sha256=None)})
        with self.assertRaisesRegex(ValueError, "target/music endpoints"):
            validate_plan(plan_for(), config, multishot_maps={0: reviewed_map(target_start=.2)})
        p = plan_for()
        p["timeline"][0]["events"][0]["output_visual_event"] = .9
        with self.assertRaisesRegex(ValueError, "mapped event timing"):
            validate_plan(p, config, multishot_maps={0: reviewed_map()})
        p = plan_for()
        p["timeline"][0]["events"].pop()
        with self.assertRaisesRegex(ValueError, "each reviewed multishot anchor"):
            validate_plan(p, config, multishot_maps={0: reviewed_map()})

    def test_maps_cannot_be_silently_ignored_or_passed_to_other_styles(self):
        with self.assertRaisesRegex(ValueError, "require style"):
            validate_plan(plan_for(), RenderConfig(), multishot_maps={0: reviewed_map()})
        with patch("aive.encounter_render.subprocess.run") as run:
            with self.assertRaisesRegex(ValueError, "one explicit map"):
                render_encounters(plan_for(), "missing.wav", "unused",
                    config=RenderConfig(style="multishot"))
            run.assert_not_called()


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "local FFmpeg required")
class MultiShotFFmpegTests(unittest.TestCase):
    def ff(self, args):
        proc = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"]+args,
                              capture_output=True, timeout=90)
        self.assertEqual(proc.returncode, 0, proc.stderr.decode(errors="replace"))
        return proc.stdout

    def pcm(self, path):
        return self.ff(["-i", str(path), "-map", "0:a:0", "-vn", "-ar", "48000", "-ac", "2", "-f", "s16le", "pipe:1"])

    def test_rendered_video_audio_map_attack_pcm_and_music_clock(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source, music = root/"source.mkv", root/"music.wav"
            video = ("color=c=black:s=64x36:r=30:d=6,"
                     "drawbox=x=0:y=0:w=20:h=20:color=lime:t=fill:enable='between(t,1.9,2.1)',"
                     "drawbox=x=24:y=0:w=20:h=20:color=red:t=fill:enable='between(t,3.9,4.1)'")
            audio = ("aevalsrc=if(between(n\\,96000\\,96100)\\,0.5\\,"
                     "if(between(n\\,192000\\,192100)\\,0.5\\,0)):s=48000:d=6")
            self.ff(["-f", "lavfi", "-i", video, "-f", "lavfi", "-i", audio,
                     "-map", "0:v:0", "-map", "1:a:0", "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
            self.ff(["-f", "lavfi", "-i", "sine=frequency=123:sample_rate=48000:duration=5",
                     "-c:a", "pcm_s16le", str(music)])
            plan = plan_for(source)
            source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
            config = RenderConfig(width=64, height=36, fps=30, style="multishot", timeout=90)
            with self.assertRaisesRegex(ValueError, "SHA256 does not match"):
                render_encounters(plan, music, root/"wrong-hash", config=config,
                    multishot_maps={0: reviewed_map(source_sha256="0"*64)})
            self.assertFalse((root/"wrong-hash").exists())
            result = render_encounters(plan, music, root/"jobs", config=config,
                multishot_maps={0: reviewed_map(source_sha256=source_hash)})
            self.assertEqual(result["style"], "multishot")
            self.assertEqual(result["frame_count"], 120)
            self.assertEqual(result["sample_count"], 192000)
            self.assertEqual(result["chunks"][0]["multishot_map"]["planning_only"], True)
            self.assertNotIn("_multishot_mapping", result["chunks"][0])
            saved_plan = json.loads(Path(result["job_dir"], "plan.json").read_text())
            self.assertIn("0", saved_plan["multishot_maps"])

            source_pcm, game_pcm = self.pcm(source), self.pcm(result["game_stem"])
            for source_start, output_start in ((1.95, 1.0125), (3.95, 2.98125)):
                first_source, first_output = round(source_start*48000), round(output_start*48000)
                length = round(.1*48000)
                self.assertEqual(game_pcm[first_output*4:(first_output+length)*4],
                                 source_pcm[first_source*4:(first_source+length)*4])
            music_pcm = self.pcm(music)
            first = round(.127*48000)
            actual_music = self.pcm(result["music_stem"])
            expected_music = music_pcm[first*4:(first+192000)*4]
            self.assertEqual(actual_music, expected_music)

            frames = self.ff(["-i", result["output"], "-map", "0:v:0", "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"])
            frame_size = 64*36*3
            self.assertEqual(len(frames), 120*frame_size)
            def region_sums(frame, x0, x1):
                r=g=b=0
                for y in range(20):
                    for x in range(x0, x1):
                        i=(y*64+x)*3
                        r+=frame[i];g+=frame[i+1];b+=frame[i+2]
                return r,g,b
            for index, bounds, dominant in ((32,(0,20),1),(91,(24,44),0)):
                frame=frames[index*frame_size:(index+1)*frame_size]
                r,g,b=region_sums(frame,*bounds)
                if dominant==1:self.assertGreater(g,3*max(r,b))
                else:self.assertGreater(r,3*max(g,b))


if __name__ == "__main__":
    unittest.main()
