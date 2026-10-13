"""Focused pure-stdlib mathematical planning tests; no renderer execution."""
import json
import math
import unittest

from aive.multishot_map import ShotAnchor, build_multishot_map, load_multishot_map, source_to_output


def shot(source, target, half=.0625):
    return dict(source_shot_time=source,
                source_audio_attack_interval=[source-half,source+half],
                target_acoustic_hit_time=target)


def plan(shots=None, **kwargs):
    args = dict(source_start=0.,source_end=4.,target_start=0.,target_end=4.,reviewed=True)
    args.update(kwargs)
    return build_multishot_map(shots if shots is not None else [shot(1.,1.0625),shot(2.,2.),shot(3.,3.03125)],**args)


class MultiShotTests(unittest.TestCase):
    def test_feasible_incompatible_intershot_rhythm_all_exact_anchors(self):
        rows = [shot(1.,1.0625),shot(1.5,1.53125),shot(2.,2.03125),shot(2.5,2.5)]
        m = plan(rows,target_end=4.125)
        self.assertNotEqual(rows[1]['target_acoustic_hit_time']-rows[0]['target_acoustic_hit_time'],.5)
        self.assertEqual(m.map(0),0)
        self.assertEqual(m.map(4),4.125)
        for row in rows:
            x,y = row['source_shot_time'],row['target_acoustic_hit_time']
            self.assertEqual(m.map(x),y)
            self.assertEqual(m.source_to_output(x),y)
            for i in range(65):
                a,b = row['source_audio_attack_interval']
                t = a+(b-a)*i/64
                self.assertEqual(m.map(t),t+y-x)
                self.assertEqual(m.speed(t),1.)
        # Different rigid shifts are allowed, but each individual crisp interval
        # remains unchanged rather than resampling the attack itself.
        self.assertGreater(len(set(b-a for a,b in m.anchors)),1)

    def test_dense_monotonic_playback_and_analytic_midpoint_extrema(self):
        m = plan()
        lo,hi = m.bounds()
        self.assertGreaterEqual(lo,.75)
        self.assertLessEqual(hi,1.35)
        last = -1.
        for i in range(8001):
            t = 4*i/8000
            output = m.map(t)
            self.assertGreater(output,last)
            self.assertTrue(lo <= m.speed(t) <= hi)
            last = output
        for s in m.segments:
            length,change = s.source_end-s.source_start,s.shift_end-s.shift_start
            midpoint_speed = 1/(1+1.875*change/length)
            self.assertAlmostEqual(m.speed((s.source_start+s.source_end)/2),midpoint_speed,places=14)
            self.assertLessEqual(s.min_speed,min(1.,midpoint_speed))
            self.assertGreaterEqual(s.max_speed,max(1.,midpoint_speed))
            for i in range(1001):
                self.assertTrue(s.min_speed <= s.speed(s.source_start+length*i/1000) <= s.max_speed)

    def test_c2_boundary_continuity_numerically(self):
        m = plan()
        h = 1e-4
        for s in m.segments:
            for edge in (s.source_start,s.source_end):
                if not h < edge < m.duration-h:
                    continue
                left = (m.map(edge)-m.map(edge-h))/h
                right = (m.map(edge+h)-m.map(edge))/h
                second_left = (m.map(edge)-2*m.map(edge-h)+m.map(edge-2*h))/h**2
                second_right = (m.map(edge+2*h)-2*m.map(edge+h)+m.map(edge))/h**2
                self.assertAlmostEqual(left,1.,places=6)
                self.assertAlmostEqual(right,1.,places=6)
                self.assertAlmostEqual(second_left,0.,delta=.004)
                self.assertAlmostEqual(second_right,0.,delta=.004)
                self.assertEqual(m.speed(edge),1.)

    def test_explicit_absolute_anchor_clocks_no_inferred_origin(self):
        rows = [shot(101.,21.0625),shot(102.,22.),shot(103.,23.03125)]
        m = plan(rows,source_start=100.,source_end=104.,target_start=20.,target_end=24.)
        for row in rows:
            x,y = row['source_shot_time'],row['target_acoustic_hit_time']
            self.assertEqual(source_to_output(m,x),y-20.)
            self.assertEqual(source_to_output(m,x,output_clock='absolute'),y)
            self.assertEqual(source_to_output(m,x-100.,source_clock='local'),y-20.)
            self.assertEqual(m.map(x-100.),y-20.)
        self.assertEqual(source_to_output(m,100.,output_clock='absolute'),20.)
        self.assertEqual(source_to_output(m,104.,output_clock='absolute'),24.)
        self.assertEqual(m.manifest()['clocks']['source_origin'],100.)
        for kwargs in ({'source_clock':'auto'},{'output_clock':'timeline'}):
            with self.assertRaises(ValueError):
                source_to_output(m,101.,**kwargs)
        with self.assertRaises(ValueError):
            source_to_output(m,1.)

    def test_decimal_absolute_clocks_anchors_and_attack_translation(self):
        rows = [shot(71.113,31.173,.08),shot(72.423,32.393,.09)]
        m = plan(rows,source_start=70.013,source_end=74.013,target_start=30.013,target_end=34.013)
        for row in rows:
            x,y = row['source_shot_time'],row['target_acoustic_hit_time']
            self.assertEqual(m.source_to_output(x,output_clock='absolute'),y)
            for t in row['source_audio_attack_interval']:
                self.assertAlmostEqual(m.source_to_output(t,output_clock='absolute'),t+y-x,places=12)
                self.assertEqual(m.speed(t-m.source_start),1.)

    def test_overlap_same_shift_merges_without_losing_any_anchors(self):
        m = plan([shot(1.,1.0625,.25),shot(1.25,1.3125,.25)])
        self.assertEqual(m.protected,((.75,1.5,.0625),))
        for x,y in m.anchors:
            self.assertEqual(m.map(x),y)
        for i in range(1001):
            t = .75+.75*i/1000
            self.assertEqual(m.map(t),t+.0625)
            self.assertEqual(m.speed(t),1.)

    def test_overlap_and_touch_unequal_shifts_fail_closed(self):
        for half in (.25,.125):
            with self.assertRaisesRegex(ValueError,'incompatible translations'):
                plan([shot(1.,1.,half),shot(1.25,1.28125,half)])

    def test_infeasible_burst_and_quintic_peak_not_just_average_speed(self):
        # Average gap speed would fit bounds, but quintic midpoint exceeds 1.35.
        with self.assertRaisesRegex(ValueError,'certified playback'):
            plan([shot(1.,1.0625),shot(1.5,1.5)])
        # Tight ordered burst cannot achieve these shifts in the unprotected gap.
        with self.assertRaisesRegex(ValueError,'infeasible gap'):
            plan([shot(1.,1.1,.05),shot(1.2,1.21,.05)])
        # Too much expansion must fail too; no implicit force-stretch fallback.
        with self.assertRaisesRegex(ValueError,'certified playback'):
            plan([shot(1.,1.),shot(2.,2.3)])

    def test_gap_reverse_repeated_source_and_endpoint_no_room(self):
        for target in (1.2,1.3):
            with self.assertRaisesRegex(ValueError,'reverse or repeated source'):
                plan([shot(1.,1.,.1),shot(2.,target,.1)])
        for rows in ([dict(source_shot_time=.25,source_audio_attack_interval=[0.,.5],target_acoustic_hit_time=.3125)],
                     [dict(source_shot_time=3.75,source_audio_attack_interval=[3.5,4.],target_acoustic_hit_time=3.8125)]):
            with self.assertRaisesRegex(ValueError,'no room'):
                plan(rows)

    def test_identity_and_full_endpoint_attack_no_zero_segments(self):
        m = plan([ShotAnchor(2.,(0.,4.),2.)])
        self.assertEqual(len(m.segments),1)
        self.assertEqual(m.bounds(),(1.,1.))
        for t in (0.,1.,2.,3.,4.):
            self.assertEqual(m.map(t),t)
            self.assertEqual(m.speed(t),1.)
        with self.assertRaises(ValueError):
            plan([ShotAnchor(1.,(1.,1.),1.)])

    def test_order_never_sorts_reuses_or_reverses_source(self):
        for rows in ([shot(2.,2.),shot(1.,1.)],
                     [shot(1.,1.),shot(1.,1.5)],
                     [shot(1.,2.),shot(2.,1.)],
                     [shot(1.,1.),shot(2.,1.)]):
            with self.assertRaisesRegex(ValueError,'shot order'):
                plan(rows)

    def test_required_review_explicit_endpoints_and_shot_fields(self):
        for value in (False,1,'reviewed',None):
            with self.assertRaisesRegex(ValueError,'reviewed'):
                plan(reviewed=value)
        with self.assertRaises(TypeError):
            build_multishot_map([shot(1.,1.)],reviewed=True)
        for rows in ([],[{}],[{'source_shot_time':1.}],['candidate']):
            with self.assertRaises(ValueError):
                plan(rows)
        with self.assertRaises(ValueError):
            build_multishot_map(None,source_start=0.,source_end=4.,
                               target_start=0.,target_end=4.,reviewed=True)

    def test_all_numeric_inputs_fail_closed_on_bool_nonfinite_and_wrong_type(self):
        bad = (True,False,None,'1',float('nan'),float('inf'),-float('inf'),10**1000)
        for value in bad:
            for key in ('source_start','source_end','target_start','target_end','min_speed','max_speed'):
                with self.subTest(key=key,value=str(value)):
                    with self.assertRaises(ValueError):
                        plan(**{key:value})
            for key in ('source_shot_time','target_acoustic_hit_time'):
                row = shot(1.,1.)
                row[key] = value
                with self.assertRaises(ValueError):
                    plan([row])
            for side in (0,1):
                row = shot(1.,1.)
                row['source_audio_attack_interval'][side] = value
                with self.assertRaises(ValueError):
                    plan([row])
            with self.assertRaises(ValueError):
                plan().map(value)

    def test_invalid_bounds_endpoints_attacks_outside_and_map_range(self):
        for kwargs in ({'source_start':-1.},{'target_start':-1.},{'source_end':0.},
                       {'target_end':0.},{'source_end':-1.},{'target_end':-1.},
                       {'min_speed':.74},{'max_speed':1.36},{'min_speed':1.01},{'max_speed':.99}):
            with self.assertRaises(ValueError):
                plan(**kwargs)
        for interval in ([1.,.5],[.5,.5],[-1.,1.], [0.,5.],[2.,3.],[0.],None,'01'):
            with self.assertRaises(ValueError):
                plan([dict(source_shot_time=1.,source_audio_attack_interval=interval,target_acoustic_hit_time=1.)])
        for t in (-1.,5.):
            with self.assertRaises(ValueError):
                plan().map(t)
        for t in (-1.,5.):
            with self.assertRaises(ValueError):
                plan([shot(1.,t)])

    def test_bounded_to_32_including_generator_consumption(self):
        rows = [shot(i+.5,i+.5,.125) for i in range(32)]
        m = plan(rows,source_end=32.,target_end=32.)
        self.assertEqual(len(m.anchors),32)
        for x,y in m.anchors:
            self.assertEqual(m.map(x),y)
        consumed = []
        def endless():
            for i in range(1000000):
                consumed.append(i)
                yield shot(i+.5,i+.5,.125)
        with self.assertRaisesRegex(ValueError,'at most 32'):
            plan(endless(),source_end=100.,target_end=100.)
        self.assertEqual(len(consumed),33)

    def test_unrepresentable_anchor_translation_rejected_not_point_snapped(self):
        with self.assertRaisesRegex(ValueError,'represented exactly'):
            plan([shot(1.,1e-20)])

    def test_source_sha256_format_is_optional_for_planning_but_strict_when_supplied(self):
        for bad in (True, "A"*64, "0"*63, "g"*64):
            with self.subTest(bad=bad), self.assertRaisesRegex(ValueError, "source_sha256"):
                plan(source_sha256=bad)
        bound = plan(source_sha256="a"*64)
        self.assertEqual(load_multishot_map(bound.manifest()).source_sha256, "a"*64)

    def test_tightened_bounds_and_near_limit_certification(self):
        # A little inside each exact analytic limit must certify; a little
        # outside must fail, regardless of sampled-grid resolution.
        gap = .875  # between .0625-radius attacks centered on 1 and 2
        for change in (gap*(1/.75-1)/1.875, gap*(1/1.35-1)/1.875):
            inward = change*(1-1e-9)
            outward = change*(1+1e-9)
            m = plan([shot(1.,1.),shot(2.,2.+inward)],source_end=6.,target_end=6.+inward)
            self.assertTrue(.75 <= m.bounds()[0] <= m.bounds()[1] <= 1.35)
            with self.assertRaisesRegex(ValueError,'certified playback'):
                plan([shot(1.,1.),shot(2.,2.+outward)],source_end=6.,target_end=6.+outward)
        with self.assertRaisesRegex(ValueError,'certified playback'):
            plan(min_speed=.99,max_speed=1.01)
        self.assertEqual(plan([shot(1.,1.)],min_speed=1.,max_speed=1.).bounds(),(1.,1.))

    def test_json_manifest_safe_detached_explicit_planning_only(self):
        m = plan()
        manifest = m.manifest()
        decoded = json.loads(json.dumps(manifest,allow_nan=False))
        self.assertEqual(decoded,manifest)
        self.assertTrue(decoded['planning_only'])
        self.assertEqual(decoded['renderer_integration'],'encounter_render-multishot-opt-in')
        self.assertEqual(len(decoded['anchors']),len(m.anchors))
        self.assertEqual(load_multishot_map(decoded).manifest(),decoded)
        altered=json.loads(json.dumps(decoded));altered['segments'][0]['shift_start']+=.01
        with self.assertRaisesRegex(ValueError,'stale or inconsistent'):
            load_multishot_map(altered)
        for anchor in decoded['anchors']:
            self.assertEqual(m.map(anchor['source_local']),anchor['output_local'])
        manifest['anchors'][0]['source_audio_attack_interval'][0] = -999.
        self.assertNotEqual(m.manifest()['anchors'][0]['source_audio_attack_interval'][0],-999.)

    def test_ffmpeg_expression_and_gap_windows_follow_validated_map(self):
        m = plan()
        expression = m.expression('(PTS*TB)')
        self.assertIn('between((PTS*TB)', expression)
        self.assertIn('pow(', expression)
        self.assertEqual(len(m.gaps), sum(s.kind == 'gap' for s in m.segments))
        for source, output in m.anchors:
            self.assertAlmostEqual(m.map(source), output)
        for segment in m.segments:
            self.assertIn(f'{segment.source_start:.12f}', expression)
            self.assertIn(f'{segment.source_end:.12f}', expression)


if __name__ == '__main__':
    unittest.main()
