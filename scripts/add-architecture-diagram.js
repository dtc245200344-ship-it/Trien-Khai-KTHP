const fs = require('fs');
const path = require('path');

// 1. Tạo nội dung HTML + SVG cực kỳ trực quan và chi tiết
const diagramHtml = `<div style="background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #1e1b4b 100%); border-radius: 14px; padding: 18px 22px; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: 1px solid rgba(99, 102, 241, 0.35); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">

  <!-- HEADER -->
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 16px;">
    <div>
      <div style="font-size: 1.25rem; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 8px;">
        🏛️ SƠ ĐỒ HỆ THỐNG VÀ KIẾN TRÚC ĐIỀU HƯỚNG WEBSITE CRM CHÍNH
      </div>
      <div style="font-size: 0.82rem; color: #94a3b8; margin-top: 3px;">
        Cấu trúc điều phối phân tầng khép kín: Tầng Client &rarr; Cổng Nginx (Port 8080) &rarr; Web CRM Node.js (Port 3000) &rarr; PostgreSQL (Port 5432 cô lập) &amp; Bộ công cụ Observability
      </div>
    </div>
    <div style="display: flex; gap: 8px;">
      <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid #10b981; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">8/8 Services Running</span>
      <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid #6366f1; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Docker Compose v3.8</span>
    </div>
  </div>

  <!-- SVG VECTOR ARCHITECTURE FLOW -->
  <div style="background: rgba(15, 23, 42, 0.75); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); padding: 12px; margin-bottom: 16px;">
    <svg viewBox="0 0 1100 210" style="width: 100%; height: auto; display: block; font-family: inherit;">
      <defs>
        <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
        </marker>
        <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#a855f7" />
        </marker>
        <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
        </marker>
        <linearGradient id="grad-client" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284c7" />
          <stop offset="100%" stop-color="#0369a1" />
        </linearGradient>
        <linearGradient id="grad-nginx" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
        <linearGradient id="grad-crm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#3730a3" />
        </linearGradient>
        <linearGradient id="grad-db" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
        <linearGradient id="grad-obs" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#6d28d9" />
        </linearGradient>
      </defs>

      <!-- BOX 1: CLIENT -->
      <rect x="15" y="25" width="150" height="75" rx="8" fill="url(#grad-client)" stroke="#38bdf8" stroke-width="1.5" />
      <text x="90" y="52" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">💻 TRÌNH DUYỆT</text>
      <text x="90" y="70" fill="#e0f2fe" font-size="10.5" text-anchor="middle">Client &amp; Admin</text>
      <text x="90" y="86" fill="#bae6fd" font-size="9" text-anchor="middle">HTTP Requests</text>

      <!-- CONNECTION 1 -> 2 -->
      <path d="M 165 62 L 235 62" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-blue)" />
      <text x="200" y="55" fill="#38bdf8" font-size="9" text-anchor="middle" font-weight="600">:8080</text>

      <!-- BOX 2: NGINX GATEWAY -->
      <rect x="240" y="15" width="180" height="95" rx="8" fill="url(#grad-nginx)" stroke="#10b981" stroke-width="1.5" />
      <text x="330" y="40" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">🛡️ NGINX GATEWAY</text>
      <text x="330" y="58" fill="#d1fae5" font-size="10" text-anchor="middle">Reverse Proxy / Port 8080</text>
      <text x="330" y="74" fill="#a7f3d0" font-size="9" text-anchor="middle">Rate Limit 30 req/s &bull; Hardening</text>
      <text x="330" y="90" fill="#6ee7b7" font-size="9" text-anchor="middle">JSON Access Log Engine</text>

      <!-- CONNECTION 2 -> 3 -->
      <path d="M 420 62 L 490 62" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)" />
      <text x="455" y="55" fill="#10b981" font-size="9" text-anchor="middle" font-weight="600">Proxy: /</text>

      <!-- BOX 3: CRM CORE APP -->
      <rect x="495" y="15" width="280" height="95" rx="8" fill="url(#grad-crm)" stroke="#818cf8" stroke-width="1.5" />
      <text x="635" y="38" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">⚡ WEB CRM CHÍNH (NODE.JS)</text>
      <text x="635" y="55" fill="#e0e7ff" font-size="10" text-anchor="middle">Express Server &bull; Port 3000</text>
      <text x="635" y="72" fill="#c7d2fe" font-size="9" text-anchor="middle">6 Giao Diện: Dashboard, KH, Liên Hệ, Tương Tác, RBAC, Login</text>
      <text x="635" y="89" fill="#a5b4fc" font-size="9" text-anchor="middle">Non-Root User (node:1000) &bull; JWT Auth &bull; /metrics</text>

      <!-- CONNECTION 3 -> 4 (DB) -->
      <path d="M 775 62 L 855 62" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow-orange)" />
      <text x="815" y="55" fill="#f59e0b" font-size="9" text-anchor="middle" font-weight="600">SQL :5432</text>

      <!-- BOX 4: POSTGRESQL & PGADMIN -->
      <rect x="860" y="15" width="225" height="95" rx="8" fill="url(#grad-db)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="972" y="38" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">🐘 POSTGRESQL 16</text>
      <text x="972" y="55" fill="#fef3c7" font-size="10" text-anchor="middle">Database: crm_db (Cô lập backend_net)</text>
      <text x="972" y="72" fill="#fde68a" font-size="9" text-anchor="middle">Bảng: customers, contacts, interactions, users</text>
      <text x="972" y="89" fill="#fcd34d" font-size="9" text-anchor="middle">Quản trị: pgAdmin 4 (Port 5050)</text>

      <!-- OBSERVABILITY LAYER (BOTTOM ROW) -->
      <!-- App to Prometheus -->
      <path d="M 580 110 L 580 145 L 360 145 L 360 160" fill="none" stroke="#f59e0b" stroke-dasharray="3,3" stroke-width="1.5" marker-end="url(#arrow-orange)" />
      <text x="470" y="140" fill="#f59e0b" font-size="8.5" text-anchor="middle">Scrape :3000/metrics (5s)</text>

      <!-- BOX: PROMETHEUS -->
      <rect x="270" y="160" width="180" height="42" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
      <text x="360" y="177" fill="#fbbf24" font-size="11" font-weight="700" text-anchor="middle">🔥 PROMETHEUS (:9090)</text>
      <text x="360" y="193" fill="#cbd5e1" font-size="9" text-anchor="middle">Thu thập chuỗi thời gian (TSDB)</text>

      <!-- Prometheus to Grafana -->
      <path d="M 450 181 L 525 181" fill="none" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#arrow-orange)" />

      <!-- BOX: GRAFANA -->
      <rect x="530" y="160" width="180" height="42" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
      <text x="620" y="177" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">📊 GRAFANA (:3001)</text>
      <text x="620" y="193" fill="#e2e8f0" font-size="9" text-anchor="middle">Trực quan hóa &amp; Báo cáo giám sát</text>

      <!-- Log flow: CRM + Nginx -> Promtail -> Loki -> Grafana -->
      <!-- Promtail Box -->
      <rect x="800" y="160" width="130" height="42" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.2" />
      <text x="865" y="177" fill="#c084fc" font-size="11" font-weight="700" text-anchor="middle">📦 PROMTAIL</text>
      <text x="865" y="193" fill="#cbd5e1" font-size="9" text-anchor="middle">Gom Log JSON</text>

      <!-- Loki Box -->
      <rect x="960" y="160" width="125" height="42" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.2" />
      <text x="1022" y="177" fill="#c084fc" font-size="11" font-weight="700" text-anchor="middle">📜 LOKI (:3100)</text>
      <text x="1022" y="193" fill="#cbd5e1" font-size="9" text-anchor="middle">Lưu trữ LogQL</text>

      <path d="M 930 181 L 955 181" fill="none" stroke="#a855f7" stroke-width="1.5" marker-end="url(#arrow-purple)" />
      <!-- Loki to Grafana curve -->
      <path d="M 960 190 L 715 190" fill="none" stroke="#a855f7" stroke-dasharray="3,3" stroke-width="1.5" marker-end="url(#arrow-purple)" />
    </svg>
  </div>

  <!-- INTERACTIVE MODULE NAVIGATION (ALL PAGES OF THE MAIN WEB) -->
  <div style="margin-bottom: 6px;">
    <div style="font-size: 0.85rem; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
      <span>🔗 ĐIỀU HƯỚNG TRỰC TIẾP CÁC TRANG CỦA HỆ THỐNG WEB CHÍNH</span>
      <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 400;">Bấm vào card để mở ngay trong tab mới ↗</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px;">

      <!-- 1. DASHBOARD -->
      <a href="http://localhost:8080/index.html" target="_blank" style="display: block; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; transition: all 0.2s;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 1.1rem;">📊</span>
          <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-weight: 600;">/</span>
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; color: #e2e8f0; margin-bottom: 2px;">Bảng Điều Khiển</div>
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">Biểu đồ KPI, tỷ lệ chuyển đổi &amp; doanh số</div>
      </a>

      <!-- 2. CUSTOMERS -->
      <a href="http://localhost:8080/customers.html" target="_blank" style="display: block; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; transition: all 0.2s;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 1.1rem;">👥</span>
          <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-weight: 600;">/customers</span>
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; color: #e2e8f0; margin-bottom: 2px;">Khách Hàng</div>
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">CRUD công ty, phân hạng VIP, tìm kiếm nhanh</div>
      </a>

      <!-- 3. CONTACTS -->
      <a href="http://localhost:8080/contacts.html" target="_blank" style="display: block; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(244, 114, 182, 0.4); border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; transition: all 0.2s;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 1.1rem;">📇</span>
          <span style="background: rgba(244, 114, 182, 0.2); color: #f472b6; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-weight: 600;">/contacts</span>
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; color: #e2e8f0; margin-bottom: 2px;">Người Liên Hệ</div>
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">Đầu mối khách hàng, chức danh &amp; SĐT</div>
      </a>

      <!-- 4. INTERACTIONS -->
      <a href="http://localhost:8080/interactions.html" target="_blank" style="display: block; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; transition: all 0.2s;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 1.1rem;">📞</span>
          <span style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-weight: 600;">/interactions</span>
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; color: #e2e8f0; margin-bottom: 2px;">Nhật Ký CSKH</div>
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">Cuộc gọi, email, demo, nhắc lịch hẹn</div>
      </a>

      <!-- 5. RBAC USERS -->
      <a href="http://localhost:8080/users.html" target="_blank" style="display: block; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(248, 113, 113, 0.4); border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; transition: all 0.2s;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 1.1rem;">🛡️</span>
          <span style="background: rgba(248, 113, 113, 0.2); color: #f87171; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-weight: 600;">/users</span>
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; color: #e2e8f0; margin-bottom: 2px;">Phân Quyền RBAC</div>
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">Admin / Manager / Staff, cấp tài khoản</div>
      </a>

      <!-- 6. LOGIN & AUTH -->
      <a href="http://localhost:8080/login.html" target="_blank" style="display: block; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(167, 139, 250, 0.4); border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; transition: all 0.2s;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 1.1rem;">🔐</span>
          <span style="background: rgba(167, 139, 250, 0.2); color: #a78bfa; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-weight: 600;">/login</span>
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; color: #e2e8f0; margin-bottom: 2px;">Cổng Đăng Nhập</div>
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">HMAC-SHA256, Stateless JWT Token</div>
      </a>

    </div>
  </div>

  <!-- EXTERNAL INFRA LINKS FOOTER -->
  <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
    <div style="color: #94a3b8;">
      ⚡ <strong style="color: #cbd5e1;">Cổng Dịch Vụ Hạ Tầng:</strong>
      <a href="http://localhost:5050" target="_blank" style="color: #38bdf8; text-decoration: none; margin-left: 8px;">🖥️ pgAdmin (:5050)</a> &bull;
      <a href="http://localhost:9090" target="_blank" style="color: #fbbf24; text-decoration: none; margin-left: 6px;">🔥 Prometheus (:9090)</a> &bull;
      <a href="http://localhost:3100" target="_blank" style="color: #c084fc; text-decoration: none; margin-left: 6px;">📜 Loki (:3100)</a> &bull;
      <a href="http://localhost:8080/metrics" target="_blank" style="color: #34d399; text-decoration: none; margin-left: 6px;">📈 /metrics</a> &bull;
      <a href="http://localhost:8080/health" target="_blank" style="color: #a3e635; text-decoration: none; margin-left: 6px;">💚 /health</a>
    </div>
    <div style="color: #64748b; font-size: 0.72rem;">
      Nhấn để mở nhanh công cụ quản trị tương ứng
    </div>
  </div>

</div>`;

// 2. Định nghĩa panel sơ đồ
const diagramRow = {
  "collapsed": false,
  "gridPos": { "h": 1, "w": 24, "x": 0, "y": 0 },
  "id": 99,
  "title": "🌐 SƠ ĐỒ HỆ THỐNG VÀ KIẾN TRÚC WEBSITE CHÍNH (CRM TOPOLOGY & SERVICE NAVIGATION)",
  "type": "row"
};

const diagramPanel = {
  "gridPos": { "h": 11, "w": 24, "x": 0, "y": 1 },
  "id": 20,
  "options": {
    "content": diagramHtml,
    "mode": "html"
  },
  "title": "🏛️ Sơ Đồ Kiến Trúc Hệ Thống & Luồng Điều Hướng Các Trang Web CRM",
  "transparent": true,
  "type": "text"
};

// 3. Đọc dashboard hiện tại và cập nhật
const dashboardPath = path.join(__dirname, '..', 'monitoring', 'grafana', 'provisioning', 'dashboards', 'crm-overview.json');
const dashboard = JSON.parse(fs.readFileSync(dashboardPath, 'utf8'));

// Lọc bỏ panel cũ nếu đã tồn tại để tránh trùng lặp
const existingPanels = dashboard.panels.filter(p => p.id !== 99 && p.id !== 20);

// Dịch chuyển y của tất cả các panels hiện tại xuống 12 ô
const shiftedPanels = existingPanels.map(p => ({
  ...p,
  gridPos: {
    ...p.gridPos,
    y: p.gridPos.y + 12
  }
}));

// Gộp lại: diagramRow và diagramPanel lên đầu tiên
dashboard.panels = [diagramRow, diagramPanel, ...shiftedPanels];
dashboard.version = (dashboard.version || 2) + 1;

// Lưu lại file dashboard
fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2), 'utf8');
console.log('✅ Cập nhật thành công dashboard tại:', dashboardPath);
console.log('📊 Tổng số panel:', dashboard.panels.length);
