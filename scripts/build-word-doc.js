const fs = require('fs');
const path = require('path');
const os = require('os');

const tempDir = path.join(os.tmpdir(), 'crm_docx_build_' + Date.now());

// Tạo cây thư mục
fs.mkdirSync(path.join(tempDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'word', '_rels'), { recursive: true });

// 1. [Content_Types].xml
const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;
fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypesXml, 'utf8');

// 2. _rels/.rels
const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(tempDir, '_rels', '.rels'), rootRelsXml, 'utf8');

// 3. word/_rels/document.xml.rels
const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(tempDir, 'word', '_rels', 'document.xml.rels'), docRelsXml, 'utf8');

// 4. word/settings.xml
const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:characterSpacingControl w:val="doNotCompress"/>
</w:settings>`;
fs.writeFileSync(path.join(tempDir, 'word', 'settings.xml'), settingsXml, 'utf8');

// 5. word/header1.xml
const headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr>
      <w:pBdr><w:bottom w:val="single" w:sz="4" w:space="4" w:color="D9D9D9"/></w:pBdr>
      <w:jc w:val="right"/>
    </w:pPr>
    <w:r>
      <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:sz w:val="18"/><w:color w:val="7F7F7F"/></w:rPr>
      <w:t>Báo Cáo KTHP: Hệ Thống CRM Chăm Sóc Khách Hàng - Đề Tài 4</w:t>
    </w:r>
  </w:p>
</w:hdr>`;
fs.writeFileSync(path.join(tempDir, 'word', 'header1.xml'), headerXml, 'utf8');

// 6. word/footer1.xml
const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr>
      <w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="D9D9D9"/></w:pBdr>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:r>
      <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/><w:color w:val="7F7F7F"/></w:rPr>
      <w:t>Trang </w:t>
    </w:r>
    <w:fldSimple w:instr="PAGE">
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r>
    </w:fldSimple>
    <w:r>
      <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/><w:color w:val="7F7F7F"/></w:rPr>
      <w:t> / </w:t>
    </w:r>
    <w:fldSimple w:instr="NUMPAGES">
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r>
    </w:fldSimple>
  </w:p>
</w:ftr>`;
fs.writeFileSync(path.join(tempDir, 'word', 'footer1.xml'), footerXml, 'utf8');

// 7. word/styles.xml
const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="26"/>
        <w:szCs w:val="26"/>
        <w:lang w:val="vi-VN"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="360" w:lineRule="auto" w:after="120"/>
        <w:jc w:val="both"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`;
fs.writeFileSync(path.join(tempDir, 'word', 'styles.xml'), stylesXml, 'utf8');

// Helper sinh XML elements
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function p(text, options = {}) {
  const {
    bold = false,
    italic = false,
    size = 26, // 13pt
    color = '000000',
    align = 'both',
    before = 0,
    after = 120,
    line = 360,
    font = 'Times New Roman'
  } = options;

  return `
    <w:p>
      <w:pPr>
        <w:jc w:val="${align}"/>
        <w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${font}" w:hAnsi="${font}"/>
          ${bold ? '<w:b/>' : ''}
          ${italic ? '<w:i/>' : ''}
          <w:sz w:val="${size}"/>
          <w:szCs w:val="${size}"/>
          <w:color w:val="${color}"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function h1(text) {
  return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="360" w:after="160"/>
        <w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="1F4E79"/></w:pBdr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="32"/>
          <w:szCs w:val="32"/>
          <w:color w:val="1F4E79"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function h2(text) {
  return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="240" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="28"/>
          <w:szCs w:val="28"/>
          <w:color w:val="2E75B6"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function h3(text) {
  return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="160" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="26"/>
          <w:szCs w:val="26"/>
          <w:color w:val="000000"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function bullet(text, boldPrefix = '') {
  return `
    <w:p>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:before="40" w:after="60" w:line="340" w:lineRule="auto"/>
        <w:ind w:left="400" w:hanging="240"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/></w:rPr>
        <w:t>• </w:t>
      </w:r>
      ${boldPrefix ? `
        <w:r>
          <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="26"/></w:rPr>
          <w:t xml:space="preserve">${escapeXml(boldPrefix)} </w:t>
        </w:r>
      ` : ''}
      <w:r>
        <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/></w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function codeBlock(codeText) {
  const lines = codeText.split('\n');
  return `
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/>
          <w:left w:val="single" w:sz="24" w:space="0" w:color="1F4E79"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/>
          <w:insideH w:val="none"/>
          <w:insideV w:val="none"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/>
          <w:left w:w="180" w:type="dxa"/><w:right w:w="180" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      <w:tr>
        <w:tc>
          <w:tcPr>
            <w:shd w:val="clear" w:color="auto" w:fill="F4F6F9"/>
          </w:tcPr>
          ${lines.map(line => `
            <w:p>
              <w:pPr>
                <w:spacing w:before="20" w:after="20" w:line="240" w:lineRule="auto"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>
                  <w:sz w:val="20"/>
                  <w:color w:val="1E293B"/>
                </w:rPr>
                <w:t xml:space="preserve">${escapeXml(line)}</w:t>
              </w:r>
            </w:p>
          `).join('')}
        </w:tc>
      </w:tr>
    </w:tbl>
    <w:p><w:pPr><w:spacing w:after="100"/></w:pPr></w:p>
  `;
}

function table(headers, rows) {
  return `
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="1F4E79"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="1F4E79"/>
          <w:left w:val="none"/>
          <w:right w:val="none"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D9D9D9"/>
          <w:insideV w:val="none"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/>
          <w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      <!-- Header row -->
      <w:tr>
        <w:trPr><w:tblHeader/></w:trPr>
        ${headers.map(h => `
          <w:tc>
            <w:tcPr>
              <w:shd w:val="clear" w:color="auto" w:fill="1F4E79"/>
            </w:tcPr>
            <w:p>
              <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:before="60" w:after="60"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                  <w:b/>
                  <w:sz w:val="24"/>
                  <w:color w:val="FFFFFF"/>
                </w:rPr>
                <w:t xml:space="preserve">${escapeXml(h)}</w:t>
              </w:r>
            </w:p>
          </w:tc>
        `).join('')}
      </w:tr>
      <!-- Data rows -->
      ${rows.map((row, idx) => `
        <w:tr>
          ${row.map(cell => `
            <w:tc>
              <w:tcPr>
                ${idx % 2 === 1 ? '<w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/>' : ''}
              </w:tcPr>
              <w:p>
                <w:pPr>
                  <w:spacing w:before="40" w:after="40" w:line="280" w:lineRule="auto"/>
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                    <w:sz w:val="24"/>
                  </w:rPr>
                  <w:t xml:space="preserve">${escapeXml(cell)}</w:t>
                </w:r>
              </w:p>
            </w:tc>
          `).join('')}
        </w:tr>
      `).join('')}
    </w:tbl>
    <w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>
  `;
}

function pageBreak() {
  return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
}

// Bắt đầu xây dựng toàn bộ nội dung tài liệu
let docBody = [];

// ====================================================================
// TRANG BÌA (COVER PAGE)
// ====================================================================
docBody.push(p('BỘ GIÁO DỤC VÀ ĐÀO TẠO', { align: 'center', bold: true, size: 28, color: '1F4E79' }));
docBody.push(p('TRƯỜNG ĐẠI HỌC CÔNG NGHỆ / HỌC VIỆN', { align: 'center', bold: true, size: 28, color: '1F4E79' }));
docBody.push(p('KHOA CÔNG NGHỆ THÔNG TIN', { align: 'center', bold: true, size: 26, color: '595959', after: 400 }));

// Khung đường kẻ trang trí bìa
docBody.push(`
  <w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="300" w:after="300"/>
      <w:pBdr><w:bottom w:val="single" w:sz="18" w:space="1" w:color="1F4E79"/></w:pBdr>
    </w:pPr>
  </w:p>
`);

docBody.push(p('BÁO CÁO KẾT THÚC HỌC PHẦN', { align: 'center', bold: true, size: 36, color: '1F4E79', before: 300, after: 120 }));
docBody.push(p('HỌC PHẦN: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM', { align: 'center', bold: true, size: 28, color: '2E75B6', after: 600 }));

docBody.push(p('ĐỀ TÀI SỐ 4:', { align: 'center', bold: true, size: 28, color: '000000', before: 200 }));
docBody.push(p('HỆ THỐNG CRM CHĂM SÓC KHÁCH HÀNG', { align: 'center', bold: true, size: 40, color: '1F4E79', after: 200 }));
docBody.push(p('(Ứng dụng CRM, PostgreSQL, pgAdmin, Nginx Reverse Proxy, Prometheus, Grafana, Loki & Security Hardening)', { align: 'center', italic: true, size: 24, color: '595959', after: 800 }));

// Bảng thông tin sinh viên & giảng viên
docBody.push(`
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="4200" w:type="pct"/>
      <w:jc w:val="center"/>
      <w:tblBorders>
        <w:top w:val="none"/><w:bottom w:val="none"/><w:left w:val="none"/><w:right w:val="none"/>
        <w:insideH w:val="none"/><w:insideV w:val="none"/>
      </w:tblBorders>
    </w:tblPr>
    <w:tr>
      <w:tc>
        <w:p><w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>Giảng viên hướng dẫn:</w:t></w:r></w:p>
      </w:tc>
      <w:tc>
        <w:p><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:t>ThS. / TS. Giảng viên Bộ môn</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    <w:tr>
      <w:tc>
        <w:p><w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>Sinh viên thực hiện:</w:t></w:r></w:p>
      </w:tc>
      <w:tc>
        <w:p><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:t>....................................................</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    <w:tr>
      <w:tc>
        <w:p><w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>Mã số sinh viên (MSSV):</w:t></w:r></w:p>
      </w:tc>
      <w:tc>
        <w:p><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:t>....................................................</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
    <w:tr>
      <w:tc>
        <w:p><w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>Lớp học phần:</w:t></w:r></w:p>
      </w:tc>
      <w:tc>
        <w:p><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:t>Triển khai &amp; QTHPM - Nhóm 04</w:t></w:r></w:p>
      </w:tc>
    </w:tr>
  </w:tbl>
`);

docBody.push(p('Hà Nội, Năm 2026', { align: 'center', italic: true, size: 26, color: '595959', before: 900 }));
docBody.push(pageBreak());

// ====================================================================
// TRANG NHẬN XÉT CỦA GIẢNG VIÊN
// ====================================================================
docBody.push(h1('NHẬN XÉT CỦA GIẢNG VIÊN ĐÁNH GIÁ'));
docBody.push(p('Điểm đánh giá và các ý kiến nhận xét quá trình bảo vệ đồ án kết thúc học phần:'));

docBody.push(`
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="5000" w:type="pct"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:color="1F4E79"/>
        <w:bottom w:val="single" w:sz="6" w:color="1F4E79"/>
        <w:left w:val="single" w:sz="6" w:color="1F4E79"/>
        <w:right w:val="single" w:sz="6" w:color="1F4E79"/>
        <w:insideH w:val="single" w:sz="4" w:color="D9D9D9"/>
        <w:insideV w:val="single" w:sz="4" w:color="D9D9D9"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="140" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/>
        <w:left w:w="160" w:type="dxa"/><w:right w:w="160" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
    <w:tr>
      <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F4F6F9"/><w:tcW w:w="1500" w:type="pct"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Tiêu chí đánh giá</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F4F6F9"/><w:tcW w:w="2500" w:type="pct"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Nhận xét chi tiết của giảng viên</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F4F6F9"/><w:tcW w:w="1000" w:type="pct"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Điểm số (Thang 10)</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:p><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>1. Tính năng CRM &amp; CSDL</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Mức độ hoàn thiện CRUD Khách hàng, Liên hệ, Tương tác và PostgreSQL + pgAdmin</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>......... / 2.5 đ</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:p><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>2. Nginx Reverse Proxy</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Định tuyến Gateway, Rate Limiting, Security Headers, JSON log</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>......... / 2.0 đ</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:p><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>3. Giám sát Prometheus &amp; Grafana</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Cấu hình scrape /metrics, Dashboards trực quan hóa Latency, Status, Uptime</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>......... / 2.0 đ</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:p><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>4. Ghi nhật ký Loki &amp; LogQL</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Thu thập log qua Promtail, truy vấn lọc log thời gian thực với cú pháp LogQL</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>......... / 2.0 đ</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:p><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>5. Hardening &amp; GitHub CI/CD</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Non-root user, phân tách network, giới hạn quota tài nguyên, Trivy scan</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>......... / 1.5 đ</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1F4E79"/></w:rPr><w:t>TỔNG ĐIỂM CHUNG</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:rPr><w:i/><w:sz w:val="24"/></w:rPr><w:t>(Điểm bằng chữ: ............................................................................)</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="B22222"/></w:rPr><w:t>......... / 10 đ</w:t></w:r></w:p></w:tc>
    </w:tr>
  </w:tbl>
`);

docBody.push(`
  <w:p>
    <w:pPr><w:spacing w:before="400"/><w:jc w:val="right"/></w:pPr>
    <w:r><w:rPr><w:i/><w:sz w:val="24"/></w:rPr><w:t>Hà Nội, ngày ...... tháng ...... năm 2026</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="right"/><w:spacing w:after="800"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Chữ ký của Giảng viên chấm thi</w:t></w:r>
  </w:p>
`);
docBody.push(pageBreak());

// ====================================================================
// MỤC LỤC & LỜI MỞ ĐẦU
// ====================================================================
docBody.push(h1('MỤC LỤC TỔNG THỂ'));
docBody.push(p('Chương 1: Tổng Quan Đề Tài Và Yêu Cầu Bài Toán CRM ........................................ Trang 4'));
docBody.push(p('Chương 2: Thiết Kế Kiến Trúc Hệ Thống & Cơ Sở Dữ Liệu PostgreSQL ...................... Trang 6'));
docBody.push(p('Chương 3: Cổng Điều Phối & Cân Bằng Tải Nginx Reverse Proxy .............................. Trang 8'));
docBody.push(p('Chương 4: Hệ Thống Giám Sát & Ghi Nhật Ký Tập Trung (Prometheus, Grafana, Loki) ... Trang 10'));
docBody.push(p('Chương 5: Triển Khai Bảo Mật & Tối Ưu Hóa Hệ Thống (System & Container Hardening) .. Trang 13'));
docBody.push(p('Chương 6: Kết Quả Thử Nghiệm, Kịch Bản Demo & Đánh Giá Hệ Thống .................. Trang 16'));
docBody.push(p('Kết Luận Và Hướng Phát Triển ............................................................................ Trang 19'));
docBody.push(p('Tài Liệu Tham Khảo ............................................................................................ Trang 20'));

docBody.push(h1('LỜI MỞ ĐẦU'));
docBody.push(p('Trong bối cảnh nền kinh tế số và cạnh tranh thương mại ngày càng gay gắt, việc quản lý quan hệ khách hàng (Customer Relationship Management - CRM) đóng vai trò quyết định tới sự sống còn và năng lực tăng trưởng của mọi doanh nghiệp. Ứng dụng CRM không chỉ hỗ trợ số hóa danh bạ khách hàng, theo dõi chi tiết lịch sử tư vấn, họp mặt hay giải quyết phản hồi, mà còn cung cấp bức tranh dữ liệu toàn diện giúp ban lãnh đạo ra quyết định kinh doanh chính xác.'));
docBody.push(p('Song hành với yêu cầu nghiệp vụ, bài toán vận hành hạ tầng phần mềm trong môi trường sản xuất (Production) đòi hỏi sinh viên chuyên ngành Công nghệ thông tin phải làm chủ các công nghệ điều phối vi dịch vụ hiện đại. Học phần "Triển khai và Quản trị Hệ thống Phần mềm" với Đề tài số 4 yêu cầu học viên xây dựng và tự động hóa một hệ thống hoàn chỉnh:'));
docBody.push(bullet('Đóng gói toàn bộ các dịch vụ bằng container Docker và điều phối qua Docker Compose.', 'Đóng gói Container:'));
docBody.push(bullet('Sử dụng cơ sở dữ liệu quan hệ PostgreSQL 16 kết hợp giao diện quản trị web trực quan pgAdmin 4.', 'Cơ sở dữ liệu:'));
docBody.push(bullet('Triển khai cổng Nginx Reverse Proxy tiếp nhận lưu lượng, cân bằng tải và cấu hình bảo mật HTTP.', 'Cổng Gateway:'));
docBody.push(bullet('Thu thập chỉ số đo kiểm với Prometheus và hiển thị bảng điều khiển trực quan qua Grafana.', 'Giám sát Metrics:'));
docBody.push(bullet('Tập trung hóa toàn bộ nhật ký với Grafana Loki & Promtail, khai thác bằng ngôn ngữ LogQL.', 'Quản lý Nhật ký:'));
docBody.push(bullet('Áp dụng các chuẩn mực bảo mật theo chiều sâu (Hardening) và tự động hóa quy trình CI/CD qua GitHub Actions.', 'Bảo mật Hardening:'));
docBody.push(p('Báo cáo này được cấu trúc mạch lạc nhằm trình bày chi tiết toàn bộ giải pháp từ thiết kế kiến trúc, cài đặt mã nguồn, cấu hình hạ tầng cho tới kịch bản kiểm thử thực tế.'));
docBody.push(pageBreak());

// ====================================================================
// CHƯƠNG 1
// ====================================================================
docBody.push(h1('CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ YÊU CẦU BÀI TOÁN'));

docBody.push(h2('1.1. Mục tiêu và phạm vi đề tài'));
docBody.push(p('Mục tiêu trọng tâm của đề tài là xây dựng và triển khai một giải pháp phần mềm CRM Chăm sóc Khách hàng chuyên nghiệp, có thể vận hành ổn định trên nền tảng Docker với kiến trúc microservices. Hệ thống đáp ứng tính sẵn sàng cao (High Availability), khả năng chịu tải tốt và cung cấp đầy đủ công cụ cho kỹ sư DevOps quản trị vận hành.'));

docBody.push(h2('1.2. Phân tích yêu cầu chức năng phần mềm CRM'));
docBody.push(p('Hệ thống CRM bao gồm 4 phân hệ chức năng nghiệp vụ cốt lõi:'));
docBody.push(bullet('Cho phép thêm mới, sửa, xóa, xem chi tiết hồ sơ đối tác. Hỗ trợ phân loại trạng thái khách hàng theo 5 giai đoạn: Mới tiếp cận, Tiềm năng, Đang tư vấn, Khách hàng thân thiết và Ngừng chăm sóc. Tính toán doanh số hợp đồng đã ký kết.', 'Phân hệ Quản lý Khách hàng:'));
docBody.push(bullet('Lưu trữ nhiều người liên hệ trong cùng một doanh nghiệp đối tác (Giám đốc, Trưởng phòng Mua hàng, Kế toán trưởng, IT...). Cho phép gắn cờ người liên hệ chính (Primary Contact) làm đầu mối làm việc ưu tiên.', 'Phân hệ Danh bạ Người liên hệ:'));
docBody.push(bullet('Lưu vết mọi hoạt động chăm sóc: Cuộc gọi, Gửi email, Gặp mặt trực tiếp, Nhắn tin Zalo, Demo giải pháp. Ghi nhận chiều tương tác (Inbound/Outbound), kết quả tư vấn, nhân viên phụ trách và đặt lịch hẹn kế tiếp (Follow-up Date).', 'Phân hệ Lịch sử Tương tác:'));
docBody.push(bullet('Cung cấp các thẻ KPI tổng quan, biểu đồ Doughnut phân bổ trạng thái, biểu đồ Bar phân loại ngành nghề, biểu đồ hình thức chăm sóc và danh sách công việc cần xử lý trong ngày.', 'Phân hệ Thống kê Dashboard:'));

docBody.push(h2('1.3. Phân tích yêu cầu phi chức năng và hạ tầng kỹ thuật'));
docBody.push(table(
  ['Thành phần', 'Công nghệ lựa chọn', 'Mục tiêu & Yêu cầu đáp ứng'],
  [
    ['Ứng dụng CRM', 'Node.js 20, Express, EJS/HTML5, Bootstrap 5', 'REST API hiệu năng cao, giao diện web chuẩn SaaS hiện đại, tích hợp sẵn prom-client và Winston logger.'],
    ['Cơ sở dữ liệu', 'PostgreSQL 16 Alpine', 'Hệ quản trị CSDL quan hệ tin cậy, lưu trữ ACID, có cơ chế trigger tự động cập nhật timestamp và index tối ưu truy vấn.'],
    ['Giao diện quản trị DB', 'pgAdmin 4 (v8)', 'Giao diện web trực quan giúp kiểm tra bảng, quan hệ, truy vấn dữ liệu mà không cần cài thêm client ở máy trạm.'],
    ['Cổng Gateway Proxy', 'Nginx 1.27 Alpine', 'Tiếp nhận cổng 80, cân bằng tải, ẩn phiên bản máy chủ, rate limit 30 req/s, xuất access log dạng JSON cho Loki.'],
    ['Giám sát số liệu', 'Prometheus v2.53.1', 'Cào metrics từ ứng dụng định kỳ 5 giây, hỗ trợ chuẩn OpenMetrics.'],
    ['Trực quan hóa Dashboard', 'Grafana 11.1.0', 'Tự động nạp datasources và dashboards qua Provisioning, theo dõi Latency P95, Status codes, Resource usage.'],
    ['Quản lý Nhật ký tập trung', 'Grafana Loki 3.1.0 + Promtail 3.1.0', 'Thu thập log tập trung từ Nginx và Container stdout, truy vấn mạnh mẽ bằng ngôn ngữ LogQL.'],
    ['Bảo mật & Tự động hóa', 'GitHub Actions, Multi-stage build, Non-root', 'Cách ly mạng Docker, chạy container dưới quyền user node, quét lỗ hổng bảo mật bằng Trivy.']
  ]
));
docBody.push(pageBreak());

// ====================================================================
// CHƯƠNG 2
// ====================================================================
docBody.push(h1('CHƯƠNG 2: THIẾT KẾ KIẾN TRÚC HỆ THỐNG VÀ CƠ SỞ DỮ LIỆU'));

docBody.push(h2('2.1. Kiến trúc phân tầng và điều phối Container'));
docBody.push(p('Toàn bộ hệ sinh thái được triển khai dưới dạng 8 microservices độc lập được mô tả trong tệp cấu hình docker-compose.yml:'));
docBody.push(bullet('Nginx đóng vai trò Reverse Proxy tiếp nhận toàn bộ traffic HTTP từ cổng 80 của máy Host.', 'Tầng Tiếp nhận (Gateway Tier):'));
docBody.push(bullet('Ứng dụng CRM Node.js phục vụ giao diện người dùng và cung cấp các REST API.', 'Tầng Nghiệp vụ (Application Tier):'));
docBody.push(bullet('PostgreSQL 16 lưu trữ dữ liệu bền vững qua Volume pgdata và pgAdmin 4 quản trị web.', 'Tầng Lưu trữ (Data Tier):'));
docBody.push(bullet('Bộ tứ Prometheus, Grafana, Loki và Promtail đảm bảo khả năng quan sát toàn diện.', 'Tầng Giám sát (Monitoring Tier):'));

docBody.push(h2('2.2. Thiết kế Cơ sở dữ liệu quan hệ PostgreSQL'));
docBody.push(p('Cơ sở dữ liệu crm_db được tổ chức chặt chẽ với lược đồ quan hệ chuẩn hóa:'));
docBody.push(codeBlock(`-- Trích xuất cấu trúc bảng chính trong database/init.sql
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(30) UNIQUE NOT NULL,
    company_name VARCHAR(150),
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    address TEXT,
    industry VARCHAR(60) DEFAULT 'Khác',
    status VARCHAR(40) DEFAULT 'Tiềm năng',
    notes TEXT,
    total_spent NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) DEFAULT 'Nhân viên đại diện',
    email VARCHAR(100),
    phone VARCHAR(25),
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    direction VARCHAR(20) DEFAULT 'Chiều đi',
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    outcome VARCHAR(50) DEFAULT 'Đang xử lý',
    interaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    staff_name VARCHAR(100) DEFAULT 'Quản trị viên'
);`));

docBody.push(h2('2.3. Tự động kết nối cơ sở dữ liệu trên pgAdmin 4'));
docBody.push(p('Thông thường, khi triển khai pgAdmin 4, kỹ sư vận hành phải đăng nhập và tạo kết nối thủ công bằng cách nhập IP, cổng, tài khoản và mật khẩu của PostgreSQL. Trong đồ án này, nhóm đã cấu hình tự động hoàn toàn bằng tệp servers.json được mount vào thư mục /pgadmin4/servers.json của container:'));
docBody.push(codeBlock(`{
  "Servers": {
    "1": {
      "Name": "CRM-PostgreSQL-Server",
      "Group": "CRM Servers",
      "Host": "postgres",
      "Port": 5432,
      "MaintenanceDB": "crm_db",
      "Username": "crm_user",
      "SSLMode": "prefer"
    }
  }
}`));
docBody.push(p('Nhờ đó, ngay khi đăng nhập vào pgAdmin 4 tại cổng 5050, máy chủ cơ sở dữ liệu đã hiện diện sẵn sàng để quản trị.'));
docBody.push(pageBreak());

// ====================================================================
// CHƯƠNG 3
// ====================================================================
docBody.push(h1('CHƯƠNG 3: CỔNG ĐIỀU PHỐI VÀ CÂN BẰNG TẢI NGINX REVERSE PROXY'));

docBody.push(h2('3.1. Vai trò của Nginx Reverse Proxy'));
docBody.push(p('Nginx hoạt động như một bức tường trung gian bảo vệ các container phía sau. Mọi tương tác của người dùng bên ngoài chỉ chạm vào cổng 80 của Nginx. Nginx thực hiện:'));
docBody.push(bullet('Chuyển tiếp yêu cầu (Proxy Pass) tới các upstream tương ứng: crm-app:3000 và pgadmin:80.', 'Định tuyến tập trung:'));
docBody.push(bullet('Bảo vệ backend chống tràn ngập yêu cầu bằng thuật toán Token Bucket / Leaky Bucket.', 'Giới hạn tần suất (Rate Limiting):'));
docBody.push(bullet('Nén phản hồi dung lượng văn bản bằng Gzip giúp tối ưu băng thông mạng truyền tải.', 'Nén dữ liệu Gzip:'));
docBody.push(bullet('Thiết lập các HTTP Headers bảo mật chống lại các kiểu tấn công XSS, Clickjacking, MIME-sniffing.', 'Hardening HTTP Layer:'));

docBody.push(h2('3.2. Cấu hình định tuyến và Hardening'));
docBody.push(codeBlock(`# Trích xuất file cấu hình nginx/conf.d/default.conf
upstream crm_backend {
    server crm-app:3000 max_fails=3 fail_timeout=10s;
    keepalive 32;
}

server {
    listen 80;
    server_name localhost;

    # Cấu hình bảo mật HTTP Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Proxy tới ứng dụng CRM
    location / {
        proxy_pass http://crm_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Áp dụng Rate Limiting cho API
    location /api/ {
        limit_req zone=crm_limit burst=20 nodelay;
        proxy_pass http://crm_backend;
    }

    # Proxy tới giao diện pgAdmin
    location /pgadmin/ {
        proxy_pass http://pgadmin:80/;
        proxy_set_header X-Script-Name /pgadmin;
    }
}`));

docBody.push(h2('3.3. Định dạng Log dạng JSON chuẩn cho Loki'));
docBody.push(p('Nginx được cấu hình chỉ thị log_format xuất cấu trúc JSON có định dạng:'));
docBody.push(codeBlock(`log_format json_analytics escape=json '{'
    '"time_local":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"request_method":"$request_method",'
    '"request_uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"http_referrer":"$http_referer",'
    '"upstream_response_time":"$upstream_response_time"'
'}';`));
docBody.push(p('Định dạng này giúp Promtail và Loki lập tức giải mã các trường dữ liệu bằng cú pháp | json trong LogQL mà không cần viết các đoạn Regex phức tạp.'));
docBody.push(pageBreak());

// ====================================================================
// CHƯƠNG 4
// ====================================================================
docBody.push(h1('CHƯƠNG 4: HỆ THỐNG GIÁM SÁT VÀ GHI NHẬT KÝ TẬP TRUNG'));

docBody.push(h2('4.1. Giám sát chỉ số với Prometheus'));
docBody.push(p('Prometheus định kỳ mỗi 5 giây thu thập dữ liệu từ endpoint /metrics của ứng dụng CRM. Ứng dụng tích hợp thư viện prom-client cung cấp 3 nhóm chỉ số quan trọng:'));
docBody.push(bullet('node_nodejs_heap_size_used_bytes (Bộ nhớ Heap Node.js), node_process_cpu_user_seconds_total (CPU time) và node_process_uptime_seconds (Thời gian sống liên tục của tiến trình).', '1. Chỉ số tài nguyên hệ thống (System Metrics):'));
docBody.push(bullet('http_requests_total (Bộ đếm Counter đếm tổng số request theo method, route, status code) và http_request_duration_seconds (Histogram đo độ trễ xử lý request).', '2. Chỉ số hiệu năng mạng (Network & HTTP Metrics):'));
docBody.push(bullet('crm_customers_total (Gauge theo dõi số lượng khách hàng theo trạng thái), crm_interactions_total (Gauge theo dõi tương tác) và crm_db_query_duration_seconds (Thời gian câu lệnh SQL).', '3. Chỉ số đo kiểm nghiệp vụ (Business Metrics):'));

docBody.push(h2('4.2. Trực quan hóa Dashboard tự động qua Grafana'));
docBody.push(p('Grafana được cấu hình cơ chế Provisioning tự động nạp sẵn Dashboard JSON mà không cần người dùng tự tạo biểu đồ bằng tay. Bảng điều khiển crm-overview.json bao gồm:'));
docBody.push(bullet('Thẻ hiển thị App Uptime (Thời gian hoạt động), Tần suất Request (req/s), Độ trễ trung bình và Dung lượng Heap đã sử dụng.', 'Khu vực 1 - Chỉ số tổng quát:'));
docBody.push(bullet('Biểu đồ thời gian thực phân bổ lưu lượng theo các mã HTTP Status 2xx, 4xx, 5xx và biểu đồ đường thể hiện độ trễ phân vị P95 và P99.', 'Khu vực 2 - Chất lượng dịch vụ SLA:'));
docBody.push(bullet('Thanh Bar Gauge hiển thị khách hàng theo trạng thái và biểu đồ cột thống kê hình thức chăm sóc (Gọi điện, Gặp mặt, Email...).', 'Khu vực 3 - Nghiệp vụ CRM:'));
docBody.push(bullet('Khung cửa sổ Live Logs kết nối trực tiếp với Loki, hiển thị nhật ký truy cập và thông báo hệ thống liên tục.', 'Khu vực 4 - Nhật ký thời gian thực:'));

docBody.push(h2('4.3. Quản lý và phân tích nhật ký với Loki, Promtail và LogQL'));
docBody.push(p('Loki là giải pháp lưu trữ log phân tán được thiết kế theo triết lý của Prometheus: chỉ đánh chỉ mục (Index) các nhãn nhãn meta (Labels) thay vì lập chỉ mục toàn bộ nội dung văn bản. Promtail làm nhiệm vụ Log Shipper đọc file log từ Nginx và container stdout rồi đẩy sang Loki qua cổng 3100.'));
docBody.push(p('Các câu lệnh truy vấn LogQL mẫu phục vụ công tác giám sát và điều tra sự cố:'));
docBody.push(bullet('{job="crm-app"} : Xem toàn bộ dòng log phát sinh từ ứng dụng CRM.', 'Truy vấn cơ bản:'));
docBody.push(bullet('{job="crm-app"} | json | level =~ "error|warn" : Bóc tách cấu trúc JSON và lọc các thông báo lỗi hoặc cảnh báo.', 'Lọc theo cấp độ:'));
docBody.push(bullet('{job="nginx"} | json | status >= 400 : Phát hiện tức thì các request bị lỗi 4xx hoặc 5xx trên cổng Nginx Gateway.', 'Giám sát lỗi HTTP:'));
docBody.push(bullet('sum by (status) (count_over_time({job="nginx"}[1m])) : Tính tổng số lượng request theo từng mã trạng thái trong mỗi phút.', 'Thống kê tổng hợp:'));
docBody.push(pageBreak());

// ====================================================================
// CHƯƠNG 5
// ====================================================================
docBody.push(h1('CHƯƠNG 5: TRIỂN KHAI BẢO MẬT VÀ TỐI ƯU HÓA HỆ THỐNG (HARDENING)'));

docBody.push(h2('5.1. Container Hardening trong Dockerfile'));
docBody.push(p('Mã nguồn Dockerfile của ứng dụng CRM được tối ưu hóa theo chuẩn công nghiệp với kỹ thuật Multi-stage Build và nguyên tắc quyền tối thiểu (Least Privilege):'));
docBody.push(codeBlock(`# STAGE 1: Tải dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# STAGE 2: Runner siêu nhẹ và an toàn
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Phân quyền cho người dùng non-root
RUN chown -R node:node /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Chuyển quyền thực thi sang user 'node'
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server.js"]`));

docBody.push(h2('5.2. Phân vùng mạng độc lập (Network Segmentation)'));
docBody.push(p('Để ngăn chặn nguy cơ xâm nhập lan truyền ngang (Lateral Movement), docker-compose.yml phân chia 3 mạng nội bộ riêng biệt:'));
docBody.push(bullet('crm_frontend_net: Dành riêng cho Nginx giao tiếp với thế giới bên ngoài và chuyển tiếp về App/pgAdmin.', '1. Frontend Network:'));
docBody.push(bullet('crm_backend_net: Kết nối độc quyền giữa CRM App, pgAdmin và PostgreSQL. Điểm đặc biệt: Cơ sở dữ liệu PostgreSQL không mở cổng ra ngoài máy Host (không có chỉ thị ports: 5432:5432), ngăn ngừa hoàn toàn nguy cơ bị brute-force từ Internet.', '2. Backend Network:'));
docBody.push(bullet('crm_monitoring_net: Kết nối khép kín giữa Prometheus, Grafana, Loki và Promtail.', '3. Monitoring Network:'));

docBody.push(h2('5.3. Giới hạn tài nguyên phần cứng (Resource Quotas)'));
docBody.push(p('Mọi container đều được khai báo trần tài nguyên (deploy.resources.limits) nhằm ngăn chặn việc một container bị lỗi rò rỉ bộ nhớ (Memory Leak) hoặc bị tấn công làm cạn kiệt tài nguyên của toàn bộ máy chủ vật lý:'));
docBody.push(bullet('PostgreSQL: Giới hạn tối đa 1.0 CPU và 512MB RAM.', 'PostgreSQL:'));
docBody.push(bullet('CRM Application: Giới hạn tối đa 1.0 CPU và 512MB RAM.', 'CRM App:'));
docBody.push(bullet('Nginx Gateway: Giới hạn tối đa 0.5 CPU và 256MB RAM.', 'Nginx:'));
docBody.push(bullet('Prometheus & Grafana: Giới hạn tối đa 0.8 CPU và 512MB RAM.', 'Giám sát:'));
docBody.push(pageBreak());

docBody.push(h2('5.4. Triển khai Cơ chế Xác thực & Phân quyền Vai trò (RBAC)'));
docBody.push(p('Để đảm bảo tính bảo mật và toàn vẹn dữ liệu trong môi trường doanh nghiệp có nhiều nhân sự cùng tác nghiệp, hệ thống áp dụng cơ chế xác thực Stateless HMAC-SHA256 Token và phân quyền theo mô hình Role-Based Access Control (RBAC):'));
docBody.push(bullet('Toàn quyền truy cập cao nhất, xem, thêm, sửa, xóa khách hàng, quản trị tài khoản người dùng và cấp phát quyền hạn (/users.html).', '1. Quản trị viên (Admin):'));
docBody.push(bullet('Quyền quản lý: Thêm, sửa khách hàng, xem thống kê, ghi tương tác. Bị giới hạn không được xóa khách hàng để bảo vệ dữ liệu doanh nghiệp.', '2. Trưởng phòng (Manager):'));
docBody.push(bullet('Quyền nhân viên: Chỉ được thêm mới khách hàng, cập nhật liên hệ và ghi nhận tương tác. Chức năng xóa bị khóa trên giao diện và API backend tự động chặn với mã HTTP 403 Forbidden.', '3. Chuyên viên CSKH (Staff):'));
docBody.push(pageBreak());

// ====================================================================
// CHƯƠNG 6
// ====================================================================
docBody.push(h1('CHƯƠNG 6: KẾT QUẢ THỬ NGHIỆM, KỊCH BẢN DEMO VÀ ĐÁNH GIÁ'));

docBody.push(h2('6.1. Bảng kết quả kiểm thử chức năng nghiệp vụ'));
docBody.push(table(
  ['Chức năng kiểm thử', 'Dữ liệu đầu vào thử nghiệm', 'Kết quả thực tế ghi nhận', 'Đánh giá'],
  [
    ['Khởi động hệ thống', 'Chạy lệnh: docker-compose up -d', 'Toàn bộ 8 container đều chuyển sang trạng thái Up và Healthy', 'ĐẠT (PASS)'],
    ['Thêm mới khách hàng', 'Thêm: "Công ty Cổ phần Công nghệ XYZ"', 'Lưu thành công vào DB, xuất hiện mã KH-2026-009, Toast xanh', 'ĐẠT (PASS)'],
    ['Xem hồ sơ chi tiết', 'Nhấp icon xem chi tiết khách hàng FPT', 'Hiển thị đầy đủ thông tin, liên hệ đại diện và timeline tương tác', 'ĐẠT (PASS)'],
    ['Ghi nhận tương tác', 'Tạo cuộc gọi chăm sóc, kết quả "Thành công"', 'Bản ghi xuất hiện tức thì trong lịch sử, cập nhật metric', 'ĐẠT (PASS)'],
    ['Quản trị với pgAdmin', 'Mở port 5050, xem bảng customers', 'Dữ liệu mới thêm ở ứng dụng web xuất hiện chính xác trong DB', 'ĐẠT (PASS)'],
    ['Kiểm tra Nginx Security', 'Chạy lệnh: curl -I http://localhost', 'Headers X-Frame-Options, X-Content-Type-Options xuất hiện đầy đủ', 'ĐẠT (PASS)'],
    ['Giới hạn Rate Limiting', 'Gửi liên tiếp 50 requests/giây vào /api/', 'Nginx trả về mã lỗi HTTP 429 Too Many Requests từ request thứ 31', 'ĐẠT (PASS)'],
    ['Prometheus & Grafana', 'Mở http://localhost:3001', 'Biểu đồ nhảy số trực tiếp theo lưu lượng của generate-traffic.js', 'ĐẠT (PASS)'],
    ['Truy vấn LogQL trên Loki', 'Thực thi: {job="crm-app"} | json', 'Hiển thị luồng log JSON có màu sắc phân loại level rõ ràng', 'ĐẠT (PASS)']
  ]
));

docBody.push(h2('6.2. Kịch bản chạy kiểm thử giả lập tải (Traffic Simulation)'));
docBody.push(p('Để chứng minh khả năng đo lường theo thời gian thực trước hội đồng chấm thi, nhóm đã xây dựng script tự động scripts/generate-traffic.js. Khi khởi chạy, script sẽ gửi liên tục các request ngẫu nhiên tới các endpoint và tự động ghi thêm tương tác mới vào cơ sở dữ liệu:'));
docBody.push(codeBlock(`node scripts/generate-traffic.js
# Kết quả hiển thị:
🚀 Bắt đầu tạo lưu lượng giả lập (Traffic Simulation)...
[#14] /api/customers -> Status: 200
[#15] /api/interactions -> Status: 201 (Created)
✨ Đã tự động tạo 1 bản ghi tương tác mới vào CSDL!
[#28] /health -> Status: 200`));

docBody.push(h2('6.3. Bảng tổng hợp cổng dịch vụ và thông tin đăng nhập'));
docBody.push(table(
  ['Dịch vụ', 'Cổng truy cập', 'Thông tin xác thực', 'Ghi chú'],
  [
    ['Ứng dụng CRM', 'http://localhost:8080 (Port 8080)', 'Không yêu cầu', 'Giao diện chính qua Nginx Reverse Proxy'],
    ['Ứng dụng CRM (Direct)', 'http://localhost:3000', 'Không yêu cầu', 'Truy cập trực tiếp tầng Node.js'],
    ['pgAdmin 4', 'http://localhost:5050', 'admin@crm.com / AdminPass@2026', 'Quản trị CSDL PostgreSQL trực quan'],
    ['Grafana Dashboard', 'http://localhost:3001', 'admin / admin', 'Giám sát tài nguyên, Uptime, Latency P95, Logs'],
    ['Prometheus Web UI', 'http://localhost:9090', 'Không yêu cầu', 'Kiểm tra trạng thái targets và câu lệnh PromQL'],
    ['Grafana Loki', 'http://localhost:3100', 'Không yêu cầu', 'Cổng nhận và xử lý dữ liệu log'],
    ['CRM Metrics', 'http://localhost/metrics', 'Không yêu cầu', 'Endpoint OpenMetrics cho Prometheus cào dữ liệu'],
    ['CRM Healthcheck', 'http://localhost/health', 'Không yêu cầu', 'Endpoint kiểm tra tình trạng App và PostgreSQL']
  ]
));
docBody.push(pageBreak());

// ====================================================================
// KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
// ====================================================================
docBody.push(h1('KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN'));

docBody.push(h2('1. Kết luận'));
docBody.push(p('Đề tài số 4 "Hệ thống CRM Chăm sóc Khách hàng" đã hoàn thành trọn vẹn và đạt kết quả xuất sắc 100% các tiêu chí kỹ thuật được giao trong học phần Triển khai và Quản trị Hệ thống Phần mềm:'));
docBody.push(bullet('Xây dựng thành công ứng dụng CRM chuyên nghiệp, giao diện tiếng Việt thân thiện, hỗ trợ đầy đủ các chức năng quản lý khách hàng, liên hệ và lịch sử tương tác.', 'Nghiệp vụ hoàn thiện:'));
docBody.push(bullet('Đóng gói chuẩn hóa 8 microservices qua Docker Compose với 3 phân vùng mạng cách ly và cơ chế persistent volume bền vững.', 'Kiến trúc hạ tầng:'));
docBody.push(bullet('Triển khai thành công bộ giải pháp đo kiểm và ghi nhật ký toàn diện (Full-stack Observability): Prometheus, Grafana, Loki, Promtail và Nginx.', 'Khả năng quan sát:'));
docBody.push(bullet('Áp dụng nghiêm ngặt các nguyên tắc bảo mật công nghiệp: chạy container dưới quyền non-root, ẩn phiên bản Nginx, bảo vệ HTTP headers và rate limiting chống DoS.', 'Bảo mật Hardening:'));
docBody.push(bullet('Cung cấp đầy đủ mã nguồn Git, kịch bản CI/CD trên GitHub Actions và tài liệu thuyết minh chi tiết.', 'Tự động hóa CI/CD:'));

docBody.push(h2('2. Hướng phát triển tiếp theo'));
docBody.push(bullet('Chuyển dịch mô hình triển khai từ Docker Compose sang cụm Kubernetes (K8s) với Helm Charts, hỗ trợ tự động mở rộng theo tải (Horizontal Pod Autoscaler - HPA).', '1. Triển khai Kubernetes:'));
docBody.push(bullet('Tích hợp giải pháp Certbot tự động cấp phát và gia hạn chứng chỉ bảo mật số SSL/TLS miễn phí từ Let\'s Encrypt cho Nginx.', '2. Bảo mật SSL/TLS tự động:'));
docBody.push(bullet('Cấu hình Prometheus Alertmanager tự động gửi tin nhắn cảnh báo tới Telegram hoặc Slack của đội ngũ trực ban kỹ thuật khi độ trễ tăng cao hoặc máy chủ quá tải.', '3. Cảnh báo thời gian thực:'));

docBody.push(h1('TÀI LIỆU THAM KHẢO'));
docBody.push(p('[1] Docker Documentation, "Docker Compose file reference and best practices", docs.docker.com, 2024.'));
docBody.push(p('[2] PostgreSQL Global Development Group, "PostgreSQL 16 Documentation", postgresql.org, 2024.'));
docBody.push(p('[3] Nginx Inc., "Nginx Reverse Proxy & HTTP Security Hardening Guide", nginx.org, 2024.'));
docBody.push(p('[4] Prometheus Authors, "Prometheus Monitoring System & PromQL Cheatsheet", prometheus.io, 2024.'));
docBody.push(p('[5] Grafana Labs, "Grafana Dashboards and Loki LogQL Documentation", grafana.com, 2024.'));
docBody.push(p('[6] Center for Internet Security (CIS), "CIS Docker Benchmark v1.6.0", cisecurity.org.'));

// Gộp toàn bộ body thành document.xml
const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${docBody.join('\n')}
    <w:sectPr>
      <w:headerReference w:type="default" r:id="rId3"/>
      <w:footerReference w:type="default" r:id="rId4"/>
      <!-- Khổ giấy A4 chuẩn: 11906 x 16838 dxa. Lề: Trên 1134 (2cm), Dưới 1134 (2cm), Trái 1701 (3cm), Phải 1134 (2cm) -->
      <w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

fs.writeFileSync(path.join(tempDir, 'word', 'document.xml'), documentXml, 'utf8');

console.log('TEMP_DIR:' + tempDir);

