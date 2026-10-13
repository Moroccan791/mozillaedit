# Let the World Burn current-build preview

Delivered: `Let-The-World-Burn-35s-preview.mp4`

- 35.000 seconds video, 2100 frames, 1280x720 at 60 fps; container 35.003 seconds.
- Exact requested E:/audio song; excerpt 16.254-51.254 seconds with lower-energy opening and heavier passage.
- Random source draw among non-ASMR raw gameplay files selected `reyna-u-need-to-toggle-harder` (530.042-second source). This supplied footage may already include creator text/audio/editing; editor did not add its existing text.
- Ten selected POV firing/outcome sequences. Audio candidate scan narrowed the search, assistant sampled frames for review, local high-frequency waveform refined anchors. This is hand-reviewed selection, not unattended kill detection.
- Continuous song, retained source game audio, no repeated source ranges. Actual song onsets across full excerpt, beat-near hard-cut boundaries; frame-rounded cuts.
- Restrained current grade primitives: cold-noir opening, selected vibrant-sports impacts, broadcast-hd readable passages, 50ms impact-local exposure pulses. No added lyrics, overlays, synthesized gunshots, ramps or cinematic assets.
- Existing editor `_clip`, grade and QA primitives reused in a job-local chunk renderer. Hardware QSV with 2 bounded concurrent chunks. Encoding + mixing took 66.2 seconds. Review/setup of this longer preview took longer than encoding.

## Verified evidence

`qa.txt` decode, universal yuv420p, streams and A/V duration all PASS. `timing-qa.json`: all ten timing checks PASS. Game attacks and joint game+music windows measure 0ms best offsets; frame reference matches 0 frames except event 2 +1 frame at 60fps. Mix correlations 0.982-0.999, game correlations 0.972-1.000. Decoded visual contact sheets inspect whole output, initial chunks and selected source firing sequences.

Loudness measured `loudness.txt`: approximately -12.99 LUFS, -1.48 dBTP; no numeric peak clipping. Automatic loudnorm target -14 was not reached exactly in this dynamic preview. Audio was numerically checked, not perceptually heard by assistant. User listening/taste review required.

## Remaining major work

1. Calibrated automatic POV kill confirmation, false-positive checks and uncertainty handling.
2. Multi-file event-centric planning that preserves context and multi-kills without repetition.
3. Polished bounded time remaps and impact effects with frame/audio QA.
4. Exact-song lyric alignment and designed typography (optional).
5. Simple choose-song/clips runner plus broader QA, varied renders and laptop benchmarks.

Current preview is not the finished premium reference style and not proof of unattended readiness. Generic music/render modules can be reused for other games; game-specific event adapters require calibration.

Reproduction: local .venv Python, `inspect_source.py`, `review_selected.py`, `build_preview.py`, `render_preview.py`, `verify_preview.py`. Render refuses existing chunk/output unless explicitly changed to a new job; preserve this version and originals.
