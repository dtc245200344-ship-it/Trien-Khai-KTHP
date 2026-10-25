const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx/word/media';
const files = fs.readdirSync(dir);
files.forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(f, 'size:', stat.size);
});

