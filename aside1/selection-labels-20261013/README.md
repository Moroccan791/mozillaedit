# Stage 1 selection labels — 2026-10-13

Independent agent visual review of decoded raw-clip frames. Audio
`candidate_events` (from `aive.firing_map`, sample-zero, <=600s) are used ONLY
to locate windows; every verdict below comes from actually viewing frames.

- `firing-maps/` — candidate maps for all 7 raw sources (candidates, never kills).
- `sheets/` — 12 NMS-ranked 20-frame review sheets per clip (20fps-derived, timestamped).
- `window-report.json` — window bounds + sheet paths.
- `review-*.json` — per-clip verdicts: good_kill_window / probable_kill_verify /
  exclude, with signals and best moments.

Progress: 4/7 clips complete (48 windows).
- 2Ywo4r3D9DM (1v9): 2 good_kill, 4 probable, 6 exclude
  (rotation/scoreboard/death/buy-phase/ability = semantic FP classes).
- 56-Wg-oTX6M (Champions 2026): 2 good_kill (209.2, 313.9),
  2 probable (54.2, 416.5), 8 exclude -- incl. a 40s sponsor block (114-154s)
  with 5 consecutive FP windows (voiceover/music swell) + edit-transition FP.
- ObWy97A6INU (reyna montage): 5 good_kill (4.1, 288.1 ACE, 329.6, 365.1,
  431.5/435.7 multi), 4 probable (45.5, 341.5, 358.0, 505.5), 3 exclude
  (THRIFTY round-end sound FP, shots-no-kill, passive aim). FP classes also
  incl. colored edit-transition smears and pre-window kill aftermaths.
- Z210dNkaapY (aim clip): 4 good_kill (27.7, 275.7, 307.0, 361.4), 0 probable,
  8 exclude -- FP classes: death/spectate+subscribe-callout, Raze-nade
  explosion, round-win jingles (CLUTCH/WON), corpse-cam, shots-no-kill
  duels, passive holds, corridor rotation.
  ALT annotation: review-Z210dNkaapY.alt-bd40df6.json = parallel-session pass
  on same sheets (2 good/3 probable/7 exclude; agrees on kill times, differs
  in good-vs-probable calibration + flags 97.5/304.5 as probable). Reconcile
  both during detector-audit spot checks.
Next: label remaining 3 clips (36 sheets), then dense-resample probable
kills for exact shot times.
