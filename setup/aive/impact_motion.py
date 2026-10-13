"""Conservative source->output C2 time map; no interpolation or extra assets.

All event clocks and endpoints remain identity. Playback speed is ds/do,
not the derivative of this forward map. Audio uses bounded, independently
rounded absolute-boundary atempo approximations, never accumulated lengths.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass
import math


@dataclass(frozen=True)
class TimeMap:
    duration: float
    protected: tuple[tuple[float, float], ...]
    gaps: tuple[tuple[float, float], ...]
    anchors: tuple[float, ...]
    strength: float = .06
    min_speed: float = .75
    max_speed: float = 1.35

    def map(self, t: float) -> float:
        if not math.isfinite(t) or not 0 <= t <= self.duration:
            raise ValueError("time outside bounded map")
        for a, b in self.gaps:
            if a < t < b:
                u = (t-a)/(b-a)
                return t + self.strength*(b-a)*64*u**3*(1-u)**3
        return t

    def speed(self, t: float) -> float:
        self.map(t)
        for a, b in self.gaps:
            if a < t < b:
                u = (t-a)/(b-a)
                return 1/(1+self.strength*192*u*u*(1-u)**2*(1-2*u))
        return 1.

    def expression(self, variable="T") -> str:
        expr = variable
        for a, b in self.gaps:
            u = f"(({variable}-{a:.12f})/{b-a:.12f})"
            bump = f"{self.strength*(b-a)*64:.12f}*pow({u},3)*pow(1-{u},3)"
            expr = f"({expr}+if(between({variable},{a:.12f},{b:.12f}),{bump},0))"
        return expr

    def manifest(self) -> dict:
        return dict(asdict(self), direction="source_local_seconds_to_output_local_seconds",
                    curve="t + strength*gap_length*64*u^3*(1-u)^3; C2 identity at gap edges",
                    playback_speed_bounds=list(self.bounds()))

    def bounds(self):
        # Exact derivative extrema of the quintic bump's derivative.
        u = (5-math.sqrt(5))/10
        excursion = self.strength*192*u*u*(1-u)**2*(1-2*u)
        return (1/(1+excursion), 1/(1-excursion)) if self.gaps else (1., 1.)


def build_time_map(duration, audio_events=(), visual_events=(), *, protect=.18,
                   strength=.06, min_speed=.75, max_speed=1.35) -> TimeMap:
    values = (duration, protect, strength, min_speed, max_speed)
    if any(isinstance(x, bool) or not isinstance(x, (int, float)) or not math.isfinite(x) for x in values):
        raise ValueError("time-map parameters must be finite numbers")
    if not 0 < duration <= 30 or protect < .18 or strength < 0 or not .75 <= min_speed <= 1 <= max_speed <= 1.35:
        raise ValueError("impossible bounded time-map parameters")
    try:
        audio, visual = tuple(audio_events), tuple(visual_events)
    except TypeError as exc:
        raise ValueError("event times must be numeric sequences") from exc
    # Validate raw arrays before set/sort: False aliases the endpoint 0 and
    # True aliases 1; nonfinite/string values must not leak into expressions.
    if any(isinstance(x, bool) or not isinstance(x, (int, float)) or not math.isfinite(x) or not 0 <= x <= duration for x in (*audio, *visual)):
        raise ValueError("event outside time-map endpoints or not a finite number")
    anchors = sorted(set((0., float(duration), *audio, *visual)))
    intervals = sorted((max(0., t-protect), min(duration, t+protect)) for t in (*audio, *visual))
    protected = []
    for a, b in intervals:
        if protected and a <= protected[-1][1]:
            protected[-1] = (protected[-1][0], max(b, protected[-1][1]))
        else:
            protected.append((a, b))
    gaps, cursor = [], 0.
    for a, b in protected:
        if a-cursor >= .24:
            gaps.append((cursor, a))
        cursor = b
    if duration-cursor >= .24 and anchors != [0., float(duration)]:
        gaps.append((cursor, float(duration)))
    # No event means clean identity, not a generic clip-start treatment.
    if not audio and not visual:
        gaps = []
    result = TimeMap(float(duration), tuple(protected), tuple(gaps), tuple(anchors), strength, min_speed, max_speed)
    lo, hi = result.bounds()
    if not min_speed <= lo <= hi <= max_speed:
        raise ValueError(f"impossible map: playback speed {lo:.6f}..{hi:.6f} exceeds bounds")
    if any(result.map(t) != t for t in anchors):
        raise ValueError("impossible map: fixed anchor moved")
    return result


def audio_segments(mapping: TimeMap, row: dict, rate: int, rounded, max_step=.10):
    """Use global output/sample and source/sample boundaries rounded ONCE.

    atempo may alter pitch-preserving waveform outside protections; each slice
    is padded/trimmed to its absolute target boundary. Protected slices bypass
    atempo entirely and retain original PCM (at most one boundary sample).
    """
    points = {0., mapping.duration}
    for interval in mapping.protected:
        # MultiShotMap protection records may carry a third translation value;
        # only the exact source-local interval boundaries are needed here.
        a, b = interval[:2]
        points.update((a, b))
    for a, b in mapping.gaps:
        points.update((a, b))
        count = math.ceil((b-a)/max_step)
        points.update(a+(b-a)*i/count for i in range(1, count))
    points = sorted(points)
    segments = []
    for a, b in zip(points, points[1:]):
        out_a = rounded(row["output_start"]+mapping.map(a), rate)-row["sample_start"]
        out_b = rounded(row["output_start"]+mapping.map(b), rate)-row["sample_start"]
        src_a = rounded(row["source_start"]+a, rate)
        src_b = rounded(row["source_start"]+b, rate)
        identity = not any(x < (a+b)/2 < y for x, y in mapping.gaps)
        if out_b <= out_a or src_b <= src_a:
            raise ValueError("impossible map: segment collapses at sample precision")
        speed = 1. if identity else (src_b-src_a)/(out_b-out_a)
        if not mapping.min_speed <= speed <= mapping.max_speed:
            raise ValueError("impossible rounded audio speed")
        segments.append(dict(source_start_sample=src_a, source_end_sample=src_b,
                             output_start_sample=out_a, output_end_sample=out_b,
                             count=out_b-out_a, speed=speed, identity=identity))
    if segments[-1]["output_end_sample"] != row["sample_count"]:
        raise ValueError("audio map endpoint mismatch")
    return segments


def audio_filter(segments, rate):
    count = len(segments)
    parts = [f"[0:a:0]aresample={rate},aformat=sample_fmts=s16:channel_layouts=stereo,asplit={count}"+
             "".join(f"[s{i}]" for i in range(count))]
    for i, seg in enumerate(segments):
        first, length = seg["source_start_sample"], seg["count"]
        end = first+length if seg["identity"] else seg["source_end_sample"]
        tempo = "" if seg["identity"] else f",atempo={seg['speed']:.12f}"
        parts.append(f"[s{i}]atrim=start_sample={first}:end_sample={end},asetpts=N/SR/TB{tempo},"
                     f"apad=whole_len={length},atrim=end_sample={length},asetpts=N/SR/TB[a{i}]")
    parts.append("".join(f"[a{i}]" for i in range(count))+f"concat=n={count}:v=0:a=1,asetpts=N/SR/TB[a]")
    return ";".join(parts)


def effect_envelopes(audio_events, duration):
    # Skip boundary impacts instead of introducing a generic start/end pulse.
    return [dict(center=float(t), zoom_peak=1.035, zoom_half_width=.22,
                 brightness_peak=.045, brightness_half_width=.08,
                 curve="raised_cosine_squared", clip_local=True)
            for t in sorted(set(audio_events)) if .22 <= t <= duration-.22]


def envelope_expression(envelopes, variable, kind):
    peak_key, width_key = ("zoom_peak", "zoom_half_width") if kind == "zoom" else ("brightness_peak", "brightness_half_width")
    terms = []
    for env in envelopes:
        c, w = env["center"], env[width_key]
        peak = env[peak_key]-(1 if kind == "zoom" else 0)
        terms.append(f"if(lte(abs({variable}-{c:.12f}),{w:.12f}),{peak:.12f}*pow(cos(PI*({variable}-{c:.12f})/{2*w:.12f}),2),0)")
    # Max, not sum: overlapping impacts cannot break effect bounds.
    result = "0"
    for term in terms:
        result = f"max({result},{term})"
    return f"1+{result}" if kind == "zoom" else result
