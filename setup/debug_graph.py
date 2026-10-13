import sys
from aive.project import Project
from aive import graph

proj = Project.load(sys.argv[1] if len(sys.argv) > 1 else r"E:\ai-video-editor\step4_plan.json")
fg, joined = graph.build(proj, ass_path=None, has_music=True, has_source_audio=True)
print("JOINED", joined)
print("===FILTERGRAPH===")
for part in fg.split(";"):
    print(part)
