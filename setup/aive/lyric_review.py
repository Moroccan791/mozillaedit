"""Bounded local lyric review handoff, never a LyricTrack or finalizer.

prepare_lyric_review raises MusicLyricsError on invalid/stale candidates.
audit_lyric_review returns a read-only report; malformed inputs are issues.
A structurally ready report means supplied assertions are internally consistent,
NOT authenticated listening, sung accuracy, or permission to promote a track.
Coverage is explicit sample-zero decoded-prefix intervals, not full-song coverage.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
import re
import tempfile
import time
from pathlib import Path

from .music_lyrics import (AUDIO_EXTENSIONS, Limits, MAX_RESULT_BYTES, MAX_WORDS,
                           MusicLyricsError, SAMPLE_RATE, SCHEMA as CANDIDATE_SCHEMA,
                           _decode_music, _finite, _hash_source, _validated_words)

SCHEMA = "music-lyric-review/v1"
AUDIT_SCHEMA = "music-lyric-review-audit/v1"
MAX_DEPTH = 16
MAX_NODES = 100000
CLOCK = "selected_music_first_decoded_sample"
LIMITATIONS = [
    "Candidate transcription is UNVERIFIED; inspect the exact selected music independently.",
    "Coverage is limited to the decoded sample-zero prefix, possibly truncated, not the whole song.",
    "Reviewer, method, corrections and completion claims are supplied, not authenticated.",
    "This handoff and audit never create or verify a lyric-track or promote alignment.",
]


def _json_copy(value):
    """Reject non-JSON, cycles and excessive work before encoding/copying."""
    nodes, budget, active = 0, 0, set()

    def visit(item, depth):
        nonlocal nodes, budget
        nodes += 1
        if depth > MAX_DEPTH or nodes > MAX_NODES:
            raise MusicLyricsError("review JSON exceeds depth/node bound")
        kind = type(item)
        if kind is str:
            budget += len(item)
        elif kind is float:
            if not math.isfinite(item):
                raise MusicLyricsError("review JSON requires finite numbers")
            budget += 32
        elif kind is int:
            if item.bit_length() > 64:
                raise MusicLyricsError("review JSON integer exceeds bound")
            budget += 24
        elif item is None or kind is bool:
            budget += 5
        elif kind in (list, dict):
            if id(item) in active:
                raise MusicLyricsError("review JSON cycle forbidden")
            if len(item) > MAX_NODES:
                raise MusicLyricsError("review JSON collection exceeds count bound")
            active.add(id(item))
            budget += len(item) + 2
            if kind is dict:
                for key, child in item.items():
                    if type(key) is not str:
                        raise MusicLyricsError("review JSON requires string keys")
                    visit(key, depth + 1)
                    visit(child, depth + 1)
            else:
                for child in item:
                    visit(child, depth + 1)
            active.remove(id(item))
        else:
            raise MusicLyricsError("review requires plain JSON values")
        if budget > MAX_RESULT_BYTES:
            raise MusicLyricsError("review JSON exceeds byte bound")

    visit(value, 0)
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":"),
                         ensure_ascii=True, allow_nan=False).encode("ascii")
    if len(encoded) > MAX_RESULT_BYTES:
        raise MusicLyricsError("review JSON exceeds byte bound")
    return json.loads(encoded), hashlib.sha256(encoded).hexdigest()


def _same_json(left, right):
    # Python equality aliases false/0 and true/1; identity fields must not.
    return json.dumps(left, sort_keys=True, separators=(",", ":"), ensure_ascii=True) == json.dumps(
        right, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def _keys(value, keys, name):
    if type(value) is not dict or set(value) != set(keys):
        raise MusicLyricsError(f"{name} schema fields mismatch")


def _capture(selected_music, limits, ffmpeg, ffprobe):
    if not isinstance(selected_music, (str, os.PathLike)):
        raise MusicLyricsError("select an explicit music audio path")
    source = Path(selected_music).expanduser().resolve()
    if source.suffix.lower() not in AUDIO_EXTENSIONS or re.search(
            r"(?:^|[\\/_. -])(gameplay|game|raw|capture|recording)(?:$|[\\/_. -])", str(source), re.I):
        raise MusicLyricsError("select original audio-only MUSIC, not gameplay/raw/video")
    if not source.is_file():
        raise MusicLyricsError("selected music must be an existing regular audio file")
    if not isinstance(limits, Limits):
        raise MusicLyricsError("limits must be a validated Limits object")
    digest, size = _hash_source(source, limits.source_bytes, time.monotonic() + limits.decode_timeout)
    with tempfile.TemporaryDirectory(prefix="aive-lyric-review-") as directory:
        decode = _decode_music(source, Path(directory) / "selected-music.wav", limits, ffmpeg, ffprobe)
    after = _hash_source(source, limits.source_bytes, time.monotonic() + limits.decode_timeout)
    if after != (digest, size):
        raise MusicLyricsError("selected music changed during review decode")
    return digest, {"path": str(source), "kind": "selected_music", "bytes": size}, decode


def _candidate_words(candidates, duration):
    words = candidates.get("words")
    if type(words) is not list or len(words) > MAX_WORDS:
        raise MusicLyricsError("candidate words exceed count bound or are not a list")
    for word in words:
        _keys(word, ("text", "start", "end", "gap_before"), "candidate word")
    validated = _validated_words(
        ({"word": w["text"], "start": w["start"], "end": w["end"]} for w in words), duration)
    # Canonical extraction shape, including recomputed gaps; never silently trim.
    if words != validated or any(type(w["gap_before"]) not in (int, float) for w in words):
        raise MusicLyricsError("candidate word text/gap mismatch")
    return validated


def prepare_lyric_review(candidates, selected_music, *, ffmpeg="ffmpeg", ffprobe="ffprobe", limits=None):
    """Create editable PENDING JSON from an exact, freshly rebound candidate object.

    Use the same Limits.decode_seconds as extraction. No decoding implementation,
    ASR runtime, converter, finalizer or implicit coverage is included here.
    """
    document, digest = _json_copy(candidates)
    if type(document) is not dict or document.get("schema") != CANDIDATE_SCHEMA:
        raise MusicLyricsError("candidate schema mismatch")
    if document.get("status") != "UNVERIFIED" or type(document.get("provenance")) is not dict or document["provenance"].get("alignment_verified") is not False:
        raise MusicLyricsError("candidate must be explicitly UNVERIFIED")
    limits = Limits() if limits is None else limits
    audio, source, decode = _capture(selected_music, limits, ffmpeg, ffprobe)
    if document.get("audio_sha256") != audio or not _same_json(document.get("source"), source):
        raise MusicLyricsError("candidate source identity mismatch")
    # Compare all decoded evidence, including the exact prefix limit and PCM hash.
    if not _same_json(document.get("decode"), decode):
        raise MusicLyricsError("candidate PCM/decode prefix identity mismatch")
    words = _candidate_words(document, decode["duration"])
    review = {"schema": SCHEMA, "status": "PENDING", "alignment_verified": False,
              "candidate_sha256": digest, "audio_sha256": audio, "source": source,
              "decode": decode, "coverage_clock": CLOCK, "coverage": [],
              "reviewer": None, "method": None, "limitations": LIMITATIONS.copy(),
              "entries": [{"candidate_index": i,
                           "original": {k: word[k] for k in ("text", "start", "end")},
                           "disposition": "pending", "correction": None}
                          for i, word in enumerate(words)],
              "additions": []}
    return _json_copy(review)[0]


def _description(value, name):
    if type(value) is not str or not value.strip() or len(value) > 1000 or any(
            ord(c) < 32 or 127 <= ord(c) < 160 or c in "\u2028\u2029" for c in value):
        raise MusicLyricsError(f"{name} requires 1..1000 safe text characters")


def _coverage(value, duration):
    if type(value) is not list or len(value) > MAX_WORDS:
        raise MusicLyricsError("coverage exceeds count bound or is not a list")
    previous = 0.0
    for pair in value:
        if type(pair) is not list or len(pair) != 2:
            raise MusicLyricsError("coverage requires [start,end] pairs")
        start = _finite(pair[0], "coverage start", 0, duration)
        end = _finite(pair[1], "coverage end", 0, duration)
        if start < previous or end <= start:
            raise MusicLyricsError("coverage is unsorted/overlapping or empty")
        previous = end
    return value


def _covered(word, coverage):
    return any(a <= word["start"] and word["end"] <= b for a, b in coverage)


def _safe_word(word, duration):
    _keys(word, ("text", "start", "end"), "corrected/additional word")
    validated = _validated_words([{"word": word["text"], "start": word["start"], "end": word["end"]}], duration)[0]
    if word["text"] != validated["text"]:
        raise MusicLyricsError("corrected/additional text requires canonical nonblank text")
    return word


def audit_lyric_review(review, candidates, selected_music, *, ffmpeg="ffmpeg", ffprobe="ffprobe", limits=None):
    """Validate supplied edits, read-only. Errors keep PENDING; never verified.

    Every original has exactly one pending/corrected/rejected disposition. A
    corrected entry has correction={text,start,end}; rejected/pending has None.
    additions=[{text,start,end}, ...] explicitly accounts for supplied missed words.
    Nonpending originals and all retained corrections/additions must be covered.
    The output contains counts/issues only, never a track or accepted word list.
    """
    report = {"schema": AUDIT_SCHEMA, "status": "PENDING", "alignment_verified": False,
              "claims_authenticated": False, "issues": [], "pending": [],
              "counts": {"pending": 0, "corrected": 0, "rejected": 0, "additions": 0},
              "limitations": LIMITATIONS.copy()}
    try:
        supplied, _ = _json_copy(review)
        expected = prepare_lyric_review(candidates, selected_music, ffmpeg=ffmpeg, ffprobe=ffprobe, limits=limits)
        _keys(supplied, expected.keys(), "review")
        for key in ("schema", "status", "candidate_sha256", "audio_sha256", "source", "decode", "coverage_clock"):
            if not _same_json(supplied[key], expected[key]):
                raise MusicLyricsError(f"review {key} mismatch")
        if supplied["alignment_verified"] is not False:
            raise MusicLyricsError("review alignment_verified must remain false")
        duration = expected["decode"]["duration"]
        coverage = _coverage(supplied["coverage"], duration)
        if not coverage:
            report["pending"].append("explicit decoded-prefix coverage missing")
        for field in ("reviewer", "method"):
            if supplied[field] is None:
                report["pending"].append(f"{field} missing")
            else:
                _description(supplied[field], field)
        limitations = supplied["limitations"]
        if type(limitations) is not list or len(limitations) > 32:
            raise MusicLyricsError("limitations must be a bounded list")
        if not limitations:
            report["pending"].append("limitations missing")
        for text in limitations:
            _description(text, "limitation")
        entries = supplied["entries"]
        if type(entries) is not list or len(entries) != len(expected["entries"]):
            raise MusicLyricsError("every original candidate requires exactly one disposition")
        retained = []
        for entry, original in zip(entries, expected["entries"]):
            _keys(entry, original.keys(), "review entry")
            if type(entry["candidate_index"]) is not int or entry["candidate_index"] != original["candidate_index"] or not _same_json(entry["original"], original["original"]):
                raise MusicLyricsError("original candidate index/text/time mismatch")
            disposition = entry["disposition"]
            if type(disposition) is not str or disposition not in ("pending", "corrected", "rejected"):
                raise MusicLyricsError("invalid candidate disposition")
            report["counts"][disposition] += 1
            if disposition != "pending" and not _covered(original["original"], coverage):
                raise MusicLyricsError("original disposition outside reviewed coverage")
            if disposition == "corrected":
                word = _safe_word(entry["correction"], duration)
                if not _covered(word, coverage):
                    raise MusicLyricsError("corrected word outside reviewed coverage")
                retained.append(word)
            elif entry["correction"] is not None:
                raise MusicLyricsError("only corrected dispositions may supply correction")
        additions = supplied["additions"]
        if type(additions) is not list or len(additions) + len(entries) > MAX_WORDS:
            raise MusicLyricsError("additions/entries exceed combined word count bound")
        for addition in additions:
            word = _safe_word(addition, duration)
            if not _covered(word, coverage):
                raise MusicLyricsError("additional word outside reviewed coverage")
            retained.append(word)
        report["counts"]["additions"] = len(additions)
        # Sorting only a private validation list does not alter supplied order/data.
        _validated_words(({"word": w["text"], "start": w["start"], "end": w["end"]}
                          for w in sorted(retained, key=lambda w: w["start"])), duration)
        if report["counts"]["pending"]:
            report["pending"].append("original candidate dispositions remain pending")
        if not report["pending"]:
            report["status"] = "structurally_ready_for_independent_track"
    except (MusicLyricsError, OSError, RuntimeError, RecursionError) as exc:
        report["issues"].append(str(exc)[:1000])
    return report
