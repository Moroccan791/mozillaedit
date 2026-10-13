"""Smoke test for graph/render: 3 clips, transitions, motion, 9:16 reframe."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from aive.project import Project, Segment  # noqa: E402
from aive import render as render_mod, graph  # noqa: E402

src = str(ROOT / "projects" / "football" / "raw" / "match.mp4")
music = str(ROOT / "assets" / "music" / "jrpg-70-arena.wav")

proj = Project(
    name="test_reel",
    source=src,
    music=music,
    music_gain_db=-6.0,
    grade="vibrant-sports",
    aspect="9:16",
    reframe="blur",
    vibe="music-reel",
    platform="tiktok",
    audio_mode="mix",
    transition={"type": "zoom-blur", "duration": 0.3},
    segments=[
        Segment(start=40.0, end=44.0, motion="zoom-in", zoom=1.2),
        Segment(start=80.0, end=84.0, motion="punch", zoom=1.25),
        Segment(start=120.0, end=124.0, motion="none"),
    ],
)
proj.root = ROOT

out = str(ROOT / "tools" / "_dllwork" / "test_reel.mp4")
res = render_mod.render(proj, out, encoder=None, quality=22)
print("joined duration:", res.duration)
print("graph:\n", res.filtergraph[:1200])

from aive.graph import probe_streams  # noqa: E402
import subprocess  # noqa: E402
info = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                       "stream=width,height,codec_type:format=duration",
                       "-of", "default=nw=1", out],
                      capture_output=True, text=True).stdout
print("--- output ---\n", info)
