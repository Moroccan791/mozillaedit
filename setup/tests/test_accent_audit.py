"""Acoustic heuristic tests: no musical-taste or drum certification."""
import itertools
import json
import subprocess
import unittest
from unittest.mock import patch
import numpy as np
from aive.accent_audit import (analyze_accent_samples, audit_candidates,
    MAX_CANDIDATES, MAX_DURATION, MAX_SAMPLES, REFINE_SECONDS)

SR = 24000


def impulse(t=1., amplitude=1.):
    x = np.zeros(3 * SR)
    x[round(t * SR)] = amplitude
    return x


def burst(t=1., amplitude=1.):
    x = np.zeros(3 * SR)
    n = int(.075 * SR)
    q = np.arange(n) / SR
    x[round(t*SR):round(t*SR)+n] = amplitude * np.random.default_rng(7).normal(size=n) * np.exp(-q/.015)
    return x


class AccentAuditTests(unittest.TestCase):
    def audit(self, x, times, sr=SR):
        return analyze_accent_samples(x, sr, times)

    def test_known_impulse_and_late_clock(self):
        on, late = self.audit(impulse(), [1., 1.05])
        self.assertTrue(on['accepted'])
        self.assertEqual(on['classification'], 'percussive_like')
        self.assertLess(abs(on['acoustic_attack_time']-1.), .012)
        self.assertFalse(late['accepted'])
        self.assertIn('original_clock_outside_30ms_tolerance', late['rejection_reasons'])
        self.assertAlmostEqual(late['delay_ms']-on['delay_ms'], 50., delta=3.)
        self.assertEqual(late['original_peak'], 1.05)
        self.assertLess(abs(late['acoustic_attack_time']-1.), .012)

    def test_impulse_with_background_and_gain_invariance(self):
        x = impulse() + .01*np.sin(2*np.pi*230*np.arange(3*SR)/SR)
        a = self.audit(x, [1.015])[0]
        b = self.audit(x*.001, [1.015])[0]
        self.assertTrue(a['accepted'], a)
        self.assertLess(abs(a['acoustic_attack_time']-1.), .015)
        self.assertEqual(a['accepted'], b['accepted'])
        self.assertAlmostEqual(a['percussive_score'], b['percussive_score'], places=5)

    def test_nearby_secondary_attack_cluster_abstains(self):
        x = impulse(1.) + impulse(1.05, .5)
        r = self.audit(x, [1.055])[0]
        self.assertFalse(r['accepted'])
        self.assertIn('ambiguous_nearby_attack_cluster', r['rejection_reasons'])
        self.assertLess(abs(r['flux_peak_time']-1.), .012)

    def test_quiet_incidental_ranks_below_main(self):
        x = impulse(1., .10) + impulse(1.5, 1.)
        quiet, main = self.audit(x, [1., 1.5])
        self.assertFalse(quiet['accepted'])
        self.assertIn('weak_local_salience', quiet['rejection_reasons'])
        self.assertGreater(quiet['local_rank'], main['local_rank'])
        self.assertLess(quiet['local_relative_strength'], .2)
        self.assertLess(abs(quiet['acoustic_attack_time']-1.), .015)
        self.assertTrue(main['accepted'])

    def test_mixed_gradual_background_preserves_known_sharp_hit(self):
        tt = np.arange(3*SR)/SR
        ramp = np.clip((tt-.8)/.4, 0., 1.)
        x = impulse() + .001*ramp*np.sin(2*np.pi*440*tt)
        r = self.audit(x, [1.04])[0]
        self.assertFalse(r['accepted'])
        self.assertLess(abs(r['acoustic_attack_time']-1.), .015)
        self.assertIn('original_clock_outside_30ms_tolerance', r['rejection_reasons'])

    def test_edge_context_abstains(self):
        r = self.audit(impulse(.03), [.03])[0]
        self.assertFalse(r['accepted'])
        self.assertIn('insufficient_edge_context', r['rejection_reasons'])

    def test_harmonic_step_rejected_despite_sharp_start(self):
        tt = np.arange(3*SR)/SR
        gate = ((tt>=1.) & (tt<2.)).astype(float)
        x = gate*sum(np.sin(2*np.pi*f*tt) for f in [220,330,440,660,880])
        r = self.audit(x, [1.01])[0]
        self.assertFalse(r['accepted'], r)
        self.assertIn('harmonic_or_uncertain_percussiveness', r['rejection_reasons'])

    def test_gradual_harmonic_change_rejected(self):
        tt = np.arange(3*SR)/SR
        ramp = np.clip((tt-1.)/.3, 0., 1.)
        x = ramp*(np.sin(2*np.pi*330*tt)+.5*np.sin(2*np.pi*660*tt))
        r = self.audit(x, [1.15])[0]
        self.assertFalse(r['accepted'], r)

    def test_no_hit_outside_refinement_and_silence(self):
        for r in self.audit(impulse(), [1.3]) + self.audit(np.zeros(3*SR), [1.]):
            self.assertFalse(r['accepted'])
            self.assertIsNone(r['acoustic_attack_time'])
            self.assertIsNone(r['local_rank'])
            self.assertTrue(r['rejection_reasons'])

    def test_finite_json_order_duplicates_and_refinement_bound(self):
        reports = self.audit(burst(), [1.02, .999, 1.02])
        self.assertEqual([r['original_peak'] for r in reports], [1.02,.999,1.02])
        self.assertEqual(json.loads(json.dumps(reports, allow_nan=False)), reports)
        self.assertEqual(reports[0], reports[2])
        for r in reports:
            if r['acoustic_attack_time'] is not None:
                self.assertLessEqual(abs(r['original_peak']-r['acoustic_attack_time']), REFINE_SECONDS)
                lo, hi = r['acoustic_attack_range']
                self.assertLessEqual(lo, r['acoustic_attack_time'])
                self.assertGreaterEqual(hi, r['acoustic_attack_time'])

    def test_rate_resampling(self):
        for sr in (8000, 48000):
            x = np.zeros(3*sr); x[sr] = 1.
            r = self.audit(x, [1.], sr)[0]
            self.assertTrue(r['accepted'], r)
            self.assertLess(abs(r['acoustic_attack_time']-1.), .012)

    def test_invalid_samples_and_sample_rates(self):
        for x in ([], np.zeros((2,2)), [float('nan')], [float('inf')], [1j], ['1'], [True]):
            with self.subTest(x=str(x)), self.assertRaises(ValueError):
                self.audit(x, [0.])
        for sr in (True,0,7999,96001,24000.5,float('nan'),'24000'):
            with self.subTest(sr=sr), self.assertRaises(ValueError):
                self.audit([0.], [], sr)
        # Oversized zero-stride view ensures bound is checked before allocation.
        x = np.broadcast_to(np.array(0.), (MAX_SAMPLES+1,))
        with self.assertRaises(ValueError): self.audit(x, [])
        x = np.broadcast_to(np.array(0.), (int(MAX_DURATION*8000)+1,))
        with self.assertRaises(ValueError): self.audit(x, [], 8000)

    def test_bounded_times_and_empty_candidates(self):
        for times in ([True],[-.1],[3.],[float('nan')],[float('inf')],['1'],None):
            with self.subTest(times=times), self.assertRaises(ValueError):
                self.audit(impulse(), times)
        with self.assertRaises(ValueError):
            self.audit(impulse(), itertools.repeat(1.))
        self.assertEqual(self.audit(impulse(), []), [])
        with patch('aive.accent_audit._analyze_local', return_value={}):
            self.assertEqual(len(self.audit(impulse(), [1.]*MAX_CANDIDATES)), MAX_CANDIDATES)

    def test_file_api_bounded_decode_and_absolute_offsets(self):
        # Mock existing local file and decoder; no test writes outside scope.
        x = impulse(1.13).astype('<f4')
        with patch('aive.accent_audit.Path.is_file', return_value=True), patch('aive.accent_audit.subprocess.run') as run:
            run.return_value = subprocess.CompletedProcess([],0,x[:int(2.36*SR)].tobytes(),b'')
            r = audit_candidates('local.mp3',[11.05])[0]
            self.assertEqual(r['original_peak'],11.05)
            self.assertLess(abs(r['acoustic_attack_time']-11.), .012)
            self.assertFalse(r['accepted'])
            self.assertEqual(run.call_args.kwargs['timeout'],30)
            cmd = run.call_args.args[0]
            self.assertNotIn('-ss', cmd)
            self.assertIn('-nostdin', cmd)
            self.assertLess(cmd.index('-t'), cmd.index('-i'))
            self.assertLessEqual(float(cmd[cmd.index('-t')+1]),601.18)
            self.assertIn('atrim=start_sample=', cmd[cmd.index('-af')+1])
            json.dumps(r, allow_nan=False)
            run.return_value = subprocess.CompletedProcess([],1,b'',b'bad')
            with self.assertRaises(RuntimeError): audit_candidates('local.mp3',[1.])
            run.return_value = subprocess.CompletedProcess([],0,b'',b'')
            with self.assertRaises(ValueError): audit_candidates('local.mp3',[1.])
            with self.assertRaises(ValueError): audit_candidates('local.mp3',[600.])
        with patch('aive.accent_audit.Path.is_file', return_value=False):
            with self.assertRaises(ValueError): audit_candidates('missing.mp3',[1.])


if __name__ == '__main__':
    unittest.main()




