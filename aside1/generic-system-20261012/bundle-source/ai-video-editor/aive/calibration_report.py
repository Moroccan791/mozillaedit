"""Bounded, read-only summaries of supplied local evidence, never detection/review.

Labels are ``{'sets': [set, ...]}``. Each set requires kind, source,
source_identity, method, label_origin, coverage ([[start,end], ...]), complete
(bool), and events ([{'time': seconds}, ...]). Independent origins supported:
independent_audio_review, independent_visual_review, independent_annotation.
Identity is exactly a supplied source file_identity or {'audio_sha256': hash};
music uses {'song_sha256': hash}. Attack sets require explicit source_identities
on the attack report and use output clocks, never expected/planned clocks.
Coverage is the annotation scope, not evidence that everything was detected.
Precision/recall require complete coverage and no matching ambiguity; partial
labels support only descriptive matches/errors. Assertions supplied by a caller
are not authenticated here. This function performs no IO and changes no inputs.
"""
from bisect import bisect_left, bisect_right
from collections import Counter
from copy import deepcopy
import math

VERSION = 'calibration-report/v1'
MAX_NODES = 1_000_000
MAX_RECORDS = 20_000
MAX_LABEL_SETS = 128
MAX_SECONDS = 86_400
MAX_MATCH_EDGES = 100_000
TOLERANCES = {'firing': .050, 'icons': .150, 'music': .050,
              'game_attack': .020, 'music_attack': .020}
ORIGINS = {'independent_audio_review', 'independent_visual_review',
           'independent_annotation'}


def _bounded(value):
    stack, nodes = [(value, 0)], 0
    while stack:
        item, depth = stack.pop()
        nodes += 1
        if nodes > MAX_NODES or depth > 32:
            raise ValueError('input exceeds node/depth budget')
        if item is None or type(item) is bool:
            continue
        if type(item) in (int, float):
            if type(item) is float and not math.isfinite(item):
                raise ValueError('nonfinite input number')
        elif isinstance(item, str):
            if len(item) > 4096:
                raise ValueError('input text exceeds 4096 characters')
        elif isinstance(item, dict):
            if len(item) > MAX_RECORDS or any(not isinstance(k, str) for k in item):
                raise ValueError('invalid or oversized object')
            stack.extend((v, depth + 1) for v in item.values())
        elif isinstance(item, list):
            if len(item) > MAX_RECORDS:
                raise ValueError('input list exceeds record budget')
            stack.extend((v, depth + 1) for v in item)
        else:
            raise ValueError('inputs must contain JSON values only')


def _obj(value):
    return value if isinstance(value, dict) else {}


def _rows(value, key):
    rows = _obj(value).get(key, [])
    if not isinstance(rows, list):
        raise ValueError(key + ' must be a list')
    if any(not isinstance(row, dict) for row in rows):
        raise ValueError(key + ' records must be objects')
    return rows


def _time(value):
    return (float(value) if type(value) in (float, int) and
            0 <= value <= MAX_SECONDS else None)


def _text(value):
    return isinstance(value, str) and bool(value.strip())


def _summary(rows):
    return dict(total=len(rows), supplied_confirmed=sum(r.get('confirmed') is True for r in rows),
                candidate_or_unconfirmed=sum(r.get('confirmed') is not True for r in rows),
                confirmation_interpretation='supplied flag only; not independently validated')


def _match(predictions, labels, tolerance):
    """Accept only mutual degree-one edges, never nearest-neighbor guessing."""
    pred = sorted(predictions)
    truth = sorted(labels)
    pd, ld, edges = Counter(), Counter(), []
    for i, t in enumerate(pred):
        lo = bisect_left(truth, t - tolerance - 1e-12)
        hi = bisect_right(truth, t + tolerance + 1e-12)
        if len(edges) + hi - lo > MAX_MATCH_EDGES:
            raise ValueError('matching exceeds edge budget')
        for j in range(lo, hi):
            edges.append((i, j))
            pd[i] += 1
            ld[j] += 1
    pairs = [(i, j) for i, j in edges if pd[i] == ld[j] == 1]
    ambiguous_p = {i for i, j in edges if pd[i] != 1 or ld[j] != 1}
    ambiguous_l = {j for i, j in edges if pd[i] != 1 or ld[j] != 1}
    errors = [pred[i] - truth[j] for i, j in pairs]
    return dict(predictions=len(pred), labels=len(truth), matched=len(pairs),
                unmatched_predictions=sum(i not in pd for i in range(len(pred))),
                unmatched_labels=sum(j not in ld for j in range(len(truth))),
                ambiguous_predictions=len(ambiguous_p), ambiguous_labels=len(ambiguous_l),
                mean_absolute_error_ms=(1000 * sum(map(abs, errors))/len(errors) if errors else None),
                max_absolute_error_ms=(1000 * max(map(abs, errors)) if errors else None))


def audit_local_evidence(firing_map, icons, hit_maps, plan=None, attack=None, labels=None):
    """Return JSON-safe calibration-report/v1; invalid/budget-exceeding input raises ValueError."""
    for value in (firing_map, icons, hit_maps, plan, attack, labels):
        _bounded(value)
    firing, plan, attack = _obj(firing_map), _obj(plan), _obj(attack)
    if firing and firing.get('schema_version') != 'firing-map/v1':
        raise ValueError('firing-map/v1 required')
    sources = _rows(firing, 'sources')
    events = _rows(firing, 'candidate_events') + _rows(firing, 'events')
    windows = _rows(firing, 'candidate_windows')
    icon_rows = icons if isinstance(icons, list) else _rows(icons, 'records')
    if any(not isinstance(r, dict) for r in icon_rows):
        raise ValueError('icon records must be objects')
    maps = hit_maps if isinstance(hit_maps, list) else (
        [hit_maps] if _obj(hit_maps).get('schema_version') == 'hit-map/v1' else _rows(hit_maps, 'maps'))
    hit_rows, duplicates = [], 0
    seen_hits = set()
    identities, predictions = {}, {k: [] for k in TOLERANCES}
    for source in sources:
        sid = source.get('id')
        if not _text(sid) or sid in identities:
            raise ValueError('unique source IDs required')
        identities[sid] = [v for v in (source.get('file_identity'),
                           {'audio_sha256': source['audio_sha256']} if _text(source.get('audio_sha256')) else None) if v]
    invalid_times = Counter()
    def add(kind, sid, t):
        number = _time(t)
        if not _text(sid) or number is None:
            invalid_times[kind] += 1
        else:
            predictions[kind].append((sid, number))
    for row in events:
        add('firing', row.get('source'), row.get('source_audio_event', row.get('time')))
    for row in icon_rows:
        add('icons', row.get('source'), row.get('source_visual_event', row.get('time')))
    for hit_map in maps:
        if not isinstance(hit_map, dict) or hit_map.get('schema_version') != 'hit-map/v1':
            raise ValueError('hit-map/v1 required')
        sid = hit_map.get('song_sha256')
        if _text(sid):
            identities.setdefault(sid, []).append({'song_sha256': sid})
        for row in _rows(hit_map, 'candidates'):
            if not _text(sid) or _time(row.get('time')) is None:
                hit_rows.append(row)
                invalid_times['music'] += 1
                continue
            key = (sid, row.get('time'))
            if key in seen_hits:
                duplicates += 1
                continue
            seen_hits.add(key)
            hit_rows.append(row)
            add('music', sid, row.get('time'))
    clips = _rows(plan, 'timeline')
    assignments = _rows(plan, 'rhythm_assignments')
    attack_rows = _rows(attack, 'assignments')
    attack_counts = {}
    layered = 0
    for kind, key in (('game_attack', 'game'), ('music_attack', 'music')):
        counts = Counter()
        sid = key + '_stem'
        identity = _obj(attack.get('source_identities')).get(key)
        if isinstance(identity, dict) and identity:
            identities[sid] = [identity]
        for row in attack_rows:
            measurement = _obj(row.get(kind))
            status = measurement.get('status', 'missing')
            counts[status if status in ('measured', 'ambiguous', 'unmeasurable') else 'missing'] += 1
            if status == 'measured':
                add(kind, sid, measurement.get('time'))
            if kind == 'music_attack' and status == 'unmeasurable':
                reasons = {reason for peak in _rows(measurement.get('diagnostics'), 'peaks')
                           for reason in peak.get('reasons', []) if isinstance(reason, str)}
                layered += bool(reasons & {'high_sustained_baseline', 'insufficient_local_rise'})
        attack_counts[kind] = {s: counts[s] for s in ('measured', 'ambiguous', 'unmeasurable', 'missing')}
    attack_indices = [r.get('assignment_index', i) for i, r in enumerate(attack_rows)]
    valid_indices = {i for i in attack_indices if type(i) is int and 0 <= i < len(assignments)}
    report = dict(schema_version=VERSION, status='unverified', musical_sync='unverified',
        coverage=dict(sources=len(sources), firing=_summary(events), icons=_summary(icon_rows),
                      music=_summary(hit_rows), attack=attack_counts),
        omissions=dict(invalid_prediction_times=dict(invalid_times), duplicate_music_candidates=duplicates,
            plan_assignments=len(assignments), attack_assignments=len(attack_rows),
            plan_assignments_without_attack=len(assignments)-len(valid_indices),
            attack_assignments_unbound=sum(type(i) is not int or not 0 <= i < len(assignments) for i in attack_indices),
            duplicate_attack_assignment_indices=sum(type(i) is int for i in attack_indices)-len({i for i in attack_indices if type(i) is int}),
            omitted_encounters=len(_rows(plan, 'omitted_encounters')),
            unknown_window_fight=sum(_obj(r.get('context_review')).get('status') != 'reviewed' for r in windows),
            unknown_window_outcome=sum(_obj(r.get('outcome_review')).get('status') != 'reviewed' for r in windows),
            unknown_clip_fight=sum(_obj(r.get('context_review')).get('status') != 'reviewed' for r in clips),
            unknown_clip_outcome=sum(_obj(r.get('outcome_review')).get('status') != 'reviewed' for r in clips),
            sources_without_scene_cut_review=sum(_obj(r.get('scene_cut_review')).get('status') != 'reviewed' for r in sources),
            layered_music_unmeasurable_proxy=layered),
        metrics=[], rejected_label_sets=[], tolerances_seconds=dict(TOLERANCES),
        limitations=['No detection, IO, confirmation, alignment_verified promotion or perceptual certification.',
                     'No labels means coverage only; heuristic measured attacks are not calibrated truth.',
                     'Unknown counts require explicit reviewed evidence, not inferred fight/outcome/cut semantics.',
                     'Layered music proxy counts sustained/rise rejection reasons, not verified instrumentation.',
                     'Independent-label origin and source identity are caller assertions, not authenticated here.'])
    sets = _rows(labels, 'sets')
    if len(sets) > MAX_LABEL_SETS:
        raise ValueError('too many label sets')
    seen_scopes = set()
    for index, annotation in enumerate(sets):
        kind, sid = annotation.get('kind'), annotation.get('source')
        reason = None
        if not _text(kind) or kind not in TOLERANCES:
            reason = 'unsupported_kind'
        elif annotation.get('label_origin') not in ORIGINS or not _text(annotation.get('method')):
            reason = 'independent_origin_and_method_required'
        elif any(word in annotation['method'].lower() for word in ('planned', 'planner', 'expected_clock', 'candidate', 'attack-qa')):
            reason = 'circular_method_not_independent'
        elif not _text(sid) or not annotation.get('source_identity') or annotation.get('source_identity') not in identities.get(sid, []):
            reason = 'source_identity_mismatch_or_missing'
        coverage = annotation.get('coverage')
        intervals = []
        if reason is None:
            if not isinstance(coverage, list) or not coverage or type(annotation.get('complete')) is not bool:
                reason = 'explicit_coverage_and_completeness_required'
            else:
                for interval in coverage:
                    if not isinstance(interval, list) or len(interval) != 2 or any(_time(t) is None for t in interval) or interval[0] >= interval[1]:
                        reason = 'invalid_coverage'
                        break
                    intervals.append(interval)
                intervals.sort()
                if any(a[1] > b[0] for a, b in zip(intervals, intervals[1:])):
                    reason = 'overlapping_coverage'
        if reason is None and (kind, sid) in seen_scopes:
            reason = 'duplicate_label_scope'
        if reason is None:
            if 'events' not in annotation:
                report['rejected_label_sets'].append(dict(index=index, reason='explicit_label_events_required'))
                continue
            truth_rows = _rows(annotation, 'events')
            truth = [r.get('time') for r in truth_rows]
            inside = lambda t: _time(t) is not None and any(a <= t <= b for a, b in intervals)
            if any(any(k in r for k in ('expected_time', 'planned_time', 'output_time', 'planned_error_ms')) for r in truth_rows):
                reason = 'circular_label_clock_fields'
            elif any(not inside(t) for t in truth):
                reason = 'label_time_invalid_or_outside_coverage'
            else:
                pred = [t for source, t in predictions[kind] if source == sid and inside(t)]
                metric = _match(pred, truth, TOLERANCES[kind])
                metric.update(kind=kind, source=sid, source_identity=deepcopy(annotation['source_identity']),
                              label_origin=annotation['label_origin'],
                              method=annotation['method'], coverage=[list(r) for r in intervals],
                              complete=annotation['complete'], tolerance_seconds=TOLERANCES[kind])
                unambiguous = not (metric['ambiguous_predictions'] or metric['ambiguous_labels'])
                if annotation['complete'] and unambiguous and not invalid_times[kind]:
                    metric.update(precision=metric['matched']/len(pred) if pred else None,
                                  recall=metric['matched']/len(truth) if truth else None)
                else:
                    metric['precision_recall_omission'] = ('partial_labels' if not annotation['complete'] else
                        'ambiguous_matching' if not unambiguous else 'invalid_prediction_times')
                report['metrics'].append(metric)
                seen_scopes.add((kind, sid))
        if reason:
            report['rejected_label_sets'].append(dict(index=index, reason=reason))
    report['omissions']['independent_label_sets_supplied'] = len(sets)
    report['omissions']['independent_label_sets_rejected'] = len(report['rejected_label_sets'])
    if report['metrics']:
        report['status'] = 'independent_labels_audited'
    return report
