# Rejection audit: the output failed the intended brief

User rejected both 23.53s previews: neither looks like an edited montage and gunshots do not match music. This overrides numerical acceptance claims. These outputs are rejected timing/context baselines, not approved edits.

## What I evaluated incorrectly

The previous checks verified that output waveforms and selected source frames preserved planned clocks. They did not prove that source labels identified the right firing attack, that musical targets were perceptually strong rhythmic hits, or that the sequence looked authored. “0 ms” was the best source-to-output waveform correlation offset, not independent gunshot-to-musical-accent evidence. A one-frame visual match likewise only verifies source clock preservation.

## Specific defects found

### Music selection

Fresh PCM audit reproduced cached onset strengths, so this is not a cache mismatch. Generic full-mix spectral changes are not necessarily percussive accents. The chosen time18.2102 was locally mediocre and target34.1507 weak/incoherent; stronger nearby regions exist. Strong candidates27.2022/37.5234 were approximately20–30ms later than independently measured attack clusters. Some targets are strong harmonic/mixed changes, with uncertain drum identity. Do not categorically claim every target had no transient, or blind-subtract46ms from all music times.

Independent periodicity across25–40s favors roughly93/186BPM-family recurrence rather than cached129.2BPM. This is heuristic, not certified meter; it undermines trusting the old beat grid as ground truth.

See `music-audit/REPORT.md`, diagnostic scripts and per-target numerical evidence. No listening approval was established.

### Planner and analysis

- Phrase-fit was the first lexicographic ranking field, so a weak onset could win simply because a convenient cut boundary fit. Corrected to impact score before phrase tie-break.
- `beats.detect` fabricated downbeats using every fourth tracked beat without finding meter/bar phase. Removed those labels and bumped beat cache version. Supplied reviewed downbeats still supported.
- Planner aligns one main event per encounter. Other burst shots are preserved but not individually assigned to accents. No multi-event rhythm-fit cost exists.
- Old manual labels identify selected firing/outcome points, not a complete firing-event map. Fresh full-window multiband audio and dense ammo/muzzle frame review expose multiple nearby attacks in several ranges. Audio peaks remain candidates; a sound attack alone cannot prove POV firing or kill.
- Preserving broad sampled context creates1.39–2.67s lead-ins and1.18–2.53s aftermath with repeated wall search/knife/ability recovery. At the last join, visible active engagement is interrupted.

Changing only ranking/downbeats does not fix the brief: `ranking-comparison.json` shows the new diagnostic plan still chooses generic onset18.2102. It was explicitly not rendered or presented as corrected.

### Missing editing language

Both previews have the same six source windows/order/cuts. Styled adds only1.035 centered zoom and.045 brightness pulses plus mild identical speed bounds. Five naked hard cuts occur at4.550,8.483333,13.033333,16.083333,19.983333s. Final frame23.516667 is still ordinary rifle handling with no composed exit.

References visibly change image-design states: Burn insert at10.833s, distorted return10.917–11.417s, face/gameplay composition11.500–12.917s, then exit to black around28.066667s. Espresso17.125–17.875s has HUD-free viewpoint, typography and curve design;18.000–18.375s has an authored motion/sweep return. Current renderer cannot express such authored transitions/compositions; its plan rejects those fields. Stronger identical zoom pulses would not solve it.

See `visual-audit/VISUAL-AUDIT.md`, exact-cut evidence and scripts. Source-authored glow/smear exists in clean and is not new editor work.

## Corrections implemented here

1. Accent score before phrase convenience, with a regression reversing the old incorrect priority test.
2. No invented downbeats; beat cache invalidated and regression confirms beat tracker cannot certify bar phase.
3. QA now explicitly warns `musical_sync` unverified and records `evidence_scope`. Source/stem correlation cannot clear that warning or certify gunshot labels, musical attack salience or taste.
4. Added standalone `aive/accent_audit.py` with PCM/file APIs, multiband acoustic attack/range, local salience, HPSS percussive heuristic, cluster ambiguity and explicit rejection reasons. File decoding starts from samplezero with input-duration bounds and sample-index trim. It is not integrated into planning. It conservatively rejects all six real targets, including known stronger attacks, due to harmonic/overlapping-cluster uncertainty. This exposes false-rejection behavior requiring calibration, not evidence there are no musical hits. Generic onsets are not automatically promoted as verified hits.

Full final regression results are saved in `tests-verified-final.txt`; initial module integration passed146tests. Standalone real target results are in `standalone-accent-audit.json`. Passing tests prove constraints, not user aesthetic acceptance. Updated rejected-preview-quality.json keeps musical_sync explicitly unverified alongside render-clock evidence. Firing-origin-zero audio audit is in firing-audit-origin-zero.json; its transients remain candidates, not a full POV firing map.

## Rebuild requirements before another deliverable

- Work on8–12s, not another long six-window concatenation.
- Choose a coherent song phrase with actual strong attacks and explicit attack uncertainty/ranges, without relying on the old129BPM grid.
- Independently review POV ammo/muzzle burst timing; either match multiple shots to accents with a feasible bounded audio/video map or choose a clean isolated-shot sequence. Keep uncertain points unconfirmed.
- Specify shot roles: build/setup, impact, contrasting composition/bridge, final payoff. Shape necessary setup and outcome individually; avoid unresolved engagements and arbitrary idle tails.
- Author at least one outgoing/incoming directional framing/smear bridge and a distinct footage-only composition. No fake unseen third-person angle or unsupported cinematic asset claim.
- Keep selected shot transients crisp and independently measure music-versus-game attacks in final mix, not copied timing fields.
- Compose ending from resolved payoff with deliberate hold/exit/fade.
- If lyric words are unverified, do not invent them. An original non-lyric graphic cue is allowed but cannot masquerade as exact lyric alignment.
- Compare against a reference passage with sound muted: new authorship must be visibly unmistakable. Then actual listening is still necessary; current tools have not supplied perceptual audio.

Do not call the rejected previews synced, polished, final or premium. Do not ask the user to choose between rejected controls. The next output is blocked as a corrected final until independent attack maps and a richer authored visual sequence exist; original media/proofs remain untouched.
