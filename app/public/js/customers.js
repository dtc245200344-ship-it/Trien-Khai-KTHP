// Logic Quản lý Khách Hàng
let currentCustomers = [];

async function loadCustomers() {
  try {
    const search = document.getElementById('searchInput')?.value.trim();
    const status = document.getElementById('statusFilter')?.value;
    const industry = document.getElementById('industryFilter')?.value;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (industry) params.append('industry', industry);

    const res = await apiFetch(`/api/customers?${params.toString()}`);
    const result = await res.json();

    if (!result.success) throw new Error(result.message);

    currentCustomers = result.data;
    document.getElementById('customerCount').innerText = currentCustomers.length;
    renderCustomerTable(currentCustomers);
  } catch (error) {
    console.error('Lỗi load danh sách khách hàng:', error);
    showToast('Lỗi khi tải danh sách khách hàng', 'danger');
  }
}

function renderCustomerTable(customers) {
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;

  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4"><i class="bi bi-inbox fs-3 d-block mb-2"></i>Không tìm thấy khách hàng nào phù hợp</td></tr>';
    return;
  }

  const currentUser = getCurrentUser();
  const canDelete = currentUser && currentUser.role === 'admin';

  tbody.innerHTML = customers.map(c => `
    <tr>
      <td><span class="badge bg-light text-dark border font-monospace px-2 py-1">${c.customer_code}</span></td>
      <td>
        <div class="d-flex align-items-center gap-3">
          ${getCompanyAvatar(c.company_name)}
          <div>
            <div class="fw-bold text-dark">${c.company_name}</div>
            <div class="small text-muted"><i class="bi bi-geo-alt me-1"></i>${c.address || 'Chưa cập nhật địa chỉ'}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="fw-medium">${c.contact_name}</div>
        <span class="badge bg-secondary-subtle text-secondary small">${c.total_contacts || 1} liên hệ</span>
      </td>
      <td>
        <div><i class="bi bi-envelope me-1 text-muted"></i><a href="mailto:${c.email}" class="text-decoration-none">${c.email}</a></div>
        <div class="small"><i class="bi bi-telephone me-1 text-muted"></i><a href="tel:${c.phone}" class="text-decoration-none text-dark">${c.phone}</a></div>
      </td>
      <td><span class="badge bg-light text-dark border">${c.industry || 'Khác'}</span></td>
      <td>${getStatusBadge(c.status)}</td>
      <td class="fw-semibold text-success">${formatMoney(c.total_spent)}</td>
      <td class="text-center">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="viewCustomerDetail(${c.id})" title="Xem chi tiết hồ sơ">
            <i class="bi bi-eye"></i>
          </button>
          ${canDelete ? `
            <button class="btn btn-outline-danger" onclick="deleteCustomer(${c.id}, '${c.company_name}')" title="Xóa khách hàng (Admin)">
              <i class="bi bi-trash"></i>
            </button>
          ` : `
            <button class="btn btn-outline-secondary" disabled title="Khóa: Chỉ Quản trị viên (Admin) mới có quyền xóa khách hàng">
              <i class="bi bi-lock-fill"></i>
            </button>
          `}
        </div>
      </td>
    </tr>
  `).join('');
}

// Xem chi tiết khách hàng và timeline tương tác
async function viewCustomerDetail(id) {
  try {
    const res = await apiFetch(`/api/customers/${id}`);
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    const c = result.data;
    document.getElementById('detailCustomerTitle').innerHTML = `
      <i class="bi bi-building text-primary me-2"></i>${c.company_name} 
      <span class="badge bg-light text-dark border ms-2 font-monospace">${c.customer_code}</span>
      <span class="ms-2">${getStatusBadge(c.status)}</span>
    `;

    const detailHtml = `
      <div class="row g-4">
        <!-- Thông tin cơ bản -->
        <div class="col-md-4 border-end">
          <h6 class="fw-bold text-uppercase small text-muted mb-3"><i class="bi bi-info-circle me-1"></i>Hồ Sơ Doanh Nghiệp</h6>
          <p class="mb-2"><strong>Người đại diện:</strong> ${c.contact_name}</p>
          <p class="mb-2"><strong>Email:</strong> ${c.email}</p>
          <p class="mb-2"><strong>Số điện thoại:</strong> ${c.phone}</p>
          <p class="mb-2"><strong>Ngành nghề:</strong> ${c.industry}</p>
          <p class="mb-2"><strong>Địa chỉ:</strong> ${c.address || 'Chưa cập nhật'}</p>
          <p class="mb-2"><strong>Doanh thu ghi nhận:</strong> <span class="text-success fw-bold">${formatMoney(c.total_spent)}</span></p>
          <p class="mb-2"><strong>Ngày tiếp cận:</strong> ${formatDate(c.created_at)}</p>
          ${c.notes ? `<div class="p-2 bg-light rounded small mt-2"><strong>Ghi chú:</strong> ${c.notes}</div>` : ''}

          <h6 class="fw-bold text-uppercase small text-muted mt-4 mb-2"><i class="bi bi-people me-1"></i>Người Liên Hệ (${c.contacts.length})</h6>
          <div class="list-group list-group-flush small">
            ${c.contacts.map(ct => `
              <div class="list-group-item px-0 py-2">
                <div class="fw-bold">${ct.name} ${ct.is_primary ? '<span class="badge bg-primary-subtle text-primary ms-1">Chính</span>' : ''}</div>
                <div class="text-muted">${ct.role || ''} &bull; ${ct.phone || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Lịch sử tương tác chăm sóc -->
        <div class="col-md-8">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-uppercase small text-muted mb-0"><i class="bi bi-clock-history me-1"></i>Lịch Sử Tương Tác & Chăm Sóc (${c.interactions.length})</h6>
            <a href="/interactions.html" class="btn btn-sm btn-outline-primary">+ Ghi nhận mới</a>
          </div>

          ${c.interactions.length === 0 ? '<div class="text-muted small py-4 text-center">Chưa có lịch sử chăm sóc nào cho khách hàng này.</div>' : `
            <div class="timeline mt-2">
              ${c.interactions.map(it => `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold"><i class="bi ${getTypeIcon(it.type)} me-1"></i>${it.type}: ${it.title}</span>
                    <span class="timeline-date">${formatDate(it.interaction_date)}</span>
                  </div>
                  <div class="small text-muted mt-1">${it.summary || ''}</div>
                  <div class="d-flex gap-2 align-items-center mt-2">
                    ${getOutcomeBadge(it.outcome)}
                    ${it.next_follow_up ? `<span class="badge bg-warning-subtle text-warning"><i class="bi bi-calendar-event me-1"></i>Hẹn: ${formatDate(it.next_follow_up)}</span>` : ''}
                    <span class="small text-muted ms-auto">Bởi: ${it.staff_name || 'Admin'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    document.getElementById('customerDetailContent').innerHTML = detailHtml;
    const modal = new bootstrap.Modal(document.getElementById('modalCustomerDetail'));
    modal.show();
  } catch (error) {
    console.error('Lỗi view customer detail:', error);
    showToast('Lỗi khi tải chi tiết khách hàng', 'danger');
  }
}

// Xóa khách hàng (Chỉ Admin)
async function deleteCustomer(id, name) {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    showToast('Từ chối! Chỉ Quản trị viên (Admin) mới có quyền xóa khách hàng khỏi hệ thống.', 'danger');
    return;
  }

  if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" không?\nMọi dữ liệu liên hệ và lịch sử tương tác liên quan sẽ bị xóa.`)) {
    return;
  }

  try {
    const res = await apiFetch(`/api/customers/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    loadCustomers();
  } catch (error) {
    showToast(error.message || 'Lỗi khi xóa khách hàng', 'danger');
  }
}

// Xử lý Form thêm khách hàng mới
document.getElementById('formAddCustomer')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await apiFetch('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    form.reset();
    const modalEl = document.getElementById('modalAddCustomer');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    loadCustomers();
  } catch (error) {
    showToast(error.message || 'Lỗi khi thêm khách hàng', 'danger');
  }
});

// Event listeners cho tìm kiếm và lọc
document.getElementById('btnFilter')?.addEventListener('click', loadCustomers);
document.getElementById('searchInput')?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') loadCustomers();
});
document.getElementById('statusFilter')?.addEventListener('change', loadCustomers);
document.getElementById('industryFilter')?.addEventListener('change', loadCustomers);
document.getElementById('btnResetFilter')?.addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('industryFilter').value = '';
  loadCustomers();
});

document.addEventListener('DOMContentLoaded', () => {
  loadCustomers();
});
