# Stage 1 selection labels — 2026-10-13

Independent agent visual review of decoded raw-clip frames. Audio
`candidate_events` (from `aive.firing_map`, sample-zero, <=600s) are used ONLY
to locate windows; every verdict below comes from actually viewing frames.

- `firing-maps/` — candidate maps for all 7 raw sources (candidates, never kills).
- `sheets/` — 12 NMS-ranked 20-frame review sheets per clip (20fps-derived, timestamped).
- `window-report.json` — window bounds + sheet paths.
- `review-*.json` — per-clip verdicts: good_kill_window / probable_kill_verify /
  exclude, with signals and best moments.

Progress: 2/7 clips complete.
- 2Ywo4r3D9DM (1v9): 12/12 -> 2 good_kill, 4 probable, 6 exclude
  (rotation/scoreboard/death/buy-phase/ability = semantic FP classes).
- 56-Wg-oTX6M (Champions 2026): 12/12 -> 2 good_kill (209.2, 313.9),
  2 probable (54.2, 416.5), 8 exclude -- incl. a 40s sponsor block (114-154s)
  that produced 5 consecutive FP windows (voiceover/music swell) and a
  source-edit whip-smear transition FP.
Next: label remaining 5 clips (60 sheets), then dense-resample probable
kills for exact shot times.
