"""Candidate-only slowed-song pacing: explicit mechanical contracts.

Synthetic evidence only. These tests pin the pacing contracts that keep a slowed
candidate honest: bursts stay rigid at 1x, every stretch is certified against the
same analytic bound the renderer re-derives, every beat claim is re-measured
against the grid the solver was given, and rows that could not be beat-matched say
so instead of being force-fitted. No media IO, no reviewed maps, no perceptual
claims.
"""
import copy
import unittest

from aive.encounter_render import RenderConfig, render_clock_model, validate_plan
from aive.multishot_map import _bounds
from aive.slowed_pacing import (ANCHOR_ORIGIN, DEFAULT_BURST_GAP, DEFAULT_SLOW_FLOOR,
                                LIMITATIONS, SCHEMA, CandidatePacingMap, beats_from_hit_maps,
                                build_candidate_pacing_map, cluster_shots, gap_capacity,
                                plan_slowed_pacing)
from aive.local_authored_planner import plan_local_authored

try:  # unittest discovery puts tests/ on sys.path; package runs do not.
    from test_local_authored_planner import fixtures
except ModuleNotFoundError:  # pragma: no cover - direct module invocation
    from tests.test_local_authored_planner import fixtures

FLOOR = 0.55


def dense_grid(start=9.3, end=41.2, step=0.1):
    """Synthetic measured attacks: every reach window contains one."""
    grid, value, count = [], start, 0
    while value <= end + 1e-9:
        grid.append(round(value, 6))
        count += 1
        value = start + count * step
    return grid


def sparse_grid():
    """Only the fixture's own refined attacks, 2.9s apart: mostly unreachable."""
    return sorted({9.3 + i * 2.9 for i in range(12)})


def paced(modify=None, *, grid=None, floor=FLOOR, **kwargs):
    fmap, icons, maps = fixtures()
    plan = plan_local_authored(fmap, icons, maps)
    assert plan["status"] == "candidate", plan.get("blocked_reason")
    if modify is not None:
        plan = modify(plan)
    beats = dense_grid() if grid is None else grid
    result, report = plan_slowed_pacing(plan, beats=beats, fps=60, slow_floor=floor, **kwargs)
    return result, report, beats


class ClusterTests(unittest.TestCase):
    def test_rapid_shots_group_and_slow_ones_split(self):
        shots = [(0.0, 0.02, 0.01), (0.05, 0.07, 0.06), (0.10, 0.12, 0.11),
                 (0.50, 0.52, 0.51), (0.55, 0.57, 0.56)]
        self.assertEqual(cluster_shots(shots, .18), [(0.0, 0.12), (0.5, 0.57)])
        self.assertEqual(cluster_shots(shots, .02), [(0.0, 0.02), (0.05, 0.07), (0.1, 0.12),
                                                     (0.5, 0.52), (0.55, 0.57)])
        with self.assertRaises(ValueError):
            cluster_shots(shots, 0)

    def test_grid_prefers_refined_time_and_skips_missing(self):
        maps = [dict(candidates=[dict(time=1.0, refined_time=1.2, confirmed=False),
                                 dict(time=3.0, confirmed=False),
                                 dict(time=9.9, confirmed=False)])]
        self.assertEqual(beats_from_hit_maps(maps), [1.2, 3.0, 9.9])
        near = [dict(candidates=[dict(time=1.0, refined_time=1.2, confirmed=False),
                                 dict(time=1.205, refined_time=1.205, confirmed=False)])]
        self.assertEqual(beats_from_hit_maps(near), [1.2])
        with self.assertRaises(ValueError):
            beats_from_hit_maps([dict(candidates=[dict(time=1.0, confirmed=True)])])

    def test_gap_capacity_is_the_analytic_bound(self):
        for length in (.049, .2, .5, .9, 2.0):
            cap = gap_capacity(length, FLOOR)
            self.assertGreater(cap, 0.0)
            self.assertGreaterEqual(_bounds(length, cap)[0], FLOOR - 1e-9)
            self.assertLess(_bounds(length, cap * 1.02)[0], FLOOR)
        self.assertEqual(gap_capacity(.5, 1.0), 0.0)


class MapTests(unittest.TestCase):
    def build(self, **overrides):
        kwargs = dict(source_start=100.0, source_end=103.18, music_start=8.0, music_end=11.6,
                      clusters=[[0.0, 0.5], [1.4, 1.5], [2.5, 3.18]],
                      shifts=[0.0, gap_capacity(0.9, FLOOR), gap_capacity(0.9, FLOOR)],
                      unsnapped_clusters=[2], anchor_source_time=101.5,
                      beat_music_time=8.0 + 1.5 + gap_capacity(0.9, FLOOR), beat_matched=True,
                      burst_gap_seconds=DEFAULT_BURST_GAP, slow_floor=FLOOR,
                      tail_shift=gap_capacity(0.9, FLOOR))
        kwargs.update(overrides)
        return CandidatePacingMap(**kwargs)

    def test_bursts_stay_rigid_and_the_anchor_lands(self):
        mapping = self.build()
        shift = gap_capacity(0.9, FLOOR)
        for inside in (0.0, 0.2, 0.5):
            self.assertAlmostEqual(mapping.map(inside) - inside, 0.0)
            self.assertEqual(mapping.speed(inside), 1.0)
        self.assertAlmostEqual(mapping.map(1.45) - 1.45, shift)
        for inside in (1.45, 2.5, 3.0, 3.18):
            self.assertAlmostEqual(mapping.map(inside) - inside, shift)
        self.assertAlmostEqual(mapping.music_start + 1.5 + shift, mapping.beat_music_time)
        self.assertAlmostEqual(mapping.output_duration, mapping.duration + shift)
        self.assertAlmostEqual(mapping.shift_total, shift)
        self.assertEqual(mapping.reviewed_input, False)
        self.assertEqual(mapping.anchor_origin, ANCHOR_ORIGIN)
        self.assertGreaterEqual(mapping.min_speed, FLOOR - 1e-6)

    def test_expression_matches_the_python_map(self):
        mapping = self.build()
        expression = mapping.expression("t")
        for probe in (0.0, 0.3, 0.5, 0.9, 1.2, 1.4, 1.5, 2.0, 2.5, 3.18):
            value = probe
            for start, end, change in mapping._terms:
                if value >= end:
                    value += change
            # Flat sum form: every term saturates after its own gap.
            total = probe
            for start, end, change in mapping._terms:
                if probe >= end:
                    total += change
                elif probe > start:
                    u = (probe - start) / (end - start)
                    total += change * (u ** 3 * (10 + u * (-15 + 6 * u)))
            self.assertAlmostEqual(mapping.map(probe), total)
            self.assertIn("min(max(", expression)

    def test_floor_and_monotonicity_are_enforced(self):
        with self.assertRaises(ValueError):
            self.build(shifts=[0.0, 0.9, 0.9])
        with self.assertRaises(ValueError):
            self.build(shifts=[0.2, 0.0, 0.0])
        with self.assertRaises(ValueError):
            self.build(tail_shift=-0.5)
        with self.assertRaises(ValueError):
            self.build(anchor_source_time=102.0, beat_music_time=8.0 + 2.0)
        with self.assertRaises(ValueError):
            self.build(beat_matched=False)
        with self.assertRaises(ValueError):
            CandidatePacingMap(source_start=0.0, source_end=1.0, music_start=0.0, music_end=1.0,
                               slow_floor=.4)

    def test_manifest_roundtrip_and_stale_rejection(self):
        document = self.build().manifest()
        self.assertEqual(document["schema_version"], SCHEMA)
        self.assertEqual(document["limitations"], list(LIMITATIONS))
        self.assertEqual(document["reviewed_input"], False)
        self.assertEqual(build_candidate_pacing_map(copy.deepcopy(document)).manifest(), document)
        for mutate in (lambda d: d.__setitem__("shifts", [0.0, d["shifts"][1] * 1.01, d["shifts"][2]]),
                       lambda d: d.__setitem__("burst_gap_seconds", .25),
                       lambda d: d.__setitem__("limitations", []),
                       lambda d: d.__setitem__("beat_matched", False),
                       lambda d: d["clocks"].__setitem__("target_endpoint", 12.0)):
            with self.assertRaises(ValueError):
                build_candidate_pacing_map(mutate(copy.deepcopy(document)))

    def test_rigid_identity_map(self):
        mapping = CandidatePacingMap(source_start=10.0, source_end=13.0, music_start=8.0, music_end=11.0,
                                     burst_gap_seconds=DEFAULT_BURST_GAP, slow_floor=DEFAULT_SLOW_FLOOR)
        for probe in (0.0, 1.0, 3.0):
            self.assertEqual(mapping.map(probe), probe)
            self.assertEqual(mapping.speed(probe), 1.0)
        self.assertEqual((mapping.min_speed, mapping.max_speed), (1.0, 1.0))
        self.assertEqual(mapping.output_duration, mapping.duration)
        self.assertEqual(mapping.shift_total, 0.0)
        self.assertEqual(mapping.clusters, [])
        self.assertFalse(mapping.beat_matched)
        self.assertEqual(mapping.expression("t"), "t")


class PacingPlanTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.plan, cls.report, cls.grid = paced()

    def anchor_claims(self, plan, report):
        claims = []
        for entry in report["kept"]:
            row = plan["timeline"][entry["index"]]
            main = [c for c in row["candidate_events"] if c["id"] == row["main_candidate_id"]]
            if not entry["beat_matched"]:
                self.assertIsNone(row["pacing_map"]["beat_music_time"])
                self.assertIsNotNone(entry["anchor_offset_seconds"])
                continue
            self.assertEqual(len(main), 1)
            source = main[0].get("source_audio_event", main[0]["time"])
            mapping = build_candidate_pacing_map(row["pacing_map"])
            claims.append(row["music_start"] + mapping.map(source - row["source_start"]))
        return claims

    def test_every_claim_is_a_measured_attack(self):
        claims = self.anchor_claims(self.plan, self.report)
        self.assertTrue(claims)
        for claim in claims:
            self.assertLess(min(abs(claim - value) for value in self.grid), 1e-6)
        for entry in self.report["kept"]:
            tail = entry["tail"]
            if tail["target_beat"] is None:
                continue
            row = self.plan["timeline"][entry["index"]]
            self.assertLess(abs(row["music_end"] - tail["target_beat"]), 1e-7)
            self.assertLess(min(abs(row["music_end"] - value) for value in self.grid), 1e-7)

    def test_rows_are_declared_exactly_once_and_the_plan_slows(self):
        indexes = [e["index"] for e in self.report["kept"]] + [e["index"] for e in self.report["rigid_rows"]]
        self.assertEqual(sorted(indexes), list(range(len(self.plan["timeline"]))))
        self.assertEqual(self.report["rows_total"], len(self.plan["timeline"]))
        self.assertEqual(self.report["rows_beat_matched"],
                         sum(1 for e in self.report["kept"] if e["beat_matched"]))
        self.assertEqual(self.report["rows_partial"],
                         sum(1 for e in self.report["kept"] if not e["beat_matched"]))
        self.assertEqual(self.report["grid_origin"], "measured acoustic attacks from hit-map/v1, unreviewed")
        self.assertGreater(self.report["paced_duration"], self.report["original_duration"])
        self.assertLessEqual(self.report["paced_duration"], self.report["max_output_duration"] + 1e-9)
        self.assertAlmostEqual(self.plan["duration"], self.report["paced_duration"])
        self.assertAlmostEqual(self.plan["music_end"] - self.plan["music_start"], self.plan["duration"])

    def test_gap_strengths_match_the_maps_and_their_floor(self):
        for entry in self.report["kept"]:
            row = self.plan["timeline"][entry["index"]]
            document = row["pacing_map"]
            shifts = document["shifts"]
            for gap in entry["gap_strengths"]:
                k = gap["cluster"]
                previous = shifts[k - 1] if k else 0.0
                self.assertAlmostEqual(gap["stretch_seconds"], shifts[k] - previous, places=5)
                self.assertGreaterEqual(gap["playback_floor"], FLOOR - 1e-9)
                self.assertLessEqual(gap["stretch_seconds"], gap_capacity(gap["source_seconds"], FLOOR) + 1e-9)
            self.assertGreaterEqual(entry["stretch_seconds"] + 1e-5,
                                    entry["tail"]["stretch_seconds"] + sum(
                                        g["stretch_seconds"] for g in entry["gap_strengths"]))

    def test_rigid_rows_are_pure_1x(self):
        for entry in self.report["rigid_rows"]:
            row = self.plan["timeline"][entry["index"]]
            self.assertFalse(entry["beat_matched"])
            self.assertNotIn("pacing_map", row)
            self.assertAlmostEqual(row["output_end"] - row["output_start"],
                                   row["source_end"] - row["source_start"], places=9)
            for candidate in row["candidate_events"]:
                local = candidate.get("source_audio_event", candidate["time"]) - row["source_start"]
                self.assertAlmostEqual(candidate["output_audio_event"], row["output_start"] + local, places=9)
            self.assertEqual(row["pacing_unsnapped_clusters"], [])

    def test_partial_rows_carry_a_map_without_a_beat_claim(self):
        partial = [e for e in self.report["kept"] if not e["beat_matched"]]
        for entry in partial:
            row = self.plan["timeline"][entry["index"]]
            self.assertIn("pacing_map", row)
            self.assertIs(row["pacing_map"]["beat_matched"], False)
            self.assertIsNone(row["pacing_map"]["anchor_source_time"])
            self.assertGreater(entry["stretch_seconds"], 0.0)
            self.assertGreater(entry["anchor_offset_seconds"], 0.0)

    def test_renderer_accepts_the_paced_plan_and_the_retimed_clock(self):
        fmap, _icons, _maps = fixtures()
        bounds = {fmap["source"]: 200.0}
        config = RenderConfig(style="slowed-pacing", fps=60)
        rows = validate_plan(self.plan, config, source_durations=bounds)
        clock = render_clock_model("slowed-pacing", rows)
        self.assertEqual(self.plan["clock_model"], clock)
        self.assertEqual(clock["kind"], "retimed-candidate-pacing")
        self.assertTrue(clock["retimed"])
        self.assertEqual(clock["mapped_rows"], len(rows))
        self.assertEqual(len(rows), len(self.plan["timeline"]))

    def test_renderer_rejects_tampered_pacing(self):
        config = RenderConfig(style="slowed-pacing", fps=60)
        bounds = {fixtures()[0]["source"]: 200.0}
        paced_row = next(e["index"] for e in self.report["kept"])
        for mutate in (
                lambda p: p["timeline"][paced_row].__setitem__("music_end",
                                                              p["timeline"][paced_row]["music_end"] + .1),
                lambda p: p["timeline"][paced_row].__setitem__("output_end",
                                                              p["timeline"][paced_row]["output_end"] + .1),
                lambda p: p["timeline"][paced_row]["pacing_map"]["shifts"].__setitem__(
                    1, p["timeline"][paced_row]["pacing_map"]["shifts"][1] + .01),
                lambda p: p["timeline"][paced_row].__setitem__("pacing_unsnapped_clusters", []),
                lambda p: p["timeline"][paced_row].pop("pacing_map"),
                lambda p: p["pacing"]["kept"][0].__setitem__("beat_matched", False)):
            with self.assertRaises(ValueError):
                validate_plan(mutate(copy.deepcopy(self.plan)), config, source_durations=bounds)

    def test_bounds_and_inputs_are_enforced(self):
        plan, _report, _grid = paced()
        with self.assertRaises(ValueError):
            plan_slowed_pacing(plan, beats=dense_grid(), fps=60, slow_floor=.49)
        with self.assertRaises(ValueError):
            plan_slowed_pacing(plan, beats=[], fps=60, slow_floor=FLOOR)
        with self.assertRaises(ValueError):
            plan_slowed_pacing(plan, beats=dense_grid(), fps=60, slow_floor=FLOOR, min_clips=64)
        _tight, report, _grid = paced(grid=dense_grid(), max_output_duration=report_of(plan) + .25)
        self.assertGreater(report["paced_duration"], report_of(plan))
        self.assertLessEqual(report["paced_duration"], report_of(plan) + .25 + 1e-9)

    def test_a_coarse_grid_invents_nothing(self):
        _plan, report, beats = paced(grid=sparse_grid())
        self.assertEqual(report["rows_beat_matched"] + report["rows_partial"] + report["rows_rigid"],
                         report["rows_total"])
        self.assertGreaterEqual(report["rows_rigid"], 1)
        for entry in report["kept"] + report["rigid_rows"]:
            if entry.get("tail") and entry["tail"]["target_beat"] is not None:
                self.assertLess(min(abs(entry["tail"]["target_beat"] - value) for value in beats), 1e-9)


def report_of(plan):
    return sum(row["source_end"] - row["source_start"] for row in plan["timeline"])


if __name__ == "__main__":  # pragma: no cover - manual runs
    unittest.main()
