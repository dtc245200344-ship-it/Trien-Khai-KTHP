const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

const paragraphs = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];
console.log('Total w:p count:', paragraphs.length);

for (let i = 0; i < Math.min(15, paragraphs.length); i++) {
  console.log(`\n--- PARAGRAPH ${i+1} ---`);
  console.log(paragraphs[i]);
}

