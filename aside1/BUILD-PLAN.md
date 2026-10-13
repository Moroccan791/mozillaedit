# Build plan: low-cost local Valorant montage engine

## Target

Song + raw clip folder -> polished, reproducible montage using local code, FFmpeg and lightweight signal/image analysis. No high-end AI or paid API required for routine edits. Use the six-reference study as the style specification. Do not rebuild around repeated AI video reviews. Ocean Eyes remains excluded.

## Completed

- First visual study of six exact references, with decoded timeline samples and close inspection of selected transitions, typography and impacts.
- Shared style card: readable gameplay between amplified highlights, integrated reframing/blur/warp, selective exposure/glow, designed text and occasional cinematic/composited interludes.
- Static inspection of existing bot timing/planning/render/QA modules.
- Repaired the CLI so `doctor` starts without importing analysis-only dependencies; it now reports FFmpeg, ffprobe, codecs, libass, NumPy and SciPy explicitly.
- Added project-local `.venv` with NumPy/SciPy, and regression tests for typed unconfirmed events, bounded context windows and rough-cut compatibility.
- Reconciled the old `Shot` field mismatch. Audio transients are typed as unconfirmed candidates; empty raw projects cache analysis and stop before rendering instead of inventing kills.
- Added versioned caches for audio transient and Valorant HUD row-change candidates. The HUD scan is explicitly not player-identity confirmation.
- Removed cyclic event reuse from the kill planner so sparse footage no longer repeats to fill slots.
- Rendered the first real 10-second sync proof from the existing 1v9 clip and Dracula edit audio, with no effects or lyrics. Automated decode, duration, source-frame correlation and music-audio correlation all passed.
- Consolidated work in E:/aside; original source media and existing project outputs were left untouched.

Still not completed: calibrated player-identity confirmation, multi-kill grouping, phrase-aware multi-file planning, continuous time maps/effects, lyric alignment/typography validation, several full production renders, daily runner, throughput benchmarking or model training.

## Runtime design

1. FFmpeg/ffprobe: decode/probe, filters, compositing, audio mix and encoding.
2. Python + NumPy/SciPy: onset/beat analysis, candidate scoring, scheduling, time maps and job orchestration.
3. OpenCV or equivalent lightweight local image analysis: cropped HUD/kill-feed template checks, frame differences, optional optical flow. This is numerical processing by code, not a multimodal AI watching and describing each video. Pure FFmpeg/audio cannot reliably establish whether a gunshot killed an enemy.
4. Local word transcription/alignment only when lyric typography is enabled; optional, not a dependency for a clean montage.
5. Reusable style/effect templates with bounded parameters. Deterministic seeded variation, not random effects on every cut.
6. JSON timeline and cached event/music analysis keyed by source files plus analysis version, so reruns are cheap and reproducible.

## Phase 0: runnable baseline

Status update (2026-10-12): the user granted access to E: and the current PowerShell session can read/write the project. No drive permissions were changed. FFmpeg/ffprobe 9.0.1 are installed. A project-local Python 3.12 `.venv` now contains NumPy/SciPy; terminal setup unsets inherited `PYTHONHOME`, `PIP_PREFIX` and `VIRTUAL_ENV` first so installs remain local. `python edit.py doctor` and the renderer have been runtime-tested.

Inspect the real CLI/doctor entry point before choosing commands. Check installed versions, codecs, filters and dependencies. Render a tiny unmodified working-copy excerpt; verify decode and audio presence. Preserve originals and existing presets.

## Phase 1: event interface and short timing proof

Reconcile onset-based Shot objects with older rough-cut/conductor code that expects start/end/intensity/kind/rank. Separate a candidate transient from a confirmed gameplay event. Introduce an event record containing source file, source timestamp, type, score/confidence and lead-in/outcome window; a planned event also has target output time.

First prove an 8–12-second montage using 3–5 manually confirmed event timestamps and manually checked music accents. This isolates rendering/time-map bugs from detector errors; it is a temporary calibration step, not the final user workflow.

Acceptance: event placement survives rendering, original encounter/outcome is visible, no unintended duplicate event, and the short output decodes correctly. Proposed timing goal near one output frame for manually anchored events, subject to onset definition and audio/video offsets. This is an engineering target, not a measurement of the references.

## Phase 2: automatic song/event analysis

Music: analyze waveform onsets, beat confidence, downbeat/phrase candidates and intensity; support variable timing and selectable song excerpt rather than blindly trusting BPM.

Footage: scan low-resolution audio/image proxies; find sharp transients, then confirm using cropped HUD/kill-feed/emblem changes and encounter context. Handle different resolutions/HUD variants through calibrated templates. Distinguish shots, kills, multi-kills, death, reload and ability where feasible. Use conservative confidence thresholds; skip or flag uncertain events rather than calling every loud sound a kill.

Cache results. Calibrate against a small manually labeled sample from the user's footage; measure precision/recall and onset error before trusting unattended runs. No visual-language model is necessary by default. A small local classifier is a later option only if classical methods fail a clear benchmark.

## Phase 3: multi-file musical planner

Assign gameplay events, not clip starts, to musical accents. Rank stronger moments for stronger accents; preserve multi-kill order and setup/aftermath. Avoid reused source intervals, weak filler and overlapping selections. Select durations/holds from the music and encounter, not one repeated beat-slot pattern.

Output one explicit JSON timeline containing source in/out, source-event anchor, output-event anchor, time map, effect envelopes and text/audio events. Handle sparse footage honestly, such as shorter output or warning, rather than repeat scenes to fill a target length.

## Phase 4: motion and effects compiler

Replace fixed slow/fast blocks with bounded continuous or finely sampled eased time maps, synchronized with event-local scale/position/blur/light envelopes. Keep clip-entry transitions separate from impact effects occurring later inside the clip. Ensure source and output anchors match after transitions and retiming.

Start with a few strong presets: clean setup + impact; directional/zoom-blur transition; exposure/glow pulse; selective particle/light-streak layer; word/lyric graphic. Adapt intensity to highlight/phrase importance and allow restrained passages. Do not force all effects onto every clip.

FFmpeg can execute much of the render. For smoother intermediate motion, test local optical-flow interpolation or frame generation only where needed; benchmark cost and inspect ghosting. Do not assume 720p/60fps source can yield flawless extreme slow motion or true high-resolution detail.

Cinematic orbit/top-down/third-person shots require suitable replay/cinematic assets. Arbitrary POV clips cannot reveal unseen viewpoints. Support an optional reusable permitted cinematic asset library, with a footage-only fallback.

## Phase 5: audio, typography and post-render QA

Retain a clearly defined shot transient when retiming footage; arbitrary stretching may move or smear the sound. Align/mix shot accents with music, prevent clipping, check boundaries and avoid unnecessary SFX.

Lyrics optional: obtain accurate text/word times, choose emphasis deliberately and use approved animated layouts. Keep YouTube captions and game HUD separate from custom typography.

Expand QA beyond the existing decode/pixel-format/stream/duration/text/fade checks: verify event/time-map alignment, compare shot/music onsets after render, detect duplicated intervals, severe black/white frames, obvious freeze/stutter and obscured highlight candidates. Preserve separate analysis tracks/stems where practical; merged-audio onset measurement alone may confuse music and shots. Numerical QA cannot guarantee taste; initial human calibration and occasional exception review remain sensible.

## Phase 6: daily unattended runner

Wrap the validated pipeline in one local job accepting song, clip folder, target duration/aspect, chosen style and optional cinematic/text assets. Use caches, versioned outputs, bounded resource settings, reproducible seed and a quality report. No routine high-end-AI call.

Benchmark actual wall time, memory and encode options on the laptop before promising daily throughput. Stop or shorten an edit if confident events/assets are insufficient. Only enable unattended full-length jobs after the short proof and several varied full tests meet the user's quality bar.

## Recommended next action

Keep the clean sync proof as the timing baseline. Reduce false positives in local HUD candidate scanning, add robust POV/player identity checks and multi-kill grouping, then validate lyrics against the exact selected track before styling them. Do not add effects until the timeline and event QA remain stable across varied clips.

## Remaining inspected gaps

- aive/shots.py finds audio transients, not kills. `aive/killfeed.py` now emits unconfirmed HUD row-change candidates for one calibrated Valorant 16:9 profile, but does not identify the POV player. It needs a local OCR/template or emblem-state check and validation on labeled samples.
- aive/planner.py `plan_kills` no longer cyclically reuses events, but its existing beat-slot/ramp strategy is not yet the final event-centric, multi-file JSON timeline planner.
- aive/graph.py `_ramp_slices` still uses piecewise-constant speeds rather than continuously eased time maps; fixed entry bloom remains.
- `aive/qa.py` still has generic render checks only. The isolated sync-proof adapter now compares decoded source/output frames and audio windows to verify the clean timing proof, but those checks are not yet generalized to all effects/time maps.
- Lyrics are intentionally off in the timing proof. Existing lyrics/text modules need exact-track word alignment validation, then the display styling can be calibrated.

These current gaps combine static code findings and explicitly recorded runtime tests. See skill/ai-video-editor/references/valorant-impact-style.md for reference evidence.
