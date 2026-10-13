import copy
import json
import unittest
from aive.calibration_report import audit_local_evidence, MAX_RECORDS


def fixture():
    source = dict(id='arbitrary-source', file_identity={'path': 'X:/not-reflections.mp4', 'size_bytes': 123, 'mtime_ns': 456})
    firing = dict(schema_version='firing-map/v1', sources=[source], candidate_events=[
        dict(source=source['id'], time=1., confirmed=False),
        dict(source=source['id'], time=2., confirmed=True)], candidate_windows=[dict(outcome='unknown')])
    icons = {'records': [dict(source=source['id'], source_visual_event=1.1, confirmed=False)]}
    hits = {'maps': [dict(schema_version='hit-map/v1', song_sha256='b'*64,
                         candidates=[dict(id='hit-1', time=4., confirmed=False)])]}
    return firing, icons, hits


def label(kind='firing', times=(1.01, 3.), complete=True):
    firing, _, _ = fixture()
    return dict(kind=kind, source='arbitrary-source', source_identity=firing['sources'][0]['file_identity'],
                method='blind manual audio annotation', label_origin='independent_audio_review',
                coverage=[[0., 5.]], complete=complete, events=[{'time': t} for t in times])


class CalibrationTests(unittest.TestCase):
    def audit(self, labels=None, **kwargs):
        return audit_local_evidence(*fixture(), labels=labels, **kwargs)

    def test_no_labels_no_metrics_or_promotions(self):
        result = self.audit()
        self.assertEqual(result['schema_version'], 'calibration-report/v1')
        self.assertEqual(result['status'], 'unverified')
        self.assertEqual(result['metrics'], [])
        self.assertEqual(result['coverage']['firing']['supplied_confirmed'], 1)
        self.assertEqual(result['coverage']['firing']['candidate_or_unconfirmed'], 1)
        self.assertEqual(result['omissions']['unknown_window_fight'], 1)
        self.assertEqual(result['omissions']['unknown_window_outcome'], 1)
        self.assertEqual(result['omissions']['sources_without_scene_cut_review'], 1)
        self.assertNotIn('alignment_verified', result)
        json.dumps(result, allow_nan=False)

    def test_independent_complete_metrics_and_arbitrary_identity(self):
        metric = self.audit({'sets': [label()]})['metrics'][0]
        self.assertEqual((metric['matched'], metric['unmatched_predictions'], metric['unmatched_labels']), (1, 1, 1))
        self.assertEqual((metric['precision'], metric['recall']), (.5, .5))
        self.assertAlmostEqual(metric['mean_absolute_error_ms'], 10.)
        self.assertEqual(self.audit({'sets': [label()]})['musical_sync'], 'unverified')

    def test_partial_only_timing_no_precision_recall(self):
        metric = self.audit({'sets': [label(times=(1.,), complete=False)]})['metrics'][0]
        self.assertEqual(metric['matched'], 1)
        self.assertNotIn('precision', metric)
        self.assertEqual(metric['precision_recall_omission'], 'partial_labels')

    def test_empty_labels_are_not_perfect_success(self):
        self.assertEqual(self.audit({'sets': []})['metrics'], [])
        metric = self.audit({'sets': [label(times=())]})['metrics'][0]
        self.assertEqual(metric['precision'], 0.)
        self.assertIsNone(metric['recall'])
        self.assertIsNone(metric['mean_absolute_error_ms'])

    def test_wrong_identity_missing_method_and_circular_rejected(self):
        for key, value in [('source_identity', {'path': 'wrong'}), ('source', 'other'),
                           ('method', ''), ('label_origin', 'planned_clock'),
                           ('method', 'planner expected_clock'), ('source_identity', {})]:
            with self.subTest(key=key, value=value):
                item = label()
                item[key] = value
                result = self.audit({'sets': [item]})
                self.assertEqual(result['metrics'], [])
                self.assertEqual(len(result['rejected_label_sets']), 1)

    def test_ambiguous_matching_never_greedily_assigns(self):
        firing, icons, hits = fixture()
        firing['candidate_events'].append(dict(source='arbitrary-source', time=1.02))
        result = audit_local_evidence(firing, icons, hits, labels={'sets': [label(times=(1.,))]})
        metric = result['metrics'][0]
        self.assertEqual(metric['matched'], 0)
        self.assertEqual(metric['ambiguous_predictions'], 2)
        self.assertEqual(metric['ambiguous_labels'], 1)
        self.assertNotIn('precision', metric)

    def test_duplicate_labels_ambiguous_and_scopes_rejected(self):
        metric = self.audit({'sets': [label(times=(1., 1.))]})['metrics'][0]
        self.assertEqual(metric['ambiguous_labels'], 2)
        result = self.audit({'sets': [label(), label()]})
        self.assertEqual(len(result['metrics']), 1)
        self.assertEqual(result['rejected_label_sets'][0]['reason'], 'duplicate_label_scope')

    def test_coverage_rejects_missing_overlap_bad_time(self):
        for coverage in (None, [], [[0, 4], [3, 5]], [[0, 0]], [[0, 90000]]):
            item = label()
            item['coverage'] = coverage
            self.assertFalse(self.audit({'sets': [item]})['metrics'])
        item = label(times=(6.,))
        self.assertFalse(self.audit({'sets': [item]})['metrics'])

    def test_music_identity_and_repeated_maps(self):
        firing, icons, hits = fixture()
        hits['maps'].append(copy.deepcopy(hits['maps'][0]))
        item = label(kind='music', times=(4.,))
        item.update(source='b'*64, source_identity={'song_sha256': 'b'*64})
        result = audit_local_evidence(firing, icons, hits, labels={'sets': [item]})
        self.assertEqual(result['metrics'][0]['precision'], 1.)
        self.assertEqual(result['omissions']['duplicate_music_candidates'], 1)

    def test_unresolved_attacks_and_no_clock_calibration(self):
        rows = [dict(game_attack={'status': 'measured', 'time': 1.}, music_attack={
            'status': 'unmeasurable', 'diagnostics': {'peaks': [{'reasons': ['high_sustained_baseline']}]}}),
            dict(game_attack={'status': 'ambiguous'}, music_attack={'status': 'ambiguous'}), {}]
        attack = {'assignments': rows}
        plan = {'timeline': [{}, {}], 'rhythm_assignments': [{}, {}, {}, {}], 'omitted_encounters': [{}]}
        result = self.audit(attack=attack, plan=plan)
        self.assertEqual(result['coverage']['attack']['game_attack'],
                         dict(measured=1, ambiguous=1, unmeasurable=0, missing=1))
        self.assertEqual(result['omissions']['layered_music_unmeasurable_proxy'], 1)
        self.assertEqual(result['omissions']['unknown_clip_fight'], 2)
        self.assertEqual(result['omissions']['plan_assignments_without_attack'], 1)
        item = label(kind='game_attack', times=(1.,))
        item.update(source='game_stem', source_identity={'sha256': 'stem'})
        self.assertFalse(self.audit(attack=attack, labels={'sets': [item]})['metrics'])
        attack['source_identities'] = {'game': {'sha256': 'stem'}}
        self.assertFalse(self.audit(attack=attack, labels={'sets': [item]})['metrics'])
        identity = {'schema': 'file-content/v1', 'sha256': 'c'*64, 'size_bytes': 1000}
        attack['source_identities']['game'] = identity
        item['source_identity'] = identity
        attack['stem_identity_evidence'] = {'game': {'status': 'checked_before_after', 'identity': identity,
            'clock': 'output_seconds_from_first_decoded_sample', 'decoded_end': 5., 'decoded_pcm_sha256': 'd'*64}}
        self.assertEqual(self.audit(attack=attack, labels={'sets': [item]})['metrics'][0]['matched'], 1)

    def test_attack_labels_require_content_evidence_and_decoded_coverage(self):
        identity = {'schema': 'file-content/v1', 'sha256': 'e'*64, 'size_bytes': 2000}
        attack = {'assignments': [{'game_attack': {'status': 'measured', 'time': 1.}}],
                  'source_identities': {'game': identity},
                  'stem_identity_evidence': {'game': {'status': 'checked_before_after', 'identity': identity,
                      'clock': 'output_seconds_from_first_decoded_sample', 'decoded_end': 5.,
                      'decoded_pcm_sha256': 'f'*64}}}
        item = label(kind='game_attack', times=(1.,))
        item.update(source='game_stem', source_identity=identity)
        good = self.audit(attack=attack, labels={'sets': [item]})
        self.assertEqual(good['metrics'][0]['matched'], 1)
        self.assertEqual(good['omissions']['attack_stems_without_content_binding'], 1)
        self.assertEqual(good['musical_sync'], 'unverified')
        for key, value in [('status', 'unavailable'), ('identity', {'sha256': 'bad'}),
                           ('clock', 'song_source'), ('decoded_pcm_sha256', 'not-a-hash')]:
            changed = copy.deepcopy(attack)
            changed['stem_identity_evidence']['game'][key] = value
            self.assertFalse(self.audit(attack=changed, labels={'sets': [item]})['metrics'])
        stale = copy.deepcopy(item)
        stale['source_identity']['sha256'] = 'a'*64
        # Deepcopy item so the original shared identity is not changed.
        self.assertFalse(self.audit(attack=attack, labels={'sets': [stale]})['metrics'])
        outside = copy.deepcopy(item)
        outside['coverage'] = [[0., 5.1]]
        result = self.audit(attack=attack, labels={'sets': [outside]})
        self.assertEqual(result['rejected_label_sets'][0]['reason'], 'coverage_outside_decoded_stem')

    def test_no_mutation_and_bounds_nonfinite(self):
        inputs = list(fixture()) + [None, None, {'sets': [label()]}]
        before = copy.deepcopy(inputs)
        audit_local_evidence(*inputs)
        self.assertEqual(inputs, before)
        for value in (float('nan'), float('inf'), -float('inf')):
            firing, icons, hits = fixture()
            firing['candidate_events'][0]['time'] = value
            with self.assertRaises(ValueError):
                audit_local_evidence(firing, icons, hits)
        with self.assertRaises(ValueError):
            self.audit(labels={'sets': [{}]*(MAX_RECORDS + 1)})
        firing, icons, hits = fixture()
        firing['candidate_events'][0]['time'] = -1
        self.assertEqual(audit_local_evidence(firing, icons, hits)['omissions']['invalid_prediction_times'], {'firing': 1})

    def test_missing_attack_indices_not_hidden_by_equal_count(self):
        result = self.audit(plan={'rhythm_assignments': [{}, {}]},
                            attack={'assignments': [{'assignment_index': 0}, {'assignment_index': 0}]})
        self.assertEqual(result['omissions']['plan_assignments_without_attack'], 1)
        self.assertEqual(result['omissions']['duplicate_attack_assignment_indices'], 1)

    def test_circular_clock_fields_and_malformed_identity_rejected(self):
        item = label(times=(1.,))
        item['events'][0]['expected_time'] = 1.
        self.assertFalse(self.audit({'sets': [item]})['metrics'])
        item = label()
        item['source'] = {}
        self.assertFalse(self.audit({'sets': [item]})['metrics'])
        item = label()
        del item['events']
        self.assertFalse(self.audit({'sets': [item]})['metrics'])

    def test_invalid_predictions_withhold_precision_recall(self):
        firing, icons, hits = fixture()
        firing['candidate_events'][0]['time'] = 90001
        metric = audit_local_evidence(firing, icons, hits, labels={'sets': [label()]})['metrics'][0]
        self.assertNotIn('precision', metric)
        self.assertEqual(metric['precision_recall_omission'], 'invalid_prediction_times')

    def test_empty_inputs_and_bad_schema(self):
        self.assertEqual(audit_local_evidence(None, [], [])['status'], 'unverified')
        with self.assertRaises(ValueError):
            audit_local_evidence({'schema_version': 'other'}, [], [])


if __name__ == '__main__':
    unittest.main()
