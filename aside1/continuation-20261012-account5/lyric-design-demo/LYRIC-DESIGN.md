# Lyric design v1: isolated opt-in proof

## Scope

New production module only: `E:\ai-video-editor\aive\lyric_design.py`.
New test file only: `E:\ai-video-editor\tests\test_lyric_design.py`.
No edits to lyric_track.py, encounter_text.py or any other existing production module by this task. Parent owns integration after review.

API: `compile_lyric_design(track: LyricTrack, document: dict, *, fonts_root=r"E:\fonts") -> DesignedLyrics(ass: str, audit: dict)`.

This compiler accepts only an already validated LyricTrack with the existing validator token. It rechecks the selected music file hash before and after compilation, and requires the design's music source path/hash to match that track. It has no raw gameplay/audio input parameter, transcription, invented lyric text, automatic caption generation, audio remix or rendering side effect. Words come exclusively from original track indices. Track validation establishes caller assertions and structure, NOT that text is actually sung.

## Explicit design schema

See `lyric-design.json` for a complete runnable example. All dictionary keys are exact: unknown or missing keys reject. Top level:

- schema `lyric-design/v1`, enabled literally true
- source: music_source, audio_sha256
- excerpt: music_start_sample, sample_rate, sample_count, output_start
- canvas: width, height, mode (`gameplay` or `diagnostic`)
- moments: 1..64 explicit selections
- visual_impacts (output clock), allow_impact_collision (boolean)
- protected_zones (additional normalized boxes), allow_protected_overlap (boolean)

Each moment requires id, word_indices, role, font_family, palette, box, size, opacity, animation. No user-supplied text, ASS tags, color strings, expressions or arbitrary fonts are accepted.

Roles:

- giant_word: one selected original word, large condensed, optional glow/translucence
- accent_echo: one selected original word with bounded offset accent layer and optional glow
- quiet_italic: explicitly selected contiguous phrase, quiet condensed synthetic italic
- quiet_serif: explicitly selected contiguous phrase, real bundled permitted serif italic face required. **Unavailable on this machine, fails closed.** No misleading serif substitution.

Palettes: ice, violet, paper. Positions are normalized `[x,y,width,height]` inside canvas. Size is .018..40 of canvas height, quiet roles limited to .07. Opacity .15..1. Entrance 0..300 ms, exit 0..250 ms, scale .80..1.15, echo offset each axis -.025..025, glow 0...012 of height (quiet .003 max). Entrance plus exit must fit inward-quantized lifetime. Dimensions 320..7680 by 180..4320. Excerpt maximum 300 seconds, explicit rate 8000..192000 and integer decoded-sample excerpt coordinates.

## Timing and safety

Word start/end remain selected-music decoded sample-zero timestamps. Mapping is word_time - music_start_sample/sample_rate + output_start, computed using Decimal for inward centisecond quantization. No stretching, restarting, moving onto beats, enlarging word durations, or gameplay timing substitution. Any selected word crossing either excerpt boundary causes the whole authored moment to be omitted. Sub-centisecond events omitted. Quiet phrases require contiguous ascending original indices with gaps <=0.6 seconds, at most 7 words and safe length <=120 characters.

Gameplay mode includes conservative protected boxes for aiming/enemy region, kill feed, and bottom HUD. Caller may add boxes, not remove defaults. Overlapping moments are omitted unless allow_protected_overlap is explicitly true. Giant/accent lifetimes also avoid +/-0.2 seconds around supplied visual impact times unless allow_impact_collision is explicitly true. Every rendered/omitted event includes original indices, source times, design choices, licensed font path and mapped centiseconds in audit.

Text uses existing safe_ass_text rejection. All overrides are code-generated from bounded values and enumerations: position, rectangle clip, font/size, color/alpha, border/blur, fade and scale transform. TTF cmap verifies glyph availability; conservative font ink metrics, overhang, scale and effect margins reject explicit-box overflow instead of automatic fitting. Hard rectangle clips enforce pixel-region bounds even if a renderer's shaping differs. This can clip unforeseen font behavior; it is not semantic occlusion detection.

## Font evidence

Existing `E:\fonts` contains bundled OFL Bebas Neue and Oswald TTFs, their OFL files, and Bebas/Oswald zip archives. No OTF or bundled serif discovered. No installs/downloads. Compiler uses only existing discover_licensed_fonts, excludes variable fonts, and requires permitted family/face. Demo stages existing static TTFs and puts copies of OFL license text outside fontsdir to avoid libass treating text files as fonts.

FFmpeg log confirms BebasNeue-Regular and Oswald-Regular. Oswald quiet_italic is libass synthetic slant on the regular face, honestly not serif and not a true bundled italic face.

## Executed proof

Focused command only (not entire suite):

`python -m unittest tests.test_lyric_design tests.test_lyric_track -v`

23 tests passed: 9 new design tests, 14 existing lyric-track tests. Evidence: `focused-tests.txt`. Cases cover source path/hash mismatch (including raw-gameplay path), unloaded track, changed music, selective original indices, sample-zero mapping/inward rounding, clipped/tiny omission, protected boxes and explicit authorization, visual impact collisions, generated echo/glow/italic tags, unavailable serif rejection, strict JSON keys/types/nonfinite bounds/injection rejection, missing glyphs, text bounds and animation lifetime.

`make_demo.py` ran real FFmpeg, with no PIL or downloaded material. It generated a 220 Hz non-vocal diagnostic tone and synthetic labels SHAPE, LIGHT, quiet form. **These labels are NOT actual-song lyrics and are NOT sung.** The fixture's alignment_verified assertion is explicitly synthetic and only exercises the existing structural validator.

Decoded-audio excerpt: samples 48000 through 336000 at 48000 Hz (music seconds 1..7), output 0..6 seconds. FFmpeg produced `typography-demo.mp4`: H.264 yuv420p 1280x720 at 30/1 fps, 180 frames, 6.000000-second video and AAC audio. `ffprobe.json`, `ffmpeg-command.json`, `ffmpeg.log`, original synthetic audio hash in track/audit, design document and generated ASS retain evidence.

Visually inspected decoded PNGs:

- `giant-word.png`, output 0.8s: readable large translucent cyan SHAPE with glow
- `accent-echo.png`, output 2.6s: readable violet LIGHT with offset echo
- `quiet-italic.png`, output 4.4s: small quiet italic phrase, not a subtitle stream

Diagnostic two-color background was chosen rather than modifying actual footage. The proof validates rendering and authored typography grammar, not reference parity, gameplay composition quality, lyrics transcription, vocal alignment, gunshot-to-beat alignment, or occlusion on a real encounter.

## Integration responsibilities and limits

The caller must bind the design to a real selected music LyricTrack and verify excerpt rate/start/count/output and canvas against the actual montage manifest. Use gameplay mode for gameplay outputs; diagnostic mode is only a declared diagnostic canvas. Mixed-video audio lineage remains manifest metadata, not independent waveform truth. The caller must stage licensed fonts, render text onto a NEW output, preserve original mixed audio and exact video clock, retain ASS/audit and verify post-render frame and audio invariants. This compiler does not do those tasks.

Large typography stays opt-in. Protection causes omission, not silent relocation. The supplied protected boxes/impacts are conservative declarations, not detection. The module does not automatically produce reference-level cinematic composites or a full caption track. Serif remains blocked until an existing permitted bundled OFL serif italic face is available and discovered; this task did not acquire one.
