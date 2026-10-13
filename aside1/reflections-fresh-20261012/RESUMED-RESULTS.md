# Resumed local-only Reflections preview

## Delivered output
- Existing v1 attached, preserved: fresh-renders/encounters-v0001/encounters.mp4 (34.821958s,1280x720/60,2089 frames).
- New v2: resumed-local-jobs/job-v0002/renders/encounters-v0001/encounters.mp4. 34.834s audio/plan,34.833333s video,2090 frames,10 clips,28,404,628 bytes. Candidate/unreviewed, not a finished/sync-approved montage.
- Same fresh j59f0UqxcIs source and Reflections music start8s. Local templates/audio only. No visual-AI/manual footage selection, no new installs, no source modification or fallback.

## Changes and tests
- Existing planner already had event_id/source_time/output_time/music_hit_id/music_time/music_interval aliases, added after v1 saved timeline. Added regression through actual attack QA normalization, PCM deliberately withheld and unconfirmed flags preserved.
- First current-code run blocked (resumed-local-jobs/job-v0001),10 eligible roots/68 hits,three finalists failed _design. Diagnostic beam24/48 and option caps1024/4096/8192 all blocked, no safety bypass.
- Patched later beam-state ranking to prioritize effect-safe partial sequences before 24-state pruning. Same safety thresholds retained. Actual new plan34.834s;three bridges (10,3,3 frames),ending5frames. Added unconfirmed numerical beam regression fixture, no semantic calibration claims.
- Focused17tests PASS;full409tests PASS147.924s (resume-full-tests.log).
- Environment PYTHONHOME pointed at Aside Python rather than project Python312. Cleared PYTHONHOME/PYTHONPATH only in child command environment;used existing .venv, no install.

## Actual verification
- Existing local-preview runner completed96.414s,firing/hit cache all hits, authored-footage/v2 provenance.
- structural/duplicate-ranges/loudness/sparse-visual checks PASS. event_anchors WARN(no confirmed anchors).
- Independent full decode0,no stderr. Music PCM bytes identical to source excerpt, SHA25604b7851a0c127240014378514fc609e2fb9b08a2464c497ba5333e614d4b95db. Saved resumed-local-jobs/job-v0002/independent-integrity.json.
- Attack QA now processes all10 correct IDs/clocks,no issues/no missing-ID warnings. Gameplay5measured,3ambiguous,2unmeasurable;music10unmeasurable. No independently measurable pair/offset;musical_sync=unverified. Do not loosen thresholds to claim success.
- No visual-AI aesthetic/semantic selection/review or listening certification performed. All HUD candidates remain unconfirmed,profile uncalibrated.

## Next gaps
1. Calibrate layered Reflections hit/attack measurements and local HUD classification using independent evidence; do not invent labels.
2. Broader search review found an earlier score-only MAX_BEAM_OPTIONS pre-cap still precedes effect-safe ranking. Current real regression/export succeeds, but dense future searches can still lose safe options there. Patch only with bounded regression coverage and resource checks; do not claim generic planner completeness.
3. Fight/outcome/scene-cut/phrase closure, bursts,multishot retiming, optional verified lyrics,visual/listening acceptance remain separate milestones.
