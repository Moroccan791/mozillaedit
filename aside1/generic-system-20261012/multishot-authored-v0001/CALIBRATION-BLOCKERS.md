# Independent calibration evidence audit, 2026-10-13

Read-only audit of prior selection-calibration-20261012-153257 evidence.
No labels added, no profile calibrated, no new accuracy claimed.

## Existing provisional material

validate_labels.py defines11positive/5negative selected windows on one source,
described as frame-reviewed first new POV emblem. These are not exhaustive,
content-hash-bound independent ground truth. Five nominal held positives not
among expanded-template frames:339,414,467,501,516. Five negatives include miss,
ability,menu,health,walk. Preserve as provisional candidates only.

## Leakage and missing evidence

- expand_profile.py creates templates at92.45,104.98,188.3s, inside nominal held
  positives92/104/188. Those windows are not held-out for expanded-template tests.
- negative-walk261.1..261.9 overlaps train-multi261.6..263.8; separate splits
  cannot share that source content.
- Prior results carry source path/profile hash, not original media content hash.
  Current file hash cannot retroactively authenticate what historical reviewer saw.
- Selected labels lack exhaustive coverage/absence, independently documented
  first-emblem and firing times, annotator/review provenance and training lineage.
- Separate production audit preview6..10 reported0/5matches but references are
  shot/outcome evidence, not exact icon-presence/onset labels. Training-time max
  raw score/threshold path differed from production persistence logic.
- Expanded Reyna profile remains explicitly uncalibrated. Similarity is not a
  probability, icon/audio association is not a verified firearm kill/outcome.

## Required next evidence

Fresh independent listening/visual annotation on exact content-hashed media:
source intervals, complete positive and covered-negative labels, first-emblem
onset, related firing attack, POV/ability/scoreboard/fight/outcome semantics,
reviewer/method/limits and template source provenance. Use disjoint source ranges
for train/validation/test and do not promote assertions as authentication.
Layered music needs independently heard salient attack annotations, not planned
accent clocks or thresholds loosened to force passes. No attack PR from sampled
assignment-conditioned QA. Existing content-bound calibration-report can audit
proper labels when supplied, but hashes alone do not create them.

Evidence files: validate_labels.py:8,12..13,22,32,39; expand_profile.py:8;
labeled-results-expanded.json first threshold records; production-audit-v1/
RESULTS.md:10..14,20,24..27 and RESULTS.json:183..248; reyna-expanded-profile.json.
