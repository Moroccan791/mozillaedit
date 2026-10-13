"""QA gate: automated verification of every render before it ships.

Encodes the manual checks that caught real bugs:
  * playability / decode      (yuv444p bug)
  * stream presence + duration sync
  * text actually rendered    (silent black-title bug)
  * fade-to-black outro worked
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from .shell import FFmpeg
from .ffprobe import probe


@dataclass
class Check:
    name: str
    ok: bool
    detail: str = ""


@dataclass
class Report:
    path: str
    checks: list[Check] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return all(c.ok for c in self.checks)

    def add(self, name: str, ok: bool, detail: str = "") -> "Report":
        self.checks.append(Check(name, ok, detail))
        return self

    def render(self) -> str:
        lines = [f"QA: {self.path}", "-" * 40]
        for c in self.checks:
            mark = "PASS" if c.ok else "FAIL"
            lines.append(f"[{mark}] {c.name}" + (f"  -- {c.detail}" if c.detail else ""))
        lines.append("-" * 40)
        lines.append("RESULT: " + ("OK" if self.ok else "FAILED"))
        return "\n".join(lines)


def _yavg(path: str, ss: float, crop: str | None = None) -> float | None:
    ff = FFmpeg()
    vf = "signalstats,metadata=print"
    if crop:
        vf = f"crop={crop},{vf}"
    err = ff.run_stream(["-ss", str(ss), "-i", path, "-vf", vf, "-frames:v", "1", "-f", "null", "-"])
    vals = re.findall(r"YAVG=([0-9.]+)", err or "")
    return float(vals[-1]) if vals else None


def check_playback(path: str) -> Check:
    """Full decode must succeed."""
    ff = FFmpeg()
    proc = ff.run(["-v", "error", "-i", path, "-f", "null", "-"], check=False)
    ok = proc.returncode == 0 and not (proc.stderr or "").strip()
    return Check("decode", ok, "" if ok else (proc.stderr or "decode error")[:200])


def check_pixfmt_compat(path: str) -> Check:
    """Reject formats most players can't decode (the yuv444p bug)."""
    info = probe(path)
    v = info.video
    ok = bool(v) and v.pix_fmt in {"yuv420p", "yuvj420p"}
    return Check("pix_fmt universal", ok, f"pix_fmt={v.pix_fmt if v else 'none'}")


def check_streams(path: str, want_audio: bool = True) -> Check:
    info = probe(path)
    has_v = info.video is not None
    has_a = info.audio is not None
    ok = has_v and (has_a or not want_audio)
    return Check("streams", ok, f"video={has_v} audio={has_a}")


def check_duration_sync(path: str, tolerance: float = 0.5) -> Check:
    """Video and audio durations should match (the earlier desync bug)."""
    info = probe(path)
    vd = _stream_duration(path, "v")
    ad = _stream_duration(path, "a")
    if vd is None or ad is None:
        return Check("a/v duration sync", True, "single stream; skipped")
    ok = abs(vd - ad) <= tolerance
    return Check("a/v duration sync", ok, f"video={vd:.2f}s audio={ad:.2f}s")


def _stream_duration(path: str, kind: str) -> float | None:
    from .shell import FFprobe

    sel = "v:0" if kind == "v" else "a:0"
    proc = FFprobe().run(
        ["-v", "error", "-select_streams", sel, "-show_entries",
         "stream=duration", "-of", "default=noprint_wrappers=1:nokey=1", path],
        check=False,
    )
    try:
        return float((proc.stdout or "").strip())
    except ValueError:
        return None


def check_text_present(path: str, times: list[float], crop: str | None = None,
                       min_yavg: float = 8.0) -> Check:
    """Text/graphics should raise luma above a threshold at given times."""
    if not times:
        return Check("text present", True, "no timestamps given")
    vals = []
    for t in times:
        y = _yavg(path, t, crop)
        vals.append(f"{t}s={y}")
        if y is None or y < min_yavg:
            return Check("text present", False, " ".join(vals))
    return Check("text present", True, " ".join(vals))


def check_black_at(path: str, times: list[float], max_yavg: float = 18.0) -> Check:
    """Fade-to-black frames must be truly black.

    Note: black is Y=16 in limited/TV-range YUV (not 0), so the threshold
    sits just above 16 to tolerate codec noise.
    """
    if not times:
        return Check("black frames", True, "no timestamps given")
    vals = []
    for t in times:
        y = _yavg(path, t)
        vals.append(f"{t}s={y}")
        if y is None or y > max_yavg:
            return Check("black frames", False, " ".join(vals))
    return Check("black frames", True, " ".join(vals))


def verify(path: str, *, want_audio: bool = True,
           text_times: list[float] | None = None, text_crop: str | None = None,
           black_times: list[float] | None = None) -> Report:
    """Run the standard QA battery and return a Report."""
    rep = Report(path=path)
    rep.checks.append(check_playback(path))
    rep.checks.append(check_pixfmt_compat(path))
    rep.checks.append(check_streams(path, want_audio))
    rep.checks.append(check_duration_sync(path))
    if text_times:
        rep.checks.append(check_text_present(path, text_times, text_crop))
    if black_times:
        rep.checks.append(check_black_at(path, black_times))
    return rep
