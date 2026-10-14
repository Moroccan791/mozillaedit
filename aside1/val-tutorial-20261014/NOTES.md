# Reference tutorials (`val tutorial/`, main branch) — what was measured

The user supplied four professional Valorant-montage tutorials in **this repository**
(`val tutorial/` on `main`, ~5 h 25 m combined, 239 MB). They are reference material for how
real montage edits are built — supplied right after the sample-B verdict (“we should have
slowed down the pace of gunshots”). This folder holds the durable result of reading them, so
the next session does not have to re-watch 5 hours of video.

The videos themselves are **not copied into git history here** (they would double 239 MB on
top of an already 1.7 GB `.git`). They remain on `main`; the measurements below are reproducible
with `analyze_edit.py <video>` against them.

| file | topic | length | resolution |
| --- | --- | --- | --- |
| `…-eJ3Ci6EK7o_how-to-edit-like-qwa-1-read-desc` | “how to edit like Qwa” (full edit breakdown) | 1:49 | 1280×720 |
| `…ICMLdeel5m4_How-to-Sync-Flow-Valorant-clips…Time-Remap` | **Sync flow** with After Effects Time Remap | 25:00 | 1280×720 |
| `…AN_oRgPeRrg_How-to-Create-SABER-GLOW-EFFECT…` | Saber glow effect | 14:05 | 854×480 |
| `…A0dQd_EvsVA_How-to-EDIT-a-PROFESSIONAL-VALORANT-Montage-AE` | full professional montage in AE | 41:54 | 640×360 |

## Spoken content: NOT transcribed (honest blocker)

`transcribe.py` (kept here) uses the pinned local model the project already ships at
`setup/models/faster-whisper-small.en-d1d751a5`. That directory contains only
`config.json`, `tokenizer.json`, `vocabulary.txt`, `README.md` — **`model.bin` is missing**
(it is `*.bin`-ignored by `.gitignore`, so it never travelled with the clone), and
HuggingFace downloads are blocked in this sandbox. The tutorials carry no subtitle streams
(checked with ffprobe). So **no transcript exists and none was invented** — the spoken
instructions are still unreviewed. To read them, put `model.bin` in that model directory on a
machine that has it, then:

```
python aside1/val-tutorial-20261014/transcribe.py "val tutorial/<file>.mp4"
```

Everything below is read from **actual frames** (screenshots of the editors’ timeline/UI, in
`frames/`) and from **measurements** (`measurements/`, `analyze_edit.py`).

## Technique, read from frames of the sync-flow tutorial

The tutorial is a Premiere Pro + After Effects workflow, and the key frames show:

1. **Music waveform on every edit layer, its peaks used as the sync grid** — `sync-0600.jpg`
   (10:00) shows the master audio with the full waveform across 6 layers.
2. **Time Remap + Speed Graph ramping** — `sync-0240.jpg` (4:00): a clip under
   `Time Remapping`, speed graph starting near **0** and rising to **~2.0×**
   (`0:00:02:20` playhead, graph guide at 2.0). The source is caught slow at the start and
   accelerated after.
3. **Flat speed-up through travel** — `sync-0840.jpg` (14:00) shows the waveform against a
   graph holding a constant **2.40** with an earlier slow hook: dead time (rotating, walking,
   reloading) is compressed rather than cut away.
4. **Progressive build by clip length** — `sync-1380.jpg` (23:00) shows the timeline stepped
   *diagonally*: successive clips get **longer** (≈1 s → 2 s → 3 s → long final), each ending
   on a beat, each with a ramp at its head. The “accelerando→ritardando” shape builds into the
   drop and then lets the final clip breathe.
5. **Layered composition, not full-frame reuse** — the same frame shows the gameplay scaled
   into a vignette with animated HUD/ability-graphic overlays and crossed-knife art; the
   gameplay HUD is kept, and graphics are added on top.
6. **Slow-down is applied on the action moment** (the flick/kill), speed-up on the travel —
   i.e. the exact opposite of a uniform clip pace.

## Measured comparison: reference edit vs. our own renders

Same detector for both (`analyze_edit.py`: ffmpeg scene scores for cuts, librosa onset peaks
for measured acoustic attacks). “|offset|” = distance from each cut to the nearest measured
attack.

| edit | length | cuts | median cut gap | \|offset\| mean | cuts ≤ 50 ms | ≤ 100 ms |
| --- | --- | --- | --- | --- | --- | --- |
| tutorial “edit like Qwa” (finished montage section) | 108.9 s | 30 | **1.90 s** | 0.040 s | 22/30 (73 %) | 29/30 (97 %) |
| tutorial sync-flow (edit UI, few scene cuts) | 25:00 | 2 | — | 0.007 s | 2/2 | 2/2 |
| sample A (10 s studio preview — user: “good”) | 8.5 s | 3 | 2.63 s | 0.019 s | 3/3 | 3/3 |
| sample B (35 s strict 1× — user: pace wrong) | 35.0 s | 8 | 3.27 s | 0.046 s | 3/8 | 8/8 |
| sample B2 (36.5 s, slowed pacing, Reflections) | 36.5 s | 8 | 3.57 s | 0.045 s | 5/8 | 7/8 |
| sample B2 (37.4 s, slowed pacing, mary on a cross) | 37.4 s | 5 | 6.63 s | 0.049 s | 3/5 | 5/5 |

Reading of these numbers (descriptive, not a quality claim):

- **Cut-to-attack accuracy is already competitive**: mean |offset| 0.045 s vs the reference’s
  0.040 s; every cut within 100 ms in B and 3/3 in A. The user’s “good” for A agrees.
- **The gap is cadence, not accuracy**: the reference cuts every **~1.9 s**; ours every
  **3.3–6.6 s**. Our clips are 2.5–3.5 s at 1×, so cuts are simply too infrequent to feel like
  the reference “flow” — this is the same direction as the user’s complaint, and matches
  technique #4 above (the build is made of *many, varied-length* clips).
- The paced runs moved cuts **later** (3.27 → 3.57 s) and made them land after longer gaps:
  pacing lengthens rows, so cadence drifts away from the reference unless clip count grows.

## What this implies for the engine (proposals, nothing built yet)

1. **Cadence preset** (small, in-engine): prefer *more, shorter* clips — the planner supports
   10..20 shots/30..50 s at 2..5 s each, so ~17 clips of ~2 s are already legal. A build shape
   (short → longer at the drop) is a planner priority, not a new renderer capability.
2. **Time-remap ramps with speeds > 1×** (engine extension): our map is stretch-only
   (`min_speed..1.0`, no intervals are ever sped up) and `impact_motion` uses ≤ 0.10 s atempo
   slices for gaps. The reference compresses travel at up to **2.4×** while keeping the action
   slow. Supporting that means admitting bounded speed-up slices and certifying them the same
   way (analytic bounds + protected bursts) — a real capability change, not a cosmetic one.
3. **Action-moment slow-mo**: the reference slows *on* the kill, not around it. Our current
   choice (user-selected 2026-10-14) is “bursts rigid 1×, gaps stretched” precisely to avoid
   smearing gunshot transients. Revisiting it would need a decision about accepting eased audio
   under the action (or re-timing the visual only).
4. **Layered composition / glow overlays** remain out of scope: no caption/graphics fabrication
   beyond the existing sparse design, and no visual-AI footage selection.

## Reproduce

```
python aside1/val-tutorial-20261014/analyze_edit.py "val tutorial/<file>.mp4" \
       --out aside1/val-tutorial-20261014/measurements
```

`transcribe.py` and `analyze_edit.py` are reference tools only — they are not part of the
editor pipeline, promote nothing and certify nothing.
