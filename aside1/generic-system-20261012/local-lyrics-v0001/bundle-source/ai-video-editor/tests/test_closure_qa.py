import copy
import json
import unittest

from aive.closure_qa import audit_closure, validate_reviewed_closure

SHA = "a"*64
SONG = "b"*64


def evidence(clock, **fields):
    return dict(status="reviewed", clock=clock, reviewer="independent human",
                method="source/track playback and frame-context inspection",
                evidence=dict(reference="review-session-001", observation="explicit observed context, outcome or phrase cadence"), **fields)


def fixture():
    rows = []
    for i in range(3):
        rows.append(dict(source=f"source-{i}", source_start=10., source_end=12.,
                         output_start=2.*i, output_end=2.*i+2, music_start=20.+2*i,
                         music_end=22.+2*i, speed=1., events=[]))
    plan = dict(schema_version="encounters/v1", requested_duration=10., duration=6.,
                music_start=20., music_end=26., music_continuous=True, gaps=[], timeline=rows)
    review = dict(schema_version="reviewed-closure/v1",
                  sources=[dict(source=f"source-{i}", duration=30., source_file_sha256=SHA) for i in range(3)],
                  music=dict(song_sha256=SONG, duration=60.),
                  fights=[dict(id=f"fight-{i}", source=f"source-{i}", source_file_sha256=SHA,
                               context=evidence("source_seconds", start=10.2, end=11.7),
                               outcome=evidence("source_seconds", time=11.5, result="resolved")) for i in range(3)],
                  phrases=[dict(id="phrase-1", song_sha256=SONG,
                                **evidence("music_seconds", start=20., end=26., end_interval=[25.98,26.02], decision="phrase_end"))])
    return plan, review


def audit(plan, review=None, **kwargs):
    return audit_closure(plan, review, source_sha256={f"source-{i}": SHA for i in range(3)}, song_sha256=SONG, **kwargs)


def component(report, name):
    return next(c for c in report["checks"] if c["name"] == name)


class ClosureQA(unittest.TestCase):
    def test_resolved_and_independent_phrase_pass_engineering_only(self):
        p, r = fixture()
        before = copy.deepcopy((p,r))
        report = audit(p,r)
        self.assertEqual(report["status"], "pass")
        self.assertTrue(report["engineering_gate"])
        self.assertFalse(report["perceptual_approval"])
        self.assertEqual(report["perceptual_status"], "not_assessed")
        self.assertEqual(report["unfilled_duration"], 4.)
        self.assertEqual(len(component(report,"timeline")["evidence"]["joins"]), 2)
        self.assertAlmostEqual(component(report,"closure_gap")["evidence"]["output_gap"], .5)
        json.dumps(report, allow_nan=False)
        self.assertEqual((p,r), before)
        detached = validate_reviewed_closure(r)
        detached["fights"][0]["outcome"]["result"] = "unknown"
        self.assertEqual(r["fights"][0]["outcome"]["result"], "resolved")

    def test_candidate_payoff_fade_never_resolves_fight(self):
        p, _ = fixture()
        p.update(mode="candidate-preview", review_status="unreviewed", authored_design={"shots":[{"role":"payoff"}],"ending":{"fade_frames":24}})
        p["timeline"][-1]["boundary_provenance"] = {"music_end":{"phrase_aligned":True,"kinds":["downbeat"]}}
        report = audit(p)
        self.assertEqual(report["status"], "warn")
        self.assertFalse(report["engineering_gate"])
        self.assertEqual(component(report,"ending_fight")["status"], "warn")
        self.assertEqual(component(report,"phrase_end")["status"], "warn")

    def test_candidate_even_with_valid_reviews_warns(self):
        p,r = fixture()
        p["mode"] = "candidate-preview"
        self.assertEqual(audit(p,r)["status"], "warn")
        p.pop("mode")
        p["timeline"][0]["candidate_events"] = [{"time":11., "confirmed":False}]
        self.assertEqual(audit(p,r)["status"], "warn")
        p["timeline"][0].pop("candidate_events")
        p["mode"] = "unknown-mode"
        self.assertEqual(audit(p,r)["status"], "warn")

    def test_every_interrupted_fight_fails_including_first_and_middle(self):
        for index in range(3):
            with self.subTest(index=index):
                p,r = fixture()
                r["fights"][index]["context"]["end"] = 12.4
                report = audit(p,r)
                self.assertEqual(report["status"], "fail")
                self.assertEqual(component(report,"fight_bounds")["status"], "fail")

    def test_manual_bounds_fail_without_review(self):
        for field in ("context_provenance", "events", "candidate_events"):
            p,_ = fixture()
            if field == "context_provenance":
                p["timeline"][0][field] = dict(kind="manual", start=9.8, end=11.8)
            else:
                p["timeline"][0][field] = [dict(encounter_start=9.8, encounter_end=11.8)]
            self.assertEqual(audit(p)["status"], "fail")

    def test_split_fight_fails_and_intact_omission_allowed(self):
        p,r = fixture()
        p["timeline"][1].update(source="source-0", source_start=12., source_end=14.)
        r["fights"] = [r["fights"][0],r["fights"][2]]
        r["fights"][0]["context"]["end"] = 13.5
        self.assertEqual(component(audit(p,r),"fight_bounds")["status"], "fail")
        p,r = fixture()
        omitted = copy.deepcopy(r["fights"][0])
        omitted["id"] = "omitted"
        omitted["context"].update(start=20., end=24.)
        omitted["outcome"]["time"] = 23.
        r["fights"].append(omitted)
        self.assertEqual(audit(p,r)["status"], "pass")

    def test_latest_not_earlier_resolved_fight_controls_ending(self):
        p,r = fixture()
        late = copy.deepcopy(r["fights"][-1])
        late["id"] = "later-fight"
        late["context"].update(start=11.8, end=11.95)
        late["outcome"].update(time=11.9, result="unresolved")
        r["fights"].append(late)
        self.assertEqual(component(audit(p,r),"ending_fight")["status"], "fail")
        late["outcome"]["result"] = "unknown"
        self.assertEqual(audit(p,r)["status"], "warn")

    def test_every_outgoing_join_needs_reviewed_resolution(self):
        for i in (0,1):
            p,r = fixture()
            r["fights"][i]["outcome"]["result"] = "unresolved"
            self.assertEqual(component(audit(p,r),"join_outcomes")["status"], "fail")
            r["fights"][i]["outcome"]["result"] = "unknown"
            self.assertEqual(component(audit(p,r),"join_outcomes")["status"], "warn")

    def test_neutral_final_row_not_reviewed_fight(self):
        p,r = fixture()
        r["fights"].pop()
        self.assertEqual(component(audit(p,r),"ending_fight")["status"], "warn")

    def test_music_review_is_independent_and_exact_actual_end(self):
        for decision, expected in (("uncertain","warn"),("not_phrase_end","fail")):
            p,r = fixture()
            r["phrases"][0]["decision"] = decision
            self.assertEqual(audit(p,r)["status"], expected)
        p,r = fixture()
        r["phrases"][0].update(end=30., end_interval=[30.,30.])
        self.assertEqual(component(audit(p,r),"phrase_end")["status"], "warn")
        r["phrases"] = []
        self.assertEqual(audit(p,r)["status"], "warn")

    def test_bounded_gap_and_uncertainty(self):
        p,r = fixture()
        self.assertEqual(audit(p,r,max_closure_gap=.5)["status"], "fail")
        self.assertEqual(audit(p,r,max_closure_gap=.52)["status"], "pass")
        r["fights"][-1]["outcome"]["time"] = 10.2
        self.assertEqual(audit(p,r)["status"], "fail")
        p,r = fixture()
        r["fights"][-1]["context"]["end"] = 12.
        r["fights"][-1]["outcome"]["time"] = 12.
        self.assertEqual(audit(p,r)["status"], "fail")  # phrase may end before resolution

    def test_every_join_gap_overlap_and_music_jump(self):
        for index in (1,2):
            for field,delta in (("output_start",.1),("output_start",-.1),("music_start",.1)):
                p,r = fixture()
                p["timeline"][index][field] += delta
                report = audit(p,r)
                self.assertEqual(report["status"], "fail")
                joins = component(report,"timeline")["evidence"]["joins"]
                self.assertEqual(joins[index-1]["status"], "fail")

    def test_no_duration_padding_reuse_or_retiming(self):
        for field in ("duration", "requested_duration", "gaps", "music_continuous", "speed", "source_end", "reuse"):
            p,r = fixture()
            if field == "duration": p.update(duration=10.,music_end=30.)
            elif field == "requested_duration": p[field] = 5.
            elif field == "gaps": p[field] = [{"start":2,"end":3}]
            elif field == "music_continuous": p[field] = False
            elif field == "reuse": p["timeline"][1]["source"] = "source-0"
            else: p["timeline"][1][field] = 1.1 if field == "speed" else 13.
            self.assertEqual(audit(p,r)["status"], "fail", field)
        p,_ = fixture()
        p["timeline"] = []
        self.assertEqual(audit(p)["status"], "fail")

    def test_identity_binding_cannot_be_metadata_only(self):
        p,r = fixture()
        self.assertEqual(audit_closure(p,r)["status"], "warn")
        self.assertEqual(audit_closure(p,r, source_sha256={"source-0":"c"*64},song_sha256=SONG)["status"], "fail")
        self.assertEqual(audit_closure(p,r,source_sha256={f"source-{i}":SHA for i in range(3)},song_sha256="c"*64)["status"], "fail")
        r["sources"][-1]["duration"] = 11.8
        self.assertEqual(audit(p,r)["status"], "fail")

    def test_event_source_output_offset_mapping(self):
        p,r = fixture()
        p["timeline"][1]["events"] = [dict(source_audio_event=11.,output_audio_event=3.,audio_offset=1.)]
        self.assertEqual(audit(p,r)["status"], "pass")
        p["timeline"][1]["events"][0]["output_audio_event"] = 1.
        self.assertEqual(audit(p,r)["status"], "fail")

    def test_anchor_clock_and_boundary_contact(self):
        p,r = fixture()
        p["timeline"][0]["anchor"] = dict(source_audio_event=11., output_time=1., music_time=21.)
        self.assertEqual(audit(p,r)["status"], "pass")
        p["timeline"][0]["anchor"]["music_time"] = 1.
        self.assertEqual(audit(p,r)["status"], "fail")
        p,r = fixture()
        outside = copy.deepcopy(r["fights"][0])
        outside["id"] = "starts-at-cut"
        outside["context"].update(start=12., end=13.)
        outside["outcome"].update(time=12.5, result="unresolved")
        r["fights"].append(outside)
        self.assertEqual(audit(p,r)["status"], "pass")  # zero overlap is intact omission

    def test_strict_review_versions_keys_and_evidence(self):
        mutations = [lambda r:r.update(schema_version="reviewed-closure/v2"),
                     lambda r:r.update(extra=True),
                     lambda r:r["fights"][0]["context"].update(extra=True),
                     lambda r:r["fights"][0]["context"].update(status="unreviewed"),
                     lambda r:r["fights"][0]["outcome"].update(result="kill"),
                     lambda r:r["fights"][0]["context"].update(clock="output_seconds"),
                     lambda r:r["phrases"][0].update(clock="output_seconds"),
                     lambda r:r["phrases"][0].update(end_interval=[25.,26.]),
                     lambda r:r["phrases"][0]["evidence"].update(observation=" "),
                     lambda r:r["fights"][0].update(source_file_sha256="c"*64),
                     lambda r:r["fights"].append(copy.deepcopy(r["fights"][0])),
                     lambda r:r["phrases"].append(copy.deepcopy(r["phrases"][0])),
                     lambda r:r["fights"][0].update(source=[])]
        for mutate in mutations:
            p,r = fixture()
            mutate(r)
            with self.assertRaises(ValueError): audit(p,r)

    def test_strong_numeric_and_json_validation(self):
        for value in (True, "6", float("nan"), float("inf"), -1.):
            p,_ = fixture()
            p["duration"] = value
            with self.assertRaises(ValueError): audit(p)
        for value in (True,-1.,6.,float("nan")):
            p,r = fixture()
            with self.assertRaises(ValueError): audit(p,r,max_closure_gap=value)
        p,r = fixture()
        p["unknown"] = (1,2)
        with self.assertRaises(ValueError): audit(p,r)
        with self.assertRaises(ValueError): audit_closure({})
        with self.assertRaises(ValueError): audit_closure(fixture()[0], source_sha256={"source-0":"A"*64})
        with self.assertRaises(ValueError): audit_closure(fixture()[0], tolerance=.1)


if __name__ == "__main__":
    unittest.main()
