const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

const idx = xml.indexOf('github');
console.log('GitHub snippet in sample_docx:\n', xml.slice(idx - 50, idx + 150));

const cdIdx = xml.indexOf('/mnt/d');
console.log('cd snippet in sample_docx:\n', xml.slice(cdIdx - 50, cdIdx + 150));

