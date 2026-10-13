"""Bounded multi-event 1x candidate rhythm planning, not firing confirmation.

Ranks acoustic preview candidates; preserves every event in selected windows.
No BPM grid, synthetic attacks, source retiming, kill identity or taste claim.
"""
from __future__ import annotations
import copy
import math
from pathlib import Path


def _num(value, name, lo=0., hi=float("inf")):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not lo <= value <= hi:
        raise ValueError(f"invalid {name}")
    return float(value)


def _interval(value, time, name):
    if not isinstance(value, (list, tuple)) or len(value) != 2:
        raise ValueError(f"invalid {name}")
    a,b=(_num(v,name) for v in value)
    if not a <= time <= b or b-a > .25:
        raise ValueError(f"invalid {name} range")
    return [a,b]


def match_events(events, hits, *, source_start, output_start, music_start,
                 tolerance_ms=35.):
    """Order-preserving one-to-one DP; unmatched attacks remain explicit.

    Interval overlap is uncertainty, not proof of identity. Score uses measured
    center errors, not a tolerance inflated by uncertainty. No hit reuse.
    """
    tolerance=_num(tolerance_ms,"tolerance_ms",1,100)/1000
    ss,os,ms=(_num(v,n) for v,n in ((source_start,"source_start"),(output_start,"output_start"),(music_start,"music_start")))
    if not isinstance(events,list) or not isinstance(hits,list) or len(events)>32 or len(hits)>32:
        raise ValueError("bounded event/hit lists required")
    parsed=[]
    for event in events:
        if not isinstance(event,dict):raise ValueError("event object required")
        t=_num(event.get("time",event.get("source_audio_event")),"event time")
        _interval(event.get("attack_interval",[t,t]),t,"attack_interval")
        if t<ss:raise ValueError("event before source start")
        parsed.append((t,event))
    parsed.sort(key=lambda x:x[0])
    target=[]
    for hit in hits:
        if not isinstance(hit,dict):raise ValueError("hit object required")
        t=_num(hit.get("time"),"hit time")
        _interval(hit.get("refined_interval",[t,t]),t,"hit interval")
        target.append((t,hit))
    target.sort(key=lambda x:x[0])
    # DP stores score and assignments. Skipping a source attack costs1.5;
    # matching a weak distant hit is never better than a closer strong one.
    memo={}
    def solve(i,j):
        if i==len(parsed):return 0.,[]
        if (i,j) in memo:return memo[i,j]
        score,rest=solve(i+1,j)
        best=(score-1.5,[(i,None)]+rest)
        st,_=parsed[i];mt=ms+os+st-ss
        for k in range(j,len(target)):
            ht,hit=target[k];error=abs(ht-mt)
            if error>tolerance:continue
            strength=_num(hit.get("strength",.5),"hit strength",0,1)
            tail,items=solve(i+1,k+1)
            option=(tail+2+strength-error/tolerance,[(i,k)]+items)
            if option[0]>best[0]:best=option
        memo[i,j]=best
        return best
    score,choices=solve(0,0)
    assignments=[]
    for i,k in choices:
        st,event=parsed[i];ot=os+st-ss
        record=dict(event_id=str(event.get("id",f"event-{i}")),source_time=st,output_time=ot,
                    source_interval=event.get("attack_interval",[st,st]),matched=k is not None,
                    event_status="candidate" if event.get("confirmed") is not True else "supplied-reviewed",
                    semantic_sync="unverified")
        if k is None:
            record.update(music_hit_id=None,music_time=None,music_interval=None,planned_error_ms=None)
        else:
            ht,hit=target[k]
            record.update(music_hit_id=str(hit.get("id",f"hit-{k}")),music_time=ht,
                          music_interval=hit.get("refined_interval",[ht,ht]),
                          planned_error_ms=1000*(ms+ot-ht),hit_review_status=hit.get("review_status","unreviewed"))
        assignments.append(record)
    return dict(score=score,assignments=assignments,matched=sum(a["matched"] for a in assignments),total=len(assignments))


def plan_candidate_rhythm(firing_maps, hit_map, *, duration=10., music_start=None,
                          min_clips=4, max_clips=8, max_extension=.65, beam_width=24):
    """Select bounded intact candidate windows and rank ALL retained attacks.

    Extensions change clip entry only, not source speed or source event clocks.
    Source windows, semantic outcome and song phrase remain unreviewed. A sparse
    result blocks authored export; it is never filled with invented shots.
    """
    requested=_num(duration,"duration",1,12)
    if type(min_clips) is not int or type(max_clips) is not int or not 4<=min_clips<=max_clips<=8:
        raise ValueError("four..eight authored clips required")
    if type(beam_width) is not int or not 1<=beam_width<=64:raise ValueError("invalid beam_width")
    extension=_num(max_extension,"max_extension",0,1)
    if not isinstance(hit_map,dict) or hit_map.get("schema_version")!="hit-map/v1":raise ValueError("hit-map/v1 required")
    raw_hits=hit_map.get("candidates",[])
    if not isinstance(raw_hits,list) or len(raw_hits)>32:raise ValueError("bounded hit candidates required")
    hits=[]
    for hit in raw_hits:
        if not isinstance(hit,dict):raise ValueError("hit object required")
        if hit.get("preview_eligible") is not True:continue
        normalized=copy.deepcopy(hit)
        # Candidate spectral peak and acoustic attack are different clocks.
        # Production preview uses the measured attack, never blindly peak time.
        normalized["review_status"]="unreviewed"
        normalized["confirmed"]=False
        normalized["original_peak_time"]=normalized["time"]
        normalized["time"]=_num(normalized.get("refined_time",normalized["time"]),"refined hit time")
        normalized["refined_interval"]=_interval(normalized.get("refined_interval"),normalized["time"],"refined hit interval")
        hits.append(normalized)
    # Different spectral peaks can refine to the SAME acoustic attack. Retain
    # strongest once, not two nominal hits for a pair of gameplay candidates.
    distinct=[]
    for hit in sorted(hits,key=lambda h:-h["strength"]):
        lo,hi=hit["refined_interval"]
        if any(abs(hit["time"]-other["time"]) < .035 or
               (lo <= other["refined_interval"][1] and hi >= other["refined_interval"][0])
               for other in distinct):continue
        distinct.append(hit)
    hits=sorted(distinct,key=lambda h:h["time"])
    if len(hits)>32:raise ValueError("too many hit candidates")
    excerpt=hit_map.get("excerpt",{})
    default_start=hit_map.get("excerpt_start",excerpt.get("start",0.))
    ms=_num(default_start if music_start is None else music_start,"music_start")
    windows=[]
    skipped_windows=[]
    if not isinstance(firing_maps,list) or not 1<=len(firing_maps)<=24:raise ValueError("bounded firing maps required")
    for fmap in firing_maps:
        if not isinstance(fmap,dict) or fmap.get("schema_version")!="firing-map/v1":raise ValueError("firing-map/v1 required")
        source=fmap.get("source")
        if not isinstance(source,str) or not source.strip():raise ValueError("firing source required")
        source=str(Path(source).resolve())
        sd=_num(fmap.get("source_duration"),"source_duration",.1,86400)
        candidates=fmap.get("candidate_windows",[])
        if not isinstance(candidates,list) or len(candidates)>32:raise ValueError("bounded candidate windows required")
        for candidate in candidates:
            a=_num(candidate.get("source_start"),"window start",0,sd)
            b=_num(candidate.get("source_end"),"window end",0,sd)
            if not .4<=b-a<=3.5:
                skipped_windows.append(dict(source=source,start=a,end=b,reason="window length outside proof bounds"))
                continue
            events=copy.deepcopy(candidate.get("candidate_events",[]))
            if not isinstance(events,list) or not 1<=len(events)<=8:
                skipped_windows.append(dict(source=source,start=a,end=b,reason="event count outside1..8; intact omission, no burst truncation"))
                continue
            for i,event in enumerate(events):
                t=_num(event.get("time"),"event time",a,b)
                event["attack_interval"]=_interval(event.get("attack_interval",[t,t]),t,"attack_interval")
                event["strength"]=_num(event.get("strength",.5),"event strength",0,1)
                event["id"]=str(event.get("id",f"{len(windows)}-{i}"))
                if event.get("confirmed") is True:raise ValueError("candidate mode cannot promote confirmed flags")
            events.sort(key=lambda e:e["time"])
            # Keep the full detected source map to prevent an entry extension
            # from quietly importing unassigned neighboring attacks.
            root_events=fmap.get("candidate_events",events)
            if not isinstance(root_events,list):raise ValueError("candidate_events list required")
            windows.append(dict(source=source,source_duration=sd,start=a,end=b,events=events,
                                all_events=root_events,id=len(windows),strength=max(e["strength"] for e in events)))
    windows=sorted(windows,key=lambda w:(-w["strength"],w["source"],w["start"]))[:64]
    # Beam state: score, cursor, selected rows, assignments, used ids/ranges.
    states=[(0.,0.,[],[],set())];finished=[]
    for depth in range(max_clips):
        next_states=[]
        for score,cursor,rows,assignments,used in states:
            for win in windows:
                if win["id"] in used or len(assignments)+len(win["events"])>32:continue
                source_events=win["events"]
                main=max(source_events,key=lambda e:e["strength"])
                # Candidate entry can extend setup modestly to place a real
                # acoustic candidate on a real measured song hit, never grid.
                entries={win["start"]}
                for hit in hits:
                    entry=main["time"]-(hit["time"]-ms-cursor)
                    if max(0,win["start"]-extension)<=entry<=win["start"]:entries.add(entry)
                for a in sorted(entries):
                    b=win["end"];length=b-a
                    retained=[copy.deepcopy(e) for e in win["all_events"] if a <= e["time"] <= b]
                    if not 1 <= len(retained) <= 8 or len(assignments)+len(retained)>32:continue
                    retained.sort(key=lambda e:e["time"])
                    # Fail any range that cuts through a detected attack interval.
                    if any(e["attack_interval"][0] < a or e["attack_interval"][1] > b for e in retained):continue
                    if cursor+length>requested+1e-8:continue
                    if any(row["source"]==win["source"] and a<row["source_end"]-1e-8 and b>row["source_start"]+1e-8 for row in rows):continue
                    # Directional bridge and ending need neutral edge room.
                    if retained[0]["attack_interval"][0]-a<.32 or b-retained[-1]["attack_interval"][1]<.42:continue
                    matching=match_events(retained,hits,source_start=a,output_start=cursor,music_start=ms)
                    if matching["matched"]==0:continue
                    new_events=[]
                    for event in retained:
                        new_events.append(dict(event,source=win["source"],source_audio_event=event["time"],
                                               output_audio_event=cursor+event["time"]-a,
                                               confirmed=False))
                    row=dict(source=win["source"],source_start=a,source_end=b,
                             output_start=cursor,output_end=cursor+length,music_start=ms+cursor,
                             music_end=ms+cursor+length,speed=1.,events=[],candidate_events=new_events,
                             candidate_window_id=win["id"],context_provenance={"kind":"unreviewed_candidate_window",
                                 "start":win["start"],"end":b,"outcome":"unknown"})
                    new_assignments=[dict(record,clip_index=len(rows)) for record in matching["assignments"]]
                    # Matched fraction prevents dense bursts from dominating
                    # an isolated shot just through cardinality.
                    fit=matching["score"]/matching["total"]+win["strength"]-.05*length
                    next_states.append((score+fit,cursor+length,rows+[row],assignments+new_assignments,used|{win["id"]}))
        next_states.sort(key=lambda s:(-s[0],s[1]))
        states=next_states[:beam_width]
        if depth+1>=min_clips:
            finished.extend(state for state in states if state[1] >= min(8.,requested)-1e-8)
        if not states:break
    best=max(finished,key=lambda s:(s[0]/len(s[2]),-s[1])) if finished else (0.,0.,[],[],set())
    _,actual,rows,assignments,_=best
    warnings=["Candidate preview only: audio transients are not confirmed POV shots/kills; musical suitability and phrase are unreviewed.",
              "All selected candidate attacks retain 1x timing; unmatched attacks are explicitly reported, not forced onto beats.",
              "Window outcome/completeness unknown; source-authored effects may already exist."]
    if actual<requested-1e-8:warnings.append(f"shorter than requested by {requested-actual:.3f}s; no filler or reuse")
    return dict(schema_version="encounters/v1",mode="candidate-preview",requested_duration=requested,
                duration=actual,music_start=ms,music_end=ms+actual,music_continuous=True,gaps=[],timeline=rows,
                rhythm_assignments=assignments,rhythm_summary=dict(matched=sum(a["matched"] for a in assignments),
                total=len(assignments),semantic_sync="unverified",beam_width=beam_width),warnings=warnings,
                omitted_encounters=skipped_windows,review_status="unreviewed",
                candidate_selection_scope=dict(eligible_windows=len(windows),explicitly_omitted_windows=len(skipped_windows),
                    acoustic_hit_count=len(hits),original_eligible_hit_count=sum(h.get("preview_eligible") is True for h in raw_hits),
                    policy="All root candidates in selected source ranges are retained; dense windows omitted intact."))


def author_candidate_design(plan, *, fps=60):
    """Deterministic roles and anchor-safe edge bridge/fade, no new labels."""
    if type(fps) is not int or not 10<=fps<=120:raise ValueError("invalid authored fps")
    result=copy.deepcopy(plan);rows=result.get("timeline",[])
    if not 4<=len(rows)<=8:raise ValueError("four..eight planned clips needed for authored sequence")
    from .encounter_render import _rounded
    roles=["impact"]*len(rows);roles[0]="setup";roles[-1]="payoff"
    # A weaker rhythm fit is not permission to obscure a dense active burst.
    # Select a middle clip with fewer retained candidates for contrast.
    contrast=min(range(2,len(rows)-1),key=lambda i:(len(rows[i]["candidate_events"]),i))
    roles[contrast]="contrast"
    bridges=[]
    for i in range(1,len(rows)):
        previous,current=rows[i-1],rows[i]
        left=previous["source_end"]-max(e["attack_interval"][1] for e in previous["candidate_events"])-.20
        right=min(e["attack_interval"][0] for e in current["candidate_events"])-current["source_start"]-.20
        n=min(12,math.floor(min(left,right)*fps),
              (_rounded(previous["output_end"],fps)-_rounded(previous["output_start"],fps))//3,
              (_rounded(current["output_end"],fps)-_rounded(current["output_start"],fps))//3)
        if n>=2:bridges.append(dict(boundary=i,direction="right" if i%2==0 else "left",frames=n))
    if not bridges:raise ValueError("no candidate-anchor-safe bridge fits")
    last=rows[-1]
    # Leave neutral space before fade, do not cover last retained attack.
    fade=min(round(.4*fps),math.floor((last["source_end"]-max(e["attack_interval"][1] for e in last["candidate_events"])-.20)*fps),
             (_rounded(last["output_end"],fps)-_rounded(last["output_start"],fps))//2)
    if fade<2:raise ValueError("no candidate-anchor-safe ending fade fits")
    result["authored_design"]=dict(schema_version="authored-footage/v1",
        shots=[dict(role=r,composition="inset" if r=="contrast" else "full") for r in roles],
        bridges=bridges,ending=dict(fade_frames=fade))
    result["authored_role_scope"]="Generated render roles, not reviewed gameplay semantics or approved composition."
    result["candidate_protection"]="Bridge/fade windows exclude every supplied candidate attack interval with 0.18s margin; identity remains unreviewed."
    return result
