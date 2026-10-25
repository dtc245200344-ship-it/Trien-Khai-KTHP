const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

const tables = xml.match(/<w:tbl\b[\s\S]*?<\/w:tbl>/g) || [];
if (tables.length > 0) {
  fs.writeFileSync('d:/Triển Khai KTHP/scripts/table1.xml', tables[0], 'utf8');
  console.log('Saved table1.xml, length:', tables[0].length);
}

