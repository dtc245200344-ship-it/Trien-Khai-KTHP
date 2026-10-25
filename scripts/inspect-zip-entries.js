const fs = require('fs');

function readZipEntries(filePath) {
  const buf = fs.readFileSync(filePath);
  // Find End of Central Directory Record (signature 0x06054b50)
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) return { error: 'EOCD not found' };

  const cdOffset = buf.readUInt32LE(eocd + 16);
  const cdSize = buf.readUInt32LE(eocd + 12);
  const totalEntries = buf.readUInt16LE(eocd + 10);

  const entries = [];
  let p = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const flags = buf.readUInt16LE(p + 8);
    const method = buf.readUInt16LE(p + 10);
    const fnLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const name = buf.toString('utf8', p + 46, p + 46 + fnLen);
    entries.push({ name, method, flags });
    p += 46 + fnLen + extraLen + commentLen;
  }
  return { totalEntries, entries };
}

console.log('--- ORIGINAL SAMPLE DOCX ---');
const orig = readZipEntries('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/.user_uploaded/media_1792910904237_b3e6219f.docx');
console.log('Total entries:', orig.totalEntries);
console.log('First 10 entries:', orig.entries.slice(0, 10).map(e => e.name));

console.log('\n--- REPACKED BAO_CAO_KTHP_DE_4.docx ---');
const repacked = readZipEntries('D:/Triển Khai KTHP/BAO_CAO_KTHP_DE_4.docx');
console.log('Total entries:', repacked.totalEntries);
console.log('First 10 entries:', repacked.entries.slice(0, 10).map(e => e.name));
