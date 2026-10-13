"""Chunked renderer to avoid long command lines on Windows."""
from __future__ import annotations
import os, tempfile, shutil, subprocess
from . import graph as _graph
from .export import export_args
from .project import Project
from .shell import FFmpeg, require

class RenderResult:
    def __init__(self, path: str, filtergraph: str, args: list[str], duration: float = 0.0):
        self.path, self.filtergraph, self.args, self.duration = path, filtergraph, args, duration

def render_chunked(project: Project, out_path: str, *, encoder: str | None = None,
                   quality: int = 20, ass_path: str | None = None,
                   platform: str | None = None, log=None) -> RenderResult:
    plat = platform or project.platform
    src = _graph.probe_source(str(project.source_path))
    streams = _graph.probe_streams(str(project.source_path))
    has_music = bool(project.music)

    base_idx = 1 + (1 if has_music else 0)
    overlay_inputs: list[tuple[int, dict]] = []
    ov_args: list[str] = []
    for k, ov in enumerate(project.overlays or []):
        path = ov.get("path")
        if not path: continue
        ov_args += ["-stream_loop", "-1", "-i", str(path)]
        overlay_inputs.append((base_idx + k, ov))

    fg, joined = _graph.build(project, ass_path=ass_path, src=src,
                              has_music=has_music,
                              has_source_audio=("audio" in streams),
                              overlay_inputs=overlay_inputs or None)

    # write filtergraph to temp file
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".txt", encoding="utf-8") as f:
        f.write(fg)
        fgf = f.name

    args = ["-i", str(project.source_path)]
    if has_music:
        args += ["-stream_loop", "-1", "-i", str(project.music_path)]
    args += ov_args
    args += ["-filter_complex", open(fgf,"r",encoding="utf-8").read(), "-map", "[vfinal]"]
    if "audio" in streams or has_music:
        args += ["-map", "[afinal]"]
    args += export_args(plat, encoder=encoder, quality=quality)
    args += [out_path]

    if log: log.debug("filtergraph written to %s", fgf)
    try:
        FFmpeg().run(args)
    finally:
        try: os.remove(fgf)
        except: pass

    project.computed_duration = joined
    return RenderResult(path=out_path, filtergraph=fg, args=args, duration=joined)
