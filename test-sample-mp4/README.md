# test-sample-mp4 — real pipeline samples (new category)

Rendered 2026-10-14 in the Linux sandbox from the real code in `../setup/`, using the
user's own repo media. **These are candidate/diagnostic previews, not finished montages.**
No listening or visual approval happened here; `musical_sync` is explicitly unverified.

## Files

| file | what it is | source | song (excerpt) | output |
| --- | --- | --- | --- | --- |
| `sample-A-10s-studio-candidate-preview.mp4` | `studio --candidate-preview` (automatic candidate automation, screened) | `raw/…iufseng8xEs_Ranked-but-I-m-Overheating-Non-Stop…mp4` | The Winner Takes It All — 42.0→50.48 s | 8.484 s, 509 frames, 1280×720/60, 3.9 MB |
| `sample-B-35s-local-preview-reflections.mp4` | `local-preview` 35 s local HUD/audio diagnostic (authored-footage style) | `raw/…z0ALKJiFRDU_Warden-is-Simply-Overpowered…mp4` | Reflections (slowed) — 8.0→43.0 s | 35.000 s, 2100 frames, 1280×720/60, 14.1 MB |

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

## Blocked attempts (kept as honest evidence)

- `local-preview-30s/` — same song as A, source Overheating, 40→70 s: **blocked**,
  "Insufficient bounded local icon/audio windows fit the requested song" (13 icon records).
- `local-preview-30s-w/` — Warden source, 40→70 s: **blocked** for the same reason despite
  28 icon records; the planner refuses to fill with filler or invented labels.

## Review status (user, 2026-10-14)

- **Sample A: beat sync reported "good"** on first listen. User-reported impression of a
  *candidate* preview. It does not certify kills, semantics or a finished montage, and no
  independent label set exists for it.
- **Sample B: not reviewed yet** (user stopped at ~2 am) — keep it for tomorrow.

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
