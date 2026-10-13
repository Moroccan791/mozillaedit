"""Try to use CapCut's own EncryptUtils to identify + decrypt a draft (on COPIES)."""
import ctypes, os, shutil, glob
from pathlib import Path

DIR = Path(r"C:\Users\Junayed\AppData\Local\CapCut\Apps\9.4.0.4015")
DRAFTS = Path(r"C:\Users\Junayed\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft")
WORK = Path(r"E:\ai-video-editor\tools\_dllwork")
WORK.mkdir(parents=True, exist_ok=True)

os.add_dll_directory(str(DIR))
lib = ctypes.WinDLL(str(DIR / "videoeditor.dll"))
k32 = ctypes.windll.kernel32
k32.GetProcAddress.argtypes = [ctypes.c_void_p, ctypes.c_char_p]
k32.GetProcAddress.restype = ctypes.c_void_p
H = ctypes.c_void_p(lib._handle)

def fn(name, restype, argtypes):
    addr = k32.GetProcAddress(H, name)
    if not addr:
        return None
    proto = ctypes.CFUNCTYPE(restype, *argtypes)
    return proto(addr)

is_enc = fn(b"?isFileEncrypted@EncryptUtils@lvve@@SA_NPEBD@Z", ctypes.c_bool, [ctypes.c_char_p])
dec_f = fn(b"?decryptFile@EncryptUtils@lvve@@SAHPEBD00@Z", ctypes.c_int,
           [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_char_p])
enc_f = fn(b"?encryptFile@EncryptUtils@lvve@@SAHPEBD00@Z", ctypes.c_int,
           [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_char_p])

print("is_enc:", bool(is_enc), "decryptFile:", bool(dec_f), "encryptFile:", bool(enc_f))

for d in ("0910", "1011", "1011 (1)"):
    p = DRAFTS / d / "draft_content.json"
    if not p.exists():
        print(d, "-> missing", p); continue
    print(d, "isFileEncrypted =", is_enc(str(p).encode())
          if is_enc else "n/a", "| size", p.stat().st_size)

src = DRAFTS / "1011" / "draft_content.json"
copy = WORK / "1011_content.json"
shutil.copy2(src, copy)
print("\ncopy at", copy, copy.stat().st_size, "bytes; head:", copy.read_bytes()[:24])

if dec_f:
    out = WORK / "1011_dec.json"
    if out.exists(): out.unlink()
    for label, args in [
        ("in,out,key_empty", (str(copy), str(out), b"")),
        ("in,key_empty,out", (str(copy), b"", str(out))),
        ("key_empty,in,out", (b"", str(copy), str(out))),
    ]:
        try:
            rc = dec_f(*[a.encode() if isinstance(a, str) else a for a in args])
            made = out.exists()
            print(f"decryptFile({label}) -> rc={rc} out_exists={made}",
                  ("head=" + repr(out.read_bytes()[:16])) if made else "")
            if made: break
        except Exception as e:
            print(label, "EXC", e)
