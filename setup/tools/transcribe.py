"""Word-level lyrics timing via faster-whisper (local, CPU).

Writes lyrics_words.json:
  {"audio":..., "language":..., "text":..., "words":[{start,end,word,prob}...]}

If a corrected lyrics file is supplied we do a lightweight forced alignment of
the known words onto the ASR word timeline (DP over normalized characters) so
timing comes from the audio, not from a possibly-wrong transcript.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np

MODEL_CACHE: dict[str, object] = {}
FFMPEG = "ffmpeg"


def decode16k(path: str) -> np.ndarray:
    """Decode any media to mono float32 @16kHz via FFmpeg (no PyAV needed)."""
    proc = subprocess.run(
        [FFMPEG, "-v", "quiet", "-i", path, "-f", "f32le",
         "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True,
    )
    return np.frombuffer(proc.stdout, dtype=np.float32).copy()


def _model(size: str):
    from faster_whisper import WhisperModel

    if size not in MODEL_CACHE:
        MODEL_CACHE[size] = WhisperModel(size, device="cpu", compute_type="int8")
    return MODEL_CACHE[size]


def transcribe(audio: str, size: str = "small", language: str | None = None) -> dict:
    model = _model(size)
    pcm = decode16k(audio)
    segments, info = model.transcribe(
        pcm, language=language, word_timestamps=True,
        vad_filter=False, beam_size=5,
    )
    words = []
    full = []
    segs = []
    for seg in segments:
        segs.append({"start": round(seg.start, 3), "end": round(seg.end, 3),
                     "text": seg.text.strip()})
        full.append(seg.text.strip())
        for w in (seg.words or []):
            ww = w.word.strip()
            if ww:
                words.append({"start": round(w.start, 3), "end": round(w.end, 3),
                              "word": ww, "prob": round(float(w.probability), 3)})
    return {"audio": audio, "language": info.language,
            "text": " ".join(full), "segments": segs, "words": words}


def _norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def align(known: str, asr: dict) -> dict:
    """DP forced alignment of known words onto ASR word timeline.

    Cost = char edit distance of normalized forms; times taken from matched ASR
    words; unmatched known words interpolate between neighbours.
    """
    kwords = [w for w in known.split() if w.strip()]
    awords = asr["words"]
    if not awords:
        return {"words": [], "note": "no ASR words"}
    n, m = len(kwords), len(awords)
    INF = float("inf")
    dp = [[INF] * (m + 1) for _ in range(n + 1)]
    bt = [[0] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = 0
    for i in range(n + 1):
        for j in range(m + 1):
            if i < n and dp[i][j] < INF:  # skip a known word (free)
                if dp[i][j] < dp[i + 1][j]:
                    dp[i + 1][j] = dp[i][j]
                    bt[i + 1][j] = 1
            if j < m and dp[i][j] < INF:  # skip an ASR word (small penalty)
                c = dp[i][j] + 0.6
                if c < dp[i][j + 1]:
                    dp[i][j + 1] = c
                    bt[i][j + 1] = 2
            if i < n and j < m and dp[i][j] < INF:  # match
                a, b = _norm(kwords[i]), _norm(awords[j]["word"])
                d = sum(1 for x, y in zip(a, b) if x != y) + abs(len(a) - len(b))
                d = d / max(1, max(len(a), len(b)))
                c = dp[i][j] + d
                if c < dp[i + 1][j + 1]:
                    dp[i + 1][j + 1] = c
                    bt[i + 1][j + 1] = 3
    i, j = n, m
    match = {}
    while i > 0 or j > 0:
        b = bt[i][j]
        if b == 3:
            match[i - 1] = awords[j - 1]
            i, j = i - 1, j - 1
        elif b == 2:
            j -= 1
        else:
            i -= 1
    out = []
    for i, w in enumerate(kwords):
        if i in match:
            out.append({"word": w, "start": match[i]["start"],
                        "end": match[i]["end"], "src": "asr"})
        else:
            out.append({"word": w, "start": None, "end": None, "src": "gap"})
    # interpolate gaps
    for i, o in enumerate(out):
        if o["start"] is None:
            prev = next((out[k] for k in range(i - 1, -1, -1) if out[k]["end"]), None)
            nxt = next((out[k] for k in range(i + 1, len(out)) if out[k]["start"]), None)
            if prev and nxt and prev["end"] and nxt["start"]:
                span = nxt["start"] - prev["end"]
                o["start"] = round(prev["end"] + span * 0.25, 3)
                o["end"] = round(prev["end"] + span * 0.6, 3)
            else:
                o["start"] = o["end"] = 0.0
        o.pop("src", None)
    return {"words": out, "note": "dp-aligned to ASR timeline"}


def main() -> None:
    ap = argparse.ArgumentParser(description="word-level lyrics timing")
    ap.add_argument("audio")
    ap.add_argument("-o", "--out", default=None)
    ap.add_argument("--model", default="small")
    ap.add_argument("--lang", default=None)
    ap.add_argument("--lyrics", default=None, help="corrected lyrics .txt for forced alignment")
    a = ap.parse_args()

    asr = transcribe(a.audio, a.model, a.lang)
    if a.lyrics:
        known = Path(a.lyrics).read_text(encoding="utf-8")
        asr["text"] = " ".join(known.split())
        asr["words"] = align(known, asr)["words"]
    out = a.out or (str(Path(a.audio).with_suffix("")) + "_words.json")
    Path(out).write_text(json.dumps(asr, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"lang={asr['language']} words={len(asr['words'])} -> {out}")
    print("TEXT:", asr["text"][:500])


if __name__ == "__main__":
    main()
