"""Opt-in phrase fit and manual complete-fight context, no media required."""
import json
import math
import unittest
from unittest.mock import patch

from aive.beats import BeatInfo
from aive.music import MusicProfile, Section
from aive.encounters import (MAX_PHRASE_ONSET_CANDIDATES, _onset_candidates,
                             group_encounters, plan_encounters)


def event(source="a.mp4", a=5., v=5.2, **kwargs):
    result = dict(source=source, source_audio_event=a, source_visual_event=v,
                  confidence=.9, confirmed=True, source_duration=30.)
    result.update(kwargs)
    return result


def info(onsets=None, downbeats=None, boundaries=None, duration=15.):
    onsets = [1.2] if onsets is None else onsets
    return BeatInfo(137., .37, duration,
                    beats=[0., 2.1, 2.4, 2.8, 3.1, 4.5, 7., 10., 15.] if boundaries is None else boundaries,
                    downbeats=[] if downbeats is None else downbeats,
                    onsets=onsets, onset_strengths=[.8]*len(onsets))


class EncounterPhraseTests(unittest.TestCase):
    def check_plan(self, plan, beat_info):
        json.dumps(plan, allow_nan=False)
        prior = 0.
        ranges = {}
        for item in plan["timeline"]:
            self.assertAlmostEqual(item["output_start"], prior)
            self.assertAlmostEqual(item["music_start"], plan["music_start"] + prior)
            length = item["source_end"] - item["source_start"]
            self.assertAlmostEqual(length, item["output_end"] - prior)
            self.assertAlmostEqual(length, item["music_end"] - item["music_start"])
            self.assertEqual(item["speed"], 1.)
            self.assertIn(item["anchor"]["music_time"], beat_info.onsets)
            for a, b in ranges.setdefault(item["source"], []):
                self.assertTrue(item["source_end"] <= a+1e-8 or item["source_start"] >= b-1e-8)
            ranges[item["source"]].append((item["source_start"], item["source_end"]))
            for observation in item["events"]:
                self.assertGreaterEqual(min(observation["source_audio_event"], observation["source_visual_event"])-item["source_start"], .6-1e-8)
                self.assertGreaterEqual(item["source_end"]-max(observation["source_audio_event"], observation["source_visual_event"]), .5-1e-8)
                self.assertAlmostEqual(observation["output_audio_event"]-item["output_start"], observation["audio_offset"])
                if "encounter_start" in observation:
                    self.assertLessEqual(item["source_start"], observation["encounter_start"])
                    self.assertGreaterEqual(item["source_end"], observation["encounter_end"])
            prior = item["output_end"]
        self.assertAlmostEqual(plan["duration"], prior)
        self.assertLessEqual(prior, plan["requested_duration"]+1e-8)
        self.assertEqual(plan["gaps"], [])

    def test_default_and_explicit_false_equal_legacy_end(self):
        beat_info = info(downbeats=[3.1])
        default = plan_encounters([event()], beat_info, duration=10)
        self.assertEqual(default, plan_encounters([event()], beat_info, duration=10, phrase_aware=False))
        self.assertEqual(default["timeline"][0]["music_end"], 2.1)
        self.assertNotIn("phrase_aware", default)
        self.assertNotIn("boundary_provenance", default["timeline"][0])

    def test_supplied_irregular_downbeat_preferred_no_grid(self):
        beat_info = info(downbeats=[3.1])
        with patch.object(BeatInfo, "grid", side_effect=AssertionError("no grid")):
            plan = plan_encounters([event()], beat_info, duration=10, phrase_aware=True)
        item = plan["timeline"][0]
        self.assertEqual(item["music_end"], 3.1)
        self.assertEqual(item["boundary_provenance"]["music_end"]["kinds"], ["beat", "downbeat"])
        self.assertTrue(item["boundary_provenance"]["music_end"]["phrase_aligned"])
        self.assertEqual(item["anchor"]["provenance"]["kind"], "onset")
        self.assertEqual(item["phrase_fit_warnings"], [])
        self.check_plan(plan, beat_info)

    def test_section_boundary_can_be_nonbeat(self):
        beat_info = info()
        profile = MusicProfile(duration=15., sections=[Section(0., 2.93, "intro", .2), Section(2.93, 15., "peak", .9)])
        plan = plan_encounters([event()], beat_info, profile, duration=10, phrase_aware=True)
        item = plan["timeline"][0]
        self.assertEqual(item["music_end"], 2.93)
        self.assertEqual(item["boundary_provenance"]["music_end"]["kinds"], ["section_boundary"])
        self.check_plan(plan, beat_info)

    def test_impact_strength_prioritized_over_weaker_phrase_convenience(self):
        beat_info = info(onsets=[1.2, 2.7], downbeats=[3.1])
        beat_info.onset_strengths = [.1, 1.]
        plan = plan_encounters([event()], beat_info, duration=10, phrase_aware=True)
        self.assertEqual(plan["timeline"][0]["anchor"]["music_time"], 2.7)
        self.assertGreater(plan["timeline"][0]["music_end"], 3.1)
        self.assertFalse(plan["timeline"][0]["boundary_provenance"]["music_end"]["phrase_aligned"])
        self.check_plan(plan, beat_info)

    def test_missing_markers_and_infeasible_markers_fallback_with_proof(self):
        for downbeats in ([], [10.]):
            beat_info = info(downbeats=downbeats)
            plan = plan_encounters([event()], beat_info, duration=10, phrase_aware=True)
            item = plan["timeline"][0]
            self.assertEqual(item["music_end"], 2.1)
            self.assertFalse(item["boundary_provenance"]["music_end"]["phrase_aligned"])
            self.assertTrue(item["phrase_fit_warnings"])
            self.assertTrue(plan["phrase_fit_warnings"])
            self.assertTrue(any("phrase-fit" in w for w in item["warnings"]))
            self.check_plan(plan, beat_info)

    def test_reviewed_phrase_end_overrides_structural_phrase_grid_when_required(self):
        beat_info = info(onsets=[1.2], downbeats=[3.1], boundaries=[2.1, 2.4, 3.1, 4.5, 7., 10., 15.])
        reviewed = [dict(id="phrase-end-1", end=3.4, end_interval=[3.35, 3.45])]
        plan = plan_encounters([event()], beat_info, duration=10, phrase_aware=True,
            reviewed_phrase_ends=reviewed, require_reviewed_phrase_end=True)
        item = plan["timeline"][0]
        self.assertEqual(item["music_end"], 3.4)
        self.assertEqual(item["boundary_provenance"]["music_end"]["reviewed_phrase_ids"], ["phrase-end-1"])
        self.assertIn("reviewed_phrase_end", item["boundary_provenance"]["music_end"]["kinds"])
        self.assertTrue(item["boundary_provenance"]["music_end"]["phrase_aligned"])
        fallback = plan_encounters([event()], beat_info, duration=10, phrase_aware=True,
            reviewed_phrase_ends=[dict(id="too-late", end=3.8, end_interval=[3.75, 3.85])],
            require_reviewed_phrase_end=True)
        self.assertFalse(fallback["timeline"][0]["boundary_provenance"]["music_end"]["phrase_aligned"])
        self.assertNotIn("reviewed_phrase_ids", fallback["timeline"][0]["boundary_provenance"]["music_end"])
        with self.assertRaisesRegex(ValueError, "reviewed phrase-end evidence"):
            plan_encounters([event()], beat_info, duration=10, phrase_aware=True,
                            require_reviewed_phrase_end=True)
        with self.assertRaisesRegex(ValueError, "phrase-aware"):
            plan_encounters([event()], beat_info, duration=10,
                            reviewed_phrase_ends=reviewed)

    def test_target_ceiling_and_no_arbitrary_extension(self):
        beat_info = info(downbeats=[3.1, 10.])
        plan = plan_encounters([event()], beat_info, duration=2.5, phrase_aware=True)
        self.assertEqual(plan["timeline"][0]["music_end"], 2.1)
        plan = plan_encounters([event()], beat_info, duration=10, phrase_aware=True, max_extension=0)
        self.assertEqual(plan["timeline"][0]["music_end"], 2.1)
        self.assertTrue(plan["timeline"][0]["phrase_fit_warnings"])
        self.check_plan(plan, beat_info)

    def test_manual_complete_fight_included_or_omitted_in_both_modes(self):
        observation = event(encounter_start=1., encounter_end=9.)
        beat_info = info(onsets=[4.], downbeats=[9.], boundaries=[8., 9., 15.])
        for aware in (False, True):
            plan = plan_encounters([observation], beat_info, duration=12, phrase_aware=aware)
            self.assertEqual(len(plan["timeline"]), 1)
            item = plan["timeline"][0]
            self.assertEqual(item["source_start"], 1.)
            self.assertGreaterEqual(item["source_end"], 9.)
            self.assertEqual(item["context_provenance"]["kind"], "manual")
            self.check_plan(plan, beat_info)
            short = plan_encounters([observation], beat_info, duration=7, phrase_aware=aware)
            self.assertEqual(short["timeline"], [])
            self.assertEqual(short["omitted_encounters"][0]["start"], 1.)
            self.assertEqual(short["omitted_encounters"][0]["end"], 9.)

    def test_distinct_reviewed_fights_do_not_merge_across_short_gaps(self):
        observations = [
            event(a=5., v=5.2, encounter_start=1., encounter_end=7.,
                  reviewed_fight_id="fight-1", reviewed_fight_outcome="resolved"),
            event(a=7.4, v=7.6, encounter_start=7.1, encounter_end=12.,
                  reviewed_fight_id="fight-2", reviewed_fight_outcome="resolved"),
        ]
        grouped = group_encounters(observations, max_gap=5.)
        self.assertEqual(len(grouped), 2)
        self.assertEqual([g["events"][0]["reviewed_fight_id"] for g in grouped], ["fight-1", "fight-2"])
        self.assertEqual([g["events"][0]["reviewed_fight_outcome"] for g in grouped], ["resolved", "resolved"])

    def test_manual_overlaps_merge_and_duplicate_context_union(self):
        grouped = group_encounters([event(encounter_start=1., encounter_end=9.),
            event(encounter_start=0., encounter_end=10., confidence=.95),
            event(a=12., v=12.2, encounter_start=8., encounter_end=14.)], max_gap=.1)
        self.assertEqual(len(grouped), 1)
        self.assertEqual(grouped[0]["start"], 0.)
        self.assertEqual(grouped[0]["end"], 14.)
        self.assertEqual(grouped[0]["kill_count"], 2)
        self.assertEqual(grouped[0]["events"][0]["encounter_start"], 0.)
        self.assertEqual(grouped[0]["events"][0]["encounter_end"], 10.)

    def test_manual_context_validation_contains_visual_and_audio(self):
        cases = [dict(encounter_start=1.), dict(encounter_end=9.),
                 dict(encounter_start=5.1, encounter_end=9.),
                 dict(encounter_start=1., encounter_end=5.1),
                 dict(encounter_start=4., encounter_end=4.),
                 dict(encounter_start=-1., encounter_end=9.),
                 dict(encounter_start=1., encounter_end=31.),
                 dict(encounter_start=True, encounter_end=9.),
                 dict(encounter_start=1., encounter_end=math.nan)]
        for case in cases:
            with self.subTest(case=case), self.assertRaises(ValueError):
                group_encounters([event(**case)])
        with self.assertRaises(ValueError):
            group_encounters([event(v=7., encounter_start=1., encounter_end=6.)])

    def test_manual_long_context_merge_preserves_multikill_intervals(self):
        observations = [event(a=5., v=5.2, encounter_start=1., encounter_end=12.),
                        event(a=8.37, v=8.8, encounter_start=1., encounter_end=12.)]
        beat_info = info(onsets=[4.], downbeats=[12.], boundaries=[11., 12., 15.])
        plan = plan_encounters(observations, beat_info, duration=15, phrase_aware=True)
        self.assertEqual(len(plan["timeline"]), 1)
        item = plan["timeline"][0]
        self.assertEqual(item["kill_count"], 2)
        self.assertAlmostEqual(item["events"][1]["audio_offset"]-item["events"][0]["audio_offset"], 3.37)
        self.assertGreaterEqual(item["source_end"], 12.)
        self.check_plan(plan, beat_info)

    def test_no_duplicate_ranges_and_protected_manual_encounters(self):
        observations = [event(a=5., v=5.2, encounter_start=3., encounter_end=7.),
                        event(a=11., v=11.2, encounter_start=9., encounter_end=13.)]
        beat_info = info(onsets=[2., 2.3, 6.5, 7., 8.], downbeats=[4.5, 9.], boundaries=[4., 4.5, 8.5, 9., 15.])
        plan = plan_encounters(observations, beat_info, duration=15, phrase_aware=True)
        self.assertEqual(len(plan["timeline"]), 2)
        self.assertEqual(sum(i["kill_count"] for i in plan["timeline"]), 2)
        self.check_plan(plan, beat_info)

    def test_absolute_music_start_and_empty_onsets(self):
        beat_info = info(onsets=[6.2], downbeats=[8.1], boundaries=[7.1, 8.1, 15.])
        plan = plan_encounters([event()], beat_info, duration=10, music_start=5., phrase_aware=True)
        self.assertEqual(plan["timeline"][0]["music_end"], 8.1)
        self.assertAlmostEqual(plan["timeline"][0]["anchor"]["output_time"], 1.2)
        self.check_plan(plan, beat_info)
        empty = plan_encounters([event()], info(onsets=[], downbeats=[3.1]), duration=10, phrase_aware=True)
        self.assertEqual(empty["timeline"], [])
        self.assertTrue(any("no actual" in w for w in empty["warnings"]))

    def test_explicit_accents_remain_actual_onsets_with_section_fit(self):
        profile = MusicProfile(duration=15., sections=[Section(0., 2.93, "intro", .2), Section(2.93, 15., "peak", .9)])
        plan = plan_encounters([event()], music_profile=profile, duration=10,
                               accents=[1.2, 2.1], music_duration=15., phrase_aware=True)
        self.assertEqual(plan["timeline"][0]["music_end"], 2.93)
        self.assertEqual(plan["timeline"][0]["anchor"]["music_time"], 1.2)

    def test_large_onset_list_bounds_expensive_scoring(self):
        onsets = [1.2 + i*.000015 for i in range(100001)]
        beat_info = info(onsets=onsets, downbeats=[3.1])
        profile = MusicProfile(duration=15.)
        candidate_indices = _onset_candidates(list(zip(onsets, beat_info.onset_strengths)), 0, len(onsets), True)
        self.assertLessEqual(len(candidate_indices), MAX_PHRASE_ONSET_CANDIDATES)
        self.assertIn(0, candidate_indices)
        self.assertIn(len(onsets)-1, candidate_indices)
        with patch.object(profile, "energy_at", wraps=profile.energy_at) as energy:
            plan = plan_encounters([event()], beat_info, profile, duration=10, phrase_aware=True)
        self.assertLessEqual(energy.call_count, MAX_PHRASE_ONSET_CANDIDATES)
        self.assertTrue(plan["timeline"])
        self.assertTrue(any("scoring bounded" in w for w in plan["phrase_fit_warnings"]))
        self.check_plan(plan, beat_info)

    def test_known_manual_provenance_preserved_unknown_keys_ignored(self):
        fields = dict(confirmation="manual frame review", confidence_kind="label_not_probability",
                      label_id="review-1", context_review="sampled setup and outcome",
                      reviewed_fight_id="fight-1", reviewed_fight_outcome="resolved")
        observation = event(encounter_start=1., encounter_end=9.,
                            unsafe_extra=object(), **fields)
        grouped = group_encounters([observation])
        for key, value in fields.items():
            self.assertEqual(grouped[0]["events"][0][key], value)
        self.assertNotIn("unsafe_extra", grouped[0]["events"][0])
        beat_info = info(onsets=[4.], downbeats=[9.], boundaries=[8., 9., 15.])
        plan = plan_encounters([observation], beat_info, duration=12, phrase_aware=True)
        for key, value in fields.items():
            self.assertEqual(plan["timeline"][0]["events"][0][key], value)
        self.check_plan(plan, beat_info)
        for key in fields:
            for value in (None, 1, {}, " "):
                with self.subTest(key=key, value=value), self.assertRaises(ValueError):
                    group_encounters([event(**{key: value})])

    def test_duplicate_provenance_high_confidence_retained(self):
        grouped = group_encounters([event(confidence=.7, label_id="weak"),
                                    event(confidence=.95, label_id="strong", confirmation="manual"),
                                    event(confidence=.8, label_id="later")])
        self.assertEqual(grouped[0]["events"][0]["label_id"], "strong")
        self.assertEqual(grouped[0]["events"][0]["confirmation"], "manual")

    def test_invalid_phrase_metadata_rejected_only_in_opt_in_mode(self):
        for value in (1, "true", None):
            with self.assertRaises(ValueError):
                plan_encounters([event()], info(), duration=10, phrase_aware=value)
        for downbeats in ([math.nan], [-1.], [16.], [True]):
            beat_info = info(downbeats=downbeats)
            self.assertTrue(plan_encounters([event()], beat_info, duration=10)["timeline"])
            with self.assertRaises(ValueError):
                plan_encounters([event()], beat_info, duration=10, phrase_aware=True)
        for sections in ([Section(3., 2., "bad", .5)], [Section(0., 16., "bad", .5)]):
            with self.assertRaises(ValueError):
                plan_encounters([event()], info(), MusicProfile(duration=15., sections=sections), duration=10, phrase_aware=True)


if __name__ == "__main__":
    unittest.main()
