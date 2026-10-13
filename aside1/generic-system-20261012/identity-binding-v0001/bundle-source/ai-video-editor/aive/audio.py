"""Audio polish: loudness normalisation, limiting, music bed + ducking.

FFmpeg-only (free). Targets platform loudness and optionally mixes a provided
music track under the source audio with sidechain ducking.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass
class AudioPlan:
    target_lufs: float = -14.0
    true_peak_db: float = -1.5
    lra: float = 11.0
    music: str | None = None
    music_gain_db: float = -14.0
    duck: bool = True
    fade_out: float = 1.2


def loudnorm_filter(plan: AudioPlan) -> str:
    """Single-pass loudnorm with true-peak limiting."""
    return (
        f"loudnorm=I={plan.target_lufs}:TP={plan.true_peak_db}:LRA={plan.lra}"
    )


def build_audio_filter(plan: AudioPlan, *, source_label: str = "0:a") -> str:
    """Return a filter fragment (input-pad referenced) producing [aout].

    Without music: normalise the source directly.
    With music:     mix source + ducked music bed, then normalise.
    """
    fade = f",afade=t=out:st=0:d={plan.fade_out}" if plan.fade_out else ""
    if not plan.music:
        return f"[{source_label}]{loudnorm_filter(plan)}{fade}[aout]"

    # two-input graph: source is 0:a, music is 1:a
    return (
        f"[1:a]volume={plan.music_gain_db}dB,aloop=loop=-1:size=2e9[music];"
        f"[{source_label}]asplit=2[voice][sc];"
        f"[music][sc]sidechaincompress=threshold=0.03:ratio=8:attack=5:release=300[duck];"
        f"[voice][duck]amix=inputs=2:duration=first:dropout_transition=0,"
        f"{loudnorm_filter(plan)}{fade}[aout]"
    )
