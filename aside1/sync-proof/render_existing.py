"""Isolated adapter for existing aive renderer; does not run detector/conductor.
Usage: python E:/aside/sync-proof/render_existing.py JOB/project.json
No source files or existing bot modules are modified. Runtime UNTESTED by Aside.
"""
from __future__ import annotations
import argparse
import json
import math
import shutil
import struct
import subprocess
import sys
from fractions import Fraction
from pathlib import Path


def _gray_frame(path: Path, t: float, width: int = 160, height: int = 90) -> bytes:
    if t < 0:
        raise ValueError("Frame timestamp must be non-negative")
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{t:.6f}",
         "-i", str(path), "-map", "0:v:0", "-an", "-frames:v", "1",
         "-vf", f"scale={width}:{height}:flags=area,format=gray",
         "-f", "rawvideo", "pipe:1"],
        capture_output=True, timeout=30,
    )
    expected = width * height
    if proc.returncode != 0 or len(proc.stdout) != expected:
        raise RuntimeError(f"Could not decode frame at {t:.3f}s from {path}")
    return proc.stdout


_PCM_CACHE = {}


def _mono_audio(path: Path, start: float, duration: float,
                sample_rate: int = 16000) -> tuple[float, ...]:
    if start < 0 or duration <= 0:
        raise ValueError("Audio window is outside media bounds")
    # Decode each reference from its real origin once. Compressed-audio input
    # seeks can introduce codec-delay/packet-boundary differences between
    # reference windows and rendered AAC, falsely reporting onset drift.
    import numpy as np
    key = (str(path), sample_rate)
    if key not in _PCM_CACHE:
        proc = subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(path),
             "-map", "0:a:0", "-vn", "-ac", "1", "-ar", str(sample_rate),
             "-f", "f32le", "pipe:1"], capture_output=True, timeout=120,
        )
        if proc.returncode != 0 or len(proc.stdout) < 4 or len(proc.stdout) % 4:
            raise RuntimeError(f"Could not decode audio from {path}")
        _PCM_CACHE[key] = np.frombuffer(proc.stdout, np.float32)
    first = round(start * sample_rate)
    count = round(duration * sample_rate)
    samples = _PCM_CACHE[key][first:first + count]
    if samples.size != count:
        raise RuntimeError(f"Audio window exceeds decoded file at {start:.3f}s: {path}")
    return samples


def _correlation(left, right) -> float:
    n = min(len(left), len(right))
    if n < 2:
        return 0.0
    left, right = left[:n], right[:n]
    ml = math.fsum(left) / n
    mr = math.fsum(right) / n
    dl = [x - ml for x in left]
    dr = [x - mr for x in right]
    vl = math.fsum(x * x for x in dl)
    vr = math.fsum(x * x for x in dr)
    if vl <= 1e-20 or vr <= 1e-20:
        return 1.0 if all(abs(a - b) <= 1e-6 for a, b in zip(left, right)) else 0.0
    return math.fsum(a * b for a, b in zip(dl, dr)) / math.sqrt(vl * vr)


def _media_fps(meta: dict) -> float:
    for stream in meta.get("streams", []):
        if stream.get("codec_type") != "video":
            continue
        for key in ("avg_frame_rate", "r_frame_rate"):
            try:
                value = float(Fraction(stream[key]))
                if value > 0:
                    return value
            except (KeyError, ValueError, ZeroDivisionError):
                pass
    return 30.0


def _verify_timing(source: Path, music: Path, output: Path,
                   events: list[dict], fps: float) -> tuple[list[str], bool]:
    import numpy as np
    lines = ["Timing evidence (decoded media; original game and music references):"]
    if not events:
        return lines + ["[WARN] no event anchors in timing.json"], False
    all_ok = True
    frame_dt = 1.0 / fps
    for i, event in enumerate(events, 1):
        source_t = float(event.get("source_visual_event", event["source_event"]))
        output_t = float(event.get("predicted_visual_event", event["output_event"]))
        audio_output_t = float(event.get("predicted_audio_event", event["output_event"]))
        reference = _gray_frame(source, source_t)
        video_trials = []
        for shift in range(-2, 3):
            candidate_t = output_t + shift * frame_dt
            if candidate_t < 0:
                continue
            score = _correlation(reference, _gray_frame(output, candidate_t))
            video_trials.append((score, shift))
        video_score, video_shift = max(video_trials, key=lambda row: (row[0], -abs(row[1])))
        video_ok = video_score >= 0.70 and abs(video_shift) <= 1

        audio_ok = False
        audio_score = 0.0
        audio_shift = 99
        if "music_event" in event:
            music_t = float(event["music_event"])
            before, length = 0.20, 0.40
            if music_t >= before and audio_output_t >= before:
                music_ref = _mono_audio(music, music_t - before, length)
                audio_trials = []
                for shift in range(-2, 3):
                    start = audio_output_t - before + shift * frame_dt
                    if start < 0:
                        continue
                    heard = _mono_audio(output, start, length)
                    audio_trials.append((_correlation(music_ref, heard), shift))
                if audio_trials:
                    audio_score, audio_shift = max(
                        audio_trials, key=lambda row: (row[0], -abs(row[1]))
                    )
                    audio_ok = audio_score >= 0.20 and abs(audio_shift) <= 1

        # Verify the source gunshot in the mix separately from the song/HUD.
        # Short attack windows reduce interference from neighboring shots.
        source_audio_t = float(event.get("source_audio_event", event["source_event"]))
        shot_ref = _mono_audio(source, source_audio_t - .100, .300, 48000)
        music_ref_joint = _mono_audio(music, float(event['music_event']) - .100, .300, 48000)
        shot_trials = []
        mixed_trials = []
        heard_window = _mono_audio(output, audio_output_t - .130, .360, 48000)
        references = np.stack([shot_ref, music_ref_joint], axis=1)
        for shift_ms in range(-30, 31):
            first_sample = (30 + shift_ms) * 48
            heard = heard_window[first_sample:first_sample + 14400]
            shot_trials.append((_correlation(shot_ref, heard), shift_ms))
            gains = np.linalg.lstsq(references, np.asarray(heard), rcond=None)[0]
            fitted = references @ gains
            mixed_trials.append((_correlation(fitted, heard), shift_ms, gains))
        shot_score, shot_shift_ms = max(shot_trials, key=lambda row: (row[0], -abs(row[1])))
        shot_ok = shot_score >= .20 and abs(shot_shift_ms) <= 1000 / fps
        mixed_score, mixed_shift_ms, mixed_gains = max(
            mixed_trials, key=lambda row: (row[0], -abs(row[1])))
        mixed_ok = (mixed_score >= .85 and abs(mixed_shift_ms) <= 1000 / fps
                    and all(float(gain) > .01 for gain in mixed_gains))
        event_ok = video_ok and shot_ok and mixed_ok
        all_ok = all_ok and event_ok
        lines.append(
            f"[{ 'PASS' if video_ok else 'FAIL' }] event {i} video frame "
            f"correlation={video_score:.3f}, offset={video_shift:+d} frame(s)"
        )
        lines.append(
            f"[{ 'PASS' if audio_ok else 'WARN' }] event {i} music-only correlation (masking-sensitive) "
            f"correlation={audio_score:.3f}, offset={audio_shift:+d} frame(s)"
        )
        lines.append(
            f"[{ 'PASS' if shot_ok else 'FAIL' }] event {i} source-gunshot "
            f"correlation={shot_score:.3f}, offset={shot_shift_ms:+d} ms"
        )
        lines.append(
            f"[{ 'PASS' if mixed_ok else 'FAIL' }] event {i} original-game+music mix "
            f"correlation={mixed_score:.3f}, offset={mixed_shift_ms:+d} ms, "
            f"positive source/music gains={all(float(g) > .01 for g in mixed_gains)}"
        )
    return lines, all_ok


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('project', type=Path)
    parser.add_argument('--bot', type=Path, default=Path('E:/ai-video-editor'))
    args = parser.parse_args()
    job = args.project.resolve()
    if not job.is_file():
        raise ValueError('Project JSON does not exist')
    for tool in ('ffmpeg', 'ffprobe'):
        if not shutil.which(tool):
            raise RuntimeError(f'{tool} is not in PATH')
    d = json.loads(job.read_text(encoding='utf-8'))
    if d.get('name') != 'aside_sync_proof' or not d.get('segments'):
        raise ValueError('Use only a project from the sync-proof builder')
    if (d.get('transition') or d.get('overlays') or d.get('sfx') or
        d.get('captions_mode') != 'off' or d.get('title', {}).get('enabled') or
        d.get('outro', {}).get('enabled') or d.get('audio_mode') != 'mix'):
        raise ValueError('Proof requires no effects/transitions/text and source+music mix')
    for seg in d['segments']:
        if (seg.get('speed', 1) != 1 or seg.get('motion', 'none') != 'none' or
            seg.get('flash') or any(seg.get(k, 0) for k in ('ramp_in', 'ramp_out', 'ramp_hold'))):
            raise ValueError('Proof must keep constant 1x speed without effects')
    def probe(p: Path) -> dict:
        if not p.is_absolute() or not p.is_file():
            raise ValueError(f'Expected existing absolute media path: {p}')
        proc = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format',
                               '-of', 'json', str(p)], capture_output=True, text=True,
                              check=True, timeout=30)
        return json.loads(proc.stdout)
    source = probe(Path(d['source']))
    music = probe(Path(d['music']))
    if not any(s.get('codec_type') == 'audio' for s in source.get('streams', [])):
        raise ValueError('Source game audio required to check impact sync')
    if not any(s.get('codec_type') == 'video' for s in source.get('streams', [])):
        raise ValueError('Source video required')
    if not any(s.get('codec_type') == 'audio' for s in music.get('streams', [])):
        raise ValueError('Music audio required')
    sd = float(source['format']['duration'])
    md = float(music['format']['duration'])
    duration = sum(s['end'] - s['start'] for s in d['segments'])
    if duration > 12.001 or any(s['start'] < 0 or s['end'] > sd + .001 or s['end'] <= s['start'] for s in d['segments']):
        raise ValueError('Proof exceeds duration/source bounds')
    if d.get('music_start', 0) < 0 or d.get('music_start', 0) + duration > md + .001:
        raise ValueError('Music excerpt exceeds file duration')
    bot = args.bot.resolve()
    if not (bot / 'aive' / 'render.py').is_file():
        raise ValueError('Existing aive renderer not found')
    sys.path.insert(0, str(bot))
    from aive.project import Project
    from aive.render import render
    from aive.qa import verify
    out = job.parent / 'sync-proof.mp4'
    if out.exists():
        raise FileExistsError('Output already exists; build a new versioned job')
    project = Project.load(job)
    result = render(project, str(out), encoder='libx264', quality=20, ass_path=None)
    (job.parent / 'filtergraph.txt').write_text(result.filtergraph, encoding='utf-8')
    (job.parent / 'render-args.json').write_text(json.dumps(result.args, indent=2), encoding='utf-8')
    report = verify(str(out), want_audio=True, text_times=None, black_times=None)
    timing_path = job.parent / 'timing.json'
    if timing_path.is_file():
        timing = json.loads(timing_path.read_text(encoding='utf-8-sig'))
        timing_lines, timing_ok = _verify_timing(
            Path(d['source']), Path(d['music']), out,
            timing.get('events', []), _media_fps(probe(out)),
        )
    else:
        timing_lines, timing_ok = ["[FAIL] timing.json is missing"], False
    message = report.render() + '\n\n' + '\n'.join(timing_lines) + '\n'
    message += f"\nOVERALL: {'PASS' if report.ok and timing_ok else 'FAIL'}\n"
    (job.parent / 'qa.txt').write_text(message, encoding='utf-8')
    print(message)
    print(f'Rendered file: {out}')
    return 0 if report.ok and timing_ok else 1


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f'FAILED: {exc}', file=sys.stderr)
        raise SystemExit(1)
