# Independent visual rejection audit

Scope: local decoded visual evidence only, editing structure/style. No listening, music-onset judgement, gunshot-detector judgement, plugin attribution, network, installation, or production edits. New scripts/data only under E:\aside\rejection-audit-20261012\visual-audit. Confirmation sheets in session tmp. No browser tab was opened.

## Verdict
The rejection is substantiated. These are six trimmed encounter excerpts, not a reference-level authored montage. The restrained version is not literally identical to clean, but its new visual vocabulary is only a very small centered zoom and brief brightness pulse. The difference does not change sequence structure, shot roles, transition design, graphic identity, visual hierarchy, or ending. Calling this a premium style implementation would be overstating it.

## Inspected inputs
- Styled: E:\aside\other-stages-20261012\jobs\job-v0001\renders\encounters-v0001\encounters.mp4
- Clean: E:\aside\other-stages-20261012\resume-comparison-20261012\clean-renders\encounters-v0001\encounters.mp4
- Local Burn: E:\reference\YTDown.com_YouTube_Media_YJWDatNCoCM_Let-The-World-Burn-Valorant-Montage_002_720p.mp4
- Local Espresso: E:\reference\YTDown.com_YouTube_Media_Vp5ClXhplkU_Espresso-Valorant-Montage_002_720p.mp4
- Style card and actual E:\ai-video-editor\aive\encounter_render.py, impact_motion.py
- Both plan.json files and styled render-manifest.json.

## Method / time precision
FFmpeg local overview sheets at 2 fps across both previews and both references; dense 12 fps Burn 9–13 s; 8 fps Espresso 16–20.5 s; 12 fps first preview impact; 4 fps preview ending; exact 60 fps frame selections across all five preview cuts and the final 12 frames; exact 60 fps Burn ending frames 1668–1685. Sparse/dense sample timestamps below are the displayed sampled PTS and do not establish exact onset/cut boundaries. Preview cut boundary and last-frame timestamps are exact selected frame PTS. Black unused cells in tiled sheets are padding, not video black frames.

## Exact preview structure
Plans are semantically identical. Styled and clean use the same six ranges in the same order. Order is three chronologically increasing Ranked-but-it-s-a-1v9 excerpts, followed by three chronologically increasing reyna-u-need-to-toggle-harder excerpts. This preserves source grouping, but provides no visible alternating shot-size/viewpoint structure or separately designed build/contrast/payoff section.

| Window | Output first/last frame PTS | Source range (s) | Plan visual anchor | Lead / aftermath (s) |
|---|---|---|---|---|
| 1v9-1 | 0.000–4.533333 | 219.6558–224.2011 | 2.0109 | 2.0109 / 2.5344 |
| 1v9-2 | 4.550–8.466667 | 231.8336–235.7635517 | 7.2117 | 2.6664 / 1.2636 |
| 1v9-3 | 8.483333–13.016667 | 263.2303517–267.7931 | 10.9782 | 2.50295 / 2.0598 |
| reyna-1 | 13.033333–16.066667 | 7.8581–10.9114968 | 14.913233 | 1.87523 / 1.17816 |
| reyna-2 | 16.083333–19.966667 | 90.4526968–94.3420 | 17.972033 | 1.88064 / 2.00867 |
| reyna-4 | 19.983333–23.516667 | 186.7393–190.2862 | 21.374733 | 1.39403 / 2.15287 |

Anchor times come from the plan, not new detector verification. The important visual observation is repetition: each window is approximately 3–4.6 seconds of continuous HUD-bearing first-person gameplay with setup, event, then weapon/ability recovery. Context preservation is a useful baseline, not sufficient authorship.

## Timestamp comparisons and missing authored treatment

### 1. The difference is smaller than the existing gameplay visual language
Preview clean and styled at 1.833, 1.917, 2.000, 2.083 s show the same scoped enemy encounter. Styled has a slight crop/brightness lift around the event, not a new shot or visual concept. At 2.167–2.417 s both show the same unscope/weapon switching imagery, warm highlights and source/gameplay smear. Existing bright weapon/ability outlines and smear must not be credited to the new renderer.

Code proof: impact_motion.py 152–168 gives every event the same zoom peak 1.035, half-width .22 s, brightness peak .045, half-width .08 s, with max rather than summed overlap. The six zoom envelopes span only 2.64 s of 23.53 s (about 11.2%); brightness envelopes .96 s (about 4.1%). Peak zoom discards only about 3.38% of full field width. This is gentle correction, not the visual authorship in the references.

Burn sampled 10.833 s still shows red/black animated insert with moving luminous ring/line graphics; 10.917 s has a radically distorted gameplay return; 11.000–11.417 s shows successive reframed/smeared gameplay images; 11.500–12.917 s combines a large face silhouette with gameplay. These are different image-design states, not one repeated centered zoom pulse.

### 2. No transition carries visual momentum across a join
Exact preview frame pairs:
- 4.533333 -> 4.550: knife/stair recovery -> another sniper setup in the same warm environment.
- 8.466667 -> 8.483333: gold pistol facing the wall -> purple rifle near different cover, with existing incoming source motion smear.
- 13.016667 -> 13.033333: readable CLUTCH gameplay with knife -> close wall/new setup.
- 16.066667 -> 16.083333: dark wall/ability recovery -> bright pastel ability wall with enemy at left.
- 19.966667 -> 19.983333: aimed rifle and outlined opponent amid the pastel wall -> knives at another corner.

All are direct hard cuts. A hard cut is not intrinsically wrong, but five identical transition roles with no reframing/exit-entry coupling make the sequence feel concatenated. Incoming in-game/source blur is not a designed bridge.

Burn 11.000–11.417 and Espresso 18.000–18.500 show purposeful blur/reframing and luminous sweep across changing compositions. Those are concrete reference behaviors to implement; no plugin name is inferred.

### 3. Setup/outcome is retained but not editorially shaped
Preview 4.000–4.533333 is knife/stair recovery well after the first anchor. Preview 5.000–6.000 is an extended scope search across a wall/doorway. Preview 11.500–13.016667 holds knife plus CLUTCH outcome. Retaining readable resolution is good, but these recoveries have no differentiated role or designed hold, and next windows repeatedly reset to another setup.

At 19.883–19.966667 the rifle is actively engaging an outlined opponent immediately before the jump to knives at 19.983333. The shown terminal join gives no clear resolution of that late action. Do not conclude it is a newly confirmed kill or missing detector event; this is a cut-context concern visible in the pictures.

Action: choose setup length per encounter rather than preserve every window at near-normal pace. Keep enemy acquisition and meaningful result; shorten redundant wall search/recovery when it has no narrative role. Do not blindly cut every aftermath, since CLUTCH is useful context. Deliberately select one climax/resolution shot and shorten/reframe the surrounding recoveries.

### 4. No change in shot role / graphic or cinematic contrast
All six preview windows remain full-frame HUD-bearing POV. No editorial text, clean isolated subject treatment, insert, cinematic angle, or designed composited section is added.

Local Burn at 6.000 has large red outline CAN'T, 6.500 YOU; 7.000–10.833 has red/black animated insert and moving line/ring design; 11.500–12.917 face/gameplay composite; 13.500–14.500 has centered BURN imagery and large weapon/subject framing. This is not merely small lyric subtitles.

Local Espresso 16.375–17.000 moves through a HUD-free map/character approach. At 17.125–17.375 the character is composed within letterbox and a turquoise curve with THAT'S; 17.500–17.625 THE appears above; 17.875 ME below. At 18.000 radial movement exits the character view, 18.125–18.375 a cyan luminous line bridges back to gameplay. At 18.875–19.250 turquoise boxed wording and pink limb accents coexist; 19.375–19.875 large orange DON'T moves over changed exposure/framing. Reference words listed here are observed graphics, not a proposed transcription/alignment.

Action: give the next visual proof at least one distinct contrast section, plus one selective graphic event and a coherent recurring shape/palette grammar. If cinematic/isolated assets are not supplied, label that limitation and use an honest footage-only alternative such as intentional crop/composite/graphic design. Do not pretend a first-person recording can generate a verified unseen third-person angle. Avoid an arbitrary stock transition or caption stream as substitute.

### 5. Movement is technically smooth in the formula but aesthetically weak/uniform
The manifest bounds are .829135–1.259566 playback speed, identical across all six windows. Events and +- .18 s protections remain identity, while small eased time displacement happens in surrounding gaps. At .06 strength maximum displacement equals 6% of each gap length. This is not a visibly strong slow-impact / rapid exit rhythm, and it is not event-dependent motion choreography. CFR frame selection is used without interpolation; sampled frames cannot establish perceptual smoothness or exact reference ramp curves.

encounter_render.py 269–284 adds only eq brightness and a zoom centered on iw/2,ih/2. It has no authored off-center target tracking, tilt, directional/radial blur, local light/subject treatment, transition choreography or text layer.

Action: design one readable event envelope integrating crop path, speed shape, directional smear/exposure recovery and outgoing framing. Make effects selective and varied according to shot role rather than simply increase the same pulse on all six windows. Evaluate real output motion and kill readability, not just whether speed stays within a bound.

### 6. No ending
Preview 23.333–23.516667 stays normally exposed during rifle handling/reload-like movement. Last frame 1411 at 23.516667 is still moving gameplay. There is no selected final composition, hold, fade, or outro, and no black frame before file end. The black tile cells in the ending overview are empty grid cells, not output fade.

Burn exact ending: 27.966667 still hallway/gameplay outcome; 27.983333–28.050 is directional smear; first black frame among inspected ending frames is 28.066667. Overview remains black at 28.5 and 29.0 s. Thus closure is an authored exit, not just stopping on weapon motion.

Action: decide the final payoff first; let outcome resolve, then choose hold/darkening or designed short exit to black. Do not end solely because the continuous encounter budget is exhausted.

## Why this renderer cannot currently satisfy the style card
encounter_render.py 109–111 rejects nonempty effects, lyrics, ramps, transitions, overlays and sfx in the plan. Lines 136–138 reject per-clip motion/transition/flash fields. Its opt-in internal restrained map bypasses the ordinary 1x output visually but adds no broader treatment schema. The absent authored treatments are excluded capability, not just parameters that need more intensity. A richer visual layer and sequence plan is required if the product is to claim this reference style. Keep the clean encounter path as a context/timing baseline, not a final aesthetic deliverable.

## Most important next proof, in order
1. Re-author 8–12 s, not re-render all 23.53 s with stronger identical zoom. Specify shot roles and climax. Preserve only necessary setup/outcome.
2. Prove one intentional incoming/outgoing motion bridge with readable event and exposure recovery.
3. Add one contrasting compositional state, with supplied/allowed assets or an explicitly footage-only alternative.
4. Add one selective animated graphic event and local subject/light treatment that is visibly absent from clean.
5. Compose the ending; inspect exact terminal frames.
6. Side-by-side against clean and a comparable reference passage: the added authored design must be unmistakable with audio muted. This is an aesthetic acceptance test, not a claim about listening or measured synchronization.

## Evidence files
Scripts: contact_sheets.ps1, exact_frames.ps1. Structured data: timeline-evidence.json. Images: session tmp directory recorded in JSON. Production files untouched.
