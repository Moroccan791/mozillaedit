$ErrorActionPreference = 'Stop'
$root = 'E:\aside\generic-system-20261012\identity-binding-v0001'
$repo = 'E:\ai-video-editor'
$stage = Join-Path $root 'bundle-source'
if (Test-Path $stage) { throw 'New snapshot staging already exists' }
New-Item -ItemType Directory $stage | Out-Null
$rows = [System.Collections.Generic.List[object]]::new()
function Copy-Verified([string]$source, [string]$relative) {
    $target = Join-Path $stage $relative
    New-Item -ItemType Directory (Split-Path $target) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $target
    $before = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower()
    $after = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower()
    if ($before -ne $after) { throw "Snapshot mismatch: $source" }
    $rows.Add([pscustomobject]@{source=$source;snapshot=$relative;bytes=(Get-Item -LiteralPath $source).Length;sha256=$before})
}
# Start with the prior curated source/docs/tests/fixtures allowlist, not an entire
# dirty repository. Never copy .venv, media, models, out/projects, browser data.
$prior = Get-Content 'E:\aside\generic-system-20261012\snapshot-files.json' -Raw | ConvertFrom-Json
foreach ($item in $prior) {
    if ($item.source.StartsWith($repo+'\')) {
        $relative = $item.source.Substring($repo.Length+1)
        Copy-Verified $item.source ('ai-video-editor\'+$relative)
    }
}
foreach ($relative in @('aive\media_identity.py','tests\test_media_identity.py','tests\test_render_media_identity.py','tests\test_attack_identity.py','ATTACK-CALIBRATION.md')) {
    Copy-Verified (Join-Path $repo $relative) ('ai-video-editor\'+$relative)
}
Copy-Verified 'E:\aside\AI-CONTINUE-HERE.md' 'AI-CONTINUE-HERE.md'
foreach ($name in @('RESULTS.md','REUSABLE-SKILL.md','full-tests-reviewed.log','focused-tests.log','media-identity-tests.log','streaming-decode-tests.log','cli-calibration.log','cli-calibration-report.json','run_saved_evidence.py','build_bundle.ps1')) {
    Copy-Verified (Join-Path $root $name) ('evidence\'+$name)
}
foreach ($name in @('proof-summary.json','saved-v2-attack-alignment.json','saved-v2-calibration-report.json','current-source-content-snapshot.json','proof.log','run_saved_evidence.py')) {
    Copy-Verified (Join-Path $root ('streaming-recheck\'+$name)) ('evidence\streaming-recheck\'+$name)
}
$rows | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $stage 'SOURCE-HASH-MANIFEST.json') -Encoding utf8
$zip = Join-Path $root 'AI-CONTINUATION-BUNDLE.zip'
if (Test-Path $zip) {throw 'New bundle already exists'}
Compress-Archive -Path "$stage\*" -DestinationPath $zip -CompressionLevel Optimal
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($zip)
try {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    foreach ($row in $rows) {
        $entry = $archive.GetEntry($row.snapshot.Replace('\','/'))
        if ($null -eq $entry) { $entry = $archive.GetEntry($row.snapshot) }
        if ($null -eq $entry) {throw "Archive entry missing: $($row.snapshot)"}
        $stream=$entry.Open()
        try {$hash=[Convert]::ToHexString($sha.ComputeHash($stream)).ToLower()} finally {$stream.Dispose()}
        if ($hash -ne $row.sha256) {throw "Archive hash mismatch: $($row.snapshot)"}
    }
} finally {$archive.Dispose()}
[pscustomobject]@{status='all_snapshot_and_archive_entry_hashes_verified';files=$rows.Count;bundle=$zip;bundle_bytes=(Get-Item $zip).Length;bundle_sha256=(Get-FileHash $zip -Algorithm SHA256).Hash.ToLower();entries=$rows} | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $root 'BUNDLE-HASH-MANIFEST.json') -Encoding utf8
Write-Output "Verified portable snapshot: $($rows.Count) files, $((Get-Item $zip).Length) bytes"
