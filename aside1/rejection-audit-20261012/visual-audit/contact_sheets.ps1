$ErrorActionPreference='Stop'
$out='C:\Users\Junayed\.aside\u\3\sessions\2026-10-12_BD3SnMn4J708Lutn\tmp'
$styled='E:\aside\other-stages-20261012\jobs\job-v0001\renders\encounters-v0001\encounters.mp4'
$clean='E:\aside\other-stages-20261012\resume-comparison-20261012\clean-renders\encounters-v0001\encounters.mp4'
$burn='E:\reference\YTDown.com_YouTube_Media_YJWDatNCoCM_Let-The-World-Burn-Valorant-Montage_002_720p.mp4'
$espresso='E:\reference\YTDown.com_YouTube_Media_Vp5ClXhplkU_Espresso-Valorant-Montage_002_720p.mp4'
function Sheet($inputPath,$name,$start,$duration,$fps,$grid,$width) {
  $filter="fps=$fps,scale=${width}:-1,setpts=PTS+$start/TB,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':x=5:y=5:fontsize=17:fontcolor=white:box=1:boxcolor=black@0.7,tile=${grid}:padding=3:margin=3"
  & ffmpeg -hide_banner -loglevel error -nostdin -n -ss $start -t $duration -i $inputPath -an -vf $filter -frames:v 1 (Join-Path $out "$name.jpg")
  if($LASTEXITCODE -ne 0){throw "Sheet failed $name"}
  Write-Output "$name complete"
}
Sheet $styled 'styled-all-2fps' 0 23.5334 2 '8x6' 320
Sheet $clean 'clean-all-2fps' 0 23.5334 2 '8x6' 320
Sheet $burn 'burn-all-2fps' 0 30.2167 2 '8x8' 320
Sheet $espresso 'espresso-all-2fps' 0 36 2 '8x9' 320
Sheet $burn 'burn-9to13-12fps' 9 4 12 '8x6' 320
Sheet $espresso 'espresso-16to20-8fps' 16 4.5 8 '6x6' 384
Sheet $styled 'styled-first-impact-12fps' 1.5 1 12 '4x3' 480
Sheet $clean 'clean-first-impact-12fps' 1.5 1 12 '4x3' 480
Sheet $styled 'styled-ending-4fps' 20.5 3.03 4 '4x4' 480