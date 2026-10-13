import sys,json,hashlib
from pathlib import Path
import numpy as np
sys.path.insert(0,r'E:\ai-video-editor')
from aive import beats,music
# Existing cache can be read; suppress all cache writes outside the new job.
beats.save=lambda *a: None
music.save=lambda *a: None
AUDIO=Path(r'E:\audio\YTDown.com_YouTube_Media_MpoZ0NVXswY_Let-the-world-burn-Audio-Edit_009_128k.mp3')
JOB=Path(r'E:\aside\burn-preview-20261012-151632')
b=beats.detect_cached(AUDIO)
m=music.analyze_cached(AUDIO)
start=16.254; duration=35.; end=start+duration
all_candidates=[]
for t,s in zip(b.onsets,b.onset_strengths):
    beat=min(b.beats,key=lambda x:abs(x-t))
    all_candidates.append(dict(absolute_time=t,excerpt_time=round(t-start,4),onset_strength=s,nearest_beat_absolute=beat,beat_distance=round(abs(t-beat),4)))
cs=[c for c in all_candidates if .4<=c['excerpt_time']<=34.5 and c['beat_distance']<=.08]
# Exactly 12 strong, beat-close attacks with full-window coverage. Max 4.5 s gap avoids clustering in one loud region.
N=12; dp={}; prev={}
for j,c in enumerate(cs):
    score=c['onset_strength']*(1-.25*c['beat_distance']/.08)
    if c['excerpt_time']<=2.5: dp[1,j]=score
    for n in range(2,N+1):
        opts=[(dp[n-1,i]+score,i) for i in range(j) if (n-1,i) in dp and 1.8-1e-8<=c['excerpt_time']-cs[i]['excerpt_time']<=4.5]
        if opts:
            v,i=max(opts);dp[n,j]=v;prev[n,j]=i
ends=[(v,j) for (n,j),v in dp.items() if n==N and cs[j]['excerpt_time']>=32.]
_,j=max(ends); selected=[]
for n in range(N,0,-1):
    selected.append(cs[j]);j=prev.get((n,j),-1)
selected=selected[::-1]
energy=np.asarray(m.energy);hz=m.energy_hz
mean=lambda a,z: float(np.mean(energy[int(a*hz):int(z*hz)]))
words=json.loads(Path(r'E:\ai-video-editor\words.json').read_text())
words=[w for w in words if w['end']>start and w['start']<end]
output=dict(audio_path=str(AUDIO),audio_sha256=hashlib.sha256(AUDIO.read_bytes()).hexdigest(),audio_size=AUDIO.stat().st_size,analysis_methods=['aive.beats.detect_cached','aive.music.analyze_cached'],beats_version=beats.BEAT_ANALYSIS_VERSION,music_version=music.MUSIC_ANALYSIS_VERSION,full_track_beats=b.to_dict(),full_track_music=m.to_dict(),recommendation=dict(start=start,end=end,duration=duration,rationale='Tracked beat start with 8.475 seconds of low-energy lead-in before the detected drop, then 26.525 seconds of sustained high energy, including the second peak section beginning 46.370. The lead-in is a lower-energy plateau, not an algorithmically detected rising build.',drop_absolute=24.729,drop_excerpt=round(24.729-start,4),lead_in_energy_mean=round(mean(start,24.729),4),post_drop_energy_mean=round(mean(24.729,end),4),pure_highest_energy_35s_start=m.best_window(duration),selected_accents=selected,minimum_accent_gap=min(round(y['excerpt_time']-x['excerpt_time'],4) for x,y in zip(selected,selected[1:])),all_excerpt_onset_candidates=[c for c in all_candidates if start<=c['absolute_time']<=end],all_excerpt_beats=[dict(absolute_time=t,excerpt_time=round(t-start,4)) for t in b.beats if start<=t<=end]),matching_existing_words=dict(path=r'E:\ai-video-editor\words.json',source_match_evidence='transcribe_align.py has the exact AUDIO path as MP3 and writes this words.json',words=words),caveats=['Numerical-only recommendation, no listening verification.','Onsets use librosa onset detection frames (hop 128 / 22050 = 5.805 ms). An attack envelope maximum or perceived attack may be a few frames later than the reported detection.','Beat times are variable librosa-tracked events, not synthesized repeated early-region beats. BPM is an approximate global summary.','Downbeats are every fourth tracked beat, not a validated meter/downbeat classifier.','Music section labels are relative percentile heuristics: the 32.345-46.370 mid section has 0.895 mean energy, almost identical to labeled peaks.','No rising build was labeled. The excerpt supplies low-to-high contrast instead.','Existing word alignment is unverified and may contain zero-duration or weakly aligned words; it was not used to place impacts.'],selection_constraints=dict(count=12,min_separation=1.8,local_bounds=[.4,34.5],max_internal_gap=4.5,max_beat_distance=.08,score='onset_strength * (1 - 0.25 * beat_distance/0.08)'))
(JOB/'music-analysis.json').write_text(json.dumps(output,indent=2),encoding='utf-8')
print(json.dumps({'recommendation':{k:v for k,v in output['recommendation'].items() if not k.startswith('all_')},'existing_words_excerpt':words},indent=2))
