"""Probe CapCut draft files: encoding, parseability, structure."""
import json
from pathlib import Path

ROOT = Path(r"C:\Users\Junayed\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft")

for name in ["1011 (1)", "1011", "0910"]:
    p = ROOT / name / "draft_content.json"
    print("=" * 40, name)
    if not p.exists():
        print("  missing")
        continue
    raw = p.read_bytes()
    print(f"  size={len(raw)} head={raw[:12]!r}")
    # try utf-8
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as e:
        print("  not utf-8:", e)
        text = raw.decode("utf-8", errors="replace")
    print(f"  decoded len={len(text)}")
    try:
        j = json.loads(text)
        print("  PARSE OK. keys:", list(j.keys())[:12])
        print("  version=", j.get("version"), "new_version=", j.get("new_version"))
    except Exception as e:
        print("  PARSE FAIL:", type(e).__name__, e)
        if hasattr(e, "pos"):
            pos = e.pos
            print("  context:", repr(text[max(0, pos - 120):pos + 120]))
