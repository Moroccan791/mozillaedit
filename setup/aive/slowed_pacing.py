"""Candidate-only slowed-song pacing: stretch the gaps between burst clusters.

Explicit, unreviewed machinery for slowed/edit-audio songs. Given a 1x candidate
plan (from ``local_authored_planner``) and a measured attack grid, each row is
partitioned into *burst clusters*: runs of measured gunshot transients whose
inter-shot spacing is at or below ``burst_gap`` seconds. Every cluster stays
rigidly 1x, so a burst keeps its own shot spacing exactly and transients are not
smeared; the gaps between clusters stretch with the same C2 quintic ease used by
``multishot_map`` so that each cluster can land on a chosen measured attack of the
song. Strength is computed per gap: the gap stretches as far as its certified
bounds allow while still landing the cluster on a measured attack, and stays at 1x
(recorded as an unsnapped cluster) when no measured attack is reachable.

Everything here is candidate evidence:

- anchors come from an unreviewed local detector, never a reviewed shot map;
- ``reviewed_input`` is False in every manifest and no event is promoted;
- the music grid is *measured acoustic attacks*, not certified percussion or meter;
- a row whose main candidate cannot be beat-matched is rendered rigid at 1x and
  reported as such - never force-fitted, padded or silently adjusted.

This module performs no media IO, no detection and no perceptual claims.
"""
from __future__ import annotations

import copy
import math

from .multishot_map import _bounds

SCHEMA = "candidate-pacing-map/v1"
ANCHOR_ORIGIN = "unreviewed-candidate-detector"
DEFAULT_SLOW_FLOOR = 0.55
DEFAULT_BURST_GAP = 0.18
DEFAULT_MAX_ROW_SLOWDOWN = 1.75
DEFAULT_MAX_OUTPUT_DURATION = 50.0
MIN_CLIPS = 4
EPS = 1e-7

LIMITATIONS = (
    "Candidate pacing only: anchors are unreviewed local acoustic/video candidates, not reviewed shots or kills.",
    "The target grid is measured acoustic attacks, not certified percussion, meter or musical taste.",
    "Playback is slowed only in the gaps between measured burst clusters; each cluster keeps rigid 1x playback so gunshot transients are not smeared.",
    "Gap slow-motion cannot go below the engine's atempo range, so the declared floor stays at or above 0.5 with a small margin for rounded slice edges.",
    "No interval is ever sped up: gaps keep 1x or stretch, bounded by the declared slow floor and per-row budget.",
    "Gap capacity is the inverse of the same analytic C2 bound the map certifies with, so no gap can overshoot the floor.",
    "Clusters and rows without a reachable measured attack stay at 1x and are reported as unsnapped/rigid; nothing is force-fitted or invented.",
    "musical_sync remains unverified; no lyric/closure integration exists for retimed clocks.",
)


def _number(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f"{name} must be a finite number")
    return float(value)


def _interval(value, name):
    if not isinstance(value, (list, tuple)) or len(value) != 2:
        raise ValueError(f"{name} must be a two-element interval")
    start, end = (_number(v, name) for v in value)
    if not start <= end:
        raise ValueError(f"{name} must be ordered")
    return start, end


def _smooth(u):
    return u ** 3 * (10 + u * (-15 + 6 * u))


def _slope(u):
    return 30 * u * u * (1 - u) * (1 - u)


class CandidatePacingMap:
    """One row's certified candidate pacing: rigid clusters, eased gaps.

    ``clusters`` are the rigid source-local burst spans and ``shifts`` the
    non-decreasing translation each cluster receives, so the map is the identity
    inside a cluster up to its own shift and one smoothstep per stretched gap.
    The map is stretch-only: playback never exceeds 1x, and the slowest instant of
    a gap is inside the declared floor. Nothing here is reviewed evidence.
    """

    def __init__(self, *, source_start, source_end, music_start, music_end,
                 clusters=(), shifts=(), unsnapped_clusters=(), anchor_source_time=None,
                 beat_music_time=None, beat_matched=False, burst_gap_seconds=DEFAULT_BURST_GAP,
                 slow_floor=DEFAULT_SLOW_FLOOR, tail_shift=None, tail_beat_music_time=None,
                 anchor_origin=ANCHOR_ORIGIN, reviewed_input=False, schema_version=SCHEMA):
        self.schema_version = schema_version
        if schema_version != SCHEMA:
            raise ValueError("unsupported candidate pacing schema")
        if reviewed_input is not False:
            raise ValueError("candidate pacing is unreviewed; reviewed_input must be False")
        if anchor_origin != ANCHOR_ORIGIN:
            raise ValueError("candidate pacing requires the unreviewed-candidate anchor origin")
        self.source_start = _number(source_start, "source_start")
        self.source_end = _number(source_end, "source_end")
        self.music_start = _number(music_start, "music_start")
        self.music_end = _number(music_end, "music_end")
        self.duration = self.source_end - self.source_start
        if self.duration <= 0:
            raise ValueError("source span must be positive")
        if self.music_end - self.music_start <= 0:
            raise ValueError("target span must be positive")
        self.burst_gap_seconds = _number(burst_gap_seconds, "burst_gap_seconds")
        if not 0 < self.burst_gap_seconds:
            raise ValueError("burst_gap_seconds must be positive")
        self.slow_floor = _number(slow_floor, "slow_floor")
        if not 0.5 <= self.slow_floor <= 1.0:
            raise ValueError("slow_floor must be within .5..1 (the engine's atempo range is 0.5..100)")
        self.anchor_origin = anchor_origin
        self.reviewed_input = False
        self.clusters = []
        previous_end = None
        for cluster in clusters:
            a, b = _interval(cluster, "cluster")
            if a < -EPS or b > self.duration + EPS or a > b:
                raise ValueError("cluster outside the row")
            if previous_end is not None and a <= previous_end + EPS:
                raise ValueError("clusters must be disjoint and ordered")
            previous_end = b
            self.clusters.append([a, b])
        self.shifts = [_number(v, "shift") for v in shifts]
        if len(self.shifts) != len(self.clusters):
            raise ValueError("one shift per cluster required")
        if any(v < -EPS for v in self.shifts):
            raise ValueError("candidate pacing never runs backwards")
        for left, right in zip(self.shifts, self.shifts[1:]):
            if right < left - EPS:
                raise ValueError("cluster shifts must be non-decreasing")
        self.unsnapped_clusters = []
        for value in unsnapped_clusters:
            if type(value) is not int or not 0 <= value < len(self.clusters):
                raise ValueError("unsnapped_clusters must name clusters of this row")
            if value not in self.unsnapped_clusters:
                self.unsnapped_clusters.append(value)
        last = self.shifts[-1] if self.shifts else 0.0
        self.tail_shift = last if tail_shift is None else _number(tail_shift, "tail_shift")
        if self.tail_shift < last - EPS:
            raise ValueError("the cut may only move later, never earlier")
        self.tail_beat_music_time = (None if tail_beat_music_time is None
                                     else _number(tail_beat_music_time, "tail_beat_music_time"))
        self.beat_matched = bool(beat_matched)
        self.anchor_source_time = None if anchor_source_time is None else _number(anchor_source_time, "anchor_source_time")
        self.beat_music_time = None if beat_music_time is None else _number(beat_music_time, "beat_music_time")
        if self.beat_matched:
            if not self.clusters:
                raise ValueError("a beat-matched row needs the cluster that holds its anchor")
            if self.anchor_source_time is None or self.beat_music_time is None:
                raise ValueError("a beat-matched row needs its anchor and target beat")
            if not self.source_start - EPS <= self.anchor_source_time <= self.source_end + EPS:
                raise ValueError("anchor outside the row")
            local = self.anchor_source_time - self.source_start
            holders = [i for i, (a, b) in enumerate(self.clusters) if a - EPS <= local <= b + EPS]
            if len(holders) != 1:
                raise ValueError("anchor must sit inside exactly one measured burst cluster")
            expected = self.music_start + local + self.shifts[holders[0]]
            if abs(expected - self.beat_music_time) > 1e-7:
                raise ValueError("anchor must land exactly on its declared measured attack")
            if holders[0] in self.unsnapped_clusters:
                raise ValueError("the anchor cluster cannot be unsnapped")
        else:
            # No anchor claim: the main measured candidate could not be moved onto
            # an attack, so this row claims nothing about it. Later gaps and the
            # cut may still stretch onto measured attacks, each reported on its own.
            if self.anchor_source_time is not None or self.beat_music_time is not None:
                raise ValueError("an unanchored row declares no anchor beat")
        if self.tail_beat_music_time is not None:
            if self.tail_shift <= (self.shifts[-1] if self.shifts else 0.0) + EPS:
                raise ValueError("a declared cut beat requires an actually stretched cut")
            expected = self.music_start + self.duration + self.tail_shift
            if abs(expected - self.tail_beat_music_time) > 1e-7:
                raise ValueError("the stretched cut must land exactly on its declared measured attack")
        self.gaps = []
        for k in range(len(self.clusters)):
            start = 0.0 if k == 0 else self.clusters[k - 1][1]
            end = self.clusters[k][0]
            change = self.shifts[k] - (self.shifts[k - 1] if k else 0.0)
            if change > EPS and end - start <= EPS:
                raise ValueError("cannot stretch a gap of zero length")
            if change > EPS:
                self.gaps.append((start, end))
        self._terms = []
        for k in range(len(self.clusters)):
            change = self.shifts[k] - (self.shifts[k - 1] if k else 0.0)
            if change <= EPS:
                continue
            start = 0.0 if k == 0 else self.clusters[k - 1][1]
            self._terms.append((start, self.clusters[k][0], change))
        tail_change = self.tail_shift - last
        if tail_change > EPS:
            if not self.clusters:
                raise ValueError("a stretched cut needs the row's measured burst clusters")
            tail_start = self.clusters[-1][1]
            if tail_start >= self.duration - EPS:
                raise ValueError("cannot stretch a cut with no room after the last burst")
            self._terms.append((tail_start, self.duration, tail_change))
        bounds = [1.0, 1.0]
        for start, end, change in self._terms:
            lo, hi = _bounds(end - start, change)
            bounds[0] = min(bounds[0], lo)
            bounds[1] = max(bounds[1], hi)
        self.min_speed, self.max_speed = bounds
        if self.min_speed < self.slow_floor - 1e-6:
            raise ValueError("a paced gap would run below the declared slow floor")
        self.protected = [list(cluster) for cluster in self.clusters]

    @property
    def output_duration(self):
        return self.duration + self.tail_shift

    @property
    def shift_total(self):
        return self.tail_shift

    @property
    def clauses(self):
        return self.output_duration / self.duration

    def map(self, t):
        value = _number(t, "local time")
        if not -EPS <= value <= self.duration + EPS:
            raise ValueError("time outside the mapped row")
        total = value
        for start, end, change in self._terms:
            if value >= end:
                total += change
                continue
            if value > start:
                total += change * _smooth((value - start) / (end - start))
        return total

    def speed(self, t):
        """Playback speed (source samples per output second) at a local time."""
        value = _number(t, "local time")
        if not -EPS <= value <= self.duration + EPS:
            raise ValueError("time outside the mapped row")
        slope = 1.0
        for start, end, change in self._terms:
            if start < value < end:
                slope += change * _slope((value - start) / (end - start)) / (end - start)
        return 1.0 / slope

    def bounds(self):
        return self.min_speed, self.max_speed

    def expression(self, variable="T"):
        """FFmpeg expression for this map; same sum of clamped smoothsteps."""
        name = str(variable)
        parts = [name]
        for start, end, change in self._terms:
            length = end - start
            u = f"min(max(({name}-{start:.12f})/{length:.12f},0),1)"
            parts.append(f"{change:.12f}*({u}*{u}*{u}*(10+{u}*(-15+6*{u})))")
        return "+".join(parts)

    def manifest(self):
        return dict(schema_version=self.schema_version, anchor_origin=self.anchor_origin,
                    reviewed_input=False, burst_gap_seconds=self.burst_gap_seconds,
                    slow_floor=self.slow_floor, duration=self.duration,
                    output_duration=self.output_duration, shift_total=self.shift_total,
                    stretch_ratio=self.clauses,
                    clusters=[list(v) for v in self.clusters], shifts=list(self.shifts),
                    unsnapped_clusters=list(self.unsnapped_clusters),
                    anchor_source_time=self.anchor_source_time, beat_music_time=self.beat_music_time,
                    beat_matched=self.beat_matched, tail_shift=self.tail_shift,
                    tail_beat_music_time=self.tail_beat_music_time, min_speed=self.min_speed,
                    max_speed=self.max_speed,
                    clauses=[dict(source_seconds=self.duration, output_seconds=self.output_duration,
                                  playback_floor=self.min_speed)],
                    clocks=dict(source_origin=self.source_start, source_endpoint=self.source_end,
                                target_origin=self.music_start, target_endpoint=self.music_end),
                    limitations=list(LIMITATIONS))


def build_candidate_pacing_map(document_or_kwargs=None, **kwargs):
    """Rebuild a candidate pacing map and recompare its own manifest.

    Only explicit numbers are accepted: the document must be a complete,
    unedited manifest, and stale or hand-edited values raise instead of
    silently rendering something other than what the solver certified.
    """
    if document_or_kwargs is None:
        document = dict(kwargs)
    elif kwargs:
        raise ValueError("pass either a document or keyword arguments")
    else:
        document = document_or_kwargs
    if not isinstance(document, dict):
        raise ValueError("candidate pacing document required")
    if document.get("schema_version") != SCHEMA:
        raise ValueError("unsupported candidate pacing document")
    clocks = document.get("clocks")
    if not isinstance(clocks, dict):
        raise ValueError("candidate pacing needs explicit clocks")
    mapping = CandidatePacingMap(
        source_start=clocks.get("source_origin"), source_end=clocks.get("source_endpoint"),
        music_start=clocks.get("target_origin"), music_end=clocks.get("target_endpoint"),
        clusters=document.get("clusters"), shifts=document.get("shifts"),
        unsnapped_clusters=document.get("unsnapped_clusters") or (),
        anchor_source_time=document.get("anchor_source_time"),
        beat_music_time=document.get("beat_music_time"),
        beat_matched=document.get("beat_matched"), burst_gap_seconds=document.get("burst_gap_seconds"),
        slow_floor=document.get("slow_floor"), tail_shift=document.get("tail_shift"),
        tail_beat_music_time=document.get("tail_beat_music_time"),
        anchor_origin=document.get("anchor_origin"),
        reviewed_input=document.get("reviewed_input"), schema_version=document.get("schema_version"))
    if mapping.manifest() != document:
        raise ValueError("candidate pacing document is stale or hand-edited")
    return mapping


def beats_from_hit_maps(maps):
    """Absolute measured attack times from hit-map/v1 candidates (unreviewed).

    ``refined_time`` is preferred when present; candidates without either clock
    are skipped rather than clamped, and near-duplicate detections collapse.
    """
    if not isinstance(maps, (list, tuple)):
        raise ValueError("hit maps must be a list")
    beats = []
    for entry in maps:
        if not isinstance(entry, dict):
            raise ValueError("hit map entries must be objects")
        for candidate in entry.get("candidates", []):
            if not isinstance(candidate, dict):
                raise ValueError("hit map candidates must be objects")
            if candidate.get("confirmed") is True:
                raise ValueError("candidate pacing only consumes unconfirmed detections")
            value = candidate.get("refined_time")
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                value = candidate.get("time")
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
                continue
            beats.append(float(value))
    beats.sort()
    distinct = []
    for value in beats:
        if not distinct or value - distinct[-1] > 0.02:
            distinct.append(value)
    return distinct


def row_measurements(row):
    """Row-local ``(start, end, anchor)`` triples of a row's measured candidates."""
    if not isinstance(row, dict):
        raise ValueError("row must be an object")
    origin = _number(row.get("source_start"), "source_start")
    end = _number(row.get("source_end"), "source_end")
    shots, anchor = [], None
    main = row.get("main_candidate_id")
    for candidate in row.get("candidate_events") or []:
        if not isinstance(candidate, dict) or candidate.get("confirmed") is not False:
            raise ValueError("candidate pacing only consumes explicitly unconfirmed candidates")
        interval = _interval(candidate.get("attack_interval"), "candidate attack interval")
        if interval[0] < origin - EPS or interval[1] > end + EPS:
            raise ValueError("candidate attack interval outside the row")
        time = candidate.get("source_audio_event", candidate.get("time"))
        time = _number(time, "candidate anchor time")
        if not interval[0] - EPS <= time <= interval[1] + EPS:
            raise ValueError("candidate anchor time outside its measured interval")
        shots.append((interval[0] - origin, interval[1] - origin, time - origin))
        if main is not None and candidate.get("id") == main:
            anchor = time - origin
    shots.sort(key=lambda v: (v[0], v[1], v[2]))
    return shots, anchor


def cluster_shots(shots, burst_gap):
    """Rigid burst spans: consecutive shots no further apart than ``burst_gap``."""
    gap = _number(burst_gap, "burst_gap")
    if gap <= 0:
        raise ValueError("burst_gap must be positive")
    clusters = []
    for start, end, _anchor in shots:
        if clusters and start - clusters[-1][1] <= gap + EPS:
            clusters[-1][1] = max(clusters[-1][1], end)
        else:
            clusters.append([start, end])
    return [tuple(v) for v in clusters]


def gap_capacity(length, slow_floor):
    """Widest certified stretch for a gap: the C2 bound, solved by bisection.

    The quintic ease peaks at 15/8 of its average slope, so the linear bound
    ``length*(1/floor-1)`` would overshoot; this returns the largest stretch whose
    analytic playback minimum still meets the declared floor.
    """
    length = _number(length, "gap length")
    floor = _number(slow_floor, "slow_floor")
    if length <= 0 or not 0.5 <= floor <= 1.0:
        return 0.0
    lo, hi = 0.0, length * (1 / floor - 1)
    if hi <= 0:
        return 0.0
    if _bounds(length, hi)[0] >= floor:
        return hi
    for _ in range(80):
        mid = (lo + hi) / 2
        if _bounds(length, mid)[0] >= floor:
            lo = mid
        else:
            hi = mid
    return lo


def _pick_attack(window_lo, window_hi, grid):
    """Largest measured attack inside a reach window, or None."""
    if window_hi < window_lo - EPS:
        return None
    best = None
    for value in grid:
        if value < window_lo - EPS:
            continue
        if value > window_hi + EPS:
            break
        best = value
    return best


def _cluster_index(clusters, local):
    for i, (a, b) in enumerate(clusters):
        if a - EPS <= local <= b + EPS:
            return i
    return None


def _row_desire(row, *, slow_floor, burst_gap, max_row_slowdown):
    """Stretch this row would take if the whole budget were available."""
    try:
        shots, anchor = row_measurements(row)
    except ValueError:
        return 0.0
    if not shots or anchor is None:
        return 0.0
    origin = float(row["source_start"])
    clusters = cluster_shots(shots, burst_gap)
    if not clusters or _cluster_index(clusters, anchor) is None:
        return 0.0
    total = 0.0
    for k, (a, _b) in enumerate(clusters):
        total += gap_capacity(a - (0.0 if k == 0 else clusters[k - 1][1]), slow_floor)
    total += gap_capacity(float(row["source_end"]) - origin - clusters[-1][1], slow_floor)
    return min(total, max_row_slowdown)


def _chain(clusters, caps, grid, base, ceiling, main_cluster, wanted):
    """One chain attempt: rigid clusters, eased gaps, snapped heads.

    Returns None when the gap chain cannot deliver ``wanted`` to the main cluster,
    otherwise the shifts, the clusters that found an attack, those that did not and
    the cut's own snapped stretch.
    """
    shifts, unsnapped, found = [], [], {}
    previous = 0.0
    for k, (a, _b) in enumerate(clusters):
        if k == main_cluster:
            if previous + caps[k] < wanted - EPS:
                return None
            shift = wanted
            found[k] = base + a + shift
        elif k < main_cluster:
            # Gaps before the main cluster stretch as far as their own capacity
            # reaches: only the gap that delivers the main cluster has to close the
            # remaining distance to the target.
            upper = min(previous + caps[k], wanted)
            hit = _pick_attack(base + a + previous, base + a + upper, grid)
            shift = previous if hit is None else hit - (base + a)
            (unsnapped.append(k) if hit is None else found.setdefault(k, hit))
        else:
            upper = min(previous + caps[k], ceiling)
            hit = _pick_attack(base + a + previous, base + a + upper, grid)
            shift = previous if hit is None else hit - (base + a)
            (unsnapped.append(k) if hit is None else found.setdefault(k, hit))
        shift = max(0.0, min(shift, ceiling))
        if shift < previous:
            shift = previous
        shifts.append(shift)
        previous = shift
    return shifts, unsnapped, found, previous


def _snap_cut(clusters, rows_end, grid, base, ceiling, previous, slow_floor):
    """Stretch the row's end onto a measured attack when its bounds allow.

    The row ends where the next cut begins, so moving that edge is what turns the
    slowed song's attacks into cut rhythm instead of only in-clip slowdown.
    """
    tail_seconds = rows_end - clusters[-1][1]
    cap = min(gap_capacity(tail_seconds, slow_floor), ceiling - previous)
    if cap <= EPS:
        return previous, None, tail_seconds
    hit = _pick_attack(base + rows_end + previous, base + rows_end + previous + cap, grid)
    if hit is None:
        return previous, None, tail_seconds
    return hit - (base + rows_end), hit, tail_seconds


def _plan_row(row, *, grid, base, ceiling, slow_floor, burst_gap, max_row_slowdown):
    """Choose the row's cluster shifts, or return a rigid-row reason.

    ``base`` is the absolute music time of the row's local zero **including** the
    drift of every already-paced row before it, so a cluster lands on
    ``base + local + shift``. Shifts only grow, so burst order never changes and a
    row is a chain of rigid clusters joined by stretched gaps. Later targets are
    preferred, so the row takes the strongest certified slowdown; when no target
    is reachable the row still stretches what it can after the anchor and reports
    that its main candidate was *not* beat-matched.
    """
    shots, anchor = row_measurements(row)
    if not shots:
        return dict(rigid="the row carries no measured candidate bursts")
    if anchor is None:
        return dict(rigid="the row has no main measured candidate to anchor")
    origin = float(row["source_start"])
    duration = float(row["source_end"]) - origin
    clusters = cluster_shots(shots, burst_gap)
    if not clusters:
        return dict(rigid="the row carries no measured burst clusters")
    main_cluster = _cluster_index(clusters, anchor)
    if main_cluster is None:
        return dict(rigid="the main measured candidate does not sit inside a measured burst")
    ceiling = max(0.0, min(float(max_row_slowdown), float(ceiling)))
    caps = [gap_capacity(clusters[k][0] - (0.0 if k == 0 else clusters[k - 1][1]), slow_floor)
            for k in range(len(clusters))]
    reach = min(sum(caps[:main_cluster + 1]), ceiling)
    targets = [g for g in grid if base + anchor - EPS <= g <= base + anchor + reach + EPS]
    for target in reversed(targets):
        wanted = target - (base + anchor)
        attempt = _chain(clusters, caps, grid, base, ceiling, main_cluster, wanted)
        if attempt is None:
            continue
        shifts, unsnapped, found, previous = attempt
        tail_shift, tail_target, tail_seconds = _snap_cut(clusters, duration, grid, base, ceiling,
                                                          previous, slow_floor)
        found.pop(main_cluster, None)
        return dict(clusters=clusters, main_cluster=main_cluster, shifts=shifts,
                    unsnapped=unsnapped, targets=found, target=target, anchor=anchor,
                    tail_shift=tail_shift, tail_target=tail_target, tail_seconds=tail_seconds,
                    partial=False)
    attempt = _chain(clusters, caps, grid, base, ceiling, main_cluster, 0.0)
    if attempt is not None:
        shifts, unsnapped, found, previous = attempt
        tail_shift, tail_target, tail_seconds = _snap_cut(clusters, duration, grid, base, ceiling,
                                                          previous, slow_floor)
        if shifts[-1] > EPS or tail_shift > EPS:
            # Some slowdown is still real even though the anchor could not move;
            # nothing about the main candidate is claimed.
            found.pop(main_cluster, None)
            unsnapped = sorted(set(unsnapped) | {main_cluster})
            nearest = min(abs(base + anchor - g) for g in grid)
            return dict(clusters=clusters, main_cluster=main_cluster, shifts=shifts,
                        unsnapped=unsnapped, targets=found, target=None, anchor=anchor,
                        tail_shift=tail_shift, tail_target=tail_target, tail_seconds=tail_seconds,
                        partial=True, anchor_offset_seconds=nearest)
    return dict(rigid="no measured attack is reachable through the row's certified gap chain",
                clusters=clusters, main_cluster=main_cluster)


def plan_slowed_pacing(plan, *, beats, fps=60, slow_floor=DEFAULT_SLOW_FLOOR,
                       burst_gap=DEFAULT_BURST_GAP, max_row_slowdown=DEFAULT_MAX_ROW_SLOWDOWN,
                       max_output_duration=DEFAULT_MAX_OUTPUT_DURATION, min_clips=MIN_CLIPS):
    """Retime an encounters/v1 candidate plan onto a measured attack grid.

    Returns ``(paced_plan, report)``. Only rows whose main measured candidate can
    reach a measured attack are retimed; every other row stays rigid at 1x and is
    named in the report. Shifts are continuous seconds - frame rounding happens in
    the renderer - but ``fps`` is required to rebuild the bounded authored design
    on the retimed clocks. No event is promoted and no claim is certified.
    """
    if not isinstance(plan, dict) or plan.get("schema_version") != "encounters/v1":
        raise ValueError("expected encounters/v1 plan")
    rows = plan.get("timeline")
    if not isinstance(rows, list) or len(rows) < min_clips:
        raise ValueError(f"at least {min_clips} candidate rows required")
    grid = sorted(_number(value, "measured attack") for value in beats)
    if not grid:
        raise ValueError("a measured attack grid is required")
    slow_floor = _number(slow_floor, "slow_floor")
    if not 0.5 <= slow_floor <= 1.0:
        raise ValueError("slow_floor must be within .5..1 (the engine's atempo range is 0.5..100)")
    burst_gap = _number(burst_gap, "burst_gap")
    max_row_slowdown = _number(max_row_slowdown, "max_row_slowdown")
    max_output_duration = _number(max_output_duration, "max_output_duration")
    music_start = _number(plan.get("music_start"), "music_start")
    out = copy.deepcopy(plan)
    kept, rigid_rows = [], []
    cursor, drift, paced_total = 0.0, 0.0, 0.0
    desires = [_row_desire(row, slow_floor=slow_floor, burst_gap=burst_gap,
                           max_row_slowdown=max_row_slowdown) for row in out["timeline"]]
    flat = sum(float(row["source_end"]) - float(row["source_start"]) for row in out["timeline"])
    budget = min(max(0.0, max_output_duration - flat), sum(desires))
    for index, row in enumerate(out["timeline"]):
        origin = float(row["source_start"])
        duration = float(row["source_end"]) - origin
        rest = sum(desires[index:])
        share = budget * (desires[index] / rest) if rest > 0 else 0.0
        ceiling = min(max_row_slowdown, share)
        found = _plan_row(row, grid=grid, base=music_start + cursor + drift, ceiling=ceiling,
                          slow_floor=slow_floor, burst_gap=burst_gap,
                          max_row_slowdown=max_row_slowdown)
        if "rigid" in found:
            row["output_start"] = cursor + drift
            row["output_end"] = row["output_start"] + duration
            row["music_start"] = music_start + row["output_start"]
            row["music_end"] = music_start + row["output_end"]
            row["pacing_unsnapped_clusters"] = []
            for candidate in row.get("candidate_events") or []:
                local = float(candidate.get("source_audio_event", candidate["time"])) - float(row["source_start"])
                candidate["output_audio_event"] = row["output_start"] + local
            offset = None
            for candidate in row.get("candidate_events") or []:
                if candidate.get("id") != row.get("main_candidate_id"):
                    continue
                moment = float(candidate.get("source_audio_event", candidate["time"]))
                absolute = music_start + row["output_start"] + (moment - float(row["source_start"]))
                offset = round(min(abs(absolute - value) for value in grid), 6)
            rigid_rows.append(dict(index=index, row=row.get("id", index), beat_matched=False,
                                   reason=found["rigid"], partial=False,
                                   main_candidate_id=row.get("main_candidate_id"),
                                   anchor_offset_seconds=offset, unsnapped_clusters=[]))
            cursor += duration
            paced_total += duration
            continue
        partial = bool(found.get("partial"))
        row_music_start = music_start + cursor + drift
        mapping = CandidatePacingMap(
            source_start=origin, source_end=float(row["source_end"]),
            music_start=row_music_start,
            music_end=row_music_start + duration + found["tail_shift"],
            clusters=found["clusters"], shifts=found["shifts"],
            unsnapped_clusters=found["unsnapped"],
            anchor_source_time=None if partial else origin + found["anchor"],
            beat_music_time=None if partial else found["target"], beat_matched=not partial,
            burst_gap_seconds=burst_gap, slow_floor=slow_floor,
            tail_shift=found["tail_shift"], tail_beat_music_time=found["tail_target"])
        row["pacing_map"] = mapping.manifest()
        row["pacing_unsnapped_clusters"] = list(found["unsnapped"])
        row["output_start"] = cursor + drift
        row["output_end"] = row["output_start"] + mapping.output_duration
        # The row's music clock IS the map's clock: copied, never re-derived, so
        # the renderer's exact endpoint re-derivation cannot drift by float noise.
        row["music_start"] = mapping.music_start
        row["music_end"] = mapping.music_end
        for candidate in row.get("candidate_events") or []:
            local = float(candidate.get("source_audio_event", candidate["time"])) - origin
            candidate["output_audio_event"] = row["output_start"] + mapping.map(local)
        tail = dict(source_seconds=round(found["tail_seconds"], 6),
                    stretch_seconds=round(found["tail_shift"] - found["shifts"][-1], 6),
                    target_beat=found["tail_target"],
                    playback_floor=round(gap_capacity(found["tail_seconds"],
                                                      slow_floor), 6))
        gaps = []
        for k in range(len(found["clusters"])):
            length = found["clusters"][k][0] - (0.0 if k == 0 else found["clusters"][k - 1][1])
            stretch = found["shifts"][k] - (found["shifts"][k - 1] if k else 0.0)
            if stretch <= EPS:
                continue
            gaps.append(dict(cluster=k, source_seconds=round(length, 6),
                             stretch_seconds=round(stretch, 6),
                             playback_floor=round(_bounds(length, stretch)[0], 6)))
        kept.append(dict(index=index, beat_matched=not partial, partial=partial,
                         main_candidate_id=row.get("main_candidate_id"),
                         anchor_offset_seconds=round(found.get("anchor_offset_seconds", 0.0), 6),
                         unsnapped_clusters=list(found["unsnapped"]),
                         clusters=[dict(cluster=k, source_start=found["clusters"][k][0],
                                        source_end=found["clusters"][k][1], shift=round(found["shifts"][k], 6),
                                        snapped=k not in found["unsnapped"],
                                        target_beat=(found["target"] if k == found["main_cluster"] and not partial
                                                     else found["targets"].get(k)))
                                   for k in range(len(found["clusters"]))],
                         gap_strengths=gaps, tail=tail, stretch_seconds=mapping.shift_total,
                         playback_floor=mapping.min_speed))
        cursor += duration
        drift += mapping.shift_total
        paced_total += mapping.output_duration
        budget -= mapping.shift_total
    out["duration"] = paced_total
    out["music_end"] = music_start + paced_total
    from .encounter_render import render_clock_model
    out["clock_model"] = render_clock_model("slowed-pacing", out["timeline"])
    total = len(out["timeline"])
    if len(kept) + len(rigid_rows) != total:
        raise ValueError("candidate pacing must account for every row exactly once")
    report = dict(mode="auto-slowed-candidate", schema_version="candidate-pacing-report/v1",
                  grid_origin="measured acoustic attacks from hit-map/v1, unreviewed",
                  measured_attacks=len(grid), bursts_stay_rigid=True,
                  slow_floor=slow_floor, burst_gap_seconds=burst_gap,
                  max_row_slowdown=max_row_slowdown, max_output_duration=max_output_duration,
                  original_duration=sum(float(r["source_end"]) - float(r["source_start"]) for r in out["timeline"]),
                  paced_duration=paced_total, rows_total=total,
                  rows_beat_matched=sum(1 for e in kept if e["beat_matched"]),
                  rows_partial=sum(1 for e in kept if not e["beat_matched"]),
                  rows_rigid=len(rigid_rows), kept=kept, rigid_rows=rigid_rows,
                  limitations=list(LIMITATIONS))
    out["pacing"] = report
    if not kept:
        raise ValueError("no row could be beat-matched; refusing to ship a rigid candidate")
    from .local_authored_planner import _design
    assignments = copy.deepcopy(out.get("rhythm_assignments") or [])
    if len(assignments) != total:
        raise ValueError("one rhythm assignment per candidate row required")
    for index, row in enumerate(out["timeline"]):
        origin = float(row["source_start"])
        main = row.get("main_candidate_id")
        moment = None
        for candidate in row.get("candidate_events") or []:
            if candidate.get("id") == main:
                moment = float(candidate.get("source_audio_event", candidate["time"]))
        if moment is None:
            raise ValueError("every paced row needs its main measured candidate clock")
        document = row.get("pacing_map")
        mapped = build_candidate_pacing_map(document).map(moment - origin) if document else moment - origin
        assignments[index]["original_output_audio_event"] = assignments[index].get("output_audio_event")
        assignments[index]["output_audio_event"] = row["output_start"] + mapped
        assignments[index]["pacing_seconds"] = (assignments[index]["output_audio_event"]
                                               - assignments[index]["original_output_audio_event"])
    design = _design(out["timeline"], assignments, fps)
    if design is None:
        raise ValueError("retimed rows cannot carry a bounded authored design")
    out["authored_design"] = design
    out["rhythm_assignments"] = assignments
    # Retimed rows can never claim the uniform-1x clock the 1x plan arrived with.
    from .encounter_render import render_clock_model
    out["clock_model"] = render_clock_model("slowed-pacing", out["timeline"])
    return out, report
