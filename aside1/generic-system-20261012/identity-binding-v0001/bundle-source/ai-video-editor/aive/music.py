"""Music understanding: energy, structure (sections), drops and a hype score.

Builds on beats.py (tempo/onsets). Gives the planner the *shape* of a track so
the edit can ride it: ease in on the intro, punch through builds, hit on drops.

Heuristic but fast and dependency-free (numpy/scipy + FFmpeg decode).
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from scipy.signal import find_peaks

from . import beats
from .cache import analysis_cache_path

MUSIC_ANALYSIS_VERSION = "music-librosa-v3-uniform"
SR = 22050
FRAME = 1024
HOP = 512


@dataclass
class Section:
    start: float
    end: float
    label: str          # intro | low | build | peak | drop | breakdown | outro
    energy: float       # 0..1 mean energy in section

    @property
    def duration(self) -> float:
        return self.end - self.start

    def to_dict(self) -> dict:
        return {"start": round(self.start, 3), "end": round(self.end, 3),
                "label": self.label, "energy": round(self.energy, 3)}


@dataclass
class MusicProfile:
    path: str = ""
    bpm: float = 0.0
    offset: float = 0.0
    duration: float = 0.0
    hype: float = 0.0
    energy: list[float] = field(default_factory=list)   # sampled curve
    energy_hz: float = 2.0                              # samples per second
    sections: list[Section] = field(default_factory=list)
    drops: list[float] = field(default_factory=list)
    peaks: list[float] = field(default_factory=list)

    def energy_at(self, t: float) -> float:
        if not self.energy:
            return 0.0
        i = int(t * self.energy_hz)
        return self.energy[min(max(i, 0), len(self.energy) - 1)]

    def section_at(self, t: float) -> Section | None:
        for s in self.sections:
            if s.start <= t < s.end:
                return s
        return self.sections[-1] if self.sections else None

    def best_window(self, dur: float) -> float:
        """Start time of the highest-energy `dur`-second stretch."""
        if not self.energy or dur <= 0:
            return 0.0
        w = max(1, int(dur * self.energy_hz))
        e = np.asarray(self.energy)
        if w >= e.size:
            return 0.0
        csum = np.concatenate([[0.0], np.cumsum(e)])
        sums = csum[w:] - csum[:-w]
        i = int(np.argmax(sums))
        return round(i / self.energy_hz, 3)

    def to_dict(self) -> dict:
        return {"path": self.path, "bpm": self.bpm, "offset": self.offset,
                "duration": round(self.duration, 3), "hype": round(self.hype, 3),
                "energy_hz": self.energy_hz,
                "energy": [round(x, 3) for x in self.energy],
                "sections": [s.to_dict() for s in self.sections],
                "drops": [round(d, 3) for d in self.drops],
                "peaks": [round(p, 3) for p in self.peaks]}


def _rms_curve(x: np.ndarray, sr: int = SR) -> np.ndarray:
    n = max(1, (len(x) - FRAME) // HOP + 1)
    idx = np.arange(FRAME)[None, :] + HOP * np.arange(n)[:, None]
    fr = x[idx]
    rms = np.sqrt((fr ** 2).mean(axis=1) + 1e-12)
    return 20 * np.log10(rms + 1e-9)  # raw dB, unnormalised


def _smooth(a: np.ndarray, k: int) -> np.ndarray:
    if k <= 1 or a.size == 0:
        return a
    ker = np.ones(k) / k
    return np.convolve(a, ker, mode="same")


def analyze(path: str | Path, sample_hz: float = 2.0, *,
            beat_info: beats.BeatInfo | None = None) -> MusicProfile:
    b = beat_info or beats.detect(path)
    x = beats.decode_audio(path, sr=SR)
    if x.size == 0:
        return MusicProfile(path=str(path))
    frame_hz = SR / HOP
    env_db = _smooth(_rms_curve(x, SR), k=max(1, int(frame_hz * 0.5)))
    flux, _ = beats.onset_envelope(x, sr=SR, hop=HOP)

    # percentile stretch so quiet/loud sections actually separate
    if env_db.size:
        lo, hi = np.percentile(env_db, [5, 95])
    else:
        lo, hi = 0.0, 1.0
    env01 = np.clip((env_db - lo) / ((hi - lo) or 1.0), 0.0, 1.0)

    step = max(1, int(round(frame_hz / sample_hz)))
    energy = env01[::step]
    energy_hz = frame_hz / step

    # ---- section boundaries from novelty (smoothed flux) --------------------
    nov = _smooth(flux, k=max(1, int(frame_hz * 0.4)))
    min_gap = max(1, int(frame_hz * 6))
    peaks, _ = find_peaks(nov, distance=min_gap,
                          height=float(np.percentile(nov, 78)) if nov.size else 0)
    bounds = [0.0] + [p / frame_hz for p in peaks] + [b.duration]
    clean = [bounds[0]]
    for t in bounds[1:]:
        if t - clean[-1] >= 6.0:
            clean.append(t)
    clean[-1] = b.duration

    sections: list[Section] = []
    for a, c in zip(clean, clean[1:]):
        seg = env01[int(a * frame_hz):max(int(a * frame_hz) + 1, int(c * frame_hz))]
        e = float(seg.mean()) if seg.size else 0.0
        sections.append(Section(a, c, "mid", e))
    if sections:
        lo = float(np.percentile([s.energy for s in sections], 30))
        hi = float(np.percentile([s.energy for s in sections], 70))
        for i, s in enumerate(sections):
            prev = sections[i - 1].energy if i else s.energy
            rising = s.energy - prev > 0.12
            if s.energy >= hi:
                s.label = "peak"
            elif s.energy <= lo:
                s.label = "intro" if i == 0 else ("outro" if i == len(sections) - 1 else "breakdown")
            elif rising:
                s.label = "build"
            else:
                s.label = "mid"

    # ---- drops: boundaries entering a high-energy section -------------------
    drops: list[float] = []
    for i, s in enumerate(sections):
        if i == 0:
            continue
        prev = sections[i - 1]
        if s.label == "peak" and (s.energy - prev.energy) > 0.15:
            drops.append(round(s.start, 3))

    # ---- peaks: strongest energetic moments ---------------------------------
    pk, _ = find_peaks(energy, distance=max(1, int(energy_hz * 2)),
                       height=0.75) if energy.size else ([], None)
    peak_times = [round(float(p) / energy_hz, 3) for p in pk]

    # ---- hype score ---------------------------------------------------------
    onsets_per_sec = len(b.onsets) / b.duration if b.duration else 0.0
    high_frac = float((energy > 0.6).mean()) if energy.size else 0.0
    mean_top = float(np.sort(energy)[-max(1, energy.size // 4):].mean()) if energy.size else 0.0
    hype = float(np.clip(0.45 * mean_top + 0.3 * high_frac
                         + 0.25 * min(1.0, onsets_per_sec / 6.0), 0, 1))

    return MusicProfile(path=str(path), bpm=b.bpm, offset=b.offset,
                        duration=b.duration, hype=hype, energy=list(energy),
                        energy_hz=energy_hz, sections=sections,
                        drops=drops, peaks=peak_times)


def analyze_cached(path: str | Path, sample_hz: float = 2.0, *,
                   cache_dir: str | Path | None = None) -> MusicProfile:
    """Reuse the versioned music structure/energy profile for repeat plans."""
    version = f"{MUSIC_ANALYSIS_VERSION}-sample-hz-{sample_hz:g}"
    cache = analysis_cache_path(path, "music", version, cache_dir)
    if cache.exists():
        return load(cache)
    beat_info = beats.detect_cached(path, cache_dir=cache_dir)
    profile = analyze(path, sample_hz=sample_hz, beat_info=beat_info)
    save(profile, cache)
    return profile


def save(profile: MusicProfile, path: str | Path) -> Path:
    p = Path(path)
    p.write_text(json.dumps(profile.to_dict(), indent=2), encoding="utf-8")
    return p


def load(path: str | Path) -> MusicProfile:
    d = json.loads(Path(path).read_text(encoding="utf-8"))
    d["sections"] = [Section(**s) for s in d.get("sections", [])]
    return MusicProfile(**d)


def describe(p: MusicProfile) -> str:
    lines = [f"{Path(p.path).name}: bpm={p.bpm} hype={p.hype:.2f} dur={p.duration:.0f}s"]
    for s in p.sections:
        bar = "#" * int(s.energy * 30)
        lines.append(f"  {s.start:6.1f}-{s.end:6.1f} {s.label:10s} {s.energy:.2f} {bar}")
    if p.drops:
        lines.append("  drops: " + ", ".join(f"{d:.1f}" for d in p.drops))
    return "\n".join(lines)
