"""Optional LOCAL music-only lyric candidates. Never accepts/verifies a LyricTrack.

Explicitly selected MUSIC audio only. Content cannot prove that a WAV is music
rather than renamed gameplay audio. No seek: clock zero is first decoded sample.
"""
from __future__ import annotations

import hashlib
import importlib
import json
import math
import multiprocessing
import os
import re
import subprocess
import tempfile
import threading
import time
import wave
from dataclasses import dataclass
from pathlib import Path

SCHEMA = "music-lyric-candidates/v1"
AUDIO_EXTENSIONS = frozenset({".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg", ".oga", ".opus", ".aiff", ".aif", ".wma"})
SAMPLE_RATE = 16000
MAX_SECONDS = 600.0
MAX_SOURCE_BYTES = 512 * 1024 * 1024
MAX_WORDS = 6000
MAX_RESULT_BYTES = 4 * 1024 * 1024


class MusicLyricsError(ValueError):
    """Invalid selected source, decode, or unverified candidate intervals."""


class MusicLyricsUnavailable(MusicLyricsError):
    """Optional local model/provider or local FFmpeg is unavailable."""


def _finite(value, name, low, high):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise MusicLyricsError(f"{name} must be finite numeric")
    if not low <= value <= high:
        raise MusicLyricsError(f"{name} must be within [{low}, {high}]")
    return float(value)


@dataclass(frozen=True)
class Limits:
    decode_seconds: float = 600.0
    source_bytes: int = MAX_SOURCE_BYTES
    decode_timeout: float = 60.0
    provider_timeout: float = 120.0

    def __post_init__(self):
        _finite(self.decode_seconds, "decode_seconds", 1 / SAMPLE_RATE, MAX_SECONDS)
        _finite(self.decode_timeout, "decode_timeout", .01, 120)
        _finite(self.provider_timeout, "provider_timeout", .01, 600)
        if type(self.source_bytes) is not int or not 1 <= self.source_bytes <= MAX_SOURCE_BYTES:
            raise MusicLyricsError("source_bytes exceeds hard bound or is not a positive integer")


def _hash_source(source, limit, deadline):
    digest, count = hashlib.sha256(), 0
    with source.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            count += len(chunk)
            if count > limit or time.monotonic() > deadline:
                raise MusicLyricsError("selected music exceeds source byte/time bound")
            digest.update(chunk)
    if not count:
        raise MusicLyricsError("selected music is empty")
    return digest.hexdigest(), count


def _bounded_command(command, byte_limit, timeout):
    """Drain both pipes concurrently with strict output and wall-clock caps."""
    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except OSError as exc:
        raise MusicLyricsUnavailable("local FFmpeg/ffprobe executable unavailable") from exc
    output, errors, overflow = bytearray(), bytearray(), threading.Event()

    def drain(stream, target, bound):
        try:
            while True:
                chunk = stream.read(65536)
                if not chunk:
                    break
                room = max(0, bound - len(target))
                target.extend(chunk[:room])
                if len(chunk) > room:
                    overflow.set()
                    break
        finally:
            stream.close()

    threads = [threading.Thread(target=drain, args=(process.stdout, output, byte_limit), daemon=True),
               threading.Thread(target=drain, args=(process.stderr, errors, 65536), daemon=True)]
    for thread in threads:
        thread.start()
    deadline = time.monotonic() + timeout
    try:
        while process.poll() is None:
            if overflow.is_set():
                raise MusicLyricsError("FFmpeg/ffprobe output exceeds byte bound")
            if time.monotonic() > deadline:
                raise MusicLyricsError("FFmpeg/ffprobe time bound exceeded")
            time.sleep(.01)
    finally:
        if process.poll() is None:
            process.kill()
        process.wait(timeout=5)
        for thread in threads:
            thread.join(timeout=5)
    if overflow.is_set():
        raise MusicLyricsError("FFmpeg/ffprobe output exceeds byte bound")
    if any(thread.is_alive() for thread in threads):
        raise MusicLyricsError("FFmpeg/ffprobe pipes did not terminate")
    if process.returncode:
        raise MusicLyricsError("selected music probe/decode failed; no candidates produced")
    return bytes(output)


def _decode_music(source, pcm_path, limits, ffmpeg, ffprobe):
    probe = _bounded_command([str(ffprobe), "-v", "error", "-protocol_whitelist", "file,pipe", "-show_streams", "-of", "json", str(source)],
                             1024 * 1024, limits.decode_timeout)
    try:
        streams = json.loads(probe)["streams"]
        if not isinstance(streams, list) or not streams:
            raise ValueError()
        if any(s.get("codec_type") != "audio" for s in streams):
            raise MusicLyricsError("video/gameplay/non-audio streams forbidden; select audio-only music")
        if len(streams) != 1:
            raise MusicLyricsError("select an unambiguous single-stream music audio asset")
    except (KeyError, TypeError, ValueError, AttributeError) as exc:
        if isinstance(exc, MusicLyricsError):
            raise
        raise MusicLyricsError("selected music has no usable audio-only stream") from exc
    max_samples = math.floor(limits.decode_seconds * SAMPLE_RATE)
    pcm = _bounded_command([str(ffmpeg), "-nostdin", "-hide_banner", "-v", "error", "-xerror",
                            "-protocol_whitelist", "file,pipe", "-i", str(source), "-map", "0:a:0", "-vn", "-sn", "-dn",
                            "-t", str(max_samples / SAMPLE_RATE), "-ac", "1", "-ar", str(SAMPLE_RATE),
                            "-c:a", "pcm_s16le", "-f", "s16le", "pipe:1"],
                           max_samples * 2, limits.decode_timeout)
    if not pcm or len(pcm) % 2:
        raise MusicLyricsError("selected music did not decode to complete mono PCM samples")
    with wave.open(str(pcm_path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm)
    samples = len(pcm) // 2
    return {"method": "ffmpeg sample-zero mono pcm_s16le",
            "clock": "selected_music_first_decoded_sample", "start": 0.0,
            "sample_rate": SAMPLE_RATE, "channels": 1, "sample_count": samples,
            "duration": samples / SAMPLE_RATE, "pcm_sha256": hashlib.sha256(pcm).hexdigest(),
            "prefix_limit_seconds": max_samples / SAMPLE_RATE,
            "possibly_truncated": samples == max_samples}


def _field(item, name):
    return item.get(name) if isinstance(item, dict) else getattr(item, name, None)


def _validated_words(raw_words, duration):
    words, previous = [], 0.0
    for item in raw_words:
        if len(words) >= MAX_WORDS:
            raise MusicLyricsError("provider exceeds word count bound")
        text = _field(item, "word")
        if not isinstance(text, str) or not text.strip() or len(text) > 120:
            raise MusicLyricsError("candidate word must have 1..120 text characters")
        if any(c in "{}\\" or ord(c) < 32 or 127 <= ord(c) < 160 or c in "\u2028\u2029" for c in text):
            raise MusicLyricsError("candidate contains unsafe text controls")
        start = _finite(_field(item, "start"), "word start", 0, duration)
        end = _finite(_field(item, "end"), "word end", 0, duration)
        if end <= start or end - start > 15:
            raise MusicLyricsError("candidate requires positive word duration <=15s")
        if start < previous:
            raise MusicLyricsError("candidate words are unsorted or overlapping; never clamp or reorder")
        gap = start - previous
        _finite(gap, "word gap", 0, duration)
        words.append({"text": text.strip(), "start": start, "end": end, "gap_before": gap})
        previous = end
    return words


def _provider_worker(provider, model_directory, pcm_path, duration, result_path, language):
    """Killable worker. Provider receives temporary sample-zero PCM, never originals."""
    try:
        if provider is None:
            # Offline in the disposable worker, not global settings in the editor.
            os.environ["HF_HUB_OFFLINE"] = "1"
            os.environ["TRANSFORMERS_OFFLINE"] = "1"
            try:
                module = importlib.import_module("faster_whisper")
            except ImportError as exc:
                raise MusicLyricsUnavailable("optional faster-whisper unavailable; supply existing local model/dependency or injected local provider") from exc
            try:
                provider = module.WhisperModel(model_directory, device="cpu", compute_type="int8",
                                               local_files_only=True, cpu_threads=2, num_workers=1)
            except Exception as exc:
                raise MusicLyricsUnavailable("existing local faster-whisper model could not load; no download attempted") from exc
        result = provider.transcribe(str(pcm_path), word_timestamps=True, vad_filter=False,
                                     language=language, beam_size=1, best_of=1,
                                     condition_on_previous_text=False)
        segments = result[0]

        def raw_words():
            for index, segment in enumerate(segments):
                if index >= MAX_WORDS:
                    raise MusicLyricsError("provider exceeds segment count bound")
                words = _field(segment, "words")
                if words is None:
                    raise MusicLyricsError("provider returned no word timestamps; segment text is not lyrics")
                yield from words
        payload = {"words": _validated_words(raw_words(), duration)}
    except Exception as exc:
        payload = {"error": str(exc)[:1000], "unavailable": isinstance(exc, MusicLyricsUnavailable)}
    encoded = json.dumps(payload, ensure_ascii=True, allow_nan=False).encode("utf-8")
    if len(encoded) > MAX_RESULT_BYTES:
        encoded = b'{"error":"provider result exceeds byte bound"}'
    Path(result_path).write_bytes(encoded)


def _run_provider(provider, model_directory, pcm_path, duration, result_path, timeout, language):
    process = multiprocessing.get_context("spawn").Process(
        target=_provider_worker,
        args=(provider, model_directory, pcm_path, duration, result_path, language), daemon=True)
    try:
        process.start()
    except Exception as exc:
        raise MusicLyricsUnavailable("injected LOCAL provider must be spawn-picklable") from exc
    try:
        process.join(timeout)
        if process.is_alive():
            raise MusicLyricsError("local lyric provider time bound exceeded; worker terminated")
        if process.exitcode != 0 or not result_path.is_file():
            raise MusicLyricsError("local lyric provider exited without bounded candidates")
        if result_path.stat().st_size > MAX_RESULT_BYTES:
            raise MusicLyricsError("provider result exceeds byte bound")
        payload = json.loads(result_path.read_text(encoding="utf-8"))
        if "error" in payload:
            error_type = MusicLyricsUnavailable if payload.get("unavailable") else MusicLyricsError
            raise error_type(payload["error"])
        raw = [{"word": w["text"], "start": w["start"], "end": w["end"]} for w in payload["words"]]
        return _validated_words(raw, duration)
    finally:
        if process.is_alive():
            process.terminate()
            process.join(2)
        if process.is_alive():
            process.kill()
            process.join(2)
        process.close()


def _group_lines(words, gap):
    lines, indices = [], []
    def flush():
        if indices:
            lines.append({"text": " ".join(words[i]["text"] for i in indices),
                          "start": words[indices[0]]["start"], "end": words[indices[-1]]["end"],
                          "word_indices": indices.copy(), "status": "UNVERIFIED"})
            indices.clear()
    for index, word in enumerate(words):
        if indices and (word["gap_before"] > gap or len(indices) >= 7 or
                        sum(len(words[i]["text"]) + 1 for i in indices) + len(word["text"]) > 120):
            flush()
        indices.append(index)
    flush()
    return lines


def extract_music_lyric_candidates(selected_music_path, *, source_kind, model_directory=None,
                                    provider=None, limits=None, ffmpeg="ffmpeg", ffprobe="ffprobe",
                                    language=None, line_gap=None):
    """Return JSON-compatible UNVERIFIED candidates, not accepted lyrics.

    source_kind must literally be 'music'. No raw PCM, URL, video, gameplay, or
    mixed-source input. Injected providers are trusted LOCAL objects with a
    faster-whisper-compatible transcribe method and must be spawn-picklable.
    Call under an if __name__ == '__main__' guard on spawn platforms.
    line_gap groups candidates for later design, never verifies alignment.
    """
    if source_kind != "music":
        raise MusicLyricsError("explicit selected MUSIC source required; raw/gameplay/video inputs forbidden")
    if not isinstance(selected_music_path, (str, os.PathLike)):
        raise MusicLyricsError("select an explicit music audio file path, not raw/transcribed input")
    source = Path(selected_music_path).expanduser().resolve()
    if source.suffix.lower() not in AUDIO_EXTENSIONS:
        raise MusicLyricsError("video/gameplay/raw inputs forbidden; select an audio-extension music file")
    if re.search(r"(?:^|[\\/_. -])(gameplay|game|raw|capture|recording)(?:$|[\\/_. -])", str(source), re.I):
        raise MusicLyricsError("gameplay/raw/capture source path forbidden; select original MUSIC audio")
    if not source.is_file():
        raise MusicLyricsError("selected music must be an existing regular audio file")
    limits = Limits() if limits is None else limits
    if not isinstance(limits, Limits):
        raise MusicLyricsError("limits must be a validated Limits object")
    if language is not None and (not isinstance(language, str) or not re.fullmatch(r"[a-z]{2,3}", language)):
        raise MusicLyricsError("language must be a short explicit language code or None")
    if line_gap is not None:
        line_gap = _finite(line_gap, "line_gap", 0, MAX_SECONDS)
    if provider is None:
        if not isinstance(model_directory, (str, os.PathLike)) or not Path(model_directory).is_dir():
            raise MusicLyricsUnavailable("optional local lyrics unavailable: existing LOCAL model directory required; no downloads or installs")
        model_directory = str(Path(model_directory).resolve())
        if not all((Path(model_directory) / name).is_file() for name in ("model.bin", "config.json", "tokenizer.json")):
            raise MusicLyricsUnavailable("existing LOCAL model directory requires model.bin, config.json, tokenizer.json; no downloads")
    elif not callable(getattr(provider, "transcribe", None)):
        raise MusicLyricsUnavailable("injected provider must implement LOCAL transcribe")
    if source.stat().st_size > limits.source_bytes:
        raise MusicLyricsError("selected music exceeds source byte bound")
    digest, size = _hash_source(source, limits.source_bytes, time.monotonic() + limits.decode_timeout)
    with tempfile.TemporaryDirectory(prefix="aive-music-lyrics-") as directory:
        pcm_path, result_path = Path(directory) / "selected-music.wav", Path(directory) / "candidates.json"
        decode = _decode_music(source, pcm_path, limits, ffmpeg, ffprobe)
        words = _run_provider(provider, model_directory, pcm_path, decode["duration"], result_path,
                              limits.provider_timeout, language)
        after, after_size = _hash_source(source, limits.source_bytes, time.monotonic() + limits.decode_timeout)
        if (after, after_size) != (digest, size):
            raise MusicLyricsError("selected music changed during extraction; discard candidates")
    document = {"schema": SCHEMA, "status": "UNVERIFIED", "audio_sha256": digest,
                "source": {"path": str(source), "kind": "selected_music", "bytes": size},
                "decode": decode, "words": words,
                "provenance": {"alignment_verified": False, "method": "optional LOCAL word transcription",
                               "provider": "injected_local" if provider is not None else "faster_whisper_local",
                               "model_directory": model_directory if provider is None else None,
                               "language": language},
                "warnings": ["Singing transcription is unreliable; these are NOT verified lyrics.",
                             "Listen against this exact hashed music and sample-zero clock before acceptance.",
                             "No gameplay transcription, automatic alignment assertion, or accepted LyricTrack."]}
    if line_gap is not None:
        document["line_candidates"] = _group_lines(words, line_gap)
    return document
