# Standalone reviewed gameplay gate

Implemented 2026-10-12 in E:\ai-video-editor. Only two new project files were written:
- aive/gameplay_gate.py
- tests/test_gameplay_gate.py

No existing project files, original media, detector outputs, profiles, templates, or planning/render code were altered. This note is the separately requested continuation output.

## Exact public interface

```python
from aive.gameplay_gate import capture_source_identity, validate_reviewed_gameplay_gate

capture_source_identity(path, *, max_source_bytes=2147483648)
validate_reviewed_gameplay_gate(
    data, *, source_paths,
    max_source_bytes=2147483648,
    max_total_bytes=8589934592,
)
```

`capture_source_identity` returns `{content_sha256, file_identity: {path, size_bytes, mtime_ns}}`. It reads the entire regular source file in <=1 MiB chunks, rejects empty/oversized/missing files and observed changes during hashing. It does not inspect media semantics.

`validate_reviewed_gameplay_gate` returns the exact original `data` object on complete success, otherwise raises `ValueError`. There are no partial approvals, input mutation, cached identity approval, decode/subprocess operations, or automatic classifier. Omitting the required `source_paths` keyword raises normal Python `TypeError`.

`source_paths` must be an independently supplied dictionary of exactly the reviewed source IDs to current local paths. The review's recorded `file_identity.path` is never used for file access. Do not blindly copy it into `source_paths`.

## Strict gameplay-gate/v1 schema

All objects use exact fields, so missing fields and extra contradictory/unrecognized metadata fail closed.

Root:
- schema_version: gameplay-gate/v1
- mode: reviewed
- sources: nonempty list
- windows: nonempty list

Source:
- id: unique nonempty source ID
- duration: finite positive reviewed source duration, <=86400 seconds
- content_sha256: lowercase 64-character SHA256 of the complete file
- file_identity: path (audit string), size_bytes (positive bounded integer), mtime_ns (nonnegative integer)

Window:
- id: unique nonempty window ID
- source: known source ID
- source_start/source_end: finite ordered source seconds, within source duration
- confirmed: exact boolean True
- content_sha256: exactly matches its source's review hash
- provenance: 1..8 objects with reviewer, method='human_audio_visual_review', reference
- music_review, firing_review, pov_review, outcome_review, context_review

Every review requires status='reviewed' and nonempty notes. Additional exact fields:

| Review | Fields and required meaning |
| --- | --- |
| music_review | classification='absent' or 'background_music'; source_start, source_end, audio_reference. Music-only and unknown are rejected. |
| firing_review | origin='local_player', instrument='firearm'; audio_attack_interval, visual_attack_interval (each [start,end]); source_audio_event, source_visual_event; audio_reference, visual_reference. Each event is within its attack interval; both intervals are within the requested window. |
| pov_review | perspective='first_person', actor='local_player', alive=True; source_start, source_end, visual_reference. |
| outcome_review | outcome='kill', actor='local_player', mechanism='firearm'; visual_interval=[start,end], source_visual_event, visual_reference. Evidence is within the requested window and the kill event cannot precede reviewed firing. Notes must record the reviewed firing-to-kill association. |
| context_review | category='live_round'; source_start, source_end, visual_reference; menu=False, ability_only=False, dead=False, warmup=False, post_round=False, unresolved=False. Exact booleans required. |

Music, POV, and context coverage must each include the entire requested window, not just the attack frame. Unknown, death, non-kill, assist, ability kill, teammate/enemy/spectator POV, menu, ability-only, warmup, post-round, unresolved, unreviewed/candidate status, and detector-only provenance are not approvals. Legacy firing-map/v1, povkills/v1 and visual-gate/v1 payloads are not accepted directly. Manual honest review is necessary; there is deliberately no candidate-to-reviewed converter.

Complete synthetic record fixture: `reviewed(path)` in tests/test_gameplay_gate.py. This fixture explicitly says its semantic evidence is synthetic and must never be used as a real-media approval.

## Bounds

- <=8 sources, <=128 windows
- <=30 seconds per window and per coverage review
- <=600 total reviewed seconds, counting overlapping windows again; per-window contribution uses union span of music/POV/context coverage
- <=2 GiB per source and <=8 GiB across sources; caller can lower these limits, never raise them
- <=4096 characters per textual evidence field, <=8 provenance records per window
- Every declared source must be used; all live file sizes and the aggregate byte budget are checked before any source hashing.

## Content identity and limitations

Each approval re-hashes current entire file content. Changed bytes fail even if file length and mtime are preserved. Window hashes must match the source review hash. Identical content may relocate or have changed mtime because audit metadata is not authentication.

Human names, evidence references, status labels, and all semantic assertions remain unauthenticated. A malicious/incorrect reviewer can lie. SHA256 binds those assertions to bytes, not to reviewer identity or actual kill truth. The helper does not prove media duration or timestamp/frame correctness, open referenced evidence files, perform OCR, detect firing/menus/death, or calibrate templates. A human must review the complete requested window and actual firearm-to-POV-kill relationship. This conservative policy rejects uncertain valid gameplay too.

Observed file mutation during hashing is rejected. Windows path stat/handle fstat timestamps are compared within their own API (precision can differ), while device/inode/size are compared across APIs. Source mutation after validation is still possible; consumers must use immutable snapshots/storage or revalidate immediately before consumption. No claim of atomic validation-through-render is made.

The existing firing-map reviewed validator permits unknown outcomes and its SHA256 is decoded-audio identity rather than full audiovisual file identity. Existing event_io detector handoff is looser. This module is standalone, not wired into those components, so existing editing flows are not yet enforcing this gate.

## Focused verification

Executed with the project's `.venv\Scripts\python.exe`, after removing inherited PYTHONHOME and PYTHONPATH, and with PYTHONDONTWRITEBYTECODE=1:

```powershell
Remove-Item Env:PYTHONHOME -ErrorAction SilentlyContinue
Remove-Item Env:PYTHONPATH -ErrorAction SilentlyContinue
$env:PYTHONDONTWRITEBYTECODE='1'
Set-Location E:\ai-video-editor
& .\.venv\Scripts\python.exe -m unittest discover -s tests -p test_gameplay_gate.py -v
```

Final result: **22 tests passed, 2.366 seconds, OK**. Only this new test module ran; no full suite or real media scan/render was run.

Coverage includes every required schema/review field, all exclusions, exact booleans, missing evidence, unknown/non-kill outcomes, non-local/ability evidence, full-window coverage, invalid/reversed/nonfinite/huge timestamps, identity mismatch, unchanged-size/restored-mtime content mutation, no cached identity, relocation, during-hash mutation, aggregate byte and review bounds, pre-hash rejection, mixed-safe/unsafe all-or-nothing behavior, and original-input preservation.
