import copy
import json
import unittest
from aive.rhythm_planner import match_events, plan_candidate_rhythm, author_candidate_design
from aive.encounter_render import RenderConfig, validate_plan


def fixtures():
    windows=[]
    for i in range(5):
        a=10.+4*i
        windows.append(dict(source_start=a,source_end=a+2.,candidate_events=[dict(id=f'e{i}',time=a+.8,
                       attack_interval=[a+.795,a+.805],strength=.8,confirmed=False)]))
    firing=[dict(schema_version='firing-map/v1',source='a.mp4',source_duration=60.,candidate_windows=windows)]
    hits=dict(schema_version='hit-map/v1',excerpt_start=0.,candidates=[dict(id=f'h{i}',time=.8+2*i,
                    refined_interval=[.795+2*i,.805+2*i],strength=.9,preview_eligible=True,
                    confirmed=False,review_status='unreviewed') for i in range(5)])
    return firing,hits


class RhythmTests(unittest.TestCase):
    def test_dp_one_to_one_preserves_unmatched_burst(self):
        events=[dict(id='a',time=1,attack_interval=[.99,1.01]),dict(id='b',time=1.04,attack_interval=[1.035,1.045])]
        hits=[dict(id='h',time=1.,strength=.9,refined_interval=[.99,1.01])]
        result=match_events(events,hits,source_start=0,output_start=0,music_start=0)
        self.assertEqual(result['matched'],1)
        self.assertEqual(result['total'],2)
        self.assertTrue(result['assignments'][0]['matched'])
        self.assertFalse(result['assignments'][1]['matched'])
        self.assertEqual(result['assignments'][0]['semantic_sync'],'unverified')

    def test_known_late_hit_error_and_order(self):
        events=[dict(id='a',time=3,attack_interval=[2.998,3.002]),dict(id='b',time=4,attack_interval=[3.998,4.002])]
        hits=[dict(id='b',time=11.02,strength=.8,refined_interval=[11.01,11.03]),
              dict(id='a',time=10.02,strength=.8,refined_interval=[10.01,10.03])]
        result=match_events(events,hits,source_start=2,output_start=4,music_start=5)
        self.assertEqual(result['matched'],2)
        self.assertAlmostEqual(result['assignments'][0]['planned_error_ms'],-20)
        self.assertEqual([a['music_hit_id'] for a in result['assignments']],['a','b'])

    def test_intact_four_windows_no_promotions_audio_clocks(self):
        maps,hits=fixtures();before=copy.deepcopy((maps,hits))
        plan=plan_candidate_rhythm(maps,hits,duration=10,max_clips=4)
        self.assertEqual(len(plan['timeline']),4)
        self.assertEqual(plan['rhythm_summary']['matched'],4)
        self.assertEqual(plan['duration'],8)
        self.assertEqual(before,(maps,hits))
        for row in plan['timeline']:
            self.assertEqual(row['speed'],1)
            self.assertEqual(row['events'],[])
            self.assertFalse(row['candidate_events'][0]['confirmed'])
            self.assertEqual(row['source_end']-row['source_start'],row['output_end']-row['output_start'])
        designed=author_candidate_design(plan)
        validate_plan(designed,RenderConfig(style='authored-footage'))
        self.assertEqual(designed['authored_design']['shots'][0]['role'],'setup')
        self.assertEqual(designed['authored_design']['shots'][-1]['role'],'payoff')
        self.assertIn('contrast',[s['role'] for s in designed['authored_design']['shots']])
        self.assertGreaterEqual(len(designed['authored_design']['bridges']),1)
        json.dumps(designed,allow_nan=False)

    def test_no_eligible_hits_blocks_without_filler(self):
        maps,hits=fixtures()
        for hit in hits['candidates']:hit['preview_eligible']=False
        plan=plan_candidate_rhythm(maps,hits,duration=10)
        self.assertEqual(plan['timeline'],[])
        self.assertEqual(plan['duration'],0)
        with self.assertRaises(ValueError):author_candidate_design(plan)

    def test_bad_contracts(self):
        for bad in (True,float('nan'),-1,13):
            maps,hits=fixtures()
            with self.assertRaises(ValueError):plan_candidate_rhythm(maps,hits,duration=bad)
        maps,hits=fixtures();maps[0]['candidate_windows'][0]['candidate_events'][0]['confirmed']=True
        with self.assertRaisesRegex(ValueError,'promote'):plan_candidate_rhythm(maps,hits)
        maps,hits=fixtures();hits['candidates'][0]['time']=float('nan')
        with self.assertRaises(ValueError):plan_candidate_rhythm(maps,hits)

    def test_refined_attack_clock_not_spectral_peak(self):
        maps,hits=fixtures()
        for hit in hits['candidates']:
            hit['refined_time']=hit['time']
            hit['time']+=.05
        plan=plan_candidate_rhythm(maps,hits,max_clips=4)
        self.assertEqual(plan['rhythm_summary']['matched'],4)
        self.assertTrue(all(abs(a['planned_error_ms'])<.01 for a in plan['rhythm_assignments']))

    def test_duplicate_refined_hits_not_double_assigned(self):
        maps,hits=fixtures()
        duplicate=copy.deepcopy(hits['candidates'][0])
        duplicate.update(id='duplicate',refined_time=duplicate['time'])
        hits['candidates'].append(duplicate)
        plan=plan_candidate_rhythm(maps,hits)
        self.assertEqual(plan['candidate_selection_scope']['acoustic_hit_count'],5)
        self.assertEqual(plan['candidate_selection_scope']['original_eligible_hit_count'],6)

    def test_root_neighbor_candidates_retained_not_hidden(self):
        maps,hits=fixtures()
        all_events=[copy.deepcopy(e) for w in maps[0]['candidate_windows'] for e in w['candidate_events']]
        all_events.append(dict(id='neighbor',time=10.35,attack_interval=[10.345,10.355],strength=.4,confirmed=False))
        maps[0]['candidate_events']=all_events
        plan=plan_candidate_rhythm(maps,hits)
        selected=[r for r in plan['timeline'] if r['source_start']<=10.35<=r['source_end']]
        if selected:self.assertIn('neighbor',[e['id'] for e in selected[0]['candidate_events']])
        self.assertTrue(all(len(r['candidate_events'])<=8 for r in plan['timeline']))

    def test_authored_candidate_interval_protection(self):
        maps,hits=fixtures();plan=author_candidate_design(plan_candidate_rhythm(maps,hits))
        candidate=plan['timeline'][1]['candidate_events'][0]
        candidate.update(time=plan['timeline'][1]['source_end']-.05,
                         attack_interval=[plan['timeline'][1]['source_end']-.06,plan['timeline'][1]['source_end']-.04])
        with self.assertRaisesRegex(ValueError,'protected candidate'):
            validate_plan(plan,RenderConfig(style='authored-footage'))

    def test_long_source_bounded_candidate_range_allowed(self):
        maps,hits=fixtures();maps[0]['source_duration']=900.
        plan=plan_candidate_rhythm(maps,hits,max_clips=4)
        self.assertEqual(len(plan['timeline']),4)

    def test_no_duplicate_source_ranges(self):
        maps,hits=fixtures()
        maps[0]['candidate_windows'] += copy.deepcopy(maps[0]['candidate_windows'])
        plan=plan_candidate_rhythm(maps,hits)
        rows=plan['timeline']
        for i,row in enumerate(rows):
            for other in rows[i+1:]:
                self.assertFalse(row['source_start']<other['source_end'] and row['source_end']>other['source_start'])


if __name__=='__main__':unittest.main()
