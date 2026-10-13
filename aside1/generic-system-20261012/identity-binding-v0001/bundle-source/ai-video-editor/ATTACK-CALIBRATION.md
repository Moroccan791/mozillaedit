# Content-bound attack calibration handoff

This extends the existing renderer/QA/calibration path. It does not change the
planner, attack detector thresholds, semantic classifier, effects or lyric gates.
Read `E:/aside/AI-CONTINUE-HERE.md` first.

## Exact media identity

`aive.media_identity.capture_file_identity` hashes actual file bytes read-only:

```json
{"schema":"file-content/v1","sha256":"<64 lowercase hexadecimal characters>","size_bytes":1234}
```

Paths/timestamps are not part of equality: copied identical bytes keep identity.
Size, mtime_ns and ctime_ns are checked during capture. Missing, empty, directory,
URL and UNC inputs fail closed. Bounds: 1MiB read chunks, 8GiB per input, 32GiB
aggregate, 65 unique inputs, 4096 input entries including duplicates, shared 60s maximum per media capture. No model,
dependency installation, download, media write or semantic review occurs.
A local path on a mapped network drive is not independently detected as remote.

`render_encounters` captures all actual source/music bytes before job creation
and again after rendering, before writing a completed render manifest. Ordinary
changes fail closed; failed job artifacts are retained. Manifest fields:
`media_content_identities` and `media_identity_binding`, status
`checked_before_after`. Multishot source binding reuses these hashes. No source
clock, frame selection, PCM rendering or historical job is changed by this check.
These checks cannot exclude adversarial change-and-restore, and are not semantic
authentication or proof that a planned event is a kill.

## Retained-stem attack evidence

`measure_attack_alignment` independently captures actual game/music stem bytes
before and after its existing bounded sample-zero decode. Per stem identity:
128MiB maximum and the existing <=60s per-stage QA timeout. Decoded PCM disk
bytes are capped while streaming; excessive output cannot consume unbounded
storage before the final size check. It records:

- `source_identities.game` and `.music`: actual retained file-content identities.
- `stem_identity_evidence`: checked-before/after status, identity, output sample-zero
  clock, decoded prefix end, PCM sample rate/format/bytes and decoded PCM SHA256.
- `source_media_provenance`: source identities from a new renderer-bound manifest,
  explicitly **supplied persisted provenance**, not rehashed or authenticated by QA.

If initial identity capture is unavailable, acoustic QA can still report its
existing heuristic measurements, but calibration labels remain unbound. If a
previously captured stem changes or becomes unavailable after decode, its acoustic
measurements are discarded. No musical-sync or semantic promotion occurs.
Old v2 source manifests lack render-time hashes: a current source snapshot must
not be retroactively called its old render binding.

## Independent label handoff

Listen/inspect the exact retained stem identified by SHA256, independently of
planned times and QA output. Annotate audible onsets on its first-decoded-sample
output clock, including positive and negative intervals. Do not copy expected or
measured QA times as independent labels. Caller-supplied origin/method assertions
and persisted report JSON are not authenticated by the pure read-only auditor.

Attack labels require matching complete file-content identity and checked
stem evidence. Use `source=game_stem` / `kind=game_attack`, or `source=music_stem`
/ `kind=music_attack`. `coverage` must lie inside that report's decoded prefix.
Example structure, not real labels:

```json
{"sets":[{"kind":"game_attack","source":"game_stem","source_identity":{"schema":"file-content/v1","sha256":"<actual retained stem hash>","size_bytes":1234},"method":"independent blind listening on sample-zero stem","label_origin":"independent_audio_review","coverage":[[0.2,1.0]],"complete":true,"events":[]}]}
```

Existing `edit.py calibration-report --help` remains the front door. Reports
without hashes, arbitrary identity objects, stale identities, unsupported source
aliases and out-of-decoded-prefix coverage cannot produce attack metrics.
No labels means coverage only, never zero-error evidence.

Attack metrics provide descriptive mutual-unambiguous matches and timing errors
only. **No attack precision/recall** is reported even with complete labels because
attack QA samples assignment-conditioned search windows, not an exhaustive
whole-stem detector. Firing/icon/music candidate PR behavior remains unchanged:
complete covered labels and unambiguous matching are required.

## Remaining real work

Representative independently annotated positive/negative gameplay and layered
music windows, exact sung verification and optional approved local Whisper setup,
multishot+authored composition and perceptual acceptance remain separate milestones.
Hashes and tests do not improve detection or prove listening/aesthetic approval.
