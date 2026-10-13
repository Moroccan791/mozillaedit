"""Versioned per-source analysis cache paths."""
from __future__ import annotations

import hashlib
from pathlib import Path


def analysis_cache_path(path: str | Path, stage: str, version: str,
                        cache_dir: str | Path | None = None) -> Path:
    """Return a cache filename keyed by source identity and analysis version."""
    source = Path(path).resolve()
    stat = source.stat()
    identity = f"{source}|{stat.st_size}|{stat.st_mtime_ns}|{stage}|{version}"
    key = hashlib.sha256(identity.encode("utf-8")).hexdigest()[:20]
    root = (Path(cache_dir) if cache_dir is not None else
            Path(__file__).resolve().parent.parent / "cache" / "analysis")
    root.mkdir(parents=True, exist_ok=True)
    return root / f"{stage}-{key}.json"
