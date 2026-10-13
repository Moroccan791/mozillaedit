"""Check if videoeditor.dll's EncryptUtils static functions are callable via ctypes."""
import ctypes, os, re
from pathlib import Path

DIR = Path(r"C:\Users\Junayed\AppData\Local\CapCut\Apps\9.4.0.4015")
DLL = DIR / "videoeditor.dll"

raw = DLL.read_bytes()
for kw in (b"?decryptFile@EncryptUtils", b"?encryptFile@EncryptUtils",
           b"?isFileEncrypted@EncryptUtils", b"?decryptFileBytes@EncryptUtils",
           b"?isDraftEncryptionEnable@DraftStore", b"?maxCipher@DraftIO",
           b"?getUriCipherTypeStatically@ICryptoKeyStore"):
    i = raw.find(kw)
    if i == -1:
        print("MISSING STRING:", kw.decode())
        continue
    j = i
    while j < len(raw) and 32 <= raw[j] < 127:
        j += 1
    print("NAME:", raw[i:j].decode())

print("\n--- GetProcAddress test ---")
try:
    os.add_dll_directory(str(DIR))
except Exception as e:
    print("add_dll_directory:", e)
try:
    lib = ctypes.WinDLL(str(DLL))
except Exception as e:
    print("LoadLibrary failed:", e)
    raise SystemExit

k32 = ctypes.windll.kernel32
k32.GetProcAddress.argtypes = [ctypes.c_void_p, ctypes.c_char_p]
k32.GetProcAddress.restype = ctypes.c_void_p
handle = ctypes.c_void_p(lib._handle)
for name in [
    b"?isFileEncrypted@EncryptUtils@lvve@@SA_NPEBD@Z",
    b"?decryptFile@EncryptUtils@lvve@@SAHPEBD00@Z",
    b"?encryptFile@EncryptUtils@lvve@@SAHPEBD00@Z",
]:
    addr = k32.GetProcAddress(handle, name)
    print(name.decode(), "->", hex(addr) if addr else "NOT EXPORTED")
