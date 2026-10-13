"""Resource bounds for generic verified-lyric preflight, no vocal certification."""
from pathlib import Path
import json
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from aive.lyric_track import decoded_audio_duration, load_lyric_track, audio_sha256, LyricValidationError


class LyricDecodeBoundsTests(unittest.TestCase):
    def test_bounded_sample_zero_decode_and_timeout_are_forwarded(self):
        commands=[]
        def run(args,**kwargs):
            commands.append((args,kwargs.get('timeout')))
            if 'ffprobe' in args[0]:
                return subprocess.CompletedProcess(args,0,json.dumps({'streams':[{'sample_rate':'8000'}]}),'')
            kwargs['stdout'].write(b'\0\0'*8000)
            return subprocess.CompletedProcess(args,0,None,b'')
        with patch('aive.lyric_track.subprocess.run',side_effect=run):
            self.assertEqual(decoded_audio_duration('music.wav',max_seconds=2,timeout=30),1.)
        self.assertEqual([c[1] for c in commands],[30,30])
        args=commands[1][0]
        self.assertNotIn('-ss',args)
        self.assertEqual(args[args.index('-t')+1],'3')
        self.assertLess(args.index('-i'),args.index('-t'))

    def test_truncation_is_rejected_not_claimed_full_duration(self):
        def run(args,**kwargs):
            if 'ffprobe' in args[0]:
                return subprocess.CompletedProcess(args,0,json.dumps({'streams':[{'sample_rate':'8000'}]}),'')
            kwargs['stdout'].write(b'\0\0'*24000)
            return subprocess.CompletedProcess(args,0,None,b'')
        with patch('aive.lyric_track.subprocess.run',side_effect=run),self.assertRaisesRegex(LyricValidationError,'duration bound'):
            decoded_audio_duration('music.wav',max_seconds=2,timeout=30)

    def test_invalid_bounds_rejected_before_subprocess(self):
        for kw in ({'max_seconds':True},{'max_seconds':float('inf')},{'max_seconds':86401},
                   {'timeout':0},{'timeout':601},{'timeout':float('nan')}):
            with patch('aive.lyric_track.subprocess.run') as run,self.assertRaises(LyricValidationError):
                decoded_audio_duration('music.wav',**kw)
            run.assert_not_called()

    def test_load_forwards_bounds_and_preserves_verified_assertion_semantics(self):
        with tempfile.TemporaryDirectory() as tmp:
            song=Path(tmp)/'music.wav';song.write_bytes(b'synthetic')
            doc={'schema':'lyric-track/v1','audio_sha256':audio_sha256(song),
                 'provenance':{'alignment_verified':True,'method':'synthetic structural test, not sung'},
                 'words':[{'text':'TEST','start':0.1,'end':0.5}]}
            with patch('aive.lyric_track.decoded_audio_duration',return_value=1.) as decode:
                track=load_lyric_track(doc,song,max_seconds=2,timeout=30)
            self.assertEqual(track.decoded_duration,1.)
            self.assertEqual(decode.call_args.kwargs['max_seconds'],2)
            self.assertEqual(decode.call_args.kwargs['timeout'],30)


if __name__=='__main__':unittest.main()
