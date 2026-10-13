"""Inspect CapCut videoeditor.dll exports for EncryptUtils (the draft codec)."""
import sys
from pathlib import Path

dll = Path(r"C:\Users\Junayed\AppData\Local\CapCut\Apps\9.4.0.4015\videoeditor.dll")
print("dll:", dll, dll.stat().st_size // 1024 // 1024, "MB")

try:
    import pefile
except ImportError:
    print("pefile NOT installed")
    sys.exit(0)

pe = pefile.PE(str(dll), fast_load=True)
pe.parse_data_directories(
    directories=[pefile.DIRECTORY_ENTRY["IMAGE_DIRECTORY_ENTRY_EXPORT"]]
)
print("machine: 0x%04x" % pe.FILE_HEADER.Machine, "(0x8664=x64)")
names = []
if hasattr(pe, "DIRECTORY_ENTRY_EXPORT"):
    for exp in pe.DIRECTORY_ENTRY_EXPORT.symbols:
        if exp.name:
            names.append(exp.name.decode("ascii", "replace"))
print("total named exports:", len(names))
hits = [n for n in names if any(k in n for k in ("Encrypt", "decrypt", "Decrypt", "draft", "Draft"))]
print("encrypt/draft-related exports (%d):" % len(hits))
for n in hits[:60]:
    print("  ", n)
