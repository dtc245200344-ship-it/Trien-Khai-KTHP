const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

const idx = xml.indexOf('8280');
const pStart = xml.lastIndexOf('<w:p ', idx);
const pEnd = xml.indexOf('</w:p>', idx) + 6;
console.log('Paragraph with 8280:\n', xml.slice(pStart, pEnd));

