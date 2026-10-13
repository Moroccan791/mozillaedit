"""Independent encounter planner invariants, no media/FFmpeg required."""
import json
import math
import unittest
from aive.beats import BeatInfo
from aive.music import MusicProfile, Section
from aive.encounters import group_encounters, plan_encounters


def event(source="a.mp4", a=5., v=None, confidence=.9, confirmed=True, sd=30.):
    return dict(source=source, source_audio_event=a, source_visual_event=a+.2 if v is None else v,
                confidence=confidence, confirmed=confirmed, source_duration=sd)


def beats(duration=30., start=0.):
    grid = [start+i*.5 for i in range(int((duration-start)*2)+1)]
    return BeatInfo(120., start, duration, beats=grid,
                    onsets=grid, onset_strengths=[.8]*len(grid))


class EncounterTests(unittest.TestCase):
    def check_plan(self, plan, info=None):
        json.dumps(plan, allow_nan=False)
        self.assertLessEqual(plan["duration"], plan["requested_duration"]+1e-8)
        self.assertEqual(plan["gaps"], [])
        prior, ranges = 0., {}
        for item in plan["timeline"]:
            self.assertAlmostEqual(item["output_start"], prior)
            self.assertAlmostEqual(item["music_start"], plan["music_start"]+prior)
            length = item["source_end"]-item["source_start"]
            self.assertAlmostEqual(length, item["output_end"]-item["output_start"])
            self.assertAlmostEqual(length, item["music_end"]-item["music_start"])
            self.assertEqual(item["speed"], 1.)
            if info:
                self.assertIn(item["anchor"]["music_time"], info.onsets)
                self.assertIn(item["music_end"], info.beats)
            for a, b in ranges.setdefault(item["source"], []):
                self.assertTrue(item["source_end"] <= a+1e-8 or item["source_start"] >= b-1e-8)
            ranges[item["source"]].append((item["source_start"], item["source_end"]))
            for e in item["events"]:
                self.assertTrue(e["confirmed"])
                self.assertGreaterEqual(min(e["source_audio_event"], e["source_visual_event"])-item["source_start"], .6-1e-8)
                self.assertGreaterEqual(item["source_end"]-max(e["source_audio_event"], e["source_visual_event"]), .5-1e-8)
                self.assertAlmostEqual(e["output_audio_event"]-item["output_start"], e["audio_offset"])
                self.assertAlmostEqual(e["output_visual_event"]-item["output_start"], e["visual_offset"])
            prior = item["output_end"]
        self.assertAlmostEqual(plan["duration"], prior)

    def test_two_files_and_multiple_encounters_no_reuse(self):
        events = [event(a=5), event(a=6.37), event(a=15), event("b.mp4", 4), event("b.mp4", 12)]
        info = beats()
        plan = plan_encounters(events, info, duration=30)
        self.assertEqual({i["source"] for i in plan["timeline"]}, {"a.mp4", "b.mp4"})
        self.assertEqual(sum(i["kill_count"] for i in plan["timeline"]), 5)
        self.check_plan(plan, info)
        self.assertLess(plan["duration"], 30)
        self.assertTrue(any("shorter" in w for w in plan["warnings"]))

    def test_multikill_audio_intervals_not_quantized(self):
        events = [event(a=5, confidence=.95), event(a=6.37), event(a=8.01)]
        info = beats()
        plan = plan_encounters(events, info, duration=10)
        self.assertEqual(len(plan["timeline"]), 1)
        item = plan["timeline"][0]
        self.assertEqual(item["kill_count"], 3)
        offsets = [e["audio_offset"] for e in item["events"]]
        self.assertAlmostEqual(offsets[1]-offsets[0], 1.37)
        self.assertAlmostEqual(offsets[2]-offsets[1], 1.64)
        self.assertNotIn(item["events"][1]["output_audio_event"], info.onsets)
        self.check_plan(plan, info)

    def test_group_gap_and_touch_merge(self):
        grouped = group_encounters([event(a=5), event(a=7.5), event(a=15)])
        self.assertEqual([g["kill_count"] for g in grouped], [2, 1])
        touching = group_encounters([event(a=5, v=6), event(a=7.9, v=8)], max_gap=.1)
        self.assertEqual(len(touching), 1)
        self.assertEqual(touching[0]["kill_count"], 2)

    def test_delayed_visual_evidence_is_never_clipped(self):
        plan = plan_encounters([event(a=5, v=7.2)], beats(), duration=10)
        self.assertEqual(len(plan["timeline"]), 1)
        self.check_plan(plan, beats())
        self.assertGreaterEqual(plan["timeline"][0]["source_end"], 7.9)

    def test_positive_filter_and_duplicates(self):
        events = [event(), event(confidence=.95), event(a=15, confirmed=False)]
        grouped = group_encounters(events)
        self.assertEqual(len(grouped), 1)
        self.assertEqual(grouped[0]["kill_count"], 1)
        self.assertEqual(grouped[0]["confidence"], .95)
        self.assertEqual(group_encounters([event(confirmed=False)]), [])

    def test_sparse_empty_and_no_onsets(self):
        for events in ([], [event(confirmed=False)]):
            plan = plan_encounters(events, beats(), duration=15)
            self.assertEqual(plan["duration"], 0)
            self.assertTrue(plan["warnings"])
        info = beats()
        info.onsets, info.onset_strengths = [], []
        plan = plan_encounters([event()], info, duration=15)
        self.assertEqual(plan["timeline"], [])
        self.assertTrue(any("no actual" in w for w in plan["warnings"]))

    def test_short_target_omits_intact_and_source_boundary_outcome(self):
        for events, duration in (([event(a=5), event(a=7)], 2.),
                                 ([event(a=29.4, v=29.9)], 10.),
                                 ([event(a=.1, v=.2)], 10.)):
            plan = plan_encounters(events, beats(), duration=duration)
            self.assertEqual(plan["timeline"], [])
            self.assertTrue(plan["omitted_encounters"])
        grouped = group_encounters([event(a=29.4, v=29.9)])
        self.assertEqual(grouped[0]["end"], 30)
        self.assertTrue(grouped[0]["warnings"])

    def test_absolute_music_start_and_explicit_accents(self):
        accents = [{"time": 10+i*.5, "strength": .8} for i in range(21)]
        plan = plan_encounters([event()], duration=10, music_start=10,
                               accents=accents, music_duration=20)
        self.assertTrue(plan["timeline"])
        self.check_plan(plan)
        self.assertGreaterEqual(plan["timeline"][0]["anchor"]["music_time"], 10)
        self.assertEqual(plan["music_start"], 10)

    def test_actual_irregular_beats_not_bpm_grid(self):
        info = BeatInfo(120, 0, 10, beats=[0, 1.1, 2.35, 3.77, 5.01, 7.1],
                        onsets=[1.31, 2.07], onset_strengths=[.1, .95])
        plan = plan_encounters([event()], info, duration=10)
        self.assertTrue(plan["timeline"])
        self.check_plan(plan, info)
        self.assertEqual(plan["timeline"][0]["anchor"]["music_time"], 2.07)

    def test_rank_high_confidence_multikill_and_section_strength(self):
        info = beats()
        profile = MusicProfile(duration=30, sections=[Section(0, 1.9, "low", .1),
                                                     Section(1.9, 30, "peak", .95)])
        plan = plan_encounters([event("weak", 5, confidence=.2),
                                event("strong", 5, confidence=.95), event("strong", 6.1)],
                               info, profile, duration=6)
        self.assertEqual(plan["timeline"][0]["source"], "strong")
        self.assertEqual(plan["timeline"][0]["section"], "peak")
        self.check_plan(plan, info)

    def test_track_end_cap(self):
        plan = plan_encounters([event()], beats(10), duration=30, music_start=7)
        self.assertLessEqual(plan["music_end"], 10)
        self.assertTrue(any("capped" in w for w in plan["warnings"]))
        self.check_plan(plan)

    def test_invalid_events(self):
        for key, value in (("confirmed", 1), ("confirmed", "true"), ("source", ""),
                           ("confidence", 1.1), ("confidence", -1), ("confidence", math.nan),
                           ("source_audio_event", -1), ("source_visual_event", 31),
                           ("source_duration", 0), ("source_audio_event", True)):
            bad = event()
            bad[key] = value
            with self.subTest(key=key, value=value), self.assertRaises(ValueError):
                group_encounters([bad])
        with self.assertRaises(ValueError):
            group_encounters([event(), event(sd=31)])
        with self.assertRaises(ValueError):
            group_encounters([{}])
        with self.assertRaises(ValueError):
            group_encounters([event()], lead=-1)

    def test_invalid_planner_inputs(self):
        for kwargs in ({"duration": 0}, {"duration": math.inf}, {"duration": 10, "music_start": -1},
                       {"duration": 10, "music_start": 30}, {"duration": 10, "max_extension": -1},
                       {"duration": 10, "accents": [1]}):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                plan_encounters([event()], beats(), **kwargs)
        for accents in ([{"time": 31}], [{"time": 1, "strength": 2}], [{"time": 1, "kind": "fake"}], [{}]):
            with self.assertRaises(ValueError):
                plan_encounters([event()], duration=10, accents=accents, music_duration=30)
        with self.assertRaises(ValueError):
            plan_encounters([event()], duration=10, accents=[1])
        info = beats()
        info.onset_strengths = [.5]
        with self.assertRaises(ValueError):
            plan_encounters([event()], info, duration=10)
        with self.assertRaises(ValueError):
            plan_encounters([event()], beats(), MusicProfile(duration=5), duration=10)


if __name__ == "__main__":
    unittest.main()
