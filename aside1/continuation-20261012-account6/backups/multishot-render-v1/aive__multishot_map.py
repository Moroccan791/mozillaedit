"""Reviewed-input C2 source-to-output PLANNING map, not a renderer.

Explicit source shot/attack and target acoustic hit clocks are absolute seconds.
Origins and endpoints are supplied, never inferred. Protected attacks are rigid
1x translations; only gaps can change playback. No detection/identity claims.
"""
from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
import math

MAX_SHOTS = 32


def _number(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{name} must be a finite number")
    try:
        result = float(value)
    except (ValueError, OverflowError) as exc:
        raise ValueError(f"{name} must be a finite number") from exc
    if not math.isfinite(result):
        raise ValueError(f"{name} must be a finite number")
    return result


@dataclass(frozen=True)
class ShotAnchor:
    source_shot_time: float
    source_audio_attack_interval: tuple[float, float]
    target_acoustic_hit_time: float


@dataclass(frozen=True)
class Segment:
    source_start: float
    source_end: float
    shift_start: float
    shift_end: float
    kind: str
    min_speed: float
    max_speed: float

    def map(self, t):
        if t == self.source_start:
            return t + self.shift_start
        if t == self.source_end:
            return t + self.shift_end
        if self.shift_start == self.shift_end:
            return t + self.shift_start
        u = (t-self.source_start)/(self.source_end-self.source_start)
        smooth = u**3*(10 + u*(-15 + 6*u))
        return t + self.shift_start + (self.shift_end-self.shift_start)*smooth

    def speed(self, t):
        u = (t-self.source_start)/(self.source_end-self.source_start)
        ratio = (self.shift_end-self.shift_start)/(self.source_end-self.source_start)
        return 1/(1 + ratio*30*u*u*(1-u)*(1-u))


def _bounds(length, change):
    """Analytic extrema plus conservative float margin, not sampling-only.

    S'(u)=30*u^2*(1-u)^2 ranges from 0 to 15/8. Forward derivative
    extrema are 1 and 1+(15/8)*change/length. Playback is reciprocal.
    """
    if change == 0:
        return 1., 1.
    excursion = (15/8)*(change/length)
    if not math.isfinite(excursion):
        raise ValueError("infeasible gap: nonfinite derivative")
    margin = 32*math.ulp(1.)*max(1., abs(excursion))
    slope_lo = math.nextafter(min(1., 1+excursion)-margin, -math.inf)
    slope_hi = math.nextafter(max(1., 1+excursion)+margin, math.inf)
    if slope_lo <= 0:
        raise ValueError("infeasible gap: reverse or repeated source")
    return (math.nextafter(1/slope_hi, -math.inf),
            math.nextafter(1/slope_lo, math.inf))


@dataclass(frozen=True)
class MultiShotMap:
    source_start: float
    source_end: float
    target_start: float
    target_end: float
    shots: tuple[ShotAnchor, ...]
    anchors: tuple[tuple[float, float], ...]
    protected: tuple[tuple[float, float, float], ...]
    segments: tuple[Segment, ...]
    min_speed: float
    max_speed: float

    @property
    def duration(self):
        return self.source_end-self.source_start

    @property
    def output_duration(self):
        return self.target_end-self.target_start

    def map(self, t):
        """Source LOCAL seconds -> output LOCAL seconds, like impact_motion."""
        t = _number(t, "source local time")
        if not 0 <= t <= self.duration:
            raise ValueError("time outside bounded map")
        if t == 0:
            return 0.
        if t == self.duration:
            return self.output_duration
        for segment in self.segments:
            if segment.source_start <= t <= segment.source_end:
                return segment.map(t)
        raise ValueError("time outside bounded map")

    def source_to_output(self, t, *, source_clock="absolute", output_clock="local"):
        """Absolute source by default; absolute output means target MUSIC clock.

        No clock inference. Local output zero is explicit target_start.
        Absolute output is not a renderer timeline unless caller binds it.
        """
        if source_clock not in ("absolute", "local") or output_clock not in ("absolute", "local"):
            raise ValueError("clock must be 'absolute' or 'local'")
        t = _number(t, "source time")
        if source_clock == "absolute":
            if not self.source_start <= t <= self.source_end:
                raise ValueError("time outside bounded map")
            local = t-self.source_start
        else:
            local = t
        result = self.map(local)
        if output_clock == "local":
            return result
        if local == 0:
            return self.target_start
        if local == self.duration:
            return self.target_end
        for shot, (source, _) in zip(self.shots, self.anchors):
            if local == source:
                return shot.target_acoustic_hit_time
        return self.target_start+result

    def speed(self, t):
        """Playback ds/do at source LOCAL time; protected intervals are 1x."""
        t = _number(t, "source local time")
        self.map(t)
        for segment in self.segments:
            if segment.source_start <= t <= segment.source_end:
                return segment.speed(t)
        raise ValueError("time outside bounded map")

    def bounds(self):
        return (min(s.min_speed for s in self.segments),
                max(s.max_speed for s in self.segments))

    def manifest(self):
        """Fresh JSON-safe plan evidence, not rendered proof."""
        return dict(schema="multishot-map/v1", planning_only=True,
            renderer_integration="unimplemented", reviewed_input=True,
            claims="supplied anchors only; no detector identity or perception validation",
            direction="source_local_seconds_to_output_local_seconds",
            clocks=dict(source="absolute source media seconds", target="absolute acoustic/music seconds",
                source_origin=self.source_start, target_origin=self.target_start,
                source_endpoint=self.source_end, target_endpoint=self.target_end,
                source_duration=self.duration, output_duration=self.output_duration),
            curve="f(t)=t+d0+(d1-d0)*(10*u^3-15*u^4+6*u^5); protected f(t)=t+d; C2",
            speed_definition="ds/do=1/f'(t)",
            certification="analytic S'=0..15/8, outward floating-point margin; not sampled-only",
            requested_playback_speed_bounds=[self.min_speed,self.max_speed],
            certified_playback_speed_bounds=list(self.bounds()),
            anchors=[dict(source_shot_time=s.source_shot_time,
                target_acoustic_hit_time=s.target_acoustic_hit_time,
                source_audio_attack_interval=list(s.source_audio_attack_interval),
                source_local=local[0],output_local=local[1])
                for s,local in zip(self.shots,self.anchors)],
            protected=[dict(source_local_interval=[a,b],output_local_interval=[a+d,b+d],
                translation=d,playback_speed=1.) for a,b,d in self.protected],
            segments=[dict(kind=s.kind,source_local_interval=[s.source_start,s.source_end],
                output_local_interval=[s.map(s.source_start),s.map(s.source_end)],
                shift_start=s.shift_start,shift_end=s.shift_end,
                certified_playback_speed_bounds=[s.min_speed,s.max_speed]) for s in self.segments])


def build_multishot_map(shots, *, source_start, source_end, target_start,
                        target_end, reviewed, min_speed=.75, max_speed=1.35):
    """Plan 1..32 ordered reviewed shots, or raise ValueError, never force-fit.

    shots are ShotAnchor objects or dictionaries with the same three keys.
    Each source shot reference must lie inside its nonzero protected attack.
    All clocks are absolute seconds. reviewed=True records caller review,
    not authentication. Overlap/touch with unequal shifts is incompatible.
    """
    if reviewed is not True:
        raise ValueError("explicit reviewed=True input required")
    source_start = _number(source_start,"source_start")
    source_end = _number(source_end,"source_end")
    target_start = _number(target_start,"target_start")
    target_end = _number(target_end,"target_end")
    min_speed = _number(min_speed,"min_speed")
    max_speed = _number(max_speed,"max_speed")
    duration, output_duration = source_end-source_start,target_end-target_start
    if min(source_start,target_start) < 0 or not all(math.isfinite(x) and x > 0 for x in (duration,output_duration)):
        raise ValueError("endpoints require nonnegative origins and positive finite durations")
    if not .75 <= min_speed <= 1 <= max_speed <= 1.35:
        raise ValueError("playback bounds must satisfy .75 <= min <= 1 <= max <= 1.35")
    try:
        iterator = iter(shots)
    except TypeError as exc:
        raise ValueError("shots must be a sequence") from exc
    parsed, anchors, intervals = [],[],[]
    for raw in iterator:
        if len(parsed) == MAX_SHOTS:
            raise ValueError("at most 32 shots permitted")
        if isinstance(raw,ShotAnchor):
            source,interval,target = raw.source_shot_time,raw.source_audio_attack_interval,raw.target_acoustic_hit_time
        elif isinstance(raw,Mapping):
            try:
                source,interval,target = raw["source_shot_time"],raw["source_audio_attack_interval"],raw["target_acoustic_hit_time"]
            except KeyError as exc:
                raise ValueError("shot requires explicit source time, attack interval and target hit time") from exc
        else:
            raise ValueError("shot must be ShotAnchor or mapping")
        source = _number(source,"source_shot_time")
        target = _number(target,"target_acoustic_hit_time")
        if not isinstance(interval,(list,tuple)) or len(interval) != 2:
            raise ValueError("attack interval requires [start,end]")
        a,b = (_number(v,"attack interval") for v in interval)
        if not source_start <= a <= source <= b <= source_end or b <= a:
            raise ValueError("shot/attack outside endpoints or zero/reversed attack interval")
        if not target_start <= target <= target_end:
            raise ValueError("target hit outside endpoints")
        if parsed and (source <= parsed[-1].source_shot_time or target <= parsed[-1].target_acoustic_hit_time):
            raise ValueError("shot order requires strictly increasing source and target times; no repeats")
        x,y = source-source_start,target-target_start
        local_a,local_b,shift = a-source_start,b-source_start,y-x
        if local_b <= local_a or (anchors and (x <= anchors[-1][0] or y <= anchors[-1][1])):
            raise ValueError("clock normalization collapses protected interval or anchor order")
        # Never hide an unrepresentable rigid translation with a point override.
        if x+shift != y:
            raise ValueError("protected anchor translation cannot be represented exactly")
        parsed.append(ShotAnchor(source,(a,b),target))
        anchors.append((x,y))
        intervals.append((local_a,local_b,shift))
    if not parsed:
        raise ValueError("at least one reviewed shot required")
    protected = []
    for a,b,shift in sorted(intervals):
        if protected and a <= protected[-1][1]:
            left,right,old_shift = protected[-1]
            if shift != old_shift:
                raise ValueError("overlapping/touching protected intervals have incompatible translations")
            protected[-1] = (left,max(right,b),shift)
        else:
            protected.append((a,b,shift))
    segments = []
    def add(a,b,left,right,kind):
        if b == a:
            if left != right:
                raise ValueError("infeasible gap: no room for required translation or endpoint")
            return
        if b < a or b+right <= a+left:
            raise ValueError("infeasible gap: reverse or repeated source")
        lo,hi = _bounds(b-a,right-left)
        if not min_speed <= lo <= hi <= max_speed:
            raise ValueError(f"infeasible gap: certified playback {lo:.9f}..{hi:.9f} exceeds bounds")
        segments.append(Segment(a,b,left,right,kind,lo,hi))
    cursor,shift = 0.,0.
    for a,b,new_shift in protected:
        add(cursor,a,shift,new_shift,"gap")
        add(a,b,new_shift,new_shift,"protected")
        cursor,shift = b,new_shift
    add(cursor,duration,shift,output_duration-duration,"gap")
    if not segments or segments[0].map(0.) != 0. or segments[-1].map(duration) != output_duration:
        raise ValueError("endpoint translation cannot be represented exactly")
    result = MultiShotMap(source_start,source_end,target_start,target_end,
        tuple(parsed),tuple(anchors),tuple(protected),tuple(segments),min_speed,max_speed)
    if any(result.map(x) != y for x,y in anchors):
        raise ValueError("protected anchor cannot be represented exactly")
    return result


def source_to_output(mapping, t, *, source_clock="absolute", output_clock="local"):
    """Functional form with explicit clock selection."""
    if not isinstance(mapping,MultiShotMap):
        raise ValueError("mapping must be a planned MultiShotMap")
    return mapping.source_to_output(t,source_clock=source_clock,output_clock=output_clock)
