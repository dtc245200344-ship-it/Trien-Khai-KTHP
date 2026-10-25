const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/crm_docx_build/word/document.xml', 'utf8');

const keywords = ['8280', '8281', '8290', '8300', 'ticket', 'booking', 'vé', 'suất chiếu', 'ghế', 'rạp', 'phim', 'MySQL', 'phpMyAdmin'];

keywords.forEach(kw => {
  let count = 0;
  let pos = 0;
  while ((pos = xml.indexOf(kw, pos)) !== -1) {
    count++;
    pos += kw.length;
  }
  console.log(`Keyword "${kw}": ${count} occurrences`);
});

