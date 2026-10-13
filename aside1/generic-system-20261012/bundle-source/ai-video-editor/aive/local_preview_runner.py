"""Existing local components -> fresh long authored diagnostic, no visual AI.

Uncalibrated templates stay unconfirmed. No fallback, manual source picks,
external inference or independent musical/semantic approval is claimed.
"""
from __future__ import annotations
import json
from pathlib import Path
import time
import traceback
from .daily_runner import _job_dir, _write, _hash


def run_local_preview(*, song, source, profile, output_root, music_start=8., duration=35.,
                      encoder="h264_qsv", plan_only=False, lyrics_mode="off",
                      lyric_track=None, lyric_design=None, lyric_model=None,
                      lyric_language=None, lyric_max_moments=3, fonts_root=r"E:\fonts",
                      calibration_labels=None):
    from .encounter_render import RenderConfig
    import math
    if (type(duration) not in (int,float) or not math.isfinite(duration) or not 30 <= duration <= 50
            or type(music_start) not in (int,float) or not math.isfinite(music_start) or music_start < 0
            or type(plan_only) is not bool):
        raise ValueError("local long preview requires finite30..50s, nonnegative music start and explicit flag")
    if lyrics_mode not in {"off", "verified", "candidates"}:
        raise ValueError("lyrics_mode must be off, verified or candidates")
    if type(lyric_max_moments) is not int or not 1 <= lyric_max_moments <= 8:
        raise ValueError("lyric_max_moments must be 1..8 selective moments")
    if lyrics_mode == "off" and any(v is not None for v in (lyric_track,lyric_design,lyric_model,lyric_language)):
        raise ValueError("lyric inputs require explicit lyrics_mode; no silent ignored lyrics")
    if lyrics_mode == "verified" and (lyric_track is None or lyric_model is not None or lyric_language is not None):
        raise ValueError("verified lyrics require track and no candidate-model options")
    if lyrics_mode == "candidates" and (lyric_model is None or lyric_track is not None or lyric_design is not None):
        raise ValueError("candidate lyrics require existing local model, not verified inputs")
    for optional in (lyric_track,lyric_design,calibration_labels):
        if optional is not None and not Path(optional).is_file():
            raise ValueError("existing lyric/label input file required")
    for value in (song,source,profile):
        if not Path(value).is_file(): raise ValueError("existing song/raw source/local profile required")
    config=RenderConfig(style="authored-footage",encoder=encoder,game_gain_db=-8,music_gain_db=-7)
    config.validate()
    job=_job_dir(output_root); started=time.perf_counter()
    result=dict(status="running",job_dir=str(job),output=None,mode="local-candidate-preview",
        visual_ai_used=False,manual_source_windows=False,perceptual_approval=False,
        pipeline="existing-authored-system/v2",fallback_allowed=False,
        lyrics=dict(mode=lyrics_mode,status="disabled" if lyrics_mode=="off" else "pending",
                    alignment_verified=False))
    try:
        _write(job/"config.json",dict(song=song,source=source,profile=profile,music_start=music_start,
            duration=duration,encoder=encoder,plan_only=plan_only,lyrics_mode=lyrics_mode,
            lyric_track=lyric_track,lyric_design=lyric_design,lyric_model=lyric_model,
            lyric_language=lyric_language,lyric_max_moments=lyric_max_moments,
            fonts_root=str(fonts_root),calibration_labels=calibration_labels))
        source_sha=_hash(source);song_sha=_hash(song)
        _write(job/"input-manifest.json",dict(source=str(Path(source).resolve()),source_sha256=source_sha,
            song=str(Path(song).resolve()),song_sha256=song_sha,profile_sha256=_hash(profile)))
        if lyrics_mode == "candidates":
            from .lyric_workflow import extract_lyric_candidates
            candidates=extract_lyric_candidates(song,job,model_directory=lyric_model,language=lyric_language)
            result["lyrics"].update(status="awaiting-independent-verification",candidates=candidates)
            result.update(status="blocked",blocked_reason="Music lyric candidates saved; independently verify sung words/times before verified graphic rendering. No lyric-free fallback.")
            result["elapsed_seconds"]=round(time.perf_counter()-started,3)
            _write(job/"job-report.json",result)
            (job/"REPORT.md").write_text("# Lyrics setup blocked for independent verification\n\n"+result["blocked_reason"]+"\n",encoding="utf-8")
            return result
        from .acoustic_cache import cached_firing_map,cached_hit_map
        fmap,firing_cached=cached_firing_map(source,600,16);_write(job/"firing-map.json",fmap)
        from .povkills import scan_cached
        icons=scan_cached(source,profile,[dict(e,t=e["time"]) for e in fmap["candidate_events"]])
        _write(job/"local-icon-records.json",dict(records=icons,calibration="unverified"))
        # Existing hit builder remains bounded <=12s; combine adjacent excerpts
        # with absolute sample-zero song clocks, never a synthetic BPM grid.
        hits=[];hit_cached=[]; cursor=music_start
        while cursor < music_start+duration-1e-7:
            length=min(10.,music_start+duration-cursor)
            data,cached=cached_hit_map(song,cursor,length);hits.append(data);hit_cached.append(cached)
            cursor += length
        _write(job/"hit-maps.json",dict(maps=hits))
        from .local_authored_planner import plan_local_authored
        plan=plan_local_authored(fmap,icons,hits,music_start=music_start,duration=duration,fps=60)
        plan["music"]=str(Path(song).resolve());_write(job/"timeline.json",plan)
        result["analysis_cache"]=dict(firing=firing_cached,hits=hit_cached)
        result["planned_duration"]=plan["duration"]
        from .closure_qa import audit_closure
        try:
            closure=audit_closure(plan)
        except (ValueError,TypeError,KeyError) as exc:
            closure=dict(schema_version="closure-qa/v1",status="invalid-evidence",detail=str(exc))
        _write(job/"closure-report.json",closure)
        result["closure_report"]=str(job/"closure-report.json")
        def calibration(attack=None):
            from .calibration_report import audit_local_evidence
            from .daily_runner import _bounded_json
            labels=_bounded_json(calibration_labels,2*1024*1024)[0] if calibration_labels else None
            try:
                audit=audit_local_evidence(fmap,icons,hits,plan=plan,attack=attack,labels=labels)
            except (ValueError,TypeError,KeyError) as exc:
                audit=dict(schema_version="calibration-report/v1",status="invalid-evidence",
                           calibration_verified=False,detail=str(exc))
            calibration_path=job/("calibration-report.json" if attack is not None else "calibration-plan-report.json")
            _write(calibration_path,audit)
            result["calibration_report"]=str(calibration_path)
        calibration()
        prepared=None
        if plan["timeline"] and lyrics_mode == "verified":
            from .lyric_workflow import prepare_lyrics, SparseTypographyPolicy
            prepared=prepare_lyrics(song,plan,config,job,lyric_track,lyric_design,
                policy=SparseTypographyPolicy(max_moments=lyric_max_moments),fonts_root=fonts_root)
            result["lyrics"].update(status="preflight-passed",preparation=prepared.to_dict(),
                alignment_verification_source="supplied-track-assertion-not-independent-certification")
        if not plan["timeline"]:
            result.update(status="blocked",blocked_reason="Insufficient bounded local icon/audio windows fit the requested song; no filler or confirmed labels invented.")
        elif plan_only:result["status"]="planned-local-preview"
        else:
            if _hash(source)!=source_sha or _hash(song)!=song_sha:raise ValueError("input changed during planning")
            from .encounter_render import render_encounters
            manifest=render_encounters(plan,song,job/"renders",config=config)
            if manifest["style"]!="authored-footage" or manifest["authored_design"]["schema_version"]!="authored-footage/v2":
                raise ValueError("actual authored renderer evidence required, no downgrade")
            if prepared is not None:
                from .lyric_workflow import apply_prepared_lyrics
                manifest=apply_prepared_lyrics(manifest,prepared)
                if not manifest.get("typography_audit",{}).get("enabled"):
                    raise ValueError("requested lyrics missing from actual rendered manifest")
                result["lyrics"]["status"]="rendered-verified-input"
            _write(job/"supported-pipeline.json",dict(pipeline=result["pipeline"],renderer_style=manifest["style"],
                runner="aive.local_preview_runner",visual_ai_used=False,manual_source_windows=False,
                fallback_allowed=False,finished_montage=False,manifest=manifest["manifest_path"],
                lyrics_mode=lyrics_mode,lyrics_enabled=prepared is not None))
            from .encounter_qa import verify_encounters
            from .attack_qa import measure_attack_alignment
            quality=verify_encounters(manifest,plan);_write(job/"quality-report.json",quality)
            attack=measure_attack_alignment(manifest,plan);_write(job/"attack-alignment.json",attack)
            calibration(attack)
            result.update(quality=quality,attack_alignment=attack,render_manifest=manifest["manifest_path"])
            if quality.get("status")=="fail" or quality.get("ok") is False:
                result.update(status="failed-qa",diagnostic_output=manifest["output"])
            else:result.update(status="rendered-local-candidate-preview",output=manifest["output"])
    except Exception as exc:
        result.update(status="failed",error=str(exc));(job/"error.txt").write_text(traceback.format_exc(),encoding="utf-8")
        if lyrics_mode != "off":result["lyrics"].update(status="blocked",reason=str(exc))
    result["elapsed_seconds"]=round(time.perf_counter()-started,3)
    result["limitations"]=["Existing template profile is uncalibrated; icon/audio matches are not confirmed kills.",
        "No visual AI or manual source-window selection; local numerical frame/template processing is used.",
        "1x source clocks; only selected main attacks assigned, burst attacks may remain unmatched.",
        "Fight/outcome, phrase suitability, exact musical sync and listening/aesthetic approval remain unverified."]
    _write(job/"job-report.json",result)
    (job/"REPORT.md").write_text("# Local Reflections diagnostic: "+result["status"]+"\n\n"+
        "\n".join("- "+s for s in result["limitations"])+"\n",encoding="utf-8")
    return result
