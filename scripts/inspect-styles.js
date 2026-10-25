const fs = require('fs');
const styles = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/styles.xml', 'utf8');

const regex = /<w:style\s+[^>]*w:styleId="([^"]+)"[\s\S]*?<w:name\s+w:val="([^"]+)"/g;
let m;
while ((m = regex.exec(styles)) !== null) {
  console.log(m[1], '->', m[2]);
}

// Check default font
const fontMatch = styles.match(/<w:rFonts\s+[^>]*w:ascii="([^"]+)"/);
if (fontMatch) console.log('Default ASCII font:', fontMatch[1]);

