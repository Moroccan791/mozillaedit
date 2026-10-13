#!/usr/bin/env python
"""aive — command-line interface.

Usage:
  python edit.py doctor                        # show system capabilities
  python edit.py looks                         # list grade looks
  python edit.py platforms                     # list export presets
  python edit.py scaffold <name> <source>      # create projects/<name>/project.json
  python edit.py shots <source>                # detect unconfirmed audio transients
  python edit.py run <project.json>            # run the full pipeline
"""
from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from aive import system  # noqa: E402


def _setup_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
    )


def cmd_doctor(_: argparse.Namespace) -> int:
    print(system.describe())
    return 0


def cmd_looks(_: argparse.Namespace) -> int:
    from aive import grade

    print("\n".join(grade.list_looks()))
    return 0


def cmd_platforms(_: argparse.Namespace) -> int:
    from aive.export import describe_platforms

    print(describe_platforms())
    return 0


def cmd_scaffold(args: argparse.Namespace) -> int:
    from aive.project import scaffold

    out_dir = ROOT / "projects" / args.name
    out_dir.mkdir(parents=True, exist_ok=True)
    proj = scaffold(args.name, args.source)
    path = out_dir / "project.json"
    proj.save(path)
    print(f"wrote {path}")
    return 0


def cmd_shots(args: argparse.Namespace) -> int:
    from aive import shots as shots_mod

    found = shots_mod.detect(args.source)
    ranked = shots_mod.rank(found)
    print(f"{len(found)} audio-transient candidates (not kill-confirmed):")
    for s in ranked[:40]:
        print(f"  t={s.t:8.2f}s  [{s.event_type}]  strength={s.strength:.2f}  confirmed={s.confirmed}")
    out = Path(args.source).with_suffix(".shots.json")
    out.write_text(json.dumps([s.to_dict() for s in found], indent=2),
                   encoding="utf-8")
    print(f"saved {out}")
    return 0


def cmd_analyze(args: argparse.Namespace) -> int:
    from aive import analyze as analyze_mod

    print(f"analyzing {args.source} (this takes a while on long clips)...")
    scores = analyze_mod.analyze(args.source)
    windows = analyze_mod.top_windows(
        scores, window=args.window, count=args.count, min_gap=args.min_gap
    )
    analyze_mod.save(scores, Path(args.source).with_suffix(".scores.json"))
    print(f"\nTop {len(windows)} highlight windows "
          f"({sum(w.duration for w in windows):.0f}s total):")
    for w in windows:
        print(f"  {w.start:7.2f} -> {w.end:7.2f}  score={w.score:.3f}  "
              f"loud={w.loud:6.1f}dB  motion={w.motion:.2f}")
    out = Path(args.source).with_suffix(".windows.json")
    out.write_text(json.dumps([w.to_dict() for w in windows], indent=2),
                   encoding="utf-8")
    print(f"\nsaved {out}")
    return 0


def cmd_beats(args: argparse.Namespace) -> int:
    from aive import beats as beats_mod

    info = beats_mod.detect_cached(args.audio)
    print(f"bpm={info.bpm} offset={info.offset}s beats={len(info.beats)} "
          f"downbeats={len(info.downbeats)} onsets={len(info.onsets)} "
          f"dur={info.duration:.1f}s")
    out = Path(args.audio).with_suffix(".beats.json")
    beats_mod.save(info, out)
    print(f"saved {out}")
    return 0


def cmd_music(args: argparse.Namespace) -> int:
    from aive import music as music_mod

    prof = music_mod.analyze_cached(args.audio)
    print(music_mod.describe(prof))
    out = Path(args.audio).with_suffix(".music.json")
    music_mod.save(prof, out)
    print(f"saved {out}")
    return 0


def cmd_plan(args: argparse.Namespace) -> int:
    from aive import conductor, planner
    from aive.project import Project

    windows = None
    if args.windows:
        windows = json.loads(Path(args.windows).read_text(encoding="utf-8"))
    proj = planner.plan(
        args.source, args.music, duration=args.duration, vibe=args.vibe,
        style=args.style, platform=args.platform, windows=windows,
        title_lines=args.title, grade=args.grade, audio_mode=args.audio,
    )
    out = Path(args.out) if args.out else (
        Path("projects") / Path(args.source).stem / f"planned_{args.vibe}.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    proj.save(out)
    print(planner.describe(proj))
    print(f"saved {out}")
    if args.render:
        loaded = Project.load(out)
        conductor.run(loaded, do_transcribe=False)
    return 0


def cmd_montage(args: argparse.Namespace) -> int:
    from aive import conductor, planner
    from aive.project import Project

    kills = [float(x) for x in args.kills.split(",")] if args.kills else None
    proj = planner.plan_kills(
        args.source, args.music, kills=kills, n=(args.n or None),
        duration=args.duration, pre=args.pre,
        post=args.post, platform=args.platform, grade=args.grade,
        audio_mode=args.audio, sfx=args.sfx,
        overlays=args.overlays, overlays_dir=args.overlays_dir,
    )
    out = Path(args.out) if args.out else (
        Path("projects") / Path(args.source).stem / f"montage_{args.n}.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    proj.save(out)
    print(planner.describe(proj))
    print(f"saved {out}")
    if args.render:
        loaded = Project.load(out)
        conductor.run(loaded, do_transcribe=False)
    return 0


def cmd_povkills(args: argparse.Namespace) -> int:
    """Conservative profile-based selection, not generic audio-as-kill detection."""
    from aive import povkills
    from aive.ffprobe import probe
    from aive.shots import detect

    source = str(Path(args.source).resolve())
    candidates = detect(source, min_gap=0.10) if not args.no_audio else []
    found = povkills.scan_cached(source, args.profile, candidates,
                                cache_dir=args.cache_dir)
    duration = probe(source).duration
    for event in found:
        event["source_duration"] = duration
    payload = {"schema_version": "povkills/v1", "source": source,
               "events": found, "confirmed_count": sum(e["confirmed"] for e in found),
               "candidate_count": sum(not e["confirmed"] for e in found),
               "limitations": povkills.LIMITATIONS}
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Saved {len(found)} observations, {payload['confirmed_count']} profile-confirmed: {out}")
    return 0


def cmd_encounters(args: argparse.Namespace) -> int:
    from aive import beats, music, encounters
    from aive.event_io import load_confirmed_events

    events, event_summary = load_confirmed_events(args.events)
    info = beats.detect_cached(args.music)
    profile = music.analyze_cached(args.music)
    timeline = encounters.plan_encounters(events, info, profile,
                  duration=args.duration, music_start=args.music_start)
    timeline["music"] = str(Path(args.music).resolve())
    timeline["event_input_summary"] = event_summary
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(timeline, indent=2), encoding="utf-8")
    print(f"Planned {len(timeline['timeline'])} intact encounters, {timeline['duration']:.2f}s of {args.duration:.2f}s requested: {out}")
    for warning in timeline["warnings"]:
        print(f"WARNING: {warning}")
    print("Explicit multi-source timeline only; legacy single-source run is not its renderer.")
    return 0


def cmd_render_encounters(args: argparse.Namespace) -> int:
    from aive.encounter_render import RenderConfig, render_encounters
    from aive import qa

    plan = json.loads(Path(args.timeline).read_text(encoding="utf-8-sig"))
    music = args.music or plan.get("music")
    if not music:
        raise ValueError("music path is required in timeline or --music")
    config = RenderConfig(encoder=args.encoder, fallback_encoder=args.fallback_encoder,
                          quality=args.quality, game_gain_db=args.game_gain,
                          music_gain_db=args.music_gain, style=args.style)
    manifest = render_encounters(plan, music, args.output_root, config=config)
    report = qa.verify(manifest["output"], want_audio=True)
    Path(manifest["job_dir"], "structural-qa.txt").write_text(report.render(), encoding="utf-8")
    print(report.render())
    print(f"Rendered: {manifest['output']}")
    print(f"Experimental {args.style} hard-cut path. Structural QA is not event-sync or perceptual quality certification.")
    return 0 if report.ok else 1


def cmd_lyric_check(args: argparse.Namespace) -> int:
    from aive.lyric_track import optional_lyric_track, build_lyric_ass
    result = optional_lyric_track(args.track, args.music)
    print(f"Lyrics enabled: {result.enabled}")
    print(result.reason)
    if not result.enabled:
        return 1
    if args.ass_out:
        if args.duration is None:
            raise ValueError("--duration is required when compiling ASS")
        out = Path(args.ass_out)
        out.parent.mkdir(parents=True, exist_ok=True)
        content = build_lyric_ass(result.track, width=1280, height=720,
                                 music_start=args.music_start, clip_duration=args.duration)
        with out.open('x', encoding='utf-8-sig') as stream:
            stream.write(content)
        print(f"Validated optional lyric ASS: {out}")
    return 0


def cmd_job(args: argparse.Namespace) -> int:
    from aive.daily_runner import JobConfig, run_job
    config = JobConfig(song=args.music, clip_folder=args.clips, output_root=args.output_root,
                       event_files=tuple(args.events or []), pov_profile=args.profile,
                       duration=args.duration, music_start=args.music_start, style=args.style,
                       encoder=args.encoder, fallback_encoder=args.fallback_encoder,
                       phrase_aware=not args.no_phrase_aware, plan_only=args.plan_only,
                       game_gain_db=args.game_gain, music_gain_db=args.music_gain)
    result = run_job(config)
    print(f"Job status: {result['status']}")
    print(f"Report: {Path(result['job_dir']) / 'REPORT.md'}")
    if result.get('output'):
        print(f"Output: {result['output']}")
    for key in ('blocked_reason', 'error'):
        if result.get(key):
            print(result[key])
    if result.get('quality'):
        print(f"Quality: {result['quality'].get('status', 'unknown')}")
        for issue in result['quality'].get('issues', []):
            print(f"  {issue.get('status')}: {issue.get('component')}: {issue.get('detail', '')}")
    print("Local versioned workflow; detector and perceptual quality are not unattended-certified.")
    return 0 if result['status'] in {'planned', 'rendered', 'rendered-with-warnings'} else 1


def cmd_run(args: argparse.Namespace) -> int:
    from aive import conductor
    from aive.project import Project

    proj = Project.load(args.project)
    if args.encoder:
        pass  # passed through
    out = conductor.run(proj, encoder=args.encoder, quality=args.quality,
                        do_transcribe=not args.no_transcribe)
    print(f"\nDONE -> {out}")
    return 0


def cmd_qa(args: argparse.Namespace) -> int:
    from aive import qa

    rep = qa.verify(args.file, text_times=args.text or None,
                    black_times=args.black or None)
    print(rep.render())
    return 0 if rep.ok else 1


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="aive", description="AI video editor (free/local)")
    p.add_argument("-v", "--verbose", action="store_true")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("doctor").set_defaults(func=cmd_doctor)
    sub.add_parser("looks").set_defaults(func=cmd_looks)
    sub.add_parser("platforms").set_defaults(func=cmd_platforms)

    sp = sub.add_parser("scaffold")
    sp.add_argument("name")
    sp.add_argument("source")
    sp.set_defaults(func=cmd_scaffold)

    sp = sub.add_parser("shots")
    sp.add_argument("source")
    sp.set_defaults(func=cmd_shots)

    sp = sub.add_parser("analyze")
    sp.add_argument("source")
    sp.add_argument("--window", type=float, default=8.0, help="window size (s)")
    sp.add_argument("--count", type=int, default=20, help="how many highlights")
    sp.add_argument("--min-gap", type=float, default=4.0)
    sp.set_defaults(func=cmd_analyze)

    sp = sub.add_parser("beats")
    sp.add_argument("audio")
    sp.set_defaults(func=cmd_beats)

    sp = sub.add_parser("music")
    sp.add_argument("audio")
    sp.set_defaults(func=cmd_music)

    sp = sub.add_parser("plan")
    sp.add_argument("source")
    sp.add_argument("--music", required=True)
    sp.add_argument("--duration", type=float, default=30.0)
    sp.add_argument("--vibe", default="music-reel",
                    choices=["gaming", "music-reel", "reel", "sports", "clean"])
    sp.add_argument("--style", default=None, choices=["montage", "highlights"],
                    help="montage=chopped beat cuts; highlights=keep moments whole")
    sp.add_argument("--platform", default="reels")
    sp.add_argument("--windows", default=None, help="analyze .windows.json")
    sp.add_argument("--title", nargs="*", default=None)
    sp.add_argument("--grade", default=None)
    sp.add_argument("--audio", default="mix", choices=["mix", "source", "music"])
    sp.add_argument("--out", default=None)
    sp.add_argument("--render", action="store_true")
    sp.set_defaults(func=cmd_plan)

    sp = sub.add_parser("montage")
    sp.add_argument("source")
    sp.add_argument("--music", required=True)
    sp.add_argument("--kills", default=None,
                    help="comma-separated source event times (s); omitted audio candidates are not kill-confirmed")
    sp.add_argument("--n", type=int, default=0, help="number of slots (0=auto by duration)")
    sp.add_argument("--duration", type=float, default=45.0,
                    help="target montage length when --n is 0")
    sp.add_argument("--pre", type=float, default=0.8)
    sp.add_argument("--post", type=float, default=1.5)
    sp.add_argument("--platform", default="reels")
    sp.add_argument("--grade", default=None)
    sp.add_argument("--audio", default="mix", choices=["mix", "source", "music"])
    sp.add_argument("--sfx", action="store_true")
    sp.add_argument("--overlays", dest="overlays", action="store_true", default=True,
                    help="composite overlay fx (particles/ripples/etc) on kills")
    sp.add_argument("--no-overlays", dest="overlays", action="store_false",
                    help="disable overlay fx")
    sp.add_argument("--overlays-dir", dest="overlays_dir", default=None,
                    help="folder of overlay clips (default E:\\overlays)")
    sp.add_argument("--out", default=None)
    sp.add_argument("--render", action="store_true")
    sp.set_defaults(func=cmd_montage)

    sp = sub.add_parser("povkills", help="local calibrated POV emblem selection")
    sp.add_argument("source")
    sp.add_argument("--profile", required=True)
    sp.add_argument("--out", required=True)
    sp.add_argument("--cache-dir", default=None)
    sp.add_argument("--no-audio", action="store_true")
    sp.set_defaults(func=cmd_povkills)

    sp = sub.add_parser("encounters", help="plan intact confirmed fights across source files")
    sp.add_argument("--events", required=True, nargs="+")
    sp.add_argument("--music", required=True)
    sp.add_argument("--music-start", type=float, default=0.0)
    sp.add_argument("--duration", type=float, default=35.0)
    sp.add_argument("--out", required=True)
    sp.set_defaults(func=cmd_encounters)

    sp = sub.add_parser("render-encounters", help="experimental multi-source clean or restrained-impact render")
    sp.add_argument("timeline")
    sp.add_argument("--music", default=None)
    sp.add_argument("--output-root", required=True)
    sp.add_argument("--encoder", choices=["libx264", "h264_qsv"], default="libx264")
    sp.add_argument("--fallback-encoder", choices=["libx264"], default=None)
    sp.add_argument("--quality", type=int, default=21)
    sp.add_argument("--game-gain", type=float, default=-8.0)
    sp.add_argument("--music-gain", type=float, default=-7.0)
    sp.add_argument("--style", choices=["clean", "restrained-impact"], default="clean")
    sp.set_defaults(func=cmd_render_encounters)

    sp = sub.add_parser("lyric-check", help="fail-closed exact-audio lyric alignment validation")
    sp.add_argument("track")
    sp.add_argument("--music", required=True)
    sp.add_argument("--music-start", type=float, default=0.0)
    sp.add_argument("--duration", type=float, default=None)
    sp.add_argument("--ass-out", default=None)
    sp.set_defaults(func=cmd_lyric_check)

    sp = sub.add_parser("job", help="versioned song + clip-folder local workflow")
    sp.add_argument("--music", required=True)
    sp.add_argument("--clips", required=True)
    sp.add_argument("--output-root", required=True)
    inputs = sp.add_mutually_exclusive_group(required=True)
    inputs.add_argument("--events", nargs="+")
    inputs.add_argument("--profile", default=None)
    sp.add_argument("--music-start", type=float, default=0.0)
    sp.add_argument("--duration", type=float, default=30.0)
    sp.add_argument("--style", choices=["clean", "restrained-impact"], default="clean")
    sp.add_argument("--encoder", choices=["libx264", "h264_qsv"], default="libx264")
    sp.add_argument("--fallback-encoder", choices=["libx264"], default=None)
    sp.add_argument("--game-gain", type=float, default=-8.0)
    sp.add_argument("--music-gain", type=float, default=-7.0)
    sp.add_argument("--no-phrase-aware", action="store_true")
    sp.add_argument("--plan-only", action="store_true")
    sp.set_defaults(func=cmd_job)

    sp = sub.add_parser("run")
    sp.add_argument("project")
    sp.add_argument("--encoder", default=None, help="force encoder e.g. h264_qsv")
    sp.add_argument("--quality", type=int, default=20)
    sp.add_argument("--no-transcribe", action="store_true")
    sp.set_defaults(func=cmd_run)

    sp = sub.add_parser("qa")
    sp.add_argument("file")
    sp.add_argument("--text", nargs="*", type=float, default=None)
    sp.add_argument("--black", nargs="*", type=float, default=None)
    sp.set_defaults(func=cmd_qa)

    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    _setup_logging(args.verbose)
    try:
        return args.func(args)
    except Exception as exc:  # noqa: BLE001
        if isinstance(exc, ModuleNotFoundError) and exc.name in {"numpy", "scipy"}:
            logging.error(
                "Local signal analysis needs NumPy and SciPy. Install with: "
                "python -m pip install -r requirements.txt"
            )
        else:
            logging.error("%s", exc)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
