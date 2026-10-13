# Detector audit v1 — povkills (Reyna profile) vs corrected ground truth

Date: 2026-10-13. Ground truth: `../ground-truth.json` (37 good / 45 exclude /
2 corpse-only probable, 40 exact emblem/firing kill times). Scorer:
`../score_detector.py` (exact hit = event within 0.5 s of a kill time;
window hit = event inside window ±2 s; flagged j59 w03/w07 excluded from
timing, 38 scoreable kills).

## Headline result — existing Reyna skull-ring profile (uncalibrated, thr 0.78)

| Metric | Value |
|---|---|
| Exact kill hits | **2 / 38 (5%)** |
| Window-only hits | 1 |
| Missed kills | **36 / 38** |
| Detector events total (7 clips) | 36 |
| Events inside reviewed exclude windows (true FP) | 2 |
| Events outside all reviewed windows (unlabelled territory) | 31 |
| Exact hits on the Reyna clip (the profile's own agent) | 1 / 8 |

Per clip: 1v9 0/7, Champions 0/3, Reyna 1/8, Z210 0/5, iufs 0/7 (+1 window),
j59 1/6, Warden 0/2. The profile produced **zero events at all** on the 1v9
(Chamber) and Warden clips.

## Interpretation (do not overclaim)

- This is a **single-agent, single-fixed-ROI template** working exactly as
  documented ("uncalibrated, not validated"). Source clips contain multiple
  agents, source-edited zooms/warps that move the HUD, and scoped play where
  the centre emblem ROI is covered. A 95% miss rate there is a profile-coverage
  result, not proof the approach is dead — labels-curves work in
  `selection-calibration-20261012-153257/` showed the template fires on its
  own Reyna calibration windows.
- The 31 out-of-window events are **not confirmed false positives**: reviewed
  windows only cover strong-audio candidates. Scoring them needs a negative
  review pass; treat as "unknown", reported separately.
- Within reviewed territory precision is also poor: only 3 of 36 events land
  in/near a true kill window.

## What this proves for the build order

1. Calibrating this one template harder (threshold tuning) cannot fix agent /
   layout / scope coverage. Detector work must go **multi-signal**: centre
   emblem + kill-feed + ammo-drop/enemy-outline changes, per-agent/layout
   profiles, with this ground truth as the regression set.
2. Ground-truth hygiene mattered: scoring against the pre-dense labels would
   have counted round-end/ability peaks (Z210 307.0/361.4, iufs 362.1) as
   detector hits and 4 real edge kills as false positives.
3. Next audit steps, in order: (a) killfeed ROI detector scored the same way
   (needs transient list; API `killfeed.detect_changes(path, transients)`);
   (b) score-curve extraction at all 40 GT kill times with the existing
   templates to measure headroom before adding signals; (c) only then patch.

Reproduce: `make_ground_truth.py`, `run_povkills_audit.py` (needs ffmpeg +
PyAV shim, see sandbox notes), `score_detector.py detector-audit/povkills-*.json`.
Sandbox used FFmpeg 7.0.2 static (imageio-ffmpeg) + `setup/tools-sandbox/ffprobe`
under the audit venv; production on Windows uses FFmpeg 9.0.1 — rescan there.
