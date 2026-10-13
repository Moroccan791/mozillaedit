from pathlib import Path
import json,subprocess
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent
plan=json.loads((root/'cached-timeline.json').read_text())
video=root/'cached-proof-renders'/'encounters-v0001'/'encounters.mp4'
width,height=320,180
sheet=Image.new('RGB',(4*width,len(plan['timeline'])*(height+26)+45),'#101418');draw=ImageDraw.Draw(sheet)
draw.text((8,8),'AUTOMATIC CANDIDATE PREVIEW ONLY: source/event identity, outcomes and musical sync UNVERIFIED.',fill='white')
for i,row in enumerate(plan['timeline']):
    anchor=row['candidate_events'][0]['output_audio_event']
    times=[max(row['output_start'],anchor-.2),anchor,anchor+.15,row['output_end']-.025]
    for j,t in enumerate(times):
        raw=subprocess.run(['ffmpeg','-hide_banner','-v','error','-nostdin','-ss',str(t),'-i',str(video),'-frames:v','1','-vf',f'scale={width}:{height}','-pix_fmt','rgb24','-f','rawvideo','pipe:1'],capture_output=True,check=True,timeout=60).stdout
        sheet.paste(Image.frombytes('RGB',(width,height),raw),(j*width,45+i*(height+26)))
        draw.text((j*width+5,45+i*(height+26)+height+5),f'clip{i} t{t:.3f}s {plan["authored_design"]["shots"][i]["role"]}',fill='white')
sheet.save(root/'automatic-candidate-sheet.jpg',quality=94)
print(root/'automatic-candidate-sheet.jpg')
