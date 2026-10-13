import copy
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from argparse import Namespace

from edit import cmd_lyric_review, _read_lyric_review_json
from aive.music_lyrics import MusicLyricsError


class LyricReviewCLITests(unittest.TestCase):
    def test_prepare_and_audit_never_overwrite_or_promote(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            candidate = root/'candidates.json'; candidate.write_text('{}')
            output = root/'review.json'
            args = Namespace(candidates=str(candidate), music='selected.mp3', review=None,
                             prefix_seconds=600., out=str(output))
            pending = {'schema':'music-lyric-review/v1', 'status':'PENDING', 'alignment_verified':False}
            with patch('aive.lyric_review.prepare_lyric_review', return_value=pending) as prepare:
                self.assertEqual(cmd_lyric_review(args), 0)
                self.assertEqual(json.loads(output.read_text()), pending)
                with self.assertRaises(FileExistsError):
                    cmd_lyric_review(args)
            args.review = str(output); args.out = str(root/'audit.json')
            failed = {'status':'PENDING','alignment_verified':False,'issues':['identity mismatch']}
            with patch('aive.lyric_review.audit_lyric_review', return_value=failed):
                self.assertEqual(cmd_lyric_review(args), 1)
                self.assertEqual(json.loads(Path(args.out).read_text()), failed)
            self.assertEqual(json.loads(output.read_text()), pending)

    def test_read_rejects_duplicate_keys_and_byte_overflow(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)/'bad.json'
            source.write_text('{"status":"UNVERIFIED","status":"verified"}')
            with self.assertRaisesRegex(MusicLyricsError, 'duplicate'):
                _read_lyric_review_json(source)
            source.write_text(' '*65)
            with patch('aive.music_lyrics.MAX_RESULT_BYTES', 64):
                with self.assertRaisesRegex(MusicLyricsError, 'byte bound'):
                    _read_lyric_review_json(source)


if __name__ == '__main__':
    unittest.main()
