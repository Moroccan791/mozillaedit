# MEMORY — mozillaedit (Valorant montage editor)

Rebuilt: 2026-10-14 (Asia/Dhaka). This file is the entry point. Read order:
**MEMORY.md → HANDOFF.md → SESSION-MAP.md → `aside1/AI-CONTINUE-HERE.md` → `setup/AGENTS.md`.**

## What this repository is

`github.com/Moroccan791/mozillaedit` — the preserved work product of the user's local
Valorant montage editor. The live project is `E:\ai-video-editor` on the user's Windows
laptop (dirty local repo, **never reset/rebuild**). This GitHub repo carries a full
snapshot of it plus every checkpoint so work can continue elsewhere:

| path | contents |
| --- | --- |
| `setup/` | the complete editor source snapshot (231 files): `edit.py` CLI, `aive/*.py` engine (~13k LOC), `tests/` (506 tests), fonts, model *config* only, docs (`AGENTS.md`, `ATTACK-CALIBRATION.md`, `LYRIC-REVIEW.md`, `MULTISHOT-MAP.md`, `CLOSURE-QA.md`, `MUSIC-LYRICS.md`, `README.md`) |
| `aside1/` | session evidence + handoffs (2,821 files): `PROGRESS.md`, `START-HERE.md`, `AI-CONTINUE-HERE.md`, `generic-system-20261012/` (session 2), `system-lock-20261012/`, `authored-footage-20261012/`, `rejection-audit-20261012/`, `selection-calibration-20261012-153257/`, `reflections-fresh-20261012/`, `automation-20261012/`, `continuation-20261012-account5/` |
| `raw/` | 7 raw Valorant MP4s (~492 MB) — the montage source pool |
| `reference/` | 7 supply/reference montages (Espresso, APT, All Night, New Jeans, Timeless, Let The World Burn, Ocean Eyes-excluded) |
| `audio/` | 12 selected songs ("edit audio" files) + 2 legacy ASR `_words.json` (NOT verified lineage) |
| `overlays/`, `font/` | 66 effects assets; licensed Bebas Neue + Oswald (with `OFL.txt`) |
| `aside2…aside10`, `y/`, `x/` | browser `User Data` profile dumps. **Not project source.** Do not bundle browser data/credentials. |

Git history is one squashed import commit (`675ac79`); durable memory therefore lives in
files, not commit messages. No PRs or issues exist on GitHub. Work branch for this
session: `arena/770beeca-mozillaedit`.

## The goal and the non-negotiables

Song + raw Valorant clips → **polished cinematic impact montage** with true gameplay-event
alignment, bounded time remapping, authored effects, and automated QA — all local code.

Hard rules (enforced in `setup/AGENTS.md`, `aive/supported_pipeline.py`, docs):
no plain trim+song/global-grade export; no rebuild/reset; no repeated footage; no invented
events or labels; no fabricated review/alignment; no silent fallback (missing lyrics block
instead of rendering textless); no routine visual-AI selection; originals and historical
outputs preserved. Numerical PASS (0 ms clock fidelity, frame counts) is **not** taste or
musical-sync approval.

## Two prior sessions in this repo

Full detail in `SESSION-MAP.md`; summary:

**Session 1 — 2026-10-12, "build the engine" day.** ~8 continuations across accounts
(`aside`, `aside2`, `aside3`, `automation`, `account5`, `account6`). Engine went from a
10 s sync proof to: `studio` front door + existing-system-only lock (384 tests), authored
footage renderer v1/v2 (152/146 tests), automation pipeline (218), POV/attack/closure/
multishot foundations (311 tests), plus heavy evidence work (`rejection-audit`,
`selection-calibration`, `multisource-proof`, `burn-preview`). Delivered: 8 s recreated
720 p60 plan, 35 s Let the World Burn preview, multishot timing proof, and Reflections v2
(34.833 s / 2090 frames / 10 clips, 409 tests) — v1 preserved, no lyrics.

**Session 2 — 2026-10-13, "make it generic" day.** Seven reusable increments: planner
beam + 1024-option pre-cap fix with regressions, `lyric_workflow.py` + `lyric-prepare`/
`calibration-report` CLIs, configurable fonts root, `calibration_report.py` (read-only),
closure/calibration wiring. Then content identity binding (`media_identity.py`, bounded
full-file SHA256, fail-closed attack labels) → **FULL 483 tests PASS/91.479 s**. Then, with
user approval, local lyrics setup (faster-whisper 1.2.1, CTranslate2 24.8.2, PyAV 15.1.0
pin, pinned `small.en` weight SHA-verified) + `lyric_review.py` + `lyric-review` CLI →
**FULL 496 tests PASS/97.501 s**. Started `multishot-authored-v0001` (combined
mapped-retiming + authored composition style) and stopped mid-milestone.

## Where it actually stands (do not fake completion)

Done and tested: reusable engine, renderer styles (`clean`, `restrained-impact`,
`multishot`, `authored-footage`, `multishot-authored`, `slowed-pacing`), verified-lyrics machinery
(fail-closed, designed graphics only), bounded content identity, closure/calibration audits,
and candidate slowed-song pacing (`--pacing slowed-song`, bursts rigid 1x, gaps stretched onto
measured attacks, per-row certified maps, rigid/partial rows reported).

Blocked / unfinished — every one of these still needs a human-evidence step:
1. **Real sung-word verification** — ASR candidates exist (Reflections 32, Winner 54
   UNVERIFIED words) with PENDING `lyric-review` handoffs; no corrected track, no sung
   verification, no lyric render on gameplay.
2. **Reliable gameplay/POV/outcome detection** — expanded Reyna profile uncalibrated; 24
   full-source observations / 0 confirmed kills; 0/5 held-out references matched.
3. **Layered-song attack/beat calibration** — attack QA conservatively abstains; no
   independent labels, no whole-stem PR, `musical_sync` unverified.
3b. **Slowed-song pacing acceptance** — the mode is wired, verified and rendered twice
   (`test-sample-mp4/sample-B2-*.mp4`) but the user has not listened yet; the achievable pace
   change is bounded by the song's attack spacing, the encoder's 0.5x `atempo` floor, per-gap
   capacity and how much song remains. Anchors stay unreviewed.
4. **Combined multishot+authored front door** — the renderer API experiment exists and the
   clock boundary is now *enforced* (retimed/mapped plans are refused by the 1x lyric/
   closure paths and the CLI cannot select retimed styles), but a real combined front-door
   provenance/QA/lyric mapped-clock workflow does not exist.
5. **Closure / phrase endings, richer effects, perceptual acceptance, benchmarks.**

## Next work order (from session 2's handoff, still current)

0. **Listen to `test-sample-mp4/sample-B2-*.mp4`** (paced) against
   `sample-B-35s-local-preview-reflections.mp4` (strict 1x) and report what still feels wrong —
   that is the only acceptance signal for the pacing work.
1. Run `lyric-review prepare/audit` for the exact candidates; listen and correct real sung
   words/onsets/offsets by hand. No fabricated/clamped labels.
2. Verify corrected exact-file tracks; run `lyric-prepare` / `local-preview --lyrics
   verified` across songs; keep candidate proofs distinct from delivery.
3. Supply independent calibration labels (gameplay + sustained/layered music), then patch
   detectors with held-out regressions.
4. Integrate reviewed multishot maps with authored effects without invalidating
   audio/visual/lyric clocks; preserve bursts and full fights.
5. Phrase/coherent-ending selection + richer authored visuals, then real listening/visual
   acceptance and laptop benchmarks.
6. Update the handoff docs, test logs and portable bundle whenever finishing.

## This session (2026-10-14, Linux sandbox)

Repo probed end-to-end and the suite actually run here. Starting point: **506 tests, 8
failures, all of them only the Windows-default `E:\fonts` path** (font tests raise "bundled
OFL font face unavailable"). Two increments landed, both uncommitted:

1. **Font-root portability** — added `lyric_track.DEFAULT_FONTS_ROOT` with an
   `AIVE_FONTS_ROOT` env override and wired every `fonts_root=r"E:\fonts"` default to it;
   `tests.test_lyric_design` now 13/13 PASS.
2. **Enforced 1x-clock boundary** (`render-clock-model/v1`) — every render persists an
   explicit clock model in `plan.json` + `render-manifest.json` (`uniform-1x` for
   clean/authored-footage, `retimed-eased` for restrained-impact, `retimed-reviewed-map`
   for multishot/multishot-authored); the renderer rejects a plan whose marker contradicts
   the requested style, and `prepare_lyrics` / `apply_prepared_lyrics` /
   `apply_verified_lyrics` fail closed on any retimed/malformed clock before touching
   media. New `tests/test_lyric_clock_boundary.py` (6 tests) pins it, plus the front door
   cannot select retimed styles. The stopped milestone's proof
   (`multishot-authored-v0001/run_combined_proof_local.py`) was ported off its Windows
   paths and run here: identical game/music PCM, exact frame/sample clocks, changed video,
   full decode, retimed markers asserted.

### Reference tutorials supplied by the user (`val tutorial/`, main)

Four professional Valorant-montage tutorials (~5 h 25 m) were pushed to **main** and read on
2026-10-14. Spoken audio could **not** be transcribed (the pinned model's `model.bin` is
`*.bin`-ignored and absent; HuggingFace is blocked; no subtitle streams) — nothing was guessed.
What was extracted is in `aside1/val-tutorial-20261014/` (`NOTES.md`, `frames/` = editor-UI
screenshots, `measurements/` = cut-vs-attack numbers, plus reusable `analyze_edit.py` /
`transcribe.py`, and the bootstrap fix in `aside1/sandbox-env-setup.sh`).

Measured against our own renders with the same detector:

| edit | median cut gap | mean cut-to-attack offset | cuts ≤ 50 ms |
| --- | --- | --- | --- |
| tutorial "edit like Qwa" | **1.90 s** | 0.040 s | 73 % |
| ours, sample A (user: "good") | 2.63 s | 0.019 s | 3/3 |
| ours, sample B (1x) | 3.27 s | 0.046 s | 3/8 |
| ours, sample B2 (paced) | 3.57 / 6.63 s | 0.045 / 0.049 s | 5/8, 3/5 |

Conclusion: our cut-to-attack **accuracy** is already competitive; the remaining gap is
**cadence** (reference ≈1.9 s between cuts, ours 3.3-6.6 s). The frames also show the reference
technique: music waveform as the grid on every layer, Time Remap speed graphs ramping from ~0
up to ~2.0-2.4x through travel (slow on the action, fast through dead time), progressive
clip-length build into the drop, and layered graphics over scaled gameplay. Our map is
stretch-only (never >1x) and `impact_motion` gap slices are ≤0.10 s atempo, so travel
compression and action slow-mo would be real capability changes (proposals in NOTES.md, not
built).

### Slowed-song pacing (candidate-only, user-requested)

The user's verdict on sample B ("did good at the 10s clip but not in the longer one … we should
have slowed down the pace of gunshots with the sound bcs reflection was a slowed song") is
implemented as an explicit opt-in mode, never a global slowdown and never a fixed factor:

- `setup/aive/slowed_pacing.py` (`candidate-pacing-map/v1`) splits each row into measured burst
  clusters; a cluster is rigid 1x (transients are not smeared) and the gaps between clusters
  stretch with the C2 quintic ease so the next cluster head — or the row's cut, which is where the
  next cut begins — lands on a measured acoustic attack. Strength is per-gap, bounded by the
  analytic playback floor (`--slow-floor`, >= 0.5 because the audio path uses `atempo`) and a
  per-row budget; a row whose main candidate cannot reach an attack renders **rigid**, or
  **partial** (stretched, no beat claim), and says so in `pacing-report.json`.
- Renderer style `slowed-pacing`, clock kind `retimed-candidate-pacing`. `validate_plan`
  re-derives every row's map, rejects stale/hand-edited manifests, requires the report to declare
  every row exactly once (kept + rigid disjoint), and refuses a beat claim without its map or a
  map without a declaration. The plan duration bound counts only *certified* stretch.
- Runner: `local-preview --pacing slowed-song --slow-floor 0.55` (lyrics refused — the lyric and
  closure paths are 1x-only and fail closed on retimed clocks); writes `timeline-1x-candidate.json`,
  `pacing-report.json` and the retimed `timeline.json`; after the render it demands
  `manifest["style"] == "slowed-pacing"` and a truthy `candidate_pacing_policy`, so a silent 1x
  downgrade fails closed. A blocked candidate plan still surfaces as an honest BLOCK.
- Independent verification of the two renders: every claimed landing re-measured against the
  detected grid at **0.000000 s** error; protected bursts are the source PCM at 1x (best alignment
  0.00 samples, residual = the 44.1→48 kHz resample, ≈ −55 dB); per-row audio length equals the
  paced row duration. Reflections v2: 35.000 → **36.468 s**, 11 rows (5 matched / 4 partial / 2
  rigid), 11 stretched gaps, 3 cuts on attacks. mary on a cross v2: 35.000 → **37.436 s**, 11 rows
  (7 / 3 / 1), 18 gaps, 5 cuts. Delivered as `test-sample-mp4/sample-B2-*.mp4` for the user's
  listen; not yet perceptually reviewed.
- Honest limits: anchors are unreviewed detections, the grid is measured attacks (not certified
  meter), the candidate planner blocks for `--music-start` values whose first seconds hold no
  detected attacks (Reflections only plans from 8 s), and pacing room is song-limited (Reflections
  is 45.37 s long, so a 35 s cut from 8 s can only grow ≈2.4 s).

**Current suite: 529 tests OK (skipped=1) in ~51 s** (512 before + 17 new pacing contracts) with
`PATH=/home/user/.local/bin:$PATH AIVE_FONTS_ROOT=/home/user/mozillaedit/font`.
Environment bootstrap and exact commands live in `HANDOFF.md`.

**Real-pipeline samples (user request, same day):** `test-sample-mp4/` now holds two
renders from the real code + repo media — sample A (`studio --candidate-preview`, 8.484 s,
509 frames, Winner Takes It All 42→50.5 s, Overheating source, run 34.16 s) and sample B
(`local-preview --duration 35`, 35.000 s, 2100 frames, Reflections 8→43 s, Warden source,
run 91.68 s). Both pass full decode; QA is warn-only (`musical_sync`, `event_anchors`);
two 30 s local-preview attempts blocked honestly for insufficient candidate windows. See
`test-sample-mp4/README.md`. **First user listen (2026-10-14, late): sample A beat sync
"good"; sample B not reviewed yet.** Recorded as user-reported impression of a candidate
preview — no kills/semantics/finished-montage certification implied.
