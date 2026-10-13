"""Real-footage engineering comparison only. NOT a corrected montage.
No historical confirmed labels are promoted into this visual-only diagnostic.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
sys.path.insert(0, r"E:\ai-video-editor")
from aive.encounter_render import RenderConfig, render_encounters
from aive.encounter_qa import verify_encounters

root = Path(__file__).resolve().parent
historical = json.loads(Path(r"E:\aside\other-stages-20261012\jobs\job-v0001\timeline.json").read_text())
# Narrow snippets exist only to exercise renderer scene states, not to establish
# clean isolated shots, complete fights, resolved payoff or musical alignment.
choices = [(0, 220.8), (1, 233.5), (3, 8.8), (4, 91.5)]
rows = []
for i, (old, start) in enumerate(choices):
    item = historical["timeline"][old]
    rows.append(dict(source=item["source"], source_start=start, source_end=start+2,
                     output_start=2*i, output_end=2*i+2, music_start=25+2*i,
                     music_end=27+2*i, speed=1., events=[]))
plan = dict(schema_version="encounters/v1", duration=8., requested_duration=8.,
            music_start=25., music_end=33., music_continuous=True, gaps=[], timeline=rows,
            music=historical["music"], diagnostic_only=True,
            diagnostic_limitations=["Source snippets not reviewed as complete/resolved fights.",
                "Song excerpt not approved; no shot/accent assignment or musical-sync claim.",
                "Shot roles describe render treatment only, not independently established semantic scene roles."])
config = dict(width=640, height=360, fps=60, encoder="h264_qsv", quality=21,
              game_gain_db=-8, music_gain_db=-7, timeout=120)
clean = render_encounters(plan, plan["music"], root/"clean-renders", config=RenderConfig(**config))
plan["authored_design"] = dict(schema_version="authored-footage/v1",
    shots=[dict(role=r, composition="inset" if r == "contrast" else "full")
           for r in ("setup", "impact", "contrast", "payoff")],
    bridges=[dict(boundary=2, direction="right", frames=12)], ending=dict(fade_frames=36))
authored = render_encounters(plan, plan["music"], root/"authored-renders",
                            config=RenderConfig(style="authored-footage", **config))
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
checks = {k: dict(clean_sha256=sha(clean[k]), authored_sha256=sha(authored[k]),
                  identical=sha(clean[k]) == sha(authored[k])) for k in ("game_stem", "music_stem")}
assert all(v["identical"] for v in checks.values())
qa = verify_encounters(authored, plan, output_path=root/"quality-report.json")
# Dense frames at edge/ending, plus representative state comparison.
indices = [54, 227, 239, 240, 245, 294, 444, 462, 478, 479]
width, height = 320, 180
frame_dir = root/"frames"
frame_dir.mkdir(exist_ok=True)
frame_metrics = []
for n, index in enumerate(indices):
    clean_image = None
    for group, result in enumerate((clean, authored)):
        raw = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin",
              "-i", result["output"], "-vf", f"select=eq(n\\,{index}),scale={width}:{height}",
              "-frames:v", "1", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"],
              capture_output=True, check=True, timeout=60).stdout
        if group == 0:
            clean_image = raw
        else:
            diff = sum(abs(a-b) for a,b in zip(clean_image,raw))/len(raw)
            frame_metrics.append(dict(frame=index, seconds=index/60, mean_absolute_clean_difference=diff,
                                      authored_mean_rgb=sum(raw)/len(raw)))
        name = f"{'clean' if group==0 else 'authored'}-{index}.ppm"
        (frame_dir/name).write_bytes(f"P6\n{width} {height}\n255\n".encode()+raw)
result = dict(diagnostic_only=True, clean=clean["output"], authored=authored["output"],
              frame_count=authored["frame_count"], sample_count=authored["sample_count"],
              stems=checks, qa_status=qa["status"], issues=qa["issues"], frames=frame_metrics,
              limitations=plan["diagnostic_limitations"])
(root/"RESULTS.json").write_text(json.dumps(result,indent=2)+"\n")
print(json.dumps(result,indent=2))
