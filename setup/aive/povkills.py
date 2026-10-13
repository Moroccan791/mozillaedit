"""Local, profile-calibrated POV kill-icon matching (no OCR or AI).

A profile identifies an icon in a measured HUD ROI, not player names. Visual
matches without nearby audio, or with an uncalibrated profile, remain candidates.
Confidence is template cosine similarity, never a calibrated probability.
The ROI guard rejects flat/white frames and large abrupt ROI changes; it is not
an exhaustive scene-cut detector. Timestamps use an FFmpeg sample grid and are
accurate to approximately one sample interval, not source-frame precision.

JSON profile version: ``povkills-v1``. Templates are grayscale HxW .npy arrays
(or gradient magnitudes with representation='gradient'); relative paths resolve
beside the JSON profile. See load_profile for the small validated schema.
"""
from __future__ import annotations

import copy
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import tempfile

import numpy as np
from scipy.ndimage import sobel

from .ffprobe import probe

PROFILE_VERSION = "povkills-v1"
CACHE_VERSION = "povkills-cache-v1"
LIMITATIONS = [
    "Icon identity is profile-specific; no player-name OCR is performed.",
    "Template cosine similarity is not a probability.",
    "Missing nearby audio leaves visual detections uncertain.",
    "ROI guards do not identify every scene cut.",
    "Visual timing is quantized to the configured sample rate.",
]


def _finite(value, name):
    value = float(value)
    if not math.isfinite(value):
        raise ValueError(f"{name} must be finite")
    return value


def load_profile(profile: str | Path | dict) -> dict:
    """Validate and resolve a JSON profile without modifying the supplied dict.

    Required: version, calibrated_profile, roi, templates. Calibration metadata
    is mandatory when calibrated_profile is true. Default output_size=[96,84],
    sample_hz=15. Temporal defaults: 2 hits within 4 frames, 2 low reset frames,
    0.3s refractory. A loaded dict can be passed back to this function.
    """
    if isinstance(profile, dict):
        cfg = copy.deepcopy(profile)
        base = Path(cfg.get("_profile_dir", ".")).resolve()
    else:
        filename = Path(profile).resolve()
        cfg = json.loads(filename.read_text(encoding="utf-8"))
        base = filename.parent
    if not isinstance(cfg, dict) or cfg.get("version") != PROFILE_VERSION:
        raise ValueError(f"profile version must be {PROFILE_VERSION!r}")
    if not isinstance(cfg.get("calibrated_profile"), bool):
        raise ValueError("calibrated_profile must be an explicit boolean")
    sources = cfg.setdefault("calibrated_sources", [])
    if not isinstance(sources, list) or any(not isinstance(s, dict) for s in sources):
        raise ValueError("calibrated_sources must be a list of metadata objects")
    if cfg["calibrated_profile"] and not sources:
        raise ValueError("calibrated profiles require calibrated_sources metadata")
    roi = cfg.get("roi")
    if not isinstance(roi, (list, tuple)) or len(roi) != 4:
        raise ValueError("roi must be normalized [x,y,w,h]")
    x, y, w, h = [_finite(v, "roi") for v in roi]
    if x < 0 or y < 0 or w <= 0 or h <= 0 or x + w > 1 or y + h > 1:
        raise ValueError("roi must fit inside the normalized source frame")
    cfg["roi"] = [x, y, w, h]
    size = cfg.setdefault("output_size", [96, 84])
    if len(size) != 2 or any(isinstance(v, bool) or int(v) != v or v < 2 for v in size):
        raise ValueError("output_size must contain two positive integer dimensions")
    cfg["output_size"] = [int(v) for v in size]
    hz = _finite(cfg.setdefault("sample_hz", 15), "sample_hz")
    if not 0 < hz <= 120:
        raise ValueError("sample_hz must be in (0,120]")
    cfg["sample_hz"] = hz
    mask = cfg.setdefault("mask", {"center": [48 * size[0] / 96, 36 * size[1] / 84],
                                    "radii": [39 * size[0] / 96, 35 * size[1] / 84]})
    if len(mask.get("center", [])) != 2 or len(mask.get("radii", [])) != 2:
        raise ValueError("mask requires center and radii pairs")
    mask["center"] = [_finite(v, "mask center") for v in mask["center"]]
    mask["radii"] = [_finite(v, "mask radii") for v in mask["radii"]]
    if min(mask["radii"]) <= 0:
        raise ValueError("mask radii must be positive")
    thresholds = cfg.setdefault("thresholds", {})
    temporal = cfg.setdefault("temporal", {})
    for key, default in (("persistence", 2), ("window_frames", 4), ("reset_frames", 2)):
        v = temporal.setdefault(key, default)
        if isinstance(v, bool) or int(v) != v or v < 1:
            raise ValueError(f"temporal {key} must be a positive integer")
        temporal[key] = int(v)
    if temporal["persistence"] < 2 or temporal["reset_frames"] < 2:
        raise ValueError("at least two persistence and reset frames are required")
    if temporal["window_frames"] < temporal["persistence"]:
        raise ValueError("window_frames must be >= persistence")
    temporal["refractory_seconds"] = _finite(temporal.get("refractory_seconds", .3), "refractory")
    if temporal["refractory_seconds"] < 0:
        raise ValueError("refractory_seconds must be nonnegative")
    temporal["reset_threshold"] = _finite(temporal.get("reset_threshold", thresholds.get("reset", .45)), "reset")
    templates = cfg.get("templates")
    if not isinstance(templates, list) or not templates:
        raise ValueError("templates must be a nonempty list")
    for index, template in enumerate(templates):
        asset = (base / template["path"]).resolve()
        if asset.suffix.lower() != ".npy" or not asset.is_file():
            raise ValueError(f"template asset missing or not .npy: {asset}")
        array = np.load(asset, allow_pickle=False)
        if array.shape != (size[1], size[0]) or not np.issubdtype(array.dtype, np.number):
            raise ValueError("template shape must match output_size (height,width)")
        if not np.isfinite(array).all():
            raise ValueError("template values must be finite")
        template["path"] = str(asset)
        template.setdefault("name", asset.stem or str(index))
        template.setdefault("representation", "grayscale")
        if template["representation"] not in ("grayscale", "gradient"):
            raise ValueError("template representation must be grayscale or gradient")
        template["threshold"] = _finite(template.get("threshold", thresholds.get("match", .75)), "match")
        if not 0 <= temporal["reset_threshold"] < template["threshold"] <= 1:
            raise ValueError("require 0 <= reset_threshold < match threshold <= 1")
    cfg["_profile_dir"] = str(base)
    # Catch empty/flat templates early, not halfway through scanning.
    _template_vectors(cfg)
    return cfg


def ellipse_mask(profile: dict) -> np.ndarray:
    width, height = profile["output_size"]
    yy, xx = np.ogrid[:height, :width]
    cx, cy = profile["mask"]["center"]
    rx, ry = profile["mask"]["radii"]
    return (((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1).astype(np.float32)


def gradient_features(frames: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Masked L2-normalized spatial Sobel magnitude; never filter time axis."""
    frames = np.asarray(frames, dtype=np.float32)
    if frames.ndim < 2 or frames.shape[-2:] != mask.shape:
        raise ValueError("frames must end in the mask's spatial dimensions")
    # ndimage.sobel smooths *other* axes too, so calling it on a TxHxW
    # tensor would inadvertently mix time. Apply to individual 2D frames.
    gradient = np.empty_like(frames)
    planes = frames.reshape((-1,) + mask.shape)
    out = gradient.reshape((-1,) + mask.shape)
    for i, frame in enumerate(planes):
        out[i] = np.hypot(sobel(frame, axis=1), sobel(frame, axis=0))
    return _normalize(gradient * mask)


def _normalize(array):
    array = np.asarray(array, dtype=np.float32)
    norm = np.sqrt(np.sum(array * array, axis=(-2, -1), keepdims=True))
    return np.divide(array, norm, out=np.zeros_like(array), where=norm > 1e-12)


def _template_vectors(profile):
    mask = ellipse_mask(profile)
    result = []
    for template in profile["templates"]:
        array = np.load(template["path"], allow_pickle=False).astype(np.float32)
        vector = (gradient_features(array, mask) if template["representation"] == "grayscale"
                  else _normalize(array * mask))
        if not np.any(vector):
            raise ValueError(f"template has no masked gradient energy: {template['name']}")
        result.append(vector.ravel())
    return np.stack(result)


def detect_temporal(times, scores, *, threshold=.75, reset_threshold=.45,
                    persistence=2, window_frames=4, reset_frames=2,
                    refractory_seconds=.3, valid=None) -> list[dict]:
    """Pure rising-edge detector, anchored at first hit, not animation peak.

    Starts unarmed: two low frames establish absence, avoiding an emblem already
    visible at source start. Invalid/scene-cut frames do not count as resets or
    persistence. A sustained emblem emits once until two strict-low reset frames.
    Threshold can be a per-sample vector (for multiple template thresholds).
    """
    ts, sc = np.asarray(times, dtype=float), np.asarray(scores, dtype=float)
    th = np.broadcast_to(np.asarray(threshold, dtype=float), sc.shape)
    ok = np.ones(sc.shape, dtype=bool) if valid is None else np.asarray(valid, dtype=bool)
    if ts.ndim != 1 or sc.shape != ts.shape or ok.shape != ts.shape:
        raise ValueError("times, scores and valid must be equal-length 1D sequences")
    if not np.isfinite(ts).all() or not np.isfinite(sc).all() or not np.isfinite(th).all():
        raise ValueError("times/scores/thresholds must be finite")
    if np.any(ts < 0) or np.any(np.diff(ts) <= 0):
        raise ValueError("times must be nonnegative and strictly increasing")
    if not math.isfinite(reset_threshold) or np.any(th <= reset_threshold):
        raise ValueError("match threshold must exceed finite reset threshold")
    if (persistence < 2 or reset_frames < 2 or window_frames < persistence
            or any(int(v) != v for v in (persistence, reset_frames, window_frames))
            or not math.isfinite(refractory_seconds) or refractory_seconds < 0):
        raise ValueError("invalid temporal rules")
    events, pending = [], []
    armed, lows, last = False, 0, -math.inf
    for i, (t, score) in enumerate(zip(ts, sc)):
        if not ok[i]:
            pending.clear()
            lows = 0
            continue
        if score < reset_threshold:
            lows += 1
            if lows >= reset_frames:
                armed = True
                pending.clear()
        else:
            lows = 0
        if not armed:
            continue
        pending = [j for j in pending if i - j < window_frames]
        if score >= th[i]:
            if not pending and t - last < refractory_seconds:
                continue
            pending.append(i)
            if len(pending) >= persistence:
                first = pending[0]
                peak = max(pending, key=lambda j: sc[j])
                events.append({"t": float(ts[first]), "score": float(sc[peak]),
                               "index": int(first), "peak_index": int(peak),
                               "persistence": len(pending), "confirmed_at": float(t)})
                last = float(ts[first])
                armed = False
                pending.clear()
    return events


def _read_roi(path, start, count, width, height, profile):
    hz = profile["sample_hz"]
    x, y, w, h = profile["roi"]
    px, py = min(width - 1, round(x * width)), min(height - 1, round(y * height))
    pw, ph = min(width - px, max(1, round(w * width))), min(height - py, max(1, round(h * height)))
    ow, oh = profile["output_size"]
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{start:.9f}",
           "-i", str(path), "-map", "0:v:0", "-an", "-sn", "-dn", "-vf",
           f"crop={pw}:{ph}:{px}:{py},scale={ow}:{oh}:flags=area,format=gray,fps=fps={hz}:start_time=0",
           "-frames:v", str(count), "-f", "rawvideo", "-pix_fmt", "gray", "pipe:1"]
    proc = subprocess.run(cmd, capture_output=True, timeout=max(120, count / hz * 8))
    if proc.returncode:
        raise RuntimeError("FFmpeg ROI scan failed: " + proc.stderr.decode("utf-8", "replace")[-800:])
    frame_bytes = ow * oh
    if len(proc.stdout) % frame_bytes:
        raise RuntimeError("FFmpeg returned an incomplete grayscale frame")
    return np.frombuffer(proc.stdout, dtype=np.uint8).reshape(-1, oh, ow)


def _audio_records(audio_events):
    result = []
    for event in audio_events or []:
        item = event.to_dict() if hasattr(event, "to_dict") else dict(event)
        value = item.get("t", item.get("source_audio_event"))
        if value is None:
            raise ValueError("audio candidates require t or source_audio_event")
        t = _finite(value, "audio event time")
        if t < 0:
            raise ValueError("audio event time must be nonnegative")
        item["t"] = t
        result.append(item)
    return sorted(result, key=lambda e: (e["t"], json.dumps(e, sort_keys=True)))


def associate_events(source, visual_events, profile, audio_events=None):
    """Serialize detections with nearest actual audio in [-.22,+.04] seconds.

    audio_delta = audio time minus visual time. Never fabricate an audio anchor.
    """
    source = str(Path(source).resolve())
    audio = _audio_records(audio_events)
    out = []
    for event in visual_events:
        t = float(event["t"])
        choices = [a for a in audio
                   if (not a.get("source") or str(Path(a["source"]).resolve()) == source)
                   and -.22 - 1e-9 <= a["t"] - t <= .04 + 1e-9]
        nearest = min(choices, key=lambda a: (abs(a["t"] - t), a["t"])) if choices else None
        confirmed = bool(profile["calibrated_profile"] and nearest is not None)
        template = event.get("template", profile["templates"][0]["name"])
        method = f"pov_icon_temporal:{profile.get('name', PROFILE_VERSION)}:{profile['version']}"
        out.append({"source": source, "source_visual_event": t,
                    "source_audio_event": nearest["t"] if nearest else None,
                    "confidence": float(event["score"]),
                    "confidence_kind": "template_cosine_not_probability",
                    "confirmed": confirmed, "status": "confirmed" if confirmed else "candidate",
                    "confirmation": method + ("+nearby_audio" if nearest else "+audio_missing")
                    + ("" if profile["calibrated_profile"] else "+uncalibrated"),
                    "profile": profile["version"],
                    "evidence": {"template": template, "score": float(event["score"]),
                                 "persistence": event["persistence"],
                                 "audio_delta": nearest["t"] - t if nearest else None,
                                 "calibrated_profile": profile["calibrated_profile"],
                                 "match_threshold": event.get("threshold"),
                                 "reset_threshold": profile["temporal"]["reset_threshold"]},
                    "limitations": list(LIMITATIONS)})
    return out


def scan(path, profile, audio_events=None, chunk_seconds=20) -> list[dict]:
    """Scan a full source in bounded chunks, preserving temporal state across them."""
    cfg = load_profile(profile)
    chunk_seconds = _finite(chunk_seconds, "chunk_seconds")
    if chunk_seconds <= 0 or chunk_seconds > 120:
        raise ValueError("chunk_seconds must be in (0,120]")
    source = Path(path).resolve()
    media = probe(source)
    if not media.video or media.video.width <= 0 or media.video.height <= 0 or media.duration <= 0:
        raise ValueError("POV scan requires a video stream with dimensions and duration")
    hz = cfg["sample_hz"]
    chunk_count = max(1, round(chunk_seconds * hz))
    total = math.ceil(media.duration * hz)
    vectors, mask = _template_vectors(cfg), ellipse_mask(cfg)
    times, scores, winners, validity = [], [], [], []
    thresholds = np.array([t["threshold"] for t in cfg["templates"]])
    guard = cfg.get("guard", {})
    min_std = _finite(guard.get("min_std", 2.0), "guard min_std")
    bright_mean = _finite(guard.get("max_mean", 245.0), "guard max_mean")
    max_change = _finite(guard.get("max_change", 55.0), "guard max_change")
    previous = None
    for offset in range(0, total, chunk_count):
        frames = _read_roi(source, offset / hz, min(chunk_count, total - offset),
                           media.video.width, media.video.height, cfg)
        if not len(frames):
            continue
        features = gradient_features(frames, mask).reshape(len(frames), -1)
        matrix = np.clip(features @ vectors.T, 0, 1)
        # Winning threshold margin, rather than largest raw cosine, honors each
        # template's separately calibrated match threshold.
        best = np.argmax(matrix - thresholds, axis=1)
        masked = frames[:, mask.astype(bool)].astype(np.float32)
        good = (masked.std(axis=1) >= min_std) & (masked.mean(axis=1) < bright_mean)
        for i, frame in enumerate(frames):
            if previous is not None and np.mean(np.abs(frame.astype(np.float32) - previous)) > max_change:
                good[i] = False
            previous = frame.astype(np.float32)
        times.extend((offset + np.arange(len(frames))) / hz)
        scores.extend(matrix[np.arange(len(frames)), best])
        winners.extend(best)
        validity.extend(good)
    if not times:
        return []
    selected_thresholds = thresholds[np.asarray(winners)]
    events = detect_temporal(times, scores, threshold=selected_thresholds,
                             valid=validity, **cfg["temporal"])
    for event in events:
        template = cfg["templates"][winners[event["peak_index"]]]
        event.update(template=template["name"], threshold=template["threshold"])
    return associate_events(source, events, cfg, audio_events)


def _content_hash(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def cache_identity(path, profile, audio_events=None, chunk_seconds=20):
    """Strong source/template content identity; thresholds, audio and version included."""
    cfg = load_profile(profile)
    source = Path(path).resolve()
    stat = source.stat()
    identity = {"version": CACHE_VERSION, "source": str(source), "size": stat.st_size,
                "mtime_ns": stat.st_mtime_ns, "source_sha256": _content_hash(source),
                "profile": cfg, "template_hashes": [_content_hash(t["path"]) for t in cfg["templates"]],
                "audio_candidates": _audio_records(audio_events), "chunk_seconds": float(chunk_seconds)}
    return hashlib.sha256(json.dumps(identity, sort_keys=True, allow_nan=False).encode()).hexdigest()


def scan_cached(path, profile, audio_events=None, chunk_seconds=20, *, cache_dir=None) -> list[dict]:
    """Versioned full-source cache, atomically written; corrupt/stale entries rescan."""
    cfg = load_profile(profile)
    audio = _audio_records(audio_events)
    key = cache_identity(path, cfg, audio, chunk_seconds)
    root = Path(cache_dir) if cache_dir is not None else Path(__file__).resolve().parent.parent / "cache" / "analysis"
    root.mkdir(parents=True, exist_ok=True)
    target = root / f"povkills-{key}.json"
    try:
        payload = json.loads(target.read_text(encoding="utf-8"))
        if (payload.get("version") == CACHE_VERSION and payload.get("identity") == key
                and isinstance(payload.get("records"), list)):
            return payload["records"]
    except (OSError, ValueError, AttributeError):
        pass
    records = scan(path, cfg, audio, chunk_seconds)
    filename = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=root, delete=False) as stream:
            filename = stream.name
            json.dump({"version": CACHE_VERSION, "identity": key, "records": records}, stream, allow_nan=False)
        os.replace(filename, target)
    finally:
        if filename and os.path.exists(filename):
            os.unlink(filename)
    return records
