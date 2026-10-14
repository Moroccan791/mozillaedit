#!/usr/bin/env python3
"""Measure a reference edit's cut rhythm against its own music.

Reference/analysis tool ONLY - it is not part of the editor pipeline, promotes
nothing and certifies nothing. It answers one narrow mechanical question that
our own previews were rejected on: **where do an edit's cuts actually fall
relative to the song's measured acoustic attacks?**

Method (all local, no ML models):
  * frames: ffmpeg scene-change scores -> candidate cut times;
  * music: librosa onset-strength peaks -> measured acoustic attacks;
  * report: for every cut, distance to the nearest measured attack, plus the
    mean/median |offset|, the share of cuts inside +-50/100 ms, and the cut
    interval distribution.

The same detector is applied to our own rendered samples, so the numbers are
directly comparable to the reference tutorials the user supplied in
`val tutorial/` on main (kept out of git history here; see NOTES.md for what
was measured).

Usage:
    python3 analyze_edit.py <video> [<video> ...] [--out measurements]

Writes <out>/<slug>.json with the raw times and the summary. Bookkeeping, not a
quality claim: measured attacks are acoustic onsets, not certified meter, and
scene scores are a cut heuristic for screen-recorded/edit footage alike.
"""
import argparse
import json
import math
import re
import subprocess
import sys
from pathlib import Path

FFMPEG = "ffmpeg"
FFPROBE = "ffprobe"


def slug(name):
    stem = Path(name).stem
    stem = stem.split("_", 3)[-1] if stem.startswith("YTDown") else stem
    return re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower()[:60]


def probe_duration(path):
    out = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def cut_times(path, threshold=0.30):
    """Scene-change timestamps, in seconds. A hard cut scores far above a pan."""
    proc = subprocess.run(
        [FFMPEG, "-v", "info", "-nostdin", "-i", str(path),
         "-vf", f"select='gt(scene,{threshold})',showinfo", "-an", "-f", "null", "-"],
        capture_output=True, text=True)
    cuts = []
    for line in proc.stderr.splitlines():
        if "pts_time:" not in line:
            continue
        match = re.search(r"pts_time:([0-9.]+)", line)
        if match:
            cuts.append(round(float(match.group(1)), 4))
    return sorted(cuts)


def attacks(path, hop=512):
    """Measured acoustic attacks from the video's own audio track."""
    import librosa
    import numpy as np
    wav = Path("/tmp") / f"{slug(path.name)}-16k.wav"
    if not wav.exists():
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(path), "-vn",
                        "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(wav)], check=True)
    y, sr = librosa.load(str(wav), sr=16000, mono=True)
    onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    frames = librosa.onset.onset_detect(onset_envelope=onset, sr=sr, hop_length=hop,
                                        backtrack=False, units="frames", delta=0.02)
    times = librosa.frames_to_time(frames, sr=sr, hop_length=hop)
    tempo, _beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=hop, units="time")
    return [round(float(t), 4) for t in times], float(np.atleast_1d(tempo)[0])


def nearest(value, grid):
    if not grid:
        return None
    return min(abs(value - g) for g in grid)


def summarize(path, out_dir, threshold):
    duration = probe_duration(path)
    cuts = cut_times(path, threshold)
    onsets, tempo = attacks(path)
    offsets = [nearest(t, onsets) for t in cuts]
    offsets = [o for o in offsets if o is not None]
    gaps = [b - a for a, b in zip(cuts, cuts[1:])]
    summary = dict(
        video=str(path), duration_seconds=round(duration, 3),
        scene_threshold=threshold, cuts=len(cuts),
        measured_attacks=len(onsets), tempo_bpm_estimate=round(tempo, 2),
        cut_interval_seconds=dict(min=round(min(gaps), 3) if gaps else None,
                                  median=round(sorted(gaps)[len(gaps)//2], 3) if gaps else None,
                                  max=round(max(gaps), 3) if gaps else None),
        offset_to_nearest_attack_seconds=dict(
            mean=round(sum(offsets)/len(offsets), 4) if offsets else None,
            median=round(sorted(offsets)[len(offsets)//2], 4) if offsets else None,
            max=round(max(offsets), 4) if offsets else None,
            within_50ms=sum(1 for o in offsets if o <= .05),
            within_100ms=sum(1 for o in offsets if o <= .10),
            compared=len(offsets)),
        cut_times=cuts, attack_times=onsets)
    target = out_dir / f"{slug(path.name)}.json"
    target.write_text(json.dumps(summary, indent=1), encoding="utf-8")
    return summary, target


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("videos", nargs="+")
    parser.add_argument("--out", default="measurements")
    parser.add_argument("--threshold", type=float, default=0.30)
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    for video in args.videos:
        path = Path(video)
        if not path.is_file():
            sys.exit(f"missing video: {path}")
        summary, target = summarize(path, out, args.threshold)
        off = summary["offset_to_nearest_attack_seconds"]
        interval = summary["cut_interval_seconds"]
        print(f"{path.name[:56]:56s} {summary['duration_seconds']:7.1f}s  "
              f"{summary['cuts']:4d} cuts  {summary['measured_attacks']:5d} attacks  "
              f"~{summary['tempo_bpm_estimate']:6.2f} bpm  cut gap med {interval['median']}s  "
              f"|offset| mean {off['mean']}s  <=50ms {off['within_50ms']}/{off['compared']}  "
              f"<=100ms {off['within_100ms']}/{off['compared']}")
        print(f"   -> {target}")


if __name__ == "__main__":
    main()
