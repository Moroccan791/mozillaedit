"""Validated confirmation-file handoff to the encounters planner.

Candidates remain in their original detector file, never upgraded here.
Both bare legacy lists and povkills/v1 wrappers are accepted. Only an explicit
boolean True and recorded audio timestamp qualify for the planning handoff.
"""
from __future__ import annotations
import json
from pathlib import Path
from .encounters import group_encounters


def load_confirmed_events(filenames: list[str | Path]) -> tuple[list[dict], dict]:
    events = []
    summary = {"files": len(filenames), "observations": 0,
               "eligible": 0, "unconfirmed": 0, "missing_audio": 0}
    for filename in filenames:
        path = Path(filename)
        payload = json.loads(path.read_text(encoding="utf-8-sig"))
        wrapper_source = None
        if isinstance(payload, dict):
            version = payload.get("schema_version")
            if version is not None and version != "povkills/v1":
                raise ValueError(f"{path}: unsupported event schema {version!r}")
            if "events" not in payload:
                raise ValueError(f"{path}: event wrapper requires events")
            raw = payload["events"]
            wrapper_source = payload.get("source")
            if wrapper_source is not None:
                if not isinstance(wrapper_source, str) or not wrapper_source.strip():
                    raise ValueError(f"{path}: wrapper source must be a nonempty string")
                wrapper_source = str(Path(wrapper_source).resolve())
        else:
            raw = payload
        if not isinstance(raw, list):
            raise ValueError(f"{path}: events must be a list")
        for index, event in enumerate(raw):
            if not isinstance(event, dict):
                raise ValueError(f"{path}: event {index} must be an object")
            summary["observations"] += 1
            flag = event.get("confirmed", False)
            if type(flag) is not bool:
                raise ValueError(f"{path}: event {index} confirmed must be a boolean")
            if not flag:
                summary["unconfirmed"] += 1
                continue
            if event.get("source_audio_event") is None:
                summary["missing_audio"] += 1
                continue
            normalized = dict(event)
            source = normalized.get("source", wrapper_source)
            if not isinstance(source, str) or not source.strip():
                raise ValueError(f"{path}: event {index} requires source")
            normalized["source"] = str(Path(source).resolve())
            if wrapper_source and normalized["source"] != wrapper_source:
                raise ValueError(f"{path}: event {index} contradicts wrapper source")
            try:
                group_encounters([normalized])  # shared strict numeric contract
            except ValueError as exc:
                raise ValueError(f"{path}: event {index}: {exc}") from exc
            events.append(normalized)
            summary["eligible"] += 1
    # Also validate cross-file duration consistency, including exact duplicates.
    group_encounters(events)
    return events, summary
