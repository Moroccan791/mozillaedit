const targetPath = 'E:/reference/YTDown.com_YouTube_Media_Vp5ClXhplkU_Espresso-Valorant-Montage_002_720p.mp4';

async function analyzeVideo(path) {
  const blob = await fs.readFile(path);
  const r32 = (o) => blob.readUInt32BE(o);
  const r16 = (o) => blob.readUInt16BE(o);
  const rs = (o, n) => blob.toString('latin1', o, o+n);

  function findBox(start, end, type) {
    let p = start;
    while (p < end - 8) {
      const ss = r32(p);
      if (ss <= 0 || p + ss > end) break;
      if (rs(p+4,4) === type) return p;
      p += ss;
    }
    return null;
  }

  let off = 0;
  while (off < blob.length - 8) {
    const sz = r32(off);
    if (sz <= 0 || off + sz > blob.length) break;
    if (rs(off+4,4) === 'moov') {
      const moovEnd = off + sz;
      const mvhdOff = off + 8;
      const mvhdTs = r32(mvhdOff + 20);
      const mvhdDur = r32(mvhdOff + 24);
      const movieDur = mvhdDur / mvhdTs;
      let out = '\n### ' + path + '\nMOVIE duration: ' + movieDur.toFixed(3) + ' s\n';

      let o = off + 8, trakIdx = 0;
      while (o < moovEnd - 8) {
        const csize = r32(o);
        if (csize <= 0 || o + csize > moovEnd) break;
        const ctype = rs(o+4,4);
        if (ctype === 'trak') {
          const trakEnd = o + csize;
          out += 'trak [' + trakIdx + ']\n';
          const mdia = findBox(o + 8, trakEnd, 'mdia');
          const minf = mdia ? findBox(mdia + 8, mdia + r32(mdia), 'minf') : null;
          const stbl = minf ? findBox(minf + 8, minf + r32(minf), 'stbl') : null;
          const mdhd = mdia ? findBox(mdia + 8, mdia + r32(mdia), 'mdhd') : null;
          const stsd = stbl ? findBox(stbl + 8, stbl + r32(stbl), 'stsd') : null;
          const stts = stbl ? findBox(stbl + 8, stbl + r32(stbl), 'stts') : null;
          if (mdhd) { out += '  mdhd duration: ' + (r32(mdhd+24)/r32(mdhd+20)).toFixed(3) + ' s\n'; }
          if (stsd) {
            const sdEnd = stsd + r32(stsd);
            const ec = r32(stsd+12);
            let e = stsd + 16;
            for (let i = 0; i < ec; i++) {
              const es = r32(e), et = rs(e+4,4);
              if (et === 'avc1') { out += '  resolution: ' + r16(e+32) + 'x' + r16(e+34) + '\n'; }
              e += es || (sdEnd - e);
            }
          }
          if (stts) {
            const ec2 = r32(stts+12);
            let t2 = stts + 16, total = 0, tm = 0;
            let first = [], last = [];
            for (let i = 0; i < ec2; i++) {
              const count = r32(t2), delta = r32(t2+4);
              for (let j = 0; j < count; j++) {
                tm += delta * 1000 / mvhdTs;
                total++;
                if (total <= 5) first.push(Math.round(tm));
                if (total > 100 - 5) last.push(Math.round(tm));
              }
              t2 += 8;
            }
            const fps = (total / movieDur).toFixed(1);
            out += '  frames: ' + total + ' | approx fps: ' + fps + '\n';
            out += '  first5ms: ' + first.join(', ') + ' | last5ms: ' + last.join(', ') + '\n';
          }
          trakIdx++;
        }
        o += csize;
      }
      return out;
    }
    off += sz;
  }
  return 'no moov found\n';
}

(async () => {
  const videos = [
    'E:/reference/YTDown.com_YouTube_Media_Vp5ClXhplkU_Espresso-Valorant-Montage_002_720p.mp4',
    'E:/reference/YTDown.com_YouTube_Media_nkAEXZE76II_Timeless-Valorant-Montage_002_720p.mp4',
    'E:/reference/YTDown.com_YouTube_Media_FLS6WFuVfJQ_APT-Valorant-Montage_002_720p.mp4',
  ];

  let results = '';
  for (let i = 0; i < videos.length; i++) {
    try {
      results += await analyzeVideo(videos[i]);
      console.log('analyzed video', i+1, 'of', videos.length);
    } catch (e) {
      results += 'ERROR: ' + e.message + '\n';
    }
  }
  await fs.writeFile('C:/Users/Junayed/.aside/u/0/meta_results.txt', results);
  console.log('wrote meta_results.txt');
  console.log(results);
})();
