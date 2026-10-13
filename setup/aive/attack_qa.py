"""Bounded independent stem attack evidence, NOT perceptual certification.

measure_attack_alignment(manifest, plan) accepts mappings or JSON paths. Stem
clocks are output clocks. Assignment music_time/music_interval are absolute
song-source clocks, translated by manifest.music_start_sample/config.sample_rate
(or plan.music_start). Candidate attack_interval is absolute game source time
and is retained as provenance, never used as a measured output attack.

Only the two retained stems are decoded, from PCM sample zero, at 24 kHz.
No source/stem correlations, detector labels, or planned_error_ms can establish
an attack or a pass. A pass means conservative heuristic acoustic alignment
only; musical_sync remains unverified. Final mix/masking is not inspected.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
import subprocess
import tempfile
import threading
import time

import numpy as np
from scipy import signal

from .media_identity import MediaIdentityError, capture_file_identity, valid_file_identity

VERSION = "attack-qa/v1"
SAMPLE_RATE = 24000
MAX_DURATION = 120.0
MAX_ASSIGNMENTS = 32
MAX_JSON_BYTES = 8 * 1024 * 1024
MAX_DECODE_BYTES = 48 * 1024 * 1024  # aggregate disk PCM, stereo float32
MAX_STEM_IDENTITY_BYTES = 128 * 1024 * 1024  # per actual retained stem
SEARCH_SECONDS = .050
CONTEXT_SECONDS = .100
TOLERANCE_MS = 12.0


class EvidenceError(RuntimeError):
    """Missing, ambiguous or resource-bounded acoustic evidence."""


def _number(value, name, maximum=float("inf")):
    if isinstance(value, bool):
        raise ValueError(f"invalid {name}")
    try:
        value = float(value)
    except (ValueError, TypeError, OverflowError) as exc:
        raise ValueError(f"invalid {name}") from exc
    if not math.isfinite(value) or not 0 <= value <= maximum:
        raise ValueError(f"invalid {name}")
    return value


def _object(value):
    if isinstance(value, (str, Path)):
        with Path(value).open("rb") as handle:
            data = handle.read(MAX_JSON_BYTES + 1)
        if len(data) > MAX_JSON_BYTES:
            raise ValueError("manifest/plan JSON byte limit exceeded")
        value = json.loads(data.decode("utf-8-sig"))
    if not isinstance(value, dict):
        raise ValueError("manifest and plan must be objects")
    return value


def _decode(path, target, end, ffmpeg, timeout, budget):
    """No compressed seek, no stdout PCM allocation; exact bounded output."""
    if not isinstance(path, (str, Path)) or not Path(path).is_file():
        raise EvidenceError("stem missing or not a local file")
    end = _number(end, "decode duration", MAX_DURATION)
    count = math.ceil(end * SAMPLE_RATE)
    expected = count * 8
    if expected > budget:
        raise EvidenceError("aggregate decoded byte limit exceeded")
    args = [str(ffmpeg), "-hide_banner", "-loglevel", "error", "-nostdin",
            "-threads", "1", "-i", str(path), "-map", "0:a:0", "-vn",
            "-ac", "2", "-ar", str(SAMPLE_RATE), "-t", f"{end:.9f}",
            "-f", "f32le", "pipe:1"]
    # Cap bytes while draining, not merely after FFmpeg exits. Malformed output
    # must not fill temporary storage within an otherwise valid timeout.
    cap = min(budget, expected + 8)
    overflow, done, failures = threading.Event(), threading.Event(), []
    try:
        proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise EvidenceError(f"stem decode failed: {exc}") from exc
    def drain():
        try:
            written = 0
            with target.open("wb") as handle:
                while True:
                    block = proc.stdout.read(65536)
                    if not block:
                        break
                    room = cap - written
                    handle.write(block[:room])
                    written += min(len(block), room)
                    if len(block) > room:
                        overflow.set()
                        break
        except OSError as exc:
            failures.append(str(exc))
        finally:
            proc.stdout.close()
            done.set()
    worker = threading.Thread(target=drain, daemon=True)
    worker.start()
    deadline = time.monotonic() + timeout
    try:
        while proc.poll() is None or not done.is_set():
            if overflow.is_set():
                raise EvidenceError("decoded PCM byte limit exceeded during streaming")
            if time.monotonic() >= deadline:
                raise EvidenceError("stem decode failed: time bound exceeded")
            done.wait(.01) if not done.is_set() else time.sleep(.01)
    finally:
        if proc.poll() is None:
            proc.kill()
        proc.wait(timeout=5)
        worker.join(timeout=5)
    if worker.is_alive():
        raise EvidenceError("stem decode pipe did not terminate")
    if failures:
        raise EvidenceError("stem PCM output unavailable")
    if overflow.is_set():
        raise EvidenceError("decoded PCM byte limit exceeded during streaming")
    if proc.returncode:
        raise EvidenceError(f"stem decode failed (FFmpeg exit {proc.returncode})")
    size = target.stat().st_size
    if not size or size % 8 or size > budget or size > expected + 8:
        raise EvidenceError("unexpected or over-budget decoded PCM size")
    return np.memmap(target, dtype="<f4", mode="r", shape=(size // 8, 2)), size


def _attack(pcm, expected, kind):
    """Multiband 4 ms trailing RMS, 1 ms hop, positive 2 ms slope.

    Reported +/-4 ms ranges are heuristic localization resolution, not
    calibrated confidence bounds or universal latency compensation. Stereo energy
    is combined after squaring (opposite phase channels do not cancel).
    """
    result = dict(status="unmeasurable", expected_time=expected,
                  time=None, attack_range=None, candidates=[], method="multiband-4ms-rms-slope",
                  range_basis="heuristic +/-4 ms localization; not calibrated confidence",
                  diagnostics=dict(version="attack-diagnostics/v1", decision_effect="none",
                                   band_summary=[], peaks=[],
                                   note="Robust change is descriptive, not calibrated confidence or attack identity."))
    first = max(0, math.floor((expected - CONTEXT_SECONDS) * SAMPLE_RATE))
    last = math.ceil((expected + CONTEXT_SECONDS) * SAMPLE_RATE)
    if first == 0 or last > len(pcm):
        result["detail"] = "insufficient context near stem origin/end"
        return result
    x = np.array(pcm[first:last], dtype=np.float64)
    if not np.isfinite(x).all():
        result["detail"] = "nonfinite PCM"
        return result
    if np.sqrt(np.mean(x*x)) < 1e-5:
        result["detail"] = "silent or near-silent stem window"
        return result
    bands = ((1500, 5000), (5000, 10000)) if kind == "game" else ((40, 250), (250, 1500), (1500, 6000))
    window, hop = 96, 24
    envelopes = []
    for low, high in bands:
        sos = signal.butter(2, (low, high), btype="bandpass", fs=SAMPLE_RATE, output="sos")
        y = signal.sosfilt(sos, x, axis=0)
        power = np.mean(y*y, axis=1)
        sums = np.r_[0., np.cumsum(power)]
        ends = np.arange(window, len(x)+1, hop)
        envelopes.append(np.sqrt(np.maximum(0, (sums[ends]-sums[ends-window])/window)))
    envelopes = np.array(envelopes)
    times = (first + ends - 1) / SAMPLE_RATE
    # Normalize useful bands independently, preventing bass from hiding game
    # transients or a bright music attack from being suppressed by bass energy.
    useful = np.max(envelopes, axis=1) > 2e-5
    # Additive evidence only: keep the historical fused envelope and gates.
    # Local median/MAD is computed on each raw band, not peak-normalized energy.
    diagnostics = result["diagnostics"]
    band_changes = []
    for index, envelope in enumerate(envelopes):
        signed_change = envelope - np.r_[envelope[:2], envelope[:-2]]
        changes = np.maximum(0, signed_change)
        band_changes.append(changes)
        # Use signed slope for the noise floor: rectifying first often makes
        # median/MAD zero and produces misleadingly enormous diagnostic ratios.
        median = float(np.median(signed_change))
        mad = float(np.median(np.abs(signed_change-median)))
        scale = max(1.4826*mad, float(np.max(envelope))*1e-6, 1e-12)
        diagnostics["band_summary"].append(dict(
            band_hz=list(bands[index]), useful=bool(useful[index]),
            peak_rms=float(np.max(envelope)), median_change=median,
            mad_change=mad, robust_scale=scale,
            max_robust_change=float(max(0., (float(np.max(changes))-median)/scale))))
    if not useful.any():
        result["detail"] = "no measurable energy in analysis bands"
        return result
    env = np.max(envelopes[useful] / np.max(envelopes[useful], axis=1)[:, None], axis=0)
    baseline = float(np.median(env))
    slope = np.maximum(0, env - np.r_[env[:2], env[:-2]])
    peaks, _ = signal.find_peaks(slope, height=max(.12, float(np.max(slope))*.28),
                                 prominence=.08, distance=8)
    diagnostics["fused_baseline"] = baseline
    diagnostics["peak_height_gate"] = max(.12, float(np.max(slope))*.28)
    diagnostics["peak_count"] = int(len(peaks))
    candidates = []
    for p in peaks:
        evidence = dict(peak_time=float(times[p]), strength=float(slope[p]),
                        status="rejected", reasons=[], band_change=[])
        for index, summary in enumerate(diagnostics["band_summary"]):
            change = float(band_changes[index][p])
            evidence["band_change"].append(dict(
                band_hz=summary["band_hz"], useful=summary["useful"], change=change,
                robust_change=max(0., (change-summary["median_change"])/summary["robust_scale"])))
        diagnostics["peaks"].append(evidence)
        if abs(float(times[p])-expected) > SEARCH_SECONDS + .004:
            evidence["reasons"].append("peak_outside_search")
            continue
        left = max(0, p-10)
        # Sustained/noisy/harmonic energy without a local rise is not an onset.
        floor = float(np.min(env[left:p+1]))
        top = float(np.max(env[p:min(len(env), p+5)]))
        evidence.update(local_floor=floor, local_top=top)
        if top < .3:
            evidence["reasons"].append("insufficient_local_peak")
        if floor > .5*top:
            evidence["reasons"].append("insufficient_local_rise")
        if baseline > .65:
            evidence["reasons"].append("high_sustained_baseline")
        if evidence["reasons"]:
            continue
        threshold = floor + .15*(top-floor)
        crossing = p
        while crossing > left and env[crossing-1] > threshold:
            crossing -= 1
        t = float(times[crossing])
        evidence.update(onset_time=t, crossing_threshold=threshold)
        if abs(t-expected) > SEARCH_SECONDS:
            evidence["reasons"].append("onset_outside_search")
            continue
        evidence["status"] = "accepted_before_deduplication"
        candidate = dict(time=t, attack_range=[max(0., t-.004), t+.004],
                         strength=float(slope[p]))
        if candidates and t-candidates[-1]["time"] < .010:
            if candidate["strength"] > candidates[-1]["strength"]:
                candidates[-1] = candidate
        else:
            candidates.append(candidate)
    result["candidates"] = candidates
    result["bands_hz"] = [list(band) for band in bands]
    if not candidates:
        result["detail"] = "no isolated salient attack within +/-50 ms"
    elif len(candidates) > 1:
        result.update(status="ambiguous", detail="multiple plausible attacks within +/-50 ms")
    else:
        result.update(status="measured", time=candidates[0]["time"],
                      attack_range=candidates[0]["attack_range"])
    return result


def _candidate(plan, assignment):
    event_id = assignment.get("event_id")
    if not isinstance(event_id, str) or not event_id.strip():
        raise ValueError("assignment requires a nonempty shot event_id")
    index = assignment.get("clip_index")
    timeline = plan.get("timeline", [])
    if isinstance(index, bool) or not isinstance(index, int) or not 0 <= index < len(timeline):
        raise ValueError("assignment clip_index is outside timeline")
    events = timeline[index].get("candidate_events", [])
    found = [e for e in events if isinstance(e, dict) and e.get("id") == assignment.get("event_id")]
    if len(found) != 1:
        raise ValueError("assignment event_id must identify exactly one clip candidate")
    event = found[0]
    source = _number(event.get("source_audio_event", event.get("time")), "candidate source time")
    if abs(source - _number(assignment.get("source_time"), "source_time")) > .002:
        raise ValueError("assignment source_time differs from candidate")
    output = _number(event.get("output_audio_event"), "candidate output time", MAX_DURATION)
    if abs(output - _number(assignment.get("output_time"), "output_time", MAX_DURATION)) > .002:
        raise ValueError("assignment output_time differs from candidate")
    return event, output


def measure_attack_alignment(manifest, plan):
    """Return JSON-safe attack-qa/v1; invalid/missing evidence warns, not passes.

    <=32 assignments, timeline duration <=120 s; fixed 24 kHz, aggregate PCM
    <=48 MiB, per-decode timeout <=60 s. Each retained stem is hashed before/after
    decode (<=128MiB, same per-stage timeout); unknown identity leaves labels unbound.
    Ordinary stem mutation discards its acoustic measurements. No source media is
    rehashed here: renderer-bound source identities are separately supplied provenance.
    Optional attack_qa_options accepts
    max_decode_bytes (may lower the cap) and timeout. No files are persisted.
    """
    report = dict(schema_version=VERSION, status="warn", acoustic_alignment="warn",
                  musical_sync="unverified", assignments=[], issues=[],
                  final_mix=dict(status="not_inspected"),
                  source_identities={}, stem_identity_evidence={},
                  source_media_provenance=dict(status="unavailable", identities={}),
                  limitations=["Acoustic attack overlap is heuristic, not perceptual certification.",
                               "Candidate identity does not establish gunshot or strong musical-hit identity.",
                               "No reviewed semantic evidence is evaluated; musical sync is unverified.",
                               "Final mix audibility, masking, and artistic quality are not inspected."])
    try:
        manifest, plan = _object(manifest), _object(plan)
        duration = _number(manifest.get("audio_duration", manifest.get("plan_duration", plan.get("duration"))), "duration", MAX_DURATION)
        if duration <= 0:
            raise ValueError("duration must be positive")
        for value in (manifest.get("plan_duration"), plan.get("duration")):
            if value is not None:
                _number(value, "plan duration", MAX_DURATION)
        assignments = plan.get("rhythm_assignments", [])
        if not isinstance(assignments, list) or len(assignments) > MAX_ASSIGNMENTS:
            raise ValueError("at most 32 rhythm assignments required")
        options = manifest.get("attack_qa_options", {})
        budget = int(_number(options.get("max_decode_bytes", MAX_DECODE_BYTES), "byte limit", MAX_DECODE_BYTES))
        timeout = _number(options.get("timeout", 30), "timeout", 60)
        if timeout < 1 or budget < 8:
            raise ValueError("invalid decode bounds")
        cfg = manifest.get("config", {})
        binding = manifest.get("media_identity_binding", {})
        media = manifest.get("media_content_identities", {})
        if (isinstance(binding, dict) and binding.get("schema") == "render-media-binding/v1" and
                binding.get("status") == "checked_before_after" and isinstance(media, dict) and
                media and len(media) <= 65 and all(valid_file_identity(v) for v in media.values())):
            report["source_media_provenance"] = dict(status="supplied_render_binding", identities=media,
                limitation="Persisted renderer provenance, not reauthenticated by attack QA or semantic review.")
        if "music_start_sample" in manifest:
            rate = _number(cfg.get("sample_rate", 48000), "manifest sample rate")
            if not rate:
                raise ValueError("manifest sample rate must be positive")
            music_start = _number(manifest["music_start_sample"], "music start sample") / rate
        else:
            music_start = _number(plan.get("music_start", 0), "music start")
        normalized = []
        for index, assignment in enumerate(assignments):
            row = dict(assignment_index=index, status="warn", musical_sync="unverified",
                       game_attack=None, music_attack=None, offset_ms=None, offset_range_ms=None)
            report["assignments"].append(row)
            try:
                if not isinstance(assignment, dict):
                    raise ValueError("assignment must be an object")
                row.update(clip_index=assignment.get("clip_index"), event_id=assignment.get("event_id"),
                           music_hit_id=assignment.get("music_hit_id"))
                event, gt = _candidate(plan, assignment)
                row["candidate_attack_interval_source"] = event.get("attack_interval")
                row["music_interval_source"] = assignment.get("music_interval")
                row["expected_game_time"] = gt
                matched = assignment.get("matched") is True
                mt = None
                if matched:
                    if assignment.get("music_hit_id") is None:
                        raise ValueError("matched assignment lacks music hit identity")
                    mt = _number(assignment.get("music_time"), "music time") - music_start
                    _number(mt, "music output time", duration)
                row["matched"] = matched
                row["expected_music_time"] = mt
                if gt > duration:
                    raise ValueError("game time exceeds duration")
                normalized.append((row, gt, mt))
            except (ValueError, TypeError, KeyError, AttributeError) as exc:
                row["detail"] = str(exc)
        if normalized:
            end = min(duration, max(max(gt, mt or 0) for _, gt, mt in normalized)+CONTEXT_SECONDS+.001)
            with tempfile.TemporaryDirectory(prefix="attack-qa-") as temp:
                decoded, errors, total = {}, {}, 0
                try:
                    for kind in ("game", "music"):
                        stem, target = manifest.get(kind+"_stem"), Path(temp)/(kind+".f32")
                        evidence = dict(status="unavailable", method="full-file SHA256 before/after sample-zero decode",
                                        clock="output_seconds_from_first_decoded_sample")
                        report["stem_identity_evidence"][kind] = evidence
                        before = None
                        try:
                            before = capture_file_identity(stem, max_bytes=MAX_STEM_IDENTITY_BYTES, timeout=timeout)
                        except MediaIdentityError as exc:
                            evidence["detail"] = str(exc)
                        try:
                            pcm, size = _decode(stem, target, end, cfg.get("ffmpeg", "ffmpeg"), timeout, budget-total)
                            total += size
                            if before is not None:
                                try:
                                    after = capture_file_identity(stem, max_bytes=MAX_STEM_IDENTITY_BYTES, timeout=timeout)
                                    if before != after:
                                        raise MediaIdentityError("stem content changed during decode")
                                except MediaIdentityError as exc:
                                    pcm._mmap.close()
                                    evidence.update(status="changed_or_unavailable", detail=str(exc))
                                    raise EvidenceError("stem identity changed/unavailable after decode") from exc
                                try:
                                    pcm_hash = capture_file_identity(target, max_bytes=MAX_DECODE_BYTES,
                                                                     timeout=timeout)["sha256"]
                                except MediaIdentityError as exc:
                                    pcm._mmap.close()
                                    evidence.update(status="unavailable", detail=str(exc))
                                    raise EvidenceError("decoded PCM identity unavailable") from exc
                                report["source_identities"][kind] = before
                                evidence.update(status="checked_before_after", identity=before,
                                                decoded_end=end, sample_rate=SAMPLE_RATE,
                                                pcm_format="stereo interleaved little-endian float32", decoded_bytes=size,
                                                decoded_pcm_sha256=pcm_hash)
                            decoded[kind] = pcm
                        except (EvidenceError, MediaIdentityError) as exc:
                            errors[kind] = str(exc)
                    for row, gt, mt in normalized:
                        for kind, t in (("game", gt), ("music", mt)):
                            if t is not None:
                                row[kind+"_attack"] = (_attack(decoded[kind], t, kind) if kind in decoded
                                    else dict(status="unmeasurable", time=None, attack_range=None, detail=errors[kind]))
                        if mt is None:
                            row["detail"] = "unmatched assignment; no musical alignment claim"
                            continue
                        game, music = row["game_attack"], row["music_attack"]
                        if game["status"] != "measured" or music["status"] != "measured":
                            row["detail"] = "independent attacks missing or ambiguous"
                            continue
                        ga, ma = game["attack_range"], music["attack_range"]
                        row["offset_ms"] = 1000*(game["time"]-music["time"])
                        row["offset_range_ms"] = [1000*(ga[0]-ma[1]), 1000*(ga[1]-ma[0])]
                        row["attack_range_overlap_ms"] = 1000*max(0., min(ga[1], ma[1])-max(ga[0], ma[0]))
                        # Entire uncertainty interval must fit the tolerance.
                        row["status"] = "pass" if max(abs(v) for v in row["offset_range_ms"]) <= TOLERANCE_MS else "warn"
                        row["detail"] = "heuristic acoustic alignment only" if row["status"] == "pass" else "measured attacks outside conservative tolerance"
                    report["decode"] = dict(sample_rate=SAMPLE_RATE, origin="PCM sample zero",
                                            bytes_written=total, max_decode_bytes=budget,
                                            max_duration_seconds=MAX_DURATION, decoded_end=end)
                finally:
                    for pcm in decoded.values():
                        pcm._mmap.close()
        else:
            report["issues"].append("no measurable assignments")
    except (ValueError, TypeError, OverflowError, KeyError, OSError, AttributeError) as exc:
        report["issues"].append(str(exc))
    rows = report["assignments"]
    if rows and not report["issues"] and all(r["status"] == "pass" for r in rows):
        report["acoustic_alignment"] = "pass"
    # Overall status intentionally warns even if acoustic alignment passes.
    report["tolerance_ms"] = TOLERANCE_MS
    report["offset_convention"] = "game minus music; positive means game attack is later"
    return json.loads(json.dumps(report, allow_nan=False))
