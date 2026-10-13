---
name: "ai-video-editor"
description: "Edit videos using code and free tools, analyze a creator's editing style from reference videos, add one of seven subtitle styles, or set up a video-editing toolkit. Adapted from AI Video Editor by Luv Sankhla."
---

# AI Video Editor

## Current system continuation

Read `E:/aside/AI-CONTINUE-HERE.md` first. Use the existing project only. Generic lyrics preparation/rendering and calibration reports are integrated; historical status below may predate newer checkpoints. Never hard-code one song or invent verified lyrics/kills.

Use code and free tools rather than assuming access to Premiere or Final Cut. Preserve the source skill's measurement-first workflow, staged approvals, and render verification. Never claim an edit is complete until it has rendered and its video and audio have been inspected. If inspection is unavailable, state precisely what remains unverified.

## User's Valorant montage target

For this user's Valorant montage project, read `references/valorant-impact-style.md` before editing or changing the bot. It contains the six-reference visual study, shared premium impact-edit grammar, known limitations, and proposed automation target. A consolidated copy of the work is at `E:/aside/START-HERE.md`; the existing bot is at `E:/ai-video-editor`. Prefer E:/aside for new project notes and evidence as requested. This is a documented target, not a trained model or runtime-tested toolchain.

## 1. Establish the brief

For an actual editing request, ask one missing question at a time and wait for the answer. Reuse information already supplied; do not repeat questions or begin this interview when the user only asks to study the skill.

1. Which creator's style should guide the edit? Request 1–3 reference links, or accept an original style. At least two references are required to confirm recurring style rules.
2. Where is the footage? Obtain accessible files or a folder.
3. Short vertical 9:16 or long-form 16:9? What target duration and destination?
4. Which subtitle style below, or match the creator?
5. What must never appear: colours, music, transitions, words, or other exclusions?

Confirm important delivery requirements not already answered, such as resolution, frame rate, language, and available music or B-roll. Do not invent defaults that materially affect the edit.

## 2. Check the toolkit and render a test

Check installed tools before setup. On Windows use PowerShell `Get-Command`; on macOS/Linux use `command -v`. Verify versions and actual command availability.

- FFmpeg and ffprobe: cuts, joins, media inspection, audio processing, export. Discover the correct package for the platform rather than assuming a package identifier.
- Python 3, NumPy, Pillow: frame analysis and contact sheets.
- Whisper: speech-to-text and word timestamps. Apple Silicon can use mlx-whisper when available; verify its timestamp support.
- yt-dlp: obtain accessible reference videos when permitted. Do not bypass access controls or imply download rights.
- Node.js: meet the current renderer's documented requirements; the source proposes Node 18+.
- HyperFrames: HTML-based motion graphics. Check current package/API documentation and CLI help before generating commands; the source proposes `npx hyperframes@latest --help`. Do not assume rendering syntax or compatibility.
- Optional rembg for background removal and DeepFilterNet for voice cleanup, only when needed.

Use the supported terminal tool and PowerShell syntax in Aside on Windows. Follow the active environment's permissions for installs, network access, and file access. Prefer an isolated Python environment and project-local Node dependencies. Do not install tools just to analyze or learn this skill. If the terminal is blocked, report the blocker rather than claiming setup or rendering succeeded.

Explain each required setup action in one line. Once footage is available, render an approximately five-second test from a working copy and inspect it before the full edit.

## 3. Measure the reference style

For each permitted reference:

1. Inspect metadata with ffprobe, sample frames about every two seconds into a contact sheet, and transcribe with word timestamps.
2. Use scene-change detection and denser sampling around transitions to measure cuts. Two-second contact sheets alone cannot establish accurate fast-cut timing.
3. Measure average shot length, cuts/minute, and screen time for face, B-roll, and graphics. State category definitions, including how overlaps are handled.
4. Measure subtitle case, approximate font family and weight, size as a percentage of frame height, position, colours, words per group, highlighting, and entrance animation. Mark uncertain font identification and other estimates explicitly.
5. Record graphics palettes sampled from frames, approximate fonts, entrance/exit timing, and dwell time. A sampled hex value is an observed frame colour, not proof of an exact brand colour.
6. Examine music level relative to speech, changes, sound-effect placement, and deliberate silence. Distinguish measurements from estimated explanations.
7. Map the first 30 seconds, or the whole clip if shorter, with timestamps for attention-retaining changes.
8. For each observed pattern, write one sentence explaining its likely viewer effect. Label the explanation as interpretation, not proven causation.
9. Treat a pattern as a recurring style rule only when it appears in at least two references. With one reference, label the style card provisional.

Create a short Markdown style card with: rule, measurement or estimate, reference and timestamp, confidence, and likely purpose. Show it and ask whether this is the intended style before editing. Borrow editing techniques without reproducing another creator's distinctive assets, branding, or identity without permission.

## 4. Edit with approval checkpoints

Preserve originals, work in a project folder on copies, and retain v1, v2, and subsequent versions. Keep an edit decision list or equivalent reproducible timing record.

1. **Rough cut:** transcribe footage, remove mistakes, retakes, unnecessarily long pauses, and filler without changing meaning. Check waveform and word boundaries; do not cut inside a word. Render the rough cut and obtain approval before visual polish.
2. **Visuals:** place B-roll, screen recordings, and graphics on the relevant words or moments, following the approved style card. Use permitted assets and licensed fonts, footage, and music. Show the result before the next stage.
3. **Motion graphics:** build necessary graphics as HTML compositions using the verified HyperFrames workflow. Inspect rendered frames, layering, transparency where relevant, and timing. Show the result.
4. **Subtitles:** apply the chosen style, verify transcription, and retime words against the final edited audio. Source timestamps must be mapped through the cut list or regenerated after cuts. Show the result.
5. **Sound:** place effects to support visible changes or approved editorial beats, not arbitrarily. Keep speech intelligible, duck music as needed, and check joins and clipping. Show the result.
6. **Export:** use the agreed aspect ratio, resolution, codec, and frame rate. H.264 is a broadly compatible option; HEVC requires destination compatibility. The source suggests 1080p/4K, 30 fps, and about -14 LUFS for YouTube, but these are starting points, not universal requirements. Preserve or intentionally convert source frame rate, measure loudness and true peak, and prevent clipping.

Before completion, inspect frames around every cut and graphic, listen to every audio join, and verify duration, audio/video sync, subtitle readability, spelling, safe areas, and export metadata. Report limitations. Deliver the rendered video and useful project assets to the user's selected folder or Aside artifact directory. Use temporary files for screenshots that only prove completion.

## 5. Seven subtitle styles

| # | Style | Appearance |
|---|---|---|
| 1 | Clean caps | ALL CAPS; rounded heavy sans such as Nunito Black or a licensed equivalent; white, soft shadow; 2–4 words. |
| 2 | Lowercase + serif tail | Lowercase bold sans; key word in light italic serif; white on footage or dark on light backgrounds; no box. |
| 3 | Pill | Small white rounded pill; lowercase dark sans; spoken words dark, upcoming words grey; low on the frame. |
| 4 | Serif italic | Small lowercase italic serif; white with soft shadow; newest word becomes heavy italic. |
| 5 | Editorial | Bold sans with ONE semantic key word as a larger italic serif in a single accent colour, lime by default. |
| 6 | Classic viral | UPPERCASE Montserrat Black or equivalent; thick black outline; active word yellow; 1–3 words with a pop entrance. |
| 7 | Documentary | Small white bold UPPERCASE sans; single line; no accent colour or pop animation; restrained. |

Start near 4% of frame height for the main caption text, then adjust for legibility, emphasis, destination overlays, and the approved reference. Avoid faces and important content. Choose emphasis by meaning, with no more than one semantically emphasized word per sentence. For styles with active-word tracking, the moving read-along highlight is distinct from semantic emphasis. Confirm interpretation if matching a reference requires a different convention.

## 6. Design building blocks

Where helpful, adapt well-designed components from shadcn/ui, Magic UI, Aceternity UI, or React Bits, or consult desengs.com for design references. Inspect current availability and licences. Use only the dependencies needed for the graphic and render through the verified renderer. Do not assume arbitrary React components work directly in an HTML composition.

## Working rules

- Ask a concise question when an essential choice is unclear; use known context first.
- Never modify original footage.
- Keep versions so the user can compare.
- If the same approach fails twice, change strategy and explain plainly.
- Distinguish studied workflow, available tools, tested setup, rendered output, and verified output. Learning this skill is not evidence that its toolchain is installed or tested.
