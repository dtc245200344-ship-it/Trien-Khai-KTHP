const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

// Look for tables <w:tbl>
const tables = xml.match(/<w:tbl\b[\s\S]*?<\/w:tbl>/g) || [];
console.log('Total w:tbl count:', tables.length);

for (let i = 0; i < tables.length; i++) {
  console.log(`\n=== TABLE ${i+1} ===`);
  const tText = tables[i].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(tText.slice(0, 300));
}
