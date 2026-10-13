"""Run revised decoded QA on an already-rendered versioned proof."""
import importlib.util,json,sys,subprocess
from pathlib import Path
root=Path(__file__).parent
sys.path.insert(0,'E:/ai-video-editor')
from aive.qa import verify
spec=importlib.util.spec_from_file_location('proof_adapter',root/'render_existing.py'); adapter=importlib.util.module_from_spec(spec);spec.loader.exec_module(adapter)
job=Path(sys.argv[1]); c=json.loads((job/'project.json').read_text()); timing=json.loads((job/'timing.json').read_text());out=job/(sys.argv[2] if len(sys.argv)>2 else 'sync-proof.mp4')
report=verify(str(out),want_audio=True,text_times=None,black_times=None)
lines,ok=adapter._verify_timing(Path(c['source']),Path(c['music']),out,timing['events'],timing['fps'])
message=report.render()+'\n\n'+'\n'.join(lines)+f"\n\nOVERALL: {'PASS' if ok and report.ok else 'FAIL'}\n"
(job/f'{out.stem}-qa-v2.txt').write_text(message);print(message)
