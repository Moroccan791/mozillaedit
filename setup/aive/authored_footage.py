"""Explicit video-only footage design. No music/event certification. Composition does not retime its CFR base.

A bridge is paired outgoing/incoming directional crop+smear around an unchanged
hard cut, NOT an overlapping wipe/crossfade or synthesized camera viewpoint.

v1 keeps the short proof contract. v2 extends only sequence bounds and adds
explicit event-anchored, video-only impacts; neither version certifies review.
"""
from __future__ import annotations
import math
from decimal import Decimal, ROUND_HALF_UP


def _object(value, keys, name):
    if not isinstance(value, dict) or set(value) != set(keys):
        raise ValueError(f"{name} requires exactly {sorted(keys)}")
    return value


def _integer(value, lo, hi, name):
    if type(value) is not int or not lo <= value <= hi:
        raise ValueError(f"invalid {name}: integer {lo}..{hi} required")
    return value


def validate_design(plan, rows, config):
    design = plan.get("authored_design")
    if not isinstance(design, dict):
        raise ValueError("authored_design must be an object")
    version = design.get("schema_version")
    if version not in ("authored-footage/v1", "authored-footage/v2"):
        raise ValueError("expected authored-footage/v1 or authored-footage/v2")
    keys = {"schema_version", "shots", "bridges", "ending"}
    if version == "authored-footage/v2":
        keys.add("impacts")
    _object(design, keys, "authored_design")
    if version == "authored-footage/v1":
        if plan["duration"] > 12 or not 4 <= len(rows) <= 8:
            raise ValueError("authored proof requires 4..8 clips and <=12 seconds")
    elif plan["duration"] > 50 or not 4 <= len(rows) <= 24:
        raise ValueError("authored-footage/v2 requires 4..24 clips and <=50 seconds")
    shots = design["shots"]
    if not isinstance(shots, list) or len(shots) != len(rows):
        raise ValueError("authored shots must correspond to every timeline clip")
    roles = []
    for row, shot in zip(rows, shots):
        _object(shot, {"role", "composition"}, "shot")
        if not isinstance(shot["role"], str) or shot["role"] not in {"setup", "impact", "contrast", "payoff"}:
            raise ValueError("unsupported shot role")
        if not isinstance(shot["composition"], str) or shot["composition"] not in {"full", "inset"}:
            raise ValueError("unsupported footage composition")
        if (shot["role"] == "contrast") != (shot["composition"] == "inset"):
            raise ValueError("only contrast shots use inset composition")
        roles.append(shot["role"])
        row["authored_shot"] = dict(shot)
        row["authored_edges"] = []
    if roles[0] != "setup" or roles[-1] != "payoff" or not {"impact", "contrast"} <= set(roles):
        raise ValueError("authored sequence requires setup, impact, contrast and final payoff")
    bridges = design["bridges"]
    if not isinstance(bridges, list) or not 1 <= len(bridges) < len(rows):
        raise ValueError("bounded nonempty paired bridges required")
    used = set()
    for bridge in bridges:
        _object(bridge, {"boundary", "direction", "frames"}, "bridge")
        boundary = _integer(bridge["boundary"], 1, len(rows)-1, "bridge boundary")
        if boundary in used:
            raise ValueError("duplicate bridge boundary")
        used.add(boundary)
        if not isinstance(bridge["direction"], str) or bridge["direction"] not in {"left", "right"}:
            raise ValueError("bridge direction must be left or right")
        count = _integer(bridge["frames"], 2, min(24, math.floor(.4*config.fps)), "bridge frames")
        for row, side in ((rows[boundary-1], "out"), (rows[boundary], "in")):
            if count > row["frame_count"]//3:
                raise ValueError("bridge exceeds one third of adjacent clip")
            edge = dict(side=side, frames=count, direction=bridge["direction"], boundary=boundary)
            row["authored_edges"].append(edge)
    ending = _object(design["ending"], {"fade_frames"}, "ending")
    fade = _integer(ending["fade_frames"], 2, min(rows[-1]["frame_count"]//2,
                    2*config.fps), "ending fade frames")
    rows[-1]["authored_fade_frames"] = fade
    for row in rows:
        count = row["frame_count"]
        intervals = [(0, e["frames"]-1) if e["side"] == "in" else
                     (count-e["frames"], count-1) for e in row["authored_edges"]]
        if row.get("authored_fade_frames"):
            intervals.append((count-fade, count-1))
        intervals.sort()
        if any(b >= c for (a, b), (c, d) in zip(intervals, intervals[1:])):
            raise ValueError("authored edge/fade windows overlap")
        events = row["events"]
        candidates = plan["timeline"][row["index"]].get("candidate_events", [])
        if not isinstance(candidates, list) or len(candidates) > 32:
            raise ValueError("bounded candidate_events required")
        for candidate in candidates:
            if not isinstance(candidate, dict) or candidate.get("confirmed") is not False:
                raise ValueError("candidate events must remain explicitly unconfirmed")
            t = candidate.get("time")
            interval = candidate.get("attack_interval")
            if isinstance(t, bool) or not isinstance(t, (int, float)) or not math.isfinite(t):
                raise ValueError("finite candidate time required")
            if not isinstance(interval, list) or len(interval) != 2:
                raise ValueError("candidate attack interval required")
            if any(isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v) for v in interval):
                raise ValueError("finite candidate interval required")
            lo, hi = interval
            if not row["source_start"] <= lo <= t <= hi <= row["source_end"]:
                raise ValueError("candidate attack interval outside clip")
            local_lo = _source_output(row, lo)-row["frame_start"]/config.fps
            local_hi = _source_output(row, hi)-row["frame_start"]/config.fps
            if any(local_lo <= b/config.fps+.18 and local_hi >= a/config.fps-.18 for a, b in intervals):
                raise ValueError("authored bridge/fade overlaps protected candidate interval")
            for source_time in _candidate_source_times(candidate, row):
                local = _source_output(row, source_time)-row["frame_start"]/config.fps
                if any(a/config.fps-.18 <= local <= b/config.fps+.18 for a, b in intervals):
                    raise ValueError("authored bridge/fade overlaps protected candidate clock")
            for kind in ("audio", "visual"):
                key = f"source_{kind}_attack_interval"
                if key in candidate:
                    lo, hi = _attack_interval(candidate[key], row, candidate.get(f"source_{kind}_event", t))
                    _reject_interval(lo, hi, row, intervals, config, "candidate attack interval")
        if "anchor" in plan["timeline"][row["index"]]:
            events = events + [plan["timeline"][row["index"]]["anchor"]]
        for event in events:
            for kind in ("audio", "visual"):
                # Same absolute frame phase as the base renderer; .18s safety
                # applies to supplied anchors and intervals, not unknown attacks.
                local = _source_output(row, event[f"source_{kind}_event"])-row["frame_start"]/config.fps
                if any(a/config.fps-.18 <= local <= b/config.fps+.18 for a, b in intervals):
                    raise ValueError("authored bridge/fade overlaps protected event")
            # Preserve every supplied full attack interval, not merely onsets.
            for key in ("attack_interval", "source_audio_attack_interval", "source_visual_attack_interval"):
                if key not in event:
                    continue
                lo, hi = _attack_interval(event[key], row, event["source_visual_event"] if key == "source_visual_attack_interval" else event["source_audio_event"])
                _reject_interval(lo, hi, row, intervals, config, "confirmed attack interval")
        mapping = row.get("_multishot_mapping")
        if mapping is not None:
            for lo, hi, _ in mapping.protected:
                _reject_interval(row["source_start"]+lo, row["source_start"]+hi,
                                 row, intervals, config, "map protected interval")
    if version == "authored-footage/v2":
        _validate_impacts(design["impacts"], plan, rows, config)
    return rows


def _source_output(row, source_time):
    """Validated map output clock, or unchanged 1x; never trust event metadata."""
    local = source_time-row["source_start"]
    mapping = row.get("_multishot_mapping")
    return row["output_start"] + (mapping.map(local) if mapping is not None else local)


def _candidate_source_times(candidate, row):
    times = [candidate["time"]]
    for kind in ("audio", "visual"):
        source_key, output_key = f"source_{kind}_event", f"output_{kind}_event"
        source = _finite(candidate.get(source_key, candidate["time"]), source_key)
        if not row["source_start"] <= source <= row["source_end"]:
            raise ValueError("candidate source clock outside clip")
        if source_key in candidate:
            times.append(source)
        if output_key in candidate:
            output = _finite(candidate[output_key], output_key)
            if abs(output-_source_output(row, source)) > 1e-7:
                raise ValueError("inconsistent mapped candidate output clock")
    return times


def _attack_interval(interval, row, onset):
    if not isinstance(interval, (list, tuple)) or len(interval) != 2:
        raise ValueError("confirmed attack interval requires [start,end]")
    lo, hi = (_finite(v, "confirmed attack interval") for v in interval)
    if not row["source_start"] <= lo <= onset <= hi <= row["source_end"]:
        raise ValueError("confirmed attack interval outside clip/onset")
    return lo, hi


def _reject_interval(lo, hi, row, occupied, config, label):
    # Monotonic validated map: endpoints protect the entire supplied interval,
    # including its portions in approximate-audio gaps. No new map is created.
    left = _source_output(row, lo)-row["frame_start"]/config.fps
    right = _source_output(row, hi)-row["frame_start"]/config.fps
    if any(left <= b/config.fps+.18 and right >= a/config.fps-.18 for a, b in occupied):
        raise ValueError(f"authored bridge/fade overlaps protected {label}")


def _finite(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f"{name} must be a finite number")
    return float(value)


def _frame(value, fps):
    # Round global output time once, like the base renderer. Subtracting a
    # rounded local duration would lose the row's absolute CFR phase.
    return int((Decimal(str(value))*fps).to_integral_value(rounding=ROUND_HALF_UP))


def _validate_impacts(impacts, plan, rows, config):
    """No review/certification: only supplied events or unconfirmed candidates.

    Required v2 impacts may be empty. Windows are centered on the nearest
    global output frame, non-overlapping, and bounded to their original row.
    Candidate source time is mapped using the row map (or existing 1x clock), not promoted to
    a confirmed identity or copied into row['events'].
    """
    if not isinstance(impacts, list) or len(impacts) > 128:
        raise ValueError("authored v2 impacts must be a bounded list (0..128)")
    for row in rows:
        row["authored_impacts"] = []
    for impact in impacts:
        _object(impact, {"clip_index", "output_time", "frames", "strength"}, "impact")
        i = _integer(impact["clip_index"], 0, len(rows)-1, "impact clip_index")
        row = rows[i]
        t = _finite(impact["output_time"], "impact output_time")
        n = _integer(impact["frames"], 2, 12, "impact frames")
        strength = _finite(impact["strength"], "impact strength")
        if not 0 <= strength <= 1:
            raise ValueError("impact strength must be within 0..1")
        if not row["output_start"] <= t <= row["output_end"]:
            raise ValueError(f"impact output_time outside clip {i}")
        anchors = [event[f"output_{kind}_event"] for event in row["events"]
                   if event.get("confirmed") is True for kind in ("audio", "visual")]
        # Candidate attack intervals/time were validated above and remain
        # explicitly unconfirmed. Derive output time from source, never from
        # unchecked candidate output metadata or an identity annotation.
        anchors += [_source_output(row, source)
                    for candidate in plan["timeline"][i].get("candidate_events", [])
                    for source in _candidate_source_times(candidate, row)]
        if not any(abs(t-anchor) <= 1/config.fps+1e-9 for anchor in anchors):
            raise ValueError(f"impact in clip {i} lacks a confirmed event or explicit unconfirmed candidate within one output frame")
        center = _frame(t, config.fps)-row["frame_start"]
        a, b = center-(n-1)//2, center-(n-1)//2+n-1
        if not 0 <= a <= center <= b < row["frame_count"]:
            raise ValueError(f"impact window outside clip {i} frame bounds")
        occupied = [(0, e["frames"]-1) if e["side"] == "in" else
                    (row["frame_count"]-e["frames"], row["frame_count"]-1)
                    for e in row["authored_edges"]]
        if row.get("authored_fade_frames"):
            occupied.append((row["frame_count"]-row["authored_fade_frames"], row["frame_count"]-1))
        occupied += [(e["start_frame"], e["end_frame"]) for e in row["authored_impacts"]]
        if any(a <= right and b >= left for left, right in occupied):
            raise ValueError(f"impact window overlaps authored bridge/fade/impact in clip {i}")
        row["authored_impacts"].append(dict(impact, start_frame=a, end_frame=b, center_frame=center))


def _impact_expression(impacts, variable):
    envelopes = []
    for impact in impacts:
        a, b, c = impact["start_frame"], impact["end_frame"], impact["center_frame"]
        # Half cosine with an exact center peak and zero outside the window.
        rise = f"(0.5-0.5*cos(PI*({variable}-{a})/{max(1, c-a)}))"
        fall = f"(0.5+0.5*cos(PI*({variable}-{c})/{max(1, b-c)}))"
        envelopes.append(f"if(between({variable},{a},{b}),{impact['strength']:.12g}*if(lt({variable},{c}),{rise},{fall}),0)")
    # Never stack zoom or exposure when multiple events are supplied.
    expression = "0"
    for envelope in envelopes:
        expression = f"max({expression},{envelope})"
    return expression


def video_graph(base_filter, row, config):
    """Consume exact CFR base frames; return graph ending at [authored]."""
    w, h, fps = config.width, config.height, config.fps
    parts = [f"[0:v:0]{base_filter}[base]"]
    shot = row["authored_shot"]
    if shot["composition"] == "inset":
        fw, fh = max(2, int(w*.78)//2*2), max(2, int(h*.78)//2*2)
        border = max(2, int(min(w, h)*.008)//2*2)
        # Both layers show the SAME decoded frame. The foreground is uncropped,
        # so this cannot reveal or imply a new angle or isolated subject.
        parts += ["[base]split=2[bg][fg]",
                  "[bg]gblur=sigma=8,eq=brightness=-0.16:saturation=0.25[back]",
                  f"[fg]scale={fw}:{fh},pad=iw+{2*border}:ih+{2*border}:{border}:{border}:color=0x78999c[front]",
                  "[back][front]overlay=x=(W-w)/2:y=(H-h)/2:shortest=1[composed]"]
    else:
        parts.append("[base]null[composed]")
    filters = []
    if shot["role"] == "setup":
        filters.append("eq=saturation=0.55:contrast=1.04")
    impacts = row.get("authored_impacts", [])
    if row["authored_edges"] or impacts:
        envelopes, pans, enables = [], [], []
        for edge in row["authored_edges"]:
            n = edge["frames"]
            a, b = (0, n-1) if edge["side"] == "in" else (row["frame_count"]-n, row["frame_count"]-1)
            u = f"((on-{a})/{b-a})"
            ease = f"(0.5-0.5*cos(PI*{u}))"
            env = f"if(between(on,{a},{b}),{('1-'+ease) if edge['side']=='in' else ease},0)"
            direction = 1 if edge["direction"] == "right" else -1
            # Incoming starts on the opposite side and recovers toward center,
            # continuing the outgoing visual motion across the hard cut.
            sign = direction if edge["side"] == "out" else -direction
            envelopes.append(env)
            pans.append(f"({sign}*{env})")
            enables.append(f"between(n,{a},{b})")
        env, pan = "+".join(envelopes) or "0", "+".join(pans) or "0"
        zoom = f"1+0.12*({env})"
        if impacts:
            zoom += f"+0.05*({_impact_expression(impacts, 'on')})"
        # ONE zoompan, d=1 consumes each base CFR frame exactly once; edge pan
        # and event zoom share that frame clock. No second fps/retiming stage.
        filters.append(f"zoompan=z='{zoom}':x='(iw-iw/zoom)*(0.5+0.45*({pan}))':"
                       f"y='(ih-ih/zoom)/2':d=1:s={w}x{h}:fps={fps}")
        if enables:
            filters.append(f"avgblur=sizeX=9:sizeY=1:enable='{'+'.join(enables)}'")
        if impacts:
            pulse = _impact_expression(impacts, "n")
            filters.append(f"eq=brightness='0.06*({pulse})':saturation='1+0.12*({pulse})':eval=frame")
    fade = row.get("authored_fade_frames")
    if fade:
        filters.append(f"fade=t=out:start_frame={row['frame_count']-fade}:nb_frames={fade-1}:color=black")
    filters += [f"trim=end_frame={row['frame_count']}", f"setpts=N/({fps}*TB)", "format=yuv420p"]
    parts.append("[composed]"+",".join(filters)+"[authored]")
    return ";".join(parts)
