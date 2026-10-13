import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import edit
from aive.supported_pipeline import run_supported, enforce_cli_policy


class SupportedPipelineTests(unittest.TestCase):
    def test_legacy_export_and_clean_downgrade_blocked(self):
        for argv in (["run","old.json"], ["plan","a.mp4","--music","a.wav","--render"],
                     ["montage","a.mp4","--music","a.wav","--render"],
                     ["render-encounters","p.json","--output-root","out"],
                     ["job","--music","a","--clips","b","--output-root","c","--events","d","--style","clean"],
                     ["auto-preview","--music","a","--clips","b","--output-root","c","--no-visual-screen"]):
            args=edit.build_parser().parse_args(argv)
            with self.subTest(argv=argv), self.assertRaisesRegex(ValueError,"Existing-system-only"):
                enforce_cli_policy(args)

    def test_analysis_and_explicit_authored_diagnostic_retained(self):
        for argv in (["doctor"], ["plan","a.mp4","--music","a.wav"],
                     ["render-encounters","p.json","--output-root","out","--style","authored-footage"]):
            enforce_cli_policy(edit.build_parser().parse_args(argv))

    def test_cli_supported_choices_explicit(self):
        args=edit.build_parser().parse_args(["studio","--music","a","--clips","b","--output-root","c","--candidate-preview"])
        self.assertTrue(args.candidate_preview)
        self.assertEqual(args.duration,10)

    def test_candidate_uses_existing_runner_screened_without_fallback(self):
        with tempfile.TemporaryDirectory() as tmp:
            output=Path(tmp,"preview.mp4"); output.write_bytes(b"preview")
            manifest=Path(tmp,"render-manifest.json")
            manifest.write_text(json.dumps(dict(schema_version="encounter-render/v1",style="authored-footage",
                config=dict(style="authored-footage"),authored_design=dict(schema_version="authored-footage/v1"),output=str(output))))
            result=dict(status="rendered-candidate-preview",job_dir=tmp,output=str(output),render_manifest=str(manifest))
            with patch("aive.automation_runner.run_automation",return_value=result) as runner:
                got=run_supported(music="song",clips="clips",output_root=tmp,candidate_preview=True)
                self.assertTrue(runner.call_args.args[0].visual_screen)
            self.assertFalse(got["supported_pipeline"]["fallback_allowed"])
            self.assertFalse(got["supported_pipeline"]["finished_montage"])
            self.assertTrue(got["supported_pipeline"]["renderer_style_verified"])

    def test_clean_manifest_cannot_be_delivered(self):
        with tempfile.TemporaryDirectory() as tmp:
            output=Path(tmp,"plain.mp4");output.write_bytes(b"plain")
            manifest=Path(tmp,"render-manifest.json")
            manifest.write_text(json.dumps(dict(schema_version="encounter-render/v1",style="clean",config=dict(style="clean"),output=str(output))))
            with patch("aive.automation_runner.run_automation",return_value=dict(status="rendered-candidate-preview",job_dir=tmp,output=str(output),render_manifest=str(manifest))):
                got=run_supported(music="song",clips="clips",output_root=tmp,candidate_preview=True)
            self.assertEqual(got["status"],"blocked-provenance")
            self.assertIsNone(got["output"])
            self.assertTrue(output.is_file())

    def test_no_events_or_mixed_modes_rejected(self):
        for kwargs in ({},dict(candidate_preview=True,events=("events",)),dict(events=("events",)),dict(candidate_preview=True,closure_review="review")):
            with self.subTest(kwargs=kwargs),self.assertRaises(ValueError):
                run_supported(music="song",clips="clips",output_root="out",**kwargs)

    def test_blocked_existing_runner_stays_blocked_no_render(self):
        with tempfile.TemporaryDirectory() as tmp:
            with patch("aive.automation_runner.run_automation",return_value=dict(status="blocked",job_dir=tmp,output=None)),patch("aive.encounter_render.render_encounters") as render:
                got=run_supported(music="song",clips="clips",output_root=tmp,candidate_preview=True)
            render.assert_not_called()
            self.assertEqual(got["status"],"blocked")


if __name__=="__main__": unittest.main()
