"""Render engine: compose a filtergraph (see graph.py) and run FFmpeg.

Handles the hard-won details automatically:
  * trims/concat or xfade-joins segments, with matched audio
  * per-segment speed + motion, grade look, aspect reframe
  * bakes captions via ASS (libass) when present
  * fades in/out + optional black end card
  * forces yuv420p + faststart so the file plays everywhere
"""
from __future__ import annotations

from dataclasses import dataclass

from . import graph as _graph
from .export import export_args
from .project import Project
from .shell import FFmpeg


@dataclass
class RenderResult:
    path: str
    filtergraph: str
    args: list[str]
    duration: float = 0.0


def render(project: Project, out_path: str, *, encoder: str | None = None,
           quality: int = 20, ass_path: str | None = None,
           platform: str | None = None, log=None) -> RenderResult:
    """Render the project to out_path and return the graph + args used."""
    plat = platform or project.platform
    src = _graph.probe_source(str(project.source_path))
    streams = _graph.probe_streams(str(project.source_path))
    has_music = bool(project.music)

    # overlay inputs are appended after source (and music) inputs
    base_idx = 1 + (1 if has_music else 0)
    overlay_inputs: list[tuple[int, dict]] = []
    ov_args: list[str] = []
    for k, ov in enumerate(project.overlays or []):
        path = ov.get("path")
        if not path:
            continue
        ov_args += ["-stream_loop", "-1", "-i", str(path)]
        overlay_inputs.append((base_idx + k, ov))

    fg, joined = _graph.build(
        project, ass_path=ass_path, src=src,
        has_music=has_music, has_source_audio=("audio" in streams),
        overlay_inputs=overlay_inputs or None,
    )

    args = ["-i", str(project.source_path)]
    if has_music:
        args += ["-stream_loop", "-1", "-i", str(project.music_path)]
    args += ov_args
    args += ["-filter_complex", fg, "-map", "[vfinal]"]
    if "audio" in streams or has_music:
        args += ["-map", "[afinal]"]
    args += export_args(plat, encoder=encoder, quality=quality)
    args += [out_path]

    if log:
        log.debug("filtergraph:\n%s", fg)
    FFmpeg().run(args)
    project.computed_duration = joined
    return RenderResult(path=out_path, filtergraph=fg, args=args, duration=joined)
