"""Linux/repo-relative port of run_combined_proof.py (original hardcoded E:\\ai-video-editor).

Synthetic plumbing proof ONLY: no real reviewed events, no semantic or aesthetic
approval. Renders the same synthetic 4-clip fixture twice (style='multishot' vs
style='multishot-authored'), then asserts identical game/music PCM, identical
frame/sample clocks, changed video, full decode and unchanged originals.

Media is written under a scratch root (default /tmp/aive-combined-proof, override
with AIVE_PROOF_SCRATCH) so generated binaries stay out of the repository; only the
JSON summary is written next to this script.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
SETUP = REPO / "setup"
SCRATCH = Path(os.environ.get("AIVE_PROOF_SCRATCH", "/tmp/aive-combined-proof"))
sys.path.insert(0, str(SETUP))
from aive.encounter_render import RenderConfig, render_encounters          # noqa: E402
from tests.test_multishot_authored import fixture                          # noqa: E402


def ff(args):
    result = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-v", "error"] + args,
                            capture_output=True, timeout=120)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors="replace"))
    return result.stdout


def pcm(path):
    return ff(["-i", str(path), "-map", "0:a:0", "-c:a", "pcm_s16le", "-f", "s16le", "pipe:1"])


def free_suffix(base):
    for version in range(1, 100):
        path = base.with_name(f"{base.stem}-v{version:04d}{base.suffix}")
        if not path.exists():
            return path
    raise FileExistsError("proof summary version limit reached")


def main():
    media = SCRATCH / "synthetic-media"
    media.mkdir(parents=True, exist_ok=True)
    source, music = media / "source.mkv", media / "music.wav"
    if not source.exists():
        ff(["-f", "lavfi", "-i", "testsrc2=size=128x72:rate=30:duration=11",
            "-f", "lavfi", "-i", "sine=frequency=2100:sample_rate=48000:duration=11",
            "-c:v", "ffv1", "-c:a", "pcm_s16le", str(source)])
    if not music.exists():
        ff(["-f", "lavfi", "-i", "sine=frequency=430:sample_rate=48000:duration=12",
            "-c:a", "pcm_s16le", str(music)])
    original = hashlib.sha256(source.read_bytes()).hexdigest()
    # Distinct files, identical bytes: fixture requires one map per timeline row.
    sources = []
    for index in range(4):
        path = media / f"source-{index}.mkv"
        if not path.exists():
            path.write_bytes(source.read_bytes())
        sources.append(path)
    plan, maps = fixture(sources=[str(p) for p in sources], digest=original, version="v2")
    baseline = dict(plan)
    baseline.pop("authored_design")
    results = []
    for style, data in [("multishot", baseline), ("multishot-authored", plan)]:
        started = time.perf_counter()
        manifest = render_encounters(data, music, SCRATCH / style,
                                     config=RenderConfig(width=128, height=72, fps=30, style=style,
                                                         preset="ultrafast"),
                                     multishot_maps=maps)
        manifest["proof_render_seconds"] = time.perf_counter() - started
        ff(["-xerror", "-i", manifest["output"], "-f", "null", "-"])
        results.append(manifest)
    a, b = results
    game_same = pcm(a["game_stem"]) == pcm(b["game_stem"])
    music_same = pcm(a["music_stem"]) == pcm(b["music_stem"])
    assert game_same and music_same
    assert (a["frame_count"], a["sample_count"], a["music_start_sample"]) == \
           (b["frame_count"], b["sample_count"], b["music_start_sample"])
    raw = [ff(["-i", m["output"], "-an", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"]) for m in results]
    assert raw[0] != raw[1]
    assert len(raw[0]) == len(raw[1]) == 300 * 128 * 72 * 3
    assert hashlib.sha256(source.read_bytes()).hexdigest() == original
    for manifest in results:
        assert manifest["clock_model"]["schema"] == "render-clock-model/v1"
        assert manifest["clock_model"]["kind"] == "retimed-reviewed-map"
        assert manifest["clock_model"]["retimed"] is True
    assert b["clock_model"]["style"] == "multishot-authored"
    assert b.get("combined_style_policy")
    summary = {
        "status": "synthetic_combined_api_plumbing_not_real_semantic_or_aesthetic_acceptance",
        "platform": "linux-sandbox-port",
        "frames": b["frame_count"], "samples": b["sample_count"], "duration": b["audio_duration"],
        "music_start_sample": b["music_start_sample"],
        "game_stem_pcm_identical": game_same, "music_stem_pcm_identical": music_same,
        "full_decode_pass": True, "video_changed": True, "original_unchanged": True,
        "render_seconds": [x["proof_render_seconds"] for x in results],
        "manifests": [x["manifest_path"] for x in results],
        "clock_models": [x["clock_model"] for x in results],
        "combined_style_policy": b.get("combined_style_policy"),
        "combined_limitations": b.get("combined_limitations"),
        "candidate_confirmed": [r["candidate_events"][0]["confirmed"] for r in plan["timeline"]],
        "limitations": ["Synthetic fixture attestation only", "No real reviewed maps invented",
                        "Game gap atempo remains approximate", "No lyric/front-door/closure integration yet",
                        "No gameplay/music/lyric/perceptual approval",
                        "Retimed clocks are refused by the 1x lyric/closure paths (clock boundary enforced)"]}
    target = free_suffix(HERE / "proof-summary-local.json")
    with target.open("x", encoding="utf8") as handle:
        json.dump(summary, handle, indent=2)
    print(json.dumps(summary, indent=2))
    print("summary:", target)


if __name__ == "__main__":
    main()
