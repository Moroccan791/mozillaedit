# Stage 1 selection labels — 2026-10-13

Independent agent visual review of decoded raw-clip frames. Audio
`candidate_events` (from `aive.firing_map`, sample-zero, <=600s) are used ONLY
to locate windows; every verdict below comes from actually viewing frames.

- `firing-maps/` — candidate maps for all 7 raw sources (candidates, never kills).
- `sheets/` — 12 NMS-ranked 20-frame review sheets per clip (20fps-derived, timestamped).
- `window-report.json` — window bounds + sheet paths.
- `review-*.json` — per-clip verdicts: good_kill_window / probable_kill_verify /
  exclude, with signals and best moments.

Progress: 7/7 clips COMPLETE — Stage-1 sheet pass done (84/84 windows).
Totals: 27 good_kill_window, 15 probable_kill_verify, 42 exclude,
46 kill timestamps recorded. FP taxonomy (10 classes): rotation/walking,
scoreboard+TAB, death, buy-phase, ability cast, sponsor-ad voiceover,
source-edit transitions (whip/rainbow/green-flash), round-end stings
(WON/THRIFTY/VICTORY), shots-no-kill, black outro. Calibration note:
small pink badge under crosshair = source edit sticker, NOT kill emblem
(confirmed across rounds in z0ALKJiFRDU).
- z0ALKJiFRDU (Warden): 1 good (240.8 clutch-WON), 4 probable
  (44.5, 358.9, 367.8, 449.8), 7 exclude.
Next: dense-resample the 15 probable kills (+ spot-check notes) for exact
shot times, then audit/repair povkills+killfeed against this ground truth.
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
- iufseng8xEs (ranked): 6 good_kill (156.1, 174.8, 194.7, 260.3, 362.1, 460.3),
  1 probable (305), 5 exclude (intro, green-flash, Thrash/ability, scoreboard,
  passive smoke). NOTE: sheet stamp bug for negative lo renders as -M:SS
  (w00 frames are actually clamped t=0); also 1:60.0 = 120.0s formatter quirk.
- j59f0UqxcIs (90 aim 10 brain): 7 good_kill (61.8 sniper, 234/236.3,
  245.2 util, 385.5 trade, 398.6, 483.4+487.1 multi), 5 exclude
  (hold-no-contact, aiming, VICTORY screen, passive aim, black outro).
Next: label last clip (z0ALKJiFRDU), then dense-resample probable
kills for exact shot times.


Label versions for clip 4 (Z210dNkaapY): canonical = e2c8f7b pass (4 good /
8 exclude); .alt-bd40df6 = first pass; .alt-d9538e8 = parallel-session pass
(3 good / 5 probable / 4 exclude). Disagreements on w02 (blood-wall resample
lead 98.5/102.7), w03 (CLUTCH kill 107.5), w06 (shot-no-kill edge 287),
w09 (pre-window kill 355), w11 (WON-kill 416) -- reconcile during detector
audit step: probable => audio peak is kill-ADJACENT (banner/devour/round-win
sound), which povkills/killfeed SHOULD also learn to accept.

## Parallel analyses (for detector-audit reconciliation)
Canonical review-*.json files = session agreed pass. Independent passes kept:
- review-Z210dNkaapY.alt-{bd40df6,d9538e8,e023fb2}.json — clip-4 alternates.
- review-iufseng8xEs.alt-e023fb2.json — clip-5 alternate.
e023fb2 vs canonical differs on 5 windows: clip4 w8/w9 kill-time offsets
(309.1/355.5 vs 307.0/361.4), clip4 w11 probable-vs-exclude; clip5 w1
probable-vs-exclude, w8 offsets (304.1/308.5 vs 301.5/306.5), w9 second
kill 364.1. Dense resample during step-3 audit decides each.

## Dense-resample pass — COMPLETE (2026-10-13, later session)

All 24 dense sheets reviewed; see `DENSE-REVIEW.md` + `dense-review.json`.
Totals after reconciliation: **37 good / 2 probable / 45 exclude, 40 exact kill
times** (was 27/15/42/46). 3 canonical good kills deleted (Z210 w08/w09,
iufs w09), 4 excluded windows promoted to good (Z210 w03/w06/w11, iufs w01),
iufs w08 overcount fixed to one kill @305.6. Remaining probables: ObWy w01/w08
(corpse-only). Unresolved: j59 w03/w07 out-of-window kill times (suspected
mm:ss corruption) — dense re-check needed. Next: detector audit of
povkills+killfeed against this corrected ground truth.
