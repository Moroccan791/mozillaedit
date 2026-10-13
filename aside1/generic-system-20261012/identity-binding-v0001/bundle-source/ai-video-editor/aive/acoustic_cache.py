"""Content-bound caches for acoustic candidates, never reviews or certification.

Builders are imported only on misses. Bump the ANALYSIS versions whenever a
builder, its dependencies, defaults or selection policy changes. SHA256 covers
all source bytes, not decoded audio or stat metadata. This is a local reuse
cache, not an authentication mechanism for hostile cache writers.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
from pathlib import Path
import re
import tempfile

CACHE_SCHEMA = 'acoustic-cache/v1'
HIT_ANALYSIS_VERSION = 'hit-map-analysis/v1'
FIRING_ANALYSIS_VERSION = 'firing-map-analysis/v1'
MAX_CACHE_BYTES = 16 * 1024 * 1024
DEFAULT_CACHE_DIR = Path(__file__).resolve().parent.parent / 'cache' / 'acoustic'


def _number(value, low=0, high=600):
    if type(value) not in (int, float) or not math.isfinite(value) or not low <= value <= high:
        raise ValueError('invalid finite acoustic number')
    return value


def _sha(value):
    if not isinstance(value, str) or re.fullmatch('[0-9a-f]{64}', value) is None:
        raise ValueError('invalid SHA256 identity')


def _text(value):
    if not isinstance(value, str) or not value.strip() or len(value) > 4096:
        raise ValueError('invalid acoustic text')


def _object(value, fields):
    if not isinstance(value, dict) or not set(fields) <= value.keys():
        raise ValueError('missing acoustic schema fields')


def _interval(value, low, high, point=None):
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError('invalid acoustic interval')
    a, b = (_number(v, low, high) for v in value)
    if a > b or (point is not None and not a <= point <= b):
        raise ValueError('invalid acoustic interval clock')
    return a, b


def _snapshot(source):
    before = source.stat()
    if not source.is_file():
        raise ValueError('source must be a local file')
    digest = hashlib.sha256()
    with source.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    after = source.stat()
    if (before.st_size, before.st_mtime_ns, before.st_ino) != (after.st_size, after.st_mtime_ns, after.st_ino):
        raise RuntimeError('source changed while hashing')
    return dict(path=str(source), size_bytes=after.st_size, mtime_ns=after.st_mtime_ns), digest.hexdigest()


def _unchanged(source, identity, digest):
    current_identity, current_digest = _snapshot(source)
    if current_identity != identity or current_digest != digest:
        raise RuntimeError('source changed during cache read or analysis')


def _hit(data, identity, digest, settings):
    _object(data, ('schema_version', 'song_sha256', 'excerpt', 'candidates',
                   'review_status', 'instrumentation', 'interpretation', 'decode'))
    if (data['schema_version'] != 'hit-map/v1' or data['song_sha256'] != digest
            or data['review_status'] != 'unreviewed' or data['instrumentation'] != 'unknown'):
        raise ValueError('hit candidate identity/schema/review mismatch')
    _text(data['interpretation'])
    start, duration = settings['start'], settings['duration']
    end = start + duration
    _object(data['excerpt'], ('start', 'duration', 'end'))
    for value in data['excerpt'].values():
        _number(value)
    if data['excerpt'] != dict(start=start, duration=duration, end=end):
        raise ValueError('hit excerpt mismatch')
    decode = data['decode']
    _object(decode, ('method', 'input_end', 'sample_rate', 'channels', 'pcm_start', 'pcm_end'))
    first = max(0, math.floor((start - 1) * 24000)) / 24000
    last = min(600 * 24000, math.ceil((end + 1) * 24000)) / 24000
    if (decode['method'] != 'ffmpeg_sample_zero_input_bounded_atrim'
            or type(decode['sample_rate']) is not int or decode['sample_rate'] != 24000
            or type(decode['channels']) is not int or decode['channels'] != 1
            or decode['pcm_start'] != first or decode['input_end'] != last):
        raise ValueError('hit decode clock mismatch')
    _number(decode['pcm_start'])
    _number(decode['input_end'])
    pcm_end = _number(decode['pcm_end'], first, last + 1e-9)
    if pcm_end + 1 / 24000 < end:
        raise ValueError('hit decode does not contain excerpt')
    hits = data['candidates']
    if not isinstance(hits, list) or len(hits) > 32:
        raise ValueError('invalid hit candidate budget')
    previous, seen = -1, set()
    for hit in hits:
        _object(hit, ('id', 'time', 'refined_time', 'refined_interval', 'strength',
                      'preview_eligible', 'confirmed', 'review_status',
                      'instrumentation', 'interpretation', 'evidence'))
        _text(hit['id'])
        t = _number(hit['time'], start, end)
        if t >= end or t <= previous or hit['id'] in seen:
            raise ValueError('hit candidate clock/ID mismatch')
        previous = t
        seen.add(hit['id'])
        strength = _number(hit['strength'], 0, 1)
        if (hit['confirmed'] is not False or hit['review_status'] != 'unreviewed'
                or hit['instrumentation'] != 'unknown' or type(hit['preview_eligible']) is not bool):
            raise ValueError('cache cannot promote hit candidates')
        _text(hit['interpretation'])
        _object(hit['evidence'], ('method', 'accent_audit'))
        _text(hit['evidence']['method'])
        if not isinstance(hit['evidence']['accent_audit'], dict):
            raise ValueError('invalid hit evidence')
        refined = hit['refined_time']
        if refined is None:
            if hit['refined_interval'] is not None or hit['preview_eligible']:
                raise ValueError('invalid unrefined hit')
        else:
            _number(refined, start, end)
            if refined >= end:
                raise ValueError('refined hit outside excerpt')
            _interval(hit['refined_interval'], first, pcm_end, refined)
            if hit['preview_eligible'] != (strength >= .45):
                raise ValueError('invalid preview eligibility')


def _firing(data, identity, digest, settings):
    _object(data, ('schema_version', 'mode', 'confirmed', 'source', 'source_duration',
                   'sources', 'candidate_events', 'candidate_windows', 'analysis', 'limitations'))
    if (data['schema_version'] != 'firing-map/v1' or data['mode'] != 'candidate'
            or data['confirmed'] is not False or data['source'] != identity['path']
            or data.get('events')):
        raise ValueError('firing candidate identity/schema/review mismatch')
    duration = _number(data['source_duration'], .001, float('inf'))
    if not isinstance(data['sources'], list) or len(data['sources']) != 1:
        raise ValueError('one source required')
    info = data['sources'][0]
    _object(info, ('id', 'duration', 'analyzed_start', 'analyzed_end', 'sample_rate',
                   'channels', 'file_identity', 'audio_sha256', 'audio_identity', 'probe'))
    if (info['id'] != identity['path'] or info['duration'] != duration
            or info['file_identity'] != identity or info['analyzed_start'] != 0
            or type(info['sample_rate']) is not int or info['sample_rate'] != 24000
            or type(info['channels']) is not int or info['channels'] != 1):
        raise ValueError('firing source identity/clock mismatch')
    _sha(info['audio_sha256'])
    audio = info['audio_identity']
    _object(audio, ('encoding', 'sample_rate', 'channels', 'sample_zero', 'sample_count'))
    if (audio['encoding'] != 'f32le' or audio['sample_zero'] is not True
            or type(audio['sample_rate']) is not int or audio['sample_rate'] != 24000
            or type(audio['channels']) is not int or audio['channels'] != 1
            or type(audio['sample_count']) is not int or audio['sample_count'] <= 0):
        raise ValueError('invalid firing audio identity')
    budget = min(duration, settings['max_source_seconds'])
    end = _number(info['analyzed_end'], 1 / 24000, budget)
    if abs(end - audio['sample_count'] / 24000) > 1 / 24000:
        raise ValueError('firing sample clock mismatch')
    _object(info['probe'], ('duration', 'audio_stream'))
    if info['probe']['duration'] != duration or not isinstance(info['probe']['audio_stream'], dict):
        raise ValueError('firing probe mismatch')
    _object(data['analysis'], ('method', 'max_source_seconds', 'max_windows'))
    if (data['analysis']['method'] != 'multiband-energy-rise/v1'
            or data['analysis']['max_source_seconds'] != budget
            or type(data['analysis']['max_windows']) is not int
            or data['analysis']['max_windows'] != settings['max_windows']):
        raise ValueError('firing analysis settings mismatch')
    if not isinstance(data['limitations'], list) or not data['limitations']:
        raise ValueError('firing limitations required')
    for limitation in data['limitations']:
        _text(limitation)
    events = data['candidate_events']
    windows = data['candidate_windows']
    if (not isinstance(events, list) or len(events) > 15000
            or not isinstance(windows, list) or len(windows) > settings['max_windows']):
        raise ValueError('firing candidate budget exceeded')
    seen, previous = {}, -1
    for event in events:
        _object(event, ('id', 'source', 'time', 'source_start', 'source_end',
                        'attack_interval', 'confirmed', 'type', 'instrument', 'origin',
                        'strength', 'uncertainty', 'evidence'))
        _text(event['id'])
        t = _number(event['time'], 0, end)
        a, b = _interval([event['source_start'], event['source_end']], 0, end, t)
        _interval(event['attack_interval'], a, b, t)
        if a == b or t <= previous or event['id'] in seen or event['source'] != identity['path']:
            raise ValueError('firing event clock/ID/source mismatch')
        if (event['confirmed'] is not False or event['type'] != 'audio_transient'
                or event['instrument'] != 'unknown' or event['origin'] != 'unknown'):
            raise ValueError('cache cannot promote firing events')
        _number(event['strength'], 0, 1)
        _object(event['uncertainty'], ('timing_seconds', 'identity', 'note'))
        if event['uncertainty']['identity'] != 'unknown':
            raise ValueError('firing identity must remain unknown')
        _number(event['uncertainty']['timing_seconds'], 0, end)
        _text(event['uncertainty']['note'])
        _object(event['evidence'], ('method', 'band_count', 'local_salience', 'score'))
        if event['evidence']['method'] != 'multiband-energy-rise/v1':
            raise ValueError('firing evidence mismatch')
        previous, seen[event['id']] = t, event
    ids, selected, previous = set(), set(), 0
    for window in windows:
        _object(window, ('id', 'source', 'source_duration', 'source_start', 'source_end',
                         'candidate_events', 'visual_review', 'outcome', 'confirmed'))
        _text(window['id'])
        a, b = _interval([window['source_start'], window['source_end']], 0, end)
        if (a == b or a < previous or window['id'] in ids
                or window['source'] != identity['path'] or window['source_duration'] != duration
                or window['visual_review'] != 'unreviewed' or window['outcome'] != 'unknown'
                or window['confirmed'] is not False):
            raise ValueError('invalid/unreviewed firing window')
        members = window['candidate_events']
        if not isinstance(members, list) or not members:
            raise ValueError('window candidates required')
        for event in members:
            if not isinstance(event, dict) or event.get('id') not in seen or event != seen[event['id']]:
                raise ValueError('window event identity mismatch')
            if event['id'] in selected or not a <= event['source_start'] <= event['source_end'] <= b:
                raise ValueError('window event clock mismatch')
            selected.add(event['id'])
        previous = b
        ids.add(window['id'])


def _unique(pairs):
    data = {}
    for key, value in pairs:
        if key in data:
            raise ValueError('duplicate cache JSON key')
        data[key] = value
    return data


def _reject_constant(value):
    raise ValueError('nonfinite cache JSON')


def _cached(source, settings, stage, version, validator, builder, cache_dir):
    source = Path(source).resolve(strict=True)
    identity, digest = _snapshot(source)
    binding = dict(schema_version=CACHE_SCHEMA, stage=stage, analysis_version=version,
                   source_sha256=digest, source_identity=identity, settings=settings)
    key = hashlib.sha256(json.dumps(binding, sort_keys=True, separators=(',', ':'),
                                    allow_nan=False).encode('utf-8')).hexdigest()
    root = Path(cache_dir) if cache_dir is not None else DEFAULT_CACHE_DIR
    target = root / f'{stage}-{key}.json'
    if target.resolve() == source or (target.exists() and os.path.samefile(target, source)):
        raise ValueError('cache destination must not be source')
    data = None
    try:
        if not target.is_symlink():
            with target.open('rb') as stream:
                raw = stream.read(MAX_CACHE_BYTES + 1)
            if len(raw) > MAX_CACHE_BYTES:
                raise ValueError('cache exceeds JSON budget')
            envelope = json.loads(raw, object_pairs_hook=_unique, parse_constant=_reject_constant)
            if not isinstance(envelope, dict) or set(envelope) != set(binding) | {'data'}:
                raise ValueError('invalid cache envelope schema')
            if json.dumps({k: envelope[k] for k in binding}, sort_keys=True,
                          separators=(',', ':'), allow_nan=False) != json.dumps(
                              binding, sort_keys=True, separators=(',', ':'), allow_nan=False):
                raise ValueError('cache binding mismatch')
            validator(envelope['data'], identity, digest, settings)
            data = envelope['data']
    except (OSError, ValueError, TypeError, KeyError, UnicodeError, RecursionError):
        pass  # Never trust corrupt/old/reviewed caches; only the builder can refill.
    _unchanged(source, identity, digest)
    if data is not None:
        return data, True
    try:
        data = builder(source)
    finally:
        _unchanged(source, identity, digest)
    validator(data, identity, digest, settings)
    raw = json.dumps(dict(binding, data=data), sort_keys=True, separators=(',', ':'),
                     allow_nan=False).encode('utf-8')
    if len(raw) > MAX_CACHE_BYTES:
        raise ValueError('analysis exceeds cache JSON budget')
    root.mkdir(parents=True, exist_ok=True)
    # A temporary sibling plus replace makes publication atomic, including repairs.
    # Neither the source nor a caller's output destination is ever opened for write.
    fd, temporary = tempfile.mkstemp(prefix=f'.{stage}-', suffix='.tmp', dir=root)
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(raw)
            stream.flush()
            os.fsync(stream.fileno())
        _unchanged(source, identity, digest)
        if target.resolve() == source or (target.exists() and os.path.samefile(target, source)):
            raise ValueError('cache destination must not be source')
        os.replace(temporary, target)
    finally:
        try:
            os.unlink(temporary)
        except FileNotFoundError:
            pass
    return data, False


def cached_hit_map(music, start, duration, cache_dir=None):
    """Return (unreviewed hit-map, cache_hit), using fixed builder defaults."""
    _number(start)
    _number(duration, 0, 12)
    if duration <= 0 or start + duration > 600:
        raise ValueError('excerpt must be nonempty, <=12s and end <=600s')
    settings = dict(start=start, duration=duration, max_candidates=32, sample_rate=24000)

    def build(source):
        from .hit_map import build_hit_map
        return build_hit_map(source, start, duration)

    return _cached(music, settings, 'hit-map', HIT_ANALYSIS_VERSION, _hit, build, cache_dir)


def cached_firing_map(source, max_source_seconds, max_windows, cache_dir=None):
    """Return (candidate firing-map, cache_hit), fixed 24k mono sample-zero."""
    _number(max_source_seconds, .001, 600)
    if type(max_windows) is not int or not 1 <= max_windows <= 16:
        raise ValueError('max_windows must be an integer 1..16')
    settings = dict(max_source_seconds=max_source_seconds, max_windows=max_windows,
                    sample_rate=24000)

    def build(path):
        from .firing_map import extract_firing_map
        return extract_firing_map(path, max_source_seconds=max_source_seconds,
                                  max_windows=max_windows)

    return _cached(source, settings, 'firing-map', FIRING_ANALYSIS_VERSION, _firing, build, cache_dir)
