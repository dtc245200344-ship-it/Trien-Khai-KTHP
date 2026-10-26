const fs = require('fs');

function readZipEntries(filePath) {
  const buf = fs.readFileSync(filePath);
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) return { error: 'EOCD not found' };

  const cdOffset = buf.readUInt32LE(eocd + 16);
  const totalEntries = buf.readUInt16LE(eocd + 10);

  const entries = [];
  let p = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const fnLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const name = buf.toString('utf8', p + 46, p + 46 + fnLen);
    entries.push(name);
    p += 46 + fnLen + extraLen + commentLen;
  }
  return { totalEntries, entries };
}

const res = readZipEntries('C:/Users/MSI/AppData/Local/Temp/real_docx_test.docx');
console.log('Magic bytes:', fs.readFileSync('C:/Users/MSI/AppData/Local/Temp/real_docx_test.docx').slice(0, 4).toString('hex'));
console.log('Total entries:', res.totalEntries);
console.log('Entries:');
res.entries.forEach(e => console.log(' -', e));

