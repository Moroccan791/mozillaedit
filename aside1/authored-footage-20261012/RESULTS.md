# Authored-footage renderer checkpoint, 2026-10-12

## Status

Implemented a bounded opt-in visual engine increment. NOT a corrected montage,
not reference-style approval, not verified musical sync. The latest user
rejection in `../rejection-audit-20261012/ASSESSMENT.md` remains authoritative.

## Changed code

- `E:\ai-video-editor\aive\authored_footage.py`: strict `authored-footage/v1`
  design validator and controlled video filter graph. Four to eight clips,
  <=12s; explicit setup/impact/contrast/payoff render roles; paired horizontal
  edge pan/scale/smear; same-frame inset composition; frame-exact final fade.
- `aive/encounter_render.py`: separate `authored-footage` opt-in. Existing clean
  video filter and PCM extraction are retained. New graph files are persisted;
  source/music ranges, samples, CFR frames and event clocks unchanged at 1x.
- `edit.py`: `render-encounters --style authored-footage`. Not exposed as an
  automatic daily-runner style, because no production shot/phrase designer exists.
- `tests/test_authored_footage.py`: six additional tests covering fail-closed
  design, exact baseline rows/filter, malformed/unhashable data, protected
  anchors, actual FFmpeg composition/bridge/fade and identical stems.
- README: explicit schema, boundaries and limitations. Pre-change renderer,
  CLI and README copies retained in `backups/`. No originals, rejected controls,
  historical presets or unrelated dirty work reset, overwritten or committed.

This is a paired EDGE bridge around an unchanged hard cut, not an overlapping
wipe/crossfade. Inset is smaller uncropped footage over a blurred/desaturated
copy of the same decoded frame, not a new viewpoint or isolated subject. Fade
is VIDEO-only. Unknown bursts and semantic fight completeness are not certified
by roles, metadata or the validator. Supplied events have +/-0.18s protection
from bridge/fade windows. Unsupported legacy effects remain forbidden.

## Verified

- Baseline: 146 tests PASS, 29.237s. Updated full suite: **152 tests PASS,
  38.883s**, `tests-final.txt`. Authored isolated suite: six PASS, 8.232s before
  the additional malformed-field cases; those are included in final full suite.
- `edit.py render-encounters --help` verified. `git diff --check` successful;
  only existing LF/CRLF conversion warnings, no whitespace errors.
- Synthetic decoded proof checks exact240frames at30fps; byte-identical game
  and music WAV files; unaffected full-impact frame similarity; substantial
  contrast/bridge differences; black last frame; musical_sync remains warn.
- Independent read-only review found malformed list/object role/composition/
  direction values raising TypeError. Explicit string checks added and covered.
  No other concrete bug reported in that bounded review; review is not proof
  of exhaustive safety.

### Real footage diagnostic, intentionally unlabelled

`build_visual_diagnostic.py` creates fresh8s clean and authored comparisons from
four narrow snippets in the two existing sources. It **does not reuse/promote
historical confirmed labels**. Snippets/song25..33s chosen solely to exercise
renderer image states, not establish complete fights, strong musical targets,
resolved payoff or an approved edit. Design roles describe treatment only.

- Clean: `clean-renders/encounters-v0001/encounters.mp4`
- Authored: `authored-renders/encounters-v0001/encounters.mp4`
- Both:640x360,60fps,QSV,480frames,384000PCM samples/stem,8.000s.
- Game and music stems byte-identical by SHA-256; values in RESULTS.json.
- Summed logged renderer subprocess time: clean18.404s, authored18.390s.
  This low-resolution diagnostic is not a laptop/full-render benchmark.
- QA: four components PASS (structure, duplicate ranges, loudness, sparse
  visual heuristics), two WARN (`musical_sync`, no `event_anchors`), no FAIL.
  Loudness-10.89LUFS, true peak-1.87dBTP; no numerical clipping found.
- Decoded matched frames: impact outside treatment3.783s differs only1.383 mean
  RGB units/255; paired edge3.983/4.000s differs21.414/24.457; inset4.900s
  differs32.517; unaffected frame7.400s identical; final7.983s meanRGB0.
- Assistant inspected `visual-comparison.jpg` with decoded edge/inset/ending
  samples. Directional smear, inset/full-state difference, dimming and black
  final frame are visibly present. Source-owned effects remain visibly in the
  clean baseline and are NOT claimed as new work. Sparse samples cannot judge
  real-time motion feel, every-frame readability, safety or fight semantics.
- No perceptual listening established, so audio/taste/sync approval absent.

### Environment notes

Inherited Aside `PYTHONHOME` points at a different Python runtime and caused
SRE module mismatch in the existing project3.12venv. Remove it only for the
project Python command (`Remove-Item Env:PYTHONHOME`) instead of changing global
settings. Project venv has no Pillow; render uses stdlib/FFmpeg/NumPy QA without
installing anything. Contact sheet is composed separately by available Aside
runtime Pillow in `make_comparison_sheet.py`. Current FFmpeg9 removed the old
`-filter_complex_script` form; use the already-supported `-/filter_complex`
file input. Failed exploratory test was fixed and rerun successfully.

## Next bounded milestone

1. Calibrate the standalone acoustic audit against independent attack labels,
   including false rejection of mixed/overlapping stronger hits. Do not lower
   thresholds or declare generic onsets/downbeats certified merely to export.
2. Build reviewed per-firing burst/isolated-shot maps with decoded muzzle/ammo
   and audio evidence. Preserve uncertain points, exact intervals and source
   clocks. Roles and historical one-anchor labels are insufficient.
3. Select a coherent8..12s phrase and semantically reviewed acquisition/impact/
   contrast/resolved payoff source windows. Record per-attack assignments with
   explicit uncertainty and feasible timing; avoid interrupted engagements.
4. Apply this new authored schema to that independently reviewed plan. Use
   bridge/fade only away from protected attacks. Compare with clean at actual
   matched frames and independently measure final game-vs-music attacks.
5. Perceptual listening and real-time visual review still required. A resolved
   ending needs reviewed outcome/hold, not simply fading any last clip.

[blocked] Corrected final remains unavailable until the attack/fight/phrase
maps and actual listening/visual approval exist. This checkpoint supplies new
visual capabilities and reproducible engineering evidence, not that final.
