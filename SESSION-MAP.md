# SESSION-MAP — reconstructed timeline of the two prior sessions

Source of truth: the committed handoff notes in `aside1/` plus the code in `setup/`.
No Outside/aside chat transcripts are in this repo, so this is a reconstruction from
dated artifacts — every claim below is traceable to a file in the repo. Windows paths
(`E:\...`) and Aside session ids come from those notes. Nothing here is invented.

---

## Session 1 — 2026-10-12 → early 10-13: "build the working engine"

Continuations run that day (in likely order): `aside` baseline → `aside3` resume →
system-lock → `automation` → `account5` → `account6` → `reflections-fresh`.

### 1a. Timing foundation, 10 s sync proofs
- `aside1/sync-proof/`: `run-f3b0Iv` v1 and `run-tNKVpP` v2 (Dracula + 1v9 footage),
  `REAL-PROOF-RESULTS.json`, `confirmed-1v9-dracula.json`. All structural/timing QA PASS,
  frames within 1 at 60 fps, joint correlations 0.997/0.982/0.993, 28 Python + 16 Node tests.
- Explicit caveat recorded then and still true: 0 ms source↔output offset is **render-clock
  fidelity**, not independently verified gunshot↔musical-hit sync.

### 1b. Multi-source renderer + real previews
- `aside1/multisource-proof-20261012/RESULTS.md`: new separate `encounters/v1` renderer,
  2 sources, 572 frames/9.533 s, 3 intact encounter windows, 0 ms anchors, 73 tests PASS.
- `aside1/burn-preview-20261012-151632/RESULTS.md`: 35 s **Let The World Burn preview**
  (2100 frames/720p60, excerpt 16.254–51.254 s, 10 hand-reviewed POV firing/outcome
  sequences, no repeats, QA PASS, −12.99 LUFS). Selection was hand-reviewed, not automatic.

### 1c. Selection calibration + production audit (the honest failure record)
- `aside1/selection-calibration-20261012-153257/` — newest unfinished selection work;
  `CURRENT-SELECTION-WORK.txt` points here. `production-audit-v1/RESULTS.md`:
  production scan → **24 visual observations, 0 confirmed kills**; 4/5 template-derived
  references match, **0/5 true held-out** match. Template leakage documented; profile stays
  explicitly uncalibrated; "do not fix by lowering thresholds".
- `aive/povkills.py` + tests: profile-local icon matching with temporal persistence and
  nearby-audio association, conservative candidate/confirmed records.

### 1d. User rejection → audit → authored-footage engine
- `aside1/rejection-audit-20261012/ASSESSMENT.md`: **both 23.53 s previews rejected** —
  "neither looks like an edited montage and gunshots do not match music". Findings: weak
  accent selection, unsupported downbeat phase, wrong burst handling, missing authored
  grammar; 129 BPM grid distrusted (independent periodicity favors ~93/186 BPM family).
  `NEXT-PROOF-SPEC.md` defines the 8–12 s acceptance gates.
- `standalone-accent-audit.json`: all 6 targets conservatively rejected → false-rejection
  calibration still required. `aive/accent_audit.py` + 14 tests. Final 146 tests PASS.
- `aside1/authored-footage-20261012/RESULTS.md`: opt-in `authored-footage/v1` renderer —
  setup/impact/contrast/payoff roles, edge pans/smear, inset composition, frame-exact fade;
  152 tests PASS; real 8 s 640×360 diagnostic renders with byte-identical stems.
- `aside1/system-lock-20261012/CONTINUE-HERE.md`: **existing-system-only policy** —
  `edit.py studio` front door, legacy export shortcuts blocked, forced authored style,
  visual screening not disableable; 384 tests PASS; original preferred 8 s plan recreated at
  720p60 with stems identical to the old diagnostic and delivered for review.
- `aside1/other-stages-20261012/resume-comparison-20261012/RESULTS.md`: Aside3 resume —
  clean control without replanning, QA style classification fix, warning-bearing runs
  reported instead of failing, `--style` exposed on `render-encounters`.

### 1e. Automation + account5 foundations
- `aside1/automation-20261012/CONTINUE-HERE.md`: 218 tests PASS57.006 s. New
  `hit_map`, `firing_map`, `rhythm_planner`, `automation_runner`, `attack_qa`,
  `encounter_text`, `visual_gate`. Unscreened 8.039 s proof visually rejected
  (subscriber graphic/black/post-round); screened `job-v0004` rendered 8.071 s with 5/5
  candidate matches — not visually approved.
- `aside1/continuation-20261012-account5/CONTINUE-HERE.md`: 311 tests PASS50.831 s.
  Added `gameplay_gate.py` (22 tests, reviewed-evidence validator, not a classifier),
  `multishot_map.py` (18 tests, up to 32 reviewed anchors, C2 quintic gaps, analytic
  playback bounds), `closure_qa.py` (18 tests), `music_lyrics.py` (16 tests, local
  faster-whisper adapter, UNVERIFIED candidates only), `lyric_design.py` (designed
  graphic moments, no caption stream). Real 30 s/60 s three-source 720 p60 stress renders:
  1800 frames/76.562 s and 3600 frames/158.282 s, full decode PASS.
- `aside1/reflections-fresh-20261012/CONTINUE-HERE.md`: user asked for a proper 30–50 s
  fresh build. `local_preview_runner.py` + `local_authored_planner.py`, `authored-footage/v2`
  (4–24 clips, ≤50 s, bounded local exposure/zoom envelope). Delivered **Reflections v2**:
  `resumed-local-jobs/job-v0002/renders/encounters-v0001/encounters.mp4`, 34.833 s video /
  34.834 s audio, 1280×720/60, 2090 frames, 10 clips, 409 tests at that checkpoint. v1
  preserved, no lyrics. Earlier `job-v0002` v1 had a missing-QA-field bug (aliases added
  after v1) — traced and regression-covered.

### 1f. Portable + generic system (late 10-12 into 10-13)
- `aside1/PROGRESS.md` sections "Reusable lyrics and generic-system continuation" and
  "Content-bound calibration continuation" carry session 1 into session 2.

---

## Session 2 — 2026-10-13: "generic reusable system" (evidence root `aside1/generic-system-20261012/`)

`generic-system-20261012/CONTINUE-HERE.md` (450-test snapshot) and
`identity-binding-v0001/CONTINUE-HERE.md` + `RESULTS.md`, `local-lyrics-v0001/`
`CONTINUE-HERE.md` + `RESULTS.md` are the authoritative notes. Summary:

1. **Planner/pruning + lyric workflow increment (450 tests PASS107.128 s)**
   - Fixed late beam pruning and the earlier 1024-option pre-cap with one shared
     effect-safe partial-state ranking; defaults stay beam 24 / max-options 1024 /
     10–20 shots / 30–50 s / 1x. Added genuine early pre-cap regression + counters.
   - New `aive/lyric_workflow.py`: `prepare_lyrics()` (preflight BEFORE video),
     `apply_prepared_lyrics()` (text BEFORE QA), `extract_lyric_candidates()`,
     `SparseTypographyPolicy`. Binds exact song SHA + sample-zero excerpt + canvas;
     snapshots inputs/fonts; protects candidate & confirmed audio/visual clocks, full
     attack intervals and authored-v2 windows; never all-word captions.
   - `local-preview --lyrics off|verified|candidates` + track/design/model/language/
     max-moments/fonts-root/calibration-labels. Requested lyrics that fail preflight block
     (exit non-zero) — no lyric-free fallback.
   - New `lyric-prepare` and `calibration-report` CLIs; configurable `fonts_root`;
     bounded decode caps; 4096-entry long-protection cap (not truncation).
   - Two synthetic 35 s lyric proofs (tones, not singing): 1050 frames each, audio PCM
     identical before/after text, originals unchanged.
2. **Content identity binding (483 tests PASS91.479 s, final reviewed suite)**
   - New `aive/media_identity.py`: bounded full-file SHA256 capture (8 GiB/file, 32 GiB
     aggregate, ≤65 unique inputs, 60 s shared budget); `encounter_render` verifies
     source/music hashes **before and after** rendering — ordinary change fails closed
     before a completed manifest.
   - Attack stems hashed before/after decode (128 MiB/stem) with decoded PCM hash/prefix/
     clock evidence; independent attack calibration now requires matching identity +
     checked stem/PCM evidence; legacy/stale/aliased identities reject; assignment-
     conditioned matches stay descriptive (no whole-stem PR).
   - `streaming-recheck/proof-summary.json`: old Reflections v2 artifacts unchanged, all 10
     acoustic assignment rows identical, gameplay 5 measured/3 ambiguous/2 unmeasurable,
     music 10 unmeasurable.
3. **Local lyrics setup + review handoff (496 tests PASS97.501 s, latest full suite)**
   - User-approved local-only setup in the existing venv: faster-whisper 1.2.1,
     CTranslate2 24.8.2, PyAV pinned to 15.1.0 (PyAV 19 API mismatch with faster-whisper
     1.2.1). Pinned `small.en` revision `d1d751a5…`, weight 483,545,366 bytes matching the
     published LFS SHA; setup 114.575 s; CPU int8 / 2 threads / offline `local_files_only`.
   - Real extraction: Reflections (45.349 s) → **32 UNVERIFIED words** in 26.302 s;
     The Winner Takes It All (79.227 s) → **54 UNVERIFIED words** in 27.911 s. Let The
     World Burn (13.047 s) and Dracula (13.643 s) **rejected** for invalid ASR word
     durations — no clamping, failures preserved.
   - New `aive/lyric_review.py` + `lyric-review` CLI: binds exact source / sample-zero PCM
     / candidate JSON, emits explicit PENDING coverage/reviewer/method/dispositions/
     corrections/additions. Never converts review into a verified track.
   - Estimated time frame was corrected: the earlier "4–8 days / 32–64 hours" estimate was
     withdrawn as ungrounded in actual agent pace — report measured runtimes instead.
4. **`multishot-authored-v0001` — the in-progress milestone (stopped mid-work)**
   - `WORK-SCOPE.md`: extend the renderer with an explicit combined API style; validated
     supplied multishot gap map → existing authored video graph; existing styles and
     hash/music/anchor bindings unchanged; mapped authored guards must protect full
     supplied attack/map intervals; compare synthetic combined vs multishot-only for exact
     PCM/frame clocks and composition. "Plumbing/evidence, not semantic/aesthetic
     acceptance."
   - Explicit stop rule: **do not silently feed combined retiming through
     `lyric_workflow`** (it assumes 1x source-local candidate protection and calls
     `validate_plan` without map inputs). Supported pipeline / local-preview /
     lyric-prepare stay unchanged until a combined front-door provenance+QA+lyric
     mapped-clock workflow is tested. *(2026-10-14: this stop rule is now machine-enforced
     by the `render-clock-model/v1` boundary — see `HANDOFF.md`.)*
   - What landed in code before the stop: `RenderConfig.style` accepts `multishot-authored`
     (`MULTISHOT_STYLES`, `AUTHORED_STYLES`, `COMBINED_LIMITATIONS`,
     `combined_style_policy` in the manifest), `test_multishot_authored.py` (9 tests), and
     `run_combined_proof.py` (synthetic 4-clip proof asserting identical game/music PCM,
     identical frame/sample counts, changed video, full decode).
   - `CALIBRATION-BLOCKERS.md`: independent audit of the calibration evidence — template
     leakage (expanded templates built inside nominal held-out windows), train/validation
     range overlap, path-based rather than content-based historical identity, non-exhaustive
     labels. Required next evidence: fresh, content-hash-bound, independently annotated
     source intervals with disjoint train/validation/test splits.

---

## Continuation log — 2026-10-14 (this session)

Memory rebuilt into `MEMORY.md` / `HANDOFF.md` / `SESSION-MAP.md`; font-root portability
fixed; the `render-clock-model/v1` 1x-clock boundary implemented and enforced with
`tests/test_lyric_clock_boundary.py`; the stopped `multishot-authored-v0001` proof ported
and run on Linux. Full suite **512 tests OK (skipped=1)** in ~45 s. Then, at the user's
request, the real pipeline was run on repo media into `test-sample-mp4/`: sample A
(8.484 s, studio candidate preview, Overheating + Winner Takes It All 42→50.5 s) and
sample B (35.000 s, local-preview, Warden + Reflections 8→43 s), both warn-only QA; two
30 s attempts blocked honestly. Details/commands in `test-sample-mp4/README.md`.

## Standing constraints carried into every session

- Never reset/rebuild the dirty local repo; never overwrite originals or historical jobs.
- No invented events/labels/review metadata; no threshold loosening to force a pass; no
  silent fallback (lyrics, styles, encoders) — block or fail closed instead.
- Persisted JSON/report assertions are not authentication; source hashes bind bytes, not
  meaning. `perceptual_approval` stays false everywhere.
- Update handoff docs + test logs whenever a milestone finishes.
