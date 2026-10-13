"""Planner: compose an edit project from footage + music + a genre vibe.

This is the "brain" that turns a raw source and a track into a ready-to-render
project:

  * finds the track's highest-energy stretch for the target duration
  * lays out a rhythm of beat slots (fast for gaming, longer for music reels)
  * assigns the punchiest footage to the punchiest slots (drops get the best)
  * adds motion on drops/peaks, transitions + grade per vibe, aspect per platform
"""
from __future__ import annotations

import subprocess
from pathlib import Path

from . import beats as beats_mod
from . import music as music_mod
from .project import Project, Segment

OVERLAY_DIR_DEFAULT = r"E:\overlays"
# curated: black-background keyed fx that read well over gameplay
OVERLAY_POOL = [
    "Particles_1.mp4", "Orange_Ripple_Overlay.mp4", "Blue_Ripple_Overlay.mp4",
    "Haze_Overlay.mp4", "Particles_18.mp4", "Cyan_Head_Tracker.mp4",
    "Aqua_Ripple_Overlay.mp4", "purple_ripple_overlay.mp4",
    "Red_Head_Tracker.mp4", "Particles_3.mp4", "Pink_Ripple_Overlay.mp4",
    "Green_Head_Tracker.mp4", "Blue_Head_Tracker.mp4", "Purple_Ripple_Overlay.mp4",
    "Orange_Head_Tracker.mp4", "Dark_Purple_Ripple_Overlay.mp4",
]
_len_cache: dict[str, float] = {}


def _media_len(path: str) -> float:
    if path in _len_cache:
        return _len_cache[path]
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", path],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=20
        ).stdout.strip()
        d = float(out) if out else 0.0
    except Exception:
        d = 0.0
    _len_cache[path] = d
    return d


def _overlay_pool(overlays_dir: str | None) -> list[str]:
    base = Path(overlays_dir or OVERLAY_DIR_DEFAULT)
    if not base.exists():
        return []
    names = {p.name.lower(): p for p in base.iterdir() if p.is_file()}
    pool = [str(names[n.lower()]) for n in OVERLAY_POOL if n.lower() in names]
    return pool


VIBES = {
    "gaming":     {"pattern": [1, 0.5, 1, 1, 0.5, 0.5, 2], "grade": "vibrant-sports",
                   "transition": {"type": "zoom-blur", "duration": 0.14}},
    "music-reel": {"pattern": [1, 1, 2, 1, 1, 2], "grade": "teal-orange",
                   "transition": {"type": "fade", "duration": 0.22}},
    "reel":       {"pattern": [1, 1, 1, 2], "grade": "warm-film",
                   "transition": {"type": "fade", "duration": 0.30}},
    "sports":     {"pattern": [1, 1, 2, 1, 2], "grade": "vibrant-sports",
                   "transition": {"type": "fade", "duration": 0.35}},
    "clean":      {"pattern": [1, 1, 1, 1], "grade": "none",
                   "transition": {}},
}

# montage = chopped beat-synced cuts; highlights = keep whole moments intact
STYLE_FOR_VIBE = {"gaming": "montage", "music-reel": "montage",
                  "sports": "highlights", "reel": "highlights",
                  "clean": "highlights"}

ASPECT_FOR_PLATFORM = {"reels": "9:16", "shorts": "9:16", "tiktok": "9:16",
                       "square": "1:1"}


def _candidates(windows) -> list[dict]:
    out = []
    for w in windows or []:
        if isinstance(w, dict):
            out.append({"start": float(w["start"]), "end": float(w["end"]),
                        "score": float(w.get("score", 0.5)), "off": 0.0})
        else:  # Shot-like
            out.append({"start": float(w.start), "end": float(w.end),
                        "score": float(getattr(w, "intensity", 0.5) or 0.5),
                        "off": 0.0})
    return out


def _slots(beat_times: list[float], beat_len: float, drops_local: set[float],
           duration: float, pattern: list[float]) -> list[dict]:
    """Build slots from tracked intervals, interpolating fractional beats.

    Nominal BPM is only a no-grid fallback. Never extend a tracked grid beyond
    its final boundary: a tempo estimate must not accumulate cut drift.
    """
    if not beat_times:
        out, t = [], 0.0
        while t < duration:
            end = min(t + 1.0, duration)
            out.append({"start": t, "end": end, "drop": False})
            t = end
        return out
    if not pattern or any(step <= 0 for step in pattern):
        raise ValueError("beat pattern must contain positive steps")
    grid = sorted(set(beat_times))
    slots, position, k = [], 0.0, 0
    t = grid[0]
    while t < duration - 1e-9 and position < len(grid) - 1:
        next_position = min(position + pattern[k % len(pattern)], len(grid) - 1)
        index = int(next_position)
        fraction = next_position - index
        end = grid[index]
        if fraction:
            end += fraction * (grid[index + 1] - grid[index])
        end = min(end, duration)
        drop = any(t - 1e-6 <= d < end for d in drops_local)
        slots.append({"start": t, "end": end, "drop": drop})
        k += 1
        position = next_position
        t = end
    return slots


def _pick_highlights(mat: list[dict], profile, beat_len: float,
                     duration: float) -> tuple[list[Segment], set[float]]:
    """Keep the highest-scoring moments *whole* (no chopping).

    Best moments are assumed to be the biggest crowd/action responses (goals,
    kills, spikes). They are ordered chronologically and each is trimmed to a
    whole number of beats so cuts still land on the music.
    """
    if not mat:
        return [], set()
    # take the strongest windows until we cover the target duration
    ranked = sorted(mat, key=lambda m: -m["score"])
    chosen, total = [], 0.0
    for m in ranked:
        if m["end"] - m["start"] < 0.5:
            continue
        chosen.append(m)
        total += m["end"] - m["start"]
        if total >= duration:
            break
    if not chosen:
        return [], set()
    chosen.sort(key=lambda m: m["start"])

    segs: list[Segment] = []
    drop_starts: set[float] = set()
    best = max(chosen, key=lambda m: m["score"])
    for m in chosen:
        s, e = m["start"], m["end"]
        if beat_len > 0:  # round length down to a whole beat
            k = max(1, round((e - s) / beat_len))
            e = s + min(e - s, k * beat_len)
        e_e = profile.energy_at(s)
        if e_e > 0.62:
            motion, zoom = "zoom-in", 1.12
        else:
            motion, zoom = "none", 1.08
        label = "drop" if m is best else ""
        if m is best:
            drop_starts.add(round(s, 3))
        segs.append(Segment(start=round(s, 3), end=round(e, 3), label=label,
                            motion=motion, zoom=zoom))
    return segs, drop_starts


def plan(source: str, music_path: str, *, duration: float = 30.0,
         vibe: str = "music-reel", style: str | None = None,
         platform: str = "reels",
         windows=None, title_lines=None, grade: str | None = None,
         audio_mode: str = "mix", root: str | Path | None = None) -> Project:
    v = VIBES.get(vibe, VIBES["music-reel"])
    profile = music_mod.analyze_cached(music_path)
    b = beats_mod.detect_cached(music_path)

    # ride the hype: start the edit at the track's highest-energy stretch
    win = profile.best_window(duration)
    beat_len = 60.0 / (b.bpm or profile.bpm or 100.0)
    beats_all = b.beats or [profile.offset + i * beat_len
                            for i in range(int(profile.duration / beat_len))]
    b_local = [t - win for t in beats_all if t >= win - 1e-6]
    drops_local = {round(d - win, 3) for d in profile.drops if d >= win - 1e-6}
    # also treat very-high-energy moments as drops if none detected
    if not drops_local and profile.peaks:
        drops_local = {round(p - win, 3) for p in profile.peaks if p >= win - 1e-6}

    style = (style or STYLE_FOR_VIBE.get(vibe, "montage")).lower()
    mat = _candidates(windows)

    segments: list[Segment] = []
    if style == "highlights":
        segments, _ = _pick_highlights(mat, profile, beat_len, duration)
        if not segments:  # no windows available -> fall back to montage
            style = "montage"

    if style == "montage":
        # The video starts with the first emitted beat slot, not best_window's
        # arbitrary energy-sample origin. Use that same origin for the music.
        if b_local:
            win = next(t for t in beats_all if t >= win - 1e-6)
        b_local = [t - win for t in beats_all if t >= win - 1e-6]
        drops_local = {d - win for d in profile.drops if d >= win - 1e-6}
        if not drops_local:
            drops_local = {p - win for p in profile.peaks if p >= win - 1e-6}
        slots = (_slots(b_local, beat_len, drops_local, duration, v["pattern"])
                 if b_local or not beats_all else [])
        mranked = sorted(mat, key=lambda m: -m["score"])
        order = sorted(range(len(slots)),
                       key=lambda i: (0 if slots[i]["drop"] else 1, i))
        for rank, si in enumerate(order):
            if not mranked:
                break
            L = slots[si]["end"] - slots[si]["start"]
            # Short source windows must not shorten a beat slot and shift all
            # later cuts. Retain cycling, but only use windows that fit it.
            fitting = [m for m in mranked if m["end"] - m["start"] >= L - 1e-9]
            if not fitting:
                continue
            m = fitting[rank % len(fitting)]
            s = m["start"] + m["off"]
            if s + L > m["end"] + 1e-9:
                s = m["start"]
            e = s + L
            m["off"] = e - m["start"]
            slots[si]["src"] = (s, e)
        for sl in slots:
            if "src" not in sl:
                break
            s, e = sl["src"]
            e_energy = profile.energy_at(sl["start"] + win)
            motion, zoom = "none", 1.15
            grade_override = None
            flash = False
            ramp_in = 0.0
            ramp_out = 0.0
            if sl["drop"] or e_energy > 0.82:
                motion, zoom = "punch", 1.3
                grade_override = "vibrant-sports"
                flash = True
                ramp_in = 0.15
                ramp_out = 0.1
            elif e_energy > 0.7:
                motion, zoom = "zoom-in", 1.18
                grade_override = "teal-orange"
                flash = e_energy > 0.78
                ramp_in = 0.1
                ramp_out = 0.05
            else:
                grade_override = "warm-film"
            segments.append(Segment(start=s, end=e,
                                    label="drop" if sl["drop"] else "",
                                    motion=motion, zoom=zoom,
                                    grade=grade_override,
                                    flash=flash,
                                    ramp_in=ramp_in,
                                    ramp_out=ramp_out,
                                    ramp_speed=0.25))

    aspect = ASPECT_FOR_PLATFORM.get(platform, "source")
    proj = Project(
        name=f"{Path(source).stem}_{vibe}",
        source=str(Path(source).resolve()),
        music=str(Path(music_path).resolve()),
        music_gain_db=-6.0,
        music_start=win,
        grade=grade or v["grade"],
        platform=platform,
        aspect=aspect,
        reframe="blur",
        vibe=vibe,
        transition={"type": "cut"} if style == "montage" else dict(v["transition"]),
        audio_mode=audio_mode,
        sfx=(vibe in ("gaming", "punch")),
        target_lufs=-14.0,
        segments=segments,
        title=({"enabled": True, "lines": title_lines, "font_size": [90] * len(title_lines),
                "in": 0.3, "out": 3.0, "fade_in": 0.5} if title_lines else {}),
        outro={"enabled": False},
    )
    if root:
        proj.root = Path(root)
    return proj


def plan_kills(source: str, music_path: str, *, kills=None, n: int | None = None,
               duration: float = 45.0,
               pre: float = 0.8, post: float = 1.5, platform: str = "reels",
               grade: str | None = None, audio_mode: str = "mix",
               music_gain_db: float = -6.0, sfx: bool = False,
               min_sep: float = 1.0, detect_kwargs: dict | None = None,
               overlays: bool = True, overlays_dir: str | None = None,
               root: str | Path | None = None) -> Project:
    """Beat-grid kill montage.

    Slots come only from the beat grid (2 beats before the drop, 1 beat inside
    it, up to a target ``duration``). Kill shots fill the punchiest slots; any
    remaining slots are filled with the best other moments ranked by energy,
    never repeating the same source time.
    """
    from . import shots as shots_mod

    profile = music_mod.analyze_cached(music_path)
    b = beats_mod.detect_cached(music_path)
    bpm = b.bpm or profile.bpm or 100.0
    beat_len = 60.0 / bpm

    # ---- candidate moments, ranked by transient energy ----------------------
    sh: list = []
    if kills:
        cand = []
        for t in sorted(float(k) for k in kills):
            if all(abs(t - p) >= min_sep for p in cand):
                cand.append(t)
    else:
        sh = shots_mod.detect(source, **(detect_kwargs or {}))
        if not sh:
            raise ValueError("no moments found: pass kills=... or loosen detection")
        cand = []
        for s in sorted(sh, key=lambda s: -s.strength):
            if all(abs(s.t - p) >= min_sep for p in cand):
                cand.append(s.t)                 # strongest first
    if not cand:
        raise ValueError("no candidate moments")

    # ---- drop time ----------------------------------------------------------
    drop = None
    for dpt in profile.drops:
        if dpt > 1.0:
            drop = dpt
            break
    if drop is None:
        peaks = [s for s in profile.sections if s.label in ("drop", "peak")]
        if peaks:
            drop = peaks[0].start
    if drop is None:
        drop = profile.best_window(duration)

    beats_all = list(b.beats)
    if not beats_all:
        beats_all = [i * beat_len for i in range(64)]
    drop_i = min(range(len(beats_all)),
                 key=lambda i: abs(beats_all[i] - drop))
    start_i = max(0, drop_i - 2 * 3)          # 3 lead slots before the drop
    win = beats_all[start_i]

    # ---- slots from the grid, covering the target duration ------------------
    slots: list[tuple[float, float, float]] = []   # (beat0, beat1, onset)
    i = start_i
    acc = 0.0
    while i < len(beats_all) - 1:
        if n and len(slots) >= n:
            break
        if not n and acc >= duration:
            break
        bs = beats_all[i]
        step = 1 if (bs + 1e-6) >= drop else 2
        if i + step >= len(beats_all):
            break
        be = beats_all[i + step]
        slots.append((bs, be, 0.0 if step == 1 else beats_all[i + 1] - bs))
        acc += be - bs
        i += step
    if not slots:
        raise ValueError("could not build a beat grid over the track")

    # ---- assign moments: punchiest energy into the drop slots ---------------
    moments: list[float] = []
    for t in cand:
        if all(abs(t - used) >= 1e-6 for used in moments):
            moments.append(t)
    if len(moments) < len(slots) and sh:
        for s in sorted(sh, key=lambda s: -s.strength):
            if len(moments) >= len(slots):
                break
            if all(abs(s.t - m) >= max(0.5, min_sep) for m in moments):
                moments.append(s.t)
    # Populate one contiguous block. Prioritizing drop slots across the whole
    # grid then skipping holes compresses time while leaving music pre-drop.
    count = min(len(moments), len(slots))
    first = max(range(len(slots) - count + 1),
                key=lambda start: (sum(bs + 1e-6 >= drop
                                       for bs, _, _ in slots[start:start + count]),
                                   -start))
    slots = slots[first:first + count]
    win = slots[0][0]
    order = sorted(range(len(slots)),
                   key=lambda k: (0 if slots[k][0] + 1e-6 >= drop else 1, k))
    # Never cycle the same footage to fill missing slots. Sparse input yields
    # a shorter honest timeline; stronger moments go to stronger/drop slots.
    assign: dict[int, float] = {
        slot_idx: moments[rank]
        for rank, slot_idx in enumerate(order[:len(moments)])
    }

    ramp_tail = 0.30      # source s of slow-mo tail (inside the slot)
    ramp_k = 0.60         # slow-mo speed
    segments: list[Segment] = []
    for idx, (bs, be, onset) in enumerate(slots):
        if idx not in assign:
            continue
        kt = assign[idx]
        slot_len = be - bs
        offset = min(onset, slot_len)
        s = kt - offset
        if s < 0:
            s = 0.0
        e = s + slot_len
        is_first = idx == 0
        segments.append(Segment(
            start=s, end=e,
            grade="teal-orange" if is_first else "vibrant-sports",
            flash=not is_first,
            ramp_in=ramp_tail, ramp_out=0.0, ramp_speed=ramp_k,
            ramp_hold=round(offset, 4),
        ))

    # ---- overlay fx aligned to each kill clip start -------------------------
    ov_events: list[dict] = []
    if overlays:
        pool = _overlay_pool(overlays_dir)
        t_acc = 0.0
        for idx, seg in enumerate(segments):
            if idx >= 1 and pool:
                ov = pool[(idx - 1) % len(pool)]
                dur = _media_len(ov)
                ovw = min(0.7, max(0.30, dur - 0.05)) if dur > 0 else 0.6
                ov_events.append({
                    "path": ov, "start": round(t_acc, 3),
                    "end": round(t_acc + ovw, 3),
                    "mode": "colorkey", "opacity": 0.9, "scale": 1.0,
                })
            t_acc += seg.out_duration

    proj = Project(
        name=f"{Path(source).stem}_killmontage",
        source=str(Path(source).resolve()),
        music=str(Path(music_path).resolve()),
        music_gain_db=music_gain_db,
        music_start=win,
        grade=grade or "teal-orange",
        platform=platform,
        aspect=ASPECT_FOR_PLATFORM.get(platform, "9:16"),
        reframe="blur",
        vibe="montage",
        transition={"type": "cut"},
        audio_mode=audio_mode,
        sfx=sfx,
        target_lufs=-14.0,
        segments=segments,
        outro={"enabled": False},
        captions_mode="lyrics",
        overlays=ov_events,
    )
    if root:
        proj.root = Path(root)
    return proj


def describe(proj: Project) -> str:
    drops = sum(1 for s in proj.segments if s.label == "drop")
    motion = sum(1 for s in proj.segments if s.motion != "none")
    lines = [
        f"plan '{proj.name}' vibe={proj.vibe} aspect={proj.aspect} "
        f"platform={proj.platform}",
        f"  {len(proj.segments)} segments, {proj.total_duration:.1f}s, "
        f"drops={drops}, motion={motion}",
        f"  grade={proj.grade} transition={proj.transition.get('type', 'none')}",
    ]
    for s in proj.segments[:14]:
        tag = s.motion if s.motion != "none" else ""
        lines.append(f"    {s.start:7.2f}-{s.end:7.2f} {s.label:5s} {tag}")
    if len(proj.segments) > 14:
        lines.append(f"    ... +{len(proj.segments) - 14} more")
    return "\n".join(lines)
