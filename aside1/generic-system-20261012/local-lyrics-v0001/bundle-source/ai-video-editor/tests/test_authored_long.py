"""Bounded authored v2 contract; real long CFR/audio proof, no source review."""
import copy
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from aive.authored_footage import video_graph
from aive.encounter_render import RenderConfig, render_encounters, validate_plan, _video_filter, _rounded
from test_authored_footage import authored_plan
from test_encounter_render import plan_for


def long_plan(sources=None, duration=35., count=12):
    sources = sources or tuple(f"long-{i}.mkv" for i in range(count))
    # Fractional cuts exercise row phase, rather than only integer boundaries.
    lengths = [round(duration/count, 3)]*(count-1)
    lengths.append(duration-sum(lengths))
    p = plan_for(sources, lengths, tuple(i*4+.113 for i in range(count)))
    roles = ["setup"]+["contrast" if i%3 == 2 else "impact" for i in range(1, count-1)]+["payoff"]
    p["authored_design"] = dict(schema_version="authored-footage/v2",
        shots=[dict(role=r, composition="inset" if r == "contrast" else "full") for r in roles],
        bridges=[dict(boundary=2, direction="right", frames=8),
                 *([dict(boundary=count-2, direction="left", frames=8)] if count-2 != 2 else [])],
        ending=dict(fade_frames=12), impacts=[])
    for i, item in enumerate(p["timeline"]):
        local = min(1.2, (item["source_end"]-item["source_start"])/2)
        st, ot = item["source_start"]+local, item["output_start"]+local
        item["events"] = [dict(source=item["source"], confirmed=True,
            source_audio_event=st, source_visual_event=st+.04,
            output_audio_event=ot, output_visual_event=ot+.04)]
        if i in (1, 4, count-1):
            p["authored_design"]["impacts"].append(dict(clip_index=i, output_time=ot, frames=8, strength=.8))
    return p


class AuthoredLongValidationTests(unittest.TestCase):
    def setUp(self):
        self.config = RenderConfig(width=128, height=72, fps=30, style="authored-footage")

    def test_v1_strict_limits_and_schema_unchanged(self):
        validate_plan(authored_plan(), self.config)
        for count, duration in ((4, 12.1), (9, 9.), (3, 9.)):
            p = long_plan(duration=duration, count=count)
            p["authored_design"].update(schema_version="authored-footage/v1")
            p["authored_design"].pop("impacts")
            with self.subTest(count=count, duration=duration), self.assertRaisesRegex(ValueError, "4..8 clips and <=12"):
                validate_plan(p, self.config)
        p = authored_plan()
        p["authored_design"]["impacts"] = []
        with self.assertRaisesRegex(ValueError, "exactly"):
            validate_plan(p, self.config)

    def test_empty_v2_impacts_preserve_exact_v1_graph_and_effect_bounds(self):
        p = authored_plan()
        original = validate_plan(p, self.config)
        p["authored_design"].update(schema_version="authored-footage/v2", impacts=[])
        upgraded = validate_plan(p, self.config)
        for old, new in zip(original, upgraded):
            self.assertEqual(video_graph(_video_filter(old, self.config), old, self.config),
                             video_graph(_video_filter(new, self.config), new, self.config))
        for frames, strength in ((2, 0), (2, 1), (12, 0), (12, 1)):
            p = long_plan()
            p["authored_design"]["impacts"][0].update(frames=frames, strength=strength)
            rows = validate_plan(p, self.config)
            effect = rows[1]["authored_impacts"][0]
            self.assertEqual(effect["end_frame"]-effect["start_frame"]+1, frames)
            self.assertEqual(effect["strength"], strength)

    def test_v2_35_seconds_12_clips_original_clocks_and_single_zoompan(self):
        p = long_plan()
        before = copy.deepcopy(p)
        rows = validate_plan(p, self.config)
        clean = copy.deepcopy(p)
        clean.pop("authored_design")
        baseline = validate_plan(clean, RenderConfig(width=128, height=72, fps=30))
        self.assertEqual(p, before)
        self.assertEqual(len(rows), 12)
        self.assertEqual(sum(r["frame_count"] for r in rows), 1050)
        for row, reference in zip(rows, baseline):
            for key, value in reference.items():
                self.assertEqual(row[key], value)
            self.assertNotIn("time_map", row)
            self.assertNotIn("audio_segments", row)
        row = rows[1]  # Both bridge and event share one zoompan.
        effect = row["authored_impacts"][0]
        self.assertEqual(effect["center_frame"], _rounded(effect["output_time"], 30)-row["frame_start"])
        self.assertNotEqual(row["video_phase_seconds"], 0)
        graph = video_graph(_video_filter(row, self.config), row, self.config)
        self.assertEqual(graph.count("zoompan="), 1)
        self.assertEqual(graph.count("fps=30:start_time=0"), 1)
        self.assertIn("+0.05*", graph)
        self.assertIn("brightness='0.06*", graph)
        self.assertIn("saturation='1+0.12*", graph)

    def test_v2_bounds_required_impacts_and_strict_fields(self):
        validate_plan(long_plan(duration=50., count=24), self.config)
        validate_plan(long_plan(duration=10., count=4), self.config)
        for count, duration in ((12, 50.1), (25, 35.), (3, 10.)):
            with self.subTest(count=count, duration=duration), self.assertRaisesRegex(ValueError, "4..24 clips and <=50"):
                validate_plan(long_plan(duration=duration, count=count), self.config)
        mutations = [lambda d: d.pop("impacts"), lambda d: d.update(impacts=None),
                     lambda d: d.update(impacts=[d["impacts"][0]]*129),
                     lambda d: d.update(extra=True),
                     lambda d: d["impacts"][0].update(confirmed=True),
                     lambda d: d["impacts"][0].update(clip_index=True),
                     lambda d: d["impacts"][0].update(clip_index=12),
                     lambda d: d["impacts"][0].update(output_time=float("nan")),
                     lambda d: d["impacts"][0].update(output_time=True),
                     lambda d: d["impacts"][0].update(output_time=30),
                     lambda d: d["impacts"][0].update(frames=1),
                     lambda d: d["impacts"][0].update(frames=13),
                     lambda d: d["impacts"][0].update(frames=2.5),
                     lambda d: d["impacts"][0].update(strength=-.1),
                     lambda d: d["impacts"][0].update(strength=1.1),
                     lambda d: d["impacts"][0].update(strength=True),
                     lambda d: d["impacts"][0].update(strength=float("inf"))]
        with patch("aive.encounter_render.subprocess.run") as run:
            for mutate in mutations:
                p = long_plan()
                mutate(p["authored_design"])
                with self.subTest(design=p["authored_design"]), self.assertRaises(ValueError):
                    render_encounters(p, "missing.wav", "unused", config=self.config)
            run.assert_not_called()

    def test_output_anchor_tolerance_audio_or_visual_and_invented_rejected(self):
        for offset in (0., 1/30, .04):
            p = long_plan()
            p["authored_design"]["impacts"][0]["output_time"] += offset
            validate_plan(p, self.config)
        p = long_plan()
        p["authored_design"]["impacts"][0]["output_time"] += .08
        with self.assertRaisesRegex(ValueError, "lacks.*event"):
            validate_plan(p, self.config)
        p = long_plan()
        p["timeline"][1]["events"] = []
        with self.assertRaisesRegex(ValueError, "lacks.*event"):
            validate_plan(p, self.config)

    def test_candidates_remain_unknown_and_explicit_unconfirmed_unchanged(self):
        p = long_plan()
        item = p["timeline"][1]
        t = item["source_start"]+1.2
        item["events"] = []
        item["candidate_events"] = [dict(time=t, attack_interval=[t-.03, t+.03], confirmed=False)]
        before = copy.deepcopy(p)
        rows = validate_plan(p, self.config)
        self.assertEqual(p, before)
        self.assertEqual(rows[1]["events"], [])
        self.assertNotIn("identity", rows[1]["authored_impacts"][0])
        for mutate in (lambda c: c.pop("confirmed"), lambda c: c.update(confirmed=True),
                       lambda c: c.update(time=float("inf")), lambda c: c.update(attack_interval=[0, t])):
            bad = copy.deepcopy(p)
            mutate(bad["timeline"][1]["candidate_events"][0])
            with self.assertRaises(ValueError):
                validate_plan(bad, self.config)
        # Unchecked candidate output metadata cannot invent an anchor.
        p["timeline"][1]["candidate_events"][0]["output_time"] = item["output_start"]+2
        p["authored_design"]["impacts"][0]["output_time"] = item["output_start"]+2
        with self.assertRaisesRegex(ValueError, "lacks.*event"):
            validate_plan(p, self.config)

    def test_window_bounds_overlapping_impacts_bridges_fades_and_protections(self):
        p = long_plan()
        p["authored_design"]["impacts"].append(dict(p["authored_design"]["impacts"][0]))
        with self.assertRaisesRegex(ValueError, "overlaps.*impact"):
            validate_plan(p, self.config)
        for index, local in ((0, .02), (1, 2.8), (11, 2.8)):
            p = long_plan()
            item = p["timeline"][index]
            # Candidate makes a supplied anchor explicit. Wider impact windows
            # remain forbidden even if its anchor itself clears a bridge.
            item["events"] = []
            t = item["source_start"]+local
            item["candidate_events"] = [dict(time=t, attack_interval=[t, t], confirmed=False)]
            p["authored_design"]["impacts"] = [dict(clip_index=index,
                output_time=item["output_start"]+local, frames=12, strength=1)]
            with self.subTest(index=index), self.assertRaisesRegex(ValueError, "outside|overlaps|protected"):
                validate_plan(p, self.config)
        # Window can intersect the bridge even when a supplied event anchor
        # is just beyond the existing .18-second safety margin.
        p = long_plan()
        item = p["timeline"][1]
        t = item["output_end"]-.48
        st = item["source_end"]-.48
        item["events"][0].update(source_audio_event=st, source_visual_event=st,
                                 output_audio_event=t, output_visual_event=t)
        p["authored_design"]["impacts"][0].update(output_time=t+1/30, frames=12)
        with self.assertRaisesRegex(ValueError, "impact window overlaps"):
            validate_plan(p, self.config)


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg required")
class AuthoredLongFFmpegTests(unittest.TestCase):
    def ff(self, args):
        proc = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"]+args,
                              capture_output=True, timeout=90)
        self.assertEqual(proc.returncode, 0, proc.stderr.decode(errors="replace"))
        return proc.stdout

    def test_actual_35_second_sequence_exact_frames_audio_stems_local_effect(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source, music = root/"source.mkv", root/"music.wav"
            self.ff(["-f", "lavfi", "-i", "testsrc2=size=128x72:rate=30:duration=49",
                     "-f", "lavfi", "-i", "sine=frequency=421:sample_rate=48000:duration=49",
                     "-map", "0:v", "-map", "1:a", "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
            self.ff(["-f", "lavfi", "-i", "anoisesrc=sample_rate=48000:duration=36:seed=4:amplitude=0.05",
                     "-c:a", "pcm_s16le", str(music)])
            p = long_plan((source,)*12)
            baseline_plan = copy.deepcopy(p)
            baseline_plan["authored_design"]["impacts"] = []
            config = RenderConfig(width=128, height=72, fps=30, timeout=90, quality=12, style="authored-footage")
            baseline = render_encounters(baseline_plan, music, root/"base", config=config)
            result = render_encounters(p, music, root/"effects", config=config)
            self.assertEqual(result["frame_count"], 1050)
            self.assertEqual(result["sample_count"], 1680000)
            for stem in ("game_stem", "music_stem"):
                self.assertEqual(Path(result[stem]).read_bytes(), Path(baseline[stem]).read_bytes())
            # Independent original-clock PCM evidence, not only equal stems.
            pcm = lambda f: self.ff(["-i", str(f), "-vn", "-ar", "48000", "-ac", "2", "-f", "s16le", "pipe:1"])
            source_pcm = pcm(source)
            expected = b"".join(source_pcm[r["source_sample_start"]*4:(r["source_sample_start"]+r["sample_count"])*4]
                                for r in result["chunks"])
            self.assertEqual(pcm(result["game_stem"]), expected)
            first = result["music_start_sample"]*4
            self.assertEqual(pcm(result["music_stem"]), pcm(music)[first:first+1680000*4])
            pixels = self.ff(["-i", result["output"], "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"])
            reference = self.ff(["-i", baseline["output"], "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"])
            size = 128*72*3
            self.assertEqual(len(pixels), 1050*size)
            self.assertEqual(len(reference), 1050*size)
            frame = lambda data, n: data[n*size:(n+1)*size]
            diff = lambda n: sum(abs(a-b) for a,b in zip(frame(pixels,n), frame(reference,n)))/size
            for impact in p["authored_design"]["impacts"]:
                self.assertGreater(diff(_rounded(impact["output_time"], 30)), 2)
            self.assertLess(diff(150), 5)
            self.assertLess(sum(frame(pixels,1049))/size, 3)
            graph = Path(result["job_dir"], "authored-001.filter.txt").read_text()
            self.assertEqual(graph.count("zoompan="), 1)
            self.assertEqual(result["authored_design"], p["authored_design"])
            self.assertNotIn("certified", result)


if __name__ == "__main__":
    unittest.main()
