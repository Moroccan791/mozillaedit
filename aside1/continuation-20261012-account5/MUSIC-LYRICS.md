# Optional local MUSIC lyric candidates

## Status

New isolated adapter: `aive/music_lyrics.py`, focused tests: `tests/test_music_lyrics.py`.
No existing transcription, planner, render, lyric acceptance or other modules changed.
No package installation, model download, cloud call, actual song transcription or
singing correctness claim is part of this work. Tests use mock local providers and
FFmpeg synthetic audio only. Focused clean-environment run: **16 tests passed,
0 skipped**, including real 601-second synthetic source capped at exactly 600s,
disguised-video rejection, unchanged originals and provider termination on timeout.
The adapter emits **UNVERIFIED**
`music-lyric-candidates/v1`, never `lyric-track/v1` or an accepted `LyricTrack`.
`provenance.alignment_verified` is always `false`.

## Source and clock contract

- The caller must pass the explicit selected MUSIC audio path and `source_kind="music"`.
- `.mp3/.wav/.flac/.m4a/.aac/.ogg/.opus/.aiff/.wma` and related listed audio
  suffixes are eligible, not raw PCM, transcript JSON, URLs, videos or gameplay.
  Known gameplay/raw/capture path tokens are rejected. The caller remains responsible
  for source selection: renamed gameplay WAV content cannot be semantically detected.
- ffprobe must confirm exactly one audio stream and no video/data streams. Even album
  artwork represented as video is rejected deliberately. Embedded network protocols
  are disabled with FFmpeg's `file,pipe` protocol whitelist.
- The original is opened for reading only, hashed before/after extraction, never
  rewritten. Full source SHA-256 and selected source path/byte count are recorded.
- FFmpeg decodes from the first sample, with **no seek**, to temporary mono 16 kHz
  signed 16-bit PCM. A second SHA-256 identifies these PCM samples. Container PTS,
  leading silence and codec delay are not converted into an excerpt offset.
- Word times remain absolute seconds on this selected music's first-decoded-sample
  clock. Nothing automatically rebases words to video/edit time.
- Decode is a prefix of at most 600 seconds, not a claim to know whole-song duration.
  `possibly_truncated=true` means the prefix hit the cap, including exact-cap assets.
  Later words are not extracted by seeking. Default maximum source size is 512 MiB,
  PCM size 19,200,000 bytes, probe stdout 1 MiB, command stderr 64 KiB, result 4 MiB,
  and 6,000 words/segments. Individual words have at most 120 characters and 15 seconds.
- Defaults: per-hash/decode/probe wall bound 60 seconds, local provider worker 120
  seconds; settings may only lower fixed upper bounds (decode/probe 120s, provider
  600s). Provider work runs in a killable spawned process. No background inference
  remains after a timeout. These are per-stage bounds, not a single shared deadline.
- Nonfinite, negative, reversed, overlapping, unsorted or out-of-prefix intervals
  fail closed without sorting/clamping. Gaps, including leading silence, are retained.
  Missing word timestamps are rejected; empty results stay empty and unverified.

## Optional local provider only

Production requires an **existing local faster-whisper model directory** containing
`model.bin`, `config.json`, and `tokenizer.json`, plus an already available optional
`faster_whisper` dependency. Imports happen lazily in the worker. Model loading uses
`local_files_only=True`; Hugging Face offline flags are set in that disposable worker.
Model IDs like `tiny` are not accepted as a download request. Failure raises a clear
`MusicLyricsUnavailable`; nothing is installed or fetched as fallback.

An injected trusted LOCAL object may implement faster-whisper-compatible
`transcribe(temporary_pcm_wav_path, **options) -> (segments, info)` for tests.
Each segment must supply `words`, each word `word/start/end`. It receives only the
bounded temporary sample-zero PCM, not the original path. Because timeouts are
process-isolated, injected providers must be spawn-picklable. This is an adapter
contract, not a security sandbox against malicious injected Python objects.

## Focused command, clean Python environment

Run only these tests from PowerShell, using the repository's existing interpreter:

```powershell
$env:PYTHONPATH=$null
$env:PYTHONHOME=$null
$env:VIRTUAL_ENV=$null
$env:CONDA_PREFIX=$null
$env:PYTHONSTARTUP=$null
$env:PYTHONUSERBASE=$null
& 'E:\ai-video-editor\.venv\Scripts\python.exe' -I -c "import sys, unittest; sys.path.insert(0, r'E:\ai-video-editor'); suite=unittest.defaultTestLoader.discover(r'E:\ai-video-editor\tests', pattern='test_music_lyrics.py'); result=unittest.TextTestRunner(verbosity=2).run(suite); sys.exit(not result.wasSuccessful())"
```

No install command is needed or authorized. Tests skip actual decode checks when
local FFmpeg/ffprobe are absent; mock provider tests do not require a model.

## Example caller, not an executed real-song transcription

Use a guarded Python script because the inference process uses spawn:

```python
import json
from pathlib import Path
from aive.music_lyrics import extract_music_lyric_candidates, MusicLyricsUnavailable

if __name__ == "__main__":
    try:
        candidates = extract_music_lyric_candidates(
            r"E:\audio\selected-song.mp3",  # explicitly selected MUSIC, never footage
            source_kind="music",
            model_directory=r"E:\models\already-local-whisper-model",
            language="en",
            line_gap=0.6,  # optional design grouping; not alignment verification
        )
        Path("music-lyric-candidates.json").write_text(
            json.dumps(candidates, indent=2, allow_nan=False), encoding="utf-8"
        )
    except MusicLyricsUnavailable as exc:
        print(f"Optional music lyrics disabled: {exc}")
```

Example status: `{"schema":"music-lyric-candidates/v1","status":"UNVERIFIED",
"provenance":{"alignment_verified":false},"words":[...]}`. The optional
`line_candidates` retain original word indices and unverified status. They do not
choose impact typography, render lyrics, or assert that a word was sung.

## Exact next validation requirement

Before lyric acceptance or design/render activation, a human must listen to the
**exact selected music file matching `audio_sha256`**, reproduce and compare the
sample-zero PCM identity/rate/count, correct the actual sung text and every start/end
against audible vocal onset/offset on that clock, and check the desired excerpt's
boundaries and silence gaps. Singing ASR hallucinations, instrumental passages,
backing vocals, sustained notes and overlapping words need explicit resolution.
Document who checked what, the method, file identity, excerpt range and unresolved
limitations. Beyond-600-second content is unexamined, not implicitly verified.
Only an independently authored, explicitly verified `lyric-track/v1` document may
then be passed to the existing fail-closed `load_lyric_track`; it will recheck source
hash, full decoded duration and structural bounds. This adapter never upgrades its
own candidate status or sets `alignment_verified=true`.
