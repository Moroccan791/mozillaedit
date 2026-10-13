"""Uses Aside runtime Pillow, independently of project rendering environment."""
from pathlib import Path
import json
from PIL import Image, ImageDraw
root = Path(__file__).resolve().parent
indices = [54, 227, 239, 240, 245, 294, 444, 462, 478, 479]
w,h=320,180
sheet=Image.new("RGB",(w*5,4*(h+28)+48),"#101418")
draw=ImageDraw.Draw(sheet)
draw.text((8,8),"VISUAL ENGINEERING ONLY. Clean top pair / authored bottom pair. Musical sync and complete-fight selection UNVERIFIED.",fill="white")
for n,index in enumerate(indices):
    for group,label in enumerate(("clean","authored")):
        image=Image.open(root/"frames"/f"{label}-{index}.ppm")
        x,y=(n%5)*w,48+(group*2+n//5)*(h+28)
        sheet.paste(image,(x,y))
        draw.text((x+6,y+h+6),f"{label.upper()} frame {index} / {index/60:.3f}s",fill="white")
sheet.save(root/"visual-comparison.jpg",quality=92)
print(root/"visual-comparison.jpg")
