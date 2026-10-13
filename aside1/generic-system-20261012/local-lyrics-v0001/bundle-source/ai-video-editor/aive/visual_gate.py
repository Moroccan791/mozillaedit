"""Bounded source-frame screening. Not shot/kill or promotional OCR detection.

Stops black/white/static center regions; explicit observed exclusions may also
reject source ranges. Passing means no detected defect, not gameplay approval.
"""
from __future__ import annotations
import hashlib
import json
import math
from pathlib import Path
import subprocess
import numpy as np


def _num(value,name):
    if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or value<0:
        raise ValueError(f"invalid {name}")
    return float(value)


def validate_exclusions(data, sources):
    """Supplied review trail rejects footage; never confirms attacks/outcomes."""
    if not isinstance(data,dict) or set(data)!={"schema_version","exclusions"} or data["schema_version"]!="visual-exclusions/v1":
        raise ValueError("visual-exclusions/v1 required")
    values=data["exclusions"]
    if not isinstance(values,list) or len(values)>128:raise ValueError("bounded exclusions required")
    allowed={str(Path(s).resolve()) for s in sources};result=[]
    for item in values:
        if not isinstance(item,dict) or set(item)!={"source","start","end","reason","evidence","reviewer"}:
            raise ValueError("exclusion fields invalid")
        source=str(Path(item["source"]).resolve())
        if source not in allowed:raise ValueError("exclusion source outside inventory")
        a,b=(_num(item[k],k) for k in ("start","end"))
        if b<=a:raise ValueError("exclusion interval reversed")
        for key in ("reason","evidence","reviewer"):
            if not isinstance(item[key],str) or not item[key].strip():raise ValueError("exclusion provenance required")
        result.append(dict(item,source=source,start=a,end=b))
    return result


def screen_maps(firing_maps, *, exclusions=None, ffmpeg="ffmpeg", max_windows=32):
    """Decode3 frames/window at160x90. Clone maps; preserve root candidates.

    Source frame seeks for image screening only, not acoustic-clock evidence.
    Static center test ignores animated HUD corners; sampled safety is limited.
    """
    import copy
    maps=copy.deepcopy(firing_maps)
    if not isinstance(maps,list) or not 1<=len(maps)<=8:raise ValueError("bounded firing maps required")
    excluded=validate_exclusions(exclusions,[m["source"] for m in maps]) if exclusions else []
    report=dict(schema_version="visual-gate/v1",rejected=[],retained=[],limitations=[
        "Sparse source frames; not complete fight, muzzle/ammo, OCR, actor, kill or taste confirmation.",
        "Moving promotional overlays, abilities and post-round handling may pass numeric screening.",
        "Supplied rejection metadata is an audit trail, not authentication of review claims."])
    count=0
    for fmap in maps:
        keep=[]
        for window in fmap.get("candidate_windows",[]):
            count+=1
            if count>max_windows:raise ValueError("visual window budget exceeded")
            source=str(Path(fmap["source"]).resolve());a,b=window["source_start"],window["source_end"]
            record=dict(source=source,start=a,end=b,window_id=window.get("id"),status="unreviewed",metrics=[])
            matches=[e for e in excluded if e["source"]==source and a<e["end"] and b>e["start"]]
            if matches:
                record.update(status="reject",reason="supplied observed exclusion",exclusions=matches)
                report["rejected"].append(record);continue
            events=window.get("candidate_events",[])
            if not events:continue
            t=max(events,key=lambda e:e.get("strength",0))["time"]
            times=[max(a,t-.15),t,min(b-.001,t+.15)]
            images=[]
            try:
                for clock in times:
                    proc=subprocess.run([ffmpeg,"-hide_banner","-v","error","-nostdin","-ss",str(clock),
                        "-i",source,"-map","0:v:0","-frames:v","1","-vf","scale=160:90", "-pix_fmt","gray","-f","rawvideo","pipe:1"],
                        capture_output=True,timeout=20)
                    if proc.returncode or len(proc.stdout)!=14400:raise ValueError("source frame unavailable")
                    image=np.frombuffer(proc.stdout,dtype=np.uint8).reshape(90,160)
                    images.append(image)
                    record["metrics"].append(dict(time=clock,mean=float(image.mean()),std=float(image.std()),
                        black_fraction=float((image<12).mean()),white_fraction=float((image>245).mean())))
            except (ValueError,OSError,subprocess.TimeoutExpired) as exc:
                record.update(status="unavailable",reason=str(exc));report["rejected"].append(record);continue
            differences=[float(np.abs(x[15:75,25:135].astype(float)-y[15:75,25:135]).mean()) for x,y in zip(images,images[1:])]
            record["center_frame_differences"]=differences
            if any(m["black_fraction"]>.94 for m in record["metrics"]):
                record.update(status="reject",reason="near-black sampled frame")
            elif any(m["white_fraction"]>.94 for m in record["metrics"]):
                record.update(status="reject",reason="near-white sampled frame")
            elif max(differences,default=0)<.8:
                record.update(status="reject",reason="near-static sampled center; no visible action confirmation")
            if record["status"]=="reject":report["rejected"].append(record)
            else:
                window["visual_screen"]=dict(status="no_numeric_defect_detected",semantic_review="unreviewed")
                keep.append(window);report["retained"].append(record)
        fmap["candidate_windows"]=keep
    return maps,report
