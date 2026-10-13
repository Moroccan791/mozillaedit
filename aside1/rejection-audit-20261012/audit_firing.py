"""Independent source firing audit, not retrospective timestamp QA."""
import json, subprocess
from pathlib import Path
import numpy as np
from scipy.signal import butter,sosfilt,find_peaks
ROOT=Path(r'E:\aside\rejection-audit-20261012')
TMP=Path(r'C:\Users\Junayed\.aside\u\3\sessions\2026-10-12_BD3SnMn4J708Lutn\tmp')
plan=json.loads(Path(r'E:\aside\other-stages-20261012\jobs\job-v0001\timeline.json').read_text())
results=[]
for i,row in enumerate(plan['timeline']):
    start,end=row['source_start'],row['source_end'];duration=end-start
    first=round(start*48000);last=round(end*48000)
    # Decode from true samplezero: compressed seeking must not define the
    # attack clock when auditing tens-of-milliseconds source label errors.
    args=['ffmpeg','-hide_banner','-v','error','-nostdin','-t',str(end+.1),'-i',row['source'],'-map','0:a:0','-ac','1','-af',f'aresample=48000,atrim=start_sample={first}:end_sample={last},asetpts=N/SR/TB','-f','f32le','pipe:1']
    start=first/48000
    proc=subprocess.run(args,capture_output=True,check=True,timeout=60)
    x=np.frombuffer(proc.stdout,dtype='<f4');rate=48000
    bands={}
    for name,low,high in [('low',60,220),('mid',500,2500),('high',3000,10000)]:
        y=sosfilt(butter(4,[low,high],btype='bandpass',fs=rate,output='sos'),x)
        n=len(y)//48;chunks=y[:n*48].reshape(n,48)
        energy=np.sqrt(np.mean(chunks**2,axis=1)+1e-14)
        db=20*np.log10(energy+1e-12);novel=np.maximum(0,db[3:]-db[:-3])
        peaks,props=find_peaks(novel,height=8,distance=60,prominence=4)
        strong=[{'source_time':start+(int(p)+3+.5)/1000,'output_time':row['output_start']+(int(p)+3+.5)/1000,'rise_db':float(h),'level_db':float(db[p+3])} for p,h in zip(peaks,props['peak_heights']) if db[p+3]>-48]
        bands[name]=strong
    target=row['anchor']['source_audio_event']
    near=sorted(bands['high'],key=lambda p:abs(p['source_time']-target))[:5]
    sheet=TMP/f'firing-audit-source-{i:02d}.jpg'
    count=int(np.ceil(duration*12))
    subprocess.run(['ffmpeg','-hide_banner','-v','error','-nostdin','-ss',str(start),'-i',row['source'],'-t',str(duration),'-vf',f'fps=12,scale=320:180,tile=6x{int(np.ceil(count/6))}','-frames:v','1','-update','1','-y',str(sheet)],capture_output=True,check=True,timeout=60)
    results.append({'index':i,'source':row['source'],'source_start':start,'source_end':end,'anchor':target,'output_anchor':row['anchor']['output_time'],'bands':bands,'nearest_high_attacks':near,'sheet':str(sheet),'sheet_fps':12,'sheet_columns':6})
(ROOT/'firing-audit-origin-zero.json').write_text(json.dumps(results,indent=2,allow_nan=False))
for r in results:print(json.dumps({'index':r['index'],'anchor':r['anchor'],'high_attacks':r['bands']['high'],'nearest_high_attacks':r['nearest_high_attacks']}),flush=True)
