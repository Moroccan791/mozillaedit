"""Bounded PCM preview candidates, not certified percussion or musical taste."""
from __future__ import annotations
import hashlib
import json
import math
from numbers import Real
from pathlib import Path
import re
import subprocess
import numpy as np
from scipy import ndimage, signal
from .accent_audit import analyze_accent_samples

VERSION = 'hit-map/v1'
REVIEW_VERSION = 'reviewed-hit-map/v1'
ANALYSIS_SR = 24000
MAX_EXCERPT = 12.0
MAX_INPUT_END = 600.0
MAX_CANDIDATES = 32
_BANDS = ((30,180),(180,800),(800,3000),(3000,10000))
INTERPRETATION = 'Measured acoustic candidates only; not certified percussion, instrument identity, musical taste or confirmed synchronization'


def _number(value, name, lo=0., hi=MAX_INPUT_END):
    if isinstance(value, bool) or not isinstance(value, Real):
        raise ValueError(f'{name} must be finite real seconds')
    value = float(value)
    if not math.isfinite(value) or not lo <= value <= hi:
        raise ValueError(f'{name} outside [{lo}, {hi}]')
    return value


def _limit(value):
    n = _number(value, 'max_candidates', 1, MAX_CANDIDATES)
    if n != int(n):
        raise ValueError('max_candidates must be an integer')
    return int(n)


def _sha(value):
    if not isinstance(value, str) or re.fullmatch(r'[0-9a-fA-F]{64}', value) is None:
        raise ValueError('song_sha256 must be a SHA256 hex digest')
    return value.lower()


def song_sha256(music):
    """SHA256 of local file bytes, never path, title or tags."""
    p = Path(music)
    if not p.is_file():
        raise ValueError('music must be an existing local file')
    h = hashlib.sha256()
    with p.open('rb') as f:
        for chunk in iter(lambda: f.read(1024*1024), b''):
            h.update(chunk)
    return h.hexdigest()


def _excerpt(start, duration):
    start = _number(start, 'excerpt_start')
    duration = _number(duration, 'excerpt_duration', 0., MAX_EXCERPT)
    if duration <= 0 or start + duration > MAX_INPUT_END:
        raise ValueError('excerpt must be nonempty, <=12s and end <=600s')
    return start, duration


def build_hit_map(music, excerpt_start, excerpt_duration, *, max_candidates=32):
    """Decode <=12s excerpt +/-1s margins, clipped at zero/600s.

    Input -t before -i, no seek: decode from sample zero then sample atrim.
    Output <=14s f32le 24k mono. Failures/short excerpts raise.
    """
    start, duration = _excerpt(excerpt_start, excerpt_duration)
    limit = _limit(max_candidates)
    p = Path(music)
    before = p.stat() if p.is_file() else None
    identity = song_sha256(p)
    first = max(0, math.floor((start-1.)*ANALYSIS_SR))
    last = min(int(MAX_INPUT_END*ANALYSIS_SR), math.ceil((start+duration+1.)*ANALYSIS_SR))
    trim = f'aresample={ANALYSIS_SR},atrim=start_sample={first}:end_sample={last}'
    cmd = ['ffmpeg','-hide_banner','-v','error','-nostdin','-t',str(last/ANALYSIS_SR),
           '-i',str(p),'-af',trim,'-ac','1','-ar',str(ANALYSIS_SR),'-f','f32le','-']
    try:
        proc = subprocess.run(cmd, capture_output=True, timeout=45)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError('FFmpeg bounded decode unavailable or timed out') from exc
    if proc.returncode:
        raise RuntimeError('FFmpeg bounded decode failed')
    if len(proc.stdout)%4 or len(proc.stdout) > (last-first)*4:
        raise RuntimeError('FFmpeg exceeded bounded window or malformed PCM')
    after = p.stat()
    if (before.st_size,before.st_mtime_ns) != (after.st_size,after.st_mtime_ns):
        raise RuntimeError('music changed during decode')
    x = np.frombuffer(proc.stdout,dtype='<f4')
    result = analyze_hit_samples(x, ANALYSIS_SR, song_sha256=identity,
        excerpt_start=start, excerpt_duration=duration, pcm_start=first/ANALYSIS_SR,
        max_candidates=limit)
    result['decode'] = {'method':'ffmpeg_sample_zero_input_bounded_atrim',
        'input_end':last/ANALYSIS_SR,'sample_rate':ANALYSIS_SR,'channels':1,
        'pcm_start':first/ANALYSIS_SR,'pcm_end':first/ANALYSIS_SR+len(x)/ANALYSIS_SR}
    return result


def analyze_hit_samples(x, sr, *, song_sha256, excerpt_start=0.,
                        excerpt_duration=None, pcm_start=0., max_candidates=32):
    """<=14s finite 24k mono PCM. Absolute clocks via pcm_start.

    Supplied SHA is caller's identity assertion, not proof of PCM provenance.
    Strongest <=32 peaks selected first; outputs/IDs chronological, no BPM grid.
    """
    identity = _sha(song_sha256)
    limit = _limit(max_candidates)
    if isinstance(sr,bool) or not isinstance(sr,Real) or sr != ANALYSIS_SR:
        raise ValueError('sr must be 24000')
    a = np.asarray(x)
    if (a.ndim != 1 or not a.size or a.size > 14*ANALYSIS_SR+2
            or a.dtype.kind not in 'fiu' or not np.isfinite(a).all()):
        raise ValueError('x must be nonempty finite real mono PCM <=14s')
    origin = _number(pcm_start,'pcm_start')
    end = origin + a.size/ANALYSIS_SR
    if end > MAX_INPUT_END+1e-9:
        raise ValueError('PCM end must be <=600s')
    if excerpt_duration is None:
        excerpt_duration = end - _number(excerpt_start,'excerpt_start')
    start,duration = _excerpt(excerpt_start,excerpt_duration)
    if start < origin or start+duration > end+1/ANALYSIS_SR:
        raise ValueError('excerpt outside decoded PCM')
    y = a.astype(np.float64)
    scale = float(np.max(np.abs(y)))
    if scale:
        y /= scale
    if len(y)<512:
        y = np.pad(y,(0,512-len(y)))
    freq,clock,z = signal.stft(y,fs=ANALYSIS_SR,nperseg=512,noverlap=416,
                              boundary='zeros',padded=True)
    spec = np.abs(z)
    harmonic = ndimage.median_filter(spec,size=(1,31))
    percussion = ndimage.median_filter(spec,size=(31,1))
    mask = percussion**2/(percussion**2+harmonic**2+1e-18)
    pspec = spec*mask  # HPSS proxy, not an instrument classifier
    flux,pflux = [],[]
    for low,high in _BANDS:
        band = (freq>=low)&(freq<high)
        flux.append(np.r_[0.,np.maximum(np.diff(spec[band],axis=1),0.).sum(axis=0)])
        pflux.append(np.r_[0.,np.maximum(np.diff(pspec[band],axis=1),0.).sum(axis=0)])
    flux,pflux = np.asarray(flux),np.asarray(pflux)
    novelty = ndimage.gaussian_filter1d((flux+pflux).sum(axis=0),.7)
    absolute = clock+origin
    maximum = float(novelty.max())
    peaks = np.array([],dtype=int)
    if scale and maximum>1e-12:
        peaks,_ = signal.find_peaks(novelty,distance=10,prominence=maximum*.035)
        peaks = peaks[(absolute[peaks]>=start)&(absolute[peaks]<start+duration)]
        peaks = np.asarray(sorted(sorted(peaks,key=lambda k:(-novelty[k],absolute[k]))[:limit]))
    audits = analyze_accent_samples(a,ANALYSIS_SR,[float(clock[k]) for k in peaks]) if len(peaks) else []
    candidates = []
    for index,(k,audit) in enumerate(zip(peaks,audits)):
        # Keep original audit decisions and reasons. Only translate clocks.
        for field in ('original_peak','acoustic_attack_time','flux_peak_time'):
            if audit[field] is not None:
                audit[field] += origin
        for field in ('acoustic_attack_range','context_range'):
            if audit[field] is not None:
                audit[field] = [v+origin for v in audit[field]]
        t = float(absolute[k])
        local = novelty[np.abs(absolute-t)<=1.]
        strength = float(np.clip(novelty[k]/max(float(local.max()),1e-18),0.,1.))
        refined,interval = audit['acoustic_attack_time'],audit['acoustic_attack_range']
        if refined is not None and not start<=refined<start+duration:
            refined,interval = None,None
        candidates.append({'id':f'hit-{index+1:03d}','time':t,
            'refined_time':refined,'refined_interval':interval,'strength':strength,
            'preview_eligible':bool(refined is not None and strength>=.45),
            'confirmed':False,'review_status':'unreviewed','instrumentation':'unknown',
            'interpretation':INTERPRETATION,'evidence':{
                'method':'multiband_positive_percussive_stft_flux/v1',
                'stft_samples':512,'hop_samples':96,'bands_hz':[list(b) for b in _BANDS],
                'salience_method':'candidate novelty / maximum novelty within +/-1s',
                'preview_rule':'measured refined attack and local salience >=0.45; not confirmation',
                'positive_flux':[float(v) for v in flux[:,k]],
                'percussive_flux':[float(v) for v in pflux[:,k]],
                'novelty':float(novelty[k]),'local_max_novelty':float(local.max()),
                'pcm_peak_scale':scale,'accent_audit':audit}})
    return {'schema_version':VERSION,'song_sha256':identity,
        'excerpt':{'start':start,'duration':duration,'end':start+duration},
        'candidates':candidates,'review_status':'unreviewed',
        'instrumentation':'unknown','interpretation':INTERPRETATION}


def _text(value,name):
    if not isinstance(value,str) or not value.strip() or len(value)>4096:
        raise ValueError(f'{name} must be nonempty text <=4096 characters')
    return value.strip()


def validate_reviewed_hits(review, song_sha256):
    """Validate external review structure and audio binding, not its truth.

    Schema reviewed-hit-map/v1: song_sha256, hits <=32 increasing unique times.
    Each: id,time,interval [lo,hi],decision confirmed|rejected|uncertain,reviewer,
    method,evidence {source,description}. Generated candidates are not reviews.
    Tags/metadata alone do not meet this evidence schema or establish proof.
    """
    identity = _sha(song_sha256)
    if not isinstance(review,dict) or set(review)!={'schema_version','song_sha256','hits'}:
        raise ValueError('review requires schema_version, song_sha256, hits only')
    if review['schema_version']!=REVIEW_VERSION or _sha(review['song_sha256'])!=identity:
        raise ValueError('review schema or audio identity mismatch')
    hits = review['hits']
    if not isinstance(hits,list) or len(hits)>MAX_CANDIDATES:
        raise ValueError('review hits must be a list of <=32 hits')
    result,seen,previous = [],set(),-1.
    fields = {'id','time','interval','decision','reviewer','method','evidence'}
    for hit in hits:
        if not isinstance(hit,dict) or set(hit)!=fields:
            raise ValueError('review hit fields invalid')
        ident = _text(hit['id'],'id')
        t = _number(hit['time'],'time')
        interval = hit['interval']
        if not isinstance(interval,list) or len(interval)!=2:
            raise ValueError('interval must be [start,end]')
        lo,hi = (_number(v,'interval') for v in interval)
        if not lo<=t<=hi or t>=MAX_INPUT_END or t<=previous or ident in seen:
            raise ValueError('review hits need unique IDs, increasing times, valid intervals')
        decision = hit['decision']
        if not isinstance(decision,str) or decision not in {'confirmed','rejected','uncertain'}:
            raise ValueError('invalid review decision')
        evidence = hit['evidence']
        if not isinstance(evidence,dict) or set(evidence)!={'source','description'}:
            raise ValueError('review needs explicit source and observed evidence, not metadata')
        result.append({'id':ident,'time':t,'interval':[lo,hi],'decision':decision,
            'reviewer':_text(hit['reviewer'],'reviewer'),'method':_text(hit['method'],'method'),
            'evidence':{key:_text(evidence[key],key) for key in ('source','description')}})
        seen.add(ident)
        previous = t
    return {'schema_version':REVIEW_VERSION,'song_sha256':identity,'hits':result}


def load_reviewed_hits(review_path, music):
    """Read <=1MiB external JSON and bind to SHA256 of actual music bytes."""
    p = Path(review_path)
    if not p.is_file() or p.stat().st_size>1024*1024:
        raise ValueError('review must be local JSON <=1MiB')
    def unique(pairs):
        d = {}
        for key,value in pairs:
            if key in d:
                raise ValueError('duplicate review JSON key')
            d[key] = value
        return d
    try:
        with p.open('r',encoding='utf-8') as f:
            review = json.load(f,object_pairs_hook=unique)
    except (OSError,UnicodeError,json.JSONDecodeError) as exc:
        raise ValueError('invalid review JSON') from exc
    return validate_reviewed_hits(review,song_sha256(music))
