import subprocess, glob
SRC = glob.glob(r"E:\raw clips val\*002_720p.mp4")[0]
base = "trim=start=100:end=101,setpts=PTS-STARTPTS,fps=60,setsar=1,format=yuv420p"
tests = {
 "zoompan_on": "zoompan=z='if(lte(on,3),1.06-0.02*on,1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=60",
 "zoompan_default": "zoompan=z='1+0.06*max(0,1-on/3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=60",
}
for name, ch in tests.items():
    cmd = ["ffmpeg","-hide_banner","-v","error","-i",SRC,"-filter_complex",
           f"[0:v]{base},{ch}[v]","-map","[v]","-frames:v","61","-f","null","-"]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    err = (p.stderr or "").strip().splitlines()
    print(f"{name:18s} rc={p.returncode}  {err[-1] if err else 'OK'}")
