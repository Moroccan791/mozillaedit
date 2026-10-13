"""Recheck retained stems, preserving old QA and all render files."""
import json
from pathlib import Path
import sys
sys.path.insert(0, str(Path('E:/ai-video-editor')))
from aive.attack_qa import measure_attack_alignment
root = Path(__file__).resolve().parent
job = root.parent/'automation-20261012'/'jobs'/'job-v0004'
old = json.loads((job/'attack-alignment.json').read_text())
report = measure_attack_alignment(job/'renders'/'encounters-v0001'/'render-manifest.json', job/'timeline.json')
(root/'attack-alignment-diagnostics.json').write_text(json.dumps(report, indent=2, allow_nan=False))
summary = []
for previous, current in zip(old['assignments'], report['assignments']):
    row = {'assignment': current['assignment_index'], 'status_before': previous['status'], 'status_after': current['status'], 'decision_unchanged': previous['status']==current['status'], 'stems': {}}
    for kind in ('game', 'music'):
        before, after = previous[kind+'_attack'], current[kind+'_attack']
        row['decision_unchanged'] &= all(before.get(k)==after.get(k) for k in ('status','time','attack_range','candidates'))
        diag = after.get('diagnostics', {})
        reasons = {}
        for peak in diag.get('peaks', []):
            for reason in peak['reasons']:
                reasons[reason] = reasons.get(reason, 0)+1
        row['stems'][kind] = {'status': after['status'], 'fused_baseline': diag.get('fused_baseline'), 'considered_peaks': diag.get('peak_count', 0), 'rejection_reasons': reasons, 'bands': diag.get('band_summary', [])}
    summary.append(row)
result = {'schema_version': 'attack-diagnostic-comparison/v1', 'all_decisions_unchanged': all(r['decision_unchanged'] for r in summary), 'musical_sync': report['musical_sync'], 'assignments': summary}
(root/'attack-diagnostic-summary.json').write_text(json.dumps(result, indent=2, allow_nan=False))
print(json.dumps(result, indent=2))
