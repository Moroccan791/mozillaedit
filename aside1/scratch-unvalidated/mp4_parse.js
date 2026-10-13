async function parseMp4(path) {
  const buf = await fs.readFile(path);
  console.log('file size bytes:', buf.length);
  function readU32(offset) { return buf.readUInt32BE(offset); }
  function readU16(offset) { return buf.readUInt16BE(offset); }
  function readString(offset, len) { return buf.toString('utf8', offset, offset+len); }

  // ftyp
  const ftypSize = readU32(0); const ftypType = readString(4,4);
  const major = readString(8,4);
  console.log('ftyp:', {size:ftypSize,type:ftypType,major:major});

  // find mvhd
  let offset = 8; const boxes = [];
  while (offset < buf.length - 8) {
    const size = readU32(offset); const type = readString(offset+4,4);
    if (size <= 0 || offset + size > buf.length) break;
    boxes.push({type, offset, size});
    if (type === 'mvhd') {
      console.log('\n--- mvhd ---');
      console.log('size:', size, 'at offset', offset);
      const version = buf.readUInt8(offset+8);
      const created = readU32(offset+12); const modified = readU32(offset+16);
      const timescale = readU32(offset+20+version*4);
      const duration = readU32(offset+24+version*4);
      console.log('version:', version, 'timescale:', timescale, 'duration:', duration, 'durationSec:', (duration/timescale).toFixed(2));
    }
    if (type === 'moov') {
      console.log('\n--- moov ---');
      const moovStart = offset;
      let moovOff = offset + size;
      // parse traks
      let tk = moovStart;
      while (tk < moovStart + size - 8) {
        const tsize = readU32(tk); const ttype = readString(tk+4,4);
        if (ttype !== 'trak') { tk += tsize; continue; }
        console.log('\n--- trak at', tk, 'size', tsize, '---');
        // scan child boxes for mdhd
        let p = tk + 8;
        let foundMdhd = false;
        while (p < tk + tsize - 8 && !foundMdhd) {
          const csize = readU32(p); const ctype = readString(p+4,4);
          if (csize <= 0 || p + csize > tk + tsize) { p += 1; continue; }
          if (ctype === 'mdhd') {
            const cver = buf.readUInt8(p+8);
            const cts = readU32(p+12+cver*4);
            const cdur = readU32(p+16+cver*4);
            console.log('mdhd timescale:', cts, 'duration:', cdur, 'durSec:', (cdur/cts).toFixed(2));
            foundMdhd = true;
          }
          p += csize;
        }
        tk += tsize;
      }
      break;
    }
    offset += size;
  }
  return boxes;
}

const path = 'E:/reference/YTDown.com_YouTube_Media_Vp5ClXhplkU_Espresso-Valorant-Montage_002_720p.mp4';
await parseMp4(path);
