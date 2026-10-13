"""Filtergraph composer: turn a Project into an FFmpeg -filter_complex string.

The "overedit" vocabulary for reels / gaming montages / music reels:

  * per-segment speed (setpts) and motion (zoompan punch / Ken Burns / shake)
  * transition chains between segments (xfade + matched audio acrossfade)
  * aspect reframe to 9:16 / 1:1 (blurred-background pad or center crop)
  * grade, fades, end-card hold, ASS captions
  * audio modes: source-only / music-only / ducked mix

Inputs are normalised (fps, SAR, pixel format) before joining so xfade/concat
behave. ``build`` returns (filtergraph, joined_duration).
"""
from __future__ import annotations

import subprocess
from dataclasses import dataclass

from . import grade as _grade
from .project import Project, Segment

ASPECTS: dict[str, tuple[int, int]] = {
    "16:9": (1920, 1080),
    "9:16": (1080, 1920),
    "1:1": (1080, 1080),
}

TRANSITIONS: dict[str, str] = {
    "fade": "fade", "dissolve": "dissolve", "fadeblack": "fadeblack",
    "fadewhite": "fadewhite", "zoom": "zoomin", "zoom-blur": "hblur",
    "whip-left": "smoothleft", "whip-right": "smoothright",
    "whip-up": "smoothup", "whip-down": "smoothdown",
    "slide-left": "slideleft", "slide-right": "slideright",
    "glitch": "pixelize", "circle": "circleopen", "radial": "radial",
    "wipe-left": "wipeleft", "luma": "fadeblack",
}

VIBE_DEFAULTS: dict[str, dict] = {
    "gaming": {"type": "glitch", "duration": 0.12},
    "music-reel": {"type": "zoom-blur", "duration": 0.22},
    "punch": {"type": "zoom", "duration": 0.18},
    "clean": {},
}


@dataclass
class SourceInfo:
    width: int = 1920
    height: int = 1080
    fps: float = 30.0


def probe_source(path: str) -> SourceInfo:
    cmd = ["ffprobe", "-v", "error", "-select_streams", "v:0",
           "-show_entries", "stream=width,height,r_frame_rate",
           "-of", "csv=p=0:s=,", str(path)]
    try:
        out = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                             text=True, timeout=30).stdout.strip()
        w, h, fr = (out.split(",") + ["", "", ""])[:3]
        num, _, den = fr.partition("/")
        fps = (float(num) / float(den)) if den and float(den) else 30.0
        return SourceInfo(int(w) or 1920, int(h) or 1080, fps or 30.0)
    except Exception:
        return SourceInfo()


def probe_streams(path: str) -> set[str]:
    """Return the set of codec_type values present in a media file."""
    cmd = ["ffprobe", "-v", "error", "-show_entries", "stream=codec_type",
           "-of", "csv=p=0", str(path)]
    try:
        out = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                             text=True, timeout=30).stdout
        return {ln.strip() for ln in out.splitlines() if ln.strip()}
    except Exception:
        return {"video", "audio"}


def prepare(project: Project) -> None:
    """Apply vibe-driven defaults in-place (idempotent)."""
    if not project.transition:
        project.transition = dict(VIBE_DEFAULTS.get((project.vibe or "clean").lower(), {}))


def transition_at(project: Project, i: int) -> tuple[str, float] | None:
    """Transition entering segment i (0-based); None means hard cut."""
    if i == 0:
        return None
    trans = project.transition or {}
    ttype = project.segments[i].transition or trans.get("type")
    if not ttype or ttype.lower() in ("cut", "none"):
        return None
    dur = float(trans.get("duration", 0.2))
    return ttype, dur


def timeline_duration(project: Project) -> float:
    """Joined length after subtracting transition overlaps."""
    prepare(project)
    acc = project.total_duration
    for i in range(1, len(project.segments)):
        t = transition_at(project, i)
        if t:
            acc -= t[1]
    return max(0.0, acc)


def _ramp_slices(seg: Segment) -> list[tuple[float, float, float]]:
    """Split a clip into (src_start, src_end, speed) slices.

    The grid ramp is *length-preserving*: a normal-speed onset hold, then a
    sped-up mid at speed ``a``, then a slow-mo tail at ``ramp_speed`` — chosen so
    output length == source length (slot length is never changed).
    """
    d = seg.duration
    hold = max(0.0, min(seg.ramp_hold or 0.0, d))
    r = seg.ramp_in or 0.0
    k = seg.ramp_speed or 1.0
    P = d - hold
    if r > 0.0 and 0.0 < k < 1.0 and P > 0.0:
        r = min(r, P * 0.9)
        denom = P - r / k
        if denom > 1e-3:
            a = (P - r) / denom
            if a >= 1.0:
                o1 = seg.start + hold
                o2 = seg.end - r
                out: list[tuple[float, float, float]] = []
                if hold > 1e-4:
                    out.append((seg.start, o1, 1.0))
                out.append((o1, o2, a))
                out.append((o2, seg.end, k))
                return out
    return [(seg.start, seg.end, seg.speed or 1.0)]


def _bloom_filter(seg: Segment, fps: int, w: int, h: int) -> str:
    """3-frame zoom-blur ramp + brightness bloom peaking on the cut frame."""
    if not seg.flash:
        return ""
    return (
        f"zoompan=z='if(lte(on,3),1.06-0.02*on,1)':"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={w}x{h}:fps={fps},"
        f"boxblur=luma_radius=5:enable='lt(n,3)',"
        f"eq=brightness='0.16*max(0,1-n/3)':"
        f"saturation='1+0.08*max(0,1-n/3)'")


def _atempo(speed: float) -> str:
    """Build an atempo chain for any speed factor (0.5..100 per stage)."""
    s = max(0.01, float(speed))
    chain: list[str] = []
    while s < 0.5:
        chain.append("atempo=0.5")
        s /= 0.5
    while s > 2.0:
        chain.append("atempo=2.0")
        s /= 2.0
    chain.append(f"atempo={s:.4f}")
    return ",".join(chain)


def _shake_filter(w: int, h: int) -> str:
    ax, ay = max(2, w // 90), max(2, h // 90)
    return (f"crop={w}:{h}:'(iw-{w})/2+{ax}*sin(n*2.1)'"
            f":'(ih-{h})/2+{ay}*cos(n*2.7)'")


def _zoompan(seg: Segment, dur: float, fps: int, w: int, h: int) -> str:
    m = (seg.motion or "none").lower()
    if m not in ("zoom-in", "zoom-out", "punch") or dur <= 0:
        return ""
    z = max(1.0, float(seg.zoom or 1.15))
    n = max(1.0, dur * fps)
    cx = "x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
    if m == "zoom-in":
        zx = f"min(1+({z}-1)*on/{n},{z})"
    elif m == "zoom-out":
        zx = f"max({z}-({z}-1)*on/{n},1)"
    else:  # punch: hit z fast then settle to 1.0
        zx = f"if(lte(on,{n}*0.12),1+({z}-1)*(1-on/({n}*0.12)),1)"
    return f"zoompan=z='{zx}':{cx}:d=1:s={w}x{h}:fps={fps}"


def _clip(seg: Segment, i: int, fps: int, w: int, h: int) -> str:
    look = _grade.apply(seg.grade) if seg.grade else ""
    norm = f"fps={fps},setsar=1,format=yuv420p"
    if look:
        norm += f",{look}"

    lead = ""          # filter statements that must run before the chain body
    body = ""          # chain expression ending without an output label
    slices = _ramp_slices(seg)
    if len(slices) == 1:
        t0, t1, spd = slices[0]
        sp = (f"setpts=(PTS-STARTPTS)/{spd:.6f}" if spd != 1.0
              else "setpts=PTS-STARTPTS")
        if spd == 1.0:
            # Preserve fractional source-trim phase. STARTPTS otherwise resets
            # to the next decoded source frame, and separately concatenated
            # video clips can lose a frame at every cut while audio stays exact.
            sp = f"setpts=PTS-{t0:.6f}/TB"
            precise_norm = norm.replace(f"fps={fps}", f"fps={fps}:start_time=0", 1)
            body = (f"[0:v]trim=start={t0:.6f}:end={t1:.6f},{sp},{precise_norm},"
                    f"tpad=stop_mode=clone:stop_duration={2/fps:.6f},"
                    f"trim=duration={seg.out_duration:.6f},setpts=PTS-STARTPTS")
        else:
            body = f"[0:v]trim=start={t0:.4f}:end={t1:.4f},{sp},{norm}"
    else:
        labels = ""
        for j, (t0, t1, spd) in enumerate(slices):
            sp = (f"setpts=(PTS-STARTPTS)/{spd:.6f}" if spd != 1.0
                  else "setpts=PTS-STARTPTS")
            lead += f"[0:v]trim=start={t0:.4f}:end={t1:.4f},{sp},{norm}[vs{i}_{j}];"
            labels += f"[vs{i}_{j}]"
        body = f"{labels}concat=n={len(slices)}:v=1:a=0"

    # bloom + zoom-blur ramp on the cut frame (peaks at n=0, eases over 3 frames)
    bloom = _bloom_filter(seg, fps, w, h)
    if bloom:
        body += f",{bloom}"

    # motion effects
    if (seg.motion or "none").lower() == "shake":
        return f"{lead}{body},{_shake_filter(w, h)}[v{i}]"
    zp = _zoompan(seg, seg.out_duration, fps, w, h)
    if zp:
        body += f",{zp}"
    return f"{lead}{body}[v{i}]"


def _video(project: Project, fps: int, w: int, h: int,
           parts: list[str]) -> tuple[str, float]:
    segs = project.segments
    n = len(segs)
    if n == 0:
        parts.append("[0:v]null[vjoin]")
        return "[vjoin]", 0.0
    if n == 1:
        s = segs[0]
        parts.append(_clip(s, 0, fps, w, h))
        return "[v0]", s.out_duration

    for i, seg in enumerate(segs):
        parts.append(_clip(seg, i, fps, w, h))

    use_xfade = any(transition_at(project, i) for i in range(1, n))
    if not use_xfade:
        labels = "".join(f"[v{i}]" for i in range(n))
        parts.append(f"{labels}concat=n={n}:v=1:a=0[vjoin]")
        return "[vjoin]", project.total_duration

    label, acc, cur = "[v0]", segs[0].out_duration, 0
    for i in range(1, n):
        t = transition_at(project, i)
        name = TRANSITIONS.get(t[0], "fade") if t else "fade"
        tdur = min(t[1], segs[i - 1].out_duration / 2, segs[i].out_duration / 2) if t else 0.0
        tdur = max(0.04, tdur)
        off = max(0.0, acc - tdur)
        out = f"vx{i}"
        parts.append(f"{label}[v{i}]xfade=transition={name}:duration={tdur:.3f}"
                     f":offset={off:.3f}[{out}]")
        acc = acc + segs[i].out_duration - tdur
        label = f"[{out}]"
    return label, acc


def _sfx(project: Project, base_label: str, parts: list[str]) -> str:
    """Mix synthesised impact thumps at drop (or first N) cut points."""
    drops = [i for i, s in enumerate(project.segments) if (s.label or "").lower() == "drop"]
    idxs = drops[:8] if drops else list(range(min(6, len(project.segments))))
    if not idxs:
        return base_label
    times, acc = [], 0.0
    for i, seg in enumerate(project.segments):
        if i > 0:
            t = transition_at(project, i)
            if t:
                acc -= max(0.04, min(t[1], project.segments[i - 1].out_duration / 2,
                                     seg.out_duration / 2))
        times.append(max(0.0, acc))
        acc += seg.out_duration
    labels = [base_label]
    for k, i in enumerate(idxs):
        ms = max(1, int(times[i] * 1000))
        parts.append(
            "aevalsrc='0.6*sin(2*PI*70*t)*exp(-9*t)':d=0.5:s=48000:c=mono,"
            f"volume={float(project.sfx_gain_db)}dB,adelay={ms}[sfx{k}]")
        labels.append(f"[sfx{k}]")
    parts.append(f"{''.join(labels)}amix=inputs={len(labels)}"
                 ":duration=first:normalize=0[abase_sfx]")
    return "[abase_sfx]"


def _audio(project: Project, parts: list[str], has_music: bool) -> str:
    segs = project.segments
    mode = (project.audio_mode or "mix").lower()
    fade_out = 0.0
    hold = 0.0
    if project.outro.get("enabled"):
        hold = float(project.outro.get("hold", 6.0))
        fade_out = float(project.outro.get("fade", 1.2))

    # ---- source audio, trimmed/per-seg + joined (concat or acrossfade) ------
    if segs:
        for i, seg in enumerate(segs):
            slices = _ramp_slices(seg)
            if len(slices) == 1:
                t0, t1, spd = slices[0]
                s = (f"[0:a]atrim=start={t0:.4f}:end={t1:.4f},"
                     f"asetpts=PTS-STARTPTS")
                if spd != 1.0:
                    s += f",{_atempo(spd)}"
                parts.append(f"{s}[a{i}]")
            else:
                labels = ""
                for j, (t0, t1, spd) in enumerate(slices):
                    s = (f"[0:a]atrim=start={t0:.4f}:end={t1:.4f},"
                         f"asetpts=PTS-STARTPTS")
                    if spd != 1.0:
                        s += f",{_atempo(spd)}"
                    parts.append(f"{s}[as{i}_{j}]")
                    labels += f"[as{i}_{j}]"
                parts.append(f"{labels}concat=n={len(slices)}:v=0:a=1[a{i}]")
        n = len(segs)
        use_xfade = any(transition_at(project, i) for i in range(1, n))
        if not use_xfade:
            labels = "".join(f"[a{i}]" for i in range(n))
            parts.append(f"{labels}concat=n={n}:v=0:a=1[asrc]")
        else:
            label = "[a0]"
            for i in range(1, n):
                t = transition_at(project, i)
                tdur = min(t[1], segs[i - 1].out_duration / 2, segs[i].out_duration / 2) if t else 0.0
                tdur = max(0.04, tdur)
                out = f"ax{i}"
                parts.append(f"{label}[a{i}]acrossfade=d={tdur:.3f}:"
                             f"c1=tri:c2=tri[{out}]")
                label = f"[{out}]"
            parts.append(f"{label}anull[asrc]")
    else:
        parts.append("[0:a]anull[asrc]")

    # ---- choose base --------------------------------------------------------
    have_music = has_music and bool(project.music)
    ms = float(getattr(project, "music_start", 0.0) or 0.0)
    mpre = f"atrim=start={ms:.3f},asetpts=PTS-STARTPTS," if ms > 0.001 else ""
    if mode == "music" and have_music:
        parts.append("[1:a]" + mpre + "aformat=sample_fmts=fltp:sample_rates=48000"
                     ":channel_layouts=stereo,volume={}dB[abase]".format(
                         float(project.music_gain_db)))
    elif mode == "source" or not have_music:
        parts.append("[asrc]anull[abase]")
    else:  # mix: duck music under source
        gain = float(project.music_gain_db)
        parts.append("[1:a]" + mpre + "aformat=sample_fmts=fltp:sample_rates=48000"
                     f":channel_layouts=stereo,volume={gain}dB[mus]")
        parts.append("[asrc]asplit=2[voice][sc]")
        parts.append("[mus][sc]sidechaincompress="
                     "threshold=0.15:ratio=2.5:attack=20:release=500[musduck]")
        parts.append("[voice][musduck]amix=inputs=2:duration=first"
                     ":dropout_transition=0:normalize=0[abase]")

    abase_label = "[abase]"

    # ---- sound design: synthesised impact thumps on drops -------------------
    if project.sfx and project.segments:
        abase_label = _sfx(project, abase_label, parts)

    # ---- finalise -----------------------------------------------------------
    dur = timeline_duration(project)
    af = [f"loudnorm=I={float(project.target_lufs)}:TP=-1.5:LRA=11"]
    if fade_out:
        af.append(f"afade=t=out:st={max(0.0, dur - fade_out)}:d={fade_out}")
    if hold:
        af.append(f"apad=pad_dur={hold}")
    # loudnorm/AAC may buffer an extra tail. Constrain the finalized audio to
    # the explicit video timeline (plus an intentional end-card hold).
    af.extend([f"atrim=duration={dur + hold:.6f}", "asetpts=PTS-STARTPTS"])
    parts.append(f"{abase_label}{','.join(af)}[afinal]")
    return "[afinal]"


def _overlay_fx(vlabel: str, W: int, H: int, parts: list[str],
                overlay_inputs: list[tuple[int, dict]]) -> str:
    """Composite full-frame overlay clips (black-bg / keyed) over the timeline."""
    for k, (idx, ov) in enumerate(overlay_inputs):
        t0 = max(0.0, float(ov.get("start", 0.0)))
        t1 = max(t0 + 0.1, float(ov.get("end", t0 + 0.6)))
        win = t1 - t0
        op = float(ov.get("opacity", 1.0))
        sc = float(ov.get("scale", 1.0))
        ow = max(2, int(round(W * sc)) // 2 * 2)
        oh = max(2, int(round(H * sc)) // 2 * 2)
        mode = (ov.get("mode") or "colorkey").lower()
        chain = (f"[{idx}:v]trim=start=0:end={win:.3f},setpts=PTS-STARTPTS,"
                 f"scale={ow}:{oh}:force_original_aspect_ratio=increase,"
                 f"crop={ow}:{oh},setsar=1,format=rgba,")
        if mode == "colorkey":
            chain += "colorkey=0x000000:0.18:0.05,"
        if op < 1.0:
            chain += f"colorchannelmixer=aa={op:.3f},"
        chain += f"setpts=PTS-STARTPTS+{t0:.3f}/TB[ov{k}]"
        parts.append(chain)
        out = f"vov{k}"
        parts.append(
            f"{vlabel}[ov{k}]overlay=enable='between(t,{t0:.3f},{t1:.3f})':"
            f"x=(W-w)/2:y=(H-h)/2:format=auto[{out}]")
        vlabel = f"[{out}]"
    return vlabel


def build(project: Project, ass_path: str | None = None,
          src: SourceInfo | None = None, has_music: bool = False,
          has_source_audio: bool = True,
          overlay_inputs: list[tuple[int, dict]] | None = None,
          ) -> tuple[str, float]:
    prepare(project)
    src = src or probe_source(str(project.source_path))
    fps = int(project.fps or round(src.fps) or 30)
    w, h = src.width, src.height
    parts: list[str] = []

    vlabel, joined = _video(project, fps, w, h, parts)

    # grade
    look = _grade.apply(project.grade)
    if look:
        parts.append(f"{vlabel}{look}[vgrade]")
        vlabel = "[vgrade]"

    # fades + end-card hold (no fade-to-black unless explicitly requested)
    fade_out = 0.0
    hold = 0.0
    if project.outro.get("enabled"):
        hold = float(project.outro.get("hold", 6.0))
        fade_out = float(project.outro.get("fade", 1.2))
    fin = float(project.title.get("fade_in", 0.0))
    if fin > 0.01:
        parts.append(f"{vlabel}fade=t=in:st=0:d={fin}[vfin]")
        vlabel = "[vfin]"
    if fade_out:
        parts.append(f"{vlabel}fade=t=out:st={max(0.0, joined - fade_out)}:d={fade_out}[vfout]")
        vlabel = "[vfout]"
    if hold:
        parts.append(f"{vlabel}tpad=stop_mode=add:stop_duration={hold}:color=black[vhold]")
        vlabel = "[vhold]"

    # reframe to canvas
    if project.aspect in ASPECTS:
        W, H = ASPECTS[project.aspect]
        if (W, H) != (w, h):
            if project.aspect == "9:16" and w > h:
                # horizontal source -> vertical: blur background fill
                parts.append(
                    f"{vlabel}split=2[rbg][rfg];"
                    f"[rbg]scale={W}:{H}:force_original_aspect_ratio=increase,"
                    f"crop={W}:{H},gblur=sigma=30[rbgb];"
                    f"[rfg]scale={W}:{H}:force_original_aspect_ratio=decrease[rfgs];"
                    f"[rbgb][rfgs]overlay=(W-w)/2:(H-h)/2[vref]")
            else:
                parts.append(
                    f"{vlabel}scale={W}:{H}:force_original_aspect_ratio=increase,"
                    f"crop={W}:{H}[vref]")
            vlabel = "[vref]"

    # full-frame overlay fx (particles / ripples / flashes / transitions)
    if overlay_inputs:
        Wv, Hv = ASPECTS.get(project.aspect, (w, h))
        vlabel = _overlay_fx(vlabel, Wv, Hv, parts, overlay_inputs)

    if ass_path:
        esc = ass_path.replace("\\", "/").replace(":", r"\:")
        parts.append(f"{vlabel}subtitles='{esc}'[vsub]")
        vlabel = "[vsub]"
    parts.append(f"{vlabel}format=yuv420p[vfinal]")

    if has_source_audio:
        _audio(project, parts, has_music)
    else:
        ac = 1 if has_music else 0
        if ac:
            parts.append("[1:a]aformat=sample_fmts=fltp:sample_rates=48000"
                         ":channel_layouts=stereo,volume={}dB,loudnorm=I={}:TP=-1.5:LRA=11[afinal]".format(
                             float(project.music_gain_db), float(project.target_lufs)))
        else:
            parts.append("anullsrc=r=48000:cl=stereo[afinal]")

    return ";".join(parts), joined
