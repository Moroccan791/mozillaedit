"""Regression checks for explicit hard cuts and fractional 1x trim phases."""
import unittest
from aive.graph import _clip, SourceInfo, build, timeline_duration
from aive.project import Project, Segment

class GraphTimingTests(unittest.TestCase):
    def test_explicit_cut_survives_vibe_defaults(self):
        p=Project(name='timing',source='raw.mp4',vibe='gaming',
                  transition={'type':'cut'},segments=[Segment(start=1,end=3),Segment(start=4,end=6)])
        self.assertEqual(timeline_duration(p),4)
        graph,duration=build(p,src=SourceInfo(1280,720,60),has_source_audio=False)
        self.assertNotIn('xfade=',graph)
        self.assertEqual(duration,4)

    def test_fractional_trim_keeps_requested_phase_not_first_frame_origin(self):
        s=Segment(start=218.6691,end=222.852433)
        graph=_clip(s,0,60,1280,720)
        self.assertIn('setpts=PTS-218.669100/TB',graph)
        self.assertIn('fps=60:start_time=0',graph)
        self.assertIn('tpad=stop_mode=clone:',graph)
        self.assertIn('trim=duration=4.183333',graph)

if __name__=='__main__': unittest.main()
