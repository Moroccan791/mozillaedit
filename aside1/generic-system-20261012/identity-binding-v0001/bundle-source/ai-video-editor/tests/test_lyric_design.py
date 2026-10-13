"""Synthetic structural/typography tests, NOT actual song or alignment truth."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import wave
from unittest.mock import patch

from aive.lyric_track import audio_sha256, load_lyric_track, LyricTrack, discover_licensed_fonts
from aive.lyric_design import (compile_lyric_design, LyricDesignError,
                               normalize_lyric_color, with_lyric_colors)


class LyricDesignTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.music = Path(self.tmp.name) / "selected-music.wav"
        with wave.open(str(self.music), "wb") as w:
            w.setparams((1, 2, 8000, 0, "NONE", "not compressed"))
            w.writeframes(b"\0\0"*80000)
        self.track_doc = {"schema": "lyric-track/v1", "audio_sha256": audio_sha256(self.music),
                          "provenance": {"alignment_verified": True, "method": "synthetic words, not sung"},
                          "words": [{"text": "SHAPE", "start": 1.001, "end": 1.999},
                                    {"text": "LIGHT", "start": 2.0, "end": 2.9},
                                    {"text": "quiet", "start": 3.0, "end": 3.8},
                                    {"text": "form", "start": 3.9, "end": 4.8}]}
        with patch("aive.lyric_track.decoded_audio_duration", return_value=10):
            self.track = load_lyric_track(self.track_doc, self.music)
        self.doc = {"schema": "lyric-design/v1", "enabled": True,
                    "source": {"music_source": str(self.music.resolve()), "audio_sha256": self.track.audio_sha256},
                    "excerpt": {"music_start_sample": 8000, "sample_rate": 8000, "sample_count": 40000, "output_start": 2},
                    "canvas": {"width": 1280, "height": 720, "mode": "diagnostic"},
                    "visual_impacts": [], "protected_zones": [], "allow_impact_collision": False,
                    "allow_protected_overlap": False,
                    "moments": [{"id": "shape", "word_indices": [0], "role": "giant_word", "font_family": "Bebas Neue",
                                 "palette": "ice", "box": [.1, .15, .8, .6], "size": .15, "opacity": .65,
                                 "animation": {"entrance_ms": 120, "exit_ms": 100, "from_scale": 1.1,
                                               "echo_offset": [0, 0], "glow": .003}}]}

    def compile(self, doc=None):
        return compile_lyric_design(self.track, self.doc if doc is None else doc)

    def test_selected_words_only_and_music_clock(self):
        result = self.compile()
        self.assertIn("SHAPE", result.ass)
        for unselected in ("LIGHT", "quiet", "form"):
            self.assertNotIn(unselected, result.ass)
        event = result.audit["moments"][0]
        self.assertEqual(event["original_word_indices"], [0])
        self.assertEqual(event["output_centiseconds"], [201, 299])
        self.assertIn("0:00:02.01,0:00:02.99", result.ass)
        self.assertEqual(result.audit["source"]["audio_sha256"], self.track.audio_sha256)
        json.dumps(result.audit, allow_nan=False)

    def test_long_candidate_protection_bound_preserves_all_times(self):
        d=copy.deepcopy(self.doc)
        d['visual_impacts']=[i/1000 for i in range(1000)]
        d['moments'][0]['role']='quiet_italic'
        d['moments'][0]['size']=.04
        d['moments'][0]['animation']['glow']=0
        result=self.compile(d)
        self.assertEqual(result.audit['visual_impacts'],d['visual_impacts'])
        self.assertEqual(len(result.audit['visual_impacts']),1000)
        d['visual_impacts']=[i/1000 for i in range(4097)]
        with self.assertRaises(LyricDesignError):self.compile(d)

    def test_custom_maroon_and_hex_colors_render_correct_ass_channels(self):
        d=with_lyric_colors(self.doc,'maroon',glow_color='#AB1234')
        result=self.compile(d)
        self.assertIn(r'\1c&H000080&',result.ass)
        self.assertIn(r'\1c&H3412AB&',result.ass)
        self.assertEqual(result.audit['moments'][0]['resolved_colors'],
                         {'primary':'#800000','accent':'#AB1234'})
        self.assertEqual(self.doc['moments'][0]['palette'],'ice')
        self.assertEqual(result.audit['moments'][0]['output_centiseconds'],[201,299])
        for value, expected in (('#abcdef','ABCDEF'),('123456','123456'),('Red','FF0000')):
            self.assertEqual(normalize_lyric_color(value),expected)
        d['moments'][0]['palette']='maroon'
        self.assertIn(r'\1c&H000080&',self.compile(d).ass)

    def test_color_overrides_preserve_guards_and_select_specific_moments(self):
        d=copy.deepcopy(self.doc)
        second=copy.deepcopy(d['moments'][0]);second.update(id='light',word_indices=[1])
        d['moments'].append(second)
        before=copy.deepcopy(d)
        changed=with_lyric_colors(d,'#7B122A',moment_ids=['light'])
        self.assertEqual(d,before)
        self.assertEqual(changed['moments'][0]['palette'],'ice')
        self.assertEqual(changed['moments'][1]['palette'],{'primary':'#7B122A','accent':'#7B122A'})
        for key in ('visual_impacts','protected_zones','allow_impact_collision','allow_protected_overlap','excerpt'):
            self.assertEqual(changed[key],d[key])

    def test_custom_colors_reject_injection_malformed_and_unknown_ids(self):
        for value in (None,True,123,[],{},'#FFF','#12345678','rgb(255,0,0)',r'FF0000}\pos(0,0)','not-a-color'):
            with self.subTest(value=value), self.assertRaises(LyricDesignError):
                normalize_lyric_color(value)
        for palette in ({'primary':'red'}, {'primary':'red','accent':'white','tags':'x'},
                        {'primary':'red','accent':[]}, []):
            d=copy.deepcopy(self.doc);d['moments'][0]['palette']=palette
            with self.assertRaises(LyricDesignError):self.compile(d)
        for ids in ([],['missing'],['shape','shape'],[True]):
            with self.assertRaises(LyricDesignError):with_lyric_colors(self.doc,'red',moment_ids=ids)

    def test_no_unvalidated_track_or_gameplay_audio_lineage(self):
        fake = LyricTrack(self.music, self.track.audio_sha256, 10, self.track.words, "unverified")
        with self.assertRaises(LyricDesignError):
            compile_lyric_design(fake, self.doc)
        d = copy.deepcopy(self.doc)
        d["source"]["music_source"] = str(Path(self.tmp.name)/"raw-gameplay.mp4")
        with self.assertRaisesRegex(LyricDesignError, "lineage"):
            self.compile(d)
        d["source"] = dict(self.doc["source"], audio_sha256="f"*64)
        with self.assertRaises(LyricDesignError):
            self.compile(d)
        self.music.write_bytes(b"changed")
        with self.assertRaisesRegex(LyricDesignError, "changed"):
            self.compile()

    def test_clipped_boundary_is_omitted_not_retimed(self):
        for first, count in ((12000, 36000), (8000, 4000)):
            d = copy.deepcopy(self.doc)
            d["excerpt"].update(music_start_sample=first, sample_count=count)
            result = self.compile(d)
            self.assertNotIn("Dialogue:", result.ass)
            self.assertEqual(result.audit["moments"][0]["reason"], "clipped_boundary_word")

    def test_protected_gameplay_boxes_and_impact_collision(self):
        d = copy.deepcopy(self.doc)
        d["canvas"]["mode"] = "gameplay"
        self.assertEqual(self.compile(d).audit["moments"][0]["reason"], "protected_gameplay_zone")
        d["allow_protected_overlap"] = True
        self.assertIn("Dialogue:", self.compile(d).ass)
        d["visual_impacts"] = [2.5]
        self.assertEqual(self.compile(d).audit["moments"][0]["reason"], "visual_impact_collision")
        d["allow_impact_collision"] = True
        self.assertIn("Dialogue:", self.compile(d).ass)

    def test_echo_and_italic_are_generated_controlled_tags(self):
        d = copy.deepcopy(self.doc)
        m = d["moments"][0]
        m["role"] = "accent_echo"
        m["animation"]["echo_offset"] = [.015, -.015]
        result = self.compile(d)
        self.assertEqual(result.ass.count("Dialogue:"), 3)
        for tag in (r"\t(0,120,\fscx100\fscy100)", r"\fad(120,100)", r"\blur", r"\pos", r"\clip("):
            self.assertIn(tag, result.ass)
        m.update(role="quiet_italic", word_indices=[2, 3], font_family="Oswald", size=.04)
        m["animation"].update(echo_offset=[0, 0], glow=0)
        result = self.compile(d)
        self.assertIn("quiet form", result.ass)
        self.assertIn(r"\i1", result.ass)

    def test_serif_fails_closed_without_bundled_font(self):
        d = copy.deepcopy(self.doc)
        d["moments"][0].update(role="quiet_serif", font_family="Libre Baskerville", size=.04)
        with self.assertRaisesRegex(LyricDesignError, "unavailable"):
            compile_lyric_design(self.track, d, fonts_root=self.tmp.name)

    def test_strict_json_schema_and_injection(self):
        mutations = [lambda d: d.update(enabled=False), lambda d: d.update(raw_clip="x.mp4"),
                     lambda d: d.update(tags=r"\pos(0,0)"), lambda d: d["moments"][0].update(text="invented"),
                     lambda d: d["moments"][0].update(font_family="Bebas Neue}\\pos(0,0)"),
                     lambda d: d["moments"][0].update(palette="FFFFFF}"),
                     lambda d: d["moments"][0].update(id="bad,inject"),
                     lambda d: d["moments"][0].update(opacity=float("nan")),
                     lambda d: d["moments"][0].update(size=True),
                     lambda d: d["moments"][0].update(size=.41),
                     lambda d: d["moments"][0].update(box=[.8, 0, .8, .2]),
                     lambda d: d["moments"][0].update(word_indices=[True]),
                     lambda d: d["moments"][0].update(word_indices=[99]),
                     lambda d: d["moments"][0].update(word_indices=[2, 0]),
                     lambda d: d["moments"][0]["animation"].update(from_scale=2),
                     lambda d: d["moments"][0]["animation"].update(entrance_ms=301),
                     lambda d: d["moments"][0]["animation"].update(echo_offset=[.5, 0]),
                     lambda d: d.update(allow_protected_overlap=1),
                     lambda d: d.update(moments=[]),
                     lambda d: d["excerpt"].update(sample_count=800000)]
        for mutation in mutations:
            d = copy.deepcopy(self.doc)
            mutation(d)
            with self.subTest(d=d), self.assertRaises(LyricDesignError):
                self.compile(d)

    def test_text_box_overflow_missing_glyph_and_long_phrase(self):
        d = copy.deepcopy(self.doc)
        d["moments"][0]["box"] = [.1, .1, .05, .05]
        with self.assertRaisesRegex(LyricDesignError, "exceed"):
            self.compile(d)
        from dataclasses import replace
        from aive.lyric_track import LyricWord
        modified = replace(self.track, words=(LyricWord("漢", 1.001, 1.999),)+self.track.words[1:])
        with self.assertRaisesRegex(LyricDesignError, "glyph"):
            compile_lyric_design(modified, self.doc)

    def test_tiny_event_omitted_and_animation_bounded_by_lifetime(self):
        from dataclasses import replace
        from aive.lyric_track import LyricWord
        modified = replace(self.track, words=(LyricWord("SHAPE", 1.001, 1.009),)+self.track.words[1:])
        result = compile_lyric_design(modified, self.doc)
        self.assertNotIn("Dialogue:", result.ass)
        modified = replace(self.track, words=(LyricWord("SHAPE", 1.01, 1.1),)+self.track.words[1:])
        with self.assertRaisesRegex(LyricDesignError, "lifetime"):
            compile_lyric_design(modified, self.doc)


if __name__ == "__main__":
    unittest.main()
