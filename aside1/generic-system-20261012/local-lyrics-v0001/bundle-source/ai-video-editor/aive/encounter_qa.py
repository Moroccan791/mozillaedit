"""Independent decoded-media evidence for encounter renders, not a detector.

verify_encounters(manifest, plan=None, *, output_path=None) returns JSON-safe
pass/warn/fail components. Reports are written only when output_path is given.
No renderer/planner state is mutated. Visual heuristics never veto taste or
semantic content. Missing/ambiguous evidence is a warning, not a claimed pass.

PCM is decoded from sample zero (never compressed -ss) into temporary disk
memmaps, only as far as the last requested window. Windows, subprocess time,
source duration, and decoded bytes are bounded. Cache lifetime is one call.
"""
from __future__ import annotations

import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import time

import numpy as np


class EvidenceError(RuntimeError):
    pass


def _number(value, name, lo=0, hi=float("inf")):
    if isinstance(value, bool):
        raise ValueError(f"invalid {name}")
    value = float(value)
    if not math.isfinite(value) or not lo <= value <= hi:
        raise ValueError(f"invalid {name}")
    return value


def _path(value):
    if not isinstance(value, (str, Path)) or not str(value).strip():
        raise ValueError("missing media path")
    result = Path(value).resolve()
    if not result.is_file():
        raise ValueError(f"media file missing: {result}")
    return str(result)


def _run(args, timeout, **kwargs):
    try:
        proc = subprocess.run(args, timeout=timeout, stderr=subprocess.PIPE,
                              check=False, **kwargs)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise EvidenceError(str(exc)) from exc
    if proc.returncode:
        tail = (proc.stderr or b"").decode(errors="replace")[-1500:]
        raise EvidenceError(f"subprocess exit {proc.returncode}: {tail}")
    return proc


class _PCMCache:
    """Per file/rate disk cache; no full-day PCM Python bytes allocation."""
    def __init__(self, directory, ffmpeg, rate, timeout, max_seconds, max_bytes):
        self.directory, self.ffmpeg, self.rate = Path(directory), ffmpeg, rate
        self.timeout, self.max_seconds, self.max_bytes = timeout, max_seconds, max_bytes
        self.max_total_bytes = max_bytes * 4
        self.entries = {}
        self.decode_count = 0
        self.decoded_bytes = 0

    def prepare(self, path, end):
        path = _path(path)
        end = _number(end, "decode end", 0, self.max_seconds)
        key = (path, self.rate)
        if key in self.entries and self.entries[key][1] >= end:
            return
        expected = math.ceil((end + .02) * self.rate) * 8
        if expected > self.max_bytes or self.decoded_bytes + expected > self.max_total_bytes:
            raise EvidenceError(f"bounded decode byte limit exceeded: {path}")
        target = self.directory / f"pcm-{len(self.entries):04d}-{self.decode_count}.f32"
        # Output -t bounds data written. Input starts at the true origin, so
        # codec skip / MP3 encoder delay is handled consistently by FFmpeg.
        with target.open("wb") as handle:
            _run([self.ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin",
                  "-threads", "1", "-i", path, "-t", f"{end+.02:.9f}",
                  "-map", "0:a:0", "-vn", "-ac", "2", "-ar", str(self.rate),
                  "-f", "f32le", "pipe:1"], self.timeout, stdout=handle)
        size = target.stat().st_size
        if not size or size % 8 or size > self.max_bytes:
            raise EvidenceError(f"unexpected bounded PCM size: {path}")
        data = np.memmap(target, dtype="<f4", mode="r", shape=(size//8, 2))
        if key in self.entries:
            self.entries[key][0]._mmap.close()
        self.entries[key] = (data, end)
        self.decode_count += 1
        self.decoded_bytes += size

    def window(self, path, start, count):
        start = _number(start, "PCM window start")
        key = (_path(path), self.rate)
        if key not in self.entries:
            raise EvidenceError("PCM cache was not prepared")
        data = self.entries[key][0]
        first = round(start * self.rate)
        if first + count > len(data):
            raise EvidenceError(f"PCM window exceeds decoded file: {path}")
        return np.array(data[first:first+count], dtype=np.float64)

    def close(self):
        for data, _ in self.entries.values():
            data._mmap.close()
        self.entries.clear()


def _corr_trials(reference, heard, radius, step):
    """Vectorized normalized, DC-removed correlation over all trial shifts."""
    n = len(reference)
    offsets = np.arange(-radius, radius+1, step, dtype=int)
    windows = np.lib.stride_tricks.sliding_window_view(heard, n, axis=0)
    # sliding_window_view shape is (candidate, channel, sample).
    trials = windows[radius+offsets].transpose(0, 2, 1).reshape(len(offsets), -1)
    ref = reference.reshape(-1).copy()
    ref -= ref.mean()
    trials = trials - trials.mean(axis=1, keepdims=True)
    energy = np.sum(trials*trials, axis=1)
    norm = np.linalg.norm(ref)
    if norm < 1e-6 or np.max(energy) < 1e-12:
        raise EvidenceError("silent/constant PCM cannot establish timing")
    scores = (trials @ ref) / np.maximum(norm*np.sqrt(energy), 1e-20)
    best = max(range(len(scores)), key=lambda i: (float(scores[i]), -abs(int(offsets[i]))))
    return float(scores[best]), int(offsets[best]), scores, offsets


def _audio_evidence(cache, reference_path, reference_time, output_path, output_time,
                    before, length, search_ms, tolerance_ms, minimum):
    rate = cache.rate
    count, radius = round(length*rate), round(search_ms*rate/1000)
    # Keep a full search margin within both media origins.
    if reference_time < before or output_time < before + search_ms/1000:
        raise EvidenceError("anchor too near file origin for the configured window")
    ref = cache.window(reference_path, reference_time-before, count)
    heard = cache.window(output_path, output_time-before-search_ms/1000, count+2*radius)
    score, shift, scores, offsets = _corr_trials(ref, heard, radius, max(1, round(rate/1000)))
    shift_ms = 1000*shift/rate
    ambiguous = bool(np.any((scores >= score-.005) &
                            (np.abs(offsets-shift) > round(tolerance_ms*rate/1000))))
    status = "pass" if score >= minimum and abs(shift_ms) <= tolerance_ms else "fail"
    if ambiguous and status == "pass":
        status = "warn"
    return dict(status=status, correlation=score, shift_ms=shift_ms,
                ambiguous=ambiguous, search_ms=search_ms, tolerance_ms=tolerance_ms,
                reference_path=_path(reference_path), sample_path=_path(output_path),
                reference_time=reference_time, output_time=output_time,
                detail="positive shift means the output is late; correlation is waveform evidence only")


def _joint_evidence(cache, game_path, game_time, music_path, music_time,
                    output, output_time, before, length, search_ms, tolerance_ms):
    rate = cache.rate
    n, radius = round(length*rate), round(search_ms*rate/1000)
    refs = np.stack([cache.window(game_path, game_time-before, n).reshape(-1),
                     cache.window(music_path, music_time-before, n).reshape(-1)], axis=1)
    refs -= refs.mean(axis=0)
    if np.linalg.matrix_rank(refs) < 2 or np.linalg.cond(refs) > 1000:
        raise EvidenceError("joint references silent or ill-conditioned; gains not identifiable")
    heard = cache.window(output, output_time-before-search_ms/1000, n+2*radius)
    offsets = np.arange(-radius, radius+1, max(1, round(rate/1000)), dtype=int)
    trials = np.lib.stride_tricks.sliding_window_view(heard, n, axis=0)
    trials = trials[radius+offsets].transpose(0, 2, 1).reshape(len(offsets), -1).T.copy()
    trials -= trials.mean(axis=0)
    gains = np.linalg.lstsq(refs, trials, rcond=None)[0]
    fitted = refs @ gains
    scores = np.sum(fitted*trials, axis=0) / np.maximum(
        np.linalg.norm(fitted, axis=0)*np.linalg.norm(trials, axis=0), 1e-20)
    best = max(range(len(scores)), key=lambda i: (float(scores[i]), -abs(int(offsets[i]))))
    score, shift = float(scores[best]), 1000*int(offsets[best])/rate
    return dict(status="pass" if score >= .85 and abs(shift) <= tolerance_ms and
                bool(np.all(gains[:, best] > .001)) else "warn", correlation=score,
                shift_ms=shift, fitted_gains=[float(v) for v in gains[:, best]],
                sample_path=_path(output), reference_paths=[_path(game_path), _path(music_path)],
                detail="optional fitted mix evidence; compression, ducking and masking can lower score")


def _gray(path, timestamp, ffmpeg, timeout, width=96, height=54):
    # Video seeking is allowed; the decoded-origin restriction is for PCM.
    proc = _run([ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin",
                 "-ss", f"{timestamp:.9f}", "-i", _path(path), "-map", "0:v:0",
                 "-an", "-frames:v", "1", "-vf",
                 f"scale={width}:{height}:force_original_aspect_ratio=decrease:flags=area,"
                 f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,format=gray",
                 "-f", "rawvideo", "pipe:1"], timeout, stdout=subprocess.PIPE)
    if len(proc.stdout) != width*height:
        raise EvidenceError(f"frame unavailable at {timestamp}: {path}")
    return np.frombuffer(proc.stdout, dtype=np.uint8).astype(np.float64)


def _frame_match(source, source_time, output, output_time, fps, ffmpeg, timeout, styled):
    ref = _gray(source, source_time, ffmpeg, timeout)
    centered = ref-ref.mean()
    if np.linalg.norm(centered) < 1e-6:
        raise EvidenceError("blank/constant source frame cannot establish visual timing")
    candidates = []
    for shift in range(-2, 3):
        t = output_time+shift/fps
        if t < 0:
            continue
        try:
            heard = _gray(output, t, ffmpeg, timeout)
        except EvidenceError:
            continue
        heard -= heard.mean()
        score = float(np.dot(centered, heard)/max(np.linalg.norm(centered)*np.linalg.norm(heard), 1e-20))
        candidates.append((score, shift))
    if not candidates:
        raise EvidenceError("no output frames around anchor")
    score, shift = max(candidates, key=lambda v: (v[0], -abs(v[1])))
    return dict(status="pass" if score >= .7 and abs(shift) <= 1 else "warn",
                correlation=score, shift_frames=shift, sample_path=_path(output),
                reference_path=_path(source), output_time=output_time, source_time=source_time,
                style_present=styled, masking_sensitive=True,
                detail="visual similarity warning only; style/crops/overlays can mask matching")


def _has_visual_style(manifest, chunk, plan=None):
    """Distinguish identity clean renders from actual masking treatments."""
    if manifest.get("style") not in (None, "none", "", "clean"):
        return True
    if any(chunk.get(key) for key in ("effects", "motion", "effect_envelopes", "overlays")):
        return True
    mapping = chunk.get("time_map")
    if mapping and mapping.get("gaps") and mapping.get("strength", 0):
        return True
    return bool(plan and any(plan.get(key) for key in ("effects", "overlays", "ramps")))


def _visual_samples(output, duration, ffmpeg, timeout, samples=12):
    times = np.linspace(0, max(0, duration-.15), min(samples, max(3, int(duration*4)+1)))
    frames, evidence, unavailable = [], [], []
    for t in times:
        try:
            frame = _gray(output, float(t), ffmpeg, timeout)
        except EvidenceError as exc:
            unavailable.append(dict(path=_path(output), time=float(t), detail=str(exc)))
            continue
        frames.append(frame)
        evidence.append(dict(path=_path(output), time=float(t), mean_luma=float(frame.mean()),
                             std_luma=float(frame.std())))
    black = [e for e in evidence if e["mean_luma"] < 8 and e["std_luma"] < 5]
    white = [e for e in evidence if e["mean_luma"] > 247 and e["std_luma"] < 5]
    diffs = [float(np.mean(np.abs(b-a))) for a, b in zip(frames, frames[1:])]
    freeze = len(diffs) >= 2 and sum(d < .7 for d in diffs) >= max(2, len(diffs)//2)
    flashes = [dict(path=_path(output), time=evidence[i]["time"])
               for i in range(1, len(evidence)-1)
               if abs(evidence[i]["mean_luma"]-evidence[i-1]["mean_luma"]) > 100 and
               abs(evidence[i]["mean_luma"]-evidence[i+1]["mean_luma"]) > 100]
    return dict(status="warn" if black or white or freeze or flashes or unavailable else "pass",
                unavailable_samples=unavailable,
                black_samples=black, white_samples=white, possible_freeze=freeze,
                possible_flashes=flashes, sampled_frames=evidence, adjacent_mean_abs_differences=diffs,
                detail="sparse black/white/flash/freeze heuristic, NOT taste, semantics or photosensitivity certification")


def _parse_loudnorm(stderr):
    # Read measurement INPUT fields only, never normalized output_i/output_tp.
    for block in reversed(re.findall(r"\{[^{}]*\}", stderr)):
        try:
            data = json.loads(block)
            if "input_i" in data and "input_tp" in data:
                result = {}
                for key in ("input_i", "input_tp", "input_lra", "input_thresh"):
                    number = float(data[key])
                    result[key] = number if math.isfinite(number) else None
                return result
        except (ValueError, KeyError, TypeError):
            continue
    raise EvidenceError("loudnorm input measurements missing")


def _loudness(path, ffmpeg, timeout):
    proc = _run([ffmpeg, "-hide_banner", "-nostdin", "-i", _path(path),
                 "-map", "0:a:0", "-vn", "-af", "loudnorm=print_format=json",
                 "-f", "null", "-"], timeout, stdout=subprocess.DEVNULL)
    fields = _parse_loudnorm(proc.stderr.decode(errors="replace"))
    tp, loud = fields["input_tp"], fields["input_i"]
    status = "fail" if tp is not None and tp > 0 else "warn" if (
        tp is None or loud is None or tp > -1 or loud > -9 or loud < -30) else "pass"
    return dict(status=status, sample_path=_path(path), measurements=fields,
                possible_true_peak_clipping=bool(tp is not None and tp > 0),
                detail="input true peak >0 dBTP is clipping risk; loudness outside -30..-9 LUFS is review only")


def _structural(path, timeout):
    # qa.verify's legacy shell wrapper has no timeout. Isolate it in a bounded
    # child interpreter rather than monkeypatching shared runner globals.
    code = ("import json; from dataclasses import asdict; from aive.qa import verify; "
            "print('ENCOUNTER_QA_JSON:'+json.dumps(asdict(verify(__import__('sys').argv[1]))))")
    env = dict(os.environ)
    env.pop("PYTHONPATH", None)
    env.pop("PYTHONHOME", None)
    proc = _run([sys.executable, "-c", code, _path(path)], timeout,
                stdout=subprocess.PIPE, cwd=str(Path(__file__).resolve().parent.parent), env=env)
    text = proc.stdout.decode(errors="replace")
    marker = "ENCOUNTER_QA_JSON:"
    if marker not in text:
        raise EvidenceError("qa.verify returned no report")
    data = json.loads(text.rsplit(marker, 1)[1])
    return dict(status="pass" if all(c["ok"] for c in data["checks"]) else "fail",
                sample_path=_path(path), checks=data["checks"], detail="existing qa.verify structural battery")


def _duplicates(chunks):
    seen, overlaps = {}, []
    for i, row in enumerate(chunks):
        key = str(Path(row["source"]).resolve()).casefold() if os.name == "nt" else str(Path(row["source"]).resolve())
        start, end = _number(row["source_start"], "source start"), _number(row["source_end"], "source end")
        if end <= start:
            raise ValueError("empty/reversed source range")
        for a, b, index in seen.setdefault(key, []):
            if start < b-1e-7 and end > a+1e-7:
                overlaps.append(dict(source_path=key, chunks=[index, i], ranges=[[a, b], [start, end]]))
        seen[key].append((start, end, i))
    return dict(status="fail" if overlaps else "pass", overlaps=overlaps,
                detail="independent same-source overlapping-range check (adjacent ranges allowed)")


def _benchmark(start):
    result = {"elapsed_seconds": time.monotonic()-start}
    try:
        import resource
        usage = resource.getrusage(resource.RUSAGE_SELF)
        result.update(user_seconds=usage.ru_utime, system_seconds=usage.ru_stime,
                      process_peak_rss=usage.ru_maxrss,
                      peak_rss_unit="bytes" if sys.platform == "darwin" else "KiB")
    except ImportError:
        result["process_peak_rss"] = None
        if os.name == "nt":
            try:
                import ctypes
                from ctypes import wintypes
                class Counters(ctypes.Structure):
                    _fields_ = [("cb", wintypes.DWORD), ("PageFaultCount", wintypes.DWORD)] + [
                        (name, ctypes.c_size_t) for name in ("PeakWorkingSetSize", "WorkingSetSize",
                        "QuotaPeakPagedPoolUsage", "QuotaPagedPoolUsage", "QuotaPeakNonPagedPoolUsage",
                        "QuotaNonPagedPoolUsage", "PagefileUsage", "PeakPagefileUsage")]
                counters = Counters()
                counters.cb = ctypes.sizeof(counters)
                kernel = ctypes.WinDLL("kernel32", use_last_error=True)
                kernel.GetCurrentProcess.restype = wintypes.HANDLE
                psapi = ctypes.WinDLL("psapi", use_last_error=True)
                psapi.GetProcessMemoryInfo.argtypes = [wintypes.HANDLE, ctypes.POINTER(Counters), wintypes.DWORD]
                if psapi.GetProcessMemoryInfo(kernel.GetCurrentProcess(), ctypes.byref(counters), counters.cb):
                    result.update(process_peak_rss=int(counters.PeakWorkingSetSize), peak_rss_unit="bytes")
            except (OSError, AttributeError):
                pass
        result["memory_note"] = "process-lifetime peak, not QA-only delta; excludes FFmpeg children; disk PCM bytes separate"
    return result


def verify_encounters(manifest, plan=None, *, output_path=None):
    """Return a stable JSON-safe evidence report, optionally save it as JSON.

    manifest may be a dict or JSON filename. Predicted output audio/visual event
    times in manifest chunks are authoritative (supports future mapped motion).
    plan is an optional dict/JSON file used ONLY for missing event anchors/style
    hints, never to reimplement motion. qa_options controls bounded evidence:
    sample_rate (default 16000), timeout (120s), max_decode_seconds (3600),
    max_decode_bytes (512MiB/file, 4x aggregate disk budget), tolerance_ms (5), final_mix (True).
    Sparse QA does not prove detector correctness or unattended readiness.
    """
    started = time.monotonic()
    report = dict(schema_version="encounter-qa/v1", status="fail", ok=False, components={}, issues=[],
                  anchors=[], limitations=["Does not verify detector correctness, event semantics or artistic taste.",
                  "Sparse sampled frames cannot exclude all flashes/freezes or certify photosensitivity safety.",
                  "Correlation cannot identify timing in silent, static or repetitive references.",
                  "Decode limits or missing anchors yield warnings, not verified synchronization.",
                  "Source/stem waveform matching verifies clock preservation, NOT that chosen events are gunshots or chosen song times are perceptually strong hits."])
    components = report["components"]
    def add(name, fn, error_status="warn", **context):
        try:
            value = fn()
        except (ValueError, TypeError, KeyError, EvidenceError, OSError) as exc:
            value = dict(context, status=error_status, detail=str(exc))
        components[name] = value
        return value
    try:
        if isinstance(manifest, (str, Path)):
            manifest = json.loads(Path(manifest).read_text(encoding="utf-8-sig"))
        if isinstance(plan, (str, Path)):
            plan = json.loads(Path(plan).read_text(encoding="utf-8-sig"))
        if not isinstance(manifest, dict):
            raise ValueError("manifest must be an object")
        cfg, opts = manifest.get("config", {}), manifest.get("qa_options", {})
        if not isinstance(cfg, dict) or not isinstance(opts, dict) or (plan is not None and not isinstance(plan, dict)):
            raise ValueError("config, qa_options and optional plan must be objects")
        ffmpeg = cfg.get("ffmpeg", "ffmpeg")
        timeout = _number(opts.get("timeout", 120), "timeout", 1, 600)
        rate = int(_number(opts.get("sample_rate", 16000), "sample_rate", 8000, 48000))
        max_seconds = _number(opts.get("max_decode_seconds", 3600), "decode limit", 1, 86400)
        max_bytes = int(_number(opts.get("max_decode_bytes", 512*1024**2), "byte limit", 1024, 2*1024**3))
        tolerance = _number(opts.get("tolerance_ms", 5), "timing tolerance", 0, 30)
        fps = _number(cfg.get("fps", 60), "fps", 1, 120)
        duration = _number(manifest.get("audio_duration", manifest.get("plan_duration")), "duration", .01, 600)
        output = _path(manifest.get("output"))
        chunks = manifest.get("chunks", [])
        if not isinstance(chunks, list) or not 1 <= len(chunks) <= 256:
            raise ValueError("bounded nonempty chunks required")
        report["output"] = output
        report["evidence_scope"] = {
            "render_clock_fidelity": "source/stem/final-mix correlations and decoded visual matches",
            "gunshot_to_musical_hit": "not established by copying planned clocks",
            "artistic_quality": "not certified"}
        components["musical_sync"] = dict(status="warn",
            detail="Not verified: independent firing-attack labels and strong musical-hit validation are required; zero source/stem offset is render fidelity only.")
        add("structural", lambda: _structural(output, timeout), "fail")
        add("duplicate_ranges", lambda: _duplicates(chunks), "fail")
        add("loudness", lambda: _loudness(output, ffmpeg, timeout))
        add("visual_heuristics", lambda: _visual_samples(output, duration, ffmpeg, timeout))
        anchors = []
        for i, chunk in enumerate(chunks):
            if not isinstance(chunk, dict):
                raise ValueError("chunks must be objects")
            events = chunk.get("events", [])
            if not events and plan and i < len(plan.get("timeline", [])):
                item = plan["timeline"][i]
                events = item.get("events", [])
                if not events and item.get("anchor"):
                    a = item["anchor"]
                    events = [dict(a, predicted_audio_event=a["output_time"],
                                   predicted_visual_event=item["output_start"]+a["source_visual_event"]-item["source_start"])]
            if not isinstance(events, list) or any(not isinstance(e, dict) for e in events):
                raise ValueError("events must be a list of objects")
            for j, event in enumerate(events):
                if len(anchors) >= 1024:
                    raise ValueError("too many event anchors")
                anchors.append((i, j, chunk, event))
        if not anchors:
            components["event_anchors"] = dict(status="warn", detail="no event anchors; no synchronization claim")
        before, length, search = .10, .30, 30
        requests, prepared_errors = {}, {}
        def request(path, end):
            if path:
                key = str(Path(path).resolve())
                requests[key] = max(requests.get(key, 0), end)
        normalized = []
        for i, j, chunk, event in anchors:
            try:
                st = _number(event["source_audio_event"], "source audio event", 0, 86400)
                ot = _number(event.get("predicted_audio_event", event.get("output_audio_event")), "output audio event", 0, duration)
                vt = _number(event["source_visual_event"], "source visual event", 0, 86400)
                vo = _number(event.get("predicted_visual_event", event.get("output_visual_event")), "output visual event", 0, duration+.1)
                music_time = manifest.get("music_start_sample", 0)/cfg.get("sample_rate", 48000)+ot
                source = event.get("source", chunk["source"])
                if Path(source).resolve() != Path(chunk["source"]).resolve():
                    raise ValueError("event source differs from chunk source")
                a, b = _number(chunk["source_start"], "chunk start"), _number(chunk["source_end"], "chunk end")
                os_, oe = _number(chunk["output_start"], "output start"), _number(chunk["output_end"], "output end")
                if not a <= st <= b or not a <= vt <= b or not os_ <= ot <= oe:
                    raise ValueError("event outside chunk")
                # Do not cross source cuts during a waveform comparison. Short
                # edge anchors may be uncheckable and must warn, not false-fail.
                margin = search/1000 + .001
                pre = min(before, st-a, ot-os_-margin)
                post = min(length-before, b-st, oe-ot-margin)
                # Consume protection metadata as bounds only, never execute or
                # duplicate the motion time map. Correlate the guaranteed 1x
                # neighborhood and keep the search margin inside it.
                mapping = chunk.get("time_map")
                if mapping:
                    protected = mapping.get("protected", [])
                    local = st-a
                    containing = [(float(x), float(y)) for x, y in protected if float(x) <= local <= float(y)]
                    if not containing:
                        components[f"anchor_{i}_{j}_protection"] = dict(status="warn", detail="no declared 1x protection around audio anchor")
                        continue
                    x, y = containing[0]
                    pre, post = min(pre, local-x-margin), min(post, y-local-margin)
                if pre < 0 or post < 0 or pre+post < .05:
                    components[f"anchor_{i}_{j}_edge"] = dict(status="warn", detail="anchor too near cut for a bounded correlation window")
                    continue
                normalized.append((i, j, chunk, st, ot, vt, vo, music_time, source, pre, pre+post))
                request(source, st+post)
                request(manifest.get("music_source"), music_time+post)
                for path in (manifest.get("game_stem"), manifest.get("music_stem"), output):
                    request(path, ot+post+search/1000)
            except (ValueError, TypeError, KeyError) as exc:
                components[f"anchor_{i}_{j}_metadata"] = dict(status="fail", detail=str(exc))
        with tempfile.TemporaryDirectory(prefix="encounter-qa-") as directory:
            cache = _PCMCache(directory, ffmpeg, rate, timeout, max_seconds, max_bytes)
            try:
                for path, end in requests.items():
                    try:
                        cache.prepare(path, end)
                    except (ValueError, EvidenceError) as exc:
                        prepared_errors[path] = str(exc)
                def check_audio(ref, rt, stem, ot, pre, window_length):
                    for p in (ref, stem):
                        if p and str(Path(p).resolve()) in prepared_errors:
                            raise EvidenceError(prepared_errors[str(Path(p).resolve())])
                    return _audio_evidence(cache, ref, rt, stem, ot, pre, window_length, search, tolerance, .85)
                for i, j, chunk, st, ot, vt, vo, mt, source, pre, window_length in normalized:
                    key = f"anchor_{i}_{j}"
                    report["anchors"].append(dict(chunk=i, event=j, source_path=str(source),
                                                  source_audio_time=st, output_audio_time=ot,
                                                  source_visual_time=vt, output_visual_time=vo, music_time=mt))
                    add(key+"_game_stem", lambda: check_audio(source, st, manifest.get("game_stem"), ot, pre, window_length),
                        sample_path=manifest.get("game_stem"), reference_path=str(source), output_time=ot)
                    add(key+"_music_stem", lambda: check_audio(manifest.get("music_source"), mt, manifest.get("music_stem"), ot, pre, window_length),
                        sample_path=manifest.get("music_stem"), reference_path=manifest.get("music_source"), output_time=ot)
                    styled = _has_visual_style(manifest, chunk, plan)
                    add(key+"_visual", lambda: _frame_match(source, vt, output, vo, fps, ffmpeg, timeout, styled),
                        sample_path=output, reference_path=str(source), output_time=vo, masking_sensitive=True, style_present=styled)
                    if opts.get("final_mix", True):
                        add(key+"_final_mix", lambda: _joint_evidence(cache, source, st,
                            manifest.get("music_source"), mt, output, ot, pre, window_length, search, tolerance),
                            sample_path=output, reference_paths=[str(source), manifest.get("music_source")], output_time=ot)
                report["decode_cache"] = dict(files=len(cache.entries), decodes=cache.decode_count,
                    bytes_written=cache.decoded_bytes, sample_rate=rate, storage="temporary disk memmap",
                    max_seconds=max_seconds, max_bytes_per_file=max_bytes, max_total_bytes=cache.max_total_bytes,
                    origin="decoded PCM sample zero")
            finally:
                cache.close()
    except (ValueError, TypeError, KeyError, OSError) as exc:
        components["manifest"] = dict(status="fail", detail=str(exc))
    for name, value in components.items():
        if value["status"] != "pass":
            report["issues"].append(dict(component=name, status=value["status"], detail=value.get("detail", "")))
    statuses = [v["status"] for v in components.values()]
    report["status"] = "fail" if "fail" in statuses else "warn" if "warn" in statuses else "pass"
    report["ok"] = report["status"] != "fail"
    report["benchmark"] = _benchmark(started)
    # Roundtrip rejects NaN/Infinity and accidental NumPy scalars.
    report = json.loads(json.dumps(report, allow_nan=False))
    if output_path is not None:
        target = Path(output_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(report, indent=2, allow_nan=False)+"\n", encoding="utf-8")
    return report
