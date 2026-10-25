const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

const regex = /<w:p\b[\s\S]*?<\/w:p>/g;
let m;
let count = 0;
while ((m = regex.exec(xml)) !== null) {
  const p = m[0];
  if (p.includes('<w:drawing>') || p.includes('Hình ')) {
    const text = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const blip = p.match(/r:embed="([^"]+)"/);
    console.log(`[P] ${blip ? blip[1] : 'NO_BLIP'}: ${text}`);
    count++;
  }
}
console.log('Total image / figure paragraphs:', count);

