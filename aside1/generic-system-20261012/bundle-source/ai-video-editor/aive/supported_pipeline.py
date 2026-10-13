"""Locked project front door. Reuses existing runners; no alternate renderer.

Candidate output is a diagnostic, never a finished/synced montage. This policy
is enforced by the supported CLI, not an OS sandbox around FFmpeg.
"""
from __future__ import annotations
import json
from pathlib import Path
from .daily_runner import _write

PIPELINE_ID = "existing-authored-system/v1"


def enforce_cli_policy(args):
    """Block historical render shortcuts without deleting research tools."""
    command = args.cmd
    if command == "run" or (command in {"plan", "montage"} and getattr(args, "render", False)):
        raise ValueError("Existing-system-only policy: legacy export shortcuts are disabled. Use studio; no trim+music fallback.")
    if command == "render-encounters" and args.style != "authored-footage":
        raise ValueError("Existing-system-only policy: direct clean/restrained export is diagnostic-only and disabled here. Use studio or explicit authored-footage diagnostic.")
    if command == "job" and args.style != "authored-footage":
        raise ValueError("Existing-system-only policy: job must explicitly use authored-footage + authored design. Use studio for supported operation.")
    if command == "auto-preview" and args.no_visual_screen:
        raise ValueError("Existing-system-only policy: visual screening cannot be disabled from the supported CLI.")


def run_supported(*, music, clips, output_root, candidate_preview=False, events=(),
                  authored_design=None, closure_review=None, music_start=25., duration=10.,
                  encoder="libx264", width=1280, height=720, fps=60, max_clips=4,
                  max_source_seconds=600., plan_only=False, lyric_track=None,
                  lyric_design=None, exclusions=None):
    if type(candidate_preview) is not bool:
        raise ValueError("candidate_preview must be explicit boolean")
    if candidate_preview == bool(events):
        raise ValueError("choose explicit candidate-preview OR confirmed event files")
    if candidate_preview and (authored_design or closure_review):
        raise ValueError("candidate-preview cannot consume reviewed design/closure assertions")
    if not candidate_preview and not authored_design:
        raise ValueError("reviewed authored workflow requires explicit authored design")
    if not candidate_preview and exclusions:
        raise ValueError("visual exclusions belong to candidate screening, not confirmed-event jobs")
    if not candidate_preview and (width, height, fps) != (1280, 720, 60):
        raise ValueError("reviewed runner currently uses 1280x720/60; custom canvas is supported only for candidate diagnostics")
    if candidate_preview:
        from .automation_runner import AutomationConfig, run_automation
        result = run_automation(AutomationConfig(song=music, clip_folder=clips,
            output_root=output_root, music_start=music_start, duration=duration,
            encoder=encoder, width=width, height=height, fps=fps, max_clips=max_clips,
            max_source_seconds=max_source_seconds, plan_only=plan_only,
            lyric_track=lyric_track, lyric_design=lyric_design, visual_screen=True,
            exclusions_file=exclusions))
        runner = "aive.automation_runner.run_automation"
    else:
        from .daily_runner import JobConfig, run_job
        result = run_job(JobConfig(song=music, clip_folder=clips, output_root=output_root,
            event_files=tuple(events), style="authored-footage", authored_design=authored_design,
            closure_review=closure_review, duration=duration, music_start=music_start,
            encoder=encoder, max_clips=max_clips, plan_only=plan_only,
            lyric_track=lyric_track, lyric_design=lyric_design))
        runner = "aive.daily_runner.run_job"
    evidence = dict(schema_version="supported-pipeline/v1", pipeline=PIPELINE_ID,
        runner=runner, candidate_preview=candidate_preview, fallback_allowed=False,
        requested_style="authored-footage", finished_montage=False,
        perceptual_approval=False, status=result["status"], output=result.get("output"))
    if result.get("output") and result["status"] not in {"rendered", "rendered-with-warnings", "rendered-candidate-preview"}:
        result = dict(result, output=None, diagnostic_output=result["output"])
        evidence["output"] = None
    if result.get("output"):
        # Independently check persisted renderer evidence before exposing output.
        try:
            manifest_path = Path(result["render_manifest"]).resolve()
            job_path = Path(result["job_dir"]).resolve()
            if job_path not in manifest_path.parents or job_path not in Path(result["output"]).resolve().parents:
                raise ValueError("renderer evidence/output must belong to the versioned job")
            if manifest_path.stat().st_size > 16*1024*1024:
                raise ValueError("renderer manifest exceeds evidence bound")
            manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
            if (manifest.get("schema_version") != "encounter-render/v1"
                    or manifest.get("style") != "authored-footage"
                    or manifest.get("config", {}).get("style") != "authored-footage"
                    or not manifest.get("authored_design")):
                raise ValueError("missing actual authored-renderer evidence; no clean downgrade permitted")
            if Path(manifest["output"]).resolve() != Path(result["output"]).resolve():
                raise ValueError("reported output does not match persisted renderer manifest")
            if not Path(result["output"]).is_file():
                raise ValueError("reported output is missing")
            evidence["verified_renderer_manifest"] = str(manifest_path)
            evidence["renderer_style_verified"] = True
        except (OSError, KeyError, TypeError, ValueError) as exc:
            evidence.update(status="blocked-provenance", output=None, error=str(exc))
            result = dict(result, status="blocked-provenance", output=None,
                          blocked_reason=str(exc), diagnostic_output=result.get("output"))
    result["supported_pipeline"] = evidence
    _write(Path(result["job_dir"])/"supported-pipeline.json", evidence)
    return result
