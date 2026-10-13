# Stage 1 selection labels — 2026-10-13

Independent agent visual review of decoded raw-clip frames. Audio
`candidate_events` (from `aive.firing_map`, sample-zero, <=600s) are used ONLY
to locate windows; every verdict below comes from actually viewing frames.

- `firing-maps/` — candidate maps for all 7 raw sources (candidates, never kills).
- `sheets/` — 12 NMS-ranked 20-frame review sheets per clip (20fps-derived, timestamped).
- `window-report.json` — window bounds + sheet paths.
- `review-*.json` — per-clip verdicts: good_kill_window / probable_kill_verify /
  exclude, with signals and best moments.

Progress: 2Ywo4r3D9DM (1v9) windows w00-w05 labeled; w06-w11 pending.
