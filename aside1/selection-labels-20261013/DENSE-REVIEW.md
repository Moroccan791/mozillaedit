# Dense-resample review — COMPLETE 2026-10-13

All 24 dense sheets (`dense/`, 6.3–8 fps, 0.1 s stamps) reviewed frame-by-frame.
Machine-readable verdicts: `dense-review.json`. Canonical `review-*.json` files
were NOT edited; this pass is the reconciliation layer over them.

## New totals (84 windows)

| | Stage-1 sheet pass | After dense review |
|---|---|---|
| good_kill_window | 27 | **37** |
| probable_kill_verify | 15 | **2** (ObWy w01, w08 — corpse-only, no exact time) |
| exclude | 42 | **45** |
| recorded kill timestamps | 46 (incl. bogus) | **40 exact** |

22 windows changed verdict or kill times. Only 2 probables remain, both
corpse-aftermath windows with bounded (not exact) kill times.

## Biggest corrections

- **2 canonical "good" kills deleted** — Z210 w08 (307.0) was WON round-end +
  passive hold; Z210 w09 (361.4) was a passive stair hold + Reyna ability cast;
  iufs w09 (362.1) likewise shows ability cast/explosion + WON, no POV kill.
  All three were audio peaks at window edges misread as kills.
- **4 excluded windows actually contain kills** — Z210 w03 CLUTCH kill 107.6,
  Z210 w06 Sheriff edge-kill 286.4 (1.2 s *after* the canonical window's hi
  bound — window bounds caused the miss), Z210 w11 WON-kill 417.8,
  iufs w01 edge kill 71.5 (e023fb2 was right).
- **Overcounts removed** — iufs w08 has exactly ONE kill (305.6), not two/three;
  prior extra claims were the player's own death/respawn and wavy-overlay peaks.
  ObWy w07's second "~348 scope shot" is shots-no-kill.
- **Timing corrections for the detector audit** — 56 w00 kill is 51.8, not 54.2
  (banner-edge/audio peak runs ~2.4 s late behind a green-flash transition);
  ObWy w11 Operator kill 506.3 (not 505.5); iufs w08 emblem lags firing by
  ~0.5–1 s. 2Ywo w05's canonical 333.0 was corrupt (3:33 read as seconds);
  true kill 213.2. The phantom sheet d05 (330.5–337.0) contains no kill.

## Detector-audit lessons (feed into povkills/killfeed repair)

1. Round-end proximity is NOT an exclude rule by itself (Z210 w11, z0 w11 are
   real kills just before WON/BUY) — but a WON/CLUTCH banner with no preceding
   firing+emblem IS a false positive (Z210 w08, z0 w09).
2. Giant red blood-wall / green-flash source-edit overlays obscure or mimic
   evidence — overlay frames must be excluded from emblem evidence.
3. Death/respawn ghost, corpse discovery, and devour/orb aftermath all produce
   audio peaks 0.5–3 s after the true shot; emblem/firing frames are the only
   exact-time ground truth.
4. Ability casts (Reyna eye, Chamber scope noise, explosions) are a recurring
   FP class with zero visual kill evidence.
5. Candidate windows cut too tight miss edge kills (Z210 w06) — audit should
   score ±2 s around window bounds.

## Still unresolved

- j59 w03 (kill 245.2 vs window 282.0–287.2) and w07 (398.6 vs 455.4–460.6)
  have out-of-window kill times like the corrupt 2Ywo 333.0 — suspected
  mm:ss/seconds mixups. Needs a small dense re-check before use as ground truth.
- ObWy w01/w08 remain probable: corpse-confirmed kills with bounded times only.

## Next step

Detector audit: run `aive.povkills` + `aive.killfeed` against this corrected
ground truth (37 good / 45 exclude / 40 exact kill times, ±0.5 s tolerance,
±2 s edge scoring), report per-class FP/FN from the 10-class taxonomy, then
patch detectors with regressions. Do not retune on the 2 remaining probables.
