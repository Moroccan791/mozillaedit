"""Transcription via faster-whisper (free, local). Optional.

If faster-whisper isn't installed, callers get a clear, friendly error and the
pipeline continues without a transcript (rule-based cutting still works).
"""
from __future__ import annotations

import json
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class Word:
    start: float
    end: float
    text: str


@dataclass
class Transcript:
    language: str
    segments: list[Word]
    path: str = ""

    def to_dict(self) -> dict:
        return {"language": self.language,
                "segments": [asdict(s) for s in self.segments]}

    def text(self) -> str:
        return " ".join(s.text.strip() for s in self.segments)


def available() -> bool:
    import importlib.util

    return importlib.util.find_spec("faster_whisper") is not None


def transcribe(path: str, model_size: str = "base", device: str = "cpu",
               language: str | None = None) -> Transcript:
    """Transcribe a media file. Requires `pip install faster-whisper`."""
    if not available():
        raise RuntimeError(
            "faster-whisper not installed. Install with:\n"
            "  pip install faster-whisper\n"
            "(free, runs on CPU; models download on first use)"
        )
    from faster_whisper import WhisperModel  # type: ignore

    model = WhisperModel(model_size, device=device, compute_type="int8")
    segments, info = model.transcribe(path, language=language, vad_filter=True)
    words: list[Word] = []
    for seg in segments:
        words.append(Word(start=round(seg.start, 3),
                          end=round(seg.end, 3),
                          text=seg.text.strip()))
    return Transcript(language=info.language, segments=words)


def save(tr: Transcript, path: str | Path) -> Path:
    p = Path(path)
    p.write_text(json.dumps(tr.to_dict(), indent=2), encoding="utf-8")
    return p


def load(path: str | Path) -> Transcript:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    return Transcript(
        language=data.get("language", ""),
        segments=[Word(**s) for s in data.get("segments", [])],
        path=str(path),
    )
