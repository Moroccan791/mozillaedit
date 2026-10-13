"""Bounded, opt-in hard-cut renderer for encounters/v1. Not unattended QA.

Default clean is constant 1x, unchanged. Opt-in restrained-impact uses a
bounded C2 time map, protected event clocks, and mild local scale/exposure.
Video cuts use GLOBAL frame boundaries; audio uses absolute sample boundaries.
Music is never retimed. No lyrics, interpolation, overlays or auto fallback.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass
from decimal import Decimal, ROUND_HALF_UP
import json
import math
from pathlib import Path
import subprocess
import time
from typing import Mapping

EPS = 1e-7


@dataclass(frozen=True)
class RenderConfig:
    width: int = 1280
    height: int = 720
    fps: int = 60
    sample_rate: int = 48000
    encoder: str = "libx264"
    fallback_encoder: str | None = None
    quality: int = 21
    preset: str = "veryfast"
    music_gain_db: float = -6.0
    game_gain_db: float = 0.0
    max_duration: float = 120.0
    max_clip_duration: float = 30.0
    max_clips: int = 64
    max_source_duration: float = 86400.0
    timeout: float = 600.0
    ffmpeg: str = "ffmpeg"
    ffprobe: str = "ffprobe"
    style: str = "clean"

    def validate(self):
        for name, lo, hi in (("width", 16, 3840), ("height", 16, 2160),
                             ("fps", 1, 120), ("sample_rate", 8000, 96000),
                             ("max_clips", 1, 256), ("quality", 0, 51)):
            value = getattr(self, name)
            if type(value) is not int or not lo <= value <= hi:
                raise ValueError(f"invalid config {name}")
        if self.width % 2 or self.height % 2:
            raise ValueError("yuv420p canvas dimensions must be even")
        for name in ("max_duration", "max_clip_duration", "max_source_duration", "timeout"):
            if _number(getattr(self, name), name) <= 0:
                raise ValueError(f"{name} must be positive")
        for name in ("music_gain_db", "game_gain_db"):
            if not -60 <= _number(getattr(self, name), name, negative=True) <= 12:
                raise ValueError(f"invalid {name}")
        if self.style not in {"clean", "restrained-impact"}:
            raise ValueError("style must be clean or restrained-impact")
        if self.encoder not in {"libx264", "h264_qsv"}:
            raise ValueError("encoder must be libx264 or h264_qsv")
        if self.fallback_encoder is not None and not (
                self.encoder == "h264_qsv" and self.fallback_encoder == "libx264"):
            raise ValueError("only explicit h264_qsv -> libx264 fallback is supported")
        if self.preset not in {"ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow"}:
            raise ValueError("invalid x264 preset")


def _number(value, name, negative=False):
    if isinstance(value, bool) or not isinstance(value, (float, int)):
        raise ValueError(f"{name} must be a finite number")
    value = float(value)
    if not math.isfinite(value) or (value < 0 and not negative):
        raise ValueError(f"invalid {name}")
    return value


def _rounded(value, rate):
    """Round absolute boundaries once, positive half ties upward."""
    return int((Decimal(str(value)) * rate).to_integral_value(rounding=ROUND_HALF_UP))


def _same(left, right, name):
    if abs(left - right) > EPS:
        raise ValueError(f"inconsistent {name}: {left} != {right}")


def _path(value, name):
    if not isinstance(value, str) or not value.strip() or any(c in value for c in "\r\n\x00"):
        raise ValueError(f"invalid {name} path")
    return str(Path(value).resolve())


def validate_plan(plan: dict, config: RenderConfig | None = None,
                  source_durations: Mapping[str, float] | None = None,
                  music_duration: float | None = None) -> list[dict]:
    """Validate before any subprocess; return normalized timing rows.

    Media bounds may be supplied from probes; no IO is done here. Aliased
    paths resolve to the same source for overlap rejection. Events/anchors,
    when supplied, must agree with their source and output timing.
    """
    config = config or RenderConfig()
    config.validate()
    if not isinstance(plan, dict) or plan.get("schema_version") != "encounters/v1":
        raise ValueError("expected encounters/v1 plan")
    if plan.get("music_continuous") is not True or plan.get("gaps") != []:
        raise ValueError("continuous music and gap-free output required")
    for key in ("effects", "lyrics", "ramps", "transitions", "overlays", "sfx"):
        if plan.get(key):
            raise ValueError(f"unsupported {key}")
    duration = _number(plan.get("duration"), "duration")
    requested = _number(plan.get("requested_duration"), "requested_duration")
    ms = _number(plan.get("music_start"), "music_start")
    me = _number(plan.get("music_end"), "music_end")
    if not 0 < duration <= config.max_duration or duration > requested + EPS:
        raise ValueError("duration outside render/requested bounds")
    _same(me - ms, duration, "music excerpt duration")
    if me > config.max_source_duration or (music_duration is not None and me > music_duration + EPS):
        raise ValueError("music excerpt outside bounds")
    timeline = plan.get("timeline")
    if not isinstance(timeline, list) or not 1 <= len(timeline) <= config.max_clips:
        raise ValueError("nonempty bounded timeline required")
    bounds = {_path(k, "source"): _number(v, "source duration")
              for k, v in (source_durations or {}).items()}
    rows, ranges, cursor = [], {}, 0.0
    for i, item in enumerate(timeline):
        if not isinstance(item, dict):
            raise ValueError("timeline items must be objects")
        source = _path(item.get("source"), "source")
        values = {k: _number(item.get(k), f"clip {i} {k}") for k in
                  ("source_start", "source_end", "output_start", "output_end", "music_start", "music_end", "speed")}
        a, b, os, oe = (values[k] for k in ("source_start", "source_end", "output_start", "output_end"))
        if values["speed"] != 1.0:
            raise ValueError("explicit speed=1 required; sources are never stretched")
        for key in ("ramp_in", "ramp_out", "ramp_hold", "effects", "lyrics", "motion", "transition", "flash"):
            if item.get(key) not in (None, False, 0, "none", ""):
                raise ValueError(f"unsupported clip {key}")
        if not 0 < b - a <= config.max_clip_duration or b > config.max_source_duration:
            raise ValueError("source clip outside bounded duration")
        if source_durations is not None and (source not in bounds or b > bounds[source] + EPS):
            raise ValueError("clip exceeds actual source duration")
        _same(os, cursor, "contiguous output")
        _same(oe - os, b - a, "1x clip duration")
        _same(values["music_start"], ms + os, "clip music start")
        _same(values["music_end"], ms + oe, "clip music end")
        for x, y in ranges.setdefault(source, []):
            if a < y - EPS and b > x + EPS:
                raise ValueError("duplicate/overlapping same-source ranges")
        ranges[source].append((a, b))
        f0, f1 = _rounded(os, config.fps), _rounded(oe, config.fps)
        s0, s1 = _rounded(os, config.sample_rate), _rounded(oe, config.sample_rate)
        if f1 <= f0 or s1 <= s0:
            raise ValueError("clip collapses after frame/sample rounding")
        row = dict(values, source=source, index=i, frame_start=f0, frame_end=f1,
                   frame_count=f1-f0, sample_start=s0, sample_end=s1, sample_count=s1-s0,
                   source_sample_start=_rounded(a, config.sample_rate),
                   video_phase_seconds=os-f0/config.fps, events=[])
        events = item.get("events", [])
        if not isinstance(events, list):
            raise ValueError("events must be a list")
        for event in events:
            if not isinstance(event, dict) or event.get("confirmed") is not True:
                raise ValueError("only confirmed event objects are supported")
            if _path(event.get("source"), "event source") != source:
                raise ValueError("event source mismatch")
            timing = dict(event)
            for kind in ("audio", "visual"):
                st = _number(event.get(f"source_{kind}_event"), "event time")
                ot = _number(event.get(f"output_{kind}_event"), "output event time")
                if not a <= st <= b:
                    raise ValueError("event outside clip")
                _same(ot, os + st - a, "event timing")
                if f"{kind}_offset" in event:
                    _same(_number(event[f"{kind}_offset"], "event offset"), st-a, "event offset")
                timing[f"predicted_{kind}_event"] = os + st - a
            row["events"].append(timing)
        if "anchor" in item:
            anchor = item["anchor"]
            if not isinstance(anchor, dict):
                raise ValueError("anchor must be an object")
            st = _number(anchor.get("source_audio_event"), "anchor source time")
            vt = _number(anchor.get("source_visual_event"), "anchor visual time")
            if not a <= st <= b or not a <= vt <= b:
                raise ValueError("anchor outside clip")
            ot = _number(anchor.get("output_time"), "anchor output time")
            _same(ot, os+st-a, "anchor output")
            _same(_number(anchor.get("music_time"), "anchor music time"), ms+ot, "anchor music")
        if config.style == "restrained-impact":
            from .impact_motion import build_time_map, audio_segments, effect_envelopes
            audio = [e["source_audio_event"]-a for e in row["events"]]
            visual = [e["source_visual_event"]-a for e in row["events"]]
            if "anchor" in item:
                audio.append(item["anchor"]["source_audio_event"]-a)
                visual.append(item["anchor"]["source_visual_event"]-a)
            mapping = build_time_map(b-a, audio, visual)
            row["time_map"] = mapping.manifest()
            row["audio_segments"] = audio_segments(mapping, row, config.sample_rate, _rounded)
            row["effect_envelopes"] = effect_envelopes(audio, b-a)
        rows.append(row)
        cursor = oe
    _same(cursor, duration, "total duration")
    return rows


class RenderError(RuntimeError):
    """Subprocess failure, with persistent exact args/stdout/stderr paths."""

    def __init__(self, message, *, returncode=None):
        super().__init__(message)
        self.returncode = returncode


def _json(path, value):
    with Path(path).open("x", encoding="utf-8") as handle:
        json.dump(value, handle, indent=2, allow_nan=False)


def _run(args, job, label, timeout):
    args_path = job / f"{label}.args.json"
    stdout_path, stderr_path = job / f"{label}.stdout.log", job / f"{label}.stderr.log"
    _json(args_path, args)
    started = time.monotonic()
    try:
        with stdout_path.open("xb") as stdout, stderr_path.open("xb") as stderr:
            proc = subprocess.run(args, stdout=stdout, stderr=stderr, timeout=timeout, check=False)
        code = proc.returncode
    except (OSError, subprocess.TimeoutExpired) as exc:
        _json(job / f"{label}.status.json", {"error": str(exc), "elapsed": time.monotonic()-started})
        raise RenderError(f"{label}: {exc}; args={args_path}; stderr={stderr_path}") from exc
    _json(job / f"{label}.status.json", {"returncode": code, "elapsed": time.monotonic()-started})
    if code:
        raise RenderError(f"{label} exited {code}; args={args_path}; stderr={stderr_path}", returncode=code)
    return {"args": str(args_path), "stdout": str(stdout_path), "stderr": str(stderr_path)}


def _probe(path, job, label, config):
    logs = _run([config.ffprobe, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
                job, label, min(config.timeout, 60))
    try:
        meta = json.loads(Path(logs["stdout"]).read_text(encoding="utf-8"))
        duration = float(meta["format"]["duration"])
        if not math.isfinite(duration) or duration <= 0:
            raise ValueError("invalid duration")
    except (ValueError, KeyError, TypeError) as exc:
        raise RenderError(f"Malformed probe metadata: {logs['stdout']}") from exc
    return meta, duration


def _new_job(root):
    root = Path(root).resolve()
    root.mkdir(parents=True, exist_ok=True)
    for version in range(1, 100000):
        job = root / f"encounters-v{version:04d}"
        try:
            job.mkdir()
            return job
        except FileExistsError:
            continue
    raise FileExistsError("no free versioned render directory")


def _video_filter(row, config):
    a, b, phase = row["source_start"], row["source_end"], row["video_phase_seconds"]
    if config.style == "restrained-impact":
        from .impact_motion import TimeMap, envelope_expression
        data = row["time_map"]
        mapping = TimeMap(**{k: data[k] for k in ("duration", "protected", "gaps", "anchors", "strength", "min_speed", "max_speed")})
        mapped = mapping.expression(f"(PTS*TB-{a:.12f})")
        local = f"(t-{phase:.12f})"
        brightness = envelope_expression(row["effect_envelopes"], local, "brightness")
        # zoompan receives output frame index after CFR; no interpolation.
        zoom = envelope_expression(row["effect_envelopes"], f"(on/{config.fps}-{phase:.12f})", "zoom")
        return (f"trim=start={a:.12f}:end={b:.12f},setpts='({mapped}+({phase:.12f}))/TB',"
                f"fps={config.fps}:start_time=0,"
                f"scale={config.width}:{config.height}:force_original_aspect_ratio=decrease,"
                f"pad={config.width}:{config.height}:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p,"
                f"eq=brightness='{brightness}':eval=frame,"
                f"zoompan=z='{zoom}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:"
                f"s={config.width}x{config.height}:fps={config.fps},"
                f"tpad=stop_mode=clone:stop_duration={2/config.fps:.12f},"
                f"trim=end_frame={row['frame_count']},setpts=N/({config.fps}*TB)")
    # Input copyts preserves absolute source frame timestamps after bounded
    # keyframe seek. Subtract the REQUESTED trim, not first decoded PTS.
    return (f"trim=start={a:.12f}:end={b:.12f},"
            f"setpts=PTS-{a:.12f}/TB+({phase:.12f})/TB,"
            f"fps={config.fps}:start_time=0,"
            f"scale={config.width}:{config.height}:force_original_aspect_ratio=decrease,"
            f"pad={config.width}:{config.height}:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p,"
            f"tpad=stop_mode=clone:stop_duration={2/config.fps:.12f},"
            f"trim=end_frame={row['frame_count']},setpts=N/({config.fps}*TB)")


def _audio_filter(first, count, config):
    # Decode compressed audio from its true origin. No input -ss or atempo.
    # Tiny sample rounding correction (<=1 sample) only, never duration stretch.
    return (f"aresample={config.sample_rate},aformat=sample_fmts=s16:channel_layouts=stereo,"
            f"atrim=start_sample={first}:end_sample={first+count},asetpts=N/SR/TB")


def _concat_file(path, files, durations=None):
    lines = ["ffconcat version 1.0"]
    for i, file in enumerate(files):
        # Relative controlled filenames avoid Windows path/quote escaping.
        lines.append(f"file '{file.name}'")
        if durations is not None:
            lines.append(f"duration {durations[i]:.12f}")
    with path.open("x", encoding="utf-8") as handle:
        handle.write("\n".join(lines)+"\n")


def render_encounters(plan: dict, music: str | Path, output_root: str | Path, *,
                      config: RenderConfig | None = None) -> dict:
    """Render into a NEW versioned directory, retaining chunks/stems/logs.

    Raises before FFmpeg for empty/malformed plans. Actual bounds are checked
    with FFprobe before encoding. Missing game audio fails (not silently muted).
    Hardware fallback is opt-in and uses a DIFFERENT chunk filename; failure
    artifacts are retained. The returned JSON-safe manifest is also on disk.
    """
    config = config or RenderConfig()
    rows = validate_plan(plan, config)
    music = Path(_path(str(music), "music"))
    sources = list(dict.fromkeys(row["source"] for row in rows))
    for filename in sources + [str(music)]:
        if not Path(filename).is_file():
            raise ValueError(f"media file does not exist: {filename}")
    job = _new_job(output_root)
    _json(job / "plan.json", plan)
    _json(job / "config.json", asdict(config))
    metadata, bounds = {}, {}
    for i, source in enumerate(sources):
        meta, bounds[source] = _probe(source, job, f"probe-source-{i:03d}", config)
        if not all(any(s.get("codec_type") == kind for s in meta["streams"]) for kind in ("video", "audio")):
            raise ValueError(f"source video and game audio required: {source}")
        metadata[source] = meta
    music_meta, md = _probe(music, job, "probe-music", config)
    if not any(s.get("codec_type") == "audio" for s in music_meta["streams"]):
        raise ValueError("music audio required")
    rows = validate_plan(plan, config, bounds, md)
    # Container duration can include another stream's tail. Check explicit
    # stream durations too, when the container exposes them.
    for row in rows:
        for stream in metadata[row["source"]]["streams"]:
            if stream.get("codec_type") in {"video", "audio"} and "duration" in stream:
                stream_duration = float(stream["duration"])
                if not math.isfinite(stream_duration) or row["source_end"] > stream_duration + EPS:
                    raise ValueError("clip exceeds actual source stream duration")
    for stream in music_meta["streams"]:
        if stream.get("codec_type") == "audio" and "duration" in stream:
            stream_duration = float(stream["duration"])
            if not math.isfinite(stream_duration) or plan["music_end"] > stream_duration + EPS:
                raise ValueError("music excerpt exceeds actual audio stream duration")
    # Source video/audio clocks must share ordinary zero origin. Music uses
    # decoded sample index zero, exactly like the sync-proof reference PCM.
    # MP3 encoder-delay start_time is therefore NOT subtracted or guessed:
    # FFmpeg decodes from the real origin and applies codec skip metadata.
    for filename, meta in metadata.items():
        for stream in meta["streams"]:
            if stream.get("codec_type") in {"video", "audio"}:
                origin = float(stream.get("start_time", 0))
                if not math.isfinite(origin) or abs(origin) > .001:
                    raise ValueError(f"nonzero stream start_time needs explicit calibration: {filename}")
    videos, audios, chunk_info = [], [], []
    base = [config.ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin", "-n", "-threads", "1"]
    for row in rows:
        i = row["index"]
        seek = max(0, math.floor(row["source_start"])-2)
        video = job / f"clip-{i:03d}-{config.encoder}.mp4"
        prefix = base + ["-copyts", "-ss", str(seek), "-t", f"{row['source_end']-seek+2/config.fps:.12f}",
                         "-i", row["source"], "-map", "0:v:0", "-an", "-vf", _video_filter(row, config),
                         "-frames:v", str(row["frame_count"]), "-fps_mode", "passthrough", "-pix_fmt", "yuv420p"]
        def codec_args(encoder):
            return (["-c:v", encoder, "-global_quality", str(config.quality)] if encoder == "h264_qsv"
                    else ["-c:v", "libx264", "-preset", config.preset, "-crf", str(config.quality)])
        chosen = config.encoder
        try:
            _run(prefix + codec_args(chosen) + [str(video)], job, f"clip-{i:03d}-{chosen}", config.timeout)
        except RenderError as exc:
            if config.fallback_encoder is None or exc.returncode is None:
                raise
            chosen = config.fallback_encoder
            video = job / f"clip-{i:03d}-{chosen}.mp4"
            _run(prefix + codec_args(chosen) + [str(video)], job, f"clip-{i:03d}-{chosen}", config.timeout)
        vmeta, _ = _probe(video, job, f"probe-clip-{i:03d}", config)
        vstream = next(s for s in vmeta["streams"] if s.get("codec_type") == "video")
        if int(vstream.get("nb_frames", -1)) != row["frame_count"]:
            raise RenderError(f"clip {i} does not contain the requested exact frame count")
        audio = job / f"game-{i:03d}.wav"
        first, count = row["source_sample_start"], row["sample_count"]
        if config.style == "restrained-impact":
            from .impact_motion import audio_filter
            graph = job / f"game-{i:03d}.filter.txt"
            graph.write_text(audio_filter(row["audio_segments"], config.sample_rate), encoding="utf-8")
            audio_args = ["-/filter_complex", str(graph), "-map", "[a]"]
            end_sample = row["audio_segments"][-1]["source_end_sample"]
        else:
            audio_args = ["-map", "0:a:0", "-af", _audio_filter(first, count, config)]
            end_sample = first+count
        _run(base + ["-t", f"{end_sample/config.sample_rate+0.1:.12f}", "-i", row["source"],
                     "-vn"] + audio_args + ["-c:a", "pcm_s16le", "-ar", str(config.sample_rate), "-ac", "2", str(audio)],
             job, f"game-{i:03d}", config.timeout)
        _check_wav(audio, count, config)
        videos.append(video)
        audios.append(audio)
        chunk_info.append(dict(row, video=str(video), game_audio=str(audio), encoder=chosen,
                               source_audio_end_rounding_seconds=(first+count)/config.sample_rate-row["source_end"]))
    video_list, audio_list = job / "video.ffconcat", job / "game.ffconcat"
    _concat_file(video_list, videos, [row["frame_count"]/config.fps for row in rows])
    _concat_file(audio_list, audios)
    game, music_stem = job / "game-stem.wav", job / "music-stem.wav"
    _run(base + ["-f", "concat", "-safe", "0", "-i", str(audio_list), "-vn", "-c:a", "copy", str(game)],
         job, "game-stem", config.timeout)
    total_samples = rows[-1]["sample_end"]
    _check_wav(game, total_samples, config)
    first = _rounded(plan["music_start"], config.sample_rate)
    _run(base + ["-t", f"{(first+total_samples)/config.sample_rate+0.1:.12f}", "-i", str(music),
                 "-map", "0:a:0", "-vn", "-af", _audio_filter(first, total_samples, config),
                 "-c:a", "pcm_s16le", "-ar", str(config.sample_rate), "-ac", "2", str(music_stem)],
         job, "music-stem", config.timeout)
    _check_wav(music_stem, total_samples, config)
    output = job / "encounters.mp4"
    mix = (f"[1:a]volume={config.game_gain_db}dB[g];[2:a]volume={config.music_gain_db}dB[m];"
           "[g][m]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,"
           f"atrim=end_sample={total_samples},asetpts=N/SR/TB[a]")
    _run(base + ["-f", "concat", "-safe", "0", "-i", str(video_list), "-i", str(game), "-i", str(music_stem),
                 "-filter_complex", mix, "-map", "0:v:0", "-map", "[a]", "-c:v", "copy", "-c:a", "aac",
                 "-b:a", "192k", "-ar", str(config.sample_rate), "-movflags", "+faststart", str(output)],
         job, "final-mix", config.timeout)
    final_meta, _ = _probe(output, job, "probe-output", config)
    frames = rows[-1]["frame_end"]
    stream = next(s for s in final_meta["streams"] if s.get("codec_type") == "video")
    if int(stream.get("nb_frames", -1)) != frames:
        raise RenderError("joined video frame count mismatch")
    manifest_path = job / "render-manifest.json"
    manifest = {"schema_version": "encounter-render/v1", "job_dir": str(job), "manifest_path": str(manifest_path),
                "output": str(output), "game_stem": str(game), "music_stem": str(music_stem),
                "style": config.style,
                "motion_audio_granularity_seconds": .10 if config.style == "restrained-impact" else None,
                "motion_limitations": (["Audio outside protected windows uses <=100ms constant-atempo slices with exact absolute sample endpoints and pad/trim; waveform and within-slice timing are approximate.",
                                        "Protected windows bypass atempo; a boundary can differ by one sample from source rounding.",
                                        "Video uses eased timestamp remapping then CFR frame selection, no interpolation.",
                                        "Restrained experiment, not a production aesthetic claim."] if config.style == "restrained-impact" else []),
                "video_concat": str(video_list), "game_concat": str(audio_list), "config": asdict(config),
                "plan_duration": plan["duration"], "video_duration": frames/config.fps,
                "audio_duration": total_samples/config.sample_rate, "frame_count": frames,
                "sample_count": total_samples, "music_start_sample": first, "music_source": str(music),
                "music_time_origin": "decoded sample zero after FFmpeg codec skip/encoder-delay handling", 
                "chunks": chunk_info, "source_metadata": metadata, "music_metadata": music_meta,
                "output_metadata": final_meta,
                "warnings": ["Not unattended-ready: real decoded event/video/audio QA is still required.",
                             "Final video is globally rounded to frames; audio retains sample-precision plan timing.",
                             ("At most two edge frames may be cloned for CFR rounding, never source speed changed." if config.style == "clean" else
                              "Source video and game audio retimed together, endpoints and supplied events fixed; music untouched."),
                             "Constant-gain mix can clip; PCM stems are retained for independent timing QA."]}
    _json(manifest_path, manifest)
    return manifest


def _check_wav(path, count, config):
    import wave
    with wave.open(str(path), "rb") as handle:
        if (handle.getnframes(), handle.getframerate(), handle.getnchannels(), handle.getsampwidth()) != (
                count, config.sample_rate, 2, 2):
            raise RenderError(f"PCM stem is short or has unexpected format: {path}")
