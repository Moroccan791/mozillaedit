"""Bounded diagnostic stress driver, existing renderer only, no production edits."""
import os
for key in ('PYTHONHOME','PYTHONPATH','PIP_PREFIX','VIRTUAL_ENV'):
    os.environ.pop(key, None)
import sys, json, time, hashlib, subprocess, wave, threading, traceback
from pathlib import Path
from fractions import Fraction
from dataclasses import asdict
ROOT=Path(r'E:\aside\continuation-20261012-account5\stress-tests')
PROJECT=Path(r'E:\ai-video-editor')
sys.path.insert(0,str(PROJECT))
from aive.encounter_render import RenderConfig, render_encounters, validate_plan

def write(p,obj):
    with p.open('x',encoding='utf-8') as f: json.dump(obj,f,indent=2)
def fingerprint(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for block in iter(lambda:f.read(4*1024*1024),b''): h.update(block)
    s=p.stat()
    return {'path':str(p),'bytes':s.st_size,'mtime_ns':s.st_mtime_ns,'sha256':h.hexdigest()}
def run(args,label,folder,timeout=300):
    write(folder/(label+'.args.json'),args)
    t=time.monotonic()
    with (folder/(label+'.stdout.log')).open('xb') as out, (folder/(label+'.stderr.log')).open('xb') as err:
        p=subprocess.run(args,stdout=out,stderr=err,timeout=timeout,check=False)
    status={'returncode':p.returncode,'elapsed_seconds':time.monotonic()-t}
    write(folder/(label+'.status.json'),status)
    if p.returncode: raise RuntimeError(label+' failed: '+str(p.returncode))
    return status

def main():
    ROOT.mkdir(parents=True,exist_ok=True)
    for n in range(1,10000):
        folder=ROOT/('stress-v%04d'%n)
        try: folder.mkdir(); break
        except FileExistsError: pass
    started=time.monotonic()
    report={'schema_version':'render-stability/v1','scope':'Diagnostic clean hard-cut render stability only. No event semantics or musical alignment claims.', 'run_dir':str(folder),'python':sys.executable,'environment_cleared':['PYTHONHOME','PYTHONPATH','PIP_PREFIX','VIRTUAL_ENV'],'runs':[], 'limitations':['Not a full laptop benchmark. Memory, when available, is sampled process RSS only, not exact lifetime peak or total system memory.','60 seconds is a continuous song excerpt, not whole-song unless the source itself is 60 seconds.','No confirmed kills, no authored composition or musical alignment; events are empty. Source-authored effects may remain.']}
    timeline_path=Path(r'E:\aside\automation-20261012\jobs\job-v0004\timeline.json')
    job_path=timeline_path.with_name('job-report.json')
    original=json.loads(timeline_path.read_text(encoding='utf-8'))
    old_report=json.loads(job_path.read_text(encoding='utf-8'))
    proof=list(dict.fromkeys(Path(r['source']) for r in original['timeline']))
    music=Path(original['music'])
    raw=Path(r'E:\raw clips val')
    candidates=[raw/p.name for p in proof]
    extra=raw/'YTDown.com_YouTube_Media_iufseng8xEs_Ranked-but-I-m-Overheating-Non-Stop_002_720p.mp4'
    if all(p.is_file() for p in candidates) and extra.is_file():
        sources=candidates+[extra]; report['source_scope']='3 actual raw files; first two basenames match the exact historical timeline proof inputs.'
    else:
        sources=proof; report['source_scope']='LIMITATION: raw source folder unavailable or expected raw files missing; using 2 exact existing proof inputs.'
        report['limitations'].append(report['source_scope'])
    tracked=list(dict.fromkeys(sources+proof+[music,timeline_path,job_path,PROJECT/'aive'/'encounter_render.py',PROJECT/'tests'/'test_encounter_render.py']))
    before=[fingerprint(p) for p in tracked]
    write(folder/'input-fingerprints-before.json',before)
    report['historical_job_status']=old_report['status']
    report['source_mapping']=[{'historical_proof':str(p),'actual_raw':str(raw/p.name)} for p in proof]
    config=RenderConfig(width=1280,height=720,fps=60,sample_rate=48000,style='clean',encoder='libx264',fallback_encoder=None,preset='veryfast',quality=21,max_duration=180.0,max_clip_duration=30.0,timeout=300.0)
    config.validate()
    report['config']=asdict(config)
    report['config_note']='Default engine max_duration is 120s. Explicit 180s is accepted by existing positive finite validation; actual test plans remain 30s and 60s. Every subprocess timeout <=300s.'
    write(folder/'config.json',asdict(config))
    metadata={}
    for i,p in enumerate(sources+[music]):
        label='input-probe-%02d'%i
        run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)],label,folder,60)
        metadata[str(p)]=json.loads((folder/(label+'.stdout.log')).read_text(encoding='utf-8'))
    md=min(float(s.get('duration',metadata[str(music)]['format']['duration'])) for s in metadata[str(music)]['streams'] if s['codec_type']=='audio')
    report['music_source']=str(music); report['music_source_duration_seconds']=md
    assert md>=70,'10..70 second continuous excerpt must fit actual music'
    # Six distinct source ranges for 30s; twelve distinct ranges for 60s.
    # Ranges differ between tests too, without source reuse across either output.
    memory=[]; stop=threading.Event()
    try:
        import psutil
        parent=psutil.Process()
        def monitor():
            while not stop.is_set():
                try:
                    children=[]
                    for child in parent.children(recursive=True):
                        try:
                            if child.name().lower().startswith('ffmpeg'): children.append({'pid':child.pid,'rss_bytes':child.memory_info().rss})
                        except (psutil.NoSuchProcess,psutil.AccessDenied): pass
                    memory.append({'elapsed_seconds':time.monotonic()-started,'parent_rss_bytes':parent.memory_info().rss,'ffmpeg':children})
                except (psutil.NoSuchProcess,psutil.AccessDenied): pass
                stop.wait(.2)
        thread=threading.Thread(target=monitor,daemon=True); thread.start()
        report['memory_method']='psutil 0.2s samples of this Python process RSS and currently live descendant ffmpeg process RSS; sampled maxima are lower bounds, not exact peaks; no system/laptop benchmark.'
    except ImportError:
        thread=None; report['memory_method']='Unavailable: psutil not installed. No memory benchmark claimed.'
    try:
        for duration in (30,60):
            count=duration//5
            rows=[]
            for i in range(count):
                source=sources[i%len(sources)]
                occurrence=i//len(sources)
                # Distinct spread-out source regions, no event-based selection.
                start=(15 if duration==30 else 125)+occurrence*55+(i%len(sources))*7
                out=i*5
                rows.append({'source':str(source),'source_start':float(start),'source_end':float(start+5),'output_start':float(out),'output_end':float(out+5),'music_start':float(10+out),'music_end':float(15+out),'speed':1.0,'events':[]})
            plan={'schema_version':'encounters/v1','mode':'render-stability-diagnostic','requested_duration':float(duration),'duration':float(duration),'music_start':10.0,'music_end':float(10+duration),'music_continuous':True,'gaps':[],'timeline':rows,'events':[],'rhythm_assignments':[],'warnings':['Diagnostic ranges only, not reviewed gameplay events or musical alignment.']}
            validate_plan(plan,config,{p:float(m['format']['duration']) for p,m in metadata.items() if p!=str(music)},md)
            write(folder/('plan-%ds.json'%duration),plan)
            t=time.monotonic()
            manifest=render_encounters(plan,music,folder/'renders',config=config)
            elapsed=time.monotonic()-t
            job=Path(manifest['job_dir']); output=manifest['output']
            run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',output],'independent-probe',job,60)
            probe=json.loads((job/'independent-probe.stdout.log').read_text(encoding='utf-8'))
            v=next(s for s in probe['streams'] if s['codec_type']=='video')
            a=next(s for s in probe['streams'] if s['codec_type']=='audio')
            assert int(v['nb_read_frames'])==duration*60
            assert int(v['nb_frames'])==duration*60
            assert v['r_frame_rate']==v['avg_frame_rate']=='60/1'
            assert (v['width'],v['height'],v['pix_fmt'])==(1280,720,'yuv420p')
            assert Fraction(v['duration_ts'])*Fraction(v['time_base'])==duration
            run(['ffprobe','-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp','-of','json',output],'all-frame-timestamps',job,120)
            frames=json.loads((job/'all-frame-timestamps.stdout.log').read_text(encoding='utf-8'))['frames']
            tb=Fraction(v['time_base'])
            ts=[int(f['best_effort_timestamp']) for f in frames]
            assert len(ts)==duration*60 and ts[0]==0
            assert all(Fraction(y-x)*tb==Fraction(1,60) for x,y in zip(ts,ts[1:]))
            decode=run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-xerror','-i',output,'-map','0:v:0','-map','0:a:0','-f','null','-'],'full-decode',job,300)
            stems=[]
            for path,expected in [(manifest['game_stem'],duration*48000),(manifest['music_stem'],duration*48000)]+[(c['game_audio'],c['sample_count']) for c in manifest['chunks']]:
                with wave.open(path,'rb') as w:
                    actual=(w.getnframes(),w.getframerate(),w.getnchannels(),w.getsampwidth())
                assert actual==(expected,48000,2,2)
                stems.append({'path':path,'expected_samples':expected,'actual_samples':actual[0],'sample_rate':48000,'channels':2,'sample_width_bytes':2})
            result={'duration_seconds':duration,'render_wall_seconds':elapsed,'output':output,'manifest':manifest['manifest_path'],'frame_count':len(ts),'cfr_all_frame_intervals_exact':True,'video_duration_exact_seconds':str(Fraction(v['duration_ts'])*tb),'container_duration_seconds':probe['format']['duration'],'audio_duration_seconds':a.get('duration'),'expected_sample_count':duration*48000,'retained_stems':stems,'full_decode':decode,'source_count':len(sources),'clip_count':count,'music_excerpt':[10,10+duration],'status':'pass'}
            write(job/'stress-verification.json',result)
            report['runs'].append(result)
            write(folder/('checkpoint-%ds.json'%duration),report)
            print(json.dumps({'completed':duration,'render_wall_seconds':elapsed,'output':output}),flush=True)
    except Exception as exc:
        report['error']=str(exc); report['traceback']=traceback.format_exc(); report['status']='failed'
    finally:
        stop.set()
        if thread: thread.join(2)
        write(folder/'memory-samples.json',memory)
        if memory:
            report['memory_sample_count']=len(memory)
            report['sampled_parent_max_rss_bytes']=max(x['parent_rss_bytes'] for x in memory)
            report['sampled_ffmpeg_max_single_rss_bytes']=max((c['rss_bytes'] for x in memory for c in x['ffmpeg']),default=0)
            report['max_observed_simultaneous_ffmpeg_processes']=max(len(x['ffmpeg']) for x in memory)
        after=[fingerprint(p) for p in tracked]
        write(folder/'input-fingerprints-after.json',after)
        report['original_inputs_untouched']=before==after
        report['total_wall_elapsed_seconds']=time.monotonic()-started
        report.setdefault('status','pass' if len(report['runs'])==2 and before==after else 'failed')
        write(folder/'run-report.json',report)
        lines=['# Render stability diagnostic stress report','',f"Status: {report['status']}",f"Source scope: {report['source_scope']}",f"Music source duration: {md} seconds. Tests use continuous excerpts 10..40 and 10..70 seconds, not a whole-song test.",f"Total wall elapsed: {report['total_wall_elapsed_seconds']:.3f}s",f"Original input SHA256, size and mtime unchanged: {report['original_inputs_untouched']}",'Serial libx264 encoders only; clean 1280x720 60fps, 1x, no events or musical alignment claims.','']
        for r in report['runs']:
            lines += [f"## {r['duration_seconds']} seconds: PASS",f"Render wall: {r['render_wall_seconds']:.3f}s; frames: {r['frame_count']}; exact CFR all timestamp intervals: true; PCM stem samples: {r['expected_sample_count']}; full video/audio decode exit 0.",f"Output: {r['output']}",f"Manifest: {r['manifest']}",'']
        lines += ['## Limitations']+['- '+x for x in report['limitations']]+['- '+report['memory_method'], '', 'Detailed verification, exact FFmpeg/FFprobe args, stdout/stderr/status, original fingerprints and memory samples are retained alongside this report.']
        if 'error' in report: lines += ['ERROR: '+report['error']]
        (folder/'run-report.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
        print(json.dumps({'report':str(folder/'run-report.json'),'status':report['status'],'elapsed':report['total_wall_elapsed_seconds']}),flush=True)
    return 0 if report['status']=='pass' else 1
if __name__=='__main__': raise SystemExit(main())
