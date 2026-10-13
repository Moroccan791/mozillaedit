"""Bounded synthetic renderer content-binding regressions, not semantic approval.

All media is generated locally in temporary directories. Real rendering proves
export/provenance integrity only, not gameplay, synchronization or aesthetics.
"""
import copy
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from aive.encounter_render import RenderConfig, RenderError, render_encounters
from aive.media_identity import MediaIdentityError, capture_media_identities


def short_plan(source):
    return dict(schema_version="encounters/v1", duration=.4, requested_duration=.4,
                music_start=.1, music_end=.5, music_continuous=True, gaps=[],
                timeline=[dict(source=str(source), source_start=.2, source_end=.6,
                               output_start=0., output_end=.4, music_start=.1,
                               music_end=.5, speed=1., events=[])])


class InitialMediaIdentityTests(unittest.TestCase):
    def test_initial_identity_failure_creates_no_versioned_directory(self):
        # Existing local but empty input reaches the actual identity preflight;
        # no decoder, mock media probe, or FFmpeg installation is required.
        for empty_kind in ("source", "music"):
            with self.subTest(empty_kind=empty_kind), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                source, music, jobs = root / "source.mkv", root / "music.wav", root / "jobs"
                source.write_bytes(b"source placeholder" if empty_kind != "source" else b"")
                music.write_bytes(b"music placeholder" if empty_kind != "music" else b"")
                before = {p: p.read_bytes() for p in (source, music)}
                with patch("aive.encounter_render.capture_media_identities",
                           wraps=capture_media_identities) as capture, \
                     patch("aive.encounter_render._new_job") as new_job, \
                     patch("aive.encounter_render.subprocess.run") as run:
                    with self.assertRaisesRegex(MediaIdentityError, "empty"):
                        render_encounters(short_plan(source), music, jobs)
                capture.assert_called_once()
                new_job.assert_not_called()
                run.assert_not_called()
                self.assertFalse(jobs.exists())
                self.assertEqual(list(root.glob("**/encounters-v*")), [])
                self.assertEqual(list(root.glob("**/render-manifest.json")), [])
                self.assertEqual(before, {p: p.read_bytes() for p in before})


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"),
                     "local FFmpeg and ffprobe required; no downloads")
class RenderMediaIdentityFFmpegTests(unittest.TestCase):
    def ff(self, args):
        proc = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin"] + args,
                              capture_output=True, timeout=40)
        self.assertEqual(proc.returncode, 0, proc.stderr.decode(errors="replace"))
        return proc.stdout

    def fixture(self, root):
        source, music = root / "source.mkv", root / "music.wav"
        self.ff(["-f", "lavfi", "-i", "color=c=red:s=64x36:r=10:d=1",
                 "-f", "lavfi", "-i", "sine=frequency=400:sample_rate=48000:duration=1",
                 "-map", "0:v:0", "-map", "1:a:0", "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
        self.ff(["-f", "lavfi", "-i", "sine=frequency=123:sample_rate=48000:duration=1",
                 "-c:a", "pcm_s16le", str(music)])
        return source, music

    def config(self):
        return RenderConfig(width=64, height=36, fps=10, preset="ultrafast", timeout=40,
                            max_duration=1, max_clip_duration=1, max_source_duration=2)

    def test_real_render_persists_actual_identities_and_preserves_originals(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source, music = self.fixture(root)
            before = {p: p.read_bytes() for p in (source, music)}
            plan = short_plan(source)
            with patch("aive.encounter_render.capture_media_identities",
                       wraps=capture_media_identities) as capture:
                result = render_encounters(plan, music, root / "jobs", config=self.config())
            self.assertEqual(capture.call_count, 2)
            for call in capture.call_args_list:
                self.assertEqual(call.args[0], [str(source.resolve()), str(music.resolve())])
            saved = json.loads(Path(result["manifest_path"]).read_text(encoding="utf-8"))
            self.assertEqual(saved, result)
            expected = {str(p.resolve()): dict(schema="file-content/v1",
                        sha256=hashlib.sha256(data).hexdigest(), size_bytes=len(data))
                        for p, data in before.items()}
            self.assertEqual(saved["media_content_identities"], expected)
            self.assertEqual(saved["media_identity_binding"]["status"], "checked_before_after")
            self.assertIn("Not semantic authentication", saved["media_identity_binding"]["limitations"])
            self.assertTrue(any("Not unattended-ready" in w for w in saved["warnings"]))
            self.assertEqual(saved["chunks"][0]["events"], [])
            persisted = json.loads(Path(result["job_dir"], "plan.json").read_text(encoding="utf-8"))
            self.assertEqual(persisted, dict(plan, clock_model=result["clock_model"]))
            self.assertEqual(persisted["clock_model"]["kind"], "uniform-1x")
            self.assertEqual(saved["frame_count"], 4)
            self.assertEqual(saved["sample_count"], 19200)
            self.ff(["-i", result["output"], "-f", "null", "-"])
            self.assertEqual(before, {p: p.read_bytes() for p in before})

    def assert_changed_identity_fails_closed(self, changed_kind):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source, music = self.fixture(root)
            before = {p: p.read_bytes() for p in (source, music)}
            jobs = root / "jobs"
            # Preserve a historical job while the new real render fails at its
            # final capture. Alter only the returned identity, not fixture bytes.
            historical = jobs / "encounters-v0001"
            historical.mkdir(parents=True)
            old_manifest = historical / "render-manifest.json"
            old_output = historical / "encounters.mp4"
            old_manifest.write_bytes(b"historical manifest sentinel")
            old_output.write_bytes(b"historical output sentinel")
            old_bytes = {p: p.read_bytes() for p in (old_manifest, old_output)}
            captures = []
            changed = source if changed_kind == "source" else music

            def capture_then_change(paths, **kwargs):
                identities = capture_media_identities(paths, **kwargs)
                captures.append(copy.deepcopy(identities))
                if len(captures) == 2:
                    key = str(changed.resolve())
                    actual = identities[key]["sha256"]
                    identities[key]["sha256"] = ("0" if actual[0] != "0" else "1") + actual[1:]
                return identities

            with patch("aive.encounter_render.capture_media_identities",
                       side_effect=capture_then_change) as capture:
                with self.assertRaisesRegex(RenderError, "source/music content changed"):
                    render_encounters(short_plan(source), music, jobs, config=self.config())
            self.assertEqual(capture.call_count, 2)
            self.assertEqual(captures[0], captures[1])  # The actual originals did not change.
            new_jobs = [p for p in jobs.iterdir() if p != historical]
            self.assertEqual(len(new_jobs), 1)
            failed_job = new_jobs[0]
            self.assertTrue((failed_job / "encounters.mp4").is_file())
            self.assertTrue((failed_job / "probe-output.status.json").is_file())
            self.assertEqual(json.loads((failed_job / "probe-output.status.json").read_text())["returncode"], 0)
            self.assertFalse((failed_job / "render-manifest.json").exists())
            self.assertEqual(list(jobs.glob("**/render-manifest.json")), [old_manifest])
            self.assertEqual(old_bytes, {p: p.read_bytes() for p in old_bytes})
            self.assertEqual(before, {p: p.read_bytes() for p in before})

    def test_source_changed_on_second_capture_does_not_save_completed_manifest(self):
        self.assert_changed_identity_fails_closed("source")

    def test_music_changed_on_second_capture_does_not_save_completed_manifest(self):
        self.assert_changed_identity_fails_closed("music")


if __name__ == "__main__":
    unittest.main()
