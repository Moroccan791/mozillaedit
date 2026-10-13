$ErrorActionPreference='Stop'
$out='C:\Users\Junayed\.aside\u\3\sessions\2026-10-12_BD3SnMn4J708Lutn\tmp'
$styled='E:\aside\other-stages-20261012\jobs\job-v0001\renders\encounters-v0001\encounters.mp4'
$burn='E:\reference\YTDown.com_YouTube_Media_YJWDatNCoCM_Let-The-World-Burn-Valorant-Montage_002_720p.mp4'
$filter="select='between(n,267,278)+between(n,503,514)+between(n,776,787)+between(n,959,970)+between(n,1193,1204)',scale=400:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':x=5:y=5:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.7,tile=6x10:padding=3:margin=3"
& ffmpeg -hide_banner -loglevel error -nostdin -n -i $styled -an -vf $filter -frames:v 1 (Join-Path $out 'styled-exact-cut-frames.jpg')
$filter="select='gte(n,1400)',scale=480:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':x=5:y=5:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.7,tile=4x3:padding=3:margin=3"
& ffmpeg -hide_banner -loglevel error -nostdin -n -i $styled -an -vf $filter -frames:v 1 (Join-Path $out 'styled-exact-final-frames.jpg')
$filter="select='between(n,1668,1685)',scale=400:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':x=5:y=5:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.7,tile=6x3:padding=3:margin=3"
& ffmpeg -hide_banner -loglevel error -nostdin -n -i $burn -an -vf $filter -frames:v 1 (Join-Path $out 'burn-exact-ending.jpg')