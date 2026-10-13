$ErrorActionPreference = 'Stop'
$root = 'E:\aside\generic-system-20261012\local-lyrics-v0001'
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
$prior = (Get-Content 'E:\aside\generic-system-20261012\identity-binding-v0001\BUNDLE-HASH-MANIFEST.json' -Raw | ConvertFrom-Json).entries
foreach ($item in $prior) {
    if ($item.source.StartsWith($repo+'\')) {
        $relative = $item.source.Substring($repo.Length+1)
        Copy-Verified $item.source ('ai-video-editor\'+$relative)
    }
}
foreach ($relative in @('aive\lyric_review.py','tests\test_lyric_review.py','tests\test_lyric_review_cli.py','tests\test_optional_lyrics_runtime.py','LYRIC-REVIEW.md')) {
    Copy-Verified (Join-Path $repo $relative) ('ai-video-editor\'+$relative)
}
Copy-Verified 'E:\aside\AI-CONTINUE-HERE.md' 'AI-CONTINUE-HERE.md'
foreach ($name in @('RESULTS.md','SETUP.md','REUSABLE-SKILL.md','full-tests.log','focused-tests.log','pip-check.log','pip-install-report.json','pip-av-compat-report.json','packages-before.txt','packages-after.txt','packages-compatible.txt','model-manifest.json','proof-summary.json','download_model.ps1','build_bundle.ps1','reflections-candidates-v0001.json','winner-candidates-v0001.json','reflections-review-v0001.json','winner-review-v0001.json','reflections-review-audit.json','winner-review-audit.json','reflections-runtime-v0002.json','winner-runtime.json','let-the-world-burn-runtime-v0002.json','dracula-runtime.json','reflections-extract.log','let-the-world-burn-extract.log','reflections-extract-v0002.log','let-the-world-burn-extract-v0002.log','dracula-extract.log','winner-extract.log','model-download.log','av-compat-install.log','install.log')) {
    Copy-Verified (Join-Path $root $name) ('evidence\'+$name)
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
