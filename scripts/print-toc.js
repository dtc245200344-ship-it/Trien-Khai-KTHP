const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

const tocStart = xml.indexOf('MỤC LỤC');
const tocEnd = xml.indexOf('<w:bookmarkStart', tocStart);
console.log('TOC XML length:', tocEnd - tocStart);

const snippet = xml.slice(tocStart, tocEnd);
const lines = snippet.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];
lines.forEach(l => {
  const t = l.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (t) console.log(t);
});
