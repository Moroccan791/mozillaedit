"""Local synthetic maroon lyric demo; not sung lyrics or approved edit."""
import json
from pathlib import Path
import subprocess
import sys
sys.path.insert(0,'E:/ai-video-editor')
from aive.lyric_track import load_lyric_track
from aive.lyric_design import compile_lyric_design,with_lyric_colors
root=Path(__file__).resolve().parent
old=root/'lyric-design-demo'
new=root/'custom-color-demo';new.mkdir(exist_ok=True)
track=load_lyric_track(old/'synthetic-track.json',old/'synthetic-selected-audio.wav')
design=json.loads((old/'lyric-design.json').read_text())
design=with_lyric_colors(design,'#800000',glow_color='#D44D65')
(new/'maroon-design.json').write_text(json.dumps(design,indent=2))
compiled=compile_lyric_design(track,design)
(new/'maroon.ass').write_text(compiled.ass,encoding='utf-8')
(new/'maroon-audit.json').write_text(json.dumps(compiled.audit,indent=2))
def escape(p):return p.resolve().as_posix().replace(':',r'\:')
args=['ffmpeg','-hide_banner','-v','error','-nostdin','-n','-f','lavfi','-i','color=c=0xE9DADD:s=1280x720:r=30:d=6','-i',str(old/'synthetic-selected-audio.wav'),'-vf',f"ass=filename='{escape(new/'maroon.ass')}':fontsdir='{escape(old/'fonts')}'",'-c:v','libx264','-preset','veryfast','-c:a','aac','-t','6',str(new/'maroon-demo.mp4')]
subprocess.run(args,check=True,timeout=60)
subprocess.run(['ffmpeg','-hide_banner','-v','error','-nostdin','-i',str(new/'maroon-demo.mp4'),'-ss','2.8','-frames:v','1','-update','1',str(new/'maroon-proof.png')],check=True,timeout=30)
print(new/'maroon-proof.png')
