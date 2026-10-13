"""Fail-closed human-reviewed POV firearm-kill windows, NOT a classifier.

validate_reviewed_gameplay_gate(data, *, source_paths, max_source_bytes=...,
max_total_bytes=...) returns the ORIGINAL object only if every window passes.
source_paths is caller-supplied {source_id: local_path}; review paths are audit
metadata, never used to open files. capture_source_identity(path) records a
mandatory bounded whole-file SHA256. No media decode, detector promotion,
template calibration, input mutation, or planner/render integration occurs.

Schema gameplay-gate/v1, mode reviewed: sources[{id,duration,content_sha256,
file_identity}], windows[{id,source,source_start,source_end,confirmed,
content_sha256,provenance,music_review,firing_review,pov_review,outcome_review,
context_review}]. See tests for a complete record. Context/music/POV reviews
cover the entire requested window; firing/outcome evidence is inside it.

Names, references, and semantic labels are unauthenticated human assertions,
not proof of truth. Hashes bind claims to bytes, not to reviewer identity.
Duration/timestamps are reviewed claims, not probed media. Reviewers must
actually inspect the whole window. A source can change after validation: use
immutable storage or revalidate immediately before consuming. Passing is NOT
automatic kill detection. Budgets deliberately reject oversized inputs.
"""
from __future__ import annotations

import hashlib
import math
import os
from pathlib import Path

MAX_SOURCES = 8
MAX_WINDOWS = 128
MAX_WINDOW_SECONDS = 30.0
MAX_REVIEW_SECONDS = 600.0
MAX_SOURCE_DURATION = 86400.0
MAX_SOURCE_BYTES = 2 * 1024**3
MAX_TOTAL_BYTES = 8 * 1024**3
MAX_TEXT = 4096
MAX_PROVENANCE = 8
_CHUNK_BYTES = 1024 * 1024


def _fields(value, required, name):
    if not isinstance(value, dict) or set(value) != set(required.split()):
        raise ValueError(f'{name}: exact required fields missing or unsupported fields present')
    return value


def _text(value, name):
    if not isinstance(value, str) or not value.strip() or len(value) > MAX_TEXT:
        raise ValueError(f'{name}: bounded nonempty text required')
    return value


def _num(value, name, lo=0, hi=MAX_SOURCE_DURATION):
    if isinstance(value, bool) or not isinstance(value, (float, int)) or not lo <= value <= hi or not math.isfinite(value):
        raise ValueError(f'{name}: invalid finite number')
    return float(value)


def _limit(value, name, maximum):
    if type(value) is not int or not 1 <= value <= maximum:
        raise ValueError(f'{name}: bounded positive integer required')
    return value


def _sha(value):
    if not isinstance(value, str) or len(value) != 64 or any(c not in '0123456789abcdef' for c in value):
        raise ValueError('content_sha256: lowercase SHA256 required')


def _span(a, b, name, lo, hi):
    a, b = _num(a, name, lo, hi), _num(b, name, lo, hi)
    if b <= a:
        raise ValueError(f'{name}: empty/reversed interval')
    return a, b


def _interval(value, name, lo, hi):
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f'{name}: [start,end] required')
    return _span(*value, name, lo, hi)


def _stat_key(st):
    return (st.st_dev, st.st_ino, st.st_size, st.st_mtime_ns, st.st_ctime_ns)


def capture_source_identity(path, *, max_source_bytes=MAX_SOURCE_BYTES):
    """Hash a bounded stable regular file; return content + audit metadata.

    Reads complete file, not decoded audio/sampled frames. Does not certify
    valid video. Rejects changes observed during the read.
    """
    budget = _limit(max_source_bytes, 'max_source_bytes', MAX_SOURCE_BYTES)
    if not isinstance(path, (str, os.PathLike)) or not str(path).strip():
        raise ValueError('local source path required')
    source = Path(path).resolve()
    digest, count = hashlib.sha256(), 0
    try:
        if not source.is_file():
            raise ValueError('source must be a regular file')
        before = source.stat()
        if not 0 < before.st_size <= budget:
            raise ValueError('source byte budget exceeded or empty file')
        with source.open('rb') as stream:
            opened = os.fstat(stream.fileno())
            # Windows path stat and handle fstat can expose different timestamp
            # precision. Compare timestamps only within the same API, but match
            # inode/device/size across APIs to catch replacement before open.
            if (opened.st_dev, opened.st_ino, opened.st_size) != (before.st_dev, before.st_ino, before.st_size):
                raise ValueError('source changed before hashing')
            while True:
                block = stream.read(min(_CHUNK_BYTES, budget - count + 1))
                if not block:
                    break
                count += len(block)
                if count > budget:
                    raise ValueError('source byte budget exceeded during hashing')
                digest.update(block)
            after = os.fstat(stream.fileno())
        if count != before.st_size or _stat_key(after) != _stat_key(opened) or _stat_key(source.stat()) != _stat_key(before):
            raise ValueError('source changed during hashing')
    except OSError as exc:
        raise ValueError('source unavailable during hashing') from exc
    return dict(content_sha256=digest.hexdigest(), file_identity=dict(
        path=str(source), size_bytes=count, mtime_ns=before.st_mtime_ns))


def _review(value, extra, name):
    value = _fields(value, 'status notes ' + extra, name)
    if value['status'] != 'reviewed':
        raise ValueError(f'{name}: explicit reviewed status required')
    _text(value['notes'], name + ' notes')
    return value


def _coverage(review, name, a, b, duration):
    x, y = _span(review['source_start'], review['source_end'], name, 0, duration)
    if x > a or y < b or y - x > MAX_WINDOW_SECONDS:
        raise ValueError(f'{name}: bounded review must cover the full window')


def validate_reviewed_gameplay_gate(data, *, source_paths,
        max_source_bytes=MAX_SOURCE_BYTES, max_total_bytes=MAX_TOTAL_BYTES):
    """Return data unchanged or raise ValueError; no partial approvals.

    source_paths must contain exactly the reviewed IDs, independently supplied
    by the consumer. Only current full content hash + byte size bind approval;
    relocation/mtime-only changes with identical bytes are allowed. Overlapping
    windows count again toward summed review budget. Byte budgets are checked
    across all sources before hashing any. No cached identity can grant approval.
    """
    _limit(max_source_bytes, 'max_source_bytes', MAX_SOURCE_BYTES)
    _limit(max_total_bytes, 'max_total_bytes', MAX_TOTAL_BYTES)
    _fields(data, 'schema_version mode sources windows', 'gameplay gate')
    if data['schema_version'] != 'gameplay-gate/v1' or data['mode'] != 'reviewed':
        raise ValueError('explicit reviewed gameplay-gate/v1 required; candidates forbidden')
    if not isinstance(data['sources'], list) or not 1 <= len(data['sources']) <= MAX_SOURCES:
        raise ValueError('bounded nonempty sources required')
    if not isinstance(data['windows'], list) or not 1 <= len(data['windows']) <= MAX_WINDOWS:
        raise ValueError('bounded nonempty windows required')
    sources = {}
    for source in data['sources']:
        _fields(source, 'id duration content_sha256 file_identity', 'source')
        sid = _text(source['id'], 'source id')
        if sid in sources:
            raise ValueError('duplicate source id')
        _num(source['duration'], 'source duration', .001)
        _sha(source['content_sha256'])
        identity = _fields(source['file_identity'], 'path size_bytes mtime_ns', 'file identity')
        _text(identity['path'], 'audit path')
        _limit(identity['size_bytes'], 'recorded source size', max_source_bytes)
        if type(identity['mtime_ns']) is not int or identity['mtime_ns'] < 0:
            raise ValueError('invalid audit mtime_ns')
        sources[sid] = source
    if not isinstance(source_paths, dict) or set(source_paths) != set(sources):
        raise ValueError('independently supplied source_paths must match source IDs exactly')
    seen, used, reviewed_seconds = set(), set(), 0.0
    for window in data['windows']:
        _fields(window, 'id source source_start source_end confirmed content_sha256 provenance music_review firing_review pov_review outcome_review context_review', 'window')
        wid = _text(window['id'], 'window id')
        if wid in seen:
            raise ValueError('duplicate window id')
        seen.add(wid)
        sid = _text(window['source'], 'window source')
        if sid not in sources:
            raise ValueError('unknown window source')
        used.add(sid)
        source = sources[sid]
        if window['confirmed'] is not True or window['content_sha256'] != source['content_sha256']:
            raise ValueError('window must be explicitly confirmed and content-bound')
        a, b = _span(window['source_start'], window['source_end'], 'window', 0, source['duration'])
        if b - a > MAX_WINDOW_SECONDS:
            raise ValueError('window review budget exceeded')
        provenance = window['provenance']
        if not isinstance(provenance, list) or not 1 <= len(provenance) <= MAX_PROVENANCE:
            raise ValueError('bounded human provenance required')
        for record in provenance:
            _fields(record, 'reviewer method reference', 'provenance')
            if record['method'] != 'human_audio_visual_review':
                raise ValueError('human audio/visual review required, not detector confirmation')
            _text(record['reviewer'], 'reviewer')
            _text(record['reference'], 'review reference')
        music = _review(window['music_review'], 'classification source_start source_end audio_reference', 'music review')
        if music['classification'] not in ('absent', 'background_music'):
            raise ValueError('music-only or unresolved audio rejected')
        _text(music['audio_reference'], 'music audio reference')
        firing = _review(window['firing_review'], 'origin instrument audio_attack_interval visual_attack_interval source_audio_event source_visual_event audio_reference visual_reference', 'firing review')
        if firing['origin'] != 'local_player' or firing['instrument'] != 'firearm':
            raise ValueError('explicit local player firearm evidence required')
        for kind in ('audio', 'visual'):
            x, y = _interval(firing[kind + '_attack_interval'], kind + ' attack interval', a, b)
            _num(firing['source_' + kind + '_event'], kind + ' event', x, y)
            _text(firing[kind + '_reference'], kind + ' reference')
        pov = _review(window['pov_review'], 'perspective actor alive source_start source_end visual_reference', 'POV review')
        if pov['perspective'] != 'first_person' or pov['actor'] != 'local_player' or pov['alive'] is not True:
            raise ValueError('alive local player first-person POV required')
        _text(pov['visual_reference'], 'POV reference')
        outcome = _review(window['outcome_review'], 'outcome actor mechanism visual_interval source_visual_event visual_reference', 'outcome review')
        if outcome['outcome'] != 'kill' or outcome['actor'] != 'local_player' or outcome['mechanism'] != 'firearm':
            raise ValueError('resolved local player firearm kill required')
        x, y = _interval(outcome['visual_interval'], 'outcome interval', a, b)
        t = _num(outcome['source_visual_event'], 'kill visual event', x, y)
        if t < firing['source_visual_event'] or t < firing['audio_attack_interval'][0]:
            raise ValueError('kill outcome cannot precede the reviewed firing')
        _text(outcome['visual_reference'], 'kill visual reference')
        context = _review(window['context_review'], 'category source_start source_end menu ability_only dead warmup post_round unresolved visual_reference', 'context review')
        if context['category'] != 'live_round' or any(context[key] is not False for key in ('menu', 'ability_only', 'dead', 'warmup', 'post_round', 'unresolved')):
            raise ValueError('menu/ability-only/dead/warmup/post-round/unresolved context rejected')
        _text(context['visual_reference'], 'context visual reference')
        for review, name in ((music, 'music'), (pov, 'POV'), (context, 'context')):
            _coverage(review, name, a, b, source['duration'])
        reviewed_seconds += max(r['source_end'] for r in (music, pov, context)) - min(r['source_start'] for r in (music, pov, context))
        if reviewed_seconds > MAX_REVIEW_SECONDS:
            raise ValueError('total reviewed seconds budget exceeded')
    if used != set(sources):
        raise ValueError('unused source records forbidden')
    live_paths, total = {}, 0
    for sid, source in sources.items():
        path = source_paths[sid]
        if not isinstance(path, (str, os.PathLike)) or not str(path).strip():
            raise ValueError('local source path required')
        path = Path(path).resolve()
        try:
            size = path.stat().st_size
        except OSError as exc:
            raise ValueError('source unavailable') from exc
        if not path.is_file() or not 0 < size <= max_source_bytes:
            raise ValueError('source byte budget exceeded or invalid file')
        total += size
        if total > max_total_bytes:
            raise ValueError('total source byte budget exceeded')
        if size != source['file_identity']['size_bytes']:
            raise ValueError('source size differs from reviewed content')
        live_paths[sid] = path
    for sid, path in live_paths.items():
        identity = capture_source_identity(path, max_source_bytes=sources[sid]['file_identity']['size_bytes'])
        if identity['content_sha256'] != sources[sid]['content_sha256']:
            raise ValueError('source content changed since review')
    return data
