"""Bounded read-only file content identity, not semantic/review authentication.

Identities exclude paths and filesystem timestamps. Stat checks and a second
content capture can detect ordinary changes, not adversarial change-and-restore.
No decoding, downloads, or writes to input media are performed.
"""
from __future__ import annotations

import hashlib
import math
from pathlib import Path
import time

MAX_FILE_BYTES = 8 * 1024**3
MAX_TOTAL_BYTES = 32 * 1024**3
MAX_FILES = 65
MAX_INPUT_ENTRIES = 4096
MAX_TIMEOUT = 60.


class MediaIdentityError(ValueError):
    pass


def _bounds(max_bytes, timeout):
    if type(max_bytes) is not int or not 0 < max_bytes <= MAX_TOTAL_BYTES:
        raise MediaIdentityError('invalid identity byte bound')
    if type(timeout) not in (int, float) or not math.isfinite(timeout) or not 0 < timeout <= MAX_TIMEOUT:
        raise MediaIdentityError('invalid identity time bound')


def _signature(st):
    return st.st_size, st.st_mtime_ns, st.st_ctime_ns


def valid_file_identity(value):
    """Structural check only; a supplied JSON hash is not authenticated."""
    return (isinstance(value, dict) and set(value) == {'schema', 'sha256', 'size_bytes'} and
            value.get('schema') == 'file-content/v1' and
            isinstance(value.get('sha256'), str) and len(value['sha256']) == 64 and
            all(c in '0123456789abcdef' for c in value['sha256']) and
            type(value.get('size_bytes')) is int and 0 < value['size_bytes'] <= MAX_FILE_BYTES)


def capture_file_identity(path, *, max_bytes=MAX_FILE_BYTES, timeout=MAX_TIMEOUT, deadline=None):
    _bounds(max_bytes, timeout)
    if max_bytes > MAX_FILE_BYTES:
        raise MediaIdentityError('identity file byte bound exceeds hard cap')
    if (not isinstance(path, (str, Path)) or not str(path) or '://' in str(path) or
            str(path).startswith(('\\\\', '//'))):
        raise MediaIdentityError('existing local file path required')
    if deadline is not None and (type(deadline) not in (int, float) or not math.isfinite(deadline)):
        raise MediaIdentityError('invalid identity deadline')
    finish = min(time.monotonic() + timeout, deadline) if deadline is not None else time.monotonic() + timeout
    source = Path(path)
    try:
        if not source.is_file():
            raise MediaIdentityError('identity source missing or not a regular file')
        before = source.stat()
        if not 0 < before.st_size <= max_bytes:
            raise MediaIdentityError('identity source empty or exceeds byte bound')
        digest, size = hashlib.sha256(), 0
        with source.open('rb') as stream:
            while True:
                if time.monotonic() >= finish:
                    raise MediaIdentityError('identity time bound exceeded')
                block = stream.read(1024 * 1024)
                if not block:
                    break
                size += len(block)
                if size > max_bytes:
                    raise MediaIdentityError('identity byte bound exceeded')
                digest.update(block)
        after = source.stat()
        if size != before.st_size or _signature(before) != _signature(after):
            raise MediaIdentityError('source changed during identity capture')
        if time.monotonic() >= finish:
            raise MediaIdentityError('identity time bound exceeded')
        return {'schema': 'file-content/v1', 'sha256': digest.hexdigest(), 'size_bytes': size}
    except OSError as exc:
        raise MediaIdentityError('local file identity unavailable') from exc


def capture_media_identities(paths, *, max_total_bytes=MAX_TOTAL_BYTES, timeout=MAX_TIMEOUT):
    _bounds(max_total_bytes, timeout)
    result, total = {}, 0
    deadline = time.monotonic() + timeout
    for index, path in enumerate(paths):
        if index >= MAX_INPUT_ENTRIES:
            raise MediaIdentityError('identity input entry count bound exceeded')
        if time.monotonic() >= deadline:
            raise MediaIdentityError('aggregate identity time bound exceeded')
        key = str(path)
        if key in result:
            continue
        if len(result) >= MAX_FILES:
            raise MediaIdentityError('identity file count bound exceeded')
        remaining = max_total_bytes - total
        if remaining <= 0:
            raise MediaIdentityError('aggregate identity byte bound exceeded')
        identity = capture_file_identity(path, max_bytes=min(MAX_FILE_BYTES, remaining),
                                         timeout=timeout, deadline=deadline)
        total += identity['size_bytes']
        result[key] = identity
    return result
