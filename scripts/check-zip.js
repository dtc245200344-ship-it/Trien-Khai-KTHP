const fs = require('fs');
const cp = require('child_process');

try {
  const list = cp.execSync('tar -tf "d:/Triển Khai KTHP/BAO_CAO_KTHP_DE_4.docx"').toString();
  console.log('Entries in repacked docx:');
  console.log(list.split('\n').slice(0, 15).join('\n'));
} catch (e) {
  console.error('tar -tf error:', e.message);
}

