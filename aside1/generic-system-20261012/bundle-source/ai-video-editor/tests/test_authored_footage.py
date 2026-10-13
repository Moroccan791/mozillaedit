"""Fail-closed design contract plus decoded FFmpeg video/audio evidence."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from aive.authored_footage import video_graph
from aive.encounter_render import RenderConfig, render_encounters, validate_plan, _video_filter
from aive.encounter_qa import _has_visual_style, verify_encounters
from test_encounter_render import plan_for


def authored_plan(sources=("a.mp4", "b.mp4", "c.mp4", "d.mp4")):
    p = plan_for(sources, lengths=(2.,)*4, starts=(.113, 2.219, 4.327, 6.433))
    p["authored_design"] = dict(schema_version="authored-footage/v1",
        shots=[dict(role=role, composition="inset" if role == "contrast" else "full")
               for role in ("setup", "impact", "contrast", "payoff")],
        bridges=[dict(boundary=2, direction="right", frames=8)], ending=dict(fade_frames=12))
    for item in p["timeline"]:
        st, ot = item["source_start"]+.9, item["output_start"]+.9
        item["events"] = [dict(source=item["source"], confirmed=True,
            source_audio_event=st, source_visual_event=st,
            output_audio_event=ot, output_visual_event=ot)]
    return p


class AuthoredValidationTests(unittest.TestCase):
    def test_explicit_opt_in_and_missing_design_rejected(self):
        p = authored_plan()
        for style in ("clean", "restrained-impact"):
            with self.assertRaisesRegex(ValueError, "explicit"):
                validate_plan(p, RenderConfig(style=style))
        p.pop("authored_design")
        with self.assertRaisesRegex(ValueError, "authored_design"):
            validate_plan(p, RenderConfig(style="authored-footage"))

    def test_exact_rows_audio_events_and_filter_counts(self):
        config = RenderConfig(width=128, height=72, fps=30, style="authored-footage")
        p = authored_plan()
        rows = validate_plan(p, config)
        clean = copy.deepcopy(p)
        clean.pop("authored_design")
        clean_rows = validate_plan(clean, RenderConfig(width=128, height=72, fps=30))
        for row, baseline in zip(rows, clean_rows):
            for key, value in baseline.items():
                self.assertEqual(row[key], value)
            self.assertNotIn("time_map", row)
            self.assertNotIn("audio_segments", row)
            self.assertEqual(_video_filter(row, config), _video_filter(baseline, RenderConfig(width=128, height=72, fps=30)))
        graph = video_graph(_video_filter(rows[2], config), rows[2], config)
        self.assertIn("split=2", graph)
        self.assertIn("overlay", graph)
        self.assertIn("sizeX=9:sizeY=1", graph)
        self.assertIn("trim=end_frame=60", graph)
        self.assertTrue(_has_visual_style({"style":"authored-footage"}, rows[0]))

    def test_malformed_design_fails_before_subprocess(self):
        mutations = [lambda d: d.update(schema_version="unknown"),
                     lambda d: d.update(extra="filter"), lambda d: d.update(shots=[]),
                     lambda d: d["shots"][0].update(role="payoff"),
                     lambda d: d["shots"][0].update(role=[]),
                     lambda d: d["shots"][2].update(composition={}),
                     lambda d: d["bridges"][0].update(direction=[]),
                     lambda d: d["shots"][2].update(composition="third-person"),
                     lambda d: d["shots"][1].update(composition="inset"),
                     lambda d: d.update(bridges=[]), lambda d: d.update(bridges={}),
                     lambda d: d["bridges"][0].update(boundary=True),
                     lambda d: d["bridges"][0].update(boundary=0),
                     lambda d: d["bridges"][0].update(frames=25),
                     lambda d: d["bridges"][0].update(frames=float("nan")),
                     lambda d: d["bridges"][0].update(direction="right';movie=secret"),
                     lambda d: d["bridges"].append(dict(d["bridges"][0])),
                     lambda d: d["ending"].update(fade_frames=True),
                     lambda d: d["ending"].update(fade_frames=61)]
        with patch("aive.encounter_render.subprocess.run") as run:
            for mutate in mutations:
                p = authored_plan()
                mutate(p["authored_design"])
                with self.subTest(design=p["authored_design"]), self.assertRaises(ValueError):
                    render_encounters(p, "missing.wav", "unused", config=RenderConfig(fps=30, style="authored-footage"))
            run.assert_not_called()

    def test_protected_events_and_edge_fade_overlap_rejected(self):
        p = authored_plan()
        item = p["timeline"][1]
        st = item["source_end"]-.1
        item["events"][0].update(source_audio_event=st, source_visual_event=st,
                                output_audio_event=item["output_end"]-.1,
                                output_visual_event=item["output_end"]-.1)
        with self.assertRaisesRegex(ValueError, "protected event"):
            validate_plan(p, RenderConfig(fps=30, style="authored-footage"))
        p = authored_plan()
        p["authored_design"]["bridges"].append(dict(boundary=3, direction="left", frames=8))
        p["authored_design"]["ending"]["fade_frames"] = 55
        with self.assertRaises(ValueError):
            validate_plan(p, RenderConfig(fps=30, style="authored-footage"))

    def test_bounded_proof_duration_and_bridge_size(self):
        p = authored_plan()
        config = RenderConfig(fps=10, style="authored-footage")
        with self.assertRaisesRegex(ValueError, "bridge frames"):
            validate_plan(p, config)
        p = authored_plan()
        # Invalid unsupported top-level effects remain forbidden.
        p["transitions"] = ["wipe"]
        with self.assertRaisesRegex(ValueError, "unsupported transitions"):
            validate_plan(p, RenderConfig(fps=30, style="authored-footage"))


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg required")
class AuthoredFFmpegTests(unittest.TestCase):
    def ffmpeg(self, args):
        p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"]+args,
                           capture_output=True, timeout=60)
        self.assertEqual(p.returncode, 0, p.stderr.decode(errors="replace"))
        return p.stdout

    def test_real_composition_bridge_fade_exact_frames_and_identical_stems(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source, music = root/"source.mkv", root/"music.wav"
            self.ffmpeg(["-f", "lavfi", "-i", "testsrc2=size=128x72:rate=30:duration=9",
                         "-f", "lavfi", "-i", "sine=frequency=421:sample_rate=48000:duration=9",
                         "-map", "0:v", "-map", "1:a", "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
            self.ffmpeg(["-f", "lavfi", "-i", "anoisesrc=sample_rate=48000:duration=9:seed=4:amplitude=0.05",
                         "-c:a", "pcm_s16le", str(music)])
            p = authored_plan((source,)*4)
            clean = copy.deepcopy(p)
            clean.pop("authored_design")
            common = dict(width=128, height=72, fps=30, timeout=60, quality=12)
            baseline = render_encounters(clean, music, root/"clean", config=RenderConfig(**common))
            result = render_encounters(p, music, root/"authored", config=RenderConfig(style="authored-footage", **common))
            self.assertEqual(result["frame_count"], 240)
            self.assertEqual(result["sample_count"], 384000)
            for stem in ("game_stem", "music_stem"):
                self.assertEqual(Path(baseline[stem]).read_bytes(), Path(result[stem]).read_bytes())
            pixels = self.ffmpeg(["-i", result["output"], "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"])
            reference = self.ffmpeg(["-i", baseline["output"], "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"])
            size = 128*72*3
            self.assertEqual(len(pixels), 240*size)
            frame = lambda data, n: data[n*size:(n+1)*size]
            self.assertLess(sum(frame(pixels,239))/size, 3)
            self.assertGreater(sum(frame(pixels,220))/size, 25)
            # Full impact away from edge is the same source clock; encoder
            # reference differences small. Contrast/bridge changes substantial.
            diff = lambda n: sum(abs(a-b) for a,b in zip(frame(pixels,n),frame(reference,n)))/size
            self.assertLess(diff(87), 5)
            self.assertGreater(diff(147), 15)
            self.assertGreater(diff(118), 8)
            graph = Path(result["job_dir"], "authored-002.filter.txt").read_text()
            self.assertIn("overlay", graph)
            self.assertEqual(result["authored_design"], p["authored_design"])
            qa = verify_encounters(result, p)
            self.assertEqual(qa["components"]["musical_sync"]["status"], "warn")
            for i in range(4):
                self.assertTrue(qa["components"][f"anchor_{i}_0_visual"]["style_present"])
            self.assertTrue(Path(result["manifest_path"]).is_file())


if __name__ == "__main__":
    unittest.main()
