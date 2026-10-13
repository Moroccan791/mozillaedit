$ErrorActionPreference='Stop'
$root='E:\aside\generic-system-20261012\local-lyrics-v0001'
$modelRoot='E:\ai-video-editor\models\faster-whisper-small.en-d1d751a5'
$revision='d1d751a5f8271d482d14ca55d9e2deeebbae577f'
if(Test-Path $modelRoot){throw 'Versioned model path already exists; inspect instead of overwrite'}
New-Item -ItemType Directory $modelRoot | Out-Null
$files=@(
    @{name='README.md';size=1330},
    @{name='config.json';size=2657},
    @{name='model.bin';size=483545366;sha256='62b2a45b05ee59acb4a5341b33ee35e041395d378d418a18acfe4c9e768ee37a'},
    @{name='tokenizer.json';size=2128466},
    @{name='vocabulary.txt';size=422309}
)
$records=[System.Collections.Generic.List[object]]::new()
$watch=[System.Diagnostics.Stopwatch]::StartNew()
foreach($file in $files){
    $url="https://huggingface.co/Systran/faster-whisper-small.en/resolve/$revision/$($file.name)"
    $partial=Join-Path $modelRoot ($file.name+'.partial')
    $target=Join-Path $modelRoot $file.name
    Invoke-WebRequest -Uri $url -OutFile $partial -TimeoutSec 600
    if((Get-Item $partial).Length -ne $file.size){throw "Size mismatch for $($file.name)"}
    $hash=(Get-FileHash $partial -Algorithm SHA256).Hash.ToLower()
    if($file.sha256 -and $file.sha256 -ne $hash){throw "Published LFS SHA256 mismatch for $($file.name)"}
    Move-Item $partial $target
    $records.Add([pscustomobject]@{file=$file.name;size_bytes=$file.size;sha256=$hash;published_sha256=$file.sha256;url=$url})
    Write-Output "Verified $($file.name): $($file.size) bytes"
}
$watch.Stop()
[pscustomobject]@{schema='local-model-setup/v1';status='downloaded_verified_not_lyric_accuracy';repository='Systran/faster-whisper-small.en';revision=$revision;license='MIT (model card)';path=$modelRoot;download_seconds=$watch.Elapsed.TotalSeconds;files=$records;inference=@{device='cpu';compute_type='int8';cpu_threads=2;num_workers=1;local_files_only=$true};limitations=@('Singing accuracy unverified','Downloaded weights checked against published LFS SHA256','All inference local; no audio upload')} | ConvertTo-Json -Depth 7 | Set-Content "$root\model-manifest.json" -Encoding utf8
Write-Output "Model setup finished in $($watch.Elapsed.TotalSeconds) seconds"
