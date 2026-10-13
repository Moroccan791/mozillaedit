"""Real FFmpeg typography diagnostic. Synthetic words are NOT song lyrics."""
import json
import math
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import wave
sys.path.insert(0, r'E:\ai-video-editor')
from aive.lyric_track import load_lyric_track, audio_sha256, ass_fonts_directory
from aive.lyric_design import compile_lyric_design

root = Path(__file__).resolve().parent
music = root / 'synthetic-selected-audio.wav'
# Non-vocal tone is deliberately diagnostic: there is no sung-word claim.
with wave.open(str(music), 'wb') as wav:
    wav.setparams((1, 2, 48000, 0, 'NONE', 'not compressed'))
    wav.writeframes(b''.join(struct.pack('<h', round(1800*math.sin(2*math.pi*220*i/48000))) for i in range(48000*7)))
track_doc = {'schema': 'lyric-track/v1', 'audio_sha256': audio_sha256(music),
             'provenance': {'alignment_verified': True, 'method': 'Synthetic diagnostic timing assertion. These words are NOT sung and NOT actual song lyrics.'},
             'words': [{'text': 'SHAPE', 'start': 1.2, 'end': 2.6},
                       {'text': 'LIGHT', 'start': 2.9, 'end': 4.4},
                       {'text': 'quiet', 'start': 4.7, 'end': 5.3},
                       {'text': 'form', 'start': 5.4, 'end': 6.4}]}
(root/'synthetic-track.json').write_text(json.dumps(track_doc, indent=2), encoding='utf-8')
track = load_lyric_track(track_doc, music)
def moment(mid, indices, role, size, box, palette='ice', echo=(0,0), opacity=.7):
    return {'id':mid, 'word_indices':indices, 'role':role, 'font_family':'Oswald' if role=='quiet_italic' else 'Bebas Neue',
            'palette':palette, 'box':box, 'size':size, 'opacity':opacity,
            'animation':{'entrance_ms':160, 'exit_ms':140, 'from_scale':1.12, 'echo_offset':list(echo), 'glow':.002 if role=='quiet_italic' else .006}}
doc = {'schema':'lyric-design/v1', 'enabled':True,
       'source':{'music_source':str(music), 'audio_sha256':track.audio_sha256},
       'excerpt':{'music_start_sample':48000, 'sample_rate':48000, 'sample_count':288000, 'output_start':0},
       'canvas':{'width':1280, 'height':720, 'mode':'diagnostic'},
       'moments':[moment('shape',[0],'giant_word',.40,[.03,.04,.94,.84]),
                  moment('light',[1],'accent_echo',.33,[.07,.04,.90,.84], 'violet',(.018,.012),.86),
                  moment('quiet',[2,3],'quiet_italic',.046,[.10,.65,.80,.26],'paper',opacity=.9)],
       'visual_impacts':[], 'protected_zones':[], 'allow_impact_collision':False, 'allow_protected_overlap':False}
result = compile_lyric_design(track,doc)
(root/'lyric-design.json').write_text(json.dumps(doc,indent=2), encoding='utf-8')
(root/'design-audit.json').write_text(json.dumps(result.audit,indent=2), encoding='utf-8')
(root/'design.ass').write_text(result.ass,encoding='utf-8')
with ass_fonts_directory() as staged:
    dest = root/'fonts'
    dest.mkdir(exist_ok=True)
    licenses = root/'licenses'
    licenses.mkdir(exist_ok=True)
    for old in dest.glob('*.txt'):
        old.unlink()
    for file in staged.iterdir():
        shutil.copyfile(file,(licenses if file.suffix == '.txt' else dest)/file.name)
# All graph paths relative to cwd; no shell or ambiguous Windows drive escapes.
background = 'color=c=0x102534:s=1280x720:r=30:d=6,drawbox=x=0:y=360:w=1280:h=360:color=0x23364D:t=fill,drawbox=x=70:y=50:w=1140:h=620:color=0x547082@0.25:t=2'
cmd = ['ffmpeg','-hide_banner','-nostdin','-y','-f','lavfi','-i',background,
       '-i',music.name,'-filter_complex','[0:v]ass=filename=design.ass:fontsdir=fonts[v];[1:a]atrim=start_sample=48000:end_sample=336000,asetpts=PTS-STARTPTS[a]',
       '-map','[v]','-map','[a]','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-movflags','+faststart','typography-demo.mp4']
(root/'ffmpeg-command.json').write_text(json.dumps(cmd,indent=2),encoding='utf-8')
run = subprocess.run(cmd,cwd=root,capture_output=True,text=True)
(root/'ffmpeg.log').write_text(run.stdout+run.stderr,encoding='utf-8')
run.check_returncode()
for t,name in ((.8,'giant-word.png'),(2.6,'accent-echo.png'),(4.4,'quiet-italic.png')):
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(t),'-i','typography-demo.mp4','-frames:v','1',name],cwd=root,check=True)
probe = subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json','typography-demo.mp4'],cwd=root,capture_output=True,text=True,check=True)
(root/'ffprobe.json').write_text(probe.stdout,encoding='utf-8')
print('Rendered 6 second synthetic diagnostic; selected music excerpt sample 48000:336000; PNGs ready.')
