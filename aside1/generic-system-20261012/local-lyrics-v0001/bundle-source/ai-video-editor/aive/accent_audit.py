"""Conservative acoustic evidence, not drum labels/probabilities or taste.

Standalone: no planner integration. Accepted means a sharp, locally salient,
coherent percussive-like attack near the supplied clock; not perceptual sync.
Mixed/harmonic cases abstain. No fixed BPM or universal latency subtraction.
"""
from __future__ import annotations
import math
from numbers import Real
from pathlib import Path
import subprocess
import numpy as np
from scipy import ndimage, signal

VERSION = "accent-audit/v1"
MAX_CANDIDATES = 32
MAX_DURATION = 600.0
MAX_SAMPLES = 28_800_000
ANALYSIS_SR = 24000
CONTEXT_SECONDS = 1.0
REFINE_SECONDS = .120
ALIGNMENT_TOLERANCE_MS = 30.0
_BANDS = ((30, 180), (180, 800), (800, 3000), (3000, 10000))


def _rate(sr):
    if isinstance(sr, bool) or not isinstance(sr, Real) or not math.isfinite(sr):
        raise ValueError("sr must be a finite integer sample rate")
    if int(sr) != sr or not 8000 <= sr <= 96000:
        raise ValueError("sr must be an integer in [8000, 96000]")
    return int(sr)


def _times(values, duration=None):
    # Consume at most bound plus one, including infinite generators.
    try:
        iterator = iter(values)
    except TypeError as exc:
        raise ValueError("candidate_times must be an iterable") from exc
    result = []
    for value in iterator:
        if len(result) >= MAX_CANDIDATES:
            raise ValueError(f"at most {MAX_CANDIDATES} candidates allowed")
        if isinstance(value, bool) or not isinstance(value, Real):
            raise ValueError("candidate times must be finite real seconds")
        t = float(value)
        if not math.isfinite(t) or t < 0 or (duration is not None and t >= duration):
            raise ValueError("candidate time outside decoded samples")
        result.append(t)
    return result


def analyze_accent_samples(x, sr, candidate_times):
    """Finite JSON reports for <=32 mono PCM candidates, input order retained.

    8-96kHz, <=600s, <=28.8M samples. Analyze only +/-1s plus 180ms margin,
    refine +/-120ms. original_peak retains input; delay_ms=original-attack.
    Acceptance also requires original-clock error <=30ms. A rejected late
    clock can still have percussive_like classification and refined time.
    """
    sr = _rate(sr)
    a = np.asarray(x)
    if (a.ndim != 1 or not a.size or a.size > MAX_SAMPLES
            or a.dtype.kind not in "fiu" or a.size / sr > MAX_DURATION):
        raise ValueError("x must be bounded nonempty one-dimensional real PCM")
    if not np.isfinite(a).all():
        raise ValueError("x must contain only finite samples")
    times = _times(candidate_times, a.size / sr)
    return [_analyze_local(a, sr, t) for t in times]


def audit_candidates(music: str | Path, candidate_times):
    """Bounded local FFmpeg decode, no full-track decode or cache/network.

    Each output is <=2.36s; decode from sample zero to <=601.18s,30s timeout.
    This avoids compressed input-seek origin errors. Errors raise. Times are
    absolute seconds. Existing local file required, candidates below600s.
    """
    p = Path(music)
    if not p.is_file():
        raise ValueError("music must be an existing local file")
    times = _times(candidate_times)
    if any(t >= MAX_DURATION for t in times):
        raise ValueError("file candidates must be below600s")
    reports = []
    for t in times:
        start_sample = max(0, int((t - 1.18) * ANALYSIS_SR))
        end_sample = int(math.ceil((t + 1.18) * ANALYSIS_SR))
        start = start_sample / ANALYSIS_SR
        trim = f"aresample={ANALYSIS_SR},atrim=start_sample={start_sample}:end_sample={end_sample}"
        cmd = ["ffmpeg", "-hide_banner", "-v", "error", "-nostdin",
               "-t", str(end_sample / ANALYSIS_SR), "-i", str(p), "-af", trim, "-ac", "1",
               "-ar", str(ANALYSIS_SR), "-f", "f32le", "-"]
        proc = subprocess.run(cmd, capture_output=True, timeout=30)
        if proc.returncode:
            raise RuntimeError("FFmpeg local decode failed")
        if len(proc.stdout) > int(2.37 * ANALYSIS_SR) * 4:
            raise RuntimeError("FFmpeg exceeded bounded window")
        samples = np.frombuffer(proc.stdout, dtype="<f4")
        if not samples.size or t - start >= samples.size / ANALYSIS_SR:
            raise ValueError("candidate time outside decoded media")
        r = analyze_accent_samples(samples, ANALYSIS_SR, [t - start])[0]
        r["original_peak"] = t
        if r["acoustic_attack_time"] is not None:
            r["acoustic_attack_time"] += start
            r["acoustic_attack_range"] = [v + start for v in r["acoustic_attack_range"]]
        if r["flux_peak_time"] is not None:
            r["flux_peak_time"] += start
        r["context_range"] = [v + start for v in r["context_range"]]
        reports.append(r)
    return reports


def _analyze_local(x, sr, t):
    import librosa
    lo = max(0, int((t - 1.18) * sr))
    hi = min(len(x), int(math.ceil((t + 1.18) * sr)))
    y = np.asarray(x[lo:hi], dtype=np.float64)
    origin = lo / sr
    peak = float(np.max(np.abs(y)))
    if peak:
        y /= peak  # gain-invariant, prevents numeric overflow
    if sr != ANALYSIS_SR:
        g = math.gcd(sr, ANALYSIS_SR)
        y = signal.resample_poly(y, ANALYSIS_SR // g, sr // g)
    s = ANALYSIS_SR
    if y.size < 512:
        y = np.pad(y, (0, 512 - y.size))
    hop = 48
    spectrum = np.abs(librosa.stft(y, n_fft=512, hop_length=hop, center=True))
    harmonic, percussion = librosa.decompose.hpss(
        spectrum, kernel_size=(31, 31), margin=(2., 2.))
    ft = origin + np.arange(spectrum.shape[1]) * hop / s
    freq = librosa.fft_frequencies(sr=s, n_fft=512)
    context = (ft >= max(0., t - 1.)) & (ft <= min(len(x) / sr, t + 1.))
    flux, pflux, hflux, rms, pe, he = [], [], [], [], [], []
    for low, high in _BANDS:
        mask = (freq >= low) & (freq < min(high, sr / 2))
        for spec, dest in ((spectrum, flux), (percussion, pflux), (harmonic, hflux)):
            dest.append(np.r_[0., np.maximum(np.diff(spec[mask], axis=1), 0.).sum(axis=0)]
                        if mask.any() else np.zeros(len(ft)))
        pe.append(np.sum(percussion[mask] ** 2, axis=0))
        he.append(np.sum(harmonic[mask] ** 2, axis=0))
        # Zero-phase4ms band RMS: approximate timing, low carrier can ripple.
        upper = min(high, sr * .48)
        if upper <= low:
            rms.append(np.zeros(len(ft)))
        else:
            filt = signal.sosfiltfilt(signal.butter(3, [low, upper],
                        btype="bandpass", fs=s, output="sos"), y)
            energy = np.sqrt(np.maximum(0., ndimage.uniform_filter1d(filt ** 2, size=97)))
            rms.append(np.interp(ft - origin, np.arange(len(y)) / s, energy))
    flux, pflux, hflux, rms = map(np.asarray, (flux, pflux, hflux, rms))
    raw = ndimage.gaussian_filter1d(flux.sum(axis=0), .7)
    maximum = float(raw[context].max()) if context.any() else 0.
    report = dict(schema_version=VERSION, original_peak=float(t),
        acoustic_attack_time=None, acoustic_attack_range=None, delay_ms=None,
        flux_peak_time=None, local_rank=None, local_peak_count=0,
        local_relative_strength=0., percussive_score=0.,
        classification="uncertain", accepted=False, rejection_reasons=[],
        harmonic_persistence=0., percussive_flux_share=0.,
        attack_cluster_peak_count=0, principal_peak_offset_ms=None,
        context_range=[max(0., t - 1.), min(len(x) / sr, t + 1.)],
        bands=[], heuristic=True,
        interpretation="Acoustic heuristic; not drum identity, probability or musical-taste validation")
    if not peak or maximum < 1e-10:
        report["rejection_reasons"] = ["no_measurable_attack"]
        return report
    peaks, _ = signal.find_peaks(raw, distance=20, prominence=maximum * .035)
    peaks = peaks[context[peaks]]
    eligible = peaks[np.abs(ft[peaks] - t) <= REFINE_SECONDS]
    report["local_peak_count"] = int(len(peaks))
    if not len(eligible):
        report["rejection_reasons"] = ["no_attack_within_refinement_window"]
        return report
    # Nearest distinct peak, not a substituted stronger neighboring hit.
    nearest = int(min(eligible, key=lambda k: abs(float(ft[k]) - t)))
    cluster = peaks[np.abs(ft[peaks] - ft[nearest]) <= .080]
    principal = int(cluster[np.argmax(raw[cluster])])
    ambiguous = len(cluster) > 1
    # Nearby secondary attacks are not silently called validated hits. Use
    # principal evidence when bounded, but abstain on overlapping clusters.
    j = principal if abs(ft[principal] - t) <= REFINE_SECONDS else nearest
    report["attack_cluster_peak_count"] = int(len(cluster))
    report["principal_peak_offset_ms"] = float((ft[principal] - t) * 1000)
    rel = float(raw[j] / maximum)
    report["flux_peak_time"] = float(ft[j])
    report["local_rank"] = 1 + int(np.sum(raw[peaks] > raw[j] + maximum * 1e-9))
    report["local_relative_strength"] = rel
    starts = []
    # 3.5% preserves timing for weak incidental peaks. Global salience
    # gate below prevents these from being accepted as strong hits.
    for k, bounds in enumerate(_BANDS):
        aa, bb = max(0, j - 20), min(len(ft), j + 9)
        e = rms[k]
        base = float(np.median(e[max(0, j - 25):max(1, j - 10)]))
        q = j + int(np.argmax(e[j:bb]))
        top = float(e[q]); delta = max(0., top - base)
        normalized = float(flux[k, j] / (float(flux[k, context].max()) + 1e-12))
        s20 = s50 = None
        if delta > max(base * .5, 1e-5):
            for fraction in (.2, .5):
                below = np.flatnonzero(e[aa:q + 1] < base + fraction * delta)
                crossing = aa + int(below[-1]) + 1 if len(below) else aa
                crossing = min(crossing, q)
                if fraction == .2:
                    s20 = float(ft[crossing])
                else:
                    s50 = float(ft[crossing])
        material = normalized >= .035 and s20 is not None and abs(s20 - ft[j]) <= .035
        if material:
            starts.append((s20, s50))
        report["bands"].append(dict(hz=list(bounds), relative_flux=normalized,
            rms_rise_ratio=float(top / (base + 1e-12)),
            attack_start_offset_ms=None if s20 is None else float((s20 - t) * 1000),
            material=bool(material)))
    # Transient flux alone can accept a chord; sustained harmonic energy
    # after onset makes such mixed cases abstain. HPSS is only a proxy.
    pp = float(pflux[:, max(0, j-2):j+3].sum())
    hh = float(hflux[:, max(0, j-2):j+3].sum())
    share = pp / (pp + hh + 1e-12)
    post = (ft >= ft[j] + .030) & (ft <= ft[j] + .120)
    pre = (ft >= ft[j] - .100) & (ft <= ft[j] - .030)
    # Subtract per-band pre-attack energy: a dying noise hit should not be
    # called harmonic just because a quiet background tone remains.
    def excess_energy(values):
        v = np.asarray(values)
        baseline = np.median(v[:, pre], axis=1) if pre.any() else np.zeros(4)
        return float(np.maximum(v[:, post] - baseline[:, None], 0.).sum())
    pen = excess_energy(pe)
    hen = excess_energy(he)
    attack_energy = float((np.asarray(pe) + np.asarray(he))[:, max(0, j-2):j+4].sum())
    persistence = hen / (pen + hen + .02 * attack_energy + 1e-12)
    score = float(np.clip(share * (1. - persistence), 0., 1.))
    report["percussive_score"] = score
    report["harmonic_persistence"] = float(persistence)
    report["percussive_flux_share"] = float(share)
    reasons = report["rejection_reasons"]
    if t < .15 or len(x) / sr - t < .15:
        reasons.append("insufficient_edge_context")
    if ambiguous:
        reasons.append("ambiguous_nearby_attack_cluster")
    if starts and sum(b - a <= .014 for a, b in starts) < 2:
        reasons.append("insufficient_sharp_attack_bands")
    if rel < .45:
        reasons.append("weak_local_salience")
    if len(starts) < 2:
        reasons.append("insufficient_coherent_bands")
    spread = max((v[0] for v in starts), default=ft[j]) - min((v[0] for v in starts), default=ft[j])
    if spread > .020:
        reasons.append("incoherent_attack_timing")
    if score < .55:
        reasons.append("harmonic_or_uncertain_percussiveness")
    if starts:
        attack = float(np.median([v[0] for v in starts]))
        lower = max(t - REFINE_SECONDS, min(v[0] for v in starts))
        upper = min(t + REFINE_SECONDS, max(v[1] for v in starts))
        if lower > upper or not t - REFINE_SECONDS <= attack <= t + REFINE_SECONDS:
            reasons.append("attack_outside_refinement_window")
        else:
            report["acoustic_attack_time"] = attack
            report["acoustic_attack_range"] = [float(lower), float(upper)]
            report["delay_ms"] = float((t - attack) * 1000)
            if abs(report["delay_ms"]) > ALIGNMENT_TOLERANCE_MS:
                reasons.append("original_clock_outside_30ms_tolerance")
    else:
        reasons.append("no_reliable_acoustic_attack")
    report["classification"] = "percussive_like" if score >= .55 and len(starts) >= 2 and spread <= .020 else "harmonic_or_uncertain"
    report["accepted"] = not reasons
    return report




