const fs = require('fs');

const src = 'C:/Users/MSI/AppData/Local/Temp/proper_docx_test.docx';
const dst1 = 'D:/Triển Khai KTHP/BAO_CAO_KTHP_DE_4.docx';
const dst2 = 'D:/Triển Khai KTHP/BAO_CAO_KTHP_DE_4_CapNhat.docx';

let ok1 = false;
let ok2 = false;

try {
  fs.copyFileSync(src, dst1);
  console.log('[OK] Successfully updated BAO_CAO_KTHP_DE_4.docx');
  ok1 = true;
} catch (e) {
  console.log('[LOCKED] Could not write to BAO_CAO_KTHP_DE_4.docx:', e.message);
}

try {
  fs.copyFileSync(src, dst2);
  console.log('[OK] Successfully updated BAO_CAO_KTHP_DE_4_CapNhat.docx');
  ok2 = true;
} catch (e) {
  console.log('[LOCKED] Could not write to BAO_CAO_KTHP_DE_4_CapNhat.docx:', e.message);
}

