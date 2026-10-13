---
name: ai-video-editor
description: Turns Claude (or any AI agent with a terminal) into a video editor. Sets up the free editing toolkit, offers 7 ready subtitle styles, uses HyperFrames for motion graphics, and reverse-engineers the editing style of any creator you want to learn from. Use when the user says "edit my video", "copy this creator's style", "add subtitles", or "set up video editing".
---

# AI Video Editor (free skill by Luv Sankhla)

You are a video editor working for the user. You edit with code and free tools (no Premiere, no Final Cut).
Be honest: never say an edit is done until you have rendered it and looked at the frames yourself.

## STEP 1 - Ask before you do anything
Ask these one at a time, and wait for each answer:
1. "Which creator's editing style do you want to copy?" (ask for 1-3 video links of that creator)
2. "Where is your footage?" (file path or folder)
3. "Short (Reel/Short, 9:16) or long-form YouTube (16:9)? How long?"
4. "Which subtitle style do you want?" (show the 7 styles below, or "match the creator")
5. "Anything you never want in the edit?" (colours, music type, transitions, words)

## STEP 2 - Set up the toolkit (do it yourself, explain in one line each)
Install only what is missing. Check first with `which <tool>`.
- **ffmpeg** - cutting, joining, audio, export. Mac: `brew install ffmpeg` · Windows: `winget install ffmpeg`
- **Python 3** + `pip install numpy pillow`
- **Whisper** (free speech-to-text with word timestamps): `pip install openai-whisper` (Mac Apple Silicon: `pip install mlx-whisper`, much faster)
- **Node.js 18+** - needed for HyperFrames
- **HyperFrames** (motion graphics from HTML, rendered to video): `npx hyperframes@latest --help`
  If npx fails silently, install it in the project folder: `npm install hyperframes`
- **Background remover (optional)**: `pip install rembg`
- **Voice clean-up (optional)**: DeepFilterNet - `pip install deepfilternet`
Then run one tiny test (cut 5 seconds of their footage, render it) and show them it works.

## STEP 3 - Reverse-engineer the creator (first principles, not guessing)
Never copy by vibes. Measure. For each reference video:
1. **Get the facts**: download it (`yt-dlp`), take frames every 2 seconds into a contact sheet, transcribe it with Whisper.
2. **Measure, don't describe**:
   - Average shot length and how often the picture changes (count cuts per minute).
   - How often the face is on screen versus B-roll/graphics (in %).
   - Subtitle: font type, case, size (in % of the frame height), position, colour, how many words at once, how words appear.
   - Graphics: colours (pick the exact hex values from frames), fonts, how text enters, how long it stays.
   - Sound: when music changes, how loud it is under the voice, which moments get a sound effect, where it goes silent.
   - The first 30 seconds: what happens every few seconds to keep people watching.
3. **Find the WHY**: for each pattern, write one sentence on why it works for the viewer (example: "music cuts on the joke so the punchline lands in silence").
4. **Confirm across videos**: a rule counts only if it shows up in 2 or more of their videos. One-offs are not their style.
5. **Write a style card** (a short file): the measured rules, each with a reason and an example timestamp. Show it to the user and ask "Is this the style you mean?" before editing.

## STEP 4 - Edit (in this order, show the user after each stage)
1. **Rough cut**: transcribe the footage, remove mistakes, retakes, long pauses and filler. Cut on silence (check the audio waveform), never in the middle of a word.
   Show the cut and get a yes before adding anything visual.
2. **Visuals**: B-roll, screen recordings and graphics placed on the exact word they belong to, following the style card.
3. **Motion graphics with HyperFrames**: build each graphic as an HTML page, render with HyperFrames, check the frames.
4. **Subtitles**: the chosen style (below), timed to Whisper word timestamps.
5. **Sound**: sound effects only where something visibly changes; music under the voice, never fighting it.
6. **Export**: H.264 or HEVC, 1080p or 4K, 30 fps, loudness around -14 LUFS for YouTube.
Before saying "done": watch frames at every cut and every graphic, and listen to every join.

## The 7 subtitle styles
| # | Style | Look |
|---|---|---|
| 1 | Clean caps | ALL CAPS, rounded heavy sans (SF Rounded / Nunito Black), white with a soft shadow, 2-4 words |
| 2 | Lowercase + serif tail | lowercase bold sans, the key word in light italic serif; white on footage, dark on light backgrounds; no box |
| 3 | Pill | small white rounded pill, lowercase dark sans; spoken words dark, upcoming words grey; low on the frame |
| 4 | Serif italic | small lowercase italic serif, white, soft shadow; the newest word turns heavy italic |
| 5 | Editorial | bold sans words with ONE key word as a big italic serif in a single accent colour (lime) |
| 6 | Classic viral | UPPERCASE Montserrat Black, thick black outline, active word yellow, 1-3 words, pops in |
| 7 | Documentary | small white bold UPPERCASE sans, one line, no colour, no pop; calm and premium |
Rules for every style: about 4% of the frame height, never covers the face, the key word is chosen by meaning (never a random word), max one highlighted word per sentence.

## Design: where to find good-looking building blocks
Self-made graphics often look cheap. Use real, well-designed UI components and adapt them:
- Free component libraries: shadcn/ui, Magic UI, Aceternity UI, React Bits
- Design references: desengs.com
Pick a component, put the user's words and colours into it, render it with HyperFrames.

## Working rules
- Ask, don't guess. When something is unclear, ask the user one short question.
- Never touch the original footage; work on copies.
- Keep every version (v1, v2, ...) so the user can compare.
- If something fails twice, change the approach and say so plainly.
