"""Generic workflow proofs. Synthetic words are NOT sung-word/aesthetic review."""
import copy
from dataclasses import asdict
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import wave
from unittest.mock import patch

from aive.encounter_render import RenderConfig
from aive.lyric_track import LicensedFont, LyricValidationError, audio_sha256, discover_licensed_fonts
from aive.lyric_workflow import (SparseTypographyPolicy, prepare_lyrics,
                                 apply_prepared_lyrics, extract_lyric_candidates)


class LyricWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="aive-lyric-workflow-")
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.song = self.root / "arbitrary-song-A.wav"
        self.song.write_bytes(b"selected music A, mock duration only")
        self.config = RenderConfig(width=1280, height=720, fps=30, sample_rate=8000)
        self.plan = self.make_plan(1.)
        self.track_doc = self.make_track(self.song, 1.)
        self.track_path = self.root / "supplied-track.json"
        self.track_path.write_text(json.dumps(self.track_doc), encoding="utf-8")
        self.fonts_root = self.root / "fonts"
        self.fonts_root.mkdir()
        license_file = self.fonts_root / "OFL.txt"
        license_file.write_text("SIL OPEN FONT LICENSE synthetic fixture", encoding="utf-8")
        self.fonts = []
        for name in ("Oswald", "Bebas Neue"):
            font = self.fonts_root / f"{name}-Regular.ttf"
            font.write_bytes(b"synthetic licensed face")
            self.fonts.append(LicensedFont(name, font, license_file))
        self.addCleanup(patch.stopall)
        patch("aive.lyric_track.decoded_audio_duration", return_value=30.).start()
        patch("aive.lyric_track.discover_licensed_fonts", return_value=tuple(self.fonts)).start()
        patch("aive.lyric_design._font_metrics", return_value=(1.8, 1.)).start()

    def make_plan(self, start):
        return dict(schema_version="encounters/v1", music_continuous=True, gaps=[],
                    duration=4., requested_duration=4., music_start=start, music_end=start+4.,
                    timeline=[dict(source=str(self.root/"source.mp4"), source_start=20., source_end=24.,
                                   output_start=0., output_end=4., music_start=start, music_end=start+4., speed=1.)])

    def make_track(self, song, start):
        return dict(schema="lyric-track/v1", audio_sha256=audio_sha256(song),
                    provenance=dict(alignment_verified=True, method="synthetic independently supplied assertion"),
                    words=[dict(text="LEFT_PARTIAL", start=start-.1, end=start+.1),
                           dict(text="EMBER", start=start+.2, end=start+.6),
                           dict(text="river", start=start+.65, end=start+.9),
                           dict(text="ORBIT", start=start+1.6, end=start+2.),
                           dict(text="fleeting", start=start+2.1, end=start+2.3),
                           dict(text="STARS", start=start+3., end=start+3.4),
                           dict(text="RIGHT_PARTIAL", start=start+3.95, end=start+4.1)])

    def prepare(self, **kwargs):
        defaults = dict(song=self.song, plan=self.plan, config=self.config, job=self.root/"jobs",
                        lyric_track=self.track_path, fonts_root=self.fonts_root)
        return prepare_lyrics(**(defaults | kwargs))

    def manifest(self, prepared):
        return dict(schema_version="encounter-render/v1", music_source=prepared.song,
                    config=asdict(self.config), music_start_sample=prepared.excerpt["music_start_sample"],
                    plan_duration=4., chunks=[], authored_design=prepared.authored_design,
                    output=str(self.root/"original.mp4"), game_stem=str(self.root/"game.wav"),
                    music_stem=str(self.root/"music.wav"))

    def design(self, prepared):
        return json.loads(Path(prepared.design_path).read_text(encoding="utf-8"))

    def test_two_arbitrary_songs_excerpts_and_nonzero_source_clock(self):
        a = self.prepare()
        song_b = self.root/"another-song-B.wav"
        song_b.write_bytes(b"different exact selected music B")
        b = self.prepare(song=song_b, plan=self.make_plan(9.25), lyric_track=self.make_track(song_b, 9.25))
        self.assertNotEqual(a.audio_sha256, b.audio_sha256)
        self.assertEqual(a.excerpt["music_start_sample"], 8000)
        self.assertEqual(b.excerpt["music_start_sample"], 74000)
        self.assertEqual(a.audit["design"]["moments"][0]["output_centiseconds"], [20, 60])
        self.assertEqual(b.audit["design"]["moments"][0]["output_centiseconds"], [20, 60])
        for prepared in (a, b):
            self.assertEqual(len(self.design(prepared)["moments"]), 3)
            self.assertFalse(prepared.audit["perceptual_approval"])
            json.dumps(prepared.to_dict(), allow_nan=False)

    def test_sparse_original_indices_partial_words_omitted_no_caption_stream(self):
        prepared = self.prepare()
        indices = [m["word_indices"] for m in self.design(prepared)["moments"]]
        self.assertEqual(indices, [[1], [3], [5]])
        for word in ("LEFT_PARTIAL", "RIGHT_PARTIAL", "river", "fleeting"):
            self.assertNotIn(word, [m["text"] for m in prepared.audit["design"]["moments"]])
        explicit = self.prepare(policy=SparseTypographyPolicy(accent_word_indices=(3,), max_moments=1))
        self.assertEqual(self.design(explicit)["moments"][0]["word_indices"], [3])
        with self.assertRaises(LyricValidationError):
            self.prepare(policy=SparseTypographyPolicy(accent_word_indices=(0,)))

    def test_wrong_missing_hash_or_provenance_and_candidates_fail_closed(self):
        cases = []
        for key in ("audio_sha256", "provenance", "schema"):
            doc = copy.deepcopy(self.track_doc); del doc[key]; cases.append(doc)
        doc = copy.deepcopy(self.track_doc); doc["audio_sha256"] = "a"*64; cases.append(doc)
        for value in (False, "true", 1, None):
            doc = copy.deepcopy(self.track_doc); doc["provenance"]["alignment_verified"] = value; cases.append(doc)
        doc = copy.deepcopy(self.track_doc); doc["schema"] = "music-lyric-candidates/v1"; cases.append(doc)
        for doc in cases:
            with self.subTest(doc=doc), self.assertRaises(LyricValidationError):
                self.prepare(lyric_track=doc)
        self.assertFalse((self.root/"jobs").exists())

    def test_candidate_both_clocks_intervals_and_confirmed_both_clocks_preserved(self):
        p = copy.deepcopy(self.plan)
        row = p["timeline"][0]
        event = dict(source=row["source"], confirmed=True, source_audio_event=20.2,
                     source_visual_event=20.8, output_audio_event=.2, output_visual_event=.8)
        candidate = dict(confirmed=False, time=21.6, attack_interval=[21.55, 21.7],
                         source_audio_event=21.6, source_visual_event=22.,
                         output_audio_event=1.6, output_visual_event=2.)
        row.update(events=[event], candidate_events=[candidate])
        before = copy.deepcopy(p)
        prepared = self.prepare(plan=p)
        for t in (.2, .8, 1.6, 2., 1.55, 1.7):
            self.assertTrue(any(abs(v-t) < 1e-7 for v in prepared.protected_impacts))
        self.assertEqual(p, before)
        self.assertIs(p["timeline"][0]["candidate_events"][0]["confirmed"], False)
        self.assertEqual(self.design(prepared)["moments"][0]["word_indices"], [5])
        with self.assertRaises(LyricValidationError):
            self.prepare(plan=p, policy=SparseTypographyPolicy(accent_word_indices=(3,)))

    def test_many_candidate_protections_not_truncated_and_long_intervals_have_no_holes(self):
        from aive.lyric_workflow import protected_output_events
        plan = dict(timeline=[])
        for row_index in range(6):
            row = dict(source_start=20., source_end=50., output_start=30.*row_index,
                       output_end=30.*(row_index+1), candidate_events=[])
            for i in range(28):
                t = 20.5+i
                row["candidate_events"].append(dict(confirmed=False,time=t,attack_interval=[t-.04,t+.04],
                    output_audio_event=30.*row_index+t-20., output_visual_event=30.*row_index+t-20.+.1))
            plan["timeline"].append(row)
        impacts = protected_output_events(plan, self.config)
        self.assertGreater(len(impacts),256)
        for row in plan["timeline"]:
            for candidate in row["candidate_events"]:
                for t in (candidate["output_audio_event"],candidate["output_visual_event"]):
                    self.assertTrue(any(abs(t-v)<1e-7 for v in impacts))
        p = copy.deepcopy(self.plan)
        p["timeline"][0]["candidate_events"] = [dict(confirmed=False,time=20.2,attack_interval=[20.1,22.4])]
        protected = protected_output_events(p,self.config)
        self.assertTrue(any(abs(t-1.7) <= .2 for t in protected))
        prepared = self.prepare(plan=p)
        self.assertEqual(self.design(prepared)["moments"][0]["word_indices"],[5])

    def test_selected_video_song_forbidden_before_decode(self):
        with patch("aive.lyric_track.load_lyric_track") as load:
            with self.assertRaisesRegex(LyricValidationError,"audio-only"):
                self.prepare(song=self.root/"gameplay.mp4")
        load.assert_not_called()

    def test_authored_v2_impacts_full_window_preserved(self):
        p = copy.deepcopy(self.plan)
        p["timeline"] = []
        for i in range(4):
            p["timeline"].append(dict(source=str(self.root/f"source-{i}.mp4"), source_start=20., source_end=21.,
                output_start=float(i), output_end=float(i+1), music_start=float(i+1), music_end=float(i+2), speed=1.))
        p["timeline"][1]["candidate_events"] = [dict(confirmed=False, time=20.5, attack_interval=[20.48, 20.52])]
        p["authored_design"] = dict(schema_version="authored-footage/v2",
            shots=[dict(role=r, composition="inset" if r=="contrast" else "full") for r in ("setup", "impact", "contrast", "payoff")],
            bridges=[dict(boundary=3, direction="right", frames=2)], ending=dict(fade_frames=2),
            impacts=[dict(clip_index=1, output_time=1.5, frames=6, strength=.5)])
        config = RenderConfig(width=1280, height=720, fps=30, sample_rate=8000, style="authored-footage")
        prepared = self.prepare(plan=p, config=config)
        self.assertEqual(prepared.authored_design, p["authored_design"])
        for t in (1.5, 43/30, 48/30):
            self.assertTrue(any(abs(t-v)<1e-7 for v in prepared.protected_impacts))

    def test_authored_design_wrong_clock_canvas_or_missing_protection_rejected(self):
        prepared = self.prepare()
        d = self.design(prepared)
        for key, subkey, value in (("source", "audio_sha256", "f"*64), ("excerpt", "output_start", 1),
                                   ("excerpt", "music_start_sample", 0), ("canvas", "mode", "diagnostic")):
            bad = copy.deepcopy(d); bad[key][subkey] = value
            with self.subTest(key=key), self.assertRaises(LyricValidationError):
                self.prepare(lyric_design=bad)
        p = copy.deepcopy(self.plan)
        p["timeline"][0]["candidate_events"] = [dict(confirmed=False,time=22.5,attack_interval=[22.4,22.6])]
        with self.assertRaisesRegex(LyricValidationError, "protection"):
            self.prepare(plan=p, lyric_design=d)

    def test_protected_forbidden_zones_unsafe_fonts_and_no_dialogue(self):
        prepared = self.prepare(); d = self.design(prepared)
        for box in ([.3,.3,.4,.3], [.75,.01,.2,.15], [.05,.83,.6,.16]):
            bad = copy.deepcopy(d)
            for m in bad["moments"]: m["box"] = box
            with self.assertRaisesRegex(LyricValidationError, "no complete"):
                self.prepare(lyric_design=bad)
        bad = copy.deepcopy(d); bad["protected_zones"] = [[.01,.01,.7,.2]]
        with self.assertRaisesRegex(LyricValidationError, "no complete"):
            self.prepare(lyric_design=bad)
        for family in ("Arial", r"Oswald}\pos(0,0)"):
            bad = copy.deepcopy(d); bad["moments"][0]["font_family"] = family
            with self.assertRaises(LyricValidationError): self.prepare(lyric_design=bad)
        with patch("aive.lyric_track.discover_licensed_fonts", return_value=()):
            with self.assertRaisesRegex(LyricValidationError, "no fallback"): self.prepare()
        for key in ("allow_impact_collision", "allow_protected_overlap"):
            bad = copy.deepcopy(d); bad[key] = True
            with self.assertRaises(LyricValidationError): self.prepare(lyric_design=bad)

    def test_snapshot_bounds_and_byte_preserved_originals(self):
        before_song, before_track = self.song.read_bytes(), self.track_path.read_bytes()
        a, b = self.prepare(), self.prepare()
        self.assertNotEqual(a.track_path, b.track_path)
        self.assertEqual(Path(a.track_path).read_bytes(), before_track)
        self.assertEqual(self.song.read_bytes(), before_song)
        self.assertEqual(self.track_path.read_bytes(), before_track)
        d = dict(self.track_doc, extra="x"*(2*1024*1024))
        with self.assertRaises(LyricValidationError): self.prepare(lyric_track=d)
        malformed = self.root/"malformed.json"; malformed.write_bytes(b'\xef\xbb\xbf{}')
        with self.assertRaises(LyricValidationError): self.prepare(lyric_track=malformed)

    def test_apply_delegates_audio_copy_without_mutating_manifest_or_stems(self):
        prepared = self.prepare(); manifest = self.manifest(prepared)
        for key in ("output", "game_stem", "music_stem"):
            Path(manifest[key]).write_bytes(key.encode())
        before = copy.deepcopy(manifest)
        original_bytes = {key: Path(manifest[key]).read_bytes() for key in ("output", "game_stem", "music_stem")}
        expected = dict(manifest, output="new-video.mp4", typography_audit=dict(audio_mode="copy"))
        with patch("aive.encounter_text.apply_verified_lyrics", return_value=expected) as apply:
            self.assertEqual(apply_prepared_lyrics(manifest, prepared), expected)
            self.assertEqual(apply.call_args.kwargs["fonts_root"], prepared.fonts_root)
            self.assertEqual(apply.call_args.kwargs["visual_impacts"], prepared.protected_impacts)
        self.assertEqual(manifest, before)
        self.assertEqual(original_bytes, {key: Path(manifest[key]).read_bytes() for key in original_bytes})

    def test_apply_rejects_changed_snapshot_music_fonts_manifest_before_burn(self):
        prepared = self.prepare(); manifest = self.manifest(prepared)
        for key, value in (("music_start_sample",0), ("plan_duration",3.), ("music_source",str(self.root/"other.wav")), ("authored_design",{})):
            bad = copy.deepcopy(manifest); bad[key] = value
            with patch("aive.encounter_text.apply_verified_lyrics") as apply, self.assertRaises(LyricValidationError):
                apply_prepared_lyrics(bad, prepared)
            apply.assert_not_called()
        manifest["chunks"] = [dict(events=[dict(output_audio_event=2.5,output_visual_event=2.6)])]
        with self.assertRaises(LyricValidationError): apply_prepared_lyrics(manifest, prepared)
        manifest["chunks"] = []
        for file in (Path(prepared.track_path), Path(prepared.design_path), self.song, self.fonts[0].file, self.fonts[0].license_file):
            old = file.read_bytes(); file.write_bytes(old+b"change")
            with patch("aive.encounter_text.apply_verified_lyrics") as apply, self.assertRaises(LyricValidationError):
                apply_prepared_lyrics(manifest, prepared)
            apply.assert_not_called(); file.write_bytes(old)

    def test_candidate_extraction_snapshot_never_verifies_or_overwrites(self):
        doc = dict(schema="music-lyric-candidates/v1", status="UNVERIFIED", provenance=dict(alignment_verified=False), words=[])
        with patch("aive.music_lyrics.extract_music_lyric_candidates", return_value=doc) as extract:
            result = extract_lyric_candidates(self.song, self.root/"candidates")
            self.assertEqual(result["status"], "UNVERIFIED")
            self.assertIs(result["document"]["provenance"]["alignment_verified"], False)
            self.assertEqual(extract.call_args.kwargs["source_kind"], "music")
            with self.assertRaises(FileExistsError): extract_lyric_candidates(self.song, self.root/"candidates")
        from aive.music_lyrics import MusicLyricsUnavailable
        with patch("aive.music_lyrics.extract_music_lyric_candidates", side_effect=MusicLyricsUnavailable("no local model")):
            with self.assertRaises(MusicLyricsUnavailable): extract_lyric_candidates(self.song, self.root/"unavailable")
        self.assertFalse((self.root/"unavailable").exists())

    def test_invalid_sparse_budget_no_fallback(self):
        for kwargs in (dict(max_moments=0), dict(max_moments=64), dict(min_gap=0), dict(max_coverage=1),
                       dict(accent_word_indices=(True,)), dict(accent_word_indices=(1,1)), dict(font_family="Arial")):
            with self.assertRaises(LyricValidationError): SparseTypographyPolicy(**kwargs)
        doc = dict(self.track_doc, words=[dict(text="PARTIAL", start=.9, end=1.1)])
        with self.assertRaisesRegex(LyricValidationError, "no caption fallback"): self.prepare(lyric_track=doc)


class RealLyricWorkflowRenderTests(unittest.TestCase):
    def test_real_burn_exact_clock_originals_and_pcm_audio_preserved(self):
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            self.skipTest("local FFmpeg unavailable; no installation")
        if not {"Oswald", "Bebas Neue"} <= {f.family for f in discover_licensed_fonts()}:
            self.skipTest("local licensed fonts unavailable; no download")
        from aive.encounter_text import apply_verified_lyrics
        import inspect
        if "fonts_root" not in inspect.signature(apply_verified_lyrics).parameters:
            self.skipTest("existing renderer fonts_root integration pending")
        with tempfile.TemporaryDirectory(prefix="aive-real-lyrics-") as tmp:
            root = Path(tmp); song = root/"selected-song.wav"
            with wave.open(str(song), "wb") as w:
                w.setparams((1,2,8000,0,"NONE","not compressed")); w.writeframes(b"\x01\0"*48000)
            config = RenderConfig(width=640,height=360,fps=30,sample_rate=8000,quality=0,preset="ultrafast")
            plan = dict(schema_version="encounters/v1",music_continuous=True,gaps=[],duration=2.,requested_duration=2.,
                music_start=1.,music_end=3.,timeline=[dict(source=str(root/"source.mp4"),source_start=20.,source_end=22.,
                output_start=0.,output_end=2.,music_start=1.,music_end=3.,speed=1.)])
            track = dict(schema="lyric-track/v1",audio_sha256=audio_sha256(song),
                provenance=dict(alignment_verified=True,method="synthetic test fixture, not sung alignment"),
                words=[dict(text="SUN",start=1.2,end=1.6),dict(text="MOON",start=2.,end=2.2)])
            prepared = prepare_lyrics(song,plan,config,root,track,policy=SparseTypographyPolicy(max_moments=1))
            job = root/"render"; job.mkdir(); original=job/"encounters.mp4"
            subprocess.run([config.ffmpeg,"-v","error","-nostdin","-n","-f","lavfi","-i","color=c=black:s=640x360:r=30:d=2",
                "-i",str(song),"-map","0:v","-map","1:a","-t","2","-c:v","libx264","-preset","ultrafast","-crf","0",
                "-c:a","aac",str(original)],check=True,capture_output=True)
            original_hash=audio_sha256(original); song_hash=audio_sha256(song)
            game_stem=job/"game-stem.wav"; music_stem=job/"music-stem.wav"
            game_stem.write_bytes(b"unchanged game fixture"); music_stem.write_bytes(song.read_bytes())
            stem_bytes=[game_stem.read_bytes(),music_stem.read_bytes()]
            manifest=dict(schema_version="encounter-render/v1",job_dir=str(job),output=str(original),music_source=str(song),
                config=asdict(config),frame_count=60,video_duration=2.,plan_duration=2.,music_start_sample=8000,
                game_stem=str(game_stem),music_stem=str(music_stem),chunks=[])
            result=apply_prepared_lyrics(manifest,prepared)
            def pcm(file):
                return subprocess.run([config.ffmpeg,"-v","error","-i",str(file),"-map","0:a:0","-f","s16le","-c:a","pcm_s16le","pipe:1"],
                    check=True,capture_output=True).stdout
            self.assertEqual(pcm(original),pcm(result["output"]))
            self.assertEqual(audio_sha256(original),original_hash); self.assertEqual(audio_sha256(song),song_hash)
            self.assertEqual([game_stem.read_bytes(),music_stem.read_bytes()],stem_bytes)
            self.assertEqual(result["typography_audit"]["frame_count"],60)
            self.assertEqual(result["typography_audit"]["audio_mode"],"copy")


if __name__ == "__main__":
    unittest.main()
