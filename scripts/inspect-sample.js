const fs = require('fs');
const rels = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/_rels/document.xml.rels', 'utf8');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

const relMap = {};
const relRegex = /<Relationship Id="([^"]+)"[^>]*Target="([^"]+)"/g;
let rm;
while ((rm = relRegex.exec(rels)) !== null) {
  relMap[rm[1]] = rm[2];
}

const blipRegex = /<a:blip [^>]*r:embed="([^"]+)"[\s\S]*?<\/w:drawing>/g;
let m;
while ((m = blipRegex.exec(xml)) !== null) {
  const rId = m[1];
  const target = relMap[rId];
  const start = Math.max(0, m.index - 200);
  const end = Math.min(xml.length, m.index + m[0].length + 200);
  const snippet = xml.slice(start, end).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(rId, '->', target, '|| CONTEXT:', snippet);
}

