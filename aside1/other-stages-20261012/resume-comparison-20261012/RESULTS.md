# Recovered Aside 3 continuation and same-timeline comparison

Observed and continued 2026-10-12, Asia/Dhaka.

## Recovered context

The main previous session is account 2 `2026-10-12_spUVC7RWMFYJ5NO6`. The browser profiles named Aside2/Aside3 are not separate codebases. Latest user instructions were to continue the other stages using reviewed labels, leaving unreliable automatic selection unfinished. The prior session implemented phrase-aware planning, bounded motion, lyric validation, independent QA and a versioned local runner, then rendered `jobs/job-v0001` but did not finish the comparison/handoff.

## This continuation

- Recovered the exact previous plan and rendered a clean control without replanning. No source, historical job, preset or earlier proof was overwritten.
- Corrected QA style classification: `clean` identity is not a masking treatment. Actual motion/effect metadata and restrained style remain masking-sensitive.
- Runner now reports `rendered-with-warnings` for either QA or planning warnings, lists issues in CLI and human report, and retains successful warning-bearing exports. Failure remains nonzero; warnings exit zero but remain explicit.
- Exposed `--style clean|restrained-impact` on `render-encounters` for reproducible same-plan comparisons.
- Added regression coverage and updated README. Initial baseline 129 tests passed; final verification is in `../resume-tests-final.txt`.

## Real decoded comparison

Both videos: same six historical manually reviewed events, two sources, Let the World Burn from 16.254 seconds, 23.5276-second planned timeline, 1412 frames at 720p60. Requested 30 seconds was shortened by 6.4724 seconds rather than filled or repeated. Reviewed context bounds are sampled local setup/outcome, not exhaustive match annotation.

Clean control:
`clean-renders/encounters-v0001/encounters.mp4`

- 28 checks PASS, no QA warning/failure.
- All six game-stem, song-stem and final-mix anchor comparisons: 0 ms best offset.
- Visual anchor matches: -1 to +1 frame, correlations above 0.9997.
- -11.89 LUFS, -2.95 dBTP, no numerical clipping.
- QSV render 29.086 seconds; decoded QA 32.812 seconds.

Restrained prior sample:
`E:\aside\other-stages-20261012\jobs\job-v0001\renders\encounters-v0001\encounters.mp4`

- 27 checks PASS, 1 visual warning, 0 failures.
- All six game-stem, song-stem and final-mix anchor comparisons: 0 ms best offset.
- First styled visual anchor: correlation 0.7893, best match +2 frames. Do not dismiss this as proven harmless or claim a full visual sync pass. Other anchors match within one frame.
- -11.78 LUFS, -2.62 dBTP, no numerical clipping.
- Historical runner render 96.890 seconds; fresh decoded QA 44.235 seconds. Different render times are observations, not a controlled laptop performance certification.

`comparison.json`, `clean-quality.json` and `styled-quality.json` are authoritative fresh results. Original previous job-report still says rendered and is preserved as historical output, not rewritten to the new status contract.

## Visual and lyric review

I inspected decoded three-frame neighborhoods around all six visual anchors, all five cuts, opening and ending for both versions. Source fights remain visible in those samples; framing/exposure differs in the styled version. Sparse sheets do not establish smoothness, complete-fight semantics, all-frame flash safety or artistic approval. There is no composed outro/fade; the final gameplay shot ends at the planned boundary. Some source-authored effects remain present in both controls.

Audio was checked numerically, not perceptually listened to. Do not claim crispness or music balance approved. User comparison remains necessary.

Legacy `lyrics_words.json` was checked against the exact Burn audio and remains disabled because it lacks the required `lyric-track/v1` schema and supplied verified identity/provenance. No lyrics were promoted or added. Lyric helper supports separate ASS generation and tested synthetic rendering, not integration into this runner export.

## Five stages, honest current status

1. Automatic POV confirmation: unfinished. Experimental fixed-HUD profile remains uncalibrated; do not lower thresholds or mark it calibrated. Next needs genuine new-emblem/onset labels and independently held-out layout-aware evaluation.
2. Multi-file fight/phrase planning: working tested foundation, including reviewed context and exact-plan rendering; broader varied fight calibration and automatic reliable inputs still missing. Manual context provenance should be enforced at the handoff before treating supplied ranges as audited full fights.
3. Ramps/effects: opt-in bounded C2 implementation and real sample now exist. Around each audio/visual event at least +/-0.18s is protected at 1x; music remains untouched. Actual sample map speed bounds ~0.829–1.260, peak local zoom 1.035 and brightness 0.045. Outside protection, game audio uses <=0.10s atempo slices with absolute sample boundaries. No interpolation, advanced compositing or reference-level cinematic approval.
4. Lyrics: fail-closed validation and selective ASS helper implemented/tested. Exact-song word verification and runner typography integration remain unfinished; off by default.
5. Runner/QA: versioned reviewed-input workflow and bounded independent QA implemented/tested, with actual render timings. Unattended readiness, all-frame quality gates, listening approval and varied whole-laptop time/memory benchmarks remain unfinished. Process RSS measurements exclude FFmpeg children.

Next: review both delivered controls for feel/sound, investigate the first styled visual warning before stronger effects, improve audited fight-label provenance, then return to layout-aware detector calibration. Preserve clean and earlier multi-source timing proofs as baselines.
