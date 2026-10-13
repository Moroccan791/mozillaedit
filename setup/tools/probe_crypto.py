"""Analyze CapCut's encrypted draft to identify the scheme."""
import base64
import collections
import math
from pathlib import Path

ROOT = Path(r"C:\Users\Junayed\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft")
p = ROOT / "1011" / "draft_content.json"
raw = p.read_bytes()
print("head ascii:", raw[:80])
print("head hex  :", raw[:32].hex())

txt = raw.decode("ascii", errors="replace")
allowed = set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=")
print("base64-alphabet ratio:", sum(c in allowed for c in txt) / max(1, len(txt)))

# try base64 decode
try:
    data = base64.b64decode(raw + b"=" * (-len(raw) % 4))
    print("decoded bytes:", len(data))
    print("decoded head hex:", data[:32].hex())
    print("decoded head repr:", data[:64])
    # entropy
    freq = collections.Counter(data)
    ent = -sum((c / len(data)) * math.log2(c / len(data)) for c in freq.values())
    print("entropy (bits/byte):", round(ent, 3))
except Exception as e:
    print("b64 err:", e)

# draft.extra
ex = ROOT / "1011" / "draft.extra"
print("\n=== draft.extra ===")
eraw = ex.read_bytes()
print("size:", len(eraw), "head hex:", eraw[:48].hex())
print("head repr:", eraw[:64])

# look for a key file anywhere in the project
print("\n=== candidate key/sidecar files ===")
for f in (ROOT / "1011").rglob("*"):
    if f.is_file() and f.suffix.lower() in (".extra", ".key", ".bin", ".dat", ""):
        print(" ", f.relative_to(ROOT / "1011"), f.stat().st_size)
