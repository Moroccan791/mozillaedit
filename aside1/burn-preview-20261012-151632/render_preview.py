"""Fast bounded chunk render using existing editor grade/filter primitives."""
import json,subprocess,sys,time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0,'E:/ai-video-editor')
from aive.graph import _clip
from aive.project import Segment
from aive.grade import get_look
from aive.qa import verify
root=Path(__file__).parent
t=json.loads((root/'timeline.json').read_text());chunks=root/'chunks';chunks.mkdir(exist_ok=True)
def render_event(e):
 out=chunks/f"chunk-{e['id']:02d}.mkv";n=round(e['duration']*t['fps']);length=n/t['fps']
 # Existing renderer 1x phase-preserving trim, no timing-changing ramps.
 seg=Segment(start=0,end=length,grade='cold-noir' if e['id']<3 else ('vibrant-sports' if e['id'] in (3,5,9) else 'broadcast-hd'))
 fg=_clip(seg,0,t['fps'],1280,720)
 local=e['output_event']-e['output_start']
 pulse=(f";[v0]eq=brightness=0.07:enable='between(t,{local:.6f},{local+.05:.6f})'[vfinal]" if e['id']>=3 else ';[v0]null[vfinal]')
 fg+=pulse+f";[0:a]atrim=duration={length:.6f},asetpts=PTS-STARTPTS[a]"
 args=['ffmpeg','-hide_banner','-v','error','-ss',str(e['source_start']),'-i',t['source'],'-t',f'{length:.6f}','-filter_complex',fg,'-map','[vfinal]','-map','[a]','-c:v','h264_qsv','-global_quality','21','-pix_fmt','yuv420p','-c:a','pcm_s16le','-ar','48000','-ac','2',str(out)]
 start=time.monotonic();p=subprocess.run(args,capture_output=True)
 if p.returncode:
  print('Hardware encode fallback',e['id'],p.stderr.decode(errors='replace')[-200:],flush=True)
  args[args.index('h264_qsv')]='libx264';i=args.index('-global_quality');args[i:i+2]=['-preset','veryfast','-crf','21'];args.insert(1,'-y')
  p=subprocess.run(args,capture_output=True)
 if p.returncode:raise RuntimeError(p.stderr.decode(errors='replace'))
 (chunks/f"chunk-{e['id']:02d}-args.json").write_text(json.dumps(args,indent=2))
 print('Rendered chunk',e['id'],'seconds',round(time.monotonic()-start,1),flush=True)
 return out
start=time.monotonic()
with ThreadPoolExecutor(max_workers=2) as pool:files=list(pool.map(render_event,t['events']))
manifest=root/'chunks.ffconcat';manifest.write_text(''.join("file '%s'\n"%p.as_posix() for p in files))
# Mix original gameplay and continuous exact-song excerpt. Keep stems for QA.
game=root/'game-stem.wav'
subprocess.run(['ffmpeg','-hide_banner','-v','error','-f','concat','-safe','0','-i',str(manifest),'-vn','-c:a','pcm_s16le','-t','35',str(game)],check=True)
output=root/'Let-The-World-Burn-35s-preview.mp4'
fg=(f"[0:a]asetpts=PTS-STARTPTS[game];[1:a]atrim=start={t['music_start']:.6f}:duration=35,asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=-6dB[music];"
    '[game]asplit=2[shots][sc];[music][sc]sidechaincompress=threshold=0.15:ratio=2.5:attack=20:release=500[duck];'
    '[shots][duck]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=duration=35,asetpts=PTS-STARTPTS[a]')
args=['ffmpeg','-hide_banner','-v','error','-f','concat','-safe','0','-i',str(manifest),'-i',t['music'],'-filter_complex',fg,'-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t','35','-movflags','+faststart',str(output)]
p=subprocess.run(args,capture_output=True)
if p.returncode:raise RuntimeError(p.stderr.decode(errors='replace'))
(root/'render-args.json').write_text(json.dumps(args,indent=2))
rep=verify(str(output),want_audio=True)
(root/'qa.txt').write_text(rep.render())
print(rep.render(),flush=True)
print('OUTPUT',output,'elapsed',round(time.monotonic()-start,1),flush=True)
