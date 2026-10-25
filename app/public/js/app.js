// Common utilities cho CRM Frontend

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
    <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
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
  }, 4000);
}

function formatMoney(amount) {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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

// Kiểm tra nhanh kết nối sức khỏe hệ thống
async function checkSystemHealth() {
  try {
    const res = await fetch('/health');
    const data = await res.json();
    const statusEl = document.getElementById('systemStatusPill');
    if (statusEl) {
      if (data.status === 'UP') {
        statusEl.innerHTML = '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-circle-fill me-1 small"></i>Hệ thống: Sẵn sàng</span>';
      } else {
        statusEl.innerHTML = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle"><i class="bi bi-exclamation-circle-fill me-1"></i>Cơ sở dữ liệu đang kết nối lại...</span>';
      }
    }
  } catch (e) {
    const statusEl = document.getElementById('systemStatusPill');
    if (statusEl) {
      statusEl.innerHTML = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-slash-circle-fill me-1"></i>Mất kết nối</span>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkSystemHealth();
  setInterval(checkSystemHealth, 30000);
});
