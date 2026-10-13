# aive — AI Video Editor

A free, local, FFmpeg-based video editing pipeline. Explicit project timelines
can render with Python's standard library + FFmpeg. Automatic signal analysis
uses local NumPy/SciPy/librosa; optional free local models are separate.

**No paid APIs. Ever.**

## Quick start

```powershell
# Avoid inherited Aside/PIP prefix settings; keep dependencies inside this repo.
Remove-Item Env:PYTHONHOME,Env:PIP_PREFIX,Env:VIRTUAL_ENV -ErrorAction SilentlyContinue
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe edit.py doctor
.\.venv\Scripts\python.exe edit.py plan E:\raw\clip.mp4 --music E:\audio\song.mp3 --duration 30 `
  --out projects\myvideo\project.json
.\.venv\Scripts\python.exe edit.py run projects\myvideo\project.json
```

`scaffold` creates a starter JSON for manually adding confirmed segments. The
raw audio detector emits unconfirmed transient candidates, not kill labels.
An experimental local POV-icon confirmation path exists, but its source-specific
profiles still require calibration. An empty timeline or uncertain detector output
is never automatically rendered as a kill montage.

## The pipeline (8 steps)

| # | Step | Module | Notes |
|---|------|--------|-------|
| 1 | Ingest / probe | `ffprobe.py` | duration, streams, fps, pix_fmt |
| 2 | Transcribe | `transcribe.py` | faster-whisper (optional, free) |
| 3 | Shots | `shots.py` | scene cuts + audio peaks (raw footage) |
| 4 | Rough cut | `roughcut.py` | beat packing / filler removal |
| 5 | Audio | `audio.py` | loudnorm -14 LUFS, ducking |
| 6 | Grade | `grade.py` | named looks (teal-orange, noir, ...) |
| 7 | Captions | `captions.py` | styled/animated ASS via libass |
| 8 | Export | `export.py` | platform presets + hardware encode |

Plus `qa.py` — an automated gate that verifies every render.

## Two workflows, one engine

- **Trailer mode** — source already has cuts + a beat. Provide `segments` in the
  project; the engine trims/grades/captions/exports.
- **Raw mode (in progress)** — a single long take. Audio analysis caches
  full-track beat/onset profiles and transient candidates, then a lightweight
  Valorant kill-feed row-change scan
  examines the strongest 200 candidates. The HUD scan does not read player
  identity, so neither signal is treated as a confirmed kill. An empty project
  stops before rendering until a confirmed/planned timeline is supplied.

## Optional free upgrades

```powershell
python -m pip install -r requirements-optional.txt  # word transcription, librosa
winget install Ollama.Ollama                        # optional local LLM
```

## QA gate

Every render is checked for: full decode, universal `yuv420p`, stream presence,
audio/video duration sync, text actually rendered, and true black at fades.
Catches the real bugs (the yuv444p "won't play" bug, the silent black-title bug).

## Layout

```
aive/        library code (one module per step)
edit.py      CLI
projects/    one folder per edit (project.json + cache + output)
assets/      fonts, luts, sfx
presets/     platform + look presets
cache/       working files
```

## Confirmed encounters (experimental)

`povkills` scans a source with an explicit local JSON HUD/icon profile and nearby
audio candidates. Profiles marked uncalibrated keep every observation uncertain.
Template cosine similarity is not a probability; there is no player-name OCR or
general cross-game certification.

```powershell
.\.venv\Scripts\python.exe edit.py povkills E:\raw\clip.mp4 `
  --profile E:\profiles\measured-profile.json --out projects\job\events.json
.\.venv\Scripts\python.exe edit.py encounters --events projects\job\events.json `
  --music E:\audio\song.mp3 --music-start 16 --duration 35 `
  --out projects\job\encounters.json
```

The `encounters/v1` planner keeps complete nearby fights and uses actual song
onsets, without repeated footage or filler. The handoff accepts only explicit
confirmed events with measured audio/visual timestamps, confidence and source
duration. A wrapper source can supply a missing event-level source; conflicting
sources, malformed schemas or numeric fields fail clearly. Unconfirmed or
missing-audio observations remain in detector output and are excluded.

This timeline is not a legacy single-source `Project` JSON. Do not send it to
`edit.py run`. Use the separate experimental renderer:

```powershell
.\.venv\Scripts\python.exe edit.py render-encounters projects\job\encounters.json `
  --output-root projects\job\renders --encoder h264_qsv
```

It creates a new versioned output directory, hard-cuts at 1x, keeps continuous
music and separate PCM game/music stems, preserves fractional source phase and
uses global frame boundaries. It does not silently fill a sparse timeline or
stretch the source. QSV fallback is only used if explicitly requested with
`--fallback-encoder libx264`. Structural QA runs after export; that is not
post-render event-sync or taste certification. Constant-gain mixing may clip and
needs measured review. Nonzero source audio/video origins need explicit
calibration; normal MP3 music delay is handled by decoding from sample zero.

## Local versioned runner and restrained motion

The experimental `job` command connects the song, immediate clip folder,
reviewed event files and phrase-aware planning to rendering and independent QA.
It preserves reviewed fight bounds, uses measured generic spectral onsets and recorded phrase markers,
and stops short rather than reusing footage or silently clipping a reviewed fight.
Generic onsets are not certified drum hits. Impact score ranks before phrase
convenience. Automatic beat detection does not establish bar phase, so detected
profiles leave downbeats empty instead of fabricating every-fourth-beat labels.
Automatic POV profiles must explicitly cover every input source; uncalibrated
profiles stop without promoting observations.

```powershell
.\.venv\Scripts\python.exe edit.py job --music E:\audio\song.mp3 `
  --clips "E:\raw clips val" --events E:\labels\reviewed-events.json `
  --music-start 16 --duration 30 --style restrained-impact `
  --encoder h264_qsv --output-root E:\edits\jobs
```

Each job writes config/input provenance, confirmed events, music analyses,
explicit timeline, render manifest, `quality-report.json`, `job-report.json` and
`REPORT.md`. Use `--plan-only` for a non-rendering review. Status is `blocked`,
`planned`, `rendered`, `rendered-with-warnings`, `failed-qa` or `failed`.
Warning-bearing exports remain available and are not reported as an unqualified
QA pass. Successful exports with warnings exit zero; consult status/report.

`clean` remains the default 1x path. `restrained-impact` adds a bounded C2 eased
source-to-output map, leaving endpoints and audio/visual events fixed. It protects
at least +/-0.18s around impacts at 1x, keeps music continuous, and uses mild
impact-local zoom/exposure envelopes. Game audio outside protection uses <=0.10s
pitch-preserving atempo slices with absolute sample boundaries, not full
continuous waveform resynthesis. No interpolation, cinematic inserts or overlays
are fabricated. To compare an identical saved plan without replanning:

```powershell
.\.venv\Scripts\python.exe edit.py render-encounters E:\edits\timeline.json `
  --output-root E:\edits\comparison --style clean --encoder h264_qsv
```

Independent `aive.encounter_qa.verify_encounters()` checks decoded source/game,
music and final-mix event windows, duplicates, loudness/clipping, export integrity
and sparse visual heuristics. These correlation checks establish render-clock
fidelity only. A zero source/stem offset does NOT prove a true firing attack
lands on a perceptually strong musical hit. QA explicitly leaves `musical_sync`
unverified until independently reviewed attacks and musical salience are checked. Actual visual treatments can mask frame matches;
clean identity renders are not mislabeled as styled. Missing/ambiguous evidence
stays a warning. Sparse sampling cannot rule out all flashes, freezes or bad cuts.
Process peak memory excludes FFmpeg children and is not a laptop capacity test.

## Optional exact-audio lyrics

`lyric-check` accepts only `lyric-track/v1` documents bound to the actual music
SHA-256, with explicit supplied verification method, sorted nonoverlapping word
times and decoded-duration bounds. It does not establish that the supplied
alignment assertion is truthful, and does not convert old lyrics into verified
ones. Lyrics remain off in the runner. The helper can generate a separate ASS
file for a validated track; that is not yet integrated into the encounter export.

```powershell
.\.venv\Scripts\python.exe edit.py lyric-check E:\labels\song-words.json `
  --music E:\audio\song.mp3 --music-start 16 --duration 30 `
  --ass-out E:\edits\verified-lyrics.ass
```

Production detector calibration, reference-level cinematic polish, actual lyric
listening verification, perceptual audio/cut review and varied full-render laptop
benchmarks remain unfinished. The system is not unattended-ready.


### Independent acoustic audit, not automatic hit certification

`aive.accent_audit.analyze_accent_samples(x, sr, candidate_times)` and
`audit_candidates(music, candidate_times)` provide bounded standalone acoustic
evidence: attack estimate/range, original-clock delay, local rank/salience,
multiband flux/RMS, percussive-like heuristic and rejection reasons. File audio
is decoded from sample zero and trimmed by samples, not compressed input seek.
Limits:32candidates, +/-120ms refinement, +/-1s salience,600s input.

This helper is NOT integrated into the planner and is not drum identity, beat
meter or perceptual validation. It currently abstains on all six rejected Burn
preview targets, including independently observed stronger attacks, because
mixed/harmonic and overlapping-cluster evidence is uncertain. Calibrate false
rejections before integration; do not lower thresholds merely to create a demo.

The rejected23.53s controls and their0ms source/stem checks are engineering
baselines, not approved musical-sync or premium-style examples. Current clean/
restrained renderer alone lacks the authored transition/composition/ending
capabilities needed for the intended reference style. The bounded authored
experiment below is an engineering increment, not approved reference-level
polish. See E:\aside\rejection-audit-20261012.

## Explicit authored-footage proof path

`render-encounters --style authored-footage` accepts a separate strict
`authored_design` field in an `encounters/v1` plan. This opt-in experiment is
bounded to 4..8 clips and <=12 seconds; the local daily runner does not select
or generate these designs. Clean and restrained plans reject the design field
instead of silently ignoring it.

```json
"authored_design": {
  "schema_version": "authored-footage/v1",
  "shots": [
    {"role": "setup", "composition": "full"},
    {"role": "impact", "composition": "full"},
    {"role": "contrast", "composition": "inset"},
    {"role": "payoff", "composition": "full"}
  ],
  "bridges": [{"boundary": 2, "direction": "right", "frames": 12}],
  "ending": {"fade_frames": 36}
}
```

`shots` must match timeline length. First is setup, last payoff, and impact and
contrast are required. These are editorial render roles, not proof that the
source contains acquisition, a kill or a resolved outcome. Contrast alone uses
an uncropped smaller foreground over a blurred/desaturated copy of the SAME
frame. No unseen third-person view, extracted subject or new assets.

`boundary` is the zero-based index of the incoming clip (1..clip_count-1).
Each bridge uses the last N outgoing and first N incoming frames. Directional
pan/scale envelopes continue movement across the unchanged hard cut, with
brief horizontal spatial smear. This is a paired EDGE bridge, not an overlapping
wipe, crossfade or temporal motion synthesis. N is 2..min(24, floor(.4*fps)) and
at most one third of either adjacent clip. Duplicate boundaries fail.

The final N video frames fade to black, including a black last frame. N must be
2..min(half of final clip frames, 2*fps). Edge/fade overlap and supplied
source audio/visual anchors within +/-0.18 seconds of these windows fail before
FFmpeg. Unknown burst shots remain unprotected until explicitly reviewed and
supplied. Roles or metadata cannot certify complete-fight labels.

All source/output/music ranges, exact CFR frame counts and game/music PCM
samples retain the 1x timing path. No atempo, interpolation, audio fades or
retiming. Exact graph/config/plan/logs and design limitations are retained in
new versioned render folders. FFmpeg's `-/filter_complex` file-input option is
used, consistent with the existing restrained audio path. Decoded QA continues
to warn `musical_sync` and masks style-sensitive visual comparisons. The video
fade may create a deliberate black-frame heuristic warning.

Real and synthetic engineering evidence lives in
`E:\aside\authored-footage-20261012`. It is not a corrected deliverable: reviewed
firing/accent assignments, coherent phrase/fight selection, real-time smoothness,
listening and reference-level aesthetic approval remain unfinished.
