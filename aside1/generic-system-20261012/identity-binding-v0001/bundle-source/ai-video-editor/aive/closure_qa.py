"""Standalone encounters/v1 closure engineering audit, not perceptual approval.

Source and music clocks are absolute sample-zero seconds. Output starts at
zero; music_time = plan.music_start + output_time. Only 1x windows supported.
Requested duration is a ceiling, not filler. Explicit reviewed-closure/v1
sidecar evidence never comes from generated roles, fades or phrase-fit flags.
Malformed contracts raise ValueError; valid unsafe/unevidenced plans fail/warn.
No mutation, file reads, decoding, synthesized beats or automatic promotion.
"""
from __future__ import annotations

import copy
import math
import re

VERSION = "closure-qa/v1"
REVIEW_VERSION = "reviewed-closure/v1"
MAX_SECONDS = 86400.
MAX_RECORDS = 512


def _num(value, name, maximum=MAX_SECONDS):
    if type(value) not in (int, float) or not 0 <= value <= maximum or not math.isfinite(value):
        raise ValueError(f"{name} must be finite nonnegative seconds <= {maximum}")
    return float(value)


def _text(value, name):
    if not isinstance(value, str) or not value.strip() or len(value) > 4096:
        raise ValueError(f"{name} must be nonempty text <=4096 characters")
    return value


def _sha(value):
    if not isinstance(value, str) or re.fullmatch(r"[0-9a-f]{64}", value) is None:
        raise ValueError("lowercase file SHA256 required")
    return value


def _obj(value, fields, name):
    if not isinstance(value, dict) or set(value) != set(fields.split()):
        raise ValueError(f"{name} requires exactly: {fields}")


def _enum(value, choices):
    if not isinstance(value, str) or value not in choices:
        raise ValueError("invalid reviewed decision")


def _json(value, depth=0):
    if depth > 24:
        raise ValueError("input nesting exceeds 24")
    if value is None or type(value) in (bool, str, int):
        return
    if type(value) is float and math.isfinite(value):
        return
    if isinstance(value, list) and len(value) <= 20000:
        for item in value:
            _json(item, depth+1)
        return
    if isinstance(value, dict) and len(value) <= 20000 and all(type(k) is str for k in value):
        for item in value.values():
            _json(item, depth+1)
        return
    raise ValueError("bounded JSON-safe inputs required")


def _evidence(record):
    for key in ("reviewer", "method"):
        _text(record[key], key)
    _obj(record["evidence"], "reference observation", "evidence")
    for key in ("reference", "observation"):
        _text(record["evidence"][key], key)
    if record["status"] != "reviewed":
        raise ValueError("explicit reviewed status required")


def validate_reviewed_closure(review):
    """Detached strict reviewed-closure/v1 sidecar; validates claims, not truth.

    Sources bind exact plan source strings to FULL FILE SHA256 and duration.
    Context/outcome use source_seconds; phrase uses music_seconds and an end
    uncertainty interval <=0.25s. Each has its own explicit reviewed evidence.
    Unknown/unresolved outcomes and uncertain/rejected phrases remain negative.
    """
    _json(review)
    _obj(review, "schema_version sources music fights phrases", "review")
    if review["schema_version"] != REVIEW_VERSION:
        raise ValueError("reviewed-closure/v1 required")
    if not isinstance(review["sources"], list) or not 1 <= len(review["sources"]) <= MAX_RECORDS:
        raise ValueError("bounded nonempty sources required")
    known = {}
    for source in review["sources"]:
        _obj(source, "source duration source_file_sha256", "source")
        sid = _text(source["source"], "source")
        if _num(source["duration"], "source duration") <= 0 or sid in known:
            raise ValueError("positive durations and unique sources required")
        _sha(source["source_file_sha256"])
        known[sid] = source
    _obj(review["music"], "song_sha256 duration", "music")
    music = review["music"]
    _sha(music["song_sha256"])
    if _num(music["duration"], "music duration") <= 0:
        raise ValueError("positive music duration required")
    for name in ("fights", "phrases"):
        if not isinstance(review[name], list) or len(review[name]) > MAX_RECORDS:
            raise ValueError(f"bounded {name} required")
    seen, ranges = set(), {}
    for fight in review["fights"]:
        _obj(fight, "id source source_file_sha256 context outcome", "fight")
        ident = _text(fight["id"], "fight ID")
        sid = _text(fight["source"], "fight source")
        if ident in seen or sid not in known:
            raise ValueError("duplicate fight ID or unknown source")
        seen.add(ident)
        source = known[sid]
        if fight["source_file_sha256"] != source["source_file_sha256"]:
            raise ValueError("fight source identity mismatch")
        c, o = fight["context"], fight["outcome"]
        _obj(c, "status clock start end reviewer method evidence", "context")
        _obj(o, "status clock time result reviewer method evidence", "outcome")
        _evidence(c)
        _evidence(o)
        if c["clock"] != "source_seconds" or o["clock"] != "source_seconds":
            raise ValueError("fight clocks must be source_seconds")
        a, b = (_num(c[k], k, source["duration"]) for k in ("start", "end"))
        t = _num(o["time"], "outcome time", source["duration"])
        if a >= b or not a <= t <= b:
            raise ValueError("outcome must lie inside nonempty full-fight bounds")
        _enum(o["result"], {"resolved", "unresolved", "unknown"})
        for x, y in ranges.setdefault(sid, []):
            if a < y and b > x:
                raise ValueError("ambiguous overlapping fight bounds")
        ranges[sid].append((a, b))
    seen = set()
    for p in review["phrases"]:
        _obj(p, "id song_sha256 status clock start end end_interval decision reviewer method evidence", "phrase")
        ident = _text(p["id"], "phrase ID")
        if ident in seen or p["song_sha256"] != music["song_sha256"]:
            raise ValueError("duplicate phrase ID or song identity mismatch")
        seen.add(ident)
        _evidence(p)
        if p["clock"] != "music_seconds":
            raise ValueError("phrase clock must be music_seconds")
        a, b = (_num(p[k], k, music["duration"]) for k in ("start", "end"))
        if not isinstance(p["end_interval"], list) or len(p["end_interval"]) != 2:
            raise ValueError("end_interval must be [lo,hi]")
        lo, hi = (_num(v, "end_interval", music["duration"]) for v in p["end_interval"])
        if a >= b or not a <= lo <= b <= hi or hi-lo > .25:
            raise ValueError("invalid phrase or uncertainty >0.25s")
        _enum(p["decision"], {"phrase_end", "not_phrase_end", "uncertain"})
    return copy.deepcopy(review)


def audit_closure(plan, reviewed_closure=None, *, source_sha256=None,
                  song_sha256=None, max_closure_gap=1.5, tolerance=1e-6):
    """JSON-safe all-join audit with separate fight and music closure gates.

    Positive overlap with supplied fight bounds requires ONE row to contain
    the whole fight; splitting/truncation fails, intact omission is allowed.
    The latest fight in the FINAL row must be explicitly resolved. Phrase end
    must equal actual music end, never the requested tail. Resolution-to-end
    and phrase uncertainty gaps must be nonnegative and <=max_closure_gap.
    Independently computed FULL FILE identities are required for a pass;
    validation never authenticates the reviewer or asserts perceptual approval.
    """
    _json(plan)
    limit = _num(max_closure_gap, "max_closure_gap", 5.)
    tol = _num(tolerance, "tolerance", .001)
    if not isinstance(plan, dict) or plan.get("schema_version") != "encounters/v1":
        raise ValueError("encounters/v1 required")
    rows = plan.get("timeline")
    if not isinstance(rows, list) or len(rows) > MAX_RECORDS:
        raise ValueError("bounded timeline required")
    duration, requested, ms, me = (_num(plan.get(k), k) for k in
                                 ("duration", "requested_duration", "music_start", "music_end"))
    if type(plan.get("music_continuous")) is not bool or not isinstance(plan.get("gaps"), list):
        raise ValueError("explicit music_continuous and gaps required")
    if source_sha256 is not None:
        if not isinstance(source_sha256, dict):
            raise ValueError("source_sha256 must be a source/file-digest mapping")
        for sid, sha in source_sha256.items():
            _text(sid, "source ID")
            _sha(sha)
    if song_sha256 is not None:
        _sha(song_sha256)
    review = validate_reviewed_closure(reviewed_closure) if reviewed_closure is not None else None
    checks, joins, bounds, parsed, used = [], [], [], [], {}

    def check(name, status, reason, **evidence):
        checks.append(dict(name=name, status=status, reason=reason, evidence=evidence))

    errors = []
    if not rows:
        errors.append("empty timeline")
    if duration > requested+tol:
        errors.append("requested duration exceeded")
    if abs(me-ms-duration) > tol:
        errors.append("root music/output duration mismatch")
    if not plan["music_continuous"] or plan["gaps"]:
        errors.append("music must be continuous without inserted gaps")
    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            raise ValueError("row must be an object")
        sid = _text(row.get("source"), "row source")
        a, b, os, oe, ma, mb = (_num(row.get(k), k) for k in
                              ("source_start", "source_end", "output_start", "output_end", "music_start", "music_end"))
        speed = _num(row.get("speed"), "speed", 100.)
        if a >= b or os >= oe or ma >= mb:
            errors.append(f"row {i}: empty/reversed window")
        if abs(speed-1) > tol or abs(b-a-(oe-os)) > tol:
            errors.append(f"row {i}: retiming or padding")
        if abs(ma-ms-os) > tol or abs(mb-ms-oe) > tol:
            errors.append(f"row {i}: music clock mismatch")
        if i == 0 and abs(os) > tol:
            errors.append("output must start at zero, no lead padding")
        if i:
            od, md = os-parsed[-1][4], ma-parsed[-1][6]
            safe = abs(od) <= tol and abs(md) <= tol
            joins.append(dict(boundary=i, output_delta=od, music_delta=md, status="pass" if safe else "fail"))
            if not safe:
                errors.append(f"join {i}: gap/overlap or music discontinuity")
        for x, y in used.setdefault(sid, []):
            if a < y-tol and b > x+tol:
                errors.append(f"row {i}: repeated/overlapping source range")
        used[sid].append((a, b))
        parsed.append((sid, a, b, os, oe, ma, mb))
        if "anchor" in row:
            anchor = row["anchor"]
            if not isinstance(anchor, dict):
                raise ValueError("anchor must be an object")
            t = _num(anchor.get("source_audio_event"), "anchor source_audio_event")
            ot = _num(anchor.get("output_time"), "anchor output_time")
            mt = _num(anchor.get("music_time"), "anchor music_time")
            if not a-tol <= t <= b+tol or abs(ot-(os+t-a)) > tol or abs(mt-(ms+ot)) > tol:
                errors.append(f"row {i}: anchor clock mismatch")
        local = []
        provenance = row.get("context_provenance")
        if isinstance(provenance, dict) and provenance.get("kind") == "manual":
            local.append((provenance.get("start"), provenance.get("end")))
        for collection in ("events", "candidate_events"):
            events = row.get(collection, [])
            if not isinstance(events, list) or len(events) > 15000:
                raise ValueError("bounded events required")
            for event in events:
                if not isinstance(event, dict):
                    raise ValueError("event must be object")
                for kind in ("audio", "visual"):
                    field = f"source_{kind}_event"
                    if field in event:
                        t = _num(event[field], field)
                        if not a-tol <= t <= b+tol:
                            errors.append(f"row {i}: event outside source window")
                        for target, expected in ((f"output_{kind}_event", os+t-a),
                                                 (f"{kind}_offset", t-a)):
                            if target in event and abs(_num(event[target], target)-expected) > tol:
                                errors.append(f"row {i}: event clock mismatch")
                if "encounter_start" in event or "encounter_end" in event:
                    local.append((event.get("encounter_start"), event.get("encounter_end")))
        for x, y in local:
            x, y = _num(x, "full-fight start"), _num(y, "full-fight end")
            if x >= y:
                raise ValueError("nonempty full-fight bounds required")
            intact = a <= x+tol and b >= y-tol
            bounds.append(dict(row=i, source=sid, start=x, end=y, origin="supplied_manual_bounds", status="pass" if intact else "fail"))
    if parsed and abs(parsed[-1][4]-duration) > tol:
        errors.append("last output end differs from duration; possible tail padding")
    check("timeline", "fail" if errors else "pass", "; ".join(errors) or "all 1x windows and joins conserve clocks", joins=joins)
    candidate = (plan.get("mode") not in (None, "reviewed")
                 or plan.get("review_status") not in (None, "reviewed")
                 or any(row.get("candidate_events")
                        or (isinstance(row.get("context_provenance"), dict)
                            and row["context_provenance"].get("kind") == "unreviewed_candidate_window")
                        for row in rows))
    check("review_mode", "warn" if candidate else "pass", "candidate/unreviewed plans cannot pass closure gate" if candidate else "explicit closure sidecar still required")
    final, per_row = [], {}
    if review:
        known = {s["source"]: s for s in review["sources"]}
        mismatch, unbound = [], []
        for sid, a, b, *_ in parsed:
            if sid not in known:
                unbound.append(sid)
                continue
            if b > known[sid]["duration"]+tol:
                mismatch.append(f"{sid}: source duration exceeded")
            if source_sha256 is None or sid not in source_sha256:
                unbound.append(sid)
            elif source_sha256[sid] != known[sid]["source_file_sha256"]:
                mismatch.append(f"{sid}: file identity mismatch")
        if me > review["music"]["duration"]+tol:
            mismatch.append("music duration exceeded")
        if song_sha256 is None:
            unbound.append("song")
        elif song_sha256 != review["music"]["song_sha256"]:
            mismatch.append("song identity mismatch")
        check("evidence_binding", "fail" if mismatch else "warn" if unbound else "pass",
              "; ".join(mismatch) or ("independent identities missing" if unbound else "caller file digests match reviewed identities"), unbound=sorted(set(unbound)))
        for fight in review["fights"]:
            ca, cb = fight["context"]["start"], fight["context"]["end"]
            for i, (sid, a, b, *_) in enumerate(parsed):
                if sid != fight["source"] or a >= cb-tol or b <= ca+tol:
                    continue
                intact = a <= ca+tol and b >= cb-tol
                bounds.append(dict(row=i, source=sid, start=ca, end=cb, fight_id=fight["id"], origin="reviewed_full_fight", status="pass" if intact else "fail"))
                per_row.setdefault(i, []).append(fight)
                if i == len(parsed)-1:
                    final.append(fight)
    else:
        check("evidence_binding", "warn", "no reviewed source/outcome/phrase sidecar")
    check("fight_bounds", "fail" if any(b["status"] == "fail" for b in bounds) else "pass" if bounds else "warn",
          "intersected supplied fights must remain intact; intact omission allowed", bounds=bounds)
    join_outcomes = []
    for i in range(max(0, len(parsed)-1)):
        fights = per_row.get(i, [])
        latest = max(fights, key=lambda f: f["context"]["end"]) if fights else None
        result = latest["outcome"]["result"] if latest else "unknown"
        join_outcomes.append(dict(boundary=i+1, fight_id=latest["id"] if latest else None,
                                  result=result, status="pass" if result == "resolved" else "fail" if result == "unresolved" else "warn"))
    join_status = "fail" if any(j["status"] == "fail" for j in join_outcomes) else "warn" if any(j["status"] == "warn" for j in join_outcomes) else "pass"
    check("join_outcomes", join_status, "each outgoing clip needs its own reviewed resolved fight; unknown context is not invented closure", joins=join_outcomes)
    last = max(final, key=lambda f: f["context"]["end"]) if final else None
    resolution = None
    if last:
        resolution = parsed[-1][3]+last["outcome"]["time"]-parsed[-1][1]
        result = last["outcome"]["result"]
        check("ending_fight", "pass" if result == "resolved" else "fail" if result == "unresolved" else "warn",
              "latest fight requires observed resolution, never kill label, payoff role or fade", fight=last)
    else:
        check("ending_fight", "warn", "no explicitly reviewed final fight; role/fade is not evidence")
    phrases = [p for p in review["phrases"] if abs(p["end"]-me) <= tol] if review else []
    phrase = phrases[0] if len(phrases) == 1 else None
    if phrase:
        decision = phrase["decision"]
        check("phrase_end", "pass" if decision == "phrase_end" else "fail" if decision == "not_phrase_end" else "warn",
              "independent observed phrase evidence, not generated downbeat/phrase-fit", phrase=phrase)
    else:
        check("phrase_end", "warn", "no unique reviewed phrase end at actual music end; no grid invented")
    if resolution is not None and phrase:
        gap = duration-resolution
        interval = [v-ms-resolution for v in phrase["end_interval"]]
        safe = -tol <= gap <= limit+tol and interval[0] >= -tol and interval[1] <= limit+tol
        check("closure_gap", "pass" if safe else "fail", "resolution-to-ending gap includes phrase uncertainty", output_gap=gap, music_gap_interval=interval, maximum=limit)
    else:
        check("closure_gap", "warn", "cannot measure closure without fight/phrase evidence", maximum=limit)
    status = "fail" if any(c["status"] == "fail" for c in checks) else "warn" if any(c["status"] == "warn" for c in checks) else "pass"
    return dict(schema_version=VERSION, status=status, engineering_gate=status == "pass",
                perceptual_approval=False, perceptual_status="not_assessed", checks=checks,
                clocks=dict(source="absolute source sample-zero seconds", music="absolute track sample-zero seconds", output="zero-origin seconds; 1x; music = plan.music_start + output"),
                duration=duration, requested_duration=requested, unfilled_duration=max(0., requested-duration),
                limitations=["Schema and caller file bindings do not authenticate reviewer assertions.", "No media decode, firing classification, rendered sync proof, listening or aesthetic approval.", "Short output permitted; no padding or invented beats/downbeats."])
