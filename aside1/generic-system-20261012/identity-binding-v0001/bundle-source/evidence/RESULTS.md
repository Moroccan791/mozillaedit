# Existing-system continuation results, 2026-10-13

## Completed increment

- Added bounded actual source/music full-file SHA256 capture before/after existing
  encounter rendering, with changed-input rejection before completed manifest.
- Added actual retained stem and sample-zero decoded PCM hash evidence to attack QA.
- Attack calibration rejects arbitrary/legacy/stale/unbound identities, wrong stem
  aliases and coverage beyond decoded prefix. Independent reviewed labels still
  required; caller assertions/persisted JSON are not authenticated.
- Assignment-conditioned attack timing matches are descriptive only, not whole-stem
  precision/recall. Existing non-attack complete/unambiguous PR behavior retained.
- Fixed streaming decode disk cap and duplicate-input iterator resource gaps found
  in independent static review. No detector threshold or planner/render-style change.

## Verification

- FULL **483 tests PASS in 91.479s**: `full-tests-reviewed.log`.
- Focused existing pipeline 66 PASS/10.609s: `focused-tests.log`.
- Media identity 21 PASS/0.399s: `media-identity-tests.log`.
- Streaming attack/identity 26 PASS/3.434s: `streaming-decode-tests.log`.
- Earlier full481 and482 passes preserved as intermediate checkpoints.
- `streaming-recheck/proof-summary.json`: all 10 saved-v2 acoustic assignment rows
  exactly identical to prior report. Actual game/music stems and decoded PCM bound.
  Saved video, stems, plan and render manifest byte identities unchanged.
- Saved gameplay attacks: 5 measured, 3 ambiguous, 2 unmeasurable. Saved music
  attacks: all10 unmeasurable. No independent labels, no metrics, sync unverified.
- Old v2 manifest has no render-time source hash binding. Current source content
  snapshot is NOT retroactive proof that old v2 used those same source bytes.
- Real synthetic short renderer regressions cover persisted source/music hashes,
  mutation rejection, exact frames/samples/full decode and originals/historical
  artifacts unchanged. No semantic, sung, listening or aesthetic approval.
- Existing calibration CLI smoke accepted new saved evidence: `cli-calibration.log`
  and `cli-calibration-report.json`, zero metrics and musical_sync unverified.

## Preservation and remaining work

Existing dirty repository preserved; no reset, overwrite of historical previews,
raw-media edits, installs/model downloads, cloud calls or newer gameplay rendering.
The four main milestones remain: optional approved local lyric setup + real sung
verification; calibrated gameplay/POV/outcome detection; independently calibrated
layered-song gunshot/accent sync; integrated multishot+authored composition and
fight/phrase/perceptual acceptance. This increment supports calibration, it does
not solve those milestones.

Read `E:/aside/AI-CONTINUE-HERE.md` and `E:/ai-video-editor/ATTACK-CALIBRATION.md`.
Newest portable source bundle is in this checkpoint. Older generic450-test bundle
is preserved. Bundle excludes .venv/raw media/model binaries/browser profiles and
credentials. Its manifest records source/snapshot and archive SHA256 verification.
