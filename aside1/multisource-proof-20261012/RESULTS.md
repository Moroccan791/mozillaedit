# Multi-source timing proof

## Result

The new separate `encounters/v1` renderer passed a real two-source integration test.

- Output: `encounters-v0001/encounters.mp4`
- Sources: reviewed 1v9 and Reyna footage, using historical manual calibration labels.
- Music: Let the World Burn, from decoded song time 16.254s.
- Planned duration: 9.5318s; actual video: 572 frames, 9.533333s, 1280x720 at 60fps.
- Three intact planned encounter windows, no duplicate ranges or filler.
- Render wall time: 13.978s with h264_qsv.
- Structural QA: PASS.
- Decoded timing QA: PASS. All three game/song anchors measure 0ms offset; combined correlations 0.999, 0.997, 0.997; video matching within 0 to 1 frame.
- Measured loudness: -17.11 LUFS, true peak -3.22dBTP, no numeric clipping.
- Regression suite: 73 tests passed in 14.078s.

The requested 12-second ceiling produced a shorter edit rather than repeating footage or inventing extra kills.

## Limits

This is a **renderer/calibration proof**, not a polished montage or an automatic detector result. The new path uses hard cuts and 1x speed with no added effects, lyric typography or loudness normalization. Source-authored zooms/effects remain visible. Assistant inspected a contact sheet and decoded timing evidence but did not perceptually listen to the audio. Manual reference labels do not certify every kill or complete-fight boundaries across full sources.

Automatic POV confirmation remains uncalibrated and unreliable on varied/source-edited HUD layouts. Do not feed its candidates into unattended planning. Daily folder runner, smooth time maps, general quality gates and varied full-render benchmarks remain unfinished.

## Resume and commands

From `E:\ai-video-editor`:

```powershell
Remove-Item Env:PYTHONHOME,Env:PIP_PREFIX,Env:VIRTUAL_ENV -ErrorAction SilentlyContinue
.\.venv\Scripts\python.exe edit.py render-encounters `
  E:\aside\multisource-proof-20261012\timeline.json `
  --output-root E:\aside\multisource-proof-20261012 --encoder h264_qsv
```

This creates another versioned directory and does not overwrite v1. The CLI checks structural export integrity, not decoded event sync or perceptual quality. `E:\aside\verify_multisource_proof.py` independently checks this clean proof against original source/music waveforms and frames.

See `E:\aside\PROGRESS.md` for the five remaining stages and `E:\aside\selection-calibration-20261012-153257\production-audit-v1\RESULTS.md` for the next detector calibration task.
