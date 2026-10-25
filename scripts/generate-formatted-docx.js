const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const sampleDir = 'C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/sample_docx';
const workDir = 'C:/Users/MSI/.gemini/antigravity/brain/ca917c38-0e72-4290-a1c4-17d4c74ec4c0/scratch/crm_docx_build';

// 1. Copy sample directory to workDir
if (fs.existsSync(workDir)) {
  fs.rmSync(workDir, { recursive: true, force: true });
}

// Use powershell Copy-Item or node recursive copy
function copyFolderRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyFolderRecursive(sampleDir, workDir);
console.log('Copied sample template to workDir');

// 2. Read and modify word/document.xml
let docXml = fs.readFileSync(path.join(workDir, 'word', 'document.xml'), 'utf8');

// Replacements dictionary
const replacements = [
  // Đề tài title on cover
  {
    from: 'Đề tài:  Hệ thống đặt vé xem phim / sự kiện.',
    to: 'Đề tài:  Hệ thống CRM Chăm sóc Khách hàng (Đề tài số 4)'
  },
  // TOC
  {
    from: '2.1.3. MySQL và phpMyAdmin',
    to: '2.1.3. PostgreSQL và pgAdmin 4'
  },
  // Chapter 1 overview
  {
    from: 'Ứng dụng Express tổ chức theo dạng monolithic, trong đó các chức năng nghiệp vụ nằm trong cùng một ứng dụng.',
    to: 'Ứng dụng Express CRM tổ chức theo dạng kiến trúc phân tầng với đầy đủ các module quản lý khách hàng, liên hệ, tương tác và phân quyền RBAC.'
  },
  {
    from: 'Website sử dụng MySQL để lưu dữ liệu; phpMyAdmin hỗ trợ quản trị cơ sở dữ liệu.',
    to: 'Website sử dụng PostgreSQL 16 để lưu dữ liệu; pgAdmin 4 hỗ trợ quản trị cơ sở dữ liệu trực quan.'
  },
  {
    from: 'Prometheus thu thập số liệu từ cAdvisor và các exporter.',
    to: 'Prometheus thu thập số liệu từ cAdvisor, CRM metrics endpoint (/metrics) và Nginx.'
  },
  {
    from: 'Promtail đọc log Nginx và gửi đến Loki.',
    to: 'Promtail đọc log từ Nginx và ứng dụng CRM rồi chuyển tiếp đến Loki.'
  },
  {
    from: 'Hình 1.1. Sơ đồ kiến trúc tổng thể của hệ thống',
    to: 'Hình 1.1. Sơ đồ kiến trúc tổng thể của hệ thống CRM'
  },
  // Section 1.2
  {
    from: '-Ứng dụng: Website đặt vé sử dụng Node.js và Express, chạy sau Nginx reverse proxy.',
    to: '-Ứng dụng: Website CRM Chăm sóc Khách hàng sử dụng Node.js và Express, chạy sau Nginx reverse proxy.'
  },
  {
    from: '-Cơ sở dữ liệu: MySQL 8.4; quản trị bằng phpMyAdmin 5.2.2.',
    to: '-Cơ sở dữ liệu: PostgreSQL 16; quản trị bằng pgAdmin 4.'
  },
  // Section 1.3
  {
    from: 'ca5ed5a  Tích hợp Prometheus, Grafana và exporter để giám sát container, Nginx, MySQL.',
    to: 'ca5ed5a   Tích hợp Prometheus, Grafana và exporter để giám sát container, Nginx, PostgreSQL.'
  },
  {
    from: 'https://github.com/xuand5738-oss/DTC245200435',
    to: 'https://github.com/crm-system/kthp-crm-de4'
  },
  // Chapter 2 - Functions
  {
    from: 'Hình 2.1. Giao diện danh sách suất chiếu.',
    to: 'Hình 2.1. Giao diện Đăng nhập và Phân quyền người dùng theo vai trò (RBAC).'
  },
  {
    from: 'Hình 2.2. Giao diện chọn ghế và thông tin đặt vé.',
    to: 'Hình 2.2. Giao diện Bảng điều khiển Tổng quan Dashboard & Thống kê KPI.'
  },
  {
    from: 'Hình 2.3. Chi tiết vé sau khi thanh toán giả lập thành công.',
    to: 'Hình 2.3. Giao diện Quản lý Danh sách Khách hàng Doanh nghiệp và Timeline.'
  },
  // Section 2.1.2 Docker Compose
  {
    from: 'cd /mnt/d/DTC245200435',
    to: 'cd /mnt/d/TrienKhaiKTHP'
  },
  // Section 2.1.3 Database
  {
    from: 'MySQL và phpMyAdmin',
    to: 'PostgreSQL và pgAdmin 4'
  },
  {
    from: 'Hình 2.6. Các bảng trong cơ sở dữ liệu ticket_booking trên phpMyAdmin',
    to: 'Hình 2.6. Các bảng trong cơ sở dữ liệu crm_db trên pgAdmin 4'
  },
  {
    from: 'Hình 2.x. Đối chiếu thông tin vé số 4 trong MySQL',
    to: 'Hình 2.x. Đối chiếu thông tin khách hàng và lịch sử tương tác trong PostgreSQL'
  },
  // Section 2.2 Nginx
  {
    from: 'cổng 8280 trên máy Windows và chuyển tiếp đến ứng dụng Express tại địa chỉ nội bộ ',
    to: 'cổng 8080 trên máy Windows và chuyển tiếp đến ứng dụng Express tại địa chỉ nội bộ '
  },
  {
    from: 'app:3000',
    to: 'crm-app:3000'
  },
  // Chapter 3 - Prometheus
  {
    from: 'Nginx Exporter cung cấp trạng thái web server và MySQL Exporter cung cấp số liệu cơ sở dữ liệu.',
    to: 'CRM metrics exporter cung cấp số liệu ứng dụng (lưu lượng request, độ trễ, mã lỗi HTTP) và Nginx Exporter cung cấp trạng thái web server.'
  },
  {
    from: 'Hình 3.3. Dashboard Grafana giám sát container, Nginx và MySQL',
    to: 'Hình 3.3. Dashboard Grafana giám sát container, Nginx và PostgreSQL'
  },
  // Chapter 3.2 - Loki
  {
    from: '-Nginx ghi nhật ký truy cập vào file trong volume dùng chung. Promtail đọc các file log này và gửi đến Loki để lưu trữ tập trung.',
    to: '-Nginx và ứng dụng CRM ghi nhật ký truy cập vào file trong volume dùng chung. Promtail đọc các file log này và gửi đến Loki để lưu trữ tập trung.'
  },
  // Chapter 4 - Hardening
  {
    from: 'Trong đề tài, các biện pháp được áp dụng gồm chạy ứng dụng bằng tài khoản non-root, cách ly mạng cơ sở dữ liệu, hạn chế quyền DB, bảo vệ mật khẩu và cấu hình security headers.',
    to: 'Trong đề tài Đề 4, các biện pháp được áp dụng gồm: chạy ứng dụng bằng tài khoản non-root (USER node, uid=1000); cách ly mạng cơ sở dữ liệu (mạng crm_backend_net với internal: true); hạn chế đặc quyền container (cap_drop: [ALL], security_opt, read_only); giới hạn tài nguyên CPU/RAM; băm mật khẩu an toàn bằng bcrypt; xác thực JWT và cấu hình security headers trên Nginx.'
  }
];

let replacedCount = 0;
for (let r of replacements) {
  if (docXml.includes(r.from)) {
    docXml = docXml.split(r.from).join(r.to);
    replacedCount++;
    console.log(`[OK] Replaced: "${r.from.slice(0, 40)}..."`);
  } else {
    console.warn(`[WARN] String not found: "${r.from.slice(0, 40)}..."`);
  }
}
console.log(`Total replacements performed: ${replacedCount} / ${replacements.length}`);

// Write back to workDir
fs.writeFileSync(path.join(workDir, 'word', 'document.xml'), docXml, 'utf8');

// 3. Package into .docx using tar.exe
const outPath1 = path.join(__dirname, '..', 'BAO_CAO_KTHP_DE_4.docx');
const outPath2 = path.join(__dirname, '..', 'BAO_CAO_KTHP_DE_4_CapNhat.docx');

const tempZip = path.join(require('os').tmpdir(), 'crm_repack_' + Date.now() + '.docx');

try {
  // tar.exe in Windows creates standard zip when given .zip or .docx extension
  cp.execSync(`tar.exe -a -c -f "${tempZip}" -C "${workDir}" [Content_Types].xml _rels word`, { stdio: 'inherit' });
  console.log('Repacked docx size:', fs.statSync(tempZip).size);

  // Try to copy to outPath1, if locked copy to outPath2
  let copied1 = false;
  try {
    fs.copyFileSync(tempZip, outPath1);
    console.log('[SUCCESS] Saved to:', outPath1);
    copied1 = true;
  } catch (err) {
    console.warn('[NOTICE] Could not overwrite BAO_CAO_KTHP_DE_4.docx (file may be open in Word):', err.message);
  }

  fs.copyFileSync(tempZip, outPath2);
  console.log('[SUCCESS] Saved to:', outPath2);

  if (copied1) {
    console.log('\nBoth BAO_CAO_KTHP_DE_4.docx and BAO_CAO_KTHP_DE_4_CapNhat.docx are up to date!');
  } else {
    console.log('\nBAO_CAO_KTHP_DE_4_CapNhat.docx was updated successfully! (Please close MS Word to overwrite BAO_CAO_KTHP_DE_4.docx)');
  }
} catch (e) {
  console.error('Packaging error:', e.message);
}
