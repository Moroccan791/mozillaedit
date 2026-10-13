"""Hit candidates are acoustic heuristics, never automatic certifications."""
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import numpy as np
from aive.hit_map import (analyze_hit_samples, build_hit_map, validate_reviewed_hits,
                          load_reviewed_hits, song_sha256, REVIEW_VERSION)
from aive.accent_audit import analyze_accent_samples

SR = 24000
SHA = 'a'*64


def repeated():
    x = np.zeros(6*SR)
    rng = np.random.default_rng(42)
    n = int(.075*SR)
    for t in (.7,1.8,2.9,4.0,5.1):
        x[round(t*SR):round(t*SR)+n] += rng.normal(size=n)*np.exp(-np.arange(n)/SR/.015)
    return x


def review():
    return {'schema_version':REVIEW_VERSION,'song_sha256':SHA,'hits':[
        {'id':'hit-001','time':1.,'interval':[.99,1.01],'decision':'confirmed',
         'reviewer':'external listener','method':'audition plus waveform inspection',
         'evidence':{'source':'listening-session-1','description':'sharp attack audible at interval'}}]}


class HitMapTests(unittest.TestCase):
    def analyze(self,x,**kwargs):
        return analyze_hit_samples(x,SR,song_sha256=SHA,**kwargs)

    def test_repeated_noise_attacks_and_finite_json(self):
        r = self.analyze(repeated())
        json.dumps(r,allow_nan=False)
        self.assertEqual(r['schema_version'],'hit-map/v1')
        hits = r['candidates']
        self.assertGreaterEqual(len(hits),5)
        self.assertLessEqual(len(hits),32)
        self.assertEqual([h['time'] for h in hits],sorted(h['time'] for h in hits))
        for t in (.7,1.8,2.9,4.,5.1):
            h = min(hits,key=lambda h:abs(h['time']-t))
            self.assertLess(abs(h['time']-t),.025)
            self.assertIsNotNone(h['refined_time'])
            self.assertLess(abs(h['refined_time']-t),.025)
            self.assertTrue(h['preview_eligible'])
        for h in hits:
            self.assertFalse(h['confirmed'])
            self.assertEqual(h['review_status'],'unreviewed')
            self.assertEqual(h['instrumentation'],'unknown')
            self.assertIs(type(h['preview_eligible']),bool)
            self.assertTrue(0<=h['strength']<=1)
            if h['refined_time'] is not None:
                lo,hi = h['refined_interval']
                self.assertLessEqual(lo,h['refined_time'])
                self.assertGreaterEqual(hi,h['refined_time'])
        self.assertEqual(r,self.analyze(repeated()))

    def test_gain_invariant_salience_and_selection_limit(self):
        a,b = self.analyze(repeated()),self.analyze(repeated()*.001)
        self.assertEqual([h['time'] for h in a['candidates']],[h['time'] for h in b['candidates']])
        np.testing.assert_allclose([h['strength'] for h in a['candidates']],
                                   [h['strength'] for h in b['candidates']])
        self.assertEqual(len(self.analyze(repeated(),max_candidates=2)['candidates']),2)

    def test_harmonic_uncertainty_original_gate_unchanged(self):
        tt = np.arange(3*SR)/SR
        x = ((tt>=1)&(tt<2))*sum(np.sin(2*np.pi*f*tt) for f in (220,330,440,660,880))
        r = self.analyze(x)
        self.assertTrue(r['candidates'])
        h = min(r['candidates'],key=lambda h:abs(h['time']-1))
        audit = h['evidence']['accent_audit']
        original = analyze_accent_samples(x,SR,[h['time']])[0]
        self.assertEqual(audit,original)
        self.assertFalse(audit['accepted'])
        self.assertIn('harmonic_or_uncertain_percussiveness',audit['rejection_reasons'])
        self.assertFalse(h['confirmed'])

    def test_strong_rejected_mixed_hit_still_preview_only(self):
        tt = np.arange(3*SR)/SR
        x = ((tt>=1)&(tt<2))*sum(np.sin(2*np.pi*f*tt) for f in (220,330,440,660,880))
        x[SR] += 1.
        r = self.analyze(x)
        h = min(r['candidates'],key=lambda h:abs(h['time']-1))
        self.assertFalse(h['evidence']['accent_audit']['accepted'])
        self.assertTrue(h['preview_eligible'])
        self.assertFalse(h['confirmed'])
        self.assertTrue(h['evidence']['accent_audit']['rejection_reasons'])

    def test_silence_and_excerpt_clocks(self):
        self.assertEqual(self.analyze(np.zeros(SR))['candidates'],[])
        r = self.analyze(repeated(),pcm_start=10.,excerpt_start=11.,excerpt_duration=3.)
        self.assertTrue(r['candidates'])
        for h in r['candidates']:
            self.assertTrue(11<=h['time']<14)
            self.assertEqual(h['time'],h['evidence']['accent_audit']['original_peak'])
            if h['refined_time'] is not None:
                self.assertTrue(11<=h['refined_time']<14)

    def test_invalid_numeric_bools_samples_and_bounds(self):
        for x in ([],[True],[1j],['1'],[np.nan],[np.inf],np.zeros((2,2)),
                  np.broadcast_to(0.,(14*SR+3,))):
            with self.subTest(x=str(type(x))),self.assertRaises(ValueError):
                self.analyze(x)
        for sr in (True,False,0,24000.5,48000,np.nan,'24000'):
            with self.subTest(sr=sr),self.assertRaises(ValueError):
                analyze_hit_samples([0.],sr,song_sha256=SHA)
        for key,values in {'excerpt_start':[True,-1,np.nan,np.inf,'0'],
                           'excerpt_duration':[True,0,-1,12.1,np.nan,'1'],
                           'pcm_start':[True,-1,np.inf,'0'],
                           'max_candidates':[True,0,33,1.5,np.nan,'2']}.items():
            for v in values:
                with self.subTest(key=key,v=v),self.assertRaises(ValueError):
                    self.analyze(np.zeros(SR),**{key:v})
        for kwargs in ({'excerpt_start':1.,'excerpt_duration':1.},
                       {'pcm_start':600.,'excerpt_start':600.},
                       {'pcm_start':1.,'excerpt_start':0.,'excerpt_duration':1.}):
            with self.assertRaises(ValueError): self.analyze(np.zeros(SR),**kwargs)
        with self.assertRaises(ValueError):
            analyze_hit_samples([0.],SR,song_sha256='metadata')

    def test_decode_bounds_offsets_and_failures(self):
        with tempfile.TemporaryDirectory() as td:
            music = Path(td)/'song.mp3'; music.write_bytes(b'actual bytes')
            with patch('aive.hit_map.subprocess.run') as run:
                x = np.zeros(5*SR,dtype='<f4'); x[2*SR]=1
                run.return_value = subprocess.CompletedProcess([],0,x.tobytes(),b'')
                r = build_hit_map(music,10.,3.)
                self.assertEqual(r['song_sha256'],hashlib.sha256(b'actual bytes').hexdigest())
                self.assertLess(abs(r['candidates'][0]['refined_time']-11.),.02)
                cmd = run.call_args.args[0]
                self.assertIn('-nostdin',cmd); self.assertNotIn('-ss',cmd)
                self.assertLess(cmd.index('-t'),cmd.index('-i'))
                self.assertEqual(float(cmd[cmd.index('-t')+1]),14.)
                self.assertIn('start_sample=216000:end_sample=336000',cmd[cmd.index('-af')+1])
                self.assertEqual(cmd[cmd.index('-ar')+1],'24000')
                self.assertEqual(cmd[cmd.index('-ac')+1],'1')
                run.return_value = subprocess.CompletedProcess([],0,np.zeros(2*SR,dtype='<f4').tobytes(),b'')
                end = build_hit_map(music,599.,1.)
                self.assertEqual(end['decode']['input_end'],600.)
                for output,code,error in ((b'',0,ValueError),(b'bad',0,RuntimeError),
                    (np.zeros(5*SR+1,dtype='<f4').tobytes(),0,RuntimeError),(b'',1,RuntimeError)):
                    run.return_value = subprocess.CompletedProcess([],code,output,b'')
                    with self.assertRaises(error): build_hit_map(music,10.,3.)
                run.side_effect = subprocess.TimeoutExpired('ffmpeg',45)
                with self.assertRaises(RuntimeError): build_hit_map(music,10.,3.)
            for start,duration in ((599,2),(0,13),(True,1),(0,False),(np.nan,1)):
                with self.assertRaises(ValueError): build_hit_map(music,start,duration)
            with self.assertRaises(ValueError): build_hit_map(Path(td)/'missing',0,1)

    def test_review_strict_structure_numeric_order_identity(self):
        r = validate_reviewed_hits(review(),SHA)
        self.assertEqual(r,review())
        r['hits'][0]['evidence']['source']='changed'
        self.assertNotEqual(r,review())
        with self.assertRaises(ValueError): validate_reviewed_hits(review(),'b'*64)
        for field,value in (('time',True),('time',np.nan),('time',np.inf),('interval',[2.,1.]),
                            ('interval',[False,2.]),('decision',True),('reviewer',''),
                            ('method',''),('evidence',{'metadata':'kick'})):
            bad = review(); bad['hits'][0][field]=value
            with self.subTest(field=field,value=value),self.assertRaises(ValueError):
                validate_reviewed_hits(bad,SHA)
        for bad in ({'song_sha256':SHA,'hits':[]},self.analyze(np.zeros(SR))):
            with self.assertRaises(ValueError): validate_reviewed_hits(bad,SHA)
        for mode in ('duplicate','reverse','oversized'):
            bad = review(); second = copy.deepcopy(bad['hits'][0])
            if mode=='reverse': second.update(id='other',time=.5,interval=[.4,.6])
            bad['hits'].append(second)
            if mode=='oversized': bad['hits']*=17
            with self.assertRaises(ValueError): validate_reviewed_hits(bad,SHA)

    def test_review_file_identity_not_metadata_and_duplicate_json(self):
        with tempfile.TemporaryDirectory() as td:
            song = Path(td)/'song'; song.write_bytes(b'one')
            p = Path(td)/'review.json'
            r = review(); r['song_sha256']=song_sha256(song)
            p.write_text(json.dumps(r),encoding='utf-8')
            self.assertEqual(load_reviewed_hits(p,song),r)
            song.write_bytes(b'two')
            with self.assertRaises(ValueError): load_reviewed_hits(p,song)
            p.write_text('{"hits":[],"hits":[]}',encoding='utf-8')
            with self.assertRaises(ValueError): load_reviewed_hits(p,song)
            p.write_text('bad',encoding='utf-8')
            with self.assertRaises(ValueError): load_reviewed_hits(p,song)


if __name__=='__main__': unittest.main()
