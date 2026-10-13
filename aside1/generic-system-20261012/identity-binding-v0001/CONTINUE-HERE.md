# AI continuation: existing local Valorant montage system

Latest continuation: 2026-10-13. Read this FIRST, then E:\ai-video-editor\AGENTS.md.

## User intent and non-negotiables
Build a REUSABLE local-code system for arbitrary selected music/raw Valorant footage, not a one-song Reflections script. User liked current preview ('not bad') but has not certified kills/sync/lyrics. Preserve existing engine and originals. No plain trim+song/global-grade export, rebuild/reset, repeated footage, invented events, fabricated alignment/review, silent fallback, or routine visual-AI footage selection. Local frame/HUD processing is intended. No image search needed.

## Locations
- Code: E:\ai-video-editor (dirty existing repository; never reset).
- Raw: E:\raw clips val; music: E:\audio; licensed fonts: E:\fonts.
- E:\aside8 is browser profile, NOT project source. Do not bundle browser data/credentials.
- Main historical notes: E:\aside\START-HERE.md, PROGRESS.md, system-lock-20261012.
- NEW generic evidence: E:\aside\generic-system-20261012.
- Latest actual gameplay preview: E:\aside\reflections-fresh-20261012\resumed-local-jobs\job-v0002\renders\encounters-v0001\encounters.mp4.34.834s audio,34.833333s video,1280x720/60,2090frames,10clips. v1 preserved in fresh-renders. Both delivered. No lyrics in gameplay previews.

## What was completed in this continuation
1. Traced v1 missing QA field bug. Existing current planner had aliases added after v1; regression now checks real attack QA normalization without promotion.
2. Fixed both late beam pruning and earlier1024-option pre-cap with shared effect-safe partial-state ranking. Defaults remain beam24/maxoptions1024,10..20shots/30..50s/1x. Added genuine early pre-cap regression and resource counters. All known attacks/ranges retained; final authored validator unchanged. Bounded heuristic, not complete search or semantics.
3. Added generic aive/lyric_workflow.py: prepare_lyrics(), apply_prepared_lyrics(), extract_lyric_candidates(), SparseTypographyPolicy. Reuses existing lyric_track/music_lyrics/lyric_design/encounter_text. Exact song SHA/sample-zero excerpt/canvas binding; immutable input/font snapshots; preflight BEFORE video; text BEFORE QA. Supplied verified track required. Generated sparse graphics or explicit design, NEVER all-word captions. Partial words omitted. Candidate and confirmed audio/visual clocks, full attack intervals and authored-v2 windows protected.
4. local-preview supports --lyrics off|verified|candidates, --lyric-track, optional --lyric-design, --local-lyric-model, --lyric-language, --lyric-max-moments1..8, --fonts-root, --calibration-labels. Explicit missing/invalid requested lyrics block before video, no silent lyric-free export. Candidate extraction saves UNVERIFIED and stops for independent sung verification.
5. New lyric-prepare setup CLI for any saved authored plan/config; calibration-report CLI for saved local evidence. Existing studio reviewed and short candidate paths remain intact.
6. Configurable fonts_root in existing text renderer; lyric-track optional max_seconds/timeout bounded sample-zero decoding. Generic long-protection cap4096 (not truncation).
7. New aive/calibration_report.py: read-only bounded coverage/ambiguity summaries, independent source-bound labels needed for accuracy metrics. Integrated before/after QA, plus existing closure audit. It does NOT train classifier or improve music attack detection itself.
8. Updated AGENTS, README, E:\aside reusable skill and checkpoints. Account user skill local-montage-system points here.
9. 2026-10-13 identity-binding increment: aive/media_identity.py bounded full-file content hashing; encounter_render checks actual source/music before/after rendering (8GiB/file,32GiB aggregate,65unique/4096entries,60s shared capture), ordinary changes fail before completed manifest. Multishot hash gate reuses this capture. Actual attack stems hash before/after decode (128MiB/stem) with decoded PCM hash/prefix/clock evidence; initial missing identity leaves acoustic QA usable but labels unbound, post-decode mutation discards measurements. Decoder caps disk bytes while streaming, not only after process exit.
10. Attack calibration now requires matching file-content/v1 identity + checked stem/PCM evidence and covered decoded-prefix output clocks. Legacy/arbitrary/stale/malformed/aliased identities reject. Attack timing matches remain descriptive; no whole-stem precision/recall from assignment-conditioned samples. Persisted report/review/source provenance assertions are NOT authenticated. Read ATTACK-CALIBRATION.md.

## Latest identity-binding evidence
- E:\aside\generic-system-20261012\identity-binding-v0001: full-tests-reviewed.log: FULL483tests PASS91.479s, final reviewed whole-suite result. Earlier full runs481PASS136.540s and482PASS102.122s are pre-final decoder checkpoints. Focused pipeline66PASS10.609s;media identity21PASS0.399s;streaming attack26PASS3.434s. Static review found two resource gaps, both fixed/regressed.
- streaming-recheck/proof-summary.json: unchanged old Reflections v2 artifacts; both actual retained stem identities + decoded PCM identities bound; all10acoustic assignment rows identical to prior. Gameplay5measured/3ambiguous/2unmeasurable,music10unmeasurable; no independent labels/metrics and musical_sync remainsunverified.
- Old v2 renderer manifest has no source content binding. current-source-content-snapshot.json is a CURRENT snapshot only, not retroactive authentication of old source bytes. No newer gameplay video rendered or lyrics added.
- Synthetic short renderer tests verify source/music hashes, before/after mutation rejection, no completed changed-source manifest, exact frames/samples/full decode, originals/historical jobs preserved. Not sung/gameplay/perceptual acceptance.

## Historical generic evidence
- FULL450tests PASS107.128s: generic-system-20261012/full-tests.log. Focused52PASS5.693s: focused-tests.log. Later CLI preparation/calibration smoke0.
- Two arbitrary synthetic35s lyric proofs (start2.0 and5.25, different generated tones),320x180/30,1050frames,3selective graphic words each. Full decode0, audio PCM identical before/after text, originals unchanged. lyric-proofs/proof-summary.json; reproducible run_lyrics_proof.py. Explicit SYNTHETIC WORDS ON TONES, NOT singing, listening or aesthetic approval.
- Real local plan-only smoke with current generic code:34.898s,10clips,cache hits; local-plan-checks/job-v0001 with closure/calibration-plan reports. Not rendered to a newer gameplay video.
- Actual delivered Reflections v2 full decode0,music stem PCM identical to exact8s-start source excerpt.409tests passed at that render checkpoint. Current source is newer450-test generic system.
- v2 attack QA reads all10correct IDs/clocks but no independently measurable music pair: gameplay5measured/3ambiguous/2unmeasurable;music10unmeasurable. Sync unverified, NOT0ms proof.
- Generic saved-v2-calibration-report.json counts2099firing/17HUD/128music candidates, all unconfirmed. No independent labels, metrics empty.

## Real remaining blockers, do not fake completion
[blocked] Actual song lyric extraction: project .venv lacks faster_whisper/torch/ctranslate model runtime and no local model folder established. No install/download performed. Existing music-lyrics adapter requires LOCAL model.bin/config.json/tokenizer.json, uses offline local_files_only. provider-blocker-checks records honest failure. Need user-approved local setup then representative real-song transcription. Do not set alignment_verified:true on ASR output.
[blocked] Real sung-word verification: exact selected slowed song words/onsets/offsets need independent listening/correction before track acceptance; metadata assertion is not authentication. No Reflections verified lyric-track exists. Legacy other-song *_words.json are not accepted verified lineage.
[blocked] Reliable gameplay/POV/outcome detection: current expanded Reyna profile is uncalibrated,17icon candidates10audio associations. Abilities/scoreboard/scene cuts/fight outcome remain unknown. Need held-out positive+negative windows across profiles, never manual selection disguised as auto.
[blocked] Layered-song gunshot/accent sync: current independent attack QA rejects sustained baseline/rise music; thresholds must be calibrated on representative independent annotations, not loosened to force pass.
[blocked] Integrated multishot gap time maps+authored visual composition, complete fight/phrase closure, richer effects and real viewing/listening acceptance remain separate milestones. Existing multishot renderer/style is separate.

## Next work order (generic, no one-song hacks)
1. Obtain permission/local model choice for optional faster-whisper setup; install only into existing project venv, record versions/model/license/resource caps. Run music-lyrics on at least two representative actual songs. Preserve UNVERIFIED candidates; implement/document correction/review handoff, no invented labels.
2. Verify corrected exact-file lyric tracks, run lyric-prepare/local-preview --lyrics verified across songs. Test selective graphic/quiet roles on actual montage, no gameplay occlusion; keep candidate proofs distinct from final delivery.
3. Content identities are now implemented (ATTACK-CALIBRATION.md). Obtain independent representative positive/negative annotations across gameplay profiles and sustained/layered music, then patch detector/attack algorithms with held-out regressions. Do not infer calibration from hash binding or descriptive sampled attack matches.
4. Integrate reviewed multishot maps with authored effects without invalidating audio/visual/lyric clocks, preserve bursts/full fights; expand only after tests+short actual acceptance.
5. Improve phrase/coherent-ending selection and richer authored visuals, then listening/visual acceptance and laptop resources.
6. Update THIS handoff, status docs/test logs and portable bundle whenever finishing.

## Commands (PowerShell, inspect --help first)
Set-Location 'E:\ai-video-editor'
Remove-Item Env:PYTHONHOME -ErrorAction SilentlyContinue
Remove-Item Env:PYTHONPATH -ErrorAction SilentlyContinue
# Critical: inherited Aside PYTHONHOME otherwise causes SRE mismatch. No machine env edit needed.
& '.\.venv\Scripts\python.exe' -m unittest discover -s tests -v
& '.\.venv\Scripts\python.exe' edit.py local-preview --help
& '.\.venv\Scripts\python.exe' edit.py music-lyrics --help
& '.\.venv\Scripts\python.exe' edit.py lyric-prepare --help
& '.\.venv\Scripts\python.exe' edit.py calibration-report --help
# Generic render, substitute real reviewed track, optional explicit design:
& '.\.venv\Scripts\python.exe' edit.py local-preview --music '<selected-song>' --source '<raw>' --profile '<local-profile.json>' --output-root '<new-versioned-root>' --music-start <start> --duration 35 --lyrics verified --lyric-track '<verified-track.json>' --fonts-root 'E:\fonts'
# Run a new version, never overwrite; off is explicit user choice, not fallback.

## Calibration labels
Read aive/calibration_report.py docstring/test examples. labels={'sets':[{kind,source,source_identity,method,label_origin,coverage:[[a,b]],complete:true|false,events:[{time}]}]}. Kinds firing/icons/music/game_attack/music_attack. Independent origins only. Complete covered negatives are required for PR; partial labels give descriptive matches only. Music identity is song SHA; attack labels require explicit stem identities not yet supplied. Never label copied expected/planned clocks as independent.

## Portable bundle
Newest portable snapshot: E:\aside\generic-system-20261012\identity-binding-v0001\AI-CONTINUATION-BUNDLE.zip (inspect BUNDLE-HASH-MANIFEST.json). Previous E:\aside\generic-system-20261012\AI-CONTINUATION-BUNDLE.zip is preserved as the450-test historical snapshot and contains prior source/tests/docs/fixtures and proof summaries, without raw media,.venv,model binaries,browser profiles or credentials. HASH-MANIFEST.json records snapshot hashes. Paths in source/docs reflect this laptop; another machine must supply media/dependencies and adjust config, not replace engine.
