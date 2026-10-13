# Standalone closure QA

Implemented new files only in the project:
- `E:\ai-video-editor\aive\closure_qa.py`
- `E:\ai-video-editor\tests\test_closure_qa.py`

No other modules, CLI, renderer or runner were edited. Existing dirty work was preserved. No media was rendered, new reviewed evidence fabricated, or perceptual approval claimed.

## Interface

```python
from aive.closure_qa import audit_closure, validate_reviewed_closure
report = audit_closure(
    plan,                       # encounters/v1, including candidate-preview
    reviewed_closure=None,      # separate reviewed-closure/v1 sidecar
    source_sha256=None,         # exact plan source string -> FULL FILE SHA256
    song_sha256=None,           # independently computed full song file SHA256
    max_closure_gap=1.5,         # nonnegative seconds, hard maximum 5
    tolerance=1e-6,             # arithmetic tolerance, hard maximum .001s
)
```

Returns detached JSON-safe `closure-qa/v1` report with `status=pass|warn|fail`, boolean `engineering_gate`, `perceptual_approval=False`, `perceptual_status=not_assessed`, named checks/evidence, explicit clocks, actual/requested/unfilled duration and limitations. Malformed input contracts raise `ValueError`; structurally valid unsafe plans return fail. Missing or uncertain evidence returns warn. Failure takes precedence over warning. No input mutation, file read/write, decoding, NumPy dependency or beat generation. `validate_reviewed_closure` returns a deep detached validated sidecar, not proof of human assertions.

## Clock semantics

All seconds are finite nonnegative JSON numbers, not numeric strings/bools, bounded to 86400. Source means absolute decoded source sample-zero seconds; music means absolute decoded track sample-zero seconds; output means zero-origin seconds. Only speed 1 is supported. For row entry `(source_start, output_start)`:
- `output_event = output_start + source_event - source_start`
- `music_time = plan.music_start + output_time`
- source/output/music row lengths are equal; output and music joins must be contiguous.

Root music end must match actual duration. Last output end must equal actual duration. Requested duration is a ceiling; a shorter sequence passes when otherwise evidenced, with explicit unfilled duration. No lead/tail insertion, source range reuse/overlap or retiming. Supplied event output/offset and anchor clocks are checked. No grid interpolation, metadata downbeat inference or invented filler.

## Strict reviewed sidecar schema

Every object below rejects missing and unknown fields. IDs/source strings nonempty text <=4096 characters; hashes lowercase 64-digit full file SHA256. Maximum 512 sources/fights/phrases and plan rows, JSON nesting <=24. Lists/objects bounded; NaN, infinity, tuples, path objects, cycles and other non-JSON values rejected.

```json
{
  "schema_version": "reviewed-closure/v1",
  "sources": [
    {"source": "EXACT_PLAN_SOURCE", "duration": 30.0, "source_file_sha256": "FULL_SOURCE_FILE_SHA256"}
  ],
  "music": {"song_sha256": "FULL_SONG_FILE_SHA256", "duration": 60.0},
  "fights": [
    {
      "id": "fight-1", "source": "EXACT_PLAN_SOURCE", "source_file_sha256": "FULL_SOURCE_FILE_SHA256",
      "context": {
        "status": "reviewed", "clock": "source_seconds", "start": 10.2, "end": 11.7,
        "reviewer": "human-review-id", "method": "source context playback/frame inspection",
        "evidence": {"reference": "review-session/source-window-reference", "observation": "Explicit observation establishing full fight start/end"}
      },
      "outcome": {
        "status": "reviewed", "clock": "source_seconds", "time": 11.5, "result": "resolved",
        "reviewer": "human-review-id", "method": "outcome inspection",
        "evidence": {"reference": "outcome-reference", "observation": "Explicit observed resolution, not merely a firing/kill label"}
      }
    }
  ],
  "phrases": [
    {
      "id": "phrase-1", "song_sha256": "FULL_SONG_FILE_SHA256", "status": "reviewed", "clock": "music_seconds",
      "start": 20.0, "end": 26.0, "end_interval": [25.98, 26.02], "decision": "phrase_end",
      "reviewer": "music-review-id", "method": "independent track listening/phrase review",
      "evidence": {"reference": "track-review-reference", "observation": "Observed phrase cadence/end, not cached downbeat or novelty peak"}
    }
  ]
}
```

Hash placeholders above are explanatory, not valid hex. Source duration and music duration are positive. Fight IDs unique; source identities match the source table. Context is a nonempty full-fight range inside source duration; outcome time is inside it. Overlapping same-source fight reviews are rejected as ambiguous. Outcome result is exactly `resolved|unresolved|unknown`; a `kill` string is NOT resolution. Separate context and outcome evidence required.

Phrase IDs unique; exact song binding required. Phrase start < end; `start <= end_interval[0] <= end <= end_interval[1] <= music.duration`; uncertainty width <=.25s. Decision is `phrase_end|not_phrase_end|uncertain`. One and only one reviewed phrase must end at actual plan music_end within arithmetic tolerance. Phrase-fit flags, downbeat/section metadata and hit-map candidates do not substitute.

The caller must independently compute full file hashes and supply them, not copy them blindly from the review. Existing firing_map audio_sha256 is sample-zero mono PCM identity, NOT the full source file hash expected here. Validation confirms equality of supplied identities, not file bytes itself, reviewer identity, review independence or evidence truth. Review evidence must be genuinely obtained outside generated planner metadata.

## Gates and findings

- Every numeric output/music join is audited. Each outgoing clip requires its latest intersected fight to have a reviewed resolved outcome: unresolved fails; unknown/missing warns. This conservative v1 cannot certify unreviewed neutral inserts as resolved fights.
- Every positive intersection with supplied full-fight bounds must be fully contained in ONE row. Cutting setup or aftermath, splitting a fight across contiguous rows, or intermediate interruption fails. Fully omitted fights and zero-overlap boundary contact are permitted.
- Existing event `encounter_start/encounter_end` and `context_provenance.kind=manual` are safety constraints even without a sidecar, but are not semantic review. `bounded_event_context` and `unreviewed_candidate_window` are not promoted.
- Latest fight in the final row must be explicitly resolved. Earlier resolved fights do not override a later unresolved engagement. A neutral final clip with no reviewed fight warns.
- Candidate/unreviewed plan warns even with a valid sidecar, so attaching reviews cannot silently promote its mode. Candidate event collections, unreviewed candidate-window provenance and unknown explicit modes/review statuses also warn even if root candidate flags are removed.
- Source/song identity mismatch or duration overrun fails; missing independent binding warns.
- Resolution-to-output-end and resolution-to-reviewed phrase-end uncertainty interval must each be nonnegative and <=max_closure_gap. A phrase may not end before observed resolution, even within its uncertainty. This bounds idle tail without manufacturing content.
- Payoff role, video fade, confirmed firing/kill event, and planner phrase alignment independently establish NONE of these gates.

Inspected encounters.py, rhythm_planner.py, firing_map.py, hit_map.py, existing encounter QA conventions, and E:\aside\START-HERE.md / PROGRESS.md latest automation checkpoint. Findings match the current rejection: source/stem clock fidelity is not musical synchronization; candidate windows have unknown outcomes; generated payoff/fade does not imply fight closure. No claim that screened job-v0004 passes this audit or has genuine reviewed evidence.

## Tests

Focused tests only, after removing inherited `PYTHON*`, `VIRTUAL_ENV*`, `CONDA*` environment entries:

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -match '^(PYTHON|VIRTUAL_ENV|CONDA)' } | ForEach-Object { Remove-Item -LiteralPath "Env:$($_.Name)" }
Set-Location E:\ai-video-editor
& .\.venv\Scripts\python.exe -m unittest discover -s tests -p test_closure_qa.py -v
```

Final focused run after candidate-mode hardening: **18 tests PASS in 0.030s**, exit 0. Prior verbose run: 18 tests PASS in 0.118s. Initial 16 tests passed in .042s; final suite adds outgoing unresolved/unknown join and anchor/boundary regressions. `git diff --check -- aive/closure_qa.py tests/test_closure_qa.py` also exited 0 (new files are untracked, so this is not a full content diff audit). Full project suite intentionally NOT run.

Coverage: engineering-only success/no mutation/JSON serialization, unfilled duration, candidate role/fade false closure, all first/middle/final fight truncations, manual bounds without reviews, split fights, intact omission, latest unresolved fight, every join gap/overlap/music jump, source reuse/retiming/padding, independent phrase and exact actual end, gap uncertainty, independent file binding, source overrun, mapped events/anchors, strict versions/keys/status/evidence/clocks, duplicate IDs, malformed source field, finite numeric/JSON contracts.

## Next integration needed

1. Add an explicit review ingestion/UI workflow producing genuine full-fight/context/outcome reviews and independent exact-song phrase reviews. Do not infer these from current candidate flags, kill labels, onset strengths, roles or fades.
2. Runner/CLI should independently hash each real source/song and call this audit BEFORE authored export/acceptance, retaining report JSON. Fail blocks closure engineering acceptance; warn retains candidate diagnostic status. Do not rewrite plan mode automatically.
3. Planner should consume reviewed full-fight bounds and choose a resolved sequence with real reviewed phrase ending and bounded gap, omitting whole fights rather than trimming or padding. Current modules remain unchanged.
4. Keep closure QA separate from independent gunshot-to-music attack QA, renderer clock QA and perceptual listening/artistic acceptance. Engineering gate does not complete corrected final delivery or unattended readiness.
5. If later supporting source retiming or neutral inserts, introduce explicitly reviewed semantics and a new versioned clock contract; do not loosen v1 silently.
