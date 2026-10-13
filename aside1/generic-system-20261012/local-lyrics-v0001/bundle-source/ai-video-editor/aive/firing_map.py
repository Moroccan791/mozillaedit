"""Bounded preview candidates, never gunshot/kill certification.

extract_firing_map(path, *, max_source_seconds=600, sample_rate=24000,
                   max_windows=16, ffmpeg='ffmpeg', ffprobe='ffprobe')
probes with stdlib, decodes source sample zero to disk-backed mono f32, then
analyzes at most 600 seconds. No video decode and no whole-media render.

analyze_sample_windows(samples, sample_rate, *, source_start=0,
    source_duration=None, source_id='synthetic', max_windows=16)
accepts a mono ndarray/memmap and returns the same firing-map/v1 candidate
contract for synthetic tests. Input must itself fit the 600-second budget.
Event ``time`` is an estimated attack reference INSIDE ``attack_interval``;
it is not an exact gunshot identity. All times are source seconds.

validate_reviewed_firing_map(data, *, expected_sources=None) is a separate
fail-closed contract. It NEVER promotes candidates. A reviewed map requires
mode='reviewed', explicit file/audio identity, human provenance, per-event
source audio/visual references and attack intervals, reviewed context and
outcome. expected_sources optionally binds IDs to independently recorded
source metadata; this schema validator does not authenticate human claims.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import tempfile

MAX_SOURCE_SECONDS = 600.0
MAX_WINDOWS = 16
MAX_EVENTS = 15000
SAMPLE_RATES = (24000, 48000)


def _number(value, name, low=0, high=float('inf')):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not low <= value <= high:
        raise ValueError(f'invalid {name}')
    return float(value)


def _budget(max_source_seconds, sample_rate, max_windows):
    seconds = _number(max_source_seconds, 'max_source_seconds', .001, MAX_SOURCE_SECONDS)
    if type(sample_rate) is not int or sample_rate not in SAMPLE_RATES:
        raise ValueError('sample_rate must be 24000 or 48000')
    if type(max_windows) is not int or not 1 <= max_windows <= MAX_WINDOWS:
        raise ValueError('max_windows must be 1..16')
    return seconds


def _text(value, name):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f'nonempty {name} required')
    return value


def _sha(value, name):
    if not isinstance(value, str) or len(value) != 64 or any(c not in '0123456789abcdef' for c in value):
        raise ValueError(f'invalid {name}')


def _interval(value, name, lo, hi):
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f'{name} requires [start, end]')
    a = _number(value[0], name, lo, hi)
    b = _number(value[1], name, lo, hi)
    if b <= a:
        raise ValueError(f'empty/reversed {name}')
    return a, b


def _hash_file(path):
    digest = hashlib.sha256()
    with open(path, 'rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def _identity(path):
    st = path.stat()
    return dict(path=str(path.resolve()), size_bytes=st.st_size, mtime_ns=st.st_mtime_ns)


def _probe(path, executable):
    # Limit returned fields and read size; no numpy/librosa or audio allocation.
    with tempfile.TemporaryFile() as output:
        completed = subprocess.run([executable, '-v', 'error', '-show_entries',
            'format=duration:stream=index,codec_type,sample_rate,channels,duration,start_time',
            '-of', 'json', str(path)], stdout=output, stderr=subprocess.DEVNULL,
            timeout=30, check=False)
        if completed.returncode:
            raise ValueError('ffprobe failed')
        output.seek(0)
        raw = output.read(65537)
    if len(raw) > 65536:
        raise ValueError('ffprobe metadata exceeded budget')
    data = json.loads(raw)
    streams = data.get('streams', [])
    audio = next((s for s in streams if s.get('codec_type') == 'audio'), None)
    if audio is None:
        raise ValueError('source has no audio stream')
    for stream in streams:
        if stream.get('codec_type') in ('video', 'audio'):
            try:
                origin = float(stream.get('start_time', 0))
            except (ValueError, TypeError):
                raise ValueError('invalid source stream origin') from None
            if not math.isfinite(origin) or abs(origin) > .001:
                raise ValueError('nonzero source stream origin requires calibration before candidate planning')
    try:
        duration = float(data.get('format', {}).get('duration', audio.get('duration')))
    except (ValueError, TypeError):
        raise ValueError('source has no finite duration') from None
    _number(duration, 'source duration', .001)
    return dict(duration=duration, audio_stream=audio)


def _candidates(samples, sample_rate, source_start):
    import numpy as np
    from scipy.ndimage import median_filter, maximum_filter1d
    from scipy.signal import butter, sosfilt, find_peaks

    hop = round(sample_rate * .005)
    frame_count = (len(samples) + hop - 1) // hop
    # Only short filtered blocks are allocated, not full-duration filtered audio.
    energy = np.zeros((3, frame_count), dtype=np.float64)
    bands = ((180, 1000), (1000, 4000), (4000, min(10000, sample_rate * .45)))
    for band_index, (low, high) in enumerate(bands):
        sos = butter(3, (low, high), btype='bandpass', fs=sample_rate, output='sos')
        state = np.zeros((len(sos), 2))
        block_frames = 2000
        for start_frame in range(0, frame_count, block_frames):
            a = start_frame * hop
            block = np.asarray(samples[a:min(len(samples), a + block_frames * hop)], dtype=np.float64)
            if not np.isfinite(block).all():
                raise ValueError('samples must be finite')
            if np.max(np.abs(block), initial=0) > 16:
                raise ValueError('samples exceed finite normalized amplitude budget')
            filtered, state = sosfilt(sos, block, zi=state)
            padded = np.pad(filtered, (0, (-len(filtered)) % hop))
            energy[band_index, start_frame:start_frame + len(padded)//hop] = np.mean(padded.reshape(-1, hop)**2, axis=1)
    if frame_count < 3:
        return []
    floor = 1e-10
    total = energy.sum(axis=0)
    baseline = median_filter(total, size=81, mode='nearest')
    rises = np.maximum(energy - np.concatenate((energy[:, :1], energy[:, :-1]), axis=1), 0)
    rise = rises.sum(axis=0)
    # Local salience and an absolute floor suppress silence/numeric noise.
    local = maximum_filter1d(total, size=81, mode='nearest')
    salience = total / np.maximum(baseline, floor)
    band_count = (rises > np.maximum(energy * .12, 1e-9)).sum(axis=0)
    score = rise / np.maximum(baseline, floor)
    eligible = (total > 2e-7) & (rise > 5e-8) & (salience > 2.5) & (band_count >= 2) & (total >= .04 * local)
    scores = np.where(eligible, np.minimum(score, 1e8), 0)
    peaks, _ = find_peaks(scores, height=1.5, distance=round(.045/.005))
    # Endpoint attacks remain candidates when they have supporting rise.
    if scores[0] > 1.5 and (not len(peaks) or peaks[0] >= 9):
        peaks = np.insert(peaks, 0, 0)
    end = source_start + len(samples)/sample_rate
    events = []
    for i in peaks[:MAX_EVENTS]:
        a = max(source_start, source_start + (int(i)-1)*hop/sample_rate)
        b = min(end, source_start + (int(i)+2)*hop/sample_rate)
        t = min(b, max(a, source_start + int(i)*hop/sample_rate))
        if b <= a:
            continue
        events.append(dict(id=f'candidate-{len(events)+1:05d}', time=t,
            source_start=a, source_end=b, attack_interval=[a, b], confirmed=False,
            type='audio_transient', instrument='unknown', origin='unknown',
            strength=float(scores[i] / (scores[i] + 10)),
            uncertainty=dict(timing_seconds=hop/sample_rate, identity='unknown',
                             note='Attack interval estimate; not a confirmed shot or kill.'),
            evidence=dict(method='multiband-energy-rise/v1', band_count=int(band_count[i]),
                          local_salience=float(min(salience[i], 1e8)), score=float(scores[i]))))
    return events


def _windows(events, start, end, max_windows):
    groups = []
    for event in events:
        if groups and event['time'] - groups[-1][-1]['time'] <= .30 and event['source_end'] - groups[-1][0]['source_start'] <= 2.3:
            groups[-1].append(event)
        else:
            groups.append([event])
    windows = []
    for group in groups:
        a = max(start, group[0]['source_start'] - .35)
        b = min(end, group[-1]['source_end'] + .35, a + 3)
        if b - a < 2:
            extra = (2 - (b - a)) / 2
            a = max(start, a - extra)
            b = min(end, a + 2)
            a = max(start, b - 2)
        if windows and a < windows[-1]['source_end']:
            boundary = (windows[-1]['candidate_events'][-1]['source_end'] + group[0]['source_start']) / 2
            windows[-1]['source_end'] = boundary
            a = boundary
        windows.append(dict(source_start=a, source_end=b, candidate_events=group,
            visual_review='unreviewed', outcome='unknown', confirmed=False))
    # Preserve strong-candidate recall while reserving half the bounded list
    # for intact quiet-edge context. Strongest-only selection fills the entire
    # handoff with dense/short bursts that cannot support an authored bridge.
    # This changes window ranking, NOT detector thresholds or confirmation.
    strongest = sorted(windows, key=lambda w: max(e['evidence']['score'] for e in w['candidate_events']), reverse=True)
    safe = [w for w in windows if len(w['candidate_events']) <= 8
            and w['candidate_events'][0]['attack_interval'][0]-w['source_start'] >= .32
            and w['source_end']-w['candidate_events'][-1]['attack_interval'][1] >= .42]
    safe.sort(key=lambda w: (max(e['strength'] for e in w['candidate_events'])/len(w['candidate_events']),
                           w['source_end']-w['source_start']), reverse=True)
    selected = strongest[:max_windows//2]
    for window in safe+strongest:
        if len(selected) >= max_windows:
            break
        if all(window is not existing for existing in selected):
            selected.append(window)
    windows = sorted(selected, key=lambda w: w['source_start'])
    for index, window in enumerate(windows):
        window['id'] = f'window-{index+1:03d}'
    return windows


def analyze_sample_windows(samples, sample_rate, *, source_start=0,
                           source_duration=None, source_id='synthetic', max_windows=16):
    import numpy as np
    _budget(MAX_SOURCE_SECONDS, sample_rate, max_windows)
    source_start = _number(source_start, 'source_start')
    _text(source_id, 'source_id')
    # Inspect shape before conversion: do not allocate an oversized list/array.
    if not isinstance(samples, np.ndarray) or samples.ndim != 1 or samples.dtype.kind not in 'fi':
        raise ValueError('samples must be a mono numeric ndarray or memmap')
    if len(samples) == 0 or len(samples) > int(MAX_SOURCE_SECONDS * sample_rate):
        raise ValueError('samples require 0 < duration <= 600 seconds')
    end = source_start + len(samples)/sample_rate
    duration = end if source_duration is None else _number(source_duration, 'source_duration', end)
    events = _candidates(samples, sample_rate, source_start)
    windows = _windows(events, source_start, end, max_windows)
    for event in events:
        event['source'] = source_id
    for window in windows:
        window['source'] = source_id
        window['source_duration'] = duration
    return dict(schema_version='firing-map/v1', mode='candidate', confirmed=False,
        source=source_id, source_duration=duration,
        sources=[dict(id=source_id, duration=duration, analyzed_start=source_start,
                      analyzed_end=end, sample_rate=sample_rate, channels=1,
                      file_identity=None, audio_sha256=None)],
        candidate_events=events, candidate_windows=windows,
        candidate_window_selection=dict(available_event_count=len(events),
            selected_event_count=sum(len(w['candidate_events']) for w in windows),
            policy='half strongest windows plus quiet-edge context coverage; all detected events retained at root'),
        limitations=['Audio transients only; instrument/origin and gameplay outcome unknown.',
                     'No visual review or automatic conversion to reviewed events.'],
        analysis=dict(method='multiband-energy-rise/v1', refractory_seconds=.045,
                      max_source_seconds=MAX_SOURCE_SECONDS, max_windows=max_windows))


def extract_firing_map(path, *, max_source_seconds=600, sample_rate=24000,
                       max_windows=16, ffmpeg='ffmpeg', ffprobe='ffprobe'):
    import numpy as np
    seconds = _budget(max_source_seconds, sample_rate, max_windows)
    source = Path(path).resolve(strict=True)
    before = _identity(source)
    metadata = _probe(source, ffprobe)
    seconds = min(seconds, metadata['duration'])
    byte_limit = int(seconds * sample_rate) * 4
    with tempfile.TemporaryDirectory(prefix='aive-firing-') as temp:
        audio = Path(temp) / 'audio.f32'
        # -t BEFORE -i bounds input from sample zero; output -t/-fs also cap PCM.
        command = [ffmpeg, '-nostdin', '-v', 'error', '-t', str(seconds), '-i', str(source),
            '-map', '0:a:0', '-vn', '-ac', '1', '-ar', str(sample_rate),
            '-t', str(seconds), '-fs', str(byte_limit), '-f', 'f32le', '-acodec', 'pcm_f32le', 'pipe:1']
        with audio.open('wb') as output:
            result = subprocess.run(command, stdout=output, stderr=subprocess.DEVNULL,
                                    timeout=180, check=False)
        if result.returncode:
            raise ValueError('bounded FFmpeg audio decode failed')
        size = audio.stat().st_size
        # FFmpeg -fs can exceed by a final packet; NEVER analyze beyond budget.
        if size > byte_limit + 262144 or size < 4 or size % 4:
            raise ValueError('decoded audio violated byte budget')
        with audio.open('r+b') as output:
            output.truncate(min(size, byte_limit))
        count = min(size, byte_limit)//4
        if not count:
            raise ValueError('no audio samples decoded')
        mmap = np.memmap(audio, mode='r', dtype='<f4', shape=(count,))
        try:
            data = analyze_sample_windows(mmap, sample_rate, source_duration=metadata['duration'],
                source_id=str(source), max_windows=max_windows)
        finally:
            mmap._mmap.close()
        if _identity(source) != before:
            raise ValueError('source file changed during analysis')
        info = data['sources'][0]
        info.update(file_identity=before, audio_sha256=_hash_file(audio),
            audio_identity=dict(encoding='f32le', sample_rate=sample_rate, channels=1,
                                sample_zero=True, sample_count=count), probe=metadata)
        if _identity(source) != before:
            raise ValueError('source file changed while recording identity')
        data['analysis']['max_source_seconds'] = seconds
        return data


def validate_reviewed_firing_map(data, *, expected_sources=None):
    """Validate reviewed-only data without mutating it; return original on success.

    Required root: schema_version, mode, sources, events (nonempty).
    Source: id,duration,file_identity(path,size_bytes,mtime_ns),audio_sha256,
      audio_identity(encoding=f32le,sample_rate,channels=1,sample_zero=True,
                     sample_count), analyzed_start=0,analyzed_end.
    Event: id,source,confirmed=True,type,source_audio_event,source_visual_event,
      audio_attack_interval,visual_attack_interval,audio_sha256,file_identity,
      provenance(list of {reviewer,method,reference}),
      context_review({status:'reviewed',source_start,source_end,notes}),
      outcome_review({status:'reviewed',outcome,notes}),
      visual_review='reviewed',instrument,origin.
    Outcome is explicitly one of unknown/shot/kill/non_gameplay/no_kill; a
    confirmed event does not imply a confirmed kill or shot.
    """
    if not isinstance(data, dict) or data.get('schema_version') != 'firing-map/v1' or data.get('mode') != 'reviewed':
        raise ValueError('explicit reviewed firing-map/v1 required; candidates are not reviewed')
    if data.get('candidate_events') or data.get('candidate_windows'):
        raise ValueError('candidate collections forbidden in reviewed maps')
    if not isinstance(data.get('sources'), list) or not data['sources']:
        raise ValueError('explicit sources required')
    sources = {}
    for source in data['sources']:
        if not isinstance(source, dict):
            raise ValueError('source must be an object')
        sid = _text(source.get('id'), 'source ID')
        if sid in sources:
            raise ValueError('duplicate source ID')
        duration = _number(source.get('duration'), 'source duration', .001)
        identity = source.get('file_identity')
        if not isinstance(identity, dict):
            raise ValueError('file identity required')
        _text(identity.get('path'), 'file identity path')
        for key in ('size_bytes', 'mtime_ns'):
            if type(identity.get(key)) is not int or identity[key] < 0:
                raise ValueError('invalid file identity')
        _sha(source.get('audio_sha256'), 'audio SHA256')
        audio = source.get('audio_identity')
        if not isinstance(audio, dict) or audio.get('encoding') != 'f32le' or audio.get('sample_zero') is not True or type(audio.get('channels')) is not int or audio.get('channels') != 1:
            raise ValueError('sample-zero mono audio identity required')
        _budget(MAX_SOURCE_SECONDS, audio.get('sample_rate'), 1)
        if type(audio.get('sample_count')) is not int or not 0 < audio['sample_count'] <= MAX_SOURCE_SECONDS * audio['sample_rate']:
            raise ValueError('invalid sample count')
        start = _number(source.get('analyzed_start'), 'analyzed_start', 0, 0)
        end = _number(source.get('analyzed_end'), 'analyzed_end', .000001, min(duration, MAX_SOURCE_SECONDS))
        if abs(end - audio['sample_count']/audio['sample_rate']) > 1/audio['sample_rate']:
            raise ValueError('audio identity duration mismatch')
        if expected_sources is not None and (sid not in expected_sources or source != expected_sources[sid]):
            raise ValueError('source identity does not match independently supplied source')
        sources[sid] = source
    events = data.get('events')
    if not isinstance(events, list) or not 1 <= len(events) <= MAX_EVENTS:
        raise ValueError('bounded nonempty reviewed events required')
    seen = set()
    for event in events:
        if not isinstance(event, dict):
            raise ValueError('event must be an object')
        eid = _text(event.get('id'), 'event ID')
        if eid in seen:
            raise ValueError('duplicate event ID')
        seen.add(eid)
        sid = _text(event.get('source'), 'event source')
        if sid not in sources:
            raise ValueError('unknown event source')
        source = sources[sid]
        if event.get('confirmed') is not True or event.get('visual_review') != 'reviewed':
            raise ValueError('explicit reviewed event required')
        for key in ('type', 'instrument', 'origin'):
            _text(event.get(key), key)
        if event.get('audio_sha256') != source['audio_sha256'] or event.get('file_identity') != source['file_identity']:
            raise ValueError('event audio/file identity mismatch')
        end = source['analyzed_end']
        intervals = []
        for kind in ('audio', 'visual'):
            interval = _interval(event.get(f'{kind}_attack_interval'), f'{kind} attack interval', 0, end)
            _number(event.get(f'source_{kind}_event'), f'source_{kind}_event', *interval)
            intervals.append(interval)
        provenance = event.get('provenance')
        if not isinstance(provenance, list) or not provenance:
            raise ValueError('nonempty provenance required')
        for record in provenance:
            if not isinstance(record, dict):
                raise ValueError('provenance must be an object')
            for key in ('reviewer', 'method', 'reference'):
                _text(record.get(key), f'provenance {key}')
        context = event.get('context_review')
        if not isinstance(context, dict) or context.get('status') != 'reviewed':
            raise ValueError('complete context review required')
        a, b = _interval([context.get('source_start'), context.get('source_end')], 'context interval', 0, end)
        if any(x < a or y > b for x, y in intervals):
            raise ValueError('context must contain attack intervals')
        _text(context.get('notes'), 'context notes')
        outcome = event.get('outcome_review')
        if not isinstance(outcome, dict) or outcome.get('status') != 'reviewed' or outcome.get('outcome') not in {'unknown', 'shot', 'kill', 'non_gameplay', 'no_kill'}:
            raise ValueError('complete explicit outcome review required')
        _text(outcome.get('notes'), 'outcome notes')
    return data


