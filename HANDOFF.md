# HANDOFF — continue here

Updated 2026-10-14. Read order: `MEMORY.md` → this file → `SESSION-MAP.md` →
`aside1/AI-CONTINUE-HERE.md` → `setup/AGENTS.md`.

## START HERE TOMORROW (2026-10-15)

1. `bash /home/user/env-setup.sh` — rebuilds the sandbox venv/ffmpeg/ffprobe and runs the
   full suite (expect `529 tests OK (skipped=1)`). Everything else survives; `.venv` and
   `~/.local` do not.
2. Watch the samples: `python3 /home/user/.local/bin/serve_with_ranges.py 8710
   /home/user/mozillaedit/test-sample-mp4` → LIVE PREVIEW → `index.html`.
   (A previous instance may still be running from tonight; restart if the panel is gone.)
3. Then pick up the work order below. **User feedback on file:** sample A's beat sync was
   called "good" on first listen (candidate preview only); **sample B has not been
   reviewed** — that review is the cheapest next piece of perceptual evidence we can get.
4. Everything from tonight is committed and pushed on
   `arena/770beeca-mozillaedit` (docs: this file, `MEMORY.md`, `SESSION-MAP.md`).

## Immediate status

- **Suite is green in this sandbox**: `529 tests, OK (skipped=1)` in ~45 s with
  `AIVE_FONTS_ROOT` pointed at the repo's `font/` folder. (Windows checkpoints for
  comparison: 496 PASS/97.501 s before the 10 `multishot-authored` tests landed.)
- Uncommitted working-tree changes: font-root portability (below) **and** the enforced
  1x-clock boundary described under "Clock boundary". No PRs exist; nothing has been
  pushed. Branch `arena/770beeca-mozillaedit` @ `675ac79`.
- New **`test-sample-mp4/`** category (2026-10-14): real-pipeline samples A (8.484 s
  studio candidate preview) and B (35.000 s local-preview, Reflections) plus their job
  evidence and `README.md`. ~105 MB including job intermediates; trim or delete when no
  longer needed (nothing is committed).

## Sandbox environment bootstrap (Linux; original project is Windows)

The `.venv` is **excluded from snapshots** — rebuild it each fresh sandbox:

```bash
# 1. python deps
python3 -m venv /home/user/.venv
/home/user/.venv/bin/pip install -U pip numpy scipy librosa imageio-ffmpeg

# 2. ffmpeg / ffprobe shims (no apt root; static builds via npm registry)
mkdir -p /home/user/.local/bin
ln -sf "$(/home/user/.venv/bin/python -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')" /home/user/.local/bin/ffmpeg
curl -sSL -o /tmp/fp.tgz https://registry.npmjs.org/@ffprobe-installer/linux-x64/-/linux-x64-5.2.0.tgz
mkdir -p /tmp/fpx && tar xzf /tmp/fp.tgz -C /tmp/fpx
cp /tmp/fpx/package/ffprobe /home/user/.local/bin/ffprobe && chmod +x /home/user/.local/bin/ffprobe

# 3. run the suite (fonts + PATH + optional env)
cd /home/user/mozillaedit/setup
PATH=/home/user/.local/bin:$PATH AIVE_FONTS_ROOT=/home/user/mozillaedit/font \
  /home/user/.venv/bin/python -m unittest discover -s tests
```

Notes: `static_ffmpeg` cannot download its binaries here (SSL to raw.githubusercontent);
use the imageio-ffmpeg binary instead. `sudo apt install ffmpeg` is blocked. `pip` needs a
venv (PEP 668). No GPU/QSV — use `libx264`; `h264_qsv` is the user's laptop encoder.

## Portability patch made in this session (2026-10-14, uncommitted)

Problem: every lyric/text path defaulted `fonts_root=r"E:\fonts"`, so on any other machine
8 `test_lyric_design` tests failed with "required bundled OFL font face unavailable".

Fix (behavior-preserving on the user's laptop; default unchanged):
- `setup/aive/lyric_track.py`: added `DEFAULT_FONTS_ROOT = os.environ.get("AIVE_FONTS_ROOT",
  r"E:\fonts") or r"E:\fonts"` (+ `import os`, doc comment). It only relocates the search
  root — discovery still requires a bundled SIL OFL per family, never installs/downloads.
- Wired the default through `discover_licensed_fonts`, `ass_fonts_directory`,
  `build_lyric_ass`, `compile_lyric_design`, `prepare_lyrics`, `apply_verified_lyrics`,
  `run_local_preview`.
- Verified: `tests.test_lyric_design` 13/13 PASS, `tests.test_multishot_authored` 9 PASS,
  `tests.test_multishot_render` 5 PASS, full suite 506 OK.

## Clock boundary (implemented 2026-10-14, supersedes the interrupted attempt)

`aive/encounter_render.py` now owns an explicit clock contract:
`render-clock-model/v1` — `uniform-1x` for `clean`/`authored-footage`,
`retimed-eased` for `restrained-impact`, `retimed-reviewed-map` for
`multishot`/`multishot-authored`. It is persisted in `plan.json` and in the returned
manifest; a supplied plan whose marker contradicts the requested style is rejected before
media IO; the CLI still cannot select a retimed style.

Enforcement points (all fail closed with `LyricValidationError` before touching media,
`ValueError` at the renderer): `lyric_workflow.prepare_lyrics`,
`lyric_workflow.apply_prepared_lyrics`, `encounter_text.apply_verified_lyrics`. Missing
markers are tolerated only for known 1x styles (historical renders). `effective_style()`
falls back to `config.style` so old/hand-built manifests still resolve correctly.
Regression coverage: `tests/test_lyric_clock_boundary.py` (6 tests) plus the updated
`test_render_media_identity` persistence assertion. The milestone proof
`aside1/generic-system-20261012/multishot-authored-v0001/run_combined_proof_local.py`
(repo-relative port of `run_combined_proof.py`) runs here and asserts retimed markers,
identical game/music PCM, identical frame/sample clocks, changed video and a full decode;
latest evidence `proof-summary-local-v0002.json`.

**Still absent:** any real mapped-clock lyric/closure workflow or a combined front door —
that is future work, not a silent gap.

## Where the code lives and what's inside

- Engine: `setup/aive/` — `encounter_render.py` (renderer + `validate_plan`, styles:
  `clean`, `restrained-impact`, `multishot`, `authored-footage`, `multishot-authored`,
  `slowed-pacing`),
  `authored_footage.py`, `multishot_map.py`, `local_authored_planner.py`,
  `slowed_pacing.py` (candidate slowed-song pacing, `candidate-pacing-map/v1`),
  `local_preview_runner.py`, `lyric_*.py`, `music_lyrics.py`, `attack_qa.py`,
  `accent_audit.py`, `closure_qa.py`, `calibration_report.py`, `gameplay_gate.py`,
  `povkills.py`, `firing_map.py`, `hit_map.py`, `media_identity.py`,
  `supported_pipeline.py` (front-door policy), `daily_runner.py`, `automation_runner.py`.
- CLI: `setup/edit.py`. Front door `studio` (candidate preview screened / reviewed authored
  jobs), diagnostics `local-preview` (plus `--pacing slowed-song [--slow-floor 0.55]` for candidate
  pacing), `render-encounters --style authored-footage <plan>`,
  `auto-preview`, evidence commands `music-lyrics`, `lyric-review`, `lyric-prepare`,
  `calibration-report`, `lyric-check`; legacy `run`/`plan --render`/`montage --render` are
  policy-blocked.
- Docs: `setup/AGENTS.md` (policy), `ATTACK-CALIBRATION.md`, `LYRIC-REVIEW.md`,
  `MULTISHOT-MAP.md`, `CLOSURE-QA.md`, `MUSIC-LYRICS.md`, `README.md`.

## Latest increment (2026-10-14): candidate slowed-song pacing

Built because the user rejected sample B's pace ("did good at the 10s clip but not in the longer
one … we should have slowed down the pace of gunshots with the sound bcs reflection was a slowed
song"), and chose *gap slow-mo* with *auto beat-matched strength* over a fixed factor:

```
python setup/edit.py local-preview --music "<slowed song>.mp3" --source "<raw>.mp4" `
  --profile aside1/selection-calibration-20261012-153257/reyna-expanded-profile.json `
  --music-start 8 --duration 35 --encoder libx264 --pacing slowed-song --slow-floor 0.55
```

- Each row is split into measured burst clusters (rapid-fire runs <= 0.18 s apart). A cluster is
  **rigid 1x**; the gaps between clusters stretch with the C2 quintic ease so the next cluster head -
  or the row's cut, which is where the next cut begins - lands on a **measured acoustic attack**.
  Per-gap strength is bounded by the analytic playback floor (>= 0.5 = the encoder's `atempo` limit)
  and a per-row budget. Rows that cannot reach an attack render **rigid** or **partial** and say so.
- Verified on real renders: claims re-measured against the detected grid at **0.000000 s**; protected
  bursts are source PCM at 1x (best alignment 0.00 samples; residual is the 44.1->48 kHz resample,
  ~ -55 dB); per-row audio length equals the paced row duration. Reflections v2 = 36.468 s (5/4/2
  rows, 11 gaps, 3 cuts on attacks); mary on a cross v2 = 37.436 s (7/3/1, 18 gaps, 5 cuts).
- Evidence: `test-sample-mp4/local-preview-slowed-v2-reflections/job-v0001/`,
  `test-sample-mp4/local-preview-slowed-v2/job-v0004/` (`pacing-report.json`,
  `timeline-1x-candidate.json`, manifest, stems); samples `test-sample-mp4/sample-B2-*.mp4`.
- Tests: `setup/tests/test_slowed_pacing.py` (17 contracts); full suite **529 OK**.
- Not done: the user has not listened yet; anchors stay unreviewed; the lyric/closure paths are
  1x-only, so this mode refuses lyrics.

## Reference tutorials the user supplied (`val tutorial/` on main)

Read 2026-10-14; durable notes in `aside1/val-tutorial-20261014/NOTES.md` (with `frames/`
editor-UI screenshots and `measurements/`). Headline: the reference montage cuts every ~1.9 s
with mean cut-to-attack offset 0.040 s, while our previews cut every 3.3-6.6 s at comparable
accuracy (0.045 s) — i.e. the remaining "pace" gap is **cadence**, plus the reference's
Time Remap speed ramps (slow on the action, up to ~2.4x through travel) which our stretch-only
map cannot express yet. Spoken audio is NOT transcribed (pinned model's `model.bin` is absent
and HF is blocked; no subtitle streams) — never guess it. Proposals, not built: cadence preset
(more/shorter clips), bounded speed-up slices, action-moment slow-mo.

## Next work order (unchanged from session 2; pick up at the top)

1. **`multishot-authored-v0001` is now at its documented stopping point** — proof ported
   and run, clock boundary enforced with regressions (`WORK-SCOPE.md`, `CALIBRATION-BLOCKERS.md`).
   The next legitimate step is a *combined front-door provenance/QA/mapped-clock* workflow,
   which needs real reviewed maps from the user; until then keep it API-only. No real
   reviewed maps exist — synthetic fixtures only; label them as such.
2. **Lyrics** — no human listening available here. What *can* be done: extend
   `lyric-review` tooling, keep PENDING, never auto-convert; run `local-preview --lyrics
   candidates` only to produce honest UNVERIFIED evidence. Real sung verification is a
   user-side step.
3. **Calibration** — `CALIBRATION-BLOCKERS.md` lists required evidence (disjoint ranges,
   content-hash-bound labels). Code can only add audit plumbing until the user supplies
   annotations.
4. **Closure/phrase + visual polish, benchmarks** — after 1–3.
5. **Every finish: update `MEMORY.md`, `SESSION-MAP.md`, this file, and the test logs.**

## Things that must never happen

No standalone trim+song export; no rebuild/reset of the local repo; no invented events,
labels or review metadata; no threshold loosening to force PASS; no silent fallback;
no promoting candidate/UNVERIFIED data to verified; no claims of perceptual approval or
synchronised final. Preserve originals and historical outputs. Keep the user's Windows
paths working (`E:\...` defaults must stay valid there).
