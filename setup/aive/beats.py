"""Full-track beat and onset analysis for local music-to-edit timing.

Audio is decoded through FFmpeg. Librosa computes an onset-strength envelope
across the entire track; tempo/phase estimation then uses that complete curve.
The cached profile retains onset strengths and continuous beat/half-beat grids.
"""
from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np

from .cache import analysis_cache_path

BEAT_ANALYSIS_VERSION = "beats-librosa-v4-no-unverified-downbeats"
SR = 22050
HOP = 128
N_FFT = 2048


def decode_audio(path: str | Path, sr: int = SR) -> np.ndarray:
    """Decode any media to mono float32 PCM via FFmpeg (no soundfile needed)."""
    cmd = [
        "ffmpeg", "-hide_banner", "-v", "error", "-i", str(path),
        "-ac", "1", "-ar", str(sr), "-f", "f32le", "-",
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg decode failed: {proc.stderr.decode('utf-8', 'replace')[-400:]}")
    return np.frombuffer(proc.stdout, dtype=np.float32)


def onset_envelope(x: np.ndarray, sr: int = SR, hop: int = HOP,
                   n_fft: int = N_FFT) -> tuple[np.ndarray, np.ndarray]:
    """Compute normalized librosa onset strength over every audio frame."""
    import librosa

    y = np.asarray(x, dtype=np.float32).reshape(-1)
    if y.size < n_fft:
        y = np.pad(y, (0, n_fft - y.size))
    env = librosa.onset.onset_strength(
        y=y, sr=sr, hop_length=hop, n_fft=n_fft, aggregate=np.mean,
    ).astype(np.float64)
    times = librosa.frames_to_time(
        np.arange(env.size), sr=sr, hop_length=hop,
    ).astype(np.float64)
    if env.size and env.max() > 0:
        env /= env.max()
    return env, times


def transient_frames(env: np.ndarray, sr: int = SR, hop: int = HOP) -> np.ndarray:
    """Uniform full-track peak picking with local, not loud-section, thresholds.

    Keep the original envelope for beat tracking/strength scores. A rolling
    two-second reference prevents one loud passage suppressing quieter attacks;
    the absolute floor prevents normalizing silence into spurious transients.
    """
    import librosa
    from scipy.ndimage import maximum_filter1d

    if env.size == 0 or float(np.max(env)) <= 0:
        return np.empty(0, dtype=int)
    window = max(3, int(round(2.0 * sr / hop)) | 1)
    local = maximum_filter1d(env, size=window, mode="nearest")
    scaled = np.divide(env, np.maximum(local, 0.05))
    frames = librosa.onset.onset_detect(
        onset_envelope=scaled, sr=sr, hop_length=hop, normalize=False,
        backtrack=False, units="frames", sparse=True, delta=0.07,
    )
    frames = np.asarray(frames, dtype=int)
    return frames[env[frames] >= 0.005]


def estimate_tempo(env: np.ndarray, sr: int = SR, hop: int = HOP,
                   bpm_min: float = 70.0, bpm_max: float = 180.0) -> tuple[float, float]:
    """Return (bpm, offset_seconds) via autocorrelation + phase search."""
    fps = sr / hop
    if env.size < int(fps):
        return 0.0, 0.0
    e = env - env.mean()
    ac = np.correlate(e, e, "full")[e.size - 1:]
    if ac[0] <= 0:
        return 0.0, 0.0
    ac = ac / ac[0]
    lag_min = max(1, int(fps * 60.0 / bpm_max))
    lag_max = min(ac.size - 1, int(fps * 60.0 / bpm_min))
    if lag_max <= lag_min:
        return 0.0, 0.0
    window = ac[lag_min:lag_max]
    lag = lag_min + int(np.argmax(window))
    # parabolic refinement
    if 0 < lag < ac.size - 1:
        y0, y1, y2 = ac[lag - 1], ac[lag], ac[lag + 1]
        denom = (y0 - 2 * y1 + y2)
        if denom:
            lag = lag + 0.5 * (y0 - y2) / denom
    bpm = 60.0 * fps / lag if lag else 0.0
    # snap to a musical range
    while bpm and bpm < bpm_min:
        bpm *= 2
    while bpm > bpm_max:
        bpm /= 2
    period = 60.0 / bpm * fps if bpm else 0.0
    offset = _best_offset(env, period)
    return round(bpm, 2), round(offset / fps, 4)


def _best_offset(env: np.ndarray, period: float) -> float:
    if period <= 0 or env.size < period:
        return 0.0
    best_s, best_o = -1.0, 0.0
    for o in np.arange(0.0, period, max(0.25, period / 64.0)):
        idx = np.arange(o, env.size, period)
        idx = idx[idx < env.size].astype(int)
        if idx.size:
            s = float(env[idx].sum())
            if s > best_s:
                best_s, best_o = s, o
    return best_o


def beat_times(env: np.ndarray, times: np.ndarray, bpm: float,
               offset: float, sr: int = SR, hop: int = HOP) -> list[float]:
    if bpm <= 0:
        return []
    period = 60.0 / bpm
    if times.size == 0:
        return []
    dur = float(times[-1])
    out, t = [], offset
    while t <= dur + 1e-6:
        out.append(round(t, 4))
        t += period
    return out


@dataclass
class BeatInfo:
    bpm: float
    offset: float
    duration: float
    beats: list[float] = field(default_factory=list)
    downbeats: list[float] = field(default_factory=list)
    onsets: list[float] = field(default_factory=list)
    onset_strengths: list[float] = field(default_factory=list)
    beats_per_bar: int = 4

    @property
    def beat_len(self) -> float:
        return 60.0 / self.bpm if self.bpm else 0.0

    def nearest_beat(self, t: float) -> float:
        if not self.beats:
            return t
        i = min(range(len(self.beats)), key=lambda k: abs(self.beats[k] - t))
        return self.beats[i]

    def grid(self, step: float = 1.0) -> list[float]:
        """Interpolate a continuous subdivision grid from full-track beats."""
        if self.bpm <= 0 or not self.beats or step <= 0:
            return []
        if step >= 1 and float(step).is_integer():
            return self.beats[::int(step)]
        subdivisions = max(1, round(1.0 / step))
        out: list[float] = []
        for i, beat in enumerate(self.beats):
            next_beat = (self.beats[i + 1] if i + 1 < len(self.beats)
                         else beat + self.beat_len)
            interval = next_beat - beat
            for sub in range(subdivisions):
                t = beat + interval * sub / subdivisions
                if t <= self.duration + 1e-6:
                    out.append(round(t, 4))
        return out

    def excerpt_markers(self, start: float, duration: float,
                        step: float = 0.5) -> list[float]:
        """Map absolute tracked subdivisions into an excerpt-local timeline.

        Include both boundaries, but do not mistake all markers for scene cuts.
        A planner may select a subset while keeping the song continuous.
        """
        if start < 0 or duration <= 0 or start + duration > self.duration + 0.001:
            raise ValueError("Excerpt is outside the analyzed track")
        end = start + duration
        interior = [round(t - start, 6) for t in self.grid(step)
                    if start + 1e-6 < t < end - 1e-6]
        return [0.0, *interior, round(duration, 6)]

    def to_dict(self) -> dict:
        return {"bpm": self.bpm, "offset": self.offset,
                "duration": round(self.duration, 3),
                "beats_per_bar": self.beats_per_bar,
                "beats": [round(b, 4) for b in self.beats],
                "downbeats": [round(b, 4) for b in self.downbeats],
                "onsets": [round(o, 4) for o in self.onsets],
                "onset_strengths": [round(v, 4) for v in self.onset_strengths]}


def detect(path: str | Path, *, sr: int = SR, hop: int = HOP) -> BeatInfo:
    x = decode_audio(path, sr=sr)
    if x.size == 0:
        return BeatInfo(bpm=0.0, offset=0.0, duration=0.0)
    duration = x.size / sr
    env, times = onset_envelope(x, sr=sr, hop=hop)
    import librosa

    tempo, beat_frames = librosa.beat.beat_track(
        onset_envelope=env, sr=sr, hop_length=hop, trim=False, units="frames",
    )
    tempo_values = np.asarray(tempo, dtype=float).reshape(-1)
    tracked_beats = librosa.frames_to_time(
        np.asarray(beat_frames, dtype=int), sr=sr, hop_length=hop,
    )
    tracked_beats = np.asarray(tracked_beats, dtype=float)
    if tracked_beats.size >= 2 and tempo_values.size:
        bpm = float(tempo_values[0])
        offset = float(tracked_beats[0])
        beats = [round(float(t), 4) for t in tracked_beats
                 if 0.0 <= t <= duration + 1e-6]
    else:
        bpm, offset = estimate_tempo(env, sr=sr, hop=hop)
        beats = beat_times(env, times, bpm, offset, sr=sr, hop=hop)
    # Beat tracking does not establish bar phase/meter. Taking every fourth
    # beat fabricates downbeats and can prioritize the wrong musical cuts.
    # Only externally reviewed bar markers may populate BeatInfo.downbeats.
    downbeats = []

    frames = transient_frames(env, sr=sr, hop=hop)
    frames = frames[(frames >= 0) & (frames < min(times.size, env.size))]
    onsets = [round(float(times[p]), 4) for p in frames]
    strengths = [round(float(env[p]), 4) for p in frames]
    return BeatInfo(bpm=bpm, offset=offset, duration=round(duration, 3),
                    beats=beats, downbeats=downbeats, onsets=onsets,
                    onset_strengths=strengths)


def detect_cached(path: str | Path, *, sr: int = SR, hop: int = HOP,
                  cache_dir: str | Path | None = None) -> BeatInfo:
    """Detect once per source version and reuse the serialized beat profile."""
    cache = analysis_cache_path(
        path, "beats", f"{BEAT_ANALYSIS_VERSION}-sr{sr}-hop{hop}", cache_dir
    )
    if cache.exists():
        return load(cache)
    info = detect(path, sr=sr, hop=hop)
    save(info, cache)
    return info


def save(info: BeatInfo, path: str | Path) -> Path:
    p = Path(path)
    p.write_text(json.dumps(info.to_dict(), indent=2), encoding="utf-8")
    return p


def load(path: str | Path) -> BeatInfo:
    d = json.loads(Path(path).read_text(encoding="utf-8"))
    return BeatInfo(**d)
