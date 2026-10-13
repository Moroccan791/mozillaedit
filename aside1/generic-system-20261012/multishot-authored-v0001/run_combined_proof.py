"""Synthetic plumbing proof only. No real reviewed events or semantic approval."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import time

sys.path.insert(0, r'E:\ai-video-editor')
sys.path.insert(0, r'E:\ai-video-editor\tests')
from aive.encounter_render import RenderConfig, render_encounters
from test_multishot_authored import fixture

ROOT=Path(__file__).resolve().parent


def ff(args):
    result=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-v','error']+args,
                          capture_output=True,timeout=120)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors='replace'))
    return result.stdout


def pcm(path):
    return ff(['-i',str(path),'-map','0:a:0','-c:a','pcm_s16le','-f','s16le','pipe:1'])


def main():
    media=ROOT/'synthetic-media'
    media.mkdir()
    source,music=media/'source.mkv',media/'music.wav'
    ff(['-f','lavfi','-i','testsrc2=size=128x72:rate=30:duration=11',
        '-f','lavfi','-i','sine=frequency=2100:sample_rate=48000:duration=11',
        '-c:v','ffv1','-c:a','pcm_s16le',str(source)])
    ff(['-f','lavfi','-i','sine=frequency=430:sample_rate=48000:duration=12',
        '-c:a','pcm_s16le',str(music)])
    original=hashlib.sha256(source.read_bytes()).hexdigest()
    # Different nonoverlapping ranges of the same synthetic source require
    # shifting each map source clock; fixture uses separate clips for simplicity.
    sources=[]
    for index in range(4):
        path=media/f'source-{index}.mkv'
        path.write_bytes(source.read_bytes())
        sources.append(path)
    plan,maps=fixture(sources=sources,digest=original,version='v2')
    baseline=dict(plan);baseline.pop('authored_design')
    results=[]
    for style,data in [('multishot',baseline),('multishot-authored',plan)]:
        started=time.perf_counter()
        manifest=render_encounters(data,music,ROOT/style,
            config=RenderConfig(width=128,height=72,fps=30,style=style,preset='ultrafast'),
            multishot_maps=maps)
        manifest['proof_render_seconds']=time.perf_counter()-started
        ff(['-xerror','-i',manifest['output'],'-f','null','-'])
        results.append(manifest)
    a,b=results
    game_same=pcm(a['game_stem'])==pcm(b['game_stem'])
    music_same=pcm(a['music_stem'])==pcm(b['music_stem'])
    assert game_same and music_same
    assert (a['frame_count'],a['sample_count'],a['music_start_sample'])==(b['frame_count'],b['sample_count'],b['music_start_sample'])
    raw=[]
    for manifest in results:
        raw.append(ff(['-i',manifest['output'],'-an','-pix_fmt','rgb24','-f','rawvideo','pipe:1']))
    assert raw[0]!=raw[1]
    assert len(raw[0])==len(raw[1])==300*128*72*3
    assert hashlib.sha256(source.read_bytes()).hexdigest()==original
    summary={'status':'synthetic_combined_api_plumbing_not_real_semantic_or_aesthetic_acceptance',
        'frames':b['frame_count'],'samples':b['sample_count'],'duration':b['audio_duration'],
        'music_start_sample':b['music_start_sample'],'game_stem_pcm_identical':game_same,
        'music_stem_pcm_identical':music_same,'full_decode_pass':True,'video_changed':True,
        'original_unchanged':True,'render_seconds':[x['proof_render_seconds'] for x in results],
        'manifests':[x['manifest_path'] for x in results],
        'candidate_confirmed':[r['candidate_events'][0]['confirmed'] for r in plan['timeline']],
        'limitations':['Synthetic fixture attestation only','No real reviewed maps invented',
            'Game gap atempo remains approximate','No lyric/front-door/closure integration yet',
            'No gameplay/music/lyric/perceptual approval']}
    with (ROOT/'proof-summary.json').open('x',encoding='utf8') as handle:
        json.dump(summary,handle,indent=2)
    print(json.dumps(summary,indent=2))


if __name__=='__main__':main()
