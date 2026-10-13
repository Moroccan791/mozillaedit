# Multi-shot map foundation

## Scope and status

`aive/multishot_map.py` remains a pure-stdlib, reviewed-input **feasibility planning helper**. It now has an explicit opt-in integration in `aive.encounter_render` for a supplied map on every row. The default renderer path, rhythm planner, event detectors, and `automation_runner` behavior are unchanged. The map does not analyze media, authenticate review provenance, or certify gunshots, kills, detector identities, musical perception, or aesthetic quality.

The candidate renderer checks map clocks against the plan, checks each shot anchor against one confirmed audio/visual event, binds the map to the whole source file's SHA256, uses the same source-to-output map for video and game audio, preserves every protected attack interval at 1x, and leaves the music stem untouched. This is a mechanical rendering integration, not semantic event validation or a final-sync claim.

## Explicit contract

```python
from aive.multishot_map import build_multishot_map, source_to_output

mapping = build_multishot_map(
    [
        dict(source_shot_time=101.0,
             source_audio_attack_interval=[100.9375, 101.0625],
             target_acoustic_hit_time=21.0625),
        dict(source_shot_time=102.0,
             source_audio_attack_interval=[101.9375, 102.0625],
             target_acoustic_hit_time=22.0),
        dict(source_shot_time=103.0,
             source_audio_attack_interval=[102.9375, 103.0625],
             target_acoustic_hit_time=23.03125),
    ],
    source_start=100.0, source_end=104.0,
    target_start=20.0, target_end=24.0,
    reviewed=True,
)
assert source_to_output(mapping, 101.0) == 1.0625
assert source_to_output(mapping, 101.0, output_clock="absolute") == 21.0625
manifest = mapping.manifest()  # JSON safe, including json.dumps(..., allow_nan=False)
```

A planning-only map may omit `source_sha256`. A map passed to the renderer must be built with the lowercase SHA256 of the exact source file. The renderer re-hashes the whole source before allocating a render job and rejects mismatches. `load_multishot_map(manifest)` strictly rebuilds and checks the saved map rather than trusting serialized segment math.

- Input source times, attack endpoints, and target acoustic/music hit times are **absolute seconds** in their respective clocks. Origins and endpoints are mandatory. No origin, hit, or endpoint is inferred.
- `map(t)` and `speed(t)` take **source-local seconds**, matching `impact_motion.py` conventions. `map` returns output-local seconds. Local source zero is `source_start`; local output zero is `target_start`.
- `source_to_output` takes absolute source seconds by default, returning local output seconds. `source_clock="local"` and `output_clock="absolute"` explicitly select alternatives. Absolute output means the supplied target acoustic/music clock, not an independently inferred render timeline.
- Supply 1 through 32 ordered `ShotAnchor` objects or dictionaries. Each shot reference must lie inside its nonzero protected source audio attack interval. Shot references and target hits must both increase strictly. Input order is never silently sorted, reversed, or reused. Interval merging is separate from shot order.
- `reviewed=True` is mandatory caller attestation, not authenticated provenance or promotion of candidate detector output. Supply only explicitly reviewed references; this module does not review them.
- Defaults bound playback to 0.75 through 1.35. Caller may tighten, not widen, those limits; 1x must remain allowed.

## Piecewise C2 mapping and crisp attacks

For a protected source-local interval `[a,b]`, with shot reference `x` and target hit `y`, the map is the rigid translation `f(t)=t+d`, where `d=y-x`. The entire interval keeps 1x playback and its original duration. Every supplied shot anchor is checked exactly against that translation, not snapped independently from the curve. Multiple protected intervals may merge only when their translations are exactly equal. Overlapping **or touching** intervals with different translations are rejected, including tiny representable differences. No epsilon silently changes a reviewed target.

A source gap of length `L` joins translations `d0` and `d1` using:

```text
u = (t-a)/L
S(u) = 10u^3 - 15u^4 + 6u^5
f(t) = t + d0 + (d1-d0) S(u)
```

`S'(0)=S'(1)=S''(0)=S''(1)=0`, so every join has forward slope 1 and second derivative 0. Endpoint translations are explicit: 0 at source-local zero and `output_duration-source_duration` at the final endpoint. A zero-length gap cannot absorb a shift.

Playback is `ds/do = 1/f'(t)`, **not** the forward derivative. Since `S'(u)=30u^2(1-u)^2` has exact range `[0,15/8]`, the derivative extrema are 1 and `1+(15/8)(d1-d0)/L`. The helper certifies their reciprocals analytically, widening outward with a conservative floating-point margin. Dense numerical tests supplement, not replace, this certification. A case whose average speed fits can still fail because its quintic peak does not fit. Values on an uncertain floating-point boundary may conservatively be rejected.

Reject nonfinite/boolean/non-numeric inputs, zero or reversed durations, collapsed normalized clocks, repeated/reversed source or target anchors, incompatible protection overlaps, nonmonotonic output gaps, and any gap exceeding certified speed bounds. A required endpoint or anchor translation that cannot be exactly represented in the normalized float clock is rejected rather than point-overridden. This is feasibility for the specified quintic family, not a claim that no other curve could possibly fit. No implicit force-stretch or fallback map is returned.

## Manifest and future renderer work

The detached JSON-safe `multishot-map/v1` manifest records explicit origins/endpoints, all anchor pairings, merged protected intervals, piecewise translation parameters, analytic playback bounds, `planning_only: true`, and `renderer_integration: "encounter_render-multishot-opt-in"`. It also records optional `source_sha256`; renderer use requires it.

## Opt-in candidate renderer

```python
from aive.encounter_render import RenderConfig, render_encounters
from aive.gameplay_gate import capture_source_identity
from aive.multishot_map import build_multishot_map

source_hash = capture_source_identity(source_path)["content_sha256"]
mapping = build_multishot_map(
    reviewed_shots,
    source_start=source_start, source_end=source_end,
    target_start=music_start, target_end=music_end,
    reviewed=True, source_sha256=source_hash,
)
manifest = render_encounters(
    encounters_plan, music_path, output_root,
    config=RenderConfig(style="multishot"),
    multishot_maps={0: mapping},  # one explicit map per timeline row
)
```

The row source bounds must exactly match the map's source bounds. The map's target bounds must match that row's absolute music bounds, so no music/render clock origin is inferred. Every map anchor must match one confirmed row audio/visual event and target hit. Each map is revalidated from its anchors before use. The renderer saves the map manifests in `plan.json` and `render-manifest.json`.

Frames are selected at the configured CFR; no interpolation is used. Gap audio uses bounded, short `atempo` slices based on absolute source/output sample endpoints. Protected attack intervals bypass `atempo`; when the translation lands on sample boundaries, their decoded PCM is byte-identical. Sample rounding can differ by one sample for non-grid-aligned translations. Music is extracted unchanged from decoded sample zero at `music_start`.

**Still unimplemented:** integration into the rhythm planner or `automation_runner` authored-footage mode; authenticated independent review provenance; proof that supplied anchors are real shots/hits; full rendered semantic/musical QA on actual footage; aesthetic approval. Rendering mechanics are tested on synthetic media only.

Any future renderer must preserve each protected attack at 1x, use absolute sample/frame boundaries rounded once, reject collapsed or out-of-bounds rounded segments, and verify all mapped anchors in decoded output. Mathematical planning tests are not evidence of rendered crispness or perception.

## Focused tests

Run only the new planning tests with the project's venv and clear inherited Python variables:

```powershell
Set-Location E:\ai-video-editor
Get-ChildItem Env:PYTHON* | ForEach-Object { Remove-Item "Env:$($_.Name)" }
$env:VIRTUAL_ENV = $null
$env:PYTHONDONTWRITEBYTECODE = '1'
.\.venv\Scripts\python.exe -m unittest discover -s tests -p test_multishot_map.py -v
```

Verification on the account-6 continuation: **24 multi-shot planning/render tests passed** in 1.556 seconds, including a real FFmpeg synthetic render; **6 existing impact-motion tests passed** in 1.637 seconds. Inherited Python variables were cleared before running the project's venv.

Coverage includes feasibility and analytic bounds; clock/schema validation; detached manifest round-trip; mapped-event binding; source-hash mismatch rejection before job creation; mapped frame graph generation; bounded audio slices; exact protected PCM intervals; unchanged music sample slice; decoded synthetic visual anchors and exact frame/sample counts. These are mechanical synthetic proofs only. No real media labels, detector precision/recall, semantic outcomes, actual-song sync, or aesthetic approval are claimed.
