"""Quick check that music mixing + ducking + loudnorm renders correctly."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TONE = Path(r"C:\Users\Junayed\AppData\Local\Temp\opencode\aive-test\tone.mp3")

proj = {
    "name": "music_test",
    "source": "raw/match.mp4",
    "grade": "none",
    "platform": "youtube",
    "target_lufs": -14.0,
    "music": str(TONE),
    "music_gain_db": -12.0,
    "captions_mode": "off",
    "segments": [
        {"start": 38.8, "end": 46.8},
        {"start": 78.8, "end": 86.8},
    ],
}
p = ROOT / "projects" / "football" / "music_test.json"
p.write_text(json.dumps(proj, indent=2))

out = ROOT / "projects" / "football" / "output" / "music_test.mp4"
subprocess.run(
    ["python", "edit.py", "run", str(p)], cwd=str(ROOT), check=True
)

frames = subprocess.run(
    ["ffprobe", "-v", "error", "-select_streams", "a",
     "-show_entries", "stream=codec_name,sample_rate,channels",
     "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1",
     str(out)],
    capture_output=True, text=True,
)
print(frames.stdout)
