import copy
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch
import numpy as np
from aive.visual_gate import screen_maps,validate_exclusions


class VisualGateTests(unittest.TestCase):
    def maps(self):
        return [dict(source='a.mp4',candidate_events=[],candidate_windows=[dict(id='w',source_start=1,source_end=3,
            candidate_events=[dict(time=2,strength=.8)])])]
    def result(self,image):
        return subprocess.CompletedProcess([],0,image.astype(np.uint8).tobytes(),b'')
    def test_black_rejected_no_promotion(self):
        original=self.maps()
        with patch('aive.visual_gate.subprocess.run',return_value=self.result(np.zeros((90,160)))):
            maps,report=screen_maps(original)
        self.assertEqual(maps[0]['candidate_windows'],[])
        self.assertEqual(len(report['rejected']),1)
        self.assertEqual(len(original[0]['candidate_windows']),1)
    def test_static_center_rejected_even_hud_moves(self):
        image=np.ones((90,160))*100;second=image.copy();second[:10,:]=200
        with patch('aive.visual_gate.subprocess.run',side_effect=[self.result(image),self.result(second),self.result(image)]):
            maps,report=screen_maps(self.maps())
        self.assertIn('near-static',report['rejected'][0]['reason'])
    def test_moving_frame_remains_unreviewed(self):
        a=np.ones((90,160))*60;b=np.ones((90,160))*120
        with patch('aive.visual_gate.subprocess.run',side_effect=[self.result(a),self.result(b),self.result(a)]):
            maps,report=screen_maps(self.maps())
        self.assertEqual(len(maps[0]['candidate_windows']),1)
        self.assertEqual(report['retained'][0]['status'],'unreviewed')
    def test_observed_exclusion_no_decode(self):
        exclusions=dict(schema_version='visual-exclusions/v1',exclusions=[dict(source='a.mp4',start=1,end=2.5,
            reason='promo',evidence='observed frame',reviewer='assistant')])
        with patch('aive.visual_gate.subprocess.run') as run:
            maps,report=screen_maps(self.maps(),exclusions=exclusions);run.assert_not_called()
        self.assertEqual(len(report['rejected']),1)
    def test_invalid_exclusion_provenance(self):
        for data in ({},dict(schema_version='visual-exclusions/v1',exclusions=[{}])):
            with self.assertRaises(ValueError):validate_exclusions(data,['a.mp4'])


if __name__=='__main__':unittest.main()
