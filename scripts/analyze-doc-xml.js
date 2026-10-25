const fs = require('fs');
const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/document.xml', 'utf8');

// Find paragraphs around "CHƯƠNG 1"
const ch1Idx = xml.indexOf('CHƯƠNG 1:');
console.log('CHƯƠNG 1 snippet:\n', xml.slice(ch1Idx - 100, ch1Idx + 500));

// Find paragraphs around "Sơ đồ kiến trúc tổng thể" in chapter 1
const soDoIdx = xml.indexOf('Sơ đồ kiến trúc tổng thể', ch1Idx + 100);
console.log('\nSơ đồ kiến trúc snippet:\n', xml.slice(soDoIdx - 100, soDoIdx + 500));

