async function analyzeMp4(path) {
  const buf = await fs.readFile(path);
  const u32 = (o) => buf.readUInt32BE(o);
  const u16 = (o) => buf.readUInt16BE(o);
  const str = (o, n) => buf.toString('latin1', o, o+n);

  let off = 0;
  while (off < buf.length - 8) {
    const size = u32(off);
    if (size <= 0 || off + size > buf.length) break;
    if (str(off+4,4) === 'moov') {
      const moovEnd = off + size;
      const mvhdOff = off + 8;
      const mvhdSize = u32(mvhdOff);
      const mvhdTs = u32(mvhdOff + 20);
      const mvhdDur = u32(mvhdOff + 24);
      console.log('MOVIE duration: ' + (mvhdDur/mvhdTs).toFixed(3) + ' s');

      let o = moovEnd - u32(moovEnd-8); // no, wrong
      o = off + 8;
      let trakIdx = 0;
      while (o < moovEnd - 8) {
        const csize = u32(o);
        if (csize <= 0 || o + csize > moovEnd) break;
        const ctype = str(o+4,4);
        if (ctype === 'trak') {
          const trakEnd = o + csize;
          console.log('\n--- trak [' + trakIdx + '] ---');
          let p = o + 8;
          let mdhd = null, stsd = null, stts = null;
          while (p < trakEnd - 8) {
            const s = u32(p);
            if (s <= 0 || p + s > trakEnd) break;
            const t = str(p+4,4);
            if (t === 'mdhd') mdhd = p;
            if (t === 'stsd') stsd = p;
            if (t === 'stts') stts = p;
            p += s;
          }
          if (mdhd) {
            const ts = u32(mdhd+20), dur = u32(mdhd+24);
            console.log('  mdhd duration: ' + (dur/ts).toFixed(3) + ' s');
          }
          if (stsd) {
            const stsdEnd = stsd + u32(stsd);
            const entryCount = u32(stsd+12);
            let e = stsd + 16;
            for (let i = 0; i < entryCount; i++) {
              const esize = u32(e), etype = str(e+4,4);
              if (etype === 'avc1') {
                console.log('  resolution: ' + u16(e+32) + 'x' + u16(e+34));
                console.log('  fps from avcC: check below if avcC present');
              }
              e += esize || (stsdEnd - e);
            }
          }
          if (stts) {
            const sttsEnd = stts + u32(stts);
            const entryCount = u32(stts+12);
            let t = stts + 16;
            let totalFrames = 0, timeMs = 0;
            let firstFrames = [], lastFrames = [];
            for (let i = 0; i < entryCount; i++) {
              const count = u32(t), delta = u32(t+4);
              for (let j = 0; j < count; j++) {
                timeMs += delta * 1000 / mvhdTs;
                totalFrames++;
                if (totalFrames <= 5) firstFrames.push(Math.round(timeMs));
                if (totalFrames > 100 - 5) lastFrames.push(Math.round(timeMs));
              }
              t += 8;
            }
            console.log('  frames: ' + totalFrames + ' | first 5 (ms): ' + firstFrames.join(', ') + ' | last 5 (ms): ' + lastFrames.join(', '));
          }
          trakIdx++;
        }
        o += csize;
      }
      return;
    }
    off += size;
  }
}

// analyze all reference videos
const refs = [
  'E:/reference/YTDown.com_YouTube_Media_Vp5ClXhplkU_Espresso-Valorant-Montage_002_720p.mp4',
  'E:/reference/YTDown.com_YouTube_Media_nkAEXZE76II_Timeless-️-Valorant-Montage_002_720p.mp4',
  'E:/reference/YTDown.com_YouTube_Media_FLS6WFuVfJQ_APT-Valorant-Montage_002_720p.mp4',
];
for (const r of refs) {
  try { console.log('\n### ' + r); await analyzeMp4(r); } catch(e) { console.log('ERROR:', e.message); }
}