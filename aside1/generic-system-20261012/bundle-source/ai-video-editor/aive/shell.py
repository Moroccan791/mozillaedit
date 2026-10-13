"""Process runner: wraps FFmpeg/FFprobe calls with logging and error capture."""
from __future__ import annotations

import logging
import shutil
import subprocess
from dataclasses import dataclass
from typing import Sequence

log = logging.getLogger("aive.shell")


class ToolError(RuntimeError):
    """Raised when an external tool exits non-zero."""

    def __init__(self, cmd: Sequence[str], code: int, stderr: str) -> None:
        self.cmd = list(cmd)
        self.code = code
        self.stderr = stderr
        tail = "\n".join(stderr.strip().splitlines()[-12:])
        super().__init__(f"command failed (exit {code}): {' '.join(self.cmd)}\n{tail}")


def which(name: str) -> str | None:
    return shutil.which(name)


def require(name: str) -> str:
    path = which(name)
    if not path:
        raise FileNotFoundError(
            f"'{name}' not found on PATH. Install it and reopen the terminal."
        )
    return path


def run(
    cmd: Sequence[str],
    *,
    capture: bool = True,
    check: bool = True,
    log_cmd: bool = False,
) -> subprocess.CompletedProcess:
    """Run a command. Raises ToolError on failure when check=True."""
    c = [str(x) for x in cmd]
    if log_cmd:
        log.debug("run: %s", " ".join(c))
    proc = subprocess.run(
        c,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if check and proc.returncode != 0:
        raise ToolError(c, proc.returncode, proc.stderr or "")
    return proc


@dataclass
class FFmpeg:
    exe: str = "ffmpeg"

    def __post_init__(self) -> None:
        self.exe = require(self.exe)

    def run(self, args: Sequence[str], **kw) -> subprocess.CompletedProcess:
        return run([self.exe, "-hide_banner", "-y", *args], **kw)

    def run_stream(self, args: Sequence[str]) -> str:
        """Run and return stderr (FFmpeg writes progress/errors to stderr)."""
        proc = run([self.exe, "-hide_banner", "-y", *args])
        return proc.stderr or ""


@dataclass
class FFprobe:
    exe: str = "ffprobe"

    def __post_init__(self) -> None:
        self.exe = require(self.exe)

    def run(self, args: Sequence[str], **kw) -> subprocess.CompletedProcess:
        return run([self.exe, "-hide_banner", *args], **kw)
