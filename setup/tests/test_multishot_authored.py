"""Synthetic test attestation only: never real footage or perceptual approval."""
import copy
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import wave
from unittest.mock import patch

from aive.authored_footage import video_graph
from aive.encounter_render import RenderConfig, render_encounters, validate_plan, _video_filter, _rounded, RenderError
from aive.multishot_map import build_multishot_map


def fixture(sources=None, digest="a"*64, count=4, length=2.5, version="v2", shift=.125):
    sources = sources or [f"synthetic-{i}.mkv" for i in range(count)]
    start, music_start = .125, .127
    timeline, maps = [], {}
    for i, source in enumerate(sources):
        os = i*length
        m = build_multishot_map([dict(source_shot_time=start+1.25,
            source_audio_attack_interval=[start+1.2, start+1.3],
            target_acoustic_hit_time=music_start+os+1.25+shift)],
            source_start=start, source_end=start+length,
            target_start=music_start+os, target_end=music_start+os+length,
            reviewed=True, source_sha256=digest)
        st = start+1.25
        timeline.append(dict(source=str(source), source_start=start, source_end=start+length,
            output_start=os, output_end=os+length, music_start=music_start+os,
            music_end=music_start+os+length, speed=1.,
            events=[dict(source=str(source), confirmed=True, source_audio_event=st,
                source_visual_event=st, output_audio_event=os+1.25+shift,
                output_visual_event=os+1.25+shift, test_attestation="synthetic fixture, not semantic review")],
            candidate_events=[dict(time=start+1., attack_interval=[start+.97, start+1.03],
                confirmed=False, test_attestation="synthetic candidate")]))
        maps[i] = m
    roles = ["setup"]+["contrast" if i==2 else "impact" for i in range(1,count-1)]+["payoff"]
    design = dict(schema_version="authored-footage/"+version,
        shots=[dict(role=r, composition="inset" if r=="contrast" else "full") for r in roles],
        bridges=[dict(boundary=2,direction="right",frames=8)], ending=dict(fade_frames=12))
    if version=="v2": design["impacts"]=[]
    return dict(schema_version="encounters/v1", duration=count*length, requested_duration=count*length,
        music_start=music_start,music_end=music_start+count*length,music_continuous=True,gaps=[],
        timeline=timeline, authored_design=design), maps


class CombinedValidationTests(unittest.TestCase):
    config = RenderConfig(width=128,height=72,fps=30,style="multishot-authored")

    def test_gate_matrix_preserves_opt_in(self):
        p,maps=fixture()
        for style in ("clean","restrained-impact","multishot","authored-footage","multishot-authored"):
            for design in (False,True):
                for supplied in (False,True):
                    q=copy.deepcopy(p)
                    if not design:q.pop("authored_design")
                    # Without maps, use honest 1x confirmed output clocks.
                    if style in ("clean","restrained-impact","authored-footage"):
                        for item in q["timeline"]:
                            for e in item["events"]:
                                e["output_audio_event"]=e["output_visual_event"]=item["output_start"]+1.25
                    valid=(style in ("clean","restrained-impact") and not design and not supplied or
                           style=="authored-footage" and design and not supplied or
                           style=="multishot" and not design and supplied or
                           style=="multishot-authored" and design and supplied)
                    with self.subTest(style=style,design=design,supplied=supplied):
                        cfg=RenderConfig(width=128,height=72,fps=30,style=style)
                        if valid:validate_plan(q,cfg,multishot_maps=maps if supplied else None)
                        else:
                            with self.assertRaises(ValueError):validate_plan(q,cfg,multishot_maps=maps if supplied else None)

    def test_maps_complete_strict_bindings_and_fail_before_io(self):
        p,m=fixture()
        bad_maps=[None,{}, {0:m[0]}, {**m,4:m[0]}, {str(i):v for i,v in m.items()}]
        missing_hash={i:dict(v.manifest(),source_sha256=None) for i,v in m.items()}
        bad_maps.append(missing_hash)
        bad_maps.append({**m,0:dict(m[0].manifest(),reviewed_input=False)})
        for supplied in bad_maps:
            with self.subTest(supplied=supplied), self.assertRaises(ValueError):
                validate_plan(p,self.config,multishot_maps=supplied)
        for key in ("source_start","source_end","music_start","music_end"):
            q=copy.deepcopy(p);q["timeline"][0][key]+=.01
            with self.subTest(key=key),self.assertRaises(ValueError):validate_plan(q,self.config,multishot_maps=m)
        q=copy.deepcopy(p);q["timeline"][0]["events"][0]["output_visual_event"]-=.125
        with self.assertRaisesRegex(ValueError,"mapped event"):validate_plan(q,self.config,multishot_maps=m)
        q=copy.deepcopy(p);q["timeline"][0]["events"]=[]
        with self.assertRaisesRegex(ValueError,"confirmed event"):validate_plan(q,self.config,multishot_maps=m)
        with patch("aive.encounter_render.subprocess.run") as run:
            with self.assertRaises(ValueError):render_encounters(p,"missing.wav","unused",config=self.config)
            run.assert_not_called()

    def test_mapped_candidate_confirmed_full_intervals_and_map_protection(self):
        # Full intervals crossing a bridge/fade must reject even with safe onset.
        for index,interval in ((1,[1.,2.625]),(2,[.125,1.5]),(3,[1.,2.625])):
            for kind in ("candidate","attack_interval","source_audio_attack_interval"):
                p,m=fixture();item=p["timeline"][index]
                if kind=="candidate":item["candidate_events"][0]["attack_interval"]=interval
                else:item["events"][0][kind]=interval
                with self.subTest(index=index,kind=kind), self.assertRaisesRegex(ValueError,"protected"):
                    validate_plan(p,self.config,multishot_maps=m)
        p,m=fixture()
        # Widen only caller map interval while the confirmed event remains safe.
        i=1;item=p["timeline"][i]
        m[i]=build_multishot_map([dict(source_shot_time=1.375,
            source_audio_attack_interval=[1.,2.625],target_acoustic_hit_time=item["music_start"]+1.25)],
            source_start=.125,source_end=2.625,target_start=item["music_start"],
            target_end=item["music_end"],reviewed=True,source_sha256="a"*64)
        item["events"][0]["output_audio_event"]=item["events"][0]["output_visual_event"]=item["output_start"]+1.25
        with self.assertRaisesRegex(ValueError,"map protected interval"):
            validate_plan(p,self.config,multishot_maps=m)

    def test_mapped_points_and_intervals_reject_where_old_1x_would_accept(self):
        for index,local,shift in ((1,2.03125,.03125),(2,.4375,-.03125),(3,1.90625,.03125)):
            for candidate in (False,True):
                p,m=fixture();item=p["timeline"][index]
                source=.125+local;target=item["music_start"]+local+shift
                m[index]=build_multishot_map([dict(source_shot_time=source,
                    source_audio_attack_interval=[source-.01,source+.01],target_acoustic_hit_time=target)],
                    source_start=.125,source_end=2.625,target_start=item["music_start"],target_end=item["music_end"],
                    reviewed=True,source_sha256="a"*64)
                e=item["events"][0]
                e["source_audio_event"]=e["source_visual_event"]=source
                e["output_audio_event"]=e["output_visual_event"]=item["output_start"]+m[index].map(local)
                if candidate:
                    item["candidate_events"]=[dict(time=source,attack_interval=[source-.001,source+.001],confirmed=False)]
                else:item["candidate_events"]=[]
                # Demonstrate honest 1x version would allow this supplied clock.
                old=copy.deepcopy(p)
                for row in old["timeline"]:
                    for event in row["events"]:
                        event["output_audio_event"]=row["output_start"]+event["source_audio_event"]-row["source_start"]
                        event["output_visual_event"]=row["output_start"]+event["source_visual_event"]-row["source_start"]
                validate_plan(old,RenderConfig(width=128,height=72,fps=30,style="authored-footage"))
                with self.subTest(index=index,candidate=candidate),self.assertRaisesRegex(ValueError,"protected candidate|protected event"):
                    validate_plan(p,self.config,multishot_maps=m)

    def test_mapped_v2_impact_candidate_nonpromotion_and_wrong_1x_anchor(self):
        p,m=fixture();before=copy.deepcopy(p)
        candidate=p["timeline"][1]["candidate_events"][0]
        t=2.5+m[1].map(candidate["time"]-.125)
        self.assertGreater(abs(t-3.5),1/30)
        p["authored_design"]["impacts"]=[dict(clip_index=1,output_time=t,frames=8,strength=.8),
            dict(clip_index=0,output_time=1.375,frames=8,strength=.5)]
        expected=copy.deepcopy(p)
        rows=validate_plan(p,self.config,multishot_maps=m)
        self.assertEqual(p,expected)
        self.assertEqual(rows[1]["events"],validate_plan(before,self.config,multishot_maps=m)[1]["events"])
        self.assertEqual(rows[1]["authored_impacts"][0]["center_frame"],_rounded(t,30)-75)
        self.assertNotIn("confirmed",rows[1]["authored_impacts"][0])
        self.assertFalse(candidate["confirmed"])
        p["authored_design"]["impacts"][0]["output_time"]=3.5
        with self.assertRaisesRegex(ValueError,"lacks"):validate_plan(p,self.config,multishot_maps=m)

    def test_optional_candidate_clocks_mapped_validated_guarded_not_promoted(self):
        p,m=fixture();c=p["timeline"][1]["candidate_events"][0]
        c["source_audio_event"]=1.375;c["source_visual_event"]=1.5
        c["output_audio_event"]=2.5+m[1].map(1.25)
        c["output_visual_event"]=2.5+m[1].map(1.375)
        p["authored_design"]["impacts"]=[dict(clip_index=1,output_time=c["output_visual_event"],frames=8,strength=.5)]
        before=copy.deepcopy(p);rows=validate_plan(p,self.config,multishot_maps=m)
        self.assertEqual(p,before);self.assertEqual(len(rows[1]["events"]),1);self.assertFalse(c["confirmed"])
        for key,value in (("source_audio_event",float("nan")),("source_visual_event",3.),
                          ("output_audio_event",3.75),("output_visual_event",True)):
            q=copy.deepcopy(p);q["timeline"][1]["candidate_events"][0][key]=value
            with self.subTest(key=key),self.assertRaises(ValueError):validate_plan(q,self.config,multishot_maps=m)
        for index,source in ((1,2.5),(2,.2),(3,2.4)):
            q,maps=fixture();q["timeline"][index]["candidate_events"][0]["source_visual_event"]=source
            with self.subTest(index=index),self.assertRaisesRegex(ValueError,"candidate clock"):
                validate_plan(q,self.config,multishot_maps=maps)

    def test_graph_order_exact_single_mapped_cfr_base(self):
        p,m=fixture();rows=validate_plan(p,self.config,multishot_maps=m)
        for row in rows:
            base=_video_filter(row,self.config)
            graph=video_graph(base,row,self.config)
            self.assertEqual(graph.count("fps=30:start_time=0"),1)
            self.assertEqual(graph.count("pow("),base.count("pow("))
            self.assertLess(graph.index("fps=30:start_time=0"),graph.index("[base]"))
            self.assertLessEqual(graph.count("zoompan="),1)
            self.assertIn(f"trim=end_frame={row['frame_count']}",graph)
        self.assertEqual(sum(r["frame_count"] for r in rows),300)

    def test_version_bounds_unchanged_and_config_bounds(self):
        for version,count,duration in (("v1",4,12.),("v2",24,50.)):
            p,m=fixture(count=count,length=duration/count,version=version,shift=0.)
            # Reuse identity maps here to exercise bounds without speed feasibility.
            for i,item in enumerate(p["timeline"]):
                m[i]=build_multishot_map([dict(source_shot_time=1.375,source_audio_attack_interval=[1.325,1.425],
                    target_acoustic_hit_time=item["music_start"]+1.25)],source_start=.125,
                    source_end=item["source_end"],target_start=item["music_start"],target_end=item["music_end"],
                    reviewed=True,source_sha256="a"*64)
                e=item["events"][0];e["output_audio_event"]=e["output_visual_event"]=item["output_start"]+1.25
            validate_plan(p,self.config,multishot_maps=m)
            with self.assertRaises(ValueError):validate_plan(p,RenderConfig(style="multishot-authored",fps=30,max_duration=9),multishot_maps=m)
        for version,count,length in (("v1",9,2.5),("v1",4,3.25),("v2",25,2.5),("v2",4,13.)):
            p,m=fixture(count=count,length=length,version=version)
            with self.subTest(version=version,count=count),self.assertRaises(ValueError):validate_plan(p,self.config,multishot_maps=m)


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"),"local FFmpeg required")
class CombinedSyntheticFFmpegTests(unittest.TestCase):
    def ff(self,args):
        p=subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-nostdin"]+args,capture_output=True,timeout=90)
        self.assertEqual(p.returncode,0,p.stderr.decode(errors="replace"));return p.stdout

    def test_four_clip_combined_identical_mapped_audio_changed_video_full_decode(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);source=root/"synthetic.mkv";music=root/"synthetic-music.wav"
            self.ff(["-f","lavfi","-i","testsrc2=size=128x72:rate=30:duration=11",
                "-f","lavfi","-i","sine=frequency=421:sample_rate=48000:duration=11",
                "-map","0:v","-map","1:a","-c:v","ffv1","-c:a","pcm_s16le",str(source)])
            self.ff(["-f","lavfi","-i","anoisesrc=sample_rate=48000:duration=11:seed=7:amplitude=0.05","-c:a","pcm_s16le",str(music)])
            digest=hashlib.sha256(source.read_bytes()).hexdigest()
            p,m=fixture(sources=[source]*4,digest=digest)
            # Four nonoverlapping source ranges; preserve exact local map inputs.
            for i,item in enumerate(p["timeline"]):
                offset=i*2.5;item["source_start"]+=offset;item["source_end"]+=offset
                for e in item["events"]:e["source_audio_event"]+=offset;e["source_visual_event"]+=offset
                for c in item["candidate_events"]:c["time"]+=offset;c["attack_interval"]=[x+offset for x in c["attack_interval"]]
                m[i]=build_multishot_map([dict(source_shot_time=item["source_start"]+1.25,
                    source_audio_attack_interval=[item["source_start"]+1.2,item["source_start"]+1.3],
                    target_acoustic_hit_time=item["music_start"]+1.375)],source_start=item["source_start"],source_end=item["source_end"],
                    target_start=item["music_start"],target_end=item["music_end"],reviewed=True,source_sha256=digest)
            p["authored_design"]["impacts"]=[dict(clip_index=0,output_time=1.375,frames=8,strength=.8),
                dict(clip_index=1,output_time=2.5+m[1].map(1.),frames=8,strength=.5)]
            cfg=dict(width=128,height=72,fps=30,quality=12,timeout=90)
            with self.assertRaisesRegex(ValueError,"SHA256 does not match"):
                bad={i:dict(v.manifest(),source_sha256="0"*64) for i,v in m.items()}
                render_encounters(p,music,root/"wrong-hash",config=RenderConfig(style="multishot-authored",**cfg),multishot_maps=bad)
            self.assertFalse((root/"wrong-hash").exists())
            base=copy.deepcopy(p);base.pop("authored_design")
            a=render_encounters(base,music,root/"mapped",config=RenderConfig(style="multishot",**cfg),multishot_maps=m)
            b=render_encounters(p,music,root/"combined",config=RenderConfig(style="multishot-authored",**cfg),multishot_maps=m)
            self.assertEqual((a["frame_count"],a["sample_count"]),(300,480000))
            for k in ("frame_count","sample_count","video_duration","audio_duration","music_start_sample"):
                self.assertEqual(a[k],b[k])
            for k in ("game_stem","music_stem"):
                self.assertEqual(self.ff(["-i",a[k],"-f","s16le","pipe:1"]),self.ff(["-i",b[k],"-f","s16le","pipe:1"]))
            source_music=self.ff(["-i",str(music),"-ac","2","-ar","48000","-f","s16le","pipe:1"])
            first=b["music_start_sample"]
            actual_music=self.ff(["-i",b["music_stem"],"-f","s16le","pipe:1"])
            self.assertEqual(actual_music,source_music[first*4:(first+480000)*4])
            for stem in ("game_stem","music_stem"):
                with wave.open(b[stem],"rb") as wav:
                    self.assertEqual((wav.getnframes(),wav.getframerate(),wav.getnchannels(),wav.getsampwidth()),(480000,48000,2,2))
            for ca,cb in zip(a["chunks"],b["chunks"]):
                self.assertEqual(ca["audio_segments"],cb["audio_segments"])
                self.assertEqual(ca["multishot_map"],cb["multishot_map"])
                self.assertEqual(cb["authored_design"],p["authored_design"])
                self.assertEqual(cb["combined_limitations"],b["combined_limitations"])
                self.assertNotIn("_multishot_mapping",cb)
            self.assertEqual(b["authored_design"],p["authored_design"])
            self.assertEqual(len(b["multishot_maps"]),4)
            self.assertIn("pending",b["combined_style_policy"])
            self.assertTrue(b["authored_limitations"] and b["multishot_limitations"])
            persisted=json.loads(Path(b["manifest_path"]).read_text())
            self.assertEqual(persisted["style"],"multishot-authored")
            pixels=[]
            for result in (a,b):
                self.ff(["-i",result["output"],"-f","null","-"])
                raw=self.ff(["-i",result["output"],"-an","-pix_fmt","rgb24","-f","rawvideo","pipe:1"])
                self.assertEqual(len(raw),300*128*72*3);pixels.append(raw)
            self.assertNotEqual(*pixels)
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(),digest)
            # Synthetic identity-change injection, not an assertion that media
            # mutated on disk. Exercise the combined fail-closed after gate.
            identities=b["media_content_identities"];changed=copy.deepcopy(identities)
            changed[str(source.resolve())]["sha256"]="f"*64
            with patch("aive.encounter_render.capture_media_identities",side_effect=[identities,changed]):
                with self.assertRaisesRegex(RenderError,"content changed"):
                    render_encounters(p,music,root/"mutation-test",config=RenderConfig(style="multishot-authored",**cfg),multishot_maps=m)
            self.assertEqual(list((root/"mutation-test").rglob("render-manifest.json")),[])


if __name__=="__main__":unittest.main()
