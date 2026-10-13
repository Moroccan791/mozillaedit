"""Read-only saved v2 proof. No rendering, labels, listening, or calibration truth."""
import hashlib
import json
from pathlib import Path
import sys

sys.path.insert(0, r'E:\ai-video-editor')
from aive.attack_qa import measure_attack_alignment
from aive.calibration_report import audit_local_evidence
from aive.media_identity import capture_media_identities

ROOT = Path(__file__).resolve().parent
SAVED = Path(r'E:\aside\reflections-fresh-20261012\resumed-local-jobs\job-v0002')
RENDER = SAVED / 'renders' / 'encounters-v0001'


def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def write(name, value):
    with (ROOT/name).open('x', encoding='utf-8') as handle:
        json.dump(value, handle, indent=2, allow_nan=False)


def main():
    manifest, plan = read(RENDER/'render-manifest.json'), read(RENDER/'plan.json')
    tracked = [RENDER/'render-manifest.json', RENDER/'plan.json', RENDER/'encounters.mp4',
               Path(manifest['game_stem']), Path(manifest['music_stem'])]
    before = capture_media_identities(tracked)
    attack = measure_attack_alignment(manifest, plan)
    write('saved-v2-attack-alignment.json', attack)
    audit = audit_local_evidence(read(SAVED/'firing-map.json'), read(SAVED/'local-icon-records.json'),
                                 read(SAVED/'hit-maps.json'), plan=plan, attack=attack)
    write('saved-v2-calibration-report.json', audit)
    # Actual current source bytes are a separate snapshot, not retroactive proof
    # that old v2 used these bytes. Its old render manifest lacks source binding.
    sources = list(dict.fromkeys(r['source'] for r in plan['timeline'])) + [manifest['music_source']]
    write('current-source-content-snapshot.json', {'status':'current_snapshot_only_not_old_render_binding',
        'identities':capture_media_identities(sources)})
    after = capture_media_identities(tracked)
    assert before == after, 'saved artifacts changed'
    assert audit['metrics'] == [] and attack['musical_sync'] == 'unverified'
    assert set(attack['source_identities']) == {'game','music'}
    prior = read(SAVED/'attack-alignment.json')
    assert prior['assignments'] == attack['assignments'], 'acoustic rows unexpectedly changed'
    summary = {'status':'read_only_evidence_checked_not_song_or_sync_certification',
        'saved_artifacts_unchanged': before == after, 'saved_artifact_identities':before,
        'attack_assignments_identical_to_prior':True,
        'attack_count':len(attack['assignments']), 'attack_coverage':audit['coverage']['attack'],
        'stem_content_bound': sorted(attack['source_identities']),
        'old_render_source_binding':attack['source_media_provenance']['status'],
        'independent_labels':0,'metrics':[], 'musical_sync':attack['musical_sync']}
    write('proof-summary.json', summary)
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
