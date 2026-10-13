---
name: "local-montage-system"
description: "Continue, test, or extend the user's existing local-code Valorant montage system on E:, including lyrics, HUD detection, music sync, authored rendering, and AI handoff."
---

# Existing local montage system

1. Read E:\aside\AI-CONTINUE-HERE.md and E:\ai-video-editor\AGENTS.md before editing. Inspect actual current code and saved manifests, not historical status claims.
2. Preserve originals, historical previews and dirty repository. Patch bounded gaps with regressions. Never replace the system with standalone trim+song/grade export, filler, invented events, paid visual-AI footage selection or fake review metadata.
3. Use E:\ai-video-editor\.venv\Scripts\python.exe. In child PowerShell commands clear inherited PYTHONHOME/PYTHONPATH to avoid runtime mismatch. FFmpeg is internal rendering/decode infrastructure.
4. Use edit.py studio for reviewed/short candidate jobs; edit.py local-preview for explicit30..50s local HUD/audio authored-v2 diagnostics. Inspect --help. Preserve unconfirmed candidates and sample-zero source/music clocks.
5. Generic lyrics: approved existing venv faster-whisper1.2.1/PyAV15.1.0 + pinned local small.en model now set up; do not repeat missing-runtime claims or rebuild. music-lyrics extracts local UNVERIFIED candidates only; lyric-review prepares/audits PENDING exact-song/PCM/candidate-bound corrections, never converts/verifies a track (LYRIC-REVIEW.md). lyric-prepare validates a verified exact-song track and selective design against a saved plan/config. local-preview --lyrics verified connects preflight BEFORE renderer and text BEFORE QA, preserving mixed audio. Requested lyrics must block rather than silently omit. Generated sparse design is opt-in, not proof of creative quality or sung accuracy. Do not reuse words from different slowed audio or gameplay transcripts.
6. Use calibration-report with saved firing/icon/hit/plan/attack data. Read ATTACK-CALIBRATION.md: new renderer source/music hashes check before/after; attack QA binds actual stem and decoded PCM hashes. Old/arbitrary/stale identities or out-of-prefix labels reject. Attack timing matches are descriptive only, never whole-stem precision/recall because searches are assignment-conditioned. Accuracy metrics need real independent source-bound coverage/labels, never copied planned clocks. Persisted JSON/review assertions are not authenticated. Unknown classifications/sync/outcomes remain unknown.
7. Run focused tests then full unittest discover. Decode exact output, verify frames/audio/stems, persisted style/typography/provenance, no repeated ranges. Unit tests and numerical matches are not visual/listening approval.
8. Save new code/results/docs under E: and refresh the single handoff with exact commands, current proof paths, tests, blockers, and next generic milestones. Bundle source/docs/tests without .venv, raw media, model binaries, browser data or credentials when requested.
