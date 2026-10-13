"""Optional runtime compatibility smoke, no model/ASR/download/accuracy claim."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
import wave


@unittest.skipUnless(importlib.util.find_spec('faster_whisper') and importlib.util.find_spec('av'),
                     'optional local lyrics dependencies not installed')
class OptionalLyricsRuntimeTests(unittest.TestCase):
    def test_existing_whisper_decoder_reads_sample_zero_wav(self):
        from faster_whisper.audio import decode_audio
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)/'selected-music.wav'
            with wave.open(str(source), 'wb') as handle:
                handle.setnchannels(1); handle.setsampwidth(2); handle.setframerate(16000)
                handle.writeframes(b'\0\0'*1600)
            before = source.read_bytes()
            decoded = decode_audio(str(source), sampling_rate=16000)
            self.assertEqual(len(decoded), 1600)
            self.assertTrue((decoded == 0).all())
            self.assertEqual(before, source.read_bytes())


if __name__ == '__main__':
    unittest.main()
