"""Synthetic retained stems only. Identity and acoustic status, not real-song review."""
import copy
import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch
import wave

import numpy as np

from aive.attack_qa import measure_attack_alignment, SAMPLE_RATE
from aive.calibration_report import audit_local_evidence
from aive.media_identity import capture_file_identity
from test_attack_qa import fixture, pulses


@unittest.skipUnless(shutil.which('ffmpeg'), 'local FFmpeg required')
class AttackIdentityTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.manifest, self.plan = fixture()
        for kind, seed in [('game', 19), ('music', 4)]:
            target = self.root / (kind + '.wav')
            self.write(target, pulses([.5], seed))
            self.manifest[kind + '_stem'] = str(target)
        self.original = {k: Path(self.manifest[k+'_stem']).read_bytes() for k in ('game', 'music')}

    def tearDown(self):
        self.temp.cleanup()

    def write(self, path, data):
        with wave.open(str(path), 'wb') as handle:
            handle.setnchannels(2)
            handle.setsampwidth(2)
            handle.setframerate(SAMPLE_RATE)
            handle.writeframes((data*32767).astype('<i2').tobytes())

    def measure(self):
        result = measure_attack_alignment(self.manifest, self.plan)
        json.dumps(result, allow_nan=False)
        return result

    def test_actual_stems_and_decoded_pcm_are_bound_without_promotion(self):
        result = self.measure()
        self.assertEqual(result['acoustic_alignment'], 'pass')
        self.assertEqual(result['musical_sync'], 'unverified')
        self.assertEqual(result['status'], 'warn')
        for kind in ('game', 'music'):
            identity = result['source_identities'][kind]
            self.assertEqual(identity['sha256'], hashlib.sha256(self.original[kind]).hexdigest())
            self.assertEqual(identity['size_bytes'], len(self.original[kind]))
            evidence = result['stem_identity_evidence'][kind]
            self.assertEqual(evidence['status'], 'checked_before_after')
            self.assertEqual(evidence['identity'], identity)
            self.assertEqual(len(evidence['decoded_pcm_sha256']), 64)
            self.assertEqual(Path(self.manifest[kind+'_stem']).read_bytes(), self.original[kind])
        self.assertEqual(result['source_media_provenance']['status'], 'unavailable')

    def test_copied_stems_same_identity_changed_music_only_changes_music(self):
        first = self.measure()
        for kind in ('game', 'music'):
            copied = self.root / (kind+'-copy.wav')
            copied.write_bytes(self.original[kind])
            self.manifest[kind+'_stem'] = str(copied)
        copied = self.measure()
        self.assertEqual(first['source_identities'], copied['source_identities'])
        self.write(self.manifest['music_stem'], pulses([.53], 4))
        changed = self.measure()
        self.assertEqual(first['source_identities']['game'], changed['source_identities']['game'])
        self.assertNotEqual(first['source_identities']['music'], changed['source_identities']['music'])
        self.assertEqual(changed['musical_sync'], 'unverified')

    def test_stem_mutation_during_decode_discards_measurements(self):
        real = capture_file_identity
        calls = 0
        def mutate(path, **kwargs):
            nonlocal calls
            if str(path) == self.manifest['game_stem']:
                calls += 1
                if calls == 2:
                    self.write(path, pulses([.53]))
            return real(path, **kwargs)
        with patch('aive.attack_qa.capture_file_identity', side_effect=mutate):
            result = self.measure()
        self.assertNotIn('game', result['source_identities'])
        self.assertEqual(result['stem_identity_evidence']['game']['status'], 'changed_or_unavailable')
        self.assertEqual(result['assignments'][0]['game_attack']['status'], 'unmeasurable')
        self.assertEqual(result['acoustic_alignment'], 'warn')

    def test_identity_budget_failure_preserves_acoustic_unknown_binding(self):
        with patch('aive.attack_qa.MAX_STEM_IDENTITY_BYTES', 64):
            result = self.measure()
        self.assertEqual(result['source_identities'], {})
        self.assertEqual(result['acoustic_alignment'], 'pass')
        self.assertEqual(result['stem_identity_evidence']['music']['status'], 'unavailable')
        self.assertEqual(result['musical_sync'], 'unverified')

    def test_real_generated_identity_accepts_only_correct_independent_label(self):
        result = self.measure()
        end = result['stem_identity_evidence']['game']['decoded_end']
        annotation = dict(kind='game_attack', source='game_stem', source_identity=result['source_identities']['game'],
            method='blind manual listening on sample-zero stem', label_origin='independent_audio_review',
            coverage=[[0., end]], complete=True, events=[{'time': .5}])
        audited = audit_local_evidence(None, [], [], attack=result, labels={'sets': [annotation]})
        self.assertEqual(audited['metrics'][0]['matched'], 1)
        self.assertNotIn('precision', audited['metrics'][0])
        self.assertNotIn('recall', audited['metrics'][0])
        self.assertEqual(audited['metrics'][0]['precision_recall_omission'], 'assignment_conditioned_sampling')
        self.assertEqual(audited['musical_sync'], 'unverified')
        self.write(self.manifest['game_stem'], pulses([.53]))
        changed = self.measure()
        rejected = audit_local_evidence(None, [], [], attack=changed, labels={'sets': [annotation]})
        self.assertEqual(rejected['metrics'], [])
        self.assertEqual(rejected['rejected_label_sets'][0]['reason'], 'source_identity_mismatch_or_missing')

    def test_renderer_source_provenance_separate_from_actual_stem(self):
        identity = {'schema':'file-content/v1', 'sha256':'b'*64, 'size_bytes': 123}
        self.manifest['media_content_identities'] = {'selected-source.mp4': identity}
        self.manifest['media_identity_binding'] = {'schema':'render-media-binding/v1', 'status':'checked_before_after'}
        first = self.measure()
        self.assertEqual(first['source_media_provenance']['status'], 'supplied_render_binding')
        self.manifest['media_content_identities']['selected-source.mp4']['sha256'] = 'c'*64
        second = self.measure()
        self.assertNotEqual(first['source_media_provenance'], second['source_media_provenance'])
        self.assertEqual(first['source_identities'], second['source_identities'])


if __name__ == '__main__':
    unittest.main()
