"""Synthetic typography/clock proof, not sung-word or aesthetic verification."""
import sys,json,wave,subprocess,hashlib
from pathlib import Path
sys.path.insert(0,r'E:\ai-video-editor');sys.path.insert(0,r'E:\ai-video-editor\tests')
from test_authored_long import long_plan
from aive.encounter_render import RenderConfig,render_encounters
from aive.lyric_track import audio_sha256
from aive.lyric_workflow import prepare_lyrics,apply_prepared_lyrics,SparseTypographyPolicy

def main():
 root=Path(__file__).parent/'lyric-proofs';root.mkdir(exist_ok=True)
 summary=[]
 for name,start,freq in [('arbitrary-a',2.,440),('arbitrary-b',5.25,660)]:
  job=root/name;job.mkdir(exist_ok=True);source=job/'synthetic-source.mkv';song=job/'synthetic-music.wav'
  if not source.exists():
   subprocess.run(['ffmpeg','-v','error','-nostdin','-n','-f','lavfi','-i','testsrc2=size=320x180:rate=30:duration=50','-f','lavfi','-i',f'sine=frequency={freq}:sample_rate=48000:duration=50','-c:v','ffv1','-c:a','pcm_s16le','-shortest',str(source)],check=True,timeout=90)
  if not song.exists():
   subprocess.run(['ffmpeg','-v','error','-nostdin','-n','-f','lavfi','-i',f'sine=frequency={freq+100}:sample_rate=48000:duration=45','-ac','2','-c:a','pcm_s16le',str(song)],check=True,timeout=30)
  plan=long_plan(tuple(str(source.resolve()) for _ in range(10)),duration=35.,count=10)
  plan.update(music_start=start,music_end=start+35.,music=str(song.resolve()),confirmed=False,review_status='unreviewed')
  for row in plan['timeline']:
   row['music_start']=start+row['output_start'];row['music_end']=start+row['output_end']
   # Remove synthetic confirmed gameplay claims and retain numerical candidates.
   events=row['events'];row['events']=[]
   row['candidate_events']=[dict(id='synthetic-'+str(n),time=e['source_audio_event'],source=e['source'],confirmed=False,source_audio_event=e['source_audio_event'],source_visual_event=e['source_visual_event'],output_audio_event=e['output_audio_event'],output_visual_event=e['output_visual_event'],attack_interval=[e['source_audio_event']-.01,e['source_audio_event']+.06]) for n,e in enumerate(events)]
  config=RenderConfig(width=320,height=180,fps=30,style='authored-footage',encoder='libx264',preset='ultrafast',quality=25)
  track=dict(schema='lyric-track/v1',audio_sha256=audio_sha256(song),provenance=dict(alignment_verified=True,method='Synthetic structural words on generated tone; explicitly NOT actual singing or independent vocal verification'),words=[dict(text='LOCAL',start=start+.25,end=start+.65),dict(text='SYSTEM',start=start+3.75,end=start+4.15),dict(text='PROOF',start=start+7.25,end=start+7.65)])
  before=dict(source=audio_sha256(source),song=audio_sha256(song))
  prepared=prepare_lyrics(song,plan,config,job,track,policy=SparseTypographyPolicy(max_moments=3))
  manifest=render_encounters(plan,song,job/'renders',config=config)
  final=apply_prepared_lyrics(manifest,prepared)
  def pcm(file):
   return subprocess.run(['ffmpeg','-v','error','-nostdin','-i',str(file),'-map','0:a:0','-vn','-c:a','pcm_s16le','-f','s16le','pipe:1'],capture_output=True,check=True,timeout=90).stdout
  decode=subprocess.run(['ffmpeg','-v','error','-nostdin','-i',final['output'],'-f','null','-'],capture_output=True,timeout=90)
  row=dict(name=name,music_start=start,duration=final['video_duration'],frame_count=final['frame_count'],output=final['output'],manifest=final['manifest_path'],moments=len(prepared.audit['design']['moments']),audio_pcm_identical=pcm(manifest['output'])==pcm(final['output']),originals_unchanged=before==dict(source=audio_sha256(source),song=audio_sha256(song)),full_decode=decode.returncode,actual_singing=False,perceptual_approval=False)
  summary.append(row);print(json.dumps(row),flush=True)
 (root/'proof-summary.json').write_text(json.dumps(summary,indent=2))
if __name__=='__main__':main()
