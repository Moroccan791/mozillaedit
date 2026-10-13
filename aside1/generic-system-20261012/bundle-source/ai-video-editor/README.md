# Current reusable-system checkpoint

Read **E:/aside/AI-CONTINUE-HERE.md** first. Generic lyrics workflow and local calibration reports now integrated; full450tests pass. `local-preview --lyrics verified` preflights exact-song verified words and selective design before video, then applies text before QA with unchanged audio. `--lyrics candidates` uses an existing local model and blocks for independent verification, never silently omits lyrics. `lyric-prepare` and `calibration-report` are reusable setup CLIs. No actual sung lyrics added to Reflections preview; local Whisper dependency/model still missing.

Explicit authored v2 supports4..24clips/<=50s; v1 bounds remain unchanged. Local planner10..20shots/30..50s/1x, bounded safe ranking at both pruning stages. No classifier/sync/aesthetic completion claim.

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


## Automatic candidate-preview pipeline

`auto-preview` is a separate opt-in route, not a replacement for confirmed-only
`job`. It now connects bounded sample-zero gameplay candidate maps, <=12s
multiband musical hit candidates, order-preserving one-to-one multi-event
rhythm fitting, automatic authored roles/bridges/fade, rendering, existing QA
and independent decoded stem attack inspection. No BPM grid or invented
confirmations. Candidate mode explicitly leaves unattended readiness false.

```powershell
Remove-Item Env:PYTHONHOME -ErrorAction SilentlyContinue
.\.venv\Scripts\python.exe edit.py auto-preview --music E:\audio\song.mp3 `
  --clips E:\clips --output-root E:\edits\candidate-jobs `
  --music-start 25 --duration 12 --encoder h264_qsv
```

Default visual screening samples source frames and rejects near-black/white or
near-static centers. `--exclusions` accepts supplied observed
`visual-exclusions/v1` ranges with explicit reason/evidence/reviewer. Moving
promotional graphics, abilities and post-round handling can still pass numeric
screening. No OCR/muzzle/ammo/kill confirmation is implied. `--no-visual-screen`
is for engineering tests only. `--plan-only` writes candidates and timeline
without rendering. The immediate folder inventory is bounded by `--max-clips`
(default4,max8); per-source audio scan is bounded by `--max-source-seconds`
(default600). Nonzero gameplay stream origins fail pending calibration.

Candidate hit-map preserves spectral peak, refined acoustic attack interval,
raw acoustic rejection reasons, normalized local salience and unreviewed
suitability. The original conservative acoustic audit is unchanged; mixed
strong hits may be candidate-preview eligible without being certified percussion.
Distinct peaks refining to one attack cannot satisfy two assignments.
Firing maps retain burst members and unknown instrument/origin, not kills.
Half the candidate window budget preserves strongest attacks and half seeks
quiet-edge context. No detector thresholds are lowered to force an export.

Rhythm planning preserves all root detected candidates inside a chosen source
range, including entry extensions. Dense windows (>8retained attacks or >32total
assignments) are omitted intact, never truncated into falsely clean bursts.
Eight..twelve-second proofs may use4..8clips; sparse fits block rather than fill.
Unknown candidate events remain in `candidate_events`; confirmed `events` stays
empty. All retained source attacks remain1x; infeasible secondary attacks are
explicitly unmatched. Planning overlap and semantic musical sync are separate.

`attack_qa` independently estimates attacks from decoded stems rather than
copying planned error. Ambiguous/silent/mixed attacks remain warnings. Final
mix masking/listening is not inspected by this tool and musical_sync remains
unverified. Candidate plans and automatic role labels do not establish enemy
acquisition, complete fights, resolved payoff or polished reference style.

Optional `--lyric-track` uses exact-audio `lyric-track/v1` validation and burns
verified supplied text into a NEW `text-v0001` output while stream-copying audio.
Original render/manifests preserved. Metadata validity is not proof that words,
alignment or licensed font assertions are true. Missing track means lyrics off.

Standalone review contracts `reviewed-hit-map/v1` and reviewed `firing-map/v1`
exist separately; candidate mode does not promote them. Production automatic
POV/layout calibration, source-content classification, broad benchmarks,
coherent reviewed phrase/fight choice and perceptual approval remain unfinished.
The first unscreened automatic8.039s diagnostic was visually rejected for
creator graphics, black source and post-round handling despite planned6/6
acoustic matches. Evidence and newer checkpoints: `E:\aside\automation-20261012`.


## Account-5 continuation: lyric design and reliability foundations

Latest evidence: `E:/aside/continuation-20261012-account5/CONTINUE-HERE.md`.

Music lyrics come from the **selected song audio**, never raw gameplay clips. The new optional `music-lyrics` command requires an existing local faster-whisper model folder and emits only **UNVERIFIED** word candidates, not accepted lyrics. No package/model download occurs automatically. Singing words and timestamps still require review against the exact song.

```powershell
.\.venv\Scripts\python.exe edit.py music-lyrics --music 'E:\audio\song.mp3' --local-model 'path-to-existing-local-model' --out 'new-music-lyric-candidates.json'
```

`auto-preview` now requires **both** `--lyric-track` and `--lyric-design` when lyrics are enabled. There is no automatic basic caption stream in this runner. `lyric-design/v1` explicitly selects original music word indices, graphic roles, palette, placement, size and animation. The designed compiler supports glowing/translucent giant words, offset echo accents and quiet italic phrases. Serif roles fail closed without a bundled licensed serif. Music hash, exact excerpt sample clocks and gameplay canvas must match the render manifest; known candidate/visual impact protections cannot be silently omitted. Overrides are explicit diagnostic/editorial choices, not automatic approval.

New standalone foundations: `gameplay_gate.py` validates explicit reviewed POV-firearm-kill evidence against current source bytes, **not** automatic classification; `multishot_map.py` plans bounded C2 reviewed-shot-to-hit maps with protected 1x attacks, **not yet rendered**; `closure_qa.py` checks every join and requires reviewed fight/phrase closure, **not** a fade-as-payoff assumption. Candidate automation persists closure warnings. Attack QA now exposes rejected-peak/per-band diagnostics without weakening gates.

Real 30s and 60s clean stress renders across three source clips passed exact 720p60 frame clocks, full decoding and PCM sample counts. These are diagnostic rendering proofs, not whole-song or aesthetic/POV-selection acceptance. Original media, old previews and unrelated dirty work remain preserved.


## Existing-system-only supported entry (2026-10-12)

Read `AGENTS.md` and `E:\aside\system-lock-20261012\CONTINUE-HERE.md`. Use `edit.py studio` for normal operation. This delegates existing automation/daily runners and forces authored renderer evidence; it never substitutes trim+music or clean fallback. CLI legacy render shortcuts are blocked, analysis commands retained. Candidate mode requires explicit `--candidate-preview`, visual screening, and reports unverified diagnostic output. Reviewed mode requires `--events ... --authored-design ...`; optional verified MUSIC `--lyric-track` and explicit `--lyric-design` run through existing preflight/text/QA. Current authored bound is <=12s,4..8clips;30..40s production is not yet implemented.384tests pass. Fresh automatic selection still includes ability/scoreboard footage; do not call it finished or synced. Project policy is not an OS sandbox around FFmpeg.
