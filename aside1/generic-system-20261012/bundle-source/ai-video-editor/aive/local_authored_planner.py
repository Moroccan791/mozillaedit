"""Local, explicitly unverified authored candidate montage, without media IO.

Consumes existing firing-map/v1 roots, povkills records and measured hit-map/v1
excerpts. No scene understanding, new attack detection, review, event promotion,
source retiming, interpolation, or fallback footage is performed here.
"""
from __future__ import annotations

from bisect import bisect_left, bisect_right
import copy
import math
from pathlib import Path
import re

from .encounter_render import RenderConfig, _rounded, validate_plan

EPS = 1e-7
BEAM_WIDTH = 24
MAX_BEAM_OPTIONS = 1024
MAX_SHOTS = 20
MIN_SHOTS = 10


def _num(value, name, lo=0., hi=86400.):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f"{name} must be finite")
    value = float(value)
    if not lo <= value <= hi:
        raise ValueError(f"{name} outside bounds")
    return value


def _source(value):
    if not isinstance(value, str) or not value.strip() or any(c in value for c in "\x00\r\n"):
        raise ValueError("absolute source path required")
    p = Path(value)
    if not p.is_absolute():
        raise ValueError("absolute source path required")
    return str(p.resolve())


def _interval(value, t, name, lo, hi):
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f"{name} must be an explicit interval")
    a, b = (_num(v, name, lo, hi) for v in value)
    if not a <= t <= b:
        raise ValueError(f"{name} must contain event time")
    return [a, b]


def _unverified(value):
    """Preserve evidence but remove any inherited assertion of confirmation."""
    if isinstance(value, dict):
        return {k: False if k == "confirmed" else _unverified(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_unverified(v) for v in value]
    return copy.deepcopy(value)


def _hits(maps, ms, duration):
    if not isinstance(maps, list) or not 1 <= len(maps) <= 64:
        raise ValueError("one..64 measured hit maps required")
    identity, hits, excerpts = None, [], []
    for mi, mapping in enumerate(maps):
        if not isinstance(mapping, dict) or mapping.get("schema_version") != "hit-map/v1":
            raise ValueError("hit-map/v1 required")
        sha = mapping.get("song_sha256")
        if not isinstance(sha, str) or not re.fullmatch(r"[a-fA-F0-9]{64}", sha):
            raise ValueError("measured song SHA256 required")
        sha = sha.lower()
        if identity is not None and identity != sha:
            raise ValueError("hit maps must share the same song SHA256")
        identity = sha
        ex = mapping.get("excerpt", {})
        a = _num(ex.get("start"), "excerpt start")
        length = _num(ex.get("duration"), "excerpt duration", .001, 12)
        b = _num(ex.get("end", a+length), "excerpt end")
        if abs(b-a-length) > EPS:
            raise ValueError("inconsistent measured excerpt bounds")
        excerpts.append(dict(start=a, end=b))
        raw = mapping.get("candidates")
        if not isinstance(raw, list) or len(raw) > 32:
            raise ValueError("each measured map requires <=32 candidates")
        for hi, hit in enumerate(raw):
            if not isinstance(hit, dict):
                raise ValueError("hit object required")
            # Ineligible/null refinements are not targets; never use peak fallback.
            if hit.get("preview_eligible") is not True:
                continue
            t = _num(hit.get("refined_time"), "measured refined time", a, b)
            # Boundary attacks can extend beyond an overlapping excerpt. Their
            # measured song clocks are not excerpt-relative and are not clipped.
            interval = _interval(hit.get("refined_interval"), t, "refined interval", 0, 86400)
            if interval[1]-interval[0] > .25:
                raise ValueError("refined attack interval exceeds .25 seconds")
            strength = _num(hit.get("strength"), "hit strength", 0, 1)
            _num(hit.get("time"), "original spectral peak", a, b)
            if ms <= t <= ms+duration:
                hits.append(dict(id=f"map-{mi}:{hit.get('id', hi)}", time=t,
                    strength=strength, refined_interval=interval,
                    original_peak_time=hit["time"], evidence=_unverified(hit.get("evidence", {})),
                    confirmed=False, review_status="unreviewed", song_sha256=sha))
    distinct = []
    # Overlapping excerpts and separate peaks can refer to one real attack.
    for hit in sorted(hits, key=lambda h: (-h["strength"], h["time"], h["id"])):
        if not any(abs(hit["time"]-other["time"]) < .08-EPS for other in distinct):
            distinct.append(hit)
    return identity, sorted(distinct, key=lambda h: h["time"]), excerpts, len(hits)


def _design(rows, assignments, fps):
    roles = ["impact"]*len(rows)
    roles[0], roles[-1] = "setup", "payoff"
    # Sparse contrast: one or two low-density middle clips, never an outcome.
    middle = sorted(range(2, len(rows)-1), key=lambda i: (len(rows[i]["candidate_events"]),
                    assignments[i]["hit_strength"], i))
    for i in middle[:min(2, max(1, len(rows)//7))]:
        roles[i] = "contrast"
    bridges = []
    for i in range(1, len(rows)):
        left, right = rows[i-1], rows[i]
        count = 10
        for row, side in ((left, "out"), (right, "in")):
            phase = row["output_start"]-_rounded(row["output_start"], fps)/fps
            frames = _rounded(row["output_end"], fps)-_rounded(row["output_start"], fps)
            if side == "in":
                room = min(e["attack_interval"][0] for e in row["candidate_events"])-row["source_start"]+phase-.20
            else:
                room = (frames-1)/fps-(max(e["attack_interval"][1] for e in row["candidate_events"])-row["source_start"]+phase)-.20
            count = min(count, math.floor(room*fps), frames//3)
        if count >= 2:
            bridges.append(dict(boundary=i, direction="left" if i%2 else "right", frames=count))
    last = rows[-1]
    phase = last["output_start"]-_rounded(last["output_start"], fps)/fps
    frames = _rounded(last["output_end"], fps)-_rounded(last["output_start"], fps)
    room = (frames-1)/fps-(max(e["attack_interval"][1] for e in last["candidate_events"])-last["source_start"]+phase)-.20
    fade = min(round(.4*fps), math.floor(room*fps), frames//2)
    if not bridges or fade < 2:
        return None
    return dict(schema_version="authored-footage/v2",
        shots=[dict(role=r, composition="inset" if r == "contrast" else "full") for r in roles],
        bridges=bridges, ending=dict(fade_frames=fade),
        impacts=[dict(clip_index=i, output_time=a["output_audio_event"], frames=6,
                      strength=min(1., a["candidate_strength"]*a["hit_strength"]))
                 for i, a in enumerate(assignments)])


def _rank_states(states, target_cursor, fps, limit=None):
    """Rank only already-valid bounded options; never relax design protection.

    Both pruning stages must prefer partial bridge+ending feasibility. A partial
    design is not a completion guarantee: the winner still needs full validation.
    Python's stable key sort evaluates the bounded design check once per option.
    """
    states.sort(key=lambda s: (
        0 if len(s[2]) >= 2 and _design(s[2], s[3], fps) is not None else 1,
        -(s[0]-.22*abs(s[1]-target_cursor)), -s[1]))
    return states if limit is None else states[:limit]


def plan_local_authored(firing_map, icon_records, hit_maps, *, music_start=8, duration=35, fps=60):
    """Return encounters/v1 candidate plan or empty ``status='blocked'``.

    A bounded beam varies source_end and chooses actual refined song attacks
    dynamically .8..3.8s after each cursor. Every clip stays 2..5s at 1x, with
    >=.6s pre and >=.8s post of its main associated attack. Setup pre is >=.7s.
    Known cuts are excluded; unknown cuts/context remain explicitly unverified.
    Supplied analyzed bounds are required, not inferred from the last attack.
    """
    ms = _num(music_start, "music_start")
    requested = _num(duration, "duration", 30, 50)
    if type(fps) is not int or not 10 <= fps <= 120:
        raise ValueError("fps must be integer 10..120")
    if not isinstance(firing_map, dict) or firing_map.get("schema_version") != "firing-map/v1":
        raise ValueError("firing-map/v1 required")
    source = _source(firing_map.get("source"))
    sd = _num(firing_map.get("source_duration"), "source_duration", .1)
    sha, hits, excerpts, raw_hit_count = _hits(hit_maps, ms, requested)
    omissions = []
    plan = dict(schema_version="encounters/v1", mode="candidate-preview", confirmed=False,
        review_status="unreviewed", status="blocked", requested_duration=requested, duration=0.,
        music_start=ms, music_end=ms, music_continuous=True, gaps=[], timeline=[],
        rhythm_assignments=[], omitted_encounters=omissions,
        warnings=["Explicit unverified local candidate diagnostic, not a reviewed montage or certified sync.",
                  "Template cosine is not probability; local profile and gameplay/outcomes are uncalibrated.",
                  "Context inferred locally only; scene cuts, fight closure and song suitability remain unverified."],
        authored_role_scope="Generated video design roles only, not reviewed gameplay semantics.",
        candidate_protection="Every root attack retained; bridge/fade exclude all intervals with >=0.18s margin.",
        local_selection_evidence=dict(schema_version="local-selection/v1", source=source,
            profile_status="uncalibrated", confirmed=False, review_status="unreviewed",
            song_sha256=sha, measured_excerpts=excerpts, refined_hit_count=len(hits),
            original_eligible_hit_count=raw_hit_count,
            confidence_kind="template_cosine_not_probability", no_source_retiming=True,
            policy="Existing associated audio only; full root candidates, no truncation, reuse, outcome claims or filler.",
            max_beam_options=MAX_BEAM_OPTIONS,
            context_nominal_pre=1.3, context_nominal_post=1.7, max_clip_seconds=5.,
            max_neutral_tail_seconds=4., beam_width=BEAM_WIDTH))

    def blocked(reason):
        plan["blocked_reason"] = reason
        return plan

    sources = firing_map.get("sources")
    if not isinstance(sources, list) or len(sources) != 1:
        return blocked("Single-source explicit analyzed bounds required")
    info = sources[0]
    if not isinstance(info, dict) or _source(info.get("id")) != source:
        raise ValueError("firing source metadata mismatch")
    if info.get("analyzed_start") is None or info.get("analyzed_end") is None:
        return blocked("Analyzed source bounds unknown")
    low = _num(info["analyzed_start"], "analyzed_start", 0, sd)
    high = _num(info["analyzed_end"], "analyzed_end", low, sd)
    raw = firing_map.get("candidate_events")
    if not isinstance(raw, list) or len(raw) > 4096:
        raise ValueError("Complete bounded root candidate_events required")
    roots, ids = [], set()
    for event in raw:
        if not isinstance(event, dict) or _source(event.get("source")) != source:
            raise ValueError("root candidate source mismatch")
        t = _num(event.get("time"), "root candidate time", low, high)
        _interval(event.get("attack_interval"), t, "root attack interval", low, high)
        _num(event.get("strength"), "candidate strength", 0, 1)
        ident = event.get("id")
        if not isinstance(ident, str) or not ident or ident in ids:
            raise ValueError("unique root candidate IDs required")
        ids.add(ident)
        if event.get("confirmed") is not False:
            raise ValueError("Root candidates must remain explicitly unconfirmed")
        if event.get("type", "audio_transient") != "audio_transient" or event.get("origin", "unknown") != "unknown" or event.get("instrument", "unknown") != "unknown":
            raise ValueError("Root candidates cannot assert reviewed identity labels")
        if event.get("outcome", "unknown") != "unknown" or event.get("visual_review") == "reviewed" or event.get("outcome_review"):
            raise ValueError("Root candidates cannot assert reviewed outcomes")
        roots.append(_unverified(event))
    roots.sort(key=lambda e: (e["time"], e["id"]))
    times = [e["time"] for e in roots]
    # Prefix/suffix interval extrema detect even a long attack whose anchor is
    # outside the retained range. Never assume attacks are only .1s long.
    prefix_hi, suffix_lo = [], [math.inf]*(len(roots)+1)
    for e in roots:
        prefix_hi.append(max(prefix_hi[-1] if prefix_hi else -math.inf, e["attack_interval"][1]))
    for j in range(len(roots)-1, -1, -1):
        suffix_lo[j] = min(suffix_lo[j+1], roots[j]["attack_interval"][0])
    if not isinstance(icon_records, list) or len(icon_records) > 4096:
        raise ValueError("bounded icon_records list required")
    seeds = {}
    for index, record in enumerate(icon_records):
        if not isinstance(record, dict):
            raise ValueError("icon record must be an object")
        if _source(record.get("source")) != source:
            omissions.append(dict(icon_index=index, reason="icon source mismatch")); continue
        if record.get("source_audio_event") is None:
            omissions.append(dict(icon_index=index, reason="no existing audio association")); continue
        audio = _num(record["source_audio_event"], "icon associated audio", 0, sd)
        visual = _num(record.get("source_visual_event"), "icon visual time", 0, sd)
        confidence = _num(record.get("confidence"), "template cosine", 0, 1)
        evidence = record.get("evidence", {})
        if not isinstance(evidence, dict):
            raise ValueError("icon evidence object required")
        persistence = evidence.get("persistence", 0)
        if type(persistence) is not int or persistence < 2 or not record.get("profile") or not evidence.get("template"):
            omissions.append(dict(icon_index=index, reason="persistent2 template/profile provenance required")); continue
        if record.get("confidence_kind") != "template_cosine_not_probability":
            omissions.append(dict(icon_index=index, reason="template confidence provenance required")); continue
        if not -.22-EPS <= audio-visual <= .04+EPS:
            omissions.append(dict(icon_index=index, reason="existing audio association outside -.22..+.04")); continue
        delta = evidence.get("audio_delta")
        if delta is None or abs(_num(delta, "existing audio_delta", -sd, sd)-(audio-visual)) > EPS:
            omissions.append(dict(icon_index=index, reason="existing association delta provenance inconsistent")); continue
        matched = roots[bisect_left(times, audio-EPS):bisect_right(times, audio+EPS)]
        if not matched:
            omissions.append(dict(icon_index=index, reason="associated audio absent from firing root")); continue
        main = max(matched, key=lambda e: e["strength"])
        item = dict(main=main, icon_index=index, source_visual_event=visual, confidence=confidence,
            evidence=_unverified(evidence), profile=record["profile"], confirmed=False,
            confidence_kind="template_cosine_not_probability", profile_status="uncalibrated")
        if main["id"] not in seeds or confidence > seeds[main["id"]]["confidence"]:
            seeds[main["id"]] = item
    ranked_seeds = sorted(seeds.values(), key=lambda s: (-s["main"]["strength"], s["main"]["time"]))
    for seed in ranked_seeds[64:]:
        omissions.append(dict(icon_index=seed["icon_index"], reason="bounded search seed budget64; roots in selected ranges remain intact"))
    seeds = ranked_seeds[:64]
    plan["local_selection_evidence"]["eligible_associated_roots"] = len(seeds)
    plan["local_selection_evidence"]["planning_depth_reached"] = 0
    if len(seeds) < MIN_SHOTS or len(hits) < MIN_SHOTS:
        return blocked("Insufficient distinct icon-associated source attacks or measured targets for 10..20 shots")
    cuts = firing_map.get("scene_cuts", [])
    if not isinstance(cuts, list):
        raise ValueError("scene_cuts must be a list if supplied")
    cuts = [_num(c, "known scene cut", low, high) for c in cuts]
    plan["local_selection_evidence"]["scene_cut_status"] = "supplied cuts excluded; not certified" if cuts else "unknown"
    hit_times = [h["time"]-ms for h in hits]
    cache, dense = {}, set()
    search = plan["local_selection_evidence"]
    search.update(pre_cap_prunings=0, max_ranked_options=0,
                  ranked_options=0, final_design_rejections=0,
                  final_validation_rejections=0)

    def rank_options(options, target, limit=None):
        search["max_ranked_options"] = max(search["max_ranked_options"], len(options))
        search["ranked_options"] += len(options)
        if limit is not None:
            search["pre_cap_prunings"] += 1
        return _rank_states(options, target, fps, limit)

    def retained(a, b):
        key = (a, b)
        if key not in cache:
            first, last = bisect_left(times, a), bisect_right(times, b)
            selected = roots[first:last]
            valid = (first == 0 or prefix_hi[first-1] <= a) and suffix_lo[last] >= b
            valid = valid and all(a <= e["attack_interval"][0] <= e["attack_interval"][1] <= b for e in selected)
            if len(selected) > 32:
                dense.add(key)
                valid = False
            cache[key] = selected if valid and selected else None
        return cache[key]

    # score, cursor, rows, assignments, used-root-IDs, used-hit-IDs
    states = [(0., 0., [], [], frozenset(), frozenset())]
    finished = []
    desired_count = max(MIN_SHOTS, min(MAX_SHOTS, round(requested/3.2), len(seeds)))
    for depth in range(min(MAX_SHOTS, len(seeds))):
        cache.clear()
        next_states = []
        for score, cursor, rows, assignments, used, used_hits in states:
            available_hits = hits[bisect_left(hit_times, cursor+.8-EPS):bisect_right(hit_times, cursor+3.8+EPS)]
            for seed in seeds:
                main = seed["main"]
                if main["id"] in used:
                    continue
                for hit in available_hits:
                    if hit["id"] in used_hits:
                        continue
                    pre = hit["time"]-ms-cursor
                    # Exact actual-song-clock mapping, never a spectral/BPM grid.
                    a = main["time"]-pre
                    if a < low or pre < (.7 if depth == 0 else .6):
                        continue
                    maximum = min(5., high-a, pre+2.7, requested-cursor)
                    minimum = max(2., pre+.8, seed["source_visual_event"]-a+.2)
                    if maximum < minimum-EPS:
                        continue
                    lengths = {minimum, maximum, pre+1.7, requested/desired_count, 2.5, 3., 3.5, 4., 4.5}
                    if depth+1 >= MIN_SHOTS:
                        lengths.add(requested-cursor)
                    for length in sorted(lengths):
                        if not minimum-EPS <= length <= maximum+EPS:
                            continue
                        end = cursor+length
                        if len(hits)-bisect_left(hit_times, end+.8-EPS) < max(0, MIN_SHOTS-depth-1):
                            continue
                        b = a+length
                        if any(a < cut < b for cut in cuts):
                            continue
                        if any(a < r["source_end"]-EPS and b > r["source_start"]+EPS for r in rows):
                            continue
                        events = retained(a, b)
                        if events is None or main["id"] not in {e["id"] for e in events}:
                            continue
                        # Strongest EXISTING associated candidate in this range is
                        # the mapped main, not whichever root transient is loudest.
                        associated = [s["main"] for s in seeds if a <= s["main"]["time"] <= b]
                        if any(e["strength"] > main["strength"]+EPS for e in associated):
                            continue
                        if b-max(e["attack_interval"][1] for e in events) > 4.+EPS:
                            continue
                        consumed = used|{e["id"] for e in events}
                        remaining = sum(s["main"]["id"] not in consumed for s in seeds)
                        if depth+1+remaining < MIN_SHOTS:
                            continue
                        # Beam options reference validated roots read-only. Copy
                        # and add output metadata only to the winning plan below.
                        row = dict(source=source, source_start=a, source_end=b, output_start=cursor,
                            output_end=end, music_start=ms+cursor, music_end=ms+end, speed=1.,
                            events=[], candidate_events=events, main_candidate_id=main["id"],
                            local_selection_evidence=seed,
                            context_provenance=dict(kind="inferred_local_only", source_start=max(low, main["time"]-1.3),
                                source_end=min(high, main["time"]+1.7), visual_review="unreviewed",
                                outcome="unknown", confirmed=False))
                        assignment = dict(clip_index=depth, candidate_id=main["id"], source_audio_event=main["time"],
                            output_audio_event=cursor+main["time"]-a, hit_id=hit["id"], hit_time=hit["time"],
                            refined_interval=hit["refined_interval"], hit_strength=hit["strength"],
                            candidate_strength=main["strength"], song_sha256=sha, matched=True,
                            event_id=main["id"], source_time=main["time"], output_time=cursor+main["time"]-a,
                            music_hit_id=hit["id"], music_time=hit["time"], music_interval=hit["refined_interval"],
                            confirmed=False, semantic_sync="unverified", timing_error_seconds=0.)
                        # Fit favors measured strength, nominal context and target
                        # role density, not reviewed action/outcome assertions.
                        fit = main["strength"]+hit["strength"]+.1*seed["confidence"]-.08*abs(pre-1.3)-.06*abs(length-requested/desired_count)
                        next_states.append((score+fit, end, rows+[row], assignments+[assignment],
                            used|{e["id"] for e in events}, used_hits|{hit["id"]}))
            if len(next_states) > MAX_BEAM_OPTIONS*2:
                next_states = rank_options(next_states,
                    (depth+1)*requested/desired_count, MAX_BEAM_OPTIONS)
        # Retain diverse cursor bins as well as high fit, avoiding one greedy
        # duration dominating beam and preventing exact-length completion.
        # Preserve effect-safe partial sequences before score-only beam pruning.
        # Otherwise valid bridge/fade alternatives can disappear before final
        # design validation. This changes ranking, never event/safety bounds.
        next_states = rank_options(next_states, (depth+1)*requested/desired_count)
        bins, states, per_selection = set(), [], {}
        for state in next_states:
            selection = tuple(sorted(a["candidate_id"] for a in state[3]))
            key = (round(state[1]*4), selection)
            if key in bins or per_selection.get(selection, 0) >= 3:
                continue
            bins.add(key)
            per_selection[selection] = per_selection.get(selection, 0)+1
            states.append(state)
            if len(states) == BEAM_WIDTH:
                break
        plan["local_selection_evidence"]["planning_depth_reached"] = depth+1
        plan["local_selection_evidence"]["last_beam_durations"] = sorted({round(s[1], 4) for s in states})
        if depth+1 >= MIN_SHOTS:
            finished.extend(s for s in states if 30.-EPS <= s[1] <= requested+EPS)
        if not states:
            break
    omissions.extend(dict(source=source, source_start=a, source_end=b,
                          reason="dense >32 root candidates; intact range omitted, never truncated") for a, b in sorted(dense))
    config = RenderConfig(fps=fps, style="authored-footage")
    for state in sorted(finished, key=lambda s: (abs(requested-s[1]), -s[0]/len(s[2]))):
        score, actual, rows, assignments, _, _ = state
        rows = copy.deepcopy(rows)
        for row in rows:
            row["candidate_events"] = [dict(_unverified(e), source=source, source_audio_event=e["time"],
                output_audio_event=row["output_start"]+e["time"]-row["source_start"], confirmed=False)
                for e in row["candidate_events"]]
        design = _design(rows, assignments, fps)
        if design is None:
            search["final_design_rejections"] += 1
            continue
        candidate = copy.deepcopy(plan)
        candidate.update(status="candidate", duration=actual, music_end=ms+actual,
            timeline=rows, rhythm_assignments=assignments, authored_design=design,
            rhythm_summary=dict(matched=len(assignments), total=sum(len(r["candidate_events"]) for r in rows),
                semantic_sync="unverified", other_root_attacks="retained, not forced onto hits"))
        try:
            validate_plan(candidate, config, source_durations={source: sd})
        except ValueError:
            search["final_validation_rejections"] += 1
            continue
        if actual < requested-EPS:
            candidate["warnings"].append(f"Shorter than requested by {requested-actual:.3f}s; no arbitrary filler or reuse.")
        return candidate
    return blocked("No anchor-safe 30..requested-second 10..20-shot plan fits existing evidence; no forced fallback")
