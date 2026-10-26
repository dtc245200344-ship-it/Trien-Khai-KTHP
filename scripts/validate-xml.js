const fs = require('fs');

const xml = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/crm_docx_build/word/document.xml', 'utf8');

// Check opening and closing tags
console.log('XML length:', xml.length);
console.log('Starts with:', xml.slice(0, 50));
console.log('Ends with:', xml.slice(-50));

// Count tags
const openP = (xml.match(/<w:p\b/g) || []).length;
const closeP = (xml.match(/<\/w:p>/g) || []).length;
console.log('w:p open:', openP, 'close:', closeP);

const openR = (xml.match(/<w:r\b/g) || []).length;
const closeR = (xml.match(/<\/w:r>/g) || []).length;
console.log('w:r open:', openR, 'close:', closeR);

const openT = (xml.match(/<w:t\b/g) || []).length;
const closeT = (xml.match(/<\/w:t>/g) || []).length;
console.log('w:t open:', openT, 'close:', closeT);

const openTbl = (xml.match(/<w:tbl\b/g) || []).length;
const closeTbl = (xml.match(/<\/w:tbl>/g) || []).length;
console.log('w:tbl open:', openTbl, 'close:', closeTbl);

