// ====================================================================
// COMMON UTILITIES & AUTHENTICATION / RBAC CHO CRM FRONTEND
// ====================================================================

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
  }

  const bgClass = type === 'success' ? 'text-bg-success' : type === 'danger' ? 'text-bg-danger' : 'text-bg-warning';
  const toastId = 'toast-' + Date.now();
  const html = `
    <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 show shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-medium">
          <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  setTimeout(() => {
    const el = document.getElementById(toastId);
    if (el) el.remove();
  }, 4500);
}

// --------------------------------------------------------------------
// 1. Quản lý Phiên Đăng Nhập & Phân Quyền (RBAC)
// --------------------------------------------------------------------
function getAuthToken() {
  return localStorage.getItem('crm_token');
}

function getCurrentUser() {
  const userStr = localStorage.getItem('crm_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

function logout() {
  localStorage.removeItem('crm_token');
  localStorage.removeItem('crm_user');
  showToast('Đã đăng xuất khỏi hệ thống.', 'warning');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 500);
}

// Wrapper fetch tự động gắn Bearer Token và xử lý mã lỗi 401, 403
async function apiFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    showToast('Phiên làm việc đã hết hạn. Đang chuyển về trang đăng nhập...', 'danger');
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setTimeout(() => { window.location.href = '/login.html'; }, 1000);
    throw new Error('Chưa xác thực đăng nhập');
  }

  if (response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.message || 'Từ chối truy cập! Bạn không có quyền thực hiện thao tác này.';
    showToast(errorMsg, 'danger');
    throw new Error(errorMsg);
  }

  return response;
}

// Chuyển đổi nhanh vai trò để phục vụ demo trực quan trước giảng viên
async function switchRoleDemo(username, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_user', JSON.stringify(data.user));
    showToast(`Đã chuyển sang vai trò [${data.user.role.toUpperCase()}]: ${data.user.full_name}`, 'success');
    setTimeout(() => { window.location.reload(); }, 600);
  } catch (err) {
    showToast(err.message || 'Lỗi chuyển vai trò', 'danger');
  }
}

// Hiển thị thông tin người dùng và quyền hạn trên thanh điều hướng Navbar
function renderUserNavbar() {
  const user = getCurrentUser();
  const profileContainer = document.getElementById('userProfileNav');
  const navUsersLink = document.getElementById('navUsersLink');

  // Kiểm tra đăng nhập
  const isLoginPage = window.location.pathname.endsWith('login.html');
  if (!user && !isLoginPage) {
    window.location.href = '/login.html';
    return;
  }

  if (isLoginPage) return;

  // Ẩn/Hiện menu Quản trị người dùng & Phân quyền (Chỉ Admin mới thấy)
  if (navUsersLink) {
    if (user && user.role === 'admin') {
      navUsersLink.style.display = 'block';
    } else {
      navUsersLink.style.display = 'none';
    }
  }

  if (profileContainer && user) {
    let roleBadge = '';
    let roleColor = '';
    if (user.role === 'admin') {
      roleBadge = '<span class="badge bg-danger shadow-sm"><i class="bi bi-shield-shaded me-1"></i>ADMIN</span>';
      roleColor = 'border-danger';
    } else if (user.role === 'manager') {
      roleBadge = '<span class="badge text-white shadow-sm" style="background-color: #9333ea;"><i class="bi bi-person-gear me-1"></i>MANAGER</span>';
      roleColor = 'border-purple';
    } else {
      roleBadge = '<span class="badge bg-primary shadow-sm"><i class="bi bi-person me-1"></i>STAFF</span>';
      roleColor = 'border-primary';
    }

    profileContainer.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-sm btn-dark border ${roleColor} dropdown-toggle d-flex align-items-center gap-2 py-1 px-2" type="button" data-bs-toggle="dropdown">
          <div class="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;">
            <i class="bi bi-person-fill text-white"></i>
          </div>
          <div class="text-start d-none d-sm-block" style="line-height: 1.1;">
            <div class="small fw-bold text-white">${user.full_name}</div>
            <div style="font-size: 0.72rem;">${roleBadge}</div>
          </div>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow" style="min-width: 260px;">
          <li class="px-3 py-2 border-bottom bg-light">
            <div class="fw-bold">${user.full_name}</div>
            <div class="small text-muted font-monospace">${user.email}</div>
            <div class="small text-muted">${user.department || 'Bộ phận CSKH'}</div>
          </li>
          ${user.role === 'admin' ? `
            <li><a class="dropdown-item py-2" href="/users.html"><i class="bi bi-shield-lock text-danger me-2"></i>Quản lý Người dùng & Phân quyền</a></li>
            <li><hr class="dropdown-divider"></li>
          ` : ''}
          <li><h6 class="dropdown-header small text-uppercase"><i class="bi bi-arrow-repeat me-1"></i>Chuyển Nhanh Quyền (Demo)</h6></li>
          <li><a class="dropdown-item small" href="javascript:void(0)" onclick="switchRoleDemo('admin', 'admin123')"><i class="bi bi-shield-fill text-danger me-2"></i>1. Quyền Admin (Toàn quyền)</a></li>
          <li><a class="dropdown-item small" href="javascript:void(0)" onclick="switchRoleDemo('manager', 'manager123')"><i class="bi bi-person-gear text-purple me-2" style="color: #9333ea;"></i>2. Quyền Manager (Trưởng phòng)</a></li>
          <li><a class="dropdown-item small" href="javascript:void(0)" onclick="switchRoleDemo('sale', 'sale123')"><i class="bi bi-person-badge text-primary me-2"></i>3. Quyền Staff (Nhân viên CSKH)</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger py-2" href="javascript:void(0)" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Đăng Xuất</a></li>
        </ul>
      </div>
    `;
  }
}

// --------------------------------------------------------------------
// 2. Formatters & Badges
// --------------------------------------------------------------------
function formatMoney(amount) {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function getCompanyAvatar(name) {
  if (!name) return '<div class="company-avatar avatar-blue">KH</div>';
  const words = name.trim().split(/\s+/);
  let initials = '';
  if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  const colors = ['avatar-blue', 'avatar-indigo', 'avatar-purple', 'avatar-emerald', 'avatar-amber', 'avatar-rose'];
  const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  const colorClass = colors[charCode % colors.length];
  return `<div class="company-avatar ${colorClass}">${initials}</div>`;
}

function getPersonAvatar(name) {
  if (!name) return '<div class="person-avatar avatar-indigo"><i class="bi bi-person"></i></div>';
  const words = name.trim().split(/\s+/);
  let initials = '';
  if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  const colors = ['avatar-indigo', 'avatar-purple', 'avatar-emerald', 'avatar-rose', 'avatar-blue', 'avatar-amber'];
  const charCode = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
  const colorClass = colors[charCode % colors.length];
  return `<div class="person-avatar ${colorClass}">${initials}</div>`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Chưa có';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusBadge(status) {
  switch (status) {
    case 'Mới tiếp cận':
      return `<span class="badge badge-status status-new"><i class="bi bi-star me-1"></i>${status}</span>`;
    case 'Tiềm năng':
      return `<span class="badge badge-status status-potential"><i class="bi bi-lightning-charge me-1"></i>${status}</span>`;
    case 'Đang tư vấn':
      return `<span class="badge badge-status status-consulting"><i class="bi bi-chat-dots me-1"></i>${status}</span>`;
    case 'Khách hàng thân thiết':
      return `<span class="badge badge-status status-loyal"><i class="bi bi-shield-check me-1"></i>${status}</span>`;
    case 'Ngừng chăm sóc':
      return `<span class="badge badge-status status-inactive"><i class="bi bi-x-circle me-1"></i>${status}</span>`;
    default:
      return `<span class="badge bg-secondary">${status || 'Khác'}</span>`;
  }
}

function getOutcomeBadge(outcome) {
  switch (outcome) {
    case 'Thành công':
      return `<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-lg me-1"></i>${outcome}</span>`;
    case 'Khách quan tâm':
      return `<span class="badge bg-info-subtle text-info border border-info-subtle"><i class="bi bi-heart me-1"></i>${outcome}</span>`;
    case 'Cần theo dõi':
      return `<span class="badge bg-warning-subtle text-warning border border-warning-subtle"><i class="bi bi-eye me-1"></i>${outcome}</span>`;
    case 'Hẹn lại':
      return `<span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="bi bi-calendar-event me-1"></i>${outcome}</span>`;
    case 'Từ chối':
      return `<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-x me-1"></i>${outcome}</span>`;
    default:
      return `<span class="badge bg-light text-dark border">${outcome || 'Đang xử lý'}</span>`;
  }
}

function getTypeIcon(type) {
  switch (type) {
    case 'Cuộc gọi': return 'bi-telephone-fill text-primary';
    case 'Email': return 'bi-envelope-fill text-danger';
    case 'Gặp mặt trực tiếp': return 'bi-people-fill text-success';
    case 'Nhắn tin Zalo': return 'bi-chat-text-fill text-info';
    case 'Demo giải pháp': return 'bi-display-fill text-warning';
    default: return 'bi-activity text-secondary';
  }
}

// --------------------------------------------------------------------
// 3. Kiểm tra sức khỏe hệ thống
// --------------------------------------------------------------------
async function checkSystemHealth() {
  try {
    const res = await fetch('/health');
    const data = await res.json();
    const statusEl = document.getElementById('systemStatusPill');
    if (statusEl) {
      if (data.status === 'UP') {
        statusEl.innerHTML = '<span class="badge bg-success-subtle text-success border border-success-subtle d-none d-md-inline-block"><i class="bi bi-circle-fill me-1 small"></i>Hệ thống: Sẵn sàng</span>';
      } else {
        statusEl.innerHTML = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle d-none d-md-inline-block"><i class="bi bi-exclamation-circle-fill me-1"></i>Đang phục hồi DB...</span>';
      }
    }
  } catch (e) {
    const statusEl = document.getElementById('systemStatusPill');
    if (statusEl) {
      statusEl.innerHTML = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle d-none d-md-inline-block"><i class="bi bi-slash-circle-fill me-1"></i>Mất kết nối</span>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderUserNavbar();
  checkSystemHealth();
  setInterval(checkSystemHealth, 30000);
});
