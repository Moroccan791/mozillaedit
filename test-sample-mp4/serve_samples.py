#!/usr/bin/env python3
"""Tiny preview server for this folder: serves the sample MP4s with HTTP Range
support so a browser can play and seek them.

Not part of the editor pipeline — it only reads files in this directory and
writes nothing. Stdlib only, works on Windows/macOS/Linux.

Usage:
    python3 serve_samples.py [port]      # default 8710
Then open http://localhost:8710/ (index.html shows both samples).
"""
import functools
import http.server
import os
import re
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8710
ROOT = str(Path(__file__).resolve().parent)


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler plus byte-range responses for video seeking."""

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            handle = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        size = os.fstat(handle.fileno()).st_size
        ctype = self.guess_type(path)
        match = re.match(r"bytes=(\d*)-(\d*)$", self.headers.get("Range", "").strip())
        if match and (match.group(1) or match.group(2)):
            start = int(match.group(1)) if match.group(1) else 0
            end = int(match.group(2)) if match.group(2) else size - 1
            end = min(end, size - 1)
            if start > end or start >= size:
                handle.close()
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return None
            self.send_response(206)
            self.send_header("Content-Type", ctype)
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(end - start + 1))
            self.end_headers()
            if self.command != "HEAD":
                handle.seek(start)
                self.wfile.write(handle.read(end - start + 1))
            handle.close()
            return None
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        return None if self.command == "HEAD" else handle

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):  # keep the console quiet but useful
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT),
                                         functools.partial(RangeHandler, directory=ROOT)) as server:
        print(f"serving {ROOT} on 0.0.0.0:{PORT}")
        server.serve_forever()
