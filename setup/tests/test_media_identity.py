"""Read-only content identity and deterministic resource/mutation regressions."""
from __future__ import annotations

import builtins
from contextlib import contextmanager
import hashlib
import io
import os
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

from aive.media_identity import (
    MediaIdentityError,
    capture_file_identity,
    capture_media_identities,
)


CHUNK_BYTES = 1024 * 1024


class _ReadObserver:
    """Keep the real local file handle while observing deterministic read events."""

    def __init__(self, handle, path, reads, on_read):
        self._handle = handle
        self._path = path
        self._reads = reads
        self._on_read = on_read

    def __getattr__(self, name):
        return getattr(self._handle, name)

    def __enter__(self):
        self._handle.__enter__()
        return self

    def __exit__(self, *args):
        return self._handle.__exit__(*args)

    def read(self, size=-1):
        self._reads.append(size)
        data = self._handle.read(size)
        if data and self._on_read is not None:
            self._on_read(self._path, data)
        return data


@contextmanager
def _observe_reads(paths, *, on_read=None):
    """Cover both builtins.open and pathlib's io.open without replacing bytes."""
    targets = {str(path) for path in paths}
    reads, modes = [], []
    real_builtin_open, real_io_open = builtins.open, io.open

    def wrap(real_open):
        def observed(file, mode='r', *args, **kwargs):
            handle = real_open(file, mode, *args, **kwargs)
            if str(file) in targets:
                modes.append(mode)
                if 'b' in mode and 'r' in mode:
                    return _ReadObserver(handle, str(file), reads, on_read)
            return handle
        return observed

    with patch('builtins.open', new=wrap(real_builtin_open)), \
            patch('io.open', new=wrap(real_io_open)):
        yield reads, modes


class _StatView:
    """Forward every real stat field except one deliberately changed field."""

    def __init__(self, actual, changed_field):
        self._actual = actual
        self._changed_field = changed_field

    def __getattr__(self, name):
        value = getattr(self._actual, name)
        return value + 1 if name == self._changed_field else value


class MediaIdentityTests(unittest.TestCase):
    def setUp(self):
        self._temp = tempfile.TemporaryDirectory(prefix='media-identity-test-')
        self.addCleanup(self._temp.cleanup)
        self.root = Path(self._temp.name)

    def source(self, name='source.bin', data=b'local-media-bytes'):
        path = self.root / name
        path.write_bytes(data)
        return path

    def assertIdentity(self, identity, data):
        self.assertEqual(identity, {
            'schema': 'file-content/v1',
            'sha256': hashlib.sha256(data).hexdigest(),
            'size_bytes': len(data),
        })
        self.assertRegex(identity['sha256'], r'^[0-9a-f]{64}$')
        self.assertIs(type(identity['size_bytes']), int)
        self.assertGreater(identity['size_bytes'], 0)

    def test_error_is_value_error(self):
        self.assertTrue(issubclass(MediaIdentityError, ValueError))

    def test_exact_file_bytes_and_schema(self):
        data = bytes(range(256)) * 19
        self.assertIdentity(capture_file_identity(self.source(data=data)), data)

    def test_copied_renamed_bytes_have_same_identity_despite_path_and_mtime(self):
        data = b'identical-content\x00\xff' * 31
        source = self.source(data=data)
        first = capture_file_identity(source)
        copied = self.root / 'different-name.bin'
        shutil.copyfile(source, copied)
        original_stat = source.stat()
        os.utime(copied, ns=(original_stat.st_atime_ns,
                            original_stat.st_mtime_ns + 10_000_000_000))
        self.assertNotEqual(source.stat().st_mtime_ns, copied.stat().st_mtime_ns)
        self.assertEqual(first, capture_file_identity(copied))
        renamed = self.root / 'renamed-again.bin'
        copied.rename(renamed)
        self.assertEqual(first, capture_file_identity(renamed))
        self.assertEqual(source.read_bytes(), data)

    def test_changed_same_size_content_has_different_identity_even_same_mtime(self):
        source = self.source(data=b'AAAA')
        original = capture_file_identity(source)
        before = source.stat()
        source.write_bytes(b'BBBB')
        os.utime(source, ns=(before.st_atime_ns, before.st_mtime_ns))
        changed = capture_file_identity(source)
        self.assertEqual(original['size_bytes'], changed['size_bytes'])
        self.assertNotEqual(original['sha256'], changed['sha256'])
        self.assertIdentity(changed, b'BBBB')

    def test_hashing_is_read_only_and_uses_one_mib_chunks(self):
        data = b'x' * (2 * CHUNK_BYTES + 17)
        source = self.source(data=data)
        before = source.stat()
        with _observe_reads([source]) as (reads, modes):
            identity = capture_file_identity(source)
        self.assertIdentity(identity, data)
        self.assertTrue(reads, 'the hash must read the actual file bytes')
        self.assertTrue(all(size == CHUNK_BYTES for size in reads), reads)
        self.assertTrue(modes)
        self.assertTrue(all('r' in mode and 'b' in mode and
                            not any(flag in mode for flag in 'wa+')
                            for mode in modes), modes)
        after = source.stat()
        self.assertEqual(source.read_bytes(), data)
        self.assertEqual((before.st_size, before.st_mtime_ns, before.st_ctime_ns),
                         (after.st_size, after.st_mtime_ns, after.st_ctime_ns))

    def test_missing_empty_and_directory_rejected(self):
        cases = [self.root / 'missing.bin', self.source('empty.bin', b''), self.root]
        for path in cases:
            with self.subTest(path=str(path)), self.assertRaises(MediaIdentityError):
                capture_file_identity(path)

    def test_nonlocal_paths_rejected(self):
        for path in ('https://example.invalid/media.mp4', 's3://bucket/media.mp4',
                     r'\\server\share\media.mp4', '//server/share/media.mp4'):
            with self.subTest(path=path), self.assertRaises(MediaIdentityError):
                capture_file_identity(path)

    def test_existing_nonlocal_content_is_still_rejected(self):
        # Model an accessible remote filesystem: absence must not be the reason
        # for rejection. No actual network request is made by this test.
        data = b'remote-content'
        local_stat = self.source(data=data).stat()
        for path in (r'\\server\share\media.mp4', '//server/share/media.mp4'):
            with self.subTest(path=path), \
                    patch.object(Path, 'is_file', return_value=True), \
                    patch.object(Path, 'stat', return_value=local_stat), \
                    patch.object(Path, 'open', return_value=io.BytesIO(data)), \
                    self.assertRaises(MediaIdentityError):
                capture_file_identity(path)

    def test_file_byte_cap_accepts_exact_bound_and_rejects_one_byte_over(self):
        source = self.source(data=b'12345')
        self.assertIdentity(capture_file_identity(source, max_bytes=5), b'12345')
        with self.assertRaises(MediaIdentityError):
            capture_file_identity(source, max_bytes=4)
        self.assertEqual(source.read_bytes(), b'12345')

    def test_nonpositive_byte_and_time_caps_rejected(self):
        source = self.source()
        for kwargs in ({'max_bytes': 0}, {'max_bytes': -1},
                       {'timeout': 0}, {'timeout': -1}):
            with self.subTest(kwargs=kwargs), self.assertRaises(MediaIdentityError):
                capture_file_identity(source, **kwargs)
        for kwargs in ({'max_total_bytes': 0}, {'max_total_bytes': -1},
                       {'timeout': 0}, {'timeout': -1}):
            with self.subTest(kwargs=kwargs), self.assertRaises(MediaIdentityError):
                capture_media_identities([source], **kwargs)

    def test_collection_uses_exact_string_keys_and_deduplicates_paths(self):
        first = self.source('first.bin', b'first')
        second = self.source('second.bin', b'second')
        result = capture_media_identities([first, str(first), second])
        self.assertEqual(set(result), {str(first), str(second)})
        self.assertIdentity(result[str(first)], b'first')
        self.assertIdentity(result[str(second)], b'second')
        # Repetitions must consume neither unique-path count nor aggregate bytes.
        repeated = capture_media_identities([first] * 66, max_total_bytes=5)
        self.assertEqual(repeated, {str(first): result[str(first)]})

    def test_duplicate_entry_stream_is_bounded(self):
        source = self.source()
        def repeated():
            while True:
                yield source
        with self.assertRaisesRegex(MediaIdentityError, 'entry count'):
            capture_media_identities(repeated())

    def test_distinct_paths_with_identical_content_remain_distinct_collection_keys(self):
        first = self.source('first.bin', b'same')
        second = self.source('second.bin', b'same')
        result = capture_media_identities([first, second])
        self.assertEqual(len(result), 2)
        self.assertEqual(result[str(first)], result[str(second)])
        with self.assertRaises(MediaIdentityError):
            capture_media_identities([first, second], max_total_bytes=7)

    def test_collection_aggregate_cap_accepts_exact_bound_and_rejects_overflow(self):
        first = self.source('first.bin', b'123')
        second = self.source('second.bin', b'4567')
        result = capture_media_identities([first, second], max_total_bytes=7)
        self.assertEqual(sum(item['size_bytes'] for item in result.values()), 7)
        with self.assertRaises(MediaIdentityError):
            capture_media_identities([first, second], max_total_bytes=6)

    def test_collection_unique_path_count_boundary(self):
        paths = [self.source(f'part-{i}.bin', b'x') for i in range(66)]
        self.assertEqual(len(capture_media_identities(paths[:65])), 65)
        with self.assertRaises(MediaIdentityError):
            capture_media_identities(paths)

    def test_collection_does_not_return_partial_success_for_invalid_source(self):
        source = self.source()
        for invalid in (self.root / 'missing.bin', self.source('empty.bin', b''), self.root):
            with self.subTest(invalid=str(invalid)), self.assertRaises(MediaIdentityError):
                capture_media_identities([source, invalid])

    def test_stat_changes_in_size_mtime_or_ctime_during_read_are_rejected(self):
        source = self.source(data=b'unmodified-original' * 100)
        real_stat, real_fstat = os.stat, os.fstat
        initial = source.stat()
        for field in ('st_size', 'st_mtime_ns', 'st_ctime_ns'):
            changed = [False]

            def after_read(_path, _data):
                changed[0] = True

            def observed_stat(path, *args, **kwargs):
                actual = real_stat(path, *args, **kwargs)
                if changed[0] and str(path) == str(source):
                    return _StatView(actual, field)
                return actual

            def observed_fstat(fd):
                actual = real_fstat(fd)
                if changed[0] and (actual.st_dev, actual.st_ino) == (initial.st_dev, initial.st_ino):
                    return _StatView(actual, field)
                return actual

            with self.subTest(field=field), \
                    _observe_reads([source], on_read=after_read), \
                    patch('os.stat', new=observed_stat), \
                    patch('os.fstat', new=observed_fstat), \
                    self.assertRaises(MediaIdentityError):
                capture_file_identity(source)
            self.assertTrue(changed[0], 'mutation must be introduced during an actual read')
            self.assertEqual(source.read_bytes(), b'unmodified-original' * 100)

    def test_actual_append_during_hash_is_rejected(self):
        source = self.source(data=b'before')
        real_open = builtins.open
        appended = [False]

        def append_once(_path, _data):
            if not appended[0]:
                with real_open(source, 'ab') as handle:
                    handle.write(b'-changed')
                appended[0] = True

        with _observe_reads([source], on_read=append_once), self.assertRaises(MediaIdentityError):
            capture_file_identity(source)
        self.assertTrue(appended[0])

    def test_file_timeout_is_checked_during_hash_without_sleep(self):
        source = self.source()
        clock = [100.0]

        def expire(_path, _data):
            clock[0] = 101.0

        with patch('aive.media_identity.time.monotonic', side_effect=lambda: clock[0]), \
                _observe_reads([source], on_read=expire), self.assertRaises(MediaIdentityError):
            capture_file_identity(source, timeout=0.5)

    def test_expired_deadline_and_deadline_during_hash_rejected(self):
        source = self.source()
        with patch('aive.media_identity.time.monotonic', return_value=100.0), \
                self.assertRaises(MediaIdentityError):
            capture_file_identity(source, deadline=99.0)
        clock = [100.0]

        def expire(_path, _data):
            clock[0] = 101.0

        with patch('aive.media_identity.time.monotonic', side_effect=lambda: clock[0]), \
                _observe_reads([source], on_read=expire), self.assertRaises(MediaIdentityError):
            capture_file_identity(source, timeout=60.0, deadline=100.5)

    def test_collection_timeout_is_shared_not_reset_for_each_file(self):
        paths = [self.source('first.bin', b'a'), self.source('second.bin', b'b')]
        clock = [100.0]

        def advance_one_second(_path, _data):
            clock[0] += 1.0

        with patch('aive.media_identity.time.monotonic', side_effect=lambda: clock[0]), \
                _observe_reads(paths, on_read=advance_one_second), self.assertRaises(MediaIdentityError):
            capture_media_identities(paths, timeout=1.5)
        self.assertGreaterEqual(clock[0], 102.0)


if __name__ == '__main__':
    unittest.main()
