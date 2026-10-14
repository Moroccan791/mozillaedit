# test-sample-mp4 — real pipeline samples (new category)

Rendered 2026-10-14 in the Linux sandbox from the real code in `../setup/`, using the
user's own repo media. **These are candidate/diagnostic previews, not finished montages.**
No listening or visual approval happened here; `musical_sync` is explicitly unverified.

## Files

| file | what it is | source | song (excerpt) | output |
| --- | --- | --- | --- | --- |
| `sample-A-10s-studio-candidate-preview.mp4` | `studio --candidate-preview` (automatic candidate automation, screened) | `raw/…iufseng8xEs_Ranked-but-I-m-Overheating-Non-Stop…mp4` | The Winner Takes It All — 42.0→50.48 s | 8.484 s, 509 frames, 1280×720/60, 3.9 MB |
| `sample-B-35s-local-preview-reflections.mp4` | `local-preview` 35 s local HUD/audio diagnostic (authored-footage style, strict 1×) | `raw/…z0ALKJiFRDU_Warden-is-Simply-Overpowered…mp4` | Reflections (slowed) — 8.0→43.0 s | 35.000 s, 2100 frames, 1280×720/60, 14.1 MB |
| `sample-B2-36s-slowed-pacing-reflections.mp4` | same command **plus `--pacing slowed-song`**: bursts rigid 1×, gaps stretched onto measured attacks | `raw/…z0ALKJiFRDU_Warden-is-Simply-Overpowered…mp4` | Reflections (slowed) — 8.0→43.0 s | 36.468 s, 2188 frames, 14.6 MB |
| `sample-B2-37s-slowed-pacing-mary-on-a-cross.mp4` | same mode, longer slowed song (more pacing room) | `raw/…z0ALKJiFRDU_Warden-is-Simply-Overpowered…mp4` | mary on a cross (bestpart! slowed) — 8.0→43.0 s | 37.436 s, 2246 frames, 15.3 MB |

Full decode (`ffmpeg -f null`) passes on both. Encoder libx264 (sandbox has no QSV).

## Evidence (inside the job folders)

- `job-v0001/` (sample A): `REPORT.md`, `job-report.json`, `quality-report.json`,
  `attack-alignment.json`, `closure-report.json`, `visual-screen.json`, `timeline.json`,
  `supported-pipeline.json`, plus `renders/encounters-v0001/` with the renderer manifest,
  per-clip files and PCM stems.
- `local-preview-35s-w/job-v0001/` (sample B): same style of evidence; elapsed 91.68 s for
  the whole run including analysis and render.

Both runs recorded QA status **warn**, never pass: `musical_sync` (needs independent
firing-attack + strong musical-hit labels) and `event_anchors` (no confirmed anchors).

## Slowed-song pacing (candidate mode, 2026-10-14)

The user's verdict on sample B — “did good at the 10s clip but not in the longer one … we should
have slowed down the pace of gunshots with the sound bcs reflection was a slowed song” — is
addressed by an explicit candidate mode, `--pacing slowed-song` (`setup/aive/slowed_pacing.py`,
`candidate-pacing-map/v1`). **Not** a uniform clip slowdown and **not** a fixed factor: each row is
partitioned into measured burst clusters (rapid-fire runs ≤ `burst_gap` apart). A cluster keeps
**rigid 1× playback** (shot transients are never smeared); the gaps between clusters stretch with the
C2 quintic ease so the following cluster head / the row's cut lands on a **measured acoustic attack** of the song. The stretch per gap is bounded by the analytic playback floor
(`--slow-floor`, ≥ 0.5 = the encoder's `atempo` limit) and by a per-row budget.

| run | 1× cut | rendered | rows | anchors on a measured attack | cuts on one | stretched gaps | playback |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Reflections v2 | 35.000 s | 36.468 s (+4.2 %) | 11 | 5 matched, 4 partial, 2 rigid | 3 | 11 | 0.552→1.0 |
| mary on a cross v2 | 35.000 s | 37.436 s (+7.0 %) | 11 | 7 matched, 3 partial, 1 rigid | 5 | 18 | 0.554→1.0 |

Independent checks run after the renders (not claims copied from the solver):

- Every claimed landing was re-measured against the detected attack grid: **0.000000 s error**; rows
  that could not be matched are reported as *partial* (stretched but no anchor claim) or *rigid* (pure
  1×) instead of being force-fitted.
- Protected bursts are the **source PCM at 1×**: best alignment **0.00 samples** (offset +1 sample is
  30× worse) and the residual is the 44.1→48 kHz resample difference (≈ −55 dB), i.e. no `atempo`, no
  time smear on gunshots.
- Per-row audio (`game-0NN.wav`) length equals the paced row duration exactly, so video and audio are
  retimed by the same certified map.
- Full suite after the change: **529 tests OK** (`AIVE_FONTS_ROOT=<repo>/font python -m unittest
  discover -s tests`), 17 of them new pacing contracts.

Honest limits of this iteration: anchors remain **unreviewed** detections; the grid is measured
acoustic attacks, not certified meter; achievable pace change is bounded by the song's attack spacing,
the 0.5× encoder floor, per-gap capacity and how much song remains (Reflections is 45.37 s long, so a
35 s cut from 8 s can only grow ~2.4 s); the candidate planner will miss `--music-start` values whose
first ~4 s contain no detected attacks (Reflections plans from 8 s, other slowed songs from 0–8 s);
QA stays warn-only. Nothing here is certified as musically correct, and no listening approval has
happened yet.

Reproduce (same command for both, only `--music` changes):

```
python setup/edit.py local-preview --music "<slowed song>.mp3" --source "<raw>.mp4" \
  --profile aside1/selection-calibration-20261012-153257/reyna-expanded-profile.json \
  --output-root test-sample-mp4/<new-dir> --music-start 8 --duration 35 --encoder libx264 \
  --pacing slowed-song --slow-floor 0.55 --fonts-root <repo>/font
```

## Blocked attempts (kept as honest evidence)

- `local-preview-30s/` — same song as A, source Overheating, 40→70 s: **blocked**,
  "Insufficient bounded local icon/audio windows fit the requested song" (13 icon records).
- `local-preview-30s-w/` — Warden source, 40→70 s: **blocked** for the same reason despite
  28 icon records; the planner refuses to fill with filler or invented labels.

## Review status (user, 2026-10-14)

- **Sample A: beat sync reported "good"** on first listen. User-reported impression of a
  *candidate* preview. It does not certify kills, semantics or a finished montage, and no
  independent label set exists for it.
- **Sample B (strict 1×): rejected** — “did good at the 10s clip but not in the longer one … we should
  have slowed down the pace of gunshots with the sound bcs reflection was a slowed song”. Actioned as
  the pacing mode above; the two `sample-B2-*` renders are the result and are **awaiting the user's
  listen**. No perceptual claim is made for them here.

## Notes on this folder

- Regenerable render intermediates (`clip-*.mp4`, PCM stems) were trimmed after packaging;
  the final mixed outputs are the two `sample-*.mp4` files at this folder's root and all
  reports/manifests/timelines are retained. `.gitignore` now excludes
  `test-sample-mp4/**/renders/**/*.mp4|.wav` so future runs stay lean.

## Reproduce

```bash
cd setup
PATH=/home/user/.local/bin:$PATH AIVE_FONTS_ROOT=/home/user/mozillaedit/font \
  /home/user/.venv/bin/python edit.py studio --music <song.mp3> --clips <folder-with-raw> \
  --output-root <out> --candidate-preview --duration 10 --music-start 42 --encoder libx264

PATH=/home/user/.local/bin:$PATH AIVE_FONTS_ROOT=/home/user/mozillaedit/font \
  /home/user/.venv/bin/python edit.py local-preview --music <song.mp3> --source <raw.mp4> \
  --profile ../aside1/selection-calibration-20261012-153257/reyna-expanded-profile.json \
  --output-root <out> --music-start 8 --duration 35 --encoder libx264
```

The profile is the **uncalibrated** experimental Reyna profile; POV icons stay
`confirmed=false`. Nothing here certifies kills, musical sync or taste.
