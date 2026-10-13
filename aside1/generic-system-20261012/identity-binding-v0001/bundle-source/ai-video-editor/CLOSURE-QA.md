# Reviewed fight and phrase closure

## Scope

`aive.closure_qa` provides the strict `reviewed-closure/v1` sidecar and an all-join engineering audit. The confirmed-event runner accepts it only as an explicit opt-in through `JobConfig.closure_review` / CLI `--closure-review`. It does not change the default run path. It is not wired into candidate-only `auto-preview`, and it cannot authenticate a reviewer or establish perceptual approval.

A closure sidecar can be used only with explicit confirmed event files (`--events`), not an automatic POV profile, and requires phrase-aware planning. The sidecar never creates or confirms an event.

## Runner behavior

Before planning, the runner:

1. Validates the sidecar schema and bounds its size to 16 MiB.
2. Resolves each referenced source to a path inside the supplied clip folder, hashes the complete file with `capture_source_identity`, and verifies the reviewed source duration against FFprobe. Each referenced source is limited to 2 GiB and total reviewed sources to 8 GiB.
3. Hashes the exact selected music file and checks its FFprobe duration against the sidecar.
4. Associates an already-confirmed event only when both its audio and visual times fall inside exactly one reviewed fight interval. Existing conflicting manual bounds fail. Unmatched events are excluded. Events inside `unresolved` or `unknown` fights are excluded. Only `resolved` fights are eligible.
5. Adds the reviewed full-fight interval to those eligible events, and prevents events from distinct reviewed fight IDs from merging.
6. Supplies only phrases with `decision: "phrase_end"` to phrase-aware planning. The plan must end at a reviewed phrase endpoint. `uncertain` and `not_phrase_end` markers are not treated as phrase ends.
7. Audits the plan with actual source/music hashes, then re-hashes those files immediately before rendering. If any required timeline, identity, fight-bound, join-outcome, ending-fight, phrase-end, or closure-gap check is not `pass`, the runner blocks rendering and saves `closure-report.json`.

With a passing engineering gate, the job still reports `perceptual_approval: false`; listening and aesthetic review remain separate. Without `--closure-review`, current runner behavior is unchanged.

## CLI

```powershell
python edit.py job `
  --music "E:\audio\song.mp3" `
  --clips "E:\raw clips val" `
  --events "E:\reviews\confirmed-events.json" `
  --closure-review "E:\reviews\closure.json" `
  --output-root "E:\jobs" `
  --plan-only
```

Omit `--no-phrase-aware` when using a closure sidecar. The event file and sidecar must name the same exact resolved source paths. The sidecar's hashes and durations must bind to current file bytes and media metadata.

## Review sidecar outline

The canonical contract is enforced by `validate_reviewed_closure()` in `aive/closure_qa.py`:

- `sources`: exact source path, full source SHA256, and duration.
- `music`: full selected-song SHA256 and duration.
- `fights`: unique nonoverlapping fight bounds on the source clock plus a separately reviewed outcome (`resolved`, `unresolved`, or `unknown`) with evidence.
- `phrases`: selected-song-clock phrase bounds, an end uncertainty interval no wider than 0.25 seconds, and a decision (`phrase_end`, `not_phrase_end`, or `uncertain`) with evidence.
- Every review record requires `status: "reviewed"`, reviewer, method, and evidence reference/observation.

The schema validates the assertions' structure and file binding, not their truth. Keep real review evidence; never copy synthetic test values into a production sidecar.

## Limitations

- A sidecar may be incomplete. The runner can only enforce the fights and phrase markers it was given. Review every relevant fight and the exact song ending before claiming closure.
- A passing engineering audit does not authenticate the reviewer, verify a kill detector, prove rendered audiovisual sync, or replace listening/aesthetic review.
- Source files are re-hashed immediately before rendering, but the runner does not create atomic immutable snapshots. Use immutable inputs during the run; a file can still change while FFmpeg is reading it.
- Tests use synthetic source/music fixtures. No real gameplay or song was reviewed or rendered as part of this integration.
