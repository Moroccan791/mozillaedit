from aive import project as P, render_chunked
import sys, os
p = P.Project.load(sys.argv[1])
out = sys.argv[2]
r = render_chunked.render_chunked(p, out, encoder=None, quality=20, ass_path=None)
print(f"done {out} {r.duration}s")
