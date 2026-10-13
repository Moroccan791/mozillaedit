# Continue here: first sync proof

## Current checkpoint (2026-10-12)

The first real 10-second sync proof has rendered and passed automated checks. It is a clean 1x timeline with no lyrics, overlays, ramps or transitions, so the test isolates event-to-song timing.

- `plan.mjs`: pure source/output anchor planner.
- `test-and-build.mjs`: 10 deterministic planner/validation tests and unique versioned job creation.
- `render_existing.py`: isolated adapter for the current FFmpeg renderer plus decoded video-frame and music-audio correlation checks.
- `confirmed-1v9-dracula.json`: assistant-reviewed source event anchors and locally detected music accents.
- `REAL-PROOF-RESULTS.json`: event times, correlations, PASS/limitations.
- `run-f3b0Iv/`: versioned project, timing, render, filtergraph, QA and console log.
- Desktop copy: `C:\Users\Junayed\Desktop\AI-Editor-Sync-Proof-10s.mp4`.

All original source media and existing project outputs remain untouched. The run is evidence for this one clean timeline, not proof that automatic event detection or full-montage taste is finished.

## Verified runtime commands

From PowerShell:

```powershell
Remove-Item Env:PYTHONHOME,Env:PIP_PREFIX,Env:VIRTUAL_ENV -ErrorAction SilentlyContinue
E:\ai-video-editor\.venv\Scripts\python.exe E:\ai-video-editor\edit.py doctor
E:\ai-video-editor\.venv\Scripts\python.exe -m unittest discover -s E:\ai-video-editor\tests -v
node E:\aside\sync-proof\test-and-build.mjs
```

Current result: doctor finds FFmpeg/ffprobe 9.0.1, h264_qsv, libass, NumPy and SciPy; all 7 Python regression tests and all 10 Node timing checks pass. Keep package installs in the project's `.venv`.

## Real calibration inputs

The current calibration uses one gameplay file and one song, with 3 POV kill-feed frames and 3 local spectral-flux accents. Exact values and evidence are in `confirmed-1v9-dracula.json` and `REAL-PROOF-RESULTS.json`. It uses the formula `source_start = source_event - (output_event - output_slot_start)` at 1x speed, no crossfades.

To run a *new* calibration without overwriting this output, copy/edit the config and use `test-and-build.mjs --build`; every invocation creates a unique `run-...` folder. Do not treat the synthetic template's 10/20/30 timestamps as observed game events.

## 3. Build a new versioned job

```powershell
node 'E:\aside\sync-proof\test-and-build.mjs' --build 'E:\aside\sync-proof\confirmed-1v9-dracula.json'
```

It writes a NEW uniquely named `run-...` folder containing `project.json`, `timing.json`, and the input. Existing runs are not overwritten. The existing successful run is `run-f3b0Iv`; do not rerun into or overwrite it.

## Render and verification

The real job has already rendered. For another version, use the job printed by the builder:

```powershell
E:\ai-video-editor\.venv\Scripts\python.exe E:\aside\sync-proof\render_existing.py `
  'E:\aside\sync-proof\run-NEWID\project.json'
```

The adapter refuses to overwrite an MP4. Structural QA checks decode, yuv420p, streams and duration. It also compares source/output event frames and the chosen music windows after decode. On the current job, frame matches were within 0 to 1 frame; music-audio correlations were 0.450, 0.903 and 0.450. Effects and lyrics remain outside this timing-only test.

## What is verified and what is not

- Verified on this output: decoded source frames at the three planned impacts appear at the target output timestamps within one 60 fps frame.
- Verified: the selected music windows correlate at their expected output locations; all three automated checks passed.
- Not certified: whether every detector candidate is a kill, whether every crop retains enough context, or whether the pacing/effects feel premium.
- Lyrics are intentionally off. Validate word-level lyrics against the exact chosen track before adding large text.
- No ramps/effects are present. Their time maps need separate drift tests later.

If future render QA fails, compare `timing.json`, `filtergraph.txt`, `render-args.json` and `qa.txt` in that run directory before changing effects.

## Next engineering steps, in order

1. Improve local HUD/player identity checks and measure precision/recall on labeled clips. Current row-change candidates remain unconfirmed.
2. Build a multi-file event-centric timeline: actual impact anchors, strong accents, setup/outcome context, no duplicate intervals and multi-kill ordering.
3. Validate lyrics/word times against the exact song, then integrate phrase typography and event-aware emphasis. Keep this separate from the already-passed clean timing proof.
4. Replace fixed/piecewise retiming with bounded eased time maps and effect-local envelopes; add automated timing tests.
5. Generalize QA for event timing, duplicate scenes, flashes, clipping, freezes, lyric overlaps and export integrity.
6. Build the local choose-song/choose-clips runner with caches, versioned output and a concise report. No routine hosted AI calls.
7. Calibrate several full-length edits and benchmark runtime before unattended use.

Full context: `E:/aside/BUILD-PLAN.md` and `E:/aside/skill/ai-video-editor/references/valorant-impact-style.md`.

## Access status

E: is accessible in the current terminal after the user granted access. No drive ACL/permission settings were changed. The user asked for a simple local chooser/runner rather than a chat-model workflow; the intended end state is choose song + clip folder, then local analysis, timeline planning, rendering and QA.


## Beat-sync continuation, 2026-10-12 (v2 work)

The user reported only the early 3–4 second passage sounded crisp/on-beat and the final-second kill did not. Previous correlation checks used HUD frames rather than the actual gunshot attacks and therefore did not establish shot-to-accent alignment.

Implemented:
- `aive/beats.py`: full-track librosa onset envelope, 128-sample hop, uniform local two-second transient threshold with silence floor, versioned cache invalidation, and excerpt-local half-beat markers including 0/end.
- `aive/music.py`: music-cache version updated to match the new analysis.
- `aive/planner.py`: actual tracked interval/fractional beat slots, aligned montage music origin, explicit hard-cut sentinel, and contiguous sparse-kill slot range. No effect/ramp rewrite. Highlights behavior remains outside this correction; normal montage still retains older source cycling.
- `aive/graph.py`: explicit `cut`/`none` recognized; constant-1x video trim preserves requested fractional phase and pads/trims clip duration to avoid losing a frame at every concatenation.
- `sync-proof/plan.mjs`: separate source audio and visual anchors; continuous excerpt marker validation; final excerpt boundary is not required to be a beat.
- `render_existing.py`: verifies gunshot audio independently of music and HUD frame timing.
- `build_sync_v2.py`: reproducible revised calibration builder. Audio/HUD anchors were reviewed around POV firing/ammo and skull-emblem changes; old early/middle HUD updates were not reliable actual kill anchors.

Validation so far: 28 Python regression tests and 16 Node planner checks passed. First revised render `run-itopsq` passed gunshot checks at 0 ms for all three events, but failed later video frame offsets (-2 frames). Retained as failed evidence, not the deliverable. Frame-phase handling was corrected in `run-tNKVpP`. Its first expanded QA attempt also exposed inaccurate compressed-audio window seeking; reference QA now decodes each entire audio file once from origin, then slices exact PCM sample windows. Do not use old qa.txt or failed earlier QA versions as final evidence. Final `sync-proof-10s-qa-v2.txt` reports OVERALL PASS for the delivered `sync-proof-10s.mp4`.

Exact revised targets: 2.9429, 5.5261, 9.5721 seconds; cut boundaries frame-rounded near half-beats at 4.183333 and 7.583333 seconds. Marker grid has 38 entries over 0–10 seconds, maximum gap approximately 0.299 seconds. The full analyzed song is 76.347 seconds, with 137 tracked beats and 473 onset candidates. These counts are detector outputs, not verified beat/kill truth.

User clarified desired end state: raw clips + song/length/style should run automatically after calibration. It is not unattended-ready yet. Generic music/planning/render tools are reusable across games; Valorant-specific HUD/event detection needs a new profile/calibration for other games.

### Final v2 checkpoint

Delivered `E:/aside/sync-proof/AI-Editor-Sync-Proof-10s-v2.mp4`, a copy of `run-tNKVpP/sync-proof-10s.mp4`. Original v1 and all raw media retained. A matching chat artifact copy is available. No Desktop copy was made in this session.

Final inspected evidence: `run-tNKVpP/sync-proof-10s-qa-v2.txt` OVERALL PASS. Video 10.000 seconds/600 frames, AAC 10.02 seconds (packet padding). Decoded gunshot and joint game/music alignments 0 ms for all 3 events; joint correlations 0.997/0.982/0.993, source shot correlations 0.891/0.860/0.899; visual matches +1/-1/-1 frame. Full-source decoding removes codec-seek false offsets. `loudness-final.txt` measured approximately -14.32 LUFS and -1.51 dBTP. Contact sheets inspect full timeline/final kill/cuts. Audio was numerically inspected, not perceptually heard by the assistant; user should judge crispness/listening taste.

`graph.py` now trims finalized audio to the planned video length so future outputs avoid the loudnorm tail. The final delivery was stream-copy trimmed to 10 seconds from the validated render; its exact delivered file was rechecked. Final code regression results: 28 Python tests and 16 Node checks passed. To rerun delivered-file QA: `python verify_existing_v2.py E:/aside/sync-proof/run-tNKVpP sync-proof-10s.mp4` using the local project venv.
