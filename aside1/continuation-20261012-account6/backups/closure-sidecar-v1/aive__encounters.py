"""Conservative confirmed encounter planner, serialized schema encounters/v1.

Times are absolute source/track seconds. No rendering, effects, speed changes,
synthetic beats or filler. Duration is a ceiling, not a promise.
"""
from __future__ import annotations

import math
from bisect import bisect_left, bisect_right
from heapq import nlargest
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .beats import BeatInfo
    from .music import MusicProfile

EPS = 1e-8
MAX_PHRASE_ONSET_CANDIDATES = 256
EVENT_PROVENANCE_FIELDS = ("confirmation", "confidence_kind", "label_id", "context_review")


def _num(value, name, maximum=None):
    if isinstance(value, bool) or not isinstance(value, (float, int)):
        raise ValueError(f"{name} must be a finite number")
    value = float(value)
    if not math.isfinite(value) or value < 0 or (maximum is not None and value > maximum):
        raise ValueError(f"invalid {name}")
    return value


def group_encounters(events: list[dict], *, max_gap: float = 2.5,
                     lead: float = 1.2, trail: float = 0.7) -> list[dict]:
    """Group chronological same-source confirmations, merging touching context.

    Required event keys: source, source_audio_event, source_visual_event,
    confidence [0,1], confirmed (bool), source_duration > 0. Only True qualifies.
    Exact duplicate observations collapse, distinct kill times do not. Context
    covers BOTH audio and visual evidence, with bounded lead/trail. Optional
    encounter_start/encounter_end must be supplied together, contain BOTH
    observations and lie inside the source. These manual complete-fight ranges
    replace point-event context and are never shortened. Known optional text
    provenance fields confirmation/confidence_kind/label_id/context_review are
    retained; unknown keys are ignored. Returns
    source/start/end/source_duration/events/kill_count/confidence/
    main_event_index/source_audio_event/source_visual_event/warnings.
    """
    max_gap, lead, trail = (_num(v, n) for v, n in
                            ((max_gap, "max_gap"), (lead, "lead"), (trail, "trail")))
    if not isinstance(events, list):
        raise ValueError("events must be a list")
    required = {"source", "source_audio_event", "source_visual_event", "confidence",
                "confirmed", "source_duration"}
    sources, durations, seen = {}, {}, set()
    for raw in events:
        if not isinstance(raw, dict) or not required <= raw.keys():
            raise ValueError("missing required confirmed event fields")
        source = raw["source"]
        if not isinstance(source, str) or not source.strip():
            raise ValueError("source must be a nonempty string")
        if type(raw["confirmed"]) is not bool:
            raise ValueError("confirmed must be a bool")
        sd = _num(raw["source_duration"], "source_duration")
        if sd <= 0:
            raise ValueError("source_duration must be positive")
        a = _num(raw["source_audio_event"], "source_audio_event", sd)
        v = _num(raw["source_visual_event"], "source_visual_event", sd)
        c = _num(raw["confidence"], "confidence", 1)
        metadata = {}
        for field in EVENT_PROVENANCE_FIELDS:
            if field in raw:
                if not isinstance(raw[field], str) or not raw[field].strip():
                    raise ValueError(f"{field} must be nonempty text")
                metadata[field] = raw[field]
        context = {}
        if "encounter_start" in raw or "encounter_end" in raw:
            if not {"encounter_start", "encounter_end"} <= raw.keys():
                raise ValueError("encounter_start and encounter_end required together")
            ca = _num(raw["encounter_start"], "encounter_start", sd)
            cb = _num(raw["encounter_end"], "encounter_end", sd)
            if ca >= cb or ca > min(a, v) or cb < max(a, v):
                raise ValueError("encounter context must contain audio and visual events")
            context = {"encounter_start": ca, "encounter_end": cb}
        if source in durations and abs(durations[source] - sd) > EPS:
            raise ValueError("inconsistent same-source duration")
        durations[source] = sd
        if not raw["confirmed"]:
            continue
        key = (source, a, v)
        if key in seen:
            for event in sources[source]:
                if (event["source_audio_event"], event["source_visual_event"]) == (a, v):
                    # Prefer the higher-confidence label; equal-confidence
                    # duplicates retain first-seen text.
                    for field, value in metadata.items():
                        if field not in event or c > event["confidence"]:
                            event[field] = value
                    event["confidence"] = max(event["confidence"], c)
                    if context:
                        event["encounter_start"] = min(event.get("encounter_start", context["encounter_start"]), context["encounter_start"])
                        event["encounter_end"] = max(event.get("encounter_end", context["encounter_end"]), context["encounter_end"])
            continue
        seen.add(key)
        sources.setdefault(source, []).append({"source": source, "source_audio_event": a,
            "source_visual_event": v, "confidence": c, "confirmed": True, "source_duration": sd, **context, **metadata})
    result = []
    for source in sorted(sources):
        groups = []
        for event in sorted(sources[source], key=lambda e: (e["source_audio_event"], e["source_visual_event"])):
            a = event.get("encounter_start", max(0., min(event["source_audio_event"], event["source_visual_event"]) - lead))
            b = event.get("encounter_end", min(durations[source], max(event["source_audio_event"], event["source_visual_event"]) + trail))
            if groups and (event["source_audio_event"] - groups[-1]["events"][-1]["source_audio_event"] <= max_gap + EPS
                           or a <= groups[-1]["end"] + EPS):
                groups[-1]["events"].append(event)
                groups[-1]["start"] = min(groups[-1]["start"], a)
                groups[-1]["end"] = max(groups[-1]["end"], b)
            else:
                groups.append({"source": source, "source_duration": durations[source],
                               "start": a, "end": b, "events": [event]})
        merged = []
        for group in sorted(groups, key=lambda g: g["start"]):
            if merged and group["start"] <= merged[-1]["end"] + EPS:
                merged[-1]["events"].extend(group["events"])
                merged[-1]["end"] = max(merged[-1]["end"], group["end"])
            else:
                merged.append(group)
        for group in merged:
            group["events"].sort(key=lambda e: e["source_audio_event"])
            main = max(range(len(group["events"])), key=lambda i: group["events"][i]["confidence"])
            group["main_event_index"] = main
            group["kill_count"] = len(group["events"])
            group["confidence"] = sum(e["confidence"] for e in group["events"]) / group["kill_count"]
            group["source_audio_event"] = group["events"][main]["source_audio_event"]
            group["source_visual_event"] = group["events"][main]["source_visual_event"]
            first, last = _extent(group)
            group["warnings"] = []
            if first < lead - EPS:
                group["warnings"].append("setup clipped by source boundary")
            if last + trail > group["source_duration"] + EPS:
                group["warnings"].append("payoff clipped by source boundary")
            result.append(group)
    return result


def _extent(group):
    times = [e[k] for e in group["events"] for k in ("source_audio_event", "source_visual_event")]
    return min(times), max(times)


def _music(beat_info, profile, accents, music_duration):
    if accents is not None and beat_info is not None:
        raise ValueError("use BeatInfo or explicit accents, not both")
    if music_duration is None:
        music_duration = getattr(beat_info, "duration", getattr(profile, "duration", None))
    if music_duration is None:
        raise ValueError("music_duration required with explicit accents")
    total = _num(music_duration, "music_duration")
    if total <= 0:
        raise ValueError("music_duration must be positive")
    for obj in (beat_info, profile):
        if obj is not None and abs(_num(obj.duration, "profile duration") - total) > .01:
            raise ValueError("music profile duration mismatch")
    if beat_info is not None:
        strengths = beat_info.onset_strengths
        if strengths and len(strengths) != len(beat_info.onsets):
            raise ValueError("onset_strengths must match onsets")
        entries = [{"time": t, "kind": "beat", "strength": 0} for t in beat_info.beats]
        entries += [{"time": t, "kind": "onset", "strength": strengths[i] if strengths else .5}
                    for i, t in enumerate(beat_info.onsets)]
    else:
        if not isinstance(accents, list):
            raise ValueError("BeatInfo or explicit accent list required")
        entries = accents
    onsets, boundaries = {}, set()
    for entry in entries:
        if isinstance(entry, dict):
            if "time" not in entry:
                raise ValueError("accent requires time")
            time, strength, kind = entry["time"], entry.get("strength", .5), entry.get("kind", "onset")
        else:
            time, strength, kind = entry, .5, "onset"
        time, strength = _num(time, "accent time", total), _num(strength, "accent strength", 1)
        if kind not in {"onset", "beat"}:
            raise ValueError("accent kind must be onset or beat")
        if kind == "onset":
            onsets[time] = max(onsets.get(time, 0.), strength)
        if kind == "beat" or beat_info is None:
            boundaries.add(time)
    return total, sorted(onsets.items()), sorted(boundaries)


def _phrase_boundaries(beat_info, profile, boundaries, total):
    """Only supplied markers, never BPM/bar interpolation or inferred downbeats."""
    provenance = {t: {"beat" if beat_info is not None else "explicit_accent"}
                  for t in boundaries}
    phrase_times = set()
    if beat_info is not None:
        for value in beat_info.downbeats:
            t = _num(value, "downbeat time", total)
            provenance.setdefault(t, set()).add("downbeat")
            phrase_times.add(t)
    if profile is not None:
        for section in profile.sections:
            a = _num(section.start, "section start", total)
            b = _num(section.end, "section end", total)
            if b <= a:
                raise ValueError("section end must follow start")
            for t in (a, b):
                provenance.setdefault(t, set()).add("section_boundary")
                phrase_times.add(t)
    return sorted(provenance), sorted(phrase_times), provenance


def _onset_candidates(onsets, lo, hi, bounded):
    """Bound expensive profile/scoring work in opt-in mode, without a grid.

    Half the budget retains the strongest actual transients and half samples
    actual onset indices across the feasible context interval. Endpoints remain
    eligible. Default mode exhaustively ranks exactly as before.
    """
    if not bounded or hi - lo <= MAX_PHRASE_ONSET_CANDIDATES:
        return range(lo, hi)
    half = MAX_PHRASE_ONSET_CANDIDATES // 2
    strongest = nlargest(half, range(lo, hi), key=lambda i: (onsets[i][1], -i))
    spread = [lo + (hi - lo - 1) * i // (half - 1) for i in range(half)]
    return sorted(set(strongest).union(spread))


def plan_encounters(events: list[dict], beat_info: BeatInfo | None = None,
                    music_profile: MusicProfile | None = None, *, duration: float,
                    music_start: float = 0., accents: list | None = None,
                    music_duration: float | None = None, max_gap: float = 2.5,
                    lead: float = 1.2, trail: float = .7,
                    max_extension: float = 1.5, minimum_setup: float = .6,
                    minimum_payoff: float = .5, phrase_aware: bool = False) -> dict:
    """Build contiguous multi-source 1x windows, anchoring ONE main audio shot.

    Explicit accents: numbers (actual onsets), or dictionaries with absolute
    time, strength [0,1], kind onset|beat. Numeric onsets also define available
    boundaries. BeatInfo uses its beats as boundaries and onsets as anchors.
    No grid interpolation, gap insertion or cyclic source reuse.

    phrase_aware=False preserves legacy greedy timing. True uses supplied
    BeatInfo.downbeats and MusicProfile section starts/ends within the existing
    context/extension and duration ceiling. Accent quality ranks before phrase
    convenience; phrase fit breaks comparable score ties, not weak-hit priority. Missing or infeasible phrase markers
    fall back to existing boundaries with phrase_fit_warnings. At most 256 actual
    onset candidates per encounter/cursor receive expensive profile scoring.
    Optional event encounter_start/encounter_end specify manual complete-fight
    context in either mode; the whole range is included or omitted, never clipped.
    Extensions remain bounded. Without manual context a complete fight cannot
    be inferred from kill observations alone.

    Schema encounters/v1: requested_duration/duration/music_start/music_end,
    music_continuous/gaps/warnings/omitted_encounters/timeline. Each item has
    source/source_start/source_end/output_start/output_end/music_start/music_end,
    speed=1, anchor, events, kill_count/confidence/section/warnings. Events carry
    source times, window-local audio_offset/visual_offset, and output-absolute
    output_audio_event/output_visual_event. Anchor has source_audio_event,
    source_visual_event, output_time and music_time. Serialization needs only
    json.dumps; no rounding changes mapping arithmetic. Additive opt-in fields:
    plan phrase_aware/phrase_fit_warnings; item context_provenance (kind/start/end),
    phrase_fit_warnings, boundary_provenance.music_start/music_end (time/kinds;
    end also phrase_aligned), anchor.provenance (kind=onset/strength). Manual
    event bounds and the four known text provenance fields survive serialization.

    Bounded greedy assignment ranks confidence and multi-kills against actual
    onset strength and section energy. Windows only extend existing encounter
    context by max_extension, never into another encounter's protected context.
    Inadequate setup/payoff or timing fit causes intact omission. It is not a
    globally optimal arrangement. Empty gaps means emitted coverage is gapless;
    unfilled requested tail is explicitly reported, not fabricated.
    """
    if type(phrase_aware) is not bool:
        raise ValueError("phrase_aware must be a bool")
    requested, start = _num(duration, "duration"), _num(music_start, "music_start")
    if requested <= 0:
        raise ValueError("duration must be positive")
    extension = _num(max_extension, "max_extension")
    setup, payoff = _num(minimum_setup, "minimum_setup"), _num(minimum_payoff, "minimum_payoff")
    groups = group_encounters(events, max_gap=max_gap, lead=lead, trail=trail)
    total, onsets, boundaries = _music(beat_info, music_profile, accents, music_duration)
    phrase_times, provenance, phrase_warnings = [], {}, []
    scoring_bounded = False
    if phrase_aware:
        boundaries, phrase_times, provenance = _phrase_boundaries(beat_info, music_profile, boundaries, total)
        if not phrase_times:
            phrase_warnings.append("no supplied downbeats or section boundaries; no phrase grid invented")
    onset_times = [t for t, _ in onsets]
    if start >= total:
        raise ValueError("music_start must be inside track")
    limit = min(start + requested, total)
    warnings, timeline, used, remaining = [], [], {}, list(enumerate(groups))
    cursor = start
    if start + requested > total + EPS:
        warnings.append("duration exceeds remaining music; capped at track end")
    while remaining:
        best = None
        for index, group in remaining:
            anchor = group["source_audio_event"]
            first, last = _extent(group)
            if first < setup - EPS or last + payoff > group["source_duration"] + EPS:
                continue
            lower = max(0., group["start"] - extension)
            upper = min(group["source_duration"], group["end"] + extension)
            for other in groups:
                if other is group or other["source"] != group["source"]:
                    continue
                if other["end"] <= group["start"] + EPS:
                    lower = max(lower, other["end"])
                if other["start"] >= group["end"] - EPS:
                    upper = min(upper, other["start"])
            lo = bisect_left(onset_times, cursor + anchor - group["start"] - EPS)
            hi = bisect_right(onset_times, min(limit, cursor + anchor - lower + EPS))
            scoring_bounded = scoring_bounded or (phrase_aware and hi - lo > MAX_PHRASE_ONSET_CANDIDATES)
            for onset_index in _onset_candidates(onsets, lo, hi, phrase_aware):
                accent, strength = onsets[onset_index]
                if accent < cursor:
                    continue
                a = anchor - (accent - cursor)
                if a < lower - EPS or a > group["start"] + EPS or first - a < setup - EPS:
                    continue
                earliest = accent + max(group["end"], last + payoff) - anchor
                latest = min(limit, cursor + upper - a)
                phrase_index = bisect_left(phrase_times, earliest - EPS)
                phrase_end = phrase_times[phrase_index] if phrase_index < len(phrase_times) else None
                phrase_fit = phrase_end is not None and phrase_end <= latest + EPS
                boundary_index = bisect_left(boundaries, earliest - EPS)
                end = phrase_end if phrase_fit else (boundaries[boundary_index] if boundary_index < len(boundaries) else None)
                if end is None or end > limit + EPS:
                    continue
                b = a + end - cursor
                if b > upper + EPS or b <= a:
                    continue
                if any(a < y - EPS and b > x + EPS for x, y in used.get(group["source"], [])):
                    continue
                energy, section = .5, None
                if music_profile is not None:
                    energy = _num(music_profile.energy_at(accent), "music energy", 1)
                    sec = music_profile.section_at(accent)
                    if sec is not None and sec.start <= accent < sec.end:
                        energy = max(energy, _num(sec.energy, "section energy", 1))
                        section = sec.label
                quality = group["confidence"] + .35 * min(group["kill_count"] - 1, 4)
                score = quality * (.5 + .5 * strength + .5 * energy)
                # Impact quality is primary. Phrase convenience must not turn
                # a weaker musical change into the chosen firing accent.
                rank = (score, int(phrase_fit), -(end - cursor), -index)
                candidate = (rank, index, group, a, b, accent, end, section, strength, phrase_fit)
                if best is None or rank > best[0]:
                    best = candidate
        if best is None:
            break
        _, index, group, a, b, accent, end, section, strength, phrase_fit = best
        item_events = [{**event,
            "audio_offset": event["source_audio_event"] - a,
            "visual_offset": event["source_visual_event"] - a,
            "output_audio_event": cursor - start + event["source_audio_event"] - a,
            "output_visual_event": cursor - start + event["source_visual_event"] - a}
            for event in group["events"]]
        timeline.append({"source": group["source"], "source_start": a, "source_end": b,
            "output_start": cursor - start, "output_end": end - start,
            "music_start": cursor, "music_end": end, "speed": 1.,
            "anchor": {"source_audio_event": group["source_audio_event"],
                "source_visual_event": group["source_visual_event"],
                "output_time": accent - start, "music_time": accent},
            "events": item_events, "kill_count": group["kill_count"],
            "confidence": group["confidence"], "section": section, "warnings": group["warnings"]})
        item = timeline[-1]
        manual = any("encounter_start" in e for e in group["events"])
        if manual or phrase_aware:
            item["context_provenance"] = {"kind": "manual" if manual else "bounded_event_context",
                "start": group["start"], "end": group["end"]}
        if phrase_aware:
            fit_warnings = []
            if not phrase_fit:
                fit_warnings.append("phrase-fit fallback: no supplied downbeat or section boundary fits scored intact-context candidates")
                phrase_warnings.append(f"{group['source']}: {fit_warnings[0]}")
            item["phrase_fit_warnings"] = fit_warnings
            item["warnings"] = list(group["warnings"]) + fit_warnings
            item["boundary_provenance"] = {
                "music_start": {"time": cursor, "kinds": sorted(provenance.get(cursor, {"excerpt_start"}))},
                "music_end": {"time": end, "kinds": sorted(provenance[end]), "phrase_aligned": phrase_fit}}
            item["anchor"]["provenance"] = {"kind": "onset", "strength": strength}
        used.setdefault(group["source"], []).append((a, b))
        remaining = [(i, g) for i, g in remaining if i != index]
        cursor = end
    actual = cursor - start
    if not groups:
        warnings.append("no positively confirmed encounters")
    if not onsets:
        warnings.append("no actual song onsets; no anchors invented")
    if actual < requested - EPS:
        warnings.append(f"shorter than requested by {requested - actual:.3f}s; no filler or reuse")
    omitted = [{"source": g["source"], "start": g["start"], "end": g["end"],
        "kill_count": g["kill_count"],
        "reason": "insufficient setup/payoff, accent/context fit, or remaining duration"}
        for _, g in remaining]
    if omitted:
        warnings.append(f"{len(omitted)} encounters omitted intact, not clipped")
    plan = {"schema_version": "encounters/v1", "requested_duration": requested,
        "duration": actual, "music_start": start, "music_end": cursor,
        "music_continuous": True, "gaps": [], "warnings": warnings,
        "omitted_encounters": omitted, "timeline": timeline}
    if phrase_aware:
        if scoring_bounded:
            phrase_warnings.append(f"onset scoring bounded to {MAX_PHRASE_ONSET_CANDIDATES} candidates per encounter/cursor; heuristic fit, not exhaustive")
        plan["phrase_aware"] = True
        plan["phrase_fit_warnings"] = phrase_warnings
    return plan
