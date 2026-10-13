# Multi-shot map foundation

## Scope and status

`aive/multishot_map.py` is a pure-stdlib, reviewed-input **feasibility planning helper**. Renderer integration remains **unimplemented**. It does not change the rhythm planner, renderer, event detectors, or existing modules. It neither analyzes media nor certifies gunshots, kills, detector identities, musical perception, waveform preservation, or rendered sync.

Only the new module, `tests/test_multishot_map.py`, and this document belong to this change. Existing worktree modifications are unrelated and left untouched.

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

The detached JSON-safe `multishot-map/v1` manifest records explicit origins/endpoints, all anchor pairings, merged protected intervals, piecewise translation parameters, analytic playback bounds, and `planning_only: true` / `renderer_integration: "unimplemented"`.

**Still unimplemented:** binding source/media identities and independent review provenance; exposing this plan through the rhythm planner; renderer time-map expressions or inverse mapping; frame/sample quantization; pitch-preserving gap audio retiming; protected PCM bypass; decoded/rendered synchronization and waveform QA; music-origin/timeline composition; renderer manifests and command wiring.

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

Verification result: **18 focused tests passed** using `E:\ai-video-editor\.venv\Scripts\python.exe` with inherited Python variables cleared and bytecode writing disabled.

Coverage: feasible and infeasible bursts; average-feasible/quintic-infeasible gaps; every exact protected anchor; binary and decimal absolute clocks; dense strict monotonicity; analytic and numerical speed bounds; tightened and near-limit bounds; C2 joins; compatible and incompatible overlap/touch; fixed endpoints; reversed/repeated/zero inputs; fail-closed review and explicit field checks; bounded generator consumption; unrepresentable anchor rejection rather than point snapping; detached JSON serialization. No renderer or broad project test suite is executed.
