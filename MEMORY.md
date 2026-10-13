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
`multishot`, `authored-footage`, `multishot-authored`), verified-lyrics machinery
(fail-closed, designed graphics only), bounded content identity, closure/calibration audits.

Blocked / unfinished — every one of these still needs a human-evidence step:
1. **Real sung-word verification** — ASR candidates exist (Reflections 32, Winner 54
   UNVERIFIED words) with PENDING `lyric-review` handoffs; no corrected track, no sung
   verification, no lyric render on gameplay.
2. **Reliable gameplay/POV/outcome detection** — expanded Reyna profile uncalibrated; 24
   full-source observations / 0 confirmed kills; 0/5 held-out references matched.
3. **Layered-song attack/beat calibration** — attack QA conservatively abstains; no
   independent labels, no whole-stem PR, `musical_sync` unverified.
4. **Combined multishot+authored front door** — the renderer API experiment exists and the
   clock boundary is now *enforced* (retimed/mapped plans are refused by the 1x lyric/
   closure paths and the CLI cannot select retimed styles), but a real combined front-door
   provenance/QA/lyric mapped-clock workflow does not exist.
5. **Closure / phrase endings, richer effects, perceptual acceptance, benchmarks.**

## Next work order (from session 2's handoff, still current)

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

**Current suite: 512 tests OK (skipped=1) in ~45 s** with
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
