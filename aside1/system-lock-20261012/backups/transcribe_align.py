"""Legacy diagnostic only: LOCAL forced alignment -> UNVERIFIED candidates.

Not the supported lyric pipeline and never an accepted LyricTrack. Example:
  python transcribe_align.py --music song.mp3 --text lyrics.txt \
      --model-checkpoint local-base.pt --out new-candidates.json
No implicit song, model download, transcription fallback, or overwrite.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib
import json
import math
import numbers
import os
import sys
import tempfile
import uuid
import warnings
from pathlib import Path

# Historical paths are retained for identification, not CLI defaults.
MP3 = r"E:\audio\YTDown.com_YouTube_Media_MpoZ0NVXswY_Let-the-world-burn-Audio-Edit_009_128k.mp3"
LYR = r"E:\ai-video-editor\lyrics.txt"
OUT = r"E:\ai-video-editor\words.json"
SCHEMA = "legacy-alignment-candidates/v1"


class AlignmentError(ValueError):
    """Unsafe or incomplete diagnostic alignment; no candidate should be saved."""


def _field(item, name):
    return item.get(name) if isinstance(item, dict) else getattr(item, name, None)


def validate_words(raw_words):
    """Validate in provider order. Never sort, drop bad words, or round timings."""
    words, previous_end = [], 0.0
    for index, item in enumerate(raw_words):
        word = _field(item, "word")
        if not isinstance(word, str) or not word.strip():
            raise AlignmentError(f"word {index}: missing/empty text")
        start, end = _field(item, "start"), _field(item, "end")
        for name, value in (("start", start), ("end", end)):
            if (isinstance(value, bool) or not isinstance(value, numbers.Real)
                    or not math.isfinite(value)):
                raise AlignmentError(f"word {index}: {name} must be a finite number")
        start, end = float(start), float(end)
        if start < 0 or end <= start:
            raise AlignmentError(f"word {index}: requires nonnegative start and positive duration")
        if start < previous_end:
            raise AlignmentError(f"word {index}: out of order or overlapping previous word")
        words.append({"word": word.strip(), "start": start, "end": end})
        previous_end = end
    if not words:
        raise AlignmentError("alignment returned no words")
    return words


def _text_key(text):
    # Stable-ts may split contractions/punctuation differently. Require all
    # lexical characters in order, rather than assuming identical token counts.
    return "".join(char for char in text.casefold() if char.isalnum())


def candidate_words(result, expected_text):
    segments = _field(result, "segments")
    if not segments:
        raise AlignmentError("alignment returned no segments")
    raw = []
    for index, segment in enumerate(segments):
        segment_words = _field(segment, "words")
        if not segment_words:
            raise AlignmentError(f"segment {index}: missing word alignment")
        raw.extend(segment_words)
    words = validate_words(raw)
    expected = _text_key(expected_text)
    actual = _text_key(" ".join(word["word"] for word in words))
    if not expected or actual != expected:
        raise AlignmentError("partial or mismatched alignment: selected lyric text not fully returned")
    return words


def _hash_file(source):
    digest = hashlib.sha256()
    with source.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _load_local_model(checkpoint):
    checkpoint = Path(checkpoint).resolve(strict=True)
    if not checkpoint.is_file():
        raise AlignmentError("model checkpoint must be an existing LOCAL file (no downloads)")
    # Import only when explicitly executing diagnostic alignment.
    stable_whisper = importlib.import_module("stable_whisper")
    return stable_whisper.load_model(str(checkpoint))


def align_candidate(music, text_path, *, model=None, model_checkpoint=None, language="en"):
    music, text_path = Path(music).resolve(strict=True), Path(text_path).resolve(strict=True)
    if not music.is_file() or not text_path.is_file():
        raise AlignmentError("selected music and lyric text must be local files")
    text_bytes = text_path.read_bytes()
    text = text_bytes.decode("utf-8-sig").strip()
    if not _text_key(text):
        raise AlignmentError("selected lyric text is empty")
    digest = _hash_file(music)
    if model is None:
        if model_checkpoint is None:
            raise AlignmentError("explicit existing LOCAL --model-checkpoint required; no downloads")
        model = _load_local_model(model_checkpoint)
    try:
        # Installed providers have returned partial results with UserWarning,
        # including 'Failed to align the last ... words' and failed segments.
        # Conservatively reject ALL alignment warnings, even with valid times.
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            result = model.align(str(music), text, language=language)
        if caught:
            details = "; ".join(str(item.message) for item in caught)
            raise AlignmentError(f"provider alignment warning; discard candidate: {details}")
    except AlignmentError:
        raise
    except Exception as exc:
        raise AlignmentError(f"alignment failed; no transcription fallback: {exc}") from exc
    words = candidate_words(result, text)
    if _hash_file(music) != digest or text_path.read_bytes() != text_bytes:
        raise AlignmentError("selected music or lyric text changed during alignment")
    return {
        "schema": SCHEMA, "status": "UNVERIFIED", "audio_sha256": digest,
        "source": {"path": str(music), "kind": "selected_music"},
        "words": words,
        "provenance": {
            "alignment_verified": False, "accepted_lyric_track": False,
            "method": "legacy forced alignment diagnostic", "provider": "stable_whisper" if model_checkpoint else "injected_local",
            "model_checkpoint": str(model_checkpoint) if model_checkpoint else None,
            "language": language, "text_path": str(text_path),
            "text_sha256": hashlib.sha256(text_bytes).hexdigest(),
        },
        "warnings": ["UNVERIFIED diagnostic candidate, NOT an accepted LyricTrack.",
                     "Valid intervals do not prove lyric/music correctness; listen against the exact selected music before manual acceptance."],
    }


def write_candidate(document, output):
    """Validate before any write; atomically publish without replacing a file."""
    if (document.get("schema") != SCHEMA or document.get("status") != "UNVERIFIED"
            or document.get("provenance", {}).get("alignment_verified") is not False
            or document.get("provenance", {}).get("accepted_lyric_track") is not False):
        raise AlignmentError("only explicitly UNVERIFIED legacy candidates may be saved")
    validated = dict(document, words=validate_words(document.get("words", [])))
    payload = json.dumps(validated, indent=2, ensure_ascii=False, allow_nan=False) + "\n"
    output = Path(output).resolve()
    if output.exists():
        raise AlignmentError(f"refusing to overwrite existing output: {output}")
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent,
                                         prefix=".legacy-align-", suffix=".tmp", delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(payload)
            stream.flush()
            os.fsync(stream.fileno())
        # Unlike replace/rename, link cannot overwrite an output created by a
        # competing process. If the filesystem lacks hardlinks, fail closed.
        os.link(temporary, output)
    except OSError as exc:
        raise AlignmentError(f"candidate publication failed; no output overwrite: {exc}") from exc
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    return output


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--music", required=True, type=Path, help="explicitly selected LOCAL music file")
    parser.add_argument("--text", required=True, type=Path, help="selected UTF-8 lyric text file")
    parser.add_argument("--model-checkpoint", required=True, type=Path, help="existing LOCAL stable-ts checkpoint; never a model name/download")
    parser.add_argument("--out", type=Path, help="NEW candidate path; existing files are never overwritten")
    parser.add_argument("--language", default="en")
    args = parser.parse_args(argv)
    output = args.out or args.text.parent / f"legacy-alignment-candidates.{uuid.uuid4().hex}.json"
    try:
        if output.resolve().exists():
            raise AlignmentError(f"refusing to overwrite existing output: {output}")
        document = align_candidate(args.music, args.text, model_checkpoint=args.model_checkpoint,
                                   language=args.language)
        saved = write_candidate(document, output)
    except Exception as exc:
        print(f"ERROR: legacy alignment rejected: {exc}. No success output saved; existing output preserved.", file=sys.stderr)
        return 1
    print(f"Saved UNVERIFIED legacy diagnostic candidate ({len(document['words'])} words): {saved}")
    print("NOT accepted lyrics; alignment_verified=False. No automatic pipeline promotion.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
