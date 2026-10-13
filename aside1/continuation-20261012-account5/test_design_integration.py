"""Synthetic designed-lyric postprocess integration. NOT actual-song lyrics."""
from dataclasses import asdict
from fractions import Fraction
import json
from pathlib import Path
import subprocess
import sys
sys.path.insert(0,'E:/ai-video-editor')
from aive.encounter_render import RenderConfig
from aive.encounter_text import apply_verified_lyrics
from aive.lyric_track import audio_sha256

root=Path(__file__).resolve().parent/'lyric-design-integration'
root.mkdir(exist_ok=True)
demo=root.parent/'lyric-design-demo'
music=demo/'synthetic-selected-audio.wav'
track=demo/'synthetic-track.json'
original=root/'original.mp4'
if not original.exists():
    subprocess.run(['ffmpeg','-hide_banner','-v','error','-nostdin','-n','-f','lavfi','-i','color=c=0x122536:s=1280x720:r=30:d=6','-i',str(music),'-map','0:v','-map','1:a','-c:v','libx264','-preset','ultrafast','-c:a','aac','-t','6',str(original)],check=True,timeout=60)
config=RenderConfig(width=1280,height=720,fps=30,sample_rate=48000,encoder='libx264',preset='ultrafast')
manifest=dict(schema_version='encounter-render/v1',job_dir=str(root),output=str(original),music_source=str(music),config=asdict(config),frame_count=180,video_duration=6.,plan_duration=6.,music_start_sample=48000,chunks=[])
design=json.loads((demo/'lyric-design.json').read_text())
design['canvas']['mode']='gameplay'
# Explicit diagnostic authorization only; not an approved gameplay layout.
design['allow_protected_overlap']=True
design['visual_impacts']=[]
path=root/'design.json';path.write_text(json.dumps(design,indent=2))
before=audio_sha256(original)
# A known gameplay attack omitted by the design must fail before child creation.
try:
    apply_verified_lyrics(manifest,track,music,design_path=path,visual_impacts=[2.5])
    raise RuntimeError('Missing impact protection was accepted')
except ValueError as error:
    if 'omits known gameplay' not in str(error):raise
result=apply_verified_lyrics(manifest,track,music,design_path=path)
def pcm(path):
    return subprocess.run(['ffmpeg','-hide_banner','-v','error','-nostdin','-i',str(path),'-map','0:a:0','-f','s16le','-ac','2','-ar','48000','pipe:1'],capture_output=True,check=True,timeout=60).stdout
if pcm(original)!=pcm(result['output']):raise RuntimeError('Audio changed')
if audio_sha256(original)!=before:raise RuntimeError('Original changed')
report=dict(status='pass',synthetic=True,actual_song_lyrics=False,output=result['output'],manifest=result['manifest_path'],audio_pcm_identical=True,original_unchanged=True,frame_count=result['typography_audit']['frame_count'],roles=result['typography_audit']['roles'],missing_gameplay_protection_rejected=True)
(root/'RESULTS.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
