const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

let pos = 0;
const needle = 'TỔNG QUAN KIẾN TRÚC';
while ((pos = xml.indexOf(needle, pos)) !== -1) {
  console.log('Found at pos:', pos);
  console.log(xml.slice(Math.max(0, pos - 150), pos + 300));
  console.log('----------------------------------------------------');
  pos += needle.length;
}

