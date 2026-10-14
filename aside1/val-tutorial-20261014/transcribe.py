#!/usr/bin/env python3
"""Transcribe the user's reference tutorials with the pinned local model.

Reference/analysis tool ONLY - it is not part of the editor pipeline and makes no
claims about footage, lyrics or sync. The user supplied these tutorial videos as
reference material for how professional Valorant montages are edited (main branch
`val tutorial/`), so the spoken instructions are turned into durable, timestamped
text next to this script instead of being re-watched every session.

Local-only by design: the pinned faster-whisper small.en model that already ships
in `setup/models/` is used with CPU int8. Nothing is uploaded anywhere and no
cloud transcription is involved.

Usage:
    python3 transcribe.py <video> [<video> ...] [--out transcripts]

Writes <out>/<slug>.md (readable, [mm:ss] per segment) and
<out>/<slug>.json (exact segment start/end/text) per video. Existing outputs are
skipped, so re-running only transcribes what is missing.
"""
import argparse
import json
import re
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
MODEL_DIR = REPO / "setup" / "models" / "faster-whisper-small.en-d1d751a5"


def slug(name):
    stem = Path(name).stem
    stem = stem.split("_", 3)[-1] if stem.startswith("YTDown") else stem
    return re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower()[:60]


def stamp(seconds):
    minutes, rest = divmod(int(round(seconds)), 60)
    hours, minutes = divmod(minutes, 60)
    return f"{hours}:{minutes:02d}:{rest:02d}" if hours else f"{minutes:02d}:{rest:02d}"


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("videos", nargs="+")
    parser.add_argument("--out", default="transcripts")
    parser.add_argument("--model", default=str(MODEL_DIR))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    if not Path(args.model).is_dir():
        sys.exit(f"pinned model directory missing: {args.model}")
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    todo = []
    for video in args.videos:
        path = Path(video)
        if not path.is_file():
            sys.exit(f"missing video: {path}")
        target = out / f"{slug(path.name)}.json"
        if target.exists() and not args.force:
            print(f"skip (exists): {target.name}", flush=True)
            continue
        todo.append((path, target))
    if not todo:
        return

    from faster_whisper import WhisperModel
    print(f"loading {args.model} (cpu/int8, 2 threads)", flush=True)
    model = WhisperModel(str(args.model), device="cpu", compute_type="int8", cpu_threads=2)
    for path, target in todo:
        started = time.time()
        print(f"\n=== {path.name} ===", flush=True)
        segments, info = model.transcribe(str(path), language="en", beam_size=5,
                                          vad_filter=True, condition_on_previous_text=False)
        rows = []
        for segment in segments:
            rows.append(dict(start=round(segment.start, 3), end=round(segment.end, 3),
                             text=segment.text.strip()))
            if len(rows) % 25 == 0:
                print(f"  {stamp(segment.start)}  ({time.time()-started:.0f}s elapsed)", flush=True)
        duration = max((row["end"] for row in rows), default=0.0)
        target.write_text(json.dumps(dict(video=str(path), duration_seconds=round(duration, 3),
                                          model=Path(args.model).name, segments=rows), indent=1),
                          encoding="utf-8")
        markdown = [f"# {path.stem}", "",
                    f"Source: `{path.name}` · {stamp(duration)} · transcribed locally with "
                    f"`{Path(args.model).name}` (unreviewed machine transcript).", ""]
        for row in rows:
            markdown.append(f"- **[{stamp(row['start'])}]** {row['text']}")
        (target.with_suffix(".md")).write_text("\n".join(markdown) + "\n", encoding="utf-8")
        print(f"wrote {target.name} (+ .md): {len(rows)} segments in {time.time()-started:.0f}s", flush=True)


if __name__ == "__main__":
    main()
