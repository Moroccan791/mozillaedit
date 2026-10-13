import json
import tempfile
import unittest
from pathlib import Path
from aive.event_io import load_confirmed_events

class EventIOTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.root=Path(self.temp.name)
        self.source=str((self.root/'clip.mp4').resolve())
        self.event={'source':self.source,'source_audio_event':2.,'source_visual_event':2.1,
                    'confidence':.9,'confirmed':True,'source_duration':8.}
    def tearDown(self):self.temp.cleanup()
    def write(self,payload,name='events.json'):
        p=self.root/name;p.write_text(json.dumps(payload),encoding='utf-8-sig');return p
    def test_wrapper_source_fallback_and_candidate_exclusion(self):
        e=dict(self.event);e.pop('source')
        candidate={'confirmed':False,'source_audio_event':None}
        missing=dict(self.event,source_audio_event=None)
        p=self.write({'schema_version':'povkills/v1','source':self.source,'events':[e,candidate,missing]})
        got,summary=load_confirmed_events([p])
        self.assertEqual(len(got),1);self.assertEqual(got[0]['source'],self.source)
        self.assertEqual(summary,{'files':1,'observations':3,'eligible':1,'unconfirmed':1,'missing_audio':1})
    def test_bare_list_and_empty(self):
        got,_=load_confirmed_events([self.write([self.event])]);self.assertEqual(got,[self.event])
        self.assertEqual(load_confirmed_events([self.write([])])[0],[])
    def test_malformed_wrappers(self):
        for payload in [{'events':{}},{'source':self.source},{'schema_version':'other/v2','events':[]},['bad']]:
            with self.subTest(payload=payload),self.assertRaises(ValueError):load_confirmed_events([self.write(payload)])
    def test_no_truthy_confirmation_or_fabricated_defaults(self):
        for change in [{'confirmed':'true'},{'confirmed':1},{'confidence':None},{'confidence':float('nan')},
                       {'source_visual_event':None},{'source_duration':0},{'source_audio_event':True}]:
            with self.subTest(change=change),self.assertRaises(ValueError):load_confirmed_events([self.write([{**self.event,**change}])])
        e=dict(self.event);e.pop('confidence')
        with self.assertRaises(ValueError):load_confirmed_events([self.write([e])])
    def test_wrapper_source_contradiction(self):
        with self.assertRaisesRegex(ValueError,'contradicts'):
            load_confirmed_events([self.write({'source':str(self.root/'other.mp4'),'events':[self.event]})])
    def test_cross_file_duration_consistency(self):
        one=self.write([self.event],'one.json');two=self.write([{**self.event,'source_duration':9.}],'two.json')
        with self.assertRaisesRegex(ValueError,'inconsistent'):load_confirmed_events([one,two])
    def test_handoff_to_planner(self):
        from aive.encounters import plan_encounters
        e=dict(self.event);e.pop('source')
        got,_=load_confirmed_events([self.write({'schema_version':'povkills/v1','source':self.source,'events':[e]})])
        result=plan_encounters(got,duration=4,accents=[1.5,3,4],music_duration=10)
        self.assertEqual(result['schema_version'],'encounters/v1')
        self.assertEqual(len(result['timeline']),1)
        self.assertEqual(result['timeline'][0]['source'],self.source)

if __name__=='__main__':unittest.main()
