"""Versioned local job runner. Conservative selection, not unattended-ready.

Song + footage folder + reviewed events (or explicit calibrated POV profile).
Never treats transients or uncalibrated icon observations as confirmed kills.
A sparse/empty plan is reported honestly, not filled with repeated footage.
"""
from __future__ import annotations
from dataclasses import dataclass, asdict
import hashlib
import json
import math
import time
import traceback
from pathlib import Path
from .event_io import load_confirmed_events

VIDEO_EXTENSIONS={'.mp4','.mov','.mkv','.avi','.webm','.m4v'}

@dataclass(frozen=True)
class JobConfig:
    song: str
    clip_folder: str
    output_root: str
    event_files: tuple[str,...]=()
    pov_profile: str|None=None
    duration: float=30.
    music_start: float=0.
    style: str='clean'
    encoder: str='libx264'
    fallback_encoder: str|None=None
    game_gain_db: float=-8.
    music_gain_db: float=-7.
    phrase_aware: bool=True
    plan_only: bool=False
    max_clips: int=24
    closure_review: str|None=None

    def validate(self):
        for name in ('song','clip_folder','output_root'):
            value=getattr(self,name)
            if not isinstance(value,str) or not value.strip():raise ValueError(f'{name} is required')
        if not Path(self.song).is_file():raise ValueError('song does not exist')
        if not Path(self.clip_folder).is_dir():raise ValueError('clip_folder does not exist')
        for name in ('duration','music_start','game_gain_db','music_gain_db'):
            value=getattr(self,name)
            if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value):raise ValueError(f'{name} must be finite')
        if not 0<self.duration<=120 or self.music_start<0:raise ValueError('invalid requested excerpt')
        if not -60<=self.game_gain_db<=12 or not -60<=self.music_gain_db<=12:raise ValueError('gains outside bounds')
        if self.style not in ('clean','restrained-impact'):raise ValueError('unsupported style')
        if self.encoder not in ('libx264','h264_qsv'):raise ValueError('unsupported encoder')
        if self.fallback_encoder is not None and not(self.encoder=='h264_qsv' and self.fallback_encoder=='libx264'):raise ValueError('invalid explicit fallback')
        if type(self.max_clips) is not int or not 1<=self.max_clips<=100:raise ValueError('max_clips outside bounds')
        if type(self.plan_only) is not bool or type(self.phrase_aware) is not bool:raise ValueError('flags must be boolean')
        if self.event_files and self.pov_profile:raise ValueError('choose reviewed event files OR a POV profile, not both')
        if not self.event_files and not self.pov_profile:raise ValueError('reviewed events or an explicit POV profile required; audio peaks are not kills')
        if self.closure_review is not None:
            if not isinstance(self.closure_review,str) or not Path(self.closure_review).is_file():raise ValueError('reviewed closure sidecar missing')
            if not self.event_files:raise ValueError('reviewed closure requires explicit confirmed event files, not automatic POV events')
            if not self.phrase_aware:raise ValueError('reviewed closure requires phrase-aware planning')
        for file in self.event_files:
            if not Path(file).is_file():raise ValueError(f'event file missing: {file}')
        if self.pov_profile and not Path(self.pov_profile).is_file():raise ValueError('POV profile missing')


def _write(path,data):
    with Path(path).open('x',encoding='utf-8') as stream:json.dump(data,stream,indent=2,allow_nan=False)


def _job_dir(root):
    root=Path(root).resolve();root.mkdir(parents=True,exist_ok=True)
    for i in range(1,100000):
        job=root/f'job-v{i:04d}'
        try:job.mkdir();return job
        except FileExistsError:pass
    raise FileExistsError('no versioned job name available')


def _hash(path):
    h=hashlib.sha256()
    with Path(path).open('rb') as stream:
        for data in iter(lambda:stream.read(1024*1024),b''):h.update(data)
    return h.hexdigest()


def inventory_clips(folder,max_clips=24):
    # Only immediate footage files: no hidden recursive dependency or profile walk.
    clips=sorted((p.resolve() for p in Path(folder).iterdir() if p.is_file() and p.suffix.lower() in VIDEO_EXTENSIONS),key=lambda p:str(p).lower())
    if not clips:raise ValueError('no supported videos in clip folder')
    if len(clips)>max_clips:raise ValueError(f'{len(clips)} sources exceed max_clips={max_clips}; narrow the folder explicitly')
    return clips


def _reviewed_closure_inputs(config, clips):
    if config.closure_review is None:
        return None, {}, {}, None, None
    from .closure_qa import validate_reviewed_closure
    from .ffprobe import probe
    from .gameplay_gate import capture_source_identity
    sidecar = Path(config.closure_review).resolve()
    payload = sidecar.read_bytes()
    if len(payload) > 16*1024*1024:
        raise ValueError('reviewed closure sidecar exceeds 16 MiB')
    closure_file_sha = hashlib.sha256(payload).hexdigest()
    review = validate_reviewed_closure(json.loads(payload.decode('utf-8-sig')))
    allowed = {str(p.resolve()): p.resolve() for p in clips}
    source_paths = {}
    for source in review['sources']:
        sid = source['source']
        if sid != str(Path(sid).resolve()) or sid not in allowed:
            raise ValueError('reviewed closure source must exactly match a resolved clip path')
        source_paths[sid] = allowed[sid]
    sizes = [p.stat().st_size for p in source_paths.values()]
    if any(size > 2*1024**3 for size in sizes) or sum(sizes) > 8*1024**3:
        raise ValueError('reviewed closure source identity budget exceeded')
    source_hashes, source_durations = {}, {}
    for source in review['sources']:
        sid = source['source']
        identity = capture_source_identity(source_paths[sid], max_source_bytes=2*1024**3)
        if identity['content_sha256'] != source['source_file_sha256']:
            raise ValueError(f'reviewed closure source SHA256 mismatch: {sid}')
        duration = float(probe(allowed[sid]).duration)
        if abs(duration-source['duration']) > .01:
            raise ValueError(f'reviewed closure source duration mismatch: {sid}')
        source_hashes[sid] = identity['content_sha256']
        source_durations[sid] = duration
    song_identity = capture_source_identity(config.song, max_source_bytes=2*1024**3)
    music_duration = float(probe(config.song).duration)
    if song_identity['content_sha256'] != review['music']['song_sha256']:
        raise ValueError('reviewed closure music SHA256 mismatch')
    if abs(music_duration-review['music']['duration']) > .01:
        raise ValueError('reviewed closure music duration mismatch')
    return review, source_hashes, source_durations, song_identity['content_sha256'], closure_file_sha


def _bind_reviewed_closure_events(events, review, source_durations):
    """Attach reviewed fight bounds only to already-confirmed, in-bound events."""
    fights = {}
    for fight in review['fights']:
        fights.setdefault(fight['source'], []).append(fight)
    eligible, dropped = [], {'unconfirmed': 0, 'unmatched': 0, 'unresolved_or_unknown': 0}
    for raw in events:
        if raw.get('confirmed') is not True:
            dropped['unconfirmed'] += 1
            continue
        source = raw['source']
        if source not in source_durations:
            dropped['unmatched'] += 1
            continue
        if abs(float(raw['source_duration'])-source_durations[source]) > .01:
            raise ValueError(f'confirmed event source duration mismatches reviewed source: {source}')
        audio, visual = float(raw['source_audio_event']), float(raw['source_visual_event'])
        matches = [fight for fight in fights.get(source, [])
            if fight['context']['start'] <= min(audio,visual)
            and max(audio,visual) <= fight['context']['end']]
        if len(matches) != 1:
            dropped['unmatched'] += 1
            continue
        fight = matches[0]
        if fight['outcome']['result'] != 'resolved':
            dropped['unresolved_or_unknown'] += 1
            continue
        start, end = fight['context']['start'], fight['context']['end']
        if ('encounter_start' in raw and abs(float(raw['encounter_start'])-start) > 1e-6
                or 'encounter_end' in raw and abs(float(raw['encounter_end'])-end) > 1e-6):
            raise ValueError('confirmed event context contradicts reviewed fight bounds')
        event = dict(raw, encounter_start=start, encounter_end=end,
                     reviewed_fight_id=fight['id'], reviewed_fight_outcome='resolved')
        event.setdefault('context_review', f"reviewed-closure:{fight['id']}")
        eligible.append(event)
    return eligible, dict(eligible_events=len(eligible), dropped=dropped,
                          reviewed_fights=len(review['fights']),
                          accepted_phrase_ends=sum(p['decision']=='phrase_end' for p in review['phrases']))


def _events(config,clips,job):
    if config.event_files:
        events,summary=load_confirmed_events(list(config.event_files))
        allowed={str(p) for p in clips}
        if any(e['source'] not in allowed for e in events):raise ValueError('event source lies outside the supplied clip folder')
        return events,dict(summary,mode='reviewed-event-files',automatic_selection=False)
    from . import povkills,shots
    from .ffprobe import probe
    cfg=povkills.load_profile(config.pov_profile)
    # Uncalibrated scans may be useful but should not spend the entire folder
    # run trying to produce a result that cannot enter planning.
    if not cfg['calibrated_profile']:
        return [],{'mode':'pov-profile','automatic_selection':False,'blocked_reason':'Profile remains uncalibrated; no observations can be promoted.'}
    # Guard against applying a one-source profile to arbitrary files.
    calibrated={str(Path(r['source']).resolve()) for r in cfg['calibrated_sources'] if isinstance(r.get('source'),str)}
    if not calibrated or any(str(p) not in calibrated for p in clips):
        raise ValueError('POV profile needs source-specific calibration metadata for every clip; no cross-layout assumption')
    events=[];observed=0
    for i,clip in enumerate(clips):
        audio=shots.detect(str(clip),min_gap=.10)
        observations=povkills.scan_cached(clip,cfg,audio)
        duration=probe(clip).duration
        for e in observations:e['source_duration']=duration
        observed+=len(observations)
        _write(job/f'events-{i:03d}.json',{'schema_version':'povkills/v1','source':str(clip),'events':observations})
        events.extend(e for e in observations if e['confirmed'] is True and e['source_audio_event'] is not None)
    return events,{'mode':'pov-profile','automatic_selection':True,'observations':observed,'eligible':len(events),'scope':'Source-specific profile; not general detector certification'}


def run_job(config: JobConfig) -> dict:
    config.validate()
    clips=inventory_clips(config.clip_folder,config.max_clips)
    job=_job_dir(config.output_root)
    _write(job/'config.json',asdict(config))
    started=time.perf_counter();stages={}
    result={'schema_version':'daily-job/v1','job_dir':str(job),'status':'running',
            'output':None,'style':config.style,'stages':stages,
            'limitations':['Not unattended-ready. Automatic selection is limited to explicitly calibrated sources.',
                           'Numerical QA does not certify fight completeness, listening taste or cinematic quality.',
                           'Lyrics stay disabled unless a separately verified lyric track is explicitly supplied to the typography tool.']}
    try:
        closure_review, source_hashes, source_durations, song_sha, closure_file_sha = _reviewed_closure_inputs(config, clips)
        song_sha = song_sha or _hash(config.song)
        clip_manifest=[]
        for p in clips:
            record={'source':str(p),'size':p.stat().st_size,'mtime_ns':p.stat().st_mtime_ns}
            if str(p) in source_hashes:record['content_sha256']=source_hashes[str(p)]
            clip_manifest.append(record)
        input_manifest={'song':str(Path(config.song).resolve()),'song_sha256':song_sha,
            'clips':clip_manifest,
            'event_files':[{'path':str(Path(p).resolve()),'sha256':_hash(p)} for p in config.event_files]}
        if closure_review is not None:
            input_manifest['closure_review']={'path':str(Path(config.closure_review).resolve()),'sha256':closure_file_sha}
            _write(job/'reviewed-closure.json',closure_review)
            result['limitations'].append('Reviewed closure is a caller-supplied engineering audit, not authenticated reviewer identity or perceptual approval.')
        _write(job/'input-manifest.json',input_manifest)
        t=time.perf_counter();events,selection=_events(config,clips,job);stages['selection_seconds']=time.perf_counter()-t
        result['selection']=selection
        _write(job/'confirmed-events.json',{'schema_version':'povkills/v1','events':events})
        closure_event_gate=None
        if closure_review is not None:
            events,closure_event_gate=_bind_reviewed_closure_events(events,closure_review,source_durations)
            selection['closure_review_gate']=closure_event_gate
            _write(job/'closure-eligible-events.json',{'schema_version':'reviewed-closure-events/v1','events':events,'selection':closure_event_gate})
        if not events:
            result['status']='blocked';result['blocked_reason']=('No confirmed event is bound to a reviewed resolved fight; no event was created or promoted.' if closure_review is not None else selection.get('blocked_reason','No eligible confirmed events. Add reviewed labels or calibrate a POV profile.'))
        else:
            from . import beats,music,encounters
            t=time.perf_counter();beat=beats.detect_cached(config.song);profile=music.analyze_cached(config.song)
            stages['music_analysis_seconds']=time.perf_counter()-t
            _write(job/'music-beats.json',beat.to_dict());_write(job/'music-profile.json',profile.to_dict())
            planner_args=dict(duration=config.duration,music_start=config.music_start,phrase_aware=config.phrase_aware)
            if closure_review is not None:
                planner_args['reviewed_phrase_ends']=[dict(id=p['id'],end=p['end'],end_interval=p['end_interval'])
                    for p in closure_review['phrases'] if p['decision']=='phrase_end']
                planner_args['require_reviewed_phrase_end']=True
            t=time.perf_counter();plan=encounters.plan_encounters(events,beat,profile,**planner_args)
            plan['music']=str(Path(config.song).resolve());plan['selection_summary']=selection
            if closure_review is not None:
                plan['reviewed_closure']=dict(schema_version='reviewed-closure/v1',file_sha256=closure_file_sha,
                    bound_fight_ids=sorted({e['reviewed_fight_id'] for e in events}),
                    reviewed_phrase_end_ids=[p['id'] for p in closure_review['phrases'] if p['decision']=='phrase_end'])
                from .closure_qa import audit_closure
                closure=audit_closure(plan,reviewed_closure=closure_review,source_sha256=source_hashes,song_sha256=song_sha)
                _write(job/'closure-report.json',closure)
                result['closure_quality']=closure
                required={'timeline','evidence_binding','fight_bounds','join_outcomes','ending_fight','phrase_end','closure_gap'}
                failed=[c['name'] for c in closure['checks'] if c['name'] in required and c['status']!='pass']
                result['closure_review_gate']={'status':'pass' if not failed else 'blocked',
                    'required_checks':sorted(required),'failed_or_uncertain_checks':failed,
                    'perceptual_approval':False}
            else:
                failed=[]
            stages['planning_seconds']=time.perf_counter()-t
            _write(job/'timeline.json',plan);result['planned_duration']=plan['duration'];result['warnings']=list(plan['warnings'])
            if not plan['timeline']:
                result['status']='blocked';result['blocked_reason']='No complete encounter fits the requested musical excerpt; no filler or reuse was rendered.'
            elif failed:
                result['status']='blocked';result['blocked_reason']='Reviewed closure checks did not all pass; no render was made: '+', '.join(failed)
            elif config.plan_only:result['status']='planned'
            else:
                if closure_review is not None:
                    from .gameplay_gate import capture_source_identity
                    for sid, expected in source_hashes.items():
                        if capture_source_identity(sid, max_source_bytes=2*1024**3)['content_sha256'] != expected:
                            raise ValueError(f'reviewed closure source changed after planning: {sid}')
                    if capture_source_identity(config.song, max_source_bytes=2*1024**3)['content_sha256'] != song_sha:
                        raise ValueError('reviewed closure music changed after planning')
                from .encounter_render import RenderConfig,render_encounters
                t=time.perf_counter();manifest=render_encounters(plan,config.song,job/'renders',config=RenderConfig(style=config.style,encoder=config.encoder,fallback_encoder=config.fallback_encoder,game_gain_db=config.game_gain_db,music_gain_db=config.music_gain_db))
                stages['render_seconds']=time.perf_counter()-t
                result['output']=manifest['output'];result['render_manifest']=manifest['manifest_path']
                from .encounter_qa import verify_encounters
                t=time.perf_counter();quality=verify_encounters(manifest,plan)
                stages['qa_seconds']=time.perf_counter()-t
                _write(job/'quality-report.json',quality)
                result['quality']=quality
                result['status']=('failed-qa' if quality.get('status')=='fail' or quality.get('ok') is False
                                  else 'rendered-with-warnings' if quality.get('status')=='warn' or result.get('warnings') else 'rendered')
    except Exception as exc:
        result['status']='failed';result['error']=str(exc)
        (job/'error.txt').write_text(traceback.format_exc(),encoding='utf-8')
    result['elapsed_seconds']=round(time.perf_counter()-started,3)
    result['benchmarks']={'elapsed_seconds':result['elapsed_seconds'],'stage_seconds':stages,
                          'peak_memory':'not measured by this in-process runner; do not infer laptop capacity from one job'}
    _write(job/'job-report.json',result)
    lines=[f"# Local editing job: {result['status']}",f"Job: {job}",f"Style: {config.style}",f"Elapsed: {result['elapsed_seconds']:.3f}s"]
    if result['output']:lines.append(f"Output: {result['output']}")
    for key in ('blocked_reason','error'):
        if key in result:lines.append(f"{key}: {result[key]}")
    if 'quality' in result:
        lines += ['', '## Quality checks', f"Overall: {result['quality'].get('status', 'unknown')}"]
        issues = result['quality'].get('issues', [])
        lines += [f"- {issue.get('status', 'unknown')}: {issue.get('component', 'check')}: {issue.get('detail', '')}" for issue in issues]
        if not issues:lines.append('No reported QA issues. Numerical checks do not certify taste.')
    if 'closure_quality' in result:
        lines += ['', '## Reviewed closure engineering audit',
                  f"Audit: {result['closure_quality']['status']}",
                  f"Render gate: {result.get('closure_review_gate', {}).get('status', 'unknown')}",
                  'Perceptual approval: false; listening and aesthetic approval remain separate.']
        for check in result['closure_quality']['checks']:
            if check['status'] != 'pass':
                lines.append(f"- {check['status']}: {check['name']}: {check['reason']}")
    if result.get('warnings'):
        lines += ['', '## Planning warnings'] + ['- '+str(s) for s in result['warnings']]
    lines+=['','## Limits']+['- '+s for s in result['limitations']]
    (job/'REPORT.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    return result
