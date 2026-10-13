# Detector audit — povkills + killfeed vs corrected ground truth

**Scope (read first):** windowed audit over the 84 labeled windows expanded
±2 s, using the corrected ground truth (37 good / 45 exclude / 2 probable,
40 exact kill times; j59 w03/w07 exact times suspect and excluded from
timing stats). Both detectors ran through production code
(`detector-audit.py` → `detector-audit.json`). This is NOT a full-source
scan and supports NO full-source precision/recall claim. Probables excluded
from scoring. Sandbox runtime: imageio-ffmpeg 7.0.2 + PyAV ffprobe shim,
Python 3.11 venv (`setup/.venv`, local only).

## povkills (Reyna profile, baseline + expanded) — does not transfer

| profile | strict hits (≤0.5 s) | window-only | missed | exclude FP |
|---|---|---|---|---|
| baseline (3 templates, thr .78) | 2/35 | 1 | 32 | 2/45 |
| expanded (6 templates, thr .78/.80) | 5/35 | 1 | 29 | 5/45 |

- When it does fire on a true kill, timing is excellent (median error
  +0.07 s, range −0.37…+0.20) — the temporal logic is sound.
- But per-window max template score has **AUROC 0.50 (expanded) / 0.60
  (baseline)** against good-vs-exclude: no discriminative power across
  clips/agents. Even at threshold 0.90, 6/45 exclude windows score above it.
  Per-clip expanded hits: 0–1 per clip, including 0 on iufseng8xEs (0/7).
- Conclusion: the Reyna icon templates/ROI are source-specific, exactly as
  the profile's own limitations state. Raising/lowering thresholds cannot
  fix this (score distributions overlap completely). **Do not promote,
  do not retune thresholds on this data.**

## killfeed (ROI row-change, conditioned on firing-map audio candidates)

- **Localization: strong.** In good windows a row change falls within
  kill−0.5…kill+1.5 s in **29/35** cases, median offset **+0.09 s**
  (range −0.47…+1.24), and a change is *never* entirely absent (35/35).
  The 6 window-only cases have changes clustered a few seconds before/after
  the kill (teammate rows, multi-row updates), not at the kill row itself.
- **Discrimination: none, by design.** 44/45 exclude windows also contain
  row changes (typically 5–15 per window, one per audio candidate), across
  every FP class: ability casts 8/8, source-edit transitions 8/8,
  scoreboard 6/6, round-end 5/5, sponsor 6/7, rotation 2/2, death 2/2.
  This matches the module's documented contract — output is an
  *unconfirmed candidate*, not a kill. The audit confirms the contract is
  honest and that killfeed must never be used as confirmation alone.
- Timing lesson: kill-feed row time ≈ kill time +0.1 s median, so the feed
  is the best available *clock* for a kill once a kill is independently
  established — better than audio peaks (dense pass found audio/banner
  peaks up to 2.4 s off).

## Combined
povkills-OR-killfeed gives the same 29 TP / 6 FN as killfeed alone —
povkills adds zero true hits on this ground truth. The current
"audio candidate → killfeed change" pipeline therefore localizes kills
well *inside candidate windows already known to contain one*, and has no
working visual confirmation stage outside the Reyna source clip.

## Bonus finding
povkills fired at 285.7/288.3 inside j59 w03 (window 282.0–287.2) — more
evidence the canonical kill_time 245.2 is corrupt and the kill is really
in-window (dense re-check still required for ground-truth status).

## Repair directions (no threshold tuning)
1. **Generic kill-emblem template set:** build templates from the 37 GT
   kill windows themselves (center emblem region across agents/clips),
   evaluate leave-one-clip-out so no clip calibrates on itself.
2. **Killfeed persistence/identity gate:** a true kill row persists for
   seconds and sits in the feed stack; require sustained row presence
   (not a 1-frame saturated-pixel jump) and reject changes coincident
   with full-screen edit transitions (guard already exists in povkills).
3. Keep association rule: audio candidate + killfeed timing for the clock,
   emblem evidence for confirmation — never either signal alone.

## Reproduce
```
setup/.venv/bin/python -m pip install numpy scipy av imageio-ffmpeg  # local venv
# ffmpeg/ffprobe shims in setup/.venv/bin (imageio-ffmpeg binary + tools-sandbox/ffprobe)
cd aside1/selection-labels-20261013
PATH=$PWD/../../setup/.venv/bin:$PATH ../../setup/.venv/bin/python detector-audit.py
```
Runtime ≈ 3 min for 84 windows on this sandbox. Full-source scans were
deliberately not run: the labeled-window audit is the honest unit for the
detectors' calibration state.
