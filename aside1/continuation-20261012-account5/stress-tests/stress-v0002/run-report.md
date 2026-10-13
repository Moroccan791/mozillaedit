# Render stability diagnostic stress report

Status: pass
Source scope: 3 actual raw files; first two basenames match the exact historical timeline proof inputs.
Music source duration: 81.153741 seconds. Tests use continuous excerpts 10..40 and 10..70 seconds, not a whole-song test.
Total wall elapsed: 350.890s
Original input SHA256, size and mtime unchanged: True
Serial libx264 encoders only; clean 1280x720 60fps, 1x, no events or musical alignment claims.

## 30 seconds: PASS
Render wall: 76.562s; frames: 1800; exact CFR all timestamp intervals: true; PCM stem samples: 1440000; full video/audio decode exit 0.
Output: E:\aside\continuation-20261012-account5\stress-tests\stress-v0002\renders\encounters-v0001\encounters.mp4
Manifest: E:\aside\continuation-20261012-account5\stress-tests\stress-v0002\renders\encounters-v0001\render-manifest.json

## 60 seconds: PASS
Render wall: 158.282s; frames: 3600; exact CFR all timestamp intervals: true; PCM stem samples: 2880000; full video/audio decode exit 0.
Output: E:\aside\continuation-20261012-account5\stress-tests\stress-v0002\renders\encounters-v0002\encounters.mp4
Manifest: E:\aside\continuation-20261012-account5\stress-tests\stress-v0002\renders\encounters-v0002\render-manifest.json

## Limitations
- Not a full laptop benchmark. Memory, when available, is sampled process RSS only, not exact lifetime peak or total system memory.
- 60 seconds is a continuous song excerpt, not whole-song unless the source itself is 60 seconds.
- No confirmed kills, no authored composition or musical alignment; events are empty. Source-authored effects may remain.
- Unavailable: psutil not installed. No memory benchmark claimed.

Detailed verification, exact FFmpeg/FFprobe args, stdout/stderr/status, original fingerprints and memory samples are retained alongside this report.
