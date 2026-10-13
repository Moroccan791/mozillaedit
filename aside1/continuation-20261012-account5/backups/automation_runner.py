"""Explicit candidate-preview automation. Never unattended-ready certification.

Automatic audio candidates -> multishot rhythm fit -> authored video -> QA.
Unreviewed events stay candidates; original confirmed-only runner is retained.
"""
from __future__ import annotations
from dataclasses import dataclass, asdict
import json
from pathlib import Path
import time
import traceback
from .daily_runner import _job_dir, _hash, _write, inventory_clips


@dataclass(frozen=True)
class AutomationConfig:
    song: str
    clip_folder: str
    output_root: str
    music_start: float=25.
    duration: float=10.
    encoder: str="libx264"
    width: int=1280
    height: int=720
    fps: int=60
    game_gain_db: float=-8.
    music_gain_db: float=-7.
    max_clips: int=4
    max_source_seconds: float=600.
    plan_only: bool=False
    lyric_track: str|None=None
    visual_screen: bool=True
    exclusions_file: str|None=None

    def validate(self):
        from .rhythm_planner import _num
        from .encounter_render import RenderConfig
        for name in ("song","clip_folder","output_root"):
            if not isinstance(getattr(self,name),str) or not getattr(self,name).strip():raise ValueError(f"{name} required")
        if not Path(self.song).is_file() or not Path(self.clip_folder).is_dir():raise ValueError("existing song and clip folder required")
        _num(self.music_start,"music_start",0,588)
        _num(self.duration,"duration",1,12)
        _num(self.max_source_seconds,"max_source_seconds",1,600)
        if type(self.max_clips) is not int or not 1<=self.max_clips<=8:raise ValueError("max_clips must be1..8")
        if type(self.plan_only) is not bool or type(self.visual_screen) is not bool:raise ValueError("flags must be boolean")
        if self.exclusions_file is not None and (not isinstance(self.exclusions_file,str) or not Path(self.exclusions_file).is_file()):raise ValueError("exclusion file missing")
        if self.lyric_track is not None and (not isinstance(self.lyric_track,str) or not Path(self.lyric_track).is_file()):raise ValueError("lyric track file missing")
        RenderConfig(width=self.width,height=self.height,fps=self.fps,encoder=self.encoder,
                     style="authored-footage",game_gain_db=self.game_gain_db,music_gain_db=self.music_gain_db).validate()


def run_automation(config):
    config.validate()
    clips=inventory_clips(config.clip_folder,config.max_clips)
    job=_job_dir(config.output_root)
    _write(job/"config.json",asdict(config))
    started=time.perf_counter();stages={}
    result=dict(schema_version="automation-job/v1",job_dir=str(job),mode="candidate-preview",
                status="running",output=None,stages=stages,
                readiness=dict(automatic_candidate_analysis=True,automatic_pov_confirmation=False,
                    reviewed_music_suitability=False,reviewed_fight_completeness=False,
                    perceptual_listening=False,unattended_ready=False),
                limitations=["Automatic candidates are audio transients, not confirmed shots or kills.",
                    "Music hits are acoustic candidates, not certified percussion, bar phase or musical taste.",
                    "Generated roles and fades do not certify fight outcome, reference-level polish or listening.",
                    "No source retiming: difficult burst rhythm stays unmatched; strict confirmation runner retained."])
    try:
        _write(job/"input-manifest.json",dict(song=str(Path(config.song).resolve()),song_sha256=_hash(config.song),
            clips=[dict(source=str(p),size=p.stat().st_size,mtime_ns=p.stat().st_mtime_ns) for p in clips]))
        from .hit_map import build_hit_map
        t=time.perf_counter();hits=build_hit_map(config.song,config.music_start,config.duration)
        stages["music_seconds"]=time.perf_counter()-t;_write(job/"hit-map.json",hits)
        from .firing_map import extract_firing_map
        t=time.perf_counter();maps=[]
        for i,clip in enumerate(clips):
            data=extract_firing_map(str(clip),max_source_seconds=config.max_source_seconds,max_windows=16)
            _write(job/f"firing-map-{i:03d}.json",data);maps.append(data)
        stages["firing_seconds"]=time.perf_counter()-t
        if config.visual_screen:
            from .visual_gate import screen_maps
            t=time.perf_counter()
            exclusions=json.loads(Path(config.exclusions_file).read_text(encoding="utf-8-sig")) if config.exclusions_file else None
            maps,screen=screen_maps(maps,exclusions=exclusions,max_windows=16*len(clips))
            _write(job/"visual-screen.json",screen)
            result["visual_screen_summary"]=dict(retained=len(screen["retained"]),rejected=len(screen["rejected"]),semantic_review="unreviewed")
            stages["visual_screen_seconds"]=time.perf_counter()-t
        from .rhythm_planner import plan_candidate_rhythm,author_candidate_design
        t=time.perf_counter();plan=plan_candidate_rhythm(maps,hits,duration=config.duration,music_start=config.music_start)
        stages["planning_seconds"]=time.perf_counter()-t
        result["rhythm_summary"]=plan["rhythm_summary"]
        plan["music"]=str(Path(config.song).resolve())
        if not plan["timeline"]:
            result.update(status="blocked",blocked_reason="Fewer than four intact, bounded windows fit measured acoustic candidates. No filler or event confirmation invented.")
            _write(job/"timeline.json",plan)
        else:
            plan=author_candidate_design(plan,fps=config.fps)
            _write(job/"timeline.json",plan)
            result["planned_duration"]=plan["duration"];result["warnings"]=plan["warnings"]
            if config.plan_only:result["status"]="planned-candidate-preview"
            else:
                from .encounter_render import RenderConfig,render_encounters
                t=time.perf_counter();manifest=render_encounters(plan,config.song,job/"renders",config=RenderConfig(
                    width=config.width,height=config.height,fps=config.fps,encoder=config.encoder,
                    style="authored-footage",game_gain_db=config.game_gain_db,music_gain_db=config.music_gain_db))
                stages["render_seconds"]=time.perf_counter()-t
                if config.lyric_track:
                    from .encounter_text import apply_verified_lyrics
                    t=time.perf_counter();manifest=apply_verified_lyrics(manifest,config.lyric_track,config.song)
                    stages["lyrics_seconds"]=time.perf_counter()-t
                result["output"]=manifest["output"];result["render_manifest"]=manifest["manifest_path"]
                from .encounter_qa import verify_encounters
                from .attack_qa import measure_attack_alignment
                t=time.perf_counter();quality=verify_encounters(manifest,plan)
                _write(job/"quality-report.json",quality)
                attack=measure_attack_alignment(manifest,plan)
                _write(job/"attack-alignment.json",attack)
                result["quality"]=quality;result["attack_alignment"]=attack
                stages["qa_seconds"]=time.perf_counter()-t
                result["status"]="failed-qa" if quality.get("status")=="fail" else "rendered-candidate-preview"
    except Exception as exc:
        result.update(status="failed",error=str(exc));(job/"error.txt").write_text(traceback.format_exc(),encoding="utf-8")
    result["elapsed_seconds"]=round(time.perf_counter()-started,3)
    _write(job/"job-report.json",result)
    lines=[f"# Candidate automation job: {result['status']}",f"Job: {job}",f"Elapsed: {result['elapsed_seconds']}s",
           "", "NOT a confirmed montage or unattended-ready system."]
    for key in ("output","blocked_reason","error","rhythm_summary"):
        if result.get(key):lines.append(f"{key}: {result[key]}")
    lines+=["","## Readiness"]+[f"- {k}: {v}" for k,v in result["readiness"].items()]
    lines+=["","## Limitations"]+["- "+v for v in result["limitations"]]
    if result.get("quality"):
        lines+=["","## QA issues"]+[f"- {i['component']}: {i.get('detail','')}" for i in result["quality"]["issues"]]
    (job/"REPORT.md").write_text("\n".join(lines)+"\n",encoding="utf-8")
    return result
