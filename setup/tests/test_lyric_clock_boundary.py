"""Explicit 1x-clock boundary: retimed/mapped clocks never enter 1x-only paths.

Synthetic mechanical policy tests only; no lyrics, no real reviewed maps and no
semantic/perceptual claims. The 1x lyric machinery assumes a constant source-to-
output offset, so every retimed style must fail closed rather than silently
misprotect candidate/event clocks.
"""
import copy
import hashlib
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from aive.encounter_render import (CLOCK_MODEL_SCHEMA, RenderConfig,
                                   assert_uniform_1x_clock, render_clock_model,
                                   render_encounters, validate_plan)
from aive.encounter_text import apply_verified_lyrics
from aive.lyric_track import LyricValidationError
from aive.lyric_workflow import apply_prepared_lyrics, prepare_lyrics

try:  # unittest discovery puts tests/ on sys.path; package runs do not.
    from test_multishot_authored import fixture
except ModuleNotFoundError:  # pragma: no cover - direct module invocation
    from tests.test_multishot_authored import fixture


def one_x_authored_plan(plan):
    """Honest 1x variant of the combined fixture: translation clocks, no maps."""
    data = copy.deepcopy(plan)
    for item in data["timeline"]:
        for event in item.get("events", []):
            local = event["source_audio_event"] - item["source_start"]
            self_consistent = abs(event["source_visual_event"] - event["source_audio_event"]) < 1e-12
            assert self_consistent
            event["output_audio_event"] = item["output_start"] + local
            event["output_visual_event"] = item["output_start"] + local
    return data


def render_synthetic_media(root):
    def ff(args):
        result = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-v", "error"] + args,
                                capture_output=True, timeout=120)
        if result.returncode:
            raise RuntimeError(result.stderr.decode(errors="replace"))
    root.mkdir(parents=True, exist_ok=True)
    source, music = root / "source.mkv", root / "music.wav"
    ff(["-f", "lavfi", "-i", "testsrc2=size=128x72:rate=30:duration=11",
        "-f", "lavfi", "-i", "sine=frequency=2100:sample_rate=48000:duration=11",
        "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
    ff(["-f", "lavfi", "-i", "sine=frequency=430:sample_rate=48000:duration=12",
        "-c:a", "pcm_s16le", str(music)])
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    copies = []
    for index in range(4):
        path = root / f"source-{index}.mkv"
        path.write_bytes(source.read_bytes())
        copies.append(path)
    return [str(p) for p in copies], digest, str(music)


class ClockModelTests(unittest.TestCase):
    def test_render_clock_model_never_claims_1x_for_retimed_styles(self):
        rows = [{}] * 4
        for style in ("clean", "authored-footage"):
            model = render_clock_model(style, rows)
            self.assertEqual((model["schema"], model["kind"], model["retimed"]),
                             (CLOCK_MODEL_SCHEMA, "uniform-1x", False))
            assert_uniform_1x_clock(style, model)
        for style, kind in (("restrained-impact", "retimed-eased"),
                            ("multishot", "retimed-reviewed-map"),
                            ("multishot-authored", "retimed-reviewed-map")):
            model = render_clock_model(style, rows)
            self.assertEqual((model["kind"], model["retimed"]), (kind, True))
            with self.assertRaisesRegex(ValueError, "uniform 1x"):
                assert_uniform_1x_clock(style, model)

    def test_boundary_rejects_missing_style_marker_and_legacy_retimed_style(self):
        with self.assertRaisesRegex(ValueError, "uniform 1x"):
            assert_uniform_1x_clock("multishot-authored", None)
        with self.assertRaisesRegex(ValueError, "refuses"):
            assert_uniform_1x_clock("authored-footage", dict(render_clock_model("clean", []), kind="retimed-eased"))
        with self.assertRaisesRegex(ValueError, "refuses"):
            assert_uniform_1x_clock("authored-footage", {"schema": "something-else", "kind": "uniform-1x"})
        # Missing marker with a known 1x style stays valid for historical manifests.
        assert_uniform_1x_clock("authored-footage", None)
        assert_uniform_1x_clock("clean", None)

    def test_plan_clocks_compatible_only_with_matching_style(self):
        plan, maps = fixture()
        one_x = one_x_authored_plan(plan)
        one_x["clock_model"] = render_clock_model("authored-footage", [])
        validate_plan(one_x, RenderConfig(width=128, height=72, fps=30, style="authored-footage"))
        with self.assertRaisesRegex(ValueError, "incompatible"):
            validate_plan(one_x, RenderConfig(width=128, height=72, fps=30, style="restrained-impact"))
        combined = copy.deepcopy(plan)
        combined["clock_model"] = render_clock_model("multishot-authored", [])
        validate_plan(combined, RenderConfig(width=128, height=72, fps=30, style="multishot-authored"),
                      multishot_maps=maps)
        with self.assertRaisesRegex(ValueError, "incompatible"):
            validate_plan(combined, RenderConfig(width=128, height=72, fps=30, style="authored-footage"))
        bad = copy.deepcopy(plan)
        bad["clock_model"] = {"schema": "wrong", "kind": "uniform-1x"}
        with self.assertRaisesRegex(ValueError, "invalid clock_model"):
            validate_plan(bad, RenderConfig(width=128, height=72, fps=30, style="authored-footage"))

    def test_lyric_preflight_and_application_fail_closed_before_io(self):
        plan, _maps = fixture()
        combined = copy.deepcopy(plan)
        combined["clock_model"] = render_clock_model("multishot-authored", [])
        combined_config = RenderConfig(width=128, height=72, fps=30, style="multishot-authored")
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(LyricValidationError, "uniform 1x"):
                prepare_lyrics("missing-song.wav", combined, combined_config, tmp,
                               "missing-track.json")
            with self.assertRaisesRegex(LyricValidationError, "uniform 1x"):
                prepare_lyrics("missing-song.wav", plan, combined_config, tmp, "missing-track.json")
            # Honest 1x authored plan reaches the missing-input check instead.
            one_x = one_x_authored_plan(plan)
            with self.assertRaises(FileNotFoundError):
                prepare_lyrics("missing-song.wav", one_x,
                               RenderConfig(width=128, height=72, fps=30, style="authored-footage"),
                               tmp, "missing-track.json")
        for manifest in (dict(schema_version="encounter-render/v1", style="multishot-authored",
                              clock_model=render_clock_model("multishot-authored", [])),
                         dict(schema_version="encounter-render/v1", style="multishot")):
            with self.subTest(manifest=manifest):
                with self.assertRaisesRegex(LyricValidationError, "uniform 1x"):
                    apply_prepared_lyrics(manifest, None)
                with self.assertRaisesRegex(LyricValidationError, "uniform 1x"):
                    apply_verified_lyrics(manifest, "track.json", "music.wav")

    def test_front_door_cannot_select_retimed_or_combined_style(self):
        import edit
        for argv in (["render-encounters", "p.json", "--output-root", "out", "--style", "multishot-authored"],
                     ["render-encounters", "p.json", "--output-root", "out", "--style", "multishot"]):
            with self.subTest(argv=argv), self.assertRaises(SystemExit):
                edit.build_parser().parse_args(argv)
        for style in ("clean", "restrained-impact", "authored-footage"):
            args = edit.build_parser().parse_args(["render-encounters", "p.json", "--output-root", "out",
                                                   "--style", style])
            self.assertEqual(args.style, style)

    def test_rendered_manifests_persist_their_clock_model(self):
        with tempfile.TemporaryDirectory() as tmp:
            scratch = Path(tmp) / "media"
            sources, digest, music = render_synthetic_media(scratch)
            plan, maps = fixture(sources=sources, digest=digest, version="v2")
            combined = copy.deepcopy(plan)
            combined["clock_model"] = render_clock_model("multishot-authored", [])
            manifest = render_encounters(combined, music, Path(tmp) / "combined",
                                         config=RenderConfig(width=128, height=72, fps=30,
                                                             style="multishot-authored",
                                                             preset="ultrafast"),
                                         multishot_maps=maps)
            self.assertEqual(manifest["clock_model"]["kind"], "retimed-reviewed-map")
            self.assertTrue(manifest["clock_model"]["retimed"])
            with self.assertRaisesRegex(LyricValidationError, "uniform 1x"):
                apply_verified_lyrics(manifest, "track.json", music)
            # A supplied marker contradicting the requested style must not render.
            one_x = one_x_authored_plan(plan)
            one_x["clock_model"] = render_clock_model("authored-footage", [])
            with patch("aive.encounter_render.capture_media_identities") as capture:
                with self.assertRaisesRegex(ValueError, "clock_model"):
                    render_encounters(one_x, music, Path(tmp) / "mismatch",
                                      config=RenderConfig(width=128, height=72, fps=30,
                                                          style="restrained-impact"))
                capture.assert_not_called()


if __name__ == "__main__":
    unittest.main()
