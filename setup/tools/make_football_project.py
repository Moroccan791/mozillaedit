"""Generate the football project.json from the analyzed highlight windows."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
wins_path = ROOT / "projects" / "football" / "raw" / "match.windows.json"
wins = json.loads(wins_path.read_text())

MUSIC_DIR = ROOT / "assets" / "music"
track = sys.argv[1] if len(sys.argv) > 1 else None
name = sys.argv[2] if len(sys.argv) > 2 else "football"
music = str(MUSIC_DIR / f"{track}.wav") if track else None

wins = sorted(wins, key=lambda w: -w["score"])[:20]
wins = sorted(wins, key=lambda w: w["start"])
segs = [
    {"start": round(w["start"], 2), "end": round(w["end"], 2),
     "label": f"score{w['score']:.2f}"}
    for w in wins
]

proj = {
    "name": name,
    "source": "raw/match.mp4",
    "grade": "vibrant-sports",
    "platform": "youtube",
    "target_lufs": -14.0,
    "music": music,
    "music_gain_db": -6.0,
    "captions_mode": "off",
    "segments": segs,
    "title": {
        "enabled": True,
        "lines": ["CRISTIANO RONALDO"],
        "font_size": [90],
        "in": 0.4, "out": 4.0, "fade_in": 0.8,
    },
    "outro": {"enabled": False},
}
out = ROOT / "projects" / "football" / f"{name}.json"
out.write_text(json.dumps(proj, indent=2))
total = sum(s["end"] - s["start"] for s in segs)
print(f"{len(segs)} segments, {total:.1f}s total, music={track} -> {out}")
