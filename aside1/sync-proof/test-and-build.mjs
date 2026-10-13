// Run locally: node E:/aside/sync-proof/test-and-build.mjs
// Build: node E:/aside/sync-proof/test-and-build.mjs --build confirmed.json
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildProof} from './plan.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const sample = {source:'synthetic.mp4', music:'synthetic.mp3', source_duration:100,
  music_duration:30, music_start:5, duration:10, fps:60,
  anchors:[{source_event:10,output_event:1,output_end:3},
    {source_event:20,output_event:4,output_end:6},
    {source_event:30,output_event:7,output_end:10}]};
const r=buildProof(sample);
assert.deepEqual(r.project.segments.map(s=>[s.start,s.end]),[[9,12],[19,22],[29,33]]);
assert.deepEqual(r.timing.events.map(e=>e.music_event),[6,9,12]);
assert(r.timing.events.every(e=>e.planning_error_ms===0));
assert.equal(r.project.segments.reduce((n,s)=>n+s.end-s.start,0),10);
assert.throws(()=>buildProof({...sample,source_duration:25}),/source bounds/);
assert.throws(()=>buildProof({...sample,music_duration:10}),/Music excerpt/);
assert.throws(()=>buildProof({...sample,anchors:[...sample.anchors.slice(0,2),
  {source_event:20,output_event:7,output_end:10}]}),/overlap/);
assert.throws(()=>buildProof({...sample,anchors:[{source_event:10,output_event:0,output_end:10}]}),/context/);
assert.throws(()=>buildProof({...sample,fps:59.94}),/integer/);
assert.throws(()=>buildProof({...sample,anchors:sample.anchors.slice(0,2)}),/Last output_end/);
const gridSample={...sample,music_cut_markers:Array.from({length:39},(_,i)=>5.25+i*.25)};
const gridResult=buildProof(gridSample);
assert.equal(gridResult.timing.cut_markers[0].output_t,0);
assert.equal(gridResult.timing.cut_markers.at(-1).output_t,10);
assert(gridResult.timing.cut_markers.every((m,i,all)=>i===0||m.output_t-all[i-1].output_t<=.25+1e-6));
assert.throws(()=>buildProof({...sample,music_cut_markers:[6,7]}),/full excerpt/);
assert.throws(()=>buildProof({...gridSample,music_cut_markers:[5.25,5.25]}),/increase/);
const separate=buildProof({...sample,anchors:sample.anchors.map(a=>({...a,source_audio_event:a.source_event,source_visual_event:a.source_event+.08}))});
assert(separate.timing.events.every(e=>Math.abs(e.predicted_visual_event-e.predicted_audio_event-.08)<1e-6));
console.log('PASS: 16 deterministic timing/validation checks. No media was inspected.');
if(process.argv[2]==='--build') {
  if(!process.argv[3])throw new Error('Specify confirmed config JSON');
  const input=JSON.parse(fs.readFileSync(path.resolve(process.argv[3]),'utf8'));
  if(input.confirmed!==true)throw new Error('Set confirmed:true only after replacing synthetic anchors and durations');
  for(const key of ['source','music']) {
    if(!path.isAbsolute(input[key])||!fs.existsSync(input[key]))throw new Error(`${key} must be an existing absolute local path`);
  }
  const result=buildProof(input);
  const out=fs.mkdtempSync(path.join(here,'run-'));
  fs.writeFileSync(path.join(out,'project.json'),JSON.stringify(result.project,null,2));
  fs.writeFileSync(path.join(out,'timing.json'),JSON.stringify(result.timing,null,2));
  fs.writeFileSync(path.join(out,'input.json'),JSON.stringify(input,null,2));
  console.log(`Saved unique proof job: ${out}`);
  console.log('Next use render_existing.py with this folder’s project.json.');
} else if(process.argv.length>2) {
  throw new Error('Usage: node test-and-build.mjs [--build confirmed.json]');
}
