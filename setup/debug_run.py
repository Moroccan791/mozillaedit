import sys, subprocess
from aive.project import Project
from aive import graph
from aive.export import export_args

proj = Project.load(sys.argv[1] if len(sys.argv) > 1 else r"E:\ai-video-editor\step4_plan.json")
fg, joined = graph.build(proj, ass_path=None, has_music=True, has_source_audio=True)

args = ["ffmpeg", "-hide_banner", "-y", "-i", str(proj.source_path),
        "-stream_loop", "-1", "-i", str(proj.music_path),
        "-filter_complex", fg, "-map", "[vfinal]", "-map", "[afinal]"]
args += export_args(proj.platform, encoder=None, quality=20)
args += [r"E:\ai-video-editor\output\debug_ffmpeg.mp4"]

print("RUNNING...")
p = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace")
print("EXIT", p.returncode)
print("===STDERR TAIL===")
lines = p.stderr.splitlines()
for ln in lines[-60:]:
    print(ln)
