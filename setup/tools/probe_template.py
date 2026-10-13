"""Find a plaintext schema: dump template.tmp structure + locate CapCut's DLLs."""
import json
from pathlib import Path

ROOT = Path(r"C:\Users\Junayed\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft")
t = ROOT / "1011" / "Timelines" / "A3F326CB-7354-4f4a-AEE9-E8AC08B1EFE3" / "template.tmp"
print("=== template.tmp size:", t.stat().st_size)
j = json.loads(t.read_text(encoding="utf-8"))
print("top keys:", list(j.keys()))
print("tracks:", type(j.get("tracks")), (len(j.get("tracks") or [])))
print("materials type:", type(j.get("materials")))
if isinstance(j.get("materials"), dict):
    nz = {k: (len(v) if isinstance(v, list) else v) for k, v in j["materials"].items() if v}
    print("nonempty materials:", nz)
print("canvas:", j.get("canvas_config"))
print("duration:", j.get("duration"), "fps:", j.get("fps"))

print("\n=== CapCut install: find videoeditor.dll / *.dll ===")
ccapps = Path(r"C:\Users\Junayed\AppData\Local\CapCut\Apps")
for d in ccapps.rglob("*.dll"):
    n = d.name.lower()
    if any(k in n for k in ("videoeditor", "encrypt", "crypto", "ve", "editor")):
        print(f"  {d.relative_to(ccapps)}  {d.stat().st_size//1024} KB")
