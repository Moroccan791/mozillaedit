"""Synthetic local evidence only, never calibrated gameplay/music labels."""
import copy
import json
import time
from pathlib import Path
import unittest
from unittest.mock import patch

from aive.attack_qa import EvidenceError, _candidate, measure_attack_alignment
from aive.encounter_render import RenderConfig, validate_plan
import aive.local_authored_planner as local_planner
from aive.local_authored_planner import plan_local_authored


def fixtures(count=12):
    source = str(Path("local-source.mp4").resolve())
    roots, icons = [], []
    for i in range(count):
        t = 10.+i*10.
        roots.append(dict(id=f"root-{i}", source=source, time=t, attack_interval=[t-.02, t+.04],
                          strength=.8+i*.005, confirmed=False, type="audio_transient",
                          origin="unknown", instrument="unknown", evidence={"method": "existing-synthetic"}))
        # Secondary attacks must survive selection, even if not assigned.
        roots.append(dict(id=f"secondary-{i}", source=source, time=t+.3,
                          attack_interval=[t+.28,t+.34], strength=.6, confirmed=False,
                          type="audio_transient", origin="unknown", instrument="unknown"))
        icons.append(dict(source=source, source_audio_event=t, source_visual_event=t+.08,
                          confidence=.85, confidence_kind="template_cosine_not_probability",
                          confirmed=False, profile="povkills-v1", status="candidate",
                          evidence=dict(persistence=2, template="existing-template", audio_delta=-.08,
                                        calibrated_profile=False)))
    fmap = dict(schema_version="firing-map/v1", source=source, source_duration=200.,
                sources=[dict(id=source, duration=200., analyzed_start=0., analyzed_end=200.)],
                candidate_events=roots, candidate_windows=[])  # ROOT, not preselected windows
    maps = []
    for start in (8.,18.,28.,38.):
        end = min(43.,start+12.)
        hits = []
        for i in range(count):
            t = 9.3+i*2.9
            if start <= t <= end:
                hits.append(dict(id=f"hit-{i}", time=t+.03, refined_time=t,
                                 refined_interval=[max(start,t-.01),min(end,t+.01)], strength=.9,
                                 preview_eligible=True, confirmed=False))
        maps.append(dict(schema_version="hit-map/v1", song_sha256="a"*64,
                         excerpt=dict(start=start,duration=end-start,end=end), candidates=hits))
    return fmap, icons, maps


class LocalAuthoredPlannerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = fixtures()
        cls.plan = plan_local_authored(*cls.data)

    def test_35s_at_least_ten_events_exact_clocks_and_full_root_set(self):
        p = self.plan
        self.assertEqual(p["status"], "candidate", p.get("blocked_reason"))
        self.assertAlmostEqual(p["duration"],35.)
        self.assertGreaterEqual(len(p["timeline"]),10)
        self.assertLessEqual(len(p["timeline"]),20)
        normalized = validate_plan(p,RenderConfig(style="authored-footage",fps=60),
                                   source_durations={self.data[0]["source"]:200.})
        self.assertEqual(sum(r["frame_count"] for r in normalized),2100)
        used, targets, cursor = set(),set(),0.
        for row, match in zip(p["timeline"],p["rhythm_assignments"]):
            a,b = row["source_start"],row["source_end"]
            self.assertGreaterEqual(b-a,2.-1e-7)
            self.assertLessEqual(b-a,5.+1e-7)
            self.assertEqual(row["speed"],1.)
            self.assertEqual(row["events"],[])
            self.assertAlmostEqual(row["output_start"],cursor)
            self.assertAlmostEqual(row["output_end"]-cursor,b-a)
            self.assertAlmostEqual(a,match["source_audio_event"]-(match["hit_time"]-8-cursor))
            self.assertAlmostEqual(match["output_audio_event"]+8,match["hit_time"])
            self.assertGreaterEqual(match["source_audio_event"]-a,.6-1e-7)
            self.assertGreaterEqual(b-match["source_audio_event"],.8-1e-7)
            expected = {e["id"] for e in self.data[0]["candidate_events"] if a <= e["time"] <= b}
            self.assertEqual({e["id"] for e in row["candidate_events"]},expected)
            self.assertFalse(used & expected)
            used |= expected
            self.assertNotIn(match["hit_time"],targets)
            targets.add(match["hit_time"])
            for e in row["candidate_events"]:
                self.assertFalse(e["confirmed"])
                self.assertAlmostEqual(e["output_audio_event"],cursor+e["time"]-a)
                self.assertGreaterEqual(e["attack_interval"][0],a)
                self.assertLessEqual(e["attack_interval"][1],b)
            cursor = row["output_end"]
        for i,left in enumerate(p["timeline"]):
            for right in p["timeline"][i+1:]:
                self.assertFalse(left["source_start"] < right["source_end"]-1e-7 and
                                 left["source_end"] > right["source_start"]+1e-7)
        first = p["timeline"][0]
        self.assertGreaterEqual(p["rhythm_assignments"][0]["source_audio_event"]-first["source_start"],.7)

    def test_assignments_satisfy_attack_qa_contract_without_promoting_candidates(self):
        p = self.plan
        for row, match in zip(p['timeline'], p['rhythm_assignments']):
            event, output = _candidate(p, match)
            self.assertEqual(event['id'], row['main_candidate_id'])
            self.assertEqual(match['event_id'], match['candidate_id'])
            self.assertEqual(match['source_time'], match['source_audio_event'])
            self.assertEqual(output, match['output_audio_event'])
            self.assertEqual(match['music_hit_id'], match['hit_id'])
            self.assertEqual(match['music_time'], match['hit_time'])
            self.assertEqual(match['music_interval'], match['refined_interval'])
            self.assertFalse(event['confirmed'])
            self.assertFalse(match['confirmed'])
        # Exercise real QA normalization, deliberately withholding PCM evidence.
        # Missing audio must warn, but every assignment must reach measurement.
        manifest = dict(audio_duration=p['duration'], config=dict(sample_rate=48000),
                        music_start_sample=384000)
        with patch('aive.attack_qa._decode', side_effect=EvidenceError('synthetic evidence withheld')) as decode:
            report = measure_attack_alignment(manifest, p)
        self.assertEqual(decode.call_count, 2)
        self.assertEqual(report['issues'], [])
        self.assertEqual(len(report['assignments']), len(p['rhythm_assignments']))
        self.assertTrue(all(r['game_attack'] is not None and r['music_attack'] is not None
                            for r in report['assignments']))
        self.assertTrue(all(r['detail'] == 'independent attacks missing or ambiguous'
                            for r in report['assignments']))
        self.assertEqual(report['status'], 'warn')
        self.assertEqual(report['musical_sync'], 'unverified')
        legacy = copy.deepcopy(p['rhythm_assignments'][0])
        legacy.pop('event_id')
        with self.assertRaisesRegex(ValueError, 'nonempty shot event_id'):
            _candidate(p, legacy)

    def test_effect_safe_partial_sequences_survive_bounded_beam_pruning(self):
        data = json.loads((Path(__file__).parent/'fixtures'/'local_beam_unconfirmed.json').read_text())
        source = str(Path('beam-regression-source.mp4').resolve())
        roots = [dict(e, source=source) for e in data['candidate_events']]
        icons = [dict(e, source=source) for e in data['icons']]
        duration = data['source_duration']
        firing = dict(schema_version='firing-map/v1', source=source,
                      source_duration=duration, candidate_events=roots, candidate_windows=[],
                      sources=[dict(id=source, duration=duration, analyzed_start=0., analyzed_end=duration)])
        p = plan_local_authored(firing, icons, data['hit_maps'])
        self.assertEqual(p['status'], 'candidate', p.get('blocked_reason'))
        self.assertGreaterEqual(p['duration'], 30.)
        self.assertLessEqual(p['duration'], 35.)
        self.assertEqual(p['local_selection_evidence']['beam_width'], 24)
        self.assertEqual(p['local_selection_evidence']['max_beam_options'], 1024)
        self.assertTrue(p['authored_design']['bridges'])
        self.assertGreaterEqual(p['authored_design']['ending']['fade_frames'], 2)
        validate_plan(p, RenderConfig(style='authored-footage', fps=60),
                      source_durations={source: duration})
        for row, assignment in zip(p['timeline'], p['rhythm_assignments']):
            expected = {e['id'] for e in roots if row['source_start'] <= e['time'] <= row['source_end']}
            self.assertEqual({e['id'] for e in row['candidate_events']}, expected)
            self.assertTrue(all(e['confirmed'] is False for e in row['candidate_events']))
            self.assertFalse(assignment['confirmed'])
            _candidate(p, assignment)
        self.assertEqual(p['review_status'], 'unreviewed')

    def test_actual_early_pre_cap_keeps_lower_scoring_effect_safe_options(self):
        # Thirty-two distinct associated roots exercise the REAL >2*1024
        # pre-cap, not a reduced monkeypatched budget or invented design result.
        # Strong long attack tails are intact but leave poor edge/fade room;
        # weaker short tails supply real safe alternatives below score-only cap.
        f, icons, hits = fixtures(32)
        f['source_duration'] = 400.
        f['sources'][0].update(duration=400., analyzed_end=400.)
        for j in range(32):
            f['candidate_events'][2*j]['strength'] = .99 if j < 20 else .5
            if j < 20:
                t = f['candidate_events'][2*j]['time']
                f['candidate_events'][2*j+1].update(attack_interval=[t+.28, t+2.6])
        before = copy.deepcopy((f, icons, hits))
        rank, design = local_planner._rank_states, local_planner._design
        caps = []

        def safe(state):
            return len(state[2]) >= 2 and design(state[2], state[3], 60) is not None

        def traced(options, target, fps, limit=None):
            if limit is None:
                return rank(options, target, fps)
            self.assertEqual(limit, 1024)
            self.assertGreater(len(options), 2048)
            legacy = sorted(options, key=lambda s: -(s[0]-.22*abs(s[1]-target)))[:limit]
            safe_available = sum(safe(s) for s in options)
            ranked = rank(options, target, fps, limit)
            self.assertEqual(len(ranked), limit)
            retained_safe = sum(safe(s) for s in ranked)
            self.assertEqual(retained_safe, min(limit, safe_available))
            caps.append((sum(safe(s) for s in legacy), retained_safe))
            return ranked

        started = time.perf_counter()
        with patch.object(local_planner, '_rank_states', side_effect=traced), \
             patch.object(local_planner, '_design', wraps=design) as design_calls:
            p = plan_local_authored(f, icons, hits)
        elapsed = time.perf_counter()-started
        self.assertTrue(caps, 'fixture must activate the actual earlier pre-cap')
        self.assertTrue(any(old < new for old, new in caps), caps)
        evidence = p['local_selection_evidence']
        self.assertEqual(evidence['pre_cap_prunings'], len(caps))
        self.assertEqual(evidence['max_beam_options'], 1024)
        self.assertEqual(evidence['beam_width'], 24)
        self.assertGreater(evidence['max_ranked_options'], 2048)
        # Deterministic work bounds plus a generous laptop regression ceiling.
        self.assertLess(evidence['max_ranked_options'], 5000)
        self.assertLess(evidence['ranked_options'], 60000)
        self.assertLess(design_calls.call_count, 60000)
        self.assertLess(elapsed, 45., f'bounded synthetic search took {elapsed:.3f}s')
        self.assertEqual(p['status'], 'candidate', p.get('blocked_reason'))
        self.assertEqual((f, icons, hits), before)
        self.assertEqual(p['review_status'], 'unreviewed')
        self.assertFalse(p['confirmed'])
        self.assertGreaterEqual(p['duration'], 30.)
        self.assertLessEqual(p['duration'], 35.)
        validate_plan(p, RenderConfig(style='authored-footage', fps=60),
                      source_durations={f['source']: 400.})
        for row, assignment in zip(p['timeline'], p['rhythm_assignments']):
            expected = {e['id'] for e in f['candidate_events']
                        if row['source_start'] <= e['time'] <= row['source_end']}
            self.assertEqual({e['id'] for e in row['candidate_events']}, expected)
            self.assertEqual(row['speed'], 1.)
            self.assertTrue(all(e['confirmed'] is False for e in row['candidate_events']))
            self.assertFalse(assignment['confirmed'])
            _candidate(p, assignment)

    def test_design_v2_impacts_match_main_strength_and_sparse_contrast(self):
        p = self.plan
        d = p["authored_design"]
        self.assertEqual(d["schema_version"],"authored-footage/v2")
        roles = [s["role"] for s in d["shots"]]
        self.assertEqual(roles[0],"setup")
        self.assertEqual(roles[-1],"payoff")
        self.assertTrue(1 <= roles.count("contrast") <= 2)
        self.assertIn("impact",roles)
        self.assertEqual(len(d["impacts"]),len(p["timeline"]))
        for impact,match,row in zip(d["impacts"],p["rhythm_assignments"],p["timeline"]):
            self.assertEqual(impact["output_time"],match["output_audio_event"])
            main = next(e for e in row["candidate_events"] if e["id"] == row["main_candidate_id"])
            self.assertAlmostEqual(impact["strength"],main["strength"]*match["hit_strength"])
        # Existing validator checks ALL candidate attack intervals, .18s edge
        # safety, global CFR phase and impact non-overlap, including final fade.
        validate_plan(p,RenderConfig(style="authored-footage",fps=60))

    def test_no_fake_labels_no_input_mutation(self):
        data = fixtures()
        before = copy.deepcopy(data)
        p = plan_local_authored(*data)
        self.assertEqual(data,before)
        def walk(x):
            if isinstance(x,dict):
                for k,v in x.items():
                    if k == "confirmed": self.assertIs(v,False)
                    if k == "outcome": self.assertEqual(v,"unknown")
                    walk(v)
            elif isinstance(x,list):
                for v in x: walk(v)
        walk(p)
        self.assertEqual(p["local_selection_evidence"]["profile_status"],"uncalibrated")
        self.assertEqual(p["review_status"],"unreviewed")
        self.assertNotIn("certification",p)
        json.dumps(p,allow_nan=False)

    def test_sparse_no_eligible_and_source_mismatch_empty_not_forced(self):
        mutations = [lambda f,i,h:i.clear(),
                     lambda f,i,h:[x.update(source=str(Path('other.mp4').resolve())) for x in i],
                     lambda f,i,h:[x.update(source_audio_event=None) for x in i],
                     lambda f,i,h:[x.update(confidence_kind="probability") for x in i],
                     lambda f,i,h:[x['evidence'].update(persistence=1) for x in i],
                     lambda f,i,h:[x.update(source_visual_event=x['source_audio_event']+1.) for x in i],
                     lambda f,i,h:[x.update(preview_eligible=False) for m in h for x in m['candidates']],
                     lambda f,i,h:f['sources'][0].pop('analyzed_end')]
        for mutate in mutations:
            f,i,h = fixtures()
            mutate(f,i,h)
            p = plan_local_authored(f,i,h)
            self.assertEqual(p['status'],'blocked')
            self.assertEqual(p['timeline'],[])
            self.assertEqual(p['duration'],0.)
            self.assertNotIn('authored_design',p)

    def test_invalid_source_nonfinite_sha_and_candidate_wrapper_rejected(self):
        mutations = [lambda f,i,h:f.update(source='relative.mp4'),
                     lambda f,i,h:f['candidate_events'][0].update(time=float('nan')),
                     lambda f,i,h:i[0].update(confidence=float('inf')),
                     lambda f,i,h:h[0]['candidates'][0].update(refined_time=float('nan')),
                     lambda f,i,h:h[1].update(song_sha256='b'*64),
                     lambda f,i,h:f['candidate_events'][0].update(source=str(Path('other.mp4').resolve())),
                     lambda f,i,h:f['candidate_events'][0].update(confirmed=True),
                     lambda f,i,h:f['candidate_events'][0].pop('attack_interval'),
                     lambda f,i,h:f['candidate_events'][0].update(type='kill'),
                     lambda f,i,h:f['candidate_events'][0].update(outcome='kill')]
        for mutate in mutations:
            f,i,h = fixtures()
            mutate(f,i,h)
            with self.assertRaises(ValueError): plan_local_authored(f,i,h)

    def test_dense_windows_omitted_intact_not_truncated(self):
        f,i,h = fixtures(10)
        for n in range(40):
            t=10.+n*.001
            f['candidate_events'].append(dict(id=f'dense-{n}',source=f['source'],time=t,
                attack_interval=[t,t+.0001],strength=.5,confirmed=False))
        p=plan_local_authored(f,i,h)
        self.assertEqual(p['status'],'blocked')
        self.assertTrue(any('dense >32' in x['reason'] for x in p['omitted_encounters']))
        self.assertEqual(p['timeline'],[])

    def test_measured_overlap_dedup_favors_strength_and_refined_actual_clock(self):
        f,i,h = fixtures()
        duplicate = copy.deepcopy(h[0]['candidates'][0])
        duplicate.update(id='stronger-duplicate',refined_time=duplicate['refined_time']+.02,
                         refined_interval=[duplicate['refined_time']+.02,duplicate['refined_time']+.03],strength=1.)
        h[0]['candidates'].append(duplicate)
        p=plan_local_authored(f,i,h)
        self.assertEqual(p['status'],'candidate')
        self.assertEqual(p['local_selection_evidence']['refined_hit_count'],12)
        assigned=p['rhythm_assignments']
        self.assertTrue(all(abs(a['hit_time']-b['hit_time']) >= .08-1e-7
                            for j,a in enumerate(assigned) for b in assigned[j+1:]))
        self.assertNotIn(9.3,[x['hit_time'] for x in assigned])
        self.assertIn(9.32,[round(x['hit_time'],2) for x in assigned])

    def test_unknown_and_long_attack_bounds_are_not_cut(self):
        f,i,h=fixtures(10)
        # The anchor is far outside some proposed ranges, but its long attack
        # interval crosses ALL ten choices. Reject, never drop the hidden tail.
        f['candidate_events'].append(dict(id='long-attack',source=f['source'],time=5.,
            attack_interval=[5.,150.],strength=.1,confirmed=False))
        p=plan_local_authored(f,i,h)
        self.assertEqual(p['status'],'blocked')
        self.assertEqual(p['timeline'],[])
        f,i,h=fixtures()
        h[0]['candidates'][0]['refined_interval']=[9.,10.]
        with self.assertRaises(ValueError):plan_local_authored(f,i,h)

    def test_fps_phase_safety_and_requested_upper_duration(self):
        for fps,duration in ((30,30.),(60,35.),(120,40.)):
            p=plan_local_authored(*fixtures(),fps=fps,duration=duration)
            self.assertEqual(p['status'],'candidate',p.get('blocked_reason'))
            self.assertGreaterEqual(p['duration'],30.-1e-7)
            self.assertLessEqual(p['duration'],duration+1e-7)
            validate_plan(p,RenderConfig(style='authored-footage',fps=fps))
        self.assertAlmostEqual(self.plan['duration'],35.)

    def test_excerpt_edge_interval_is_preserved_not_clipped(self):
        f,i,h=fixtures()
        hit=h[1]['candidates'][0]
        hit.update(strength=1.)
        hit['refined_interval']=[hit['refined_time']-.02,hit['refined_time']+.01]
        p=plan_local_authored(f,i,h)
        self.assertEqual(p['status'],'candidate')
        match=next(a for a in p['rhythm_assignments'] if a['hit_time']==hit['refined_time'])
        self.assertEqual(match['refined_interval'],hit['refined_interval'])

    def test_duration_fps_bounds(self):
        for duration in (29.9,50.1,float('nan')):
            with self.assertRaises(ValueError):plan_local_authored(*self.data,duration=duration)
        for fps in (True,0,121,60.5):
            with self.assertRaises(ValueError):plan_local_authored(*self.data,fps=fps)


if __name__ == '__main__':
    unittest.main()
