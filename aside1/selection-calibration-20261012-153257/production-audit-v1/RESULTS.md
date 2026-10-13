# Production selection audit

## Result

The expanded experimental profile remains uncalibrated. The production full-source scan generated **24 visual observations, 0 confirmed kills**. Against ten selected preview shot/outcome references, it matched four of five template-derived examples and zero of five true held-out references in the declared [-0.04,+0.50] second visual window. This is not exhaustive precision/recall, and some preview shot times do not identify a new icon onset.

Do not enable automatic selection or lower thresholds merely to recover the missed references.

## Why the older result is not authoritative

- `validate_labels.py` reduced all templates to the maximum raw score and applied one threshold; production selects by each template's threshold margin.
- Three nominal held-out windows supplied expanded templates and must be classified as template-derived.
- Window-only detection starts unarmed independently in every window, unlike full-source temporal history.
- The older `measure_fast.py` applied Sobel across the time dimension, while production correctly analyzes each spatial frame separately. Its scores are not production results.

## Evidence from missed-event sheets

Sheets are row-major, sampled every 0.2s beginning at the reference shot time minus 0.8s. Full frames reveal source-authored zoom/warp movement that shifts the emblem away from the fixed centered ROI. Some references contain an emblem already visible from a previous kill, and late scoped shots show no newly appearing center emblem in the sampled outcome.

Specific production detections also precede some preview reference shots (for example, visual match at 467.47 versus preview audio reference at 467.641), so absence in a narrow window cannot alone prove a detector miss. The labels need independent exact first-emblem timing and association to the actual preceding firing attack.

## Next bounded work

1. Make an immutable label set with exact first-emblem times, firing times, true negatives, and template-training provenance.
2. Identify HUD layout/transform validity before matching; do not confirm from a centered crop when the HUD is moved or source-edited.
3. Add a separate POV/feed or other kill-indicator signal for unsupported layouts, retaining uncertainty if identity is not established.
4. Evaluate held-out events and hard negatives using the production path, including timing/association error. Keep full-source precision/recall unknown until exhaustive labels exist.

## Files

- `RESULTS.json`: scope, counts, references and matched observations.
- `observations.json`: all production candidate records.
- `audio-candidates.json`: local transient candidates, not kill labels.
- `preview-*-sheet.jpg`: missed-reference inspection evidence.
- `cache/`: versioned production detector cache.

Original media and profiles were not modified. No hosted model or AI API was used by the detector.
