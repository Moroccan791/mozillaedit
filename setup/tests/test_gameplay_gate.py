"""Synthetic contract tests only; no real-media kill certification."""
import copy
import hashlib
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from aive.gameplay_gate import (capture_source_identity,
    validate_reviewed_gameplay_gate, MAX_SOURCE_BYTES, MAX_TOTAL_BYTES,
    MAX_SOURCES, MAX_WINDOWS, MAX_PROVENANCE, MAX_TEXT)


def reviewed(path):
    identity = capture_source_identity(path)
    source = dict(id='game', duration=60., **identity)
    window = dict(id='kill-1', source='game', source_start=.5, source_end=2.5,
        confirmed=True, content_sha256=identity['content_sha256'],
        provenance=[dict(reviewer='test reviewer', method='human_audio_visual_review',
                         reference='synthetic-review-1')],
        music_review=dict(status='reviewed', classification='background_music',
            source_start=.5, source_end=2.5, audio_reference='source audio .5-2.5',
            notes='Synthetic claim: music distinguished from the firearm attack.'),
        firing_review=dict(status='reviewed', origin='local_player', instrument='firearm',
            audio_attack_interval=[.99, 1.02], visual_attack_interval=[1., 1.04],
            source_audio_event=1., source_visual_event=1.01,
            audio_reference='source audio .99-1.02', visual_reference='muzzle/ammo frames 1-1.04',
            notes='Synthetic claim: matching local firearm audio and visible firing.'),
        pov_review=dict(status='reviewed', perspective='first_person', actor='local_player',
            alive=True, source_start=.5, source_end=2.5, visual_reference='HUD .5-2.5',
            notes='Synthetic claim: local player alive for entire requested window.'),
        outcome_review=dict(status='reviewed', outcome='kill', actor='local_player',
            mechanism='firearm', visual_interval=[1.03, 1.4], source_visual_event=1.2,
            visual_reference='local kill HUD 1.03-1.4',
            notes='Synthetic claim: reviewed firearm firing caused this local POV kill.'),
        context_review=dict(status='reviewed', category='live_round',
            source_start=.5, source_end=2.5, menu=False, ability_only=False, dead=False,
            warmup=False, post_round=False, unresolved=False,
            visual_reference='continuous context .5-2.5',
            notes='Synthetic claim: all frames inspected; no excluded context.'))
    return dict(schema_version='gameplay-gate/v1', mode='reviewed', sources=[source], windows=[window])


class GateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / 'source.mp4'
        self.path.write_bytes(b'synthetic-source-not-real-video')
        self.paths = {'game': self.path}

    def gate(self, data, **kwargs):
        return validate_reviewed_gameplay_gate(data, source_paths=self.paths, **kwargs)

    def reject(self, mutate, **kwargs):
        data = reviewed(self.path)
        mutate(data)
        before = copy.deepcopy(data)
        with self.assertRaises(ValueError):
            self.gate(data, **kwargs)
        self.assertEqual(data, before)

    def test_success_returns_original_and_preserves_inputs(self):
        data = reviewed(self.path)
        before, paths, content = copy.deepcopy(data), dict(self.paths), self.path.read_bytes()
        self.assertIs(self.gate(data), data)
        self.assertEqual(data, before)
        self.assertEqual(self.paths, paths)
        self.assertEqual(self.path.read_bytes(), content)

    def test_music_absent_also_requires_firing(self):
        data = reviewed(self.path)
        data['windows'][0]['music_review']['classification'] = 'absent'
        self.assertIs(self.gate(data), data)
        del data['windows'][0]['firing_review']
        with self.assertRaises(ValueError): self.gate(data)

    def test_every_required_root_source_window_field(self):
        base = reviewed(self.path)
        for location in ('root', 'source', 'window'):
            target = base if location == 'root' else base[{'source': 'sources', 'window': 'windows'}[location]][0]
            for key in target:
                with self.subTest(location=location, key=key):
                    def remove(d):
                        dest = d if location == 'root' else d[{'source': 'sources', 'window': 'windows'}[location]][0]
                        del dest[key]
                    self.reject(remove)

    def test_every_required_review_field_and_unreviewed_status(self):
        for name in ('music_review', 'firing_review', 'pov_review', 'outcome_review', 'context_review'):
            for key in reviewed(self.path)['windows'][0][name]:
                with self.subTest(review=name, field=key):
                    self.reject(lambda d: d['windows'][0][name].pop(key))
            for status in ('unreviewed', 'candidate', 'unknown', True, None):
                with self.subTest(review=name, status=status):
                    self.reject(lambda d: d['windows'][0][name].update(status=status))
            self.reject(lambda d: d['windows'][0][name].update(notes=' '))

    def test_all_excluded_contexts_and_strict_booleans(self):
        for flag in ('menu', 'ability_only', 'dead', 'warmup', 'post_round', 'unresolved'):
            for value in (True, 0, None, 'false'):
                with self.subTest(flag=flag, value=value):
                    self.reject(lambda d: d['windows'][0]['context_review'].update({flag: value}))
        for category in ('menu', 'warmup', 'post_round', 'unknown', 'death', 'practice'):
            self.reject(lambda d: d['windows'][0]['context_review'].update(category=category))

    def test_unresolved_non_kill_and_other_actor_outcomes(self):
        for value in ('unknown', 'shot', 'no_kill', 'death', 'unresolved', 'non_gameplay', 'assist'):
            self.reject(lambda d: d['windows'][0]['outcome_review'].update(outcome=value))
        for key, values in (('actor', ('teammate', 'enemy', 'unknown')), ('mechanism', ('ability', 'unknown'))):
            for value in values:
                self.reject(lambda d: d['windows'][0]['outcome_review'].update({key: value}))

    def test_explicit_firing_music_and_pov_not_detector_scores(self):
        mutations = [lambda w: w['firing_review'].update(instrument='ability'),
            lambda w: w['firing_review'].update(origin='enemy'),
            lambda w: w['music_review'].update(classification='music_only'),
            lambda w: w['music_review'].update(classification='unknown'),
            lambda w: w['pov_review'].update(perspective='spectator'),
            lambda w: w['pov_review'].update(actor='teammate'),
            lambda w: w['pov_review'].update(alive=False),
            lambda w: w['pov_review'].update(alive=1),
            lambda w: w.update(confirmed=1), lambda w: w.update(confirmed=False),
            lambda w: w['provenance'][0].update(method='pov_icon_temporal+nearby_audio'),
            lambda w: w['provenance'][0].update(reviewer=''),
            lambda w: w['provenance'][0].update(reference=''),
            lambda w: w.update(provenance=[])]
        for i, mutate in enumerate(mutations):
            with self.subTest(i=i): self.reject(lambda d: mutate(d['windows'][0]))

    def test_all_audio_visual_references_required(self):
        for name, fields in (('music_review', ['audio_reference']),
            ('firing_review', ['audio_reference', 'visual_reference']),
            ('pov_review', ['visual_reference']), ('outcome_review', ['visual_reference']),
            ('context_review', ['visual_reference'])):
            for key in fields:
                self.reject(lambda d: d['windows'][0][name].update({key: ''}))

    def test_candidates_extra_fields_and_legacy_wrappers_fail(self):
        for mode in ('candidate', 'unreviewed', None):
            self.reject(lambda d: d.update(mode=mode))
        for schema in ('firing-map/v1', 'povkills/v1', 'visual-gate/v1'):
            self.reject(lambda d: d.update(schema_version=schema))
        self.reject(lambda d: d.update(candidate_events=[]))
        self.reject(lambda d: d['windows'][0].update(confidence=.99))
        for raw in ([], {}, None, [dict(confirmed=True, source_audio_event=1.)]):
            with self.assertRaises(ValueError): self.gate(raw)

    def test_full_window_context_pov_music_coverage(self):
        for name in ('context_review', 'pov_review', 'music_review'):
            self.reject(lambda d: d['windows'][0][name].update(source_start=.6))
            self.reject(lambda d: d['windows'][0][name].update(source_end=2.4))
            self.reject(lambda d: d['windows'][0][name].update(source_end=31.))
        self.reject(lambda d: d['windows'][0].update(source_end=3.))

    def test_timestamps_and_firing_outcome_order(self):
        for value in (True, float('nan'), float('inf'), -1., 61., 10**1000):
            with self.subTest(value=value):
                self.reject(lambda d: d['windows'][0]['firing_review'].update(source_audio_event=value))
        for interval in ([1.1, 1.], [1., 1.], [.4, 1.], [1., 2.6], [1.], '1,2'):
            self.reject(lambda d: d['windows'][0]['firing_review'].update(audio_attack_interval=interval))
        self.reject(lambda d: d['windows'][0]['outcome_review'].update(source_visual_event=2.))
        self.reject(lambda d: d['windows'][0]['outcome_review'].update(visual_interval=[.7, .9], source_visual_event=.8))
        self.reject(lambda d: d['sources'][0].update(duration=2.))
        self.reject(lambda d: d['windows'][0].update(source_start=2.5))

    def test_duplicates_unknown_unused_sources(self):
        self.reject(lambda d: d['windows'].append(copy.deepcopy(d['windows'][0])))
        self.reject(lambda d: d['sources'].append(copy.deepcopy(d['sources'][0])))
        self.reject(lambda d: d['windows'][0].update(source='elsewhere'))
        data = reviewed(self.path)
        extra = dict(data['sources'][0], id='unused'); data['sources'].append(extra)
        with self.assertRaisesRegex(ValueError, 'unused'):
            validate_reviewed_gameplay_gate(data, source_paths=dict(self.paths, unused=self.path))

    def test_source_paths_mandatory_and_exact(self):
        data = reviewed(self.path)
        with self.assertRaises(TypeError): validate_reviewed_gameplay_gate(data)
        for paths in ({}, {'game': self.path, 'extra': self.path}, {'game': ''}, {'game': None}):
            with self.assertRaises(ValueError): validate_reviewed_gameplay_gate(data, source_paths=paths)

    def test_changed_content_same_size_and_restored_mtime_rejected(self):
        data = reviewed(self.path)
        stat = self.path.stat()
        self.path.write_bytes(b'x' * stat.st_size)
        os.utime(self.path, ns=(stat.st_atime_ns, stat.st_mtime_ns))
        self.assertEqual(self.path.stat().st_size, data['sources'][0]['file_identity']['size_bytes'])
        with self.assertRaisesRegex(ValueError, 'content changed'): self.gate(data)

    def test_metadata_not_authentication_or_file_access_authority(self):
        data = reviewed(self.path)
        data['sources'][0]['file_identity'].update(path='nonexistent-review-audit.mp4', mtime_ns=0)
        self.assertIs(self.gate(data), data)
        relocated = Path(self.temp.name) / 'copy.mp4'; relocated.write_bytes(self.path.read_bytes())
        self.assertIs(validate_reviewed_gameplay_gate(data, source_paths={'game': relocated}), data)
        self.reject(lambda d: d['windows'][0].update(content_sha256='b' * 64))
        self.reject(lambda d: d['sources'][0].update(content_sha256='A' * 64))
        self.reject(lambda d: d['sources'][0]['file_identity'].update(size_bytes=1))

    def test_bounds_reject_before_live_hashing(self):
        cases = [lambda d: d.update(windows=[]), lambda d: d.update(sources=[]),
            lambda d: d.update(windows=d['windows'] * (MAX_WINDOWS + 1)),
            lambda d: d.update(sources=d['sources'] * (MAX_SOURCES + 1)),
            lambda d: d['windows'][0].update(source_end=31.),
            lambda d: d['windows'][0].update(provenance=d['windows'][0]['provenance'] * (MAX_PROVENANCE + 1)),
            lambda d: d['windows'][0]['context_review'].update(notes='x' * (MAX_TEXT + 1))]
        for mutate in cases:
            with patch('aive.gameplay_gate.capture_source_identity') as hashed:
                self.reject(mutate)
                hashed.assert_not_called()
        data = reviewed(self.path)
        window = data['windows'][0]
        window.update(source_start=0., source_end=30.)
        for name in ('music_review', 'pov_review', 'context_review'):
            window[name].update(source_start=0., source_end=30.)
        data['windows'] = [dict(copy.deepcopy(window), id=f'kill-{i}') for i in range(21)]
        with patch('aive.gameplay_gate.capture_source_identity') as hashed:
            with self.assertRaisesRegex(ValueError, 'total reviewed seconds'): self.gate(data)
            hashed.assert_not_called()

    def test_byte_budgets_cannot_be_increased_or_bypassed(self):
        for kwargs in ({'max_source_bytes': True}, {'max_source_bytes': MAX_SOURCE_BYTES+1},
            {'max_total_bytes': 0}, {'max_total_bytes': MAX_TOTAL_BYTES+1},
            {'max_source_bytes': self.path.stat().st_size-1},
            {'max_total_bytes': self.path.stat().st_size-1}):
            data = reviewed(self.path)
            with patch('aive.gameplay_gate.capture_source_identity') as hashed:
                with self.assertRaises(ValueError): self.gate(data, **kwargs)
                hashed.assert_not_called()

    def test_live_identity_never_cached_and_missing_file_rejected(self):
        data = reviewed(self.path)
        self.assertIs(self.gate(data), data)
        self.path.write_bytes(b'z' * self.path.stat().st_size)
        with self.assertRaisesRegex(ValueError, 'content changed'): self.gate(data)
        self.path.unlink()
        with self.assertRaisesRegex(ValueError, 'unavailable'): self.gate(data)

    def test_all_or_nothing_mixed_unsafe_window(self):
        data = reviewed(self.path)
        other = copy.deepcopy(data['windows'][0]); other['id'] = 'unsafe'
        other['context_review']['dead'] = True
        data['windows'].append(other)
        before = copy.deepcopy(data)
        with self.assertRaises(ValueError): self.gate(data)
        self.assertEqual(data, before)

    def test_multiple_sources_hash_every_source_and_sum_budget(self):
        data = reviewed(self.path)
        other = Path(self.temp.name) / 'other.mp4'; other.write_bytes(b'another-source')
        data['sources'].append(dict(id='other', duration=60., **capture_source_identity(other)))
        window = copy.deepcopy(data['windows'][0])
        window.update(id='other-kill', source='other', content_sha256=data['sources'][1]['content_sha256'])
        data['windows'].append(window)
        paths = dict(self.paths, other=other)
        total = self.path.stat().st_size + other.stat().st_size
        self.assertIs(validate_reviewed_gameplay_gate(data, source_paths=paths, max_total_bytes=total), data)
        with patch('aive.gameplay_gate.capture_source_identity') as hashed:
            with self.assertRaisesRegex(ValueError, 'total source byte'):
                validate_reviewed_gameplay_gate(data, source_paths=paths, max_total_bytes=total-1)
            hashed.assert_not_called()
        other.write_bytes(b'x' * other.stat().st_size)
        with self.assertRaisesRegex(ValueError, 'content changed'):
            validate_reviewed_gameplay_gate(data, source_paths=paths)


class IdentityTests(unittest.TestCase):
    def test_hash_and_limits(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'file'; path.write_bytes(b'abcd')
            identity = capture_source_identity(path, max_source_bytes=4)
            self.assertEqual(identity['content_sha256'], hashlib.sha256(b'abcd').hexdigest())
            self.assertEqual(identity['file_identity']['size_bytes'], 4)
            self.assertEqual(identity['file_identity']['path'], str(path.resolve()))
            for target in (Path(temp), Path(temp)/'missing', ''):
                with self.assertRaises(ValueError): capture_source_identity(target)
            with self.assertRaises(ValueError): capture_source_identity(path, max_source_bytes=3)
            path.write_bytes(b'')
            with self.assertRaises(ValueError): capture_source_identity(path)

    def test_detects_change_during_hashing(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'file'; path.write_bytes(b'abcd')
            real_sha = hashlib.sha256
            class ChangingDigest:
                def __init__(self): self.digest = real_sha()
                def update(self, block):
                    self.digest.update(block)
                    with path.open('ab') as out: out.write(b'x')
                def hexdigest(self): return self.digest.hexdigest()
            with patch('aive.gameplay_gate.hashlib.sha256', ChangingDigest):
                with self.assertRaisesRegex(ValueError, 'changed|budget'):
                    capture_source_identity(path, max_source_bytes=4)


if __name__ == '__main__':
    unittest.main()
