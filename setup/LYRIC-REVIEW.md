# Pending exact-song lyric correction handoff

`edit.py lyric-review` extends the existing local music-lyrics workflow. It does
not transcribe, render, finalize or verify a lyric track. Candidate output remains
UNVERIFIED, review remains PENDING, alignment_verified stays false.

## Prepare and audit

Inspect `edit.py lyric-review --help`. Pass the exact selected music and saved
`music-lyric-candidates/v1`. The command rehashes the music before/after a bounded
sample-zero mono16k PCM decode and compares the complete candidate source/decode
identity, including PCM hash, count/rate, prefix cap and possible truncation.
It writes a NEW `music-lyric-review/v1` only, never overwrites originals/reviews.

```powershell
Remove-Item Env:PYTHONHOME,Env:PYTHONPATH -ErrorAction SilentlyContinue
& '.\.venv\Scripts\python.exe' edit.py lyric-review --music '<selected-music>' --candidates '<saved-candidates.json>' --out '<new-pending-review.json>'
# After an independent reviewer supplies corrections in a new copy:
& '.\.venv\Scripts\python.exe' edit.py lyric-review --music '<same-selected-music>' --candidates '<same-candidates.json>' --review '<edited-review.json>' --out '<new-audit.json>'
```

Default prefix cap600s must match candidate extraction; use --prefix-seconds only
for candidates generated with a different bounded prefix. No seeking or excerpt
rebasing. Coverage is seconds on the selected music first-decoded-sample clock.
Candidate canonical JSON SHA256 binds original words, indices and evidence.

## Explicit independent work

The pending document has unset reviewer/method, empty coverage, all dispositions
pending and no corrections/additions. Listen against the exact selected music,
not gameplay and not a different slowed/original version. Supply:

- reviewer identity, independent listening/correction method, real limitations;
- explicit sorted nonoverlapping coverage within the decoded prefix;
- each original candidate disposition: pending, corrected or rejected;
- corrected text/start/end for corrected entries, preserving original/index;
- additions for actually heard words missed by ASR, never invented filler.

Both a dispositioned original and its retained correction must be inside reviewed
coverage. Resolve unsafe text, overlaps, silence/instrumental hallucinations,
sustained notes and simultaneous vocals explicitly. Rejected/pending entries have
no correction. No clamping, automatic sorting of submitted tracks or status flip.

The read-only audit returns issues/pending reasons/counts. Missing metadata,
coverage or pending dispositions keeps PENDING. Internally consistent fully supplied
edits can be `structurally_ready_for_independent_track` only, not accepted lyrics.
It never returns a lyric-track or authenticated word list. Caller review assertions
are not authenticated by schema checks.

Only after independent listening/correction should a separate `lyric-track/v1`
be explicitly authored with exact-song identity, actual corrections and truthful
review provenance. Existing lyric-track/lyric-prepare gates still apply. The pending
handoff/candidate schemas cannot be loaded as verified tracks even if a forged
alignment flag is inserted. This work does not silently activate lyrics.

## Local setup and actual evidence

User-approved faster-whisper1.2.1 + PyAV15.1.0 and pinned small.en local model
operate CPU/int8,2threads,1worker,offline inference. Unconstrained PyAV19 was
incompatible; dependency pin and optional-runtime smoke cover that gap.
`E:/aside/generic-system-20261012/local-lyrics-v0001` contains setup/model hashes,
exact wheel/package versions/licenses, logs and actual candidates/reviews.
Model/venv binaries are not in portable source bundles. Successful extraction
and passing tests are not proof of sung accuracy or aesthetic acceptance.
