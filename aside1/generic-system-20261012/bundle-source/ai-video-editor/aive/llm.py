"""LLM interface (free/local).

Priority:
  1. Ollama  (if the `ollama` CLI is on PATH and a model is available)
  2. Rule-based fallback  (deterministic heuristics; always works, no model)

No paid APIs are ever called.
"""
from __future__ import annotations

import json
import re
import shutil
import subprocess
from typing import Any

DEFAULT_MODEL = "llama3.2"
_TIMEOUT = 120


def ollama_available() -> bool:
    return shutil.which("ollama") is not None


def list_models() -> list[str]:
    if not ollama_available():
        return []
    try:
        proc = subprocess.run(["ollama", "list"], capture_output=True,
                              text=True, timeout=20)
    except (subprocess.SubprocessError, OSError):
        return []
    names = []
    for line in (proc.stdout or "").splitlines()[1:]:
        parts = line.split()
        if parts:
            names.append(parts[0])
    return names


def generate(prompt: str, model: str | None = None,
             system: str | None = None) -> str | None:
    """Run a local Ollama model. Returns None if Ollama isn't usable."""
    if not ollama_available():
        return None
    model = model or (_pick_model(list_models()) or DEFAULT_MODEL)
    cmd = ["ollama", "run", model, prompt]
    if system:
        cmd = ["ollama", "run", model, f"<<SYS>>{system}<</SYS>>\n{prompt}"]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True,
                              timeout=_TIMEOUT, encoding="utf-8",
                              errors="replace")
    except (subprocess.SubprocessError, OSError):
        return None
    return (proc.stdout or "").strip() or None


def _pick_model(models: list[str]) -> str | None:
    for prefer in ("llama3.2", "llama3", "mistral", "qwen", "phi"):
        for m in models:
            if m.startswith(prefer):
                return m
    return models[0] if models else None


def ask_json(prompt: str, model: str | None = None,
             fallback: Any = None) -> Any:
    """Ask for JSON; parse leniently; fall back to a default on any failure."""
    raw = generate(prompt + "\n\nRespond with ONLY valid JSON.", model=model,
                   system="You are a precise video-editing assistant. Output JSON only.")
    if not raw:
        return fallback
    return _parse_json(raw, fallback)


def _parse_json(raw: str, fallback: Any) -> Any:
    # strip code fences
    txt = re.sub(r"```(?:json)?", "", raw).strip()
    try:
        return json.loads(txt)
    except json.JSONDecodeError:
        pass
    # find first {...} or [...] block
    for pat in (r"\{.*\}", r"\[.*\]"):
        m = re.search(pat, txt, re.DOTALL)
        if m:
            try:
                return json.loads(m.group(0))
            except json.JSONDecodeError:
                continue
    return fallback
