const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

// Find all paragraphs and list their plain text
const pRegex = /<w:p\b[\s\S]*?<\/w:p>/g;
let m;
let pIndex = 0;
const results = [];
while ((m = pRegex.exec(xml)) !== null) {
  pIndex++;
  const p = m[0];
  const tMatches = p.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g);
  if (tMatches) {
    const text = tMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
    if (text.trim().length > 0) {
      results.push({ index: pIndex, text });
    }
  }
}

console.log('Total non-empty paragraphs:', results.length);
results.forEach(r => {
  console.log(`[P${r.index}] ${r.text}`);
});
