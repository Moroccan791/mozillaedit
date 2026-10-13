# Valorant cinematic impact montage: reference study v1

Observed 2026-10-12. This is a visual reference study and an automation design brief, not a trained model, implemented engine, or verified render.

## User's intended result

The user considers these references one shared premium editing style, not separate song presets. Desired workflow: choose a song, supply raw Valorant clips, receive a polished montage. The user specifically values smooth gunshot-to-beat synchronization and wants repeatable daily production. Do not substitute a basic highlight compilation with random transitions, uniform cuts, static captions, and a global colour filter.

## Scope and evidence standard

Six exact references were inspected through their original YouTube players. Ocean Eyes, the seventh local reference, is explicitly excluded at the user's request.

| Reference | Video ID | Creator | Actual player duration, approximately |
|---|---|---|---|
| Espresso | Vp5ClXhplkU | Eccentric VFX | 35.94 s |
| APT | FLS6WFuVfJQ | Eccentric VFX | 58.92 s |
| All Night | GqmFRqWM_08 | Frost LIVE | 20.12 s |
| New Jeans | gy6ECL7shxM | 7Tech | 50.50 s |
| Timeless | nkAEXZE76II | Fluxx | 48.10 s |
| Let The World Burn | YJWDatNCoCM | Seili | 30.24 s |

Watch URLs: `https://www.youtube.com/watch?v=<video ID>`.

Method: paused decoded frames spanning each timeline, with closer temporal samples around selected impacts, transitions, typography and composites. Seek completion was checked using actual video time, seeking state and readyState. This is not exhaustive frame-by-frame decoding of every cut. No audio was perceptually supplied or independently verified. Do not claim measured beat synchronization, exact cut counts, exact speed ramps, specific plugins, font identity, original assets, or editorial causation. User's gunshot-to-beat preference is a stated target, not an audio measurement from this study. YouTube captions, end cards, watermark and Valorant HUD/kill emblems must not be mistaken for editor-added graphics.

## Shared style card

### 1. Gameplay remains the spine; effects create exceptional moments

**Observed:** first-person frag sequences remain recognizable across all six references. Stylized or highly blurred moments alternate with more readable gameplay. Examples: APT 10–15/25–30 s; Timeless 5/15/30 s; New Jeans 1–15/23–30/33–43 s; Burn 5/15/20 s.

**Likely purpose:** readable setup makes the amplified impact legible rather than creating constant visual noise.

**Engine implication:** choose an actual encounter and preserve enough lead-in and outcome. Apply an effect envelope near selected events, not an identical overlay for every frame or clip.

### 2. Motion, framing and transition treatment are integrated

**Observed:** shifted or tilted POV, radial/directional smear, warp, curved edge streaks and zoom-like changes. Timeless 19.7–20.3 s shows the same staircase scene changing exposure/contrast, framing and smear around a visible kill moment. Burn 11.0/11.2/11.4/11.5 s shows radial distortion, rapid different shots and heavy transition smear. New Jeans 26.8–27.6 s shows an editor-added REW cue, bulge/perspective distortion, flare and a return to an earlier composition. Espresso 18.8–20.2 s includes zoom-like blur and changing composition. APT 5/45 s includes tilt and directional blur.

**Likely purpose:** transition movement carries momentum between clips instead of looking like an unrelated effect laid over a cut.

**Engine implication:** design time-remapping, reframing, blur and transition as one event. Exact ramp curves remain unmeasured; true reverse playback in New Jeans is not established by sampled frames. Avoid promising a named effect or plugin from visual resemblance.

### 3. Exposure, glow and colour change dynamically

**Observed:** short bright washes and saturated highlights contrast with restrained or desaturated passages. New Jeans 6/16.7/27.4/36 s includes orange-white bloom/flare; side glow at 9–12 s. Timeless 10/20/25 s includes electric blue/yellow edges, warm exposure change and cyan glints. Burn 11–20 s combines desaturated scenes with purple/gold accents. Espresso includes vivid cyan/pink edge accents and bright local impact treatment.

**Likely purpose:** colour and light mark important changes while separating the subject from the background.

**Engine implication:** base grade plus per-event exposure/glow/colour envelopes. Do not apply one exact palette to every song. Brightness must recover so the kill remains visible; avoid long accidental whiteouts or muddy cumulative overlays.

### 4. Typography is designed and selective, not a generic caption stream

**Observed:** All Night 5.0–6.4 s shows large translucent/glowing condensed capital LIKE changing size/opacity before COULD. Espresso 17.2–17.8 s has large turquoise THAT'S / THAT / ME wording at changing positions around a character cinematic. APT ~40 s has Dont in the upper letterbox band above an echo-layered third-person character. Burn ~5 s uses small white serif lyric text at the bottom. New Jeans 26.8–27.1 s uses a small glowing REW cue.

**Likely purpose:** chosen words become graphic events while less important passages remain focused on gameplay.

**Engine implication:** allow multiple text roles: giant word, quiet lyric, graphic cue and branding, with placement/animation templates. Do not force the general subtitle skill's 4%-height default on this montage style. Lyric transcription and vocal alignment must be validated separately; source font identity is unknown.

### 5. Cinematic/composited interludes are an important quality differentiator

**Observed:** Espresso ~17–18 s leaves HUD-bearing first-person gameplay for a HUD-free character sequence with a changing viewpoint. APT ~20 s uses a letterboxed overhead map cinematic; ~40 s uses a third-person character with offset silhouette/echo layers. New Jeans ~16–22 s isolates hands/weapon against dark navy with orange particle/light elements. Burn ~10 s uses an anime insert and ~12 s an anime-face gameplay composite.

**Likely purpose:** contrast in viewpoint and image design makes the edit feel authored instead of automatically concatenated.

**Engine implication:** cinematic footage, replay-camera views, isolated assets and permitted anime/graphic inserts are separate asset requirements. Arbitrary first-person clips cannot reveal an unseen third-person camera angle. A footage-only mode can create crop/blur/colour/particle/typographic treatments but must label missing cinematic capability rather than fabricate it.

### 6. Endings are composed rather than abruptly truncated

**Observed:** Timeless ~40 s uses glowing serif sponsor/contact artwork on black; APT ~55 s a designed yellow lightning-pattern logo outro; New Jeans ~44–50.5 s holds and darkens a final gameplay composition; Burn ~29 s is black. YouTube end cards obscure parts of several endings.

**Likely purpose:** a final hold or identity card gives closure.

**Engine implication:** support final-shot hold/fade and optional permitted brand outro, chosen by the edit rather than forced globally.

## Per-reference timeline landmarks

- **Espresso:** ~1–2 s large creator wordmark; gameplay from ~3 s; 8.8–10.6 s closely sampled sniper/kill sequence; ~17–18 s character cinematic and turquoise words; ~19–20 s blur/reframing passage; ~23.5–24.5 s bright layered transition and large wording; later continued gameplay. Exact boundaries are approximate.
- **APT:** 5 s tilted sniper/bloom; 10–15 s combat/HUD; 20 s overhead letterboxed map view; 25–30 s sniper/knife gameplay; 35–40 s cinematic/echo silhouette and text; 45 s directional smear; 50 s warm pistol shot; 55 s yellow graphic outro.
- **All Night:** 5–6.4 s animated large LIKE then COULD; 10 s warm gameplay/purple perimeter; 15 s warp/doubled environment; 16.4 s orange/magenta combat/ability frame and multi-kill feed. About 20 s total.
- **New Jeans:** 0–1 s fade into gameplay; 1–15 s warm/teal/violet gameplay and bloom; 16.6–17.2 s orange radial burst; 18–22 s isolated knife/particles; 23–30 s gameplay/REW/warp/flare; 33–43 s gameplay with further bloom; 44–50.5 s final held shot and dark fade.
- **Timeless:** 0.5 s white glowing FLUXX logo; 5 s cleaner pistol scene; 10 s electric edge treatment; 15 s cyan weapon; 19.7–20.3 s closely sampled kill treatment; 25 s cyan glints; 30–35 s more gunplay/directional blur; 40 s designed black outro; late frames partly obscured by YouTube cards.
- **Burn:** 5 s serif lyrics/gameplay; 10–10.5 s red/black anime and luminous line/ring graphics; 11–11.5 s rapid gameplay/warp/smear changes; 12 s anime-face composite; 15/20 s muted gameplay with gold weapons; 25 s dark knife/orange accents; 29 s black ending.

## Automation blueprint: proposed, not implemented

1. **Music map:** analyze the actual waveform for transients, beats/downbeats, accents, intensity and phrase boundaries. Do not treat estimated BPM as a reliable fixed grid. Choose the requested excerpt or a clearly identified section.
2. **Gameplay event map:** detect candidate gunshots from audio and confirm visual evidence such as muzzle event, enemy encounter, kill emblem/feed and outcome. Preserve event time and confidence. Distinguish firing, confirmed kill, multi-kill, death, reload and ability; loud peaks alone are insufficient.
3. **Joint event/music assignment:** place the actual shot/kill event on a chosen musical accent. Clip entry time is not the impact time. Rank stronger moments for stronger song accents and preserve multi-kill order, lead-in and aftermath. Penalize repetition, missing context and impossible retiming.
4. **Time map:** define a source-to-output mapping anchored at the event; recover before/after with smooth, bounded ramps. Retiming invalidates source audio/lyric timings unless mapped. Preserve intelligible impact transients rather than stretching them indiscriminately.
5. **Visual sequence:** combine reframing, blur, grade, exposure/glow, optional particles, text and clip transitions in an intentional envelope. Reuse a coherent grammar with variation, not random effect choice. Insert cinematic/composited sections only when suitable permitted assets exist.
6. **Audio mix:** measure actual gunshot/onset-to-music timing after render, not before only. Balance shot accents and music, avoid clipping, inspect sound joins; do not hide bad timing with arbitrary SFX.
7. **Render and QA:** inspect output frames around every event/cut/composite, verify decoded video/audio and time-map correctness, measure post-render event alignment and flag uncertain detections, check stutter/ghosting, obscured kills, text, colour/flash envelopes, end fades, codec and loudness. Candidate QA thresholds are design decisions and must be calibrated, not claimed as reference measurements.
8. **MVP gate:** first prove a short 8–12 s sequence from one chosen song and several confirmed events. Get user approval for sync, feel and readability before attempting one-click full-length automation.

## Important limits and next work

- This study learns a documented visual target; it does not train or install a video model.
- Exact gunshot/beat synchronization still needs local waveform analysis and perceptual audio verification. The user already has FFmpeg; previous terminal calls failed during sandbox setup, so absence of FFmpeg was never demonstrated.
- Local browser file playback was denied. The user declined changing the whole-drive E:\ permission to narrower folders; keep permissions unchanged and do not bypass that denial. All visual evidence here is from the supplied public originals.
- Existing refs_measurements.json is a previous heuristic analysis of only Espresso and Burn, not fresh verification. Its frame-diff spikes can conflate cuts with flashes/warps; use as hypotheses, not ground truth. refs_text.json contains HUD/OCR noise and YouTube caption contamination must be avoided.
- Do not overwrite existing montage.json or slick.json, nor modify original footage.

## Existing bot: inspected code, not runtime-tested

The project is not merely a scene-cut concatenator. It already has an onset-aware path worth retaining, but static inspection exposes specific gaps:

1. `E:/ai-video-editor/aive/shots.py`, lines 1–12 and 47–88: uses a 1 ms amplitude envelope, positive dB rise, percentile threshold, peak detection and burst consolidation. `Shot` stores `t`, `strength` and `peak_db`. These are transient candidates, not visually confirmed kills or calibrated classification confidence. The module's comments equate kill anchors with shot onsets, but implementation does not establish that identity.
2. `aive/planner.py`, `plan_kills`, lines 264–437: accepts manual event timestamps or transient detections, builds beat slots, ranks stronger transients into drop slots and chooses source start relative to an onset offset. Thus it already attempts to align event time rather than only clip start. It uses fixed ramp parameters (`ramp_tail=0.30`, `ramp_k=0.60`) and cycles the overlay pool at clip starts. The assignment `moments[rank % len(moments)]` can reuse candidates despite the docstring saying source time is never repeated. This path takes a single source file and does not itself solve multi-file footage assignment.
3. `aive/graph.py`, lines 109–137: `_ramp_slices` is a length-preserving normal hold, fixed faster middle and fixed slower tail. This is piecewise-constant speed, not a continuously eased graph. Lines 140–151 define a fixed three-frame zoom/blur/brightness envelope peaking at clip start. Therefore entry effects and later in-slot impact events need distinct timing support.
4. `aive/qa.py`, lines 139–152: standard QA checks decode, pixel format, stream presence, audio/video duration, optional text presence and black frames. It does not measure post-render event-to-musical-accent error, classify true kills, or evaluate aesthetic readability/stutter.
5. `aive/conductor.py`, lines 53–70 and `aive/roughcut.py`, lines 35–81: older raw-mode code expects `Shot.start/end/intensity/kind` and `shots_mod.rank`, which the currently inspected onset-based `Shot`/shots module does not expose. This is a static API mismatch in that path, not a confirmed runtime failure of every workflow. Reconcile before using it.

Minimum proposed order: reconcile event interfaces; detect and visually confirm game events; store event confidence plus source/output anchors; improve phrase/accent-aware multi-file assignment; add continuous bounded time maps and event-local effect envelopes; then add post-render sync and semantic QA. Start with one short proof sequence. No code was changed or executed during this study.
