// Logic Quản lý Người Liên Hệ
let currentContacts = [];
let allCustomersList = [];

async function loadCustomersDropdown() {
  try {
    const res = await apiFetch('/api/customers');
    const result = await res.json();
    if (result.success) {
      allCustomersList = result.data;
      const filterSelect = document.getElementById('filterCustomerSelect');
      const modalSelect = document.getElementById('modalCustomerSelect');

      const options = allCustomersList.map(c => `<option value="${c.id}">${c.company_name} (${c.customer_code})</option>`).join('');

      if (filterSelect) {
        filterSelect.innerHTML = '<option value="">-- Lọc theo công ty / khách hàng --</option>' + options;
      }
      if (modalSelect) {
        modalSelect.innerHTML = '<option value="">-- Chọn khách hàng * --</option>' + options;
      }
    }
  } catch (err) {
    console.error('Lỗi nạp dropdown khách hàng:', err);
  }
}

async function loadContacts() {
  try {
    const search = document.getElementById('searchContactInput')?.value.trim();
    const customerId = document.getElementById('filterCustomerSelect')?.value;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (customerId) params.append('customer_id', customerId);

    const res = await apiFetch(`/api/contacts?${params.toString()}`);
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    currentContacts = result.data;
    document.getElementById('contactCount').innerText = currentContacts.length;
    renderContactsTable(currentContacts);
  } catch (error) {
    console.error('Lỗi load danh bạ:', error);
    showToast('Lỗi khi tải danh bạ người liên hệ', 'danger');
  }
}

function renderContactsTable(contacts) {
  const tbody = document.getElementById('contactsTableBody');
  if (!tbody) return;

  if (contacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4"><i class="bi bi-person-x fs-3 d-block mb-2"></i>Không tìm thấy người liên hệ nào</td></tr>';
    return;
  }

  const currentUser = getCurrentUser();
  const canDelete = currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager');

  tbody.innerHTML = contacts.map(ct => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-3">
          ${getPersonAvatar(ct.name)}
          <div>
            <div class="fw-bold text-dark">${ct.name}</div>
            <div class="small text-muted font-monospace">${formatDate(ct.created_at)}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1">
          <i class="bi bi-briefcase me-1"></i>${ct.role || 'Chưa cập nhật'}
        </span>
      </td>
      <td>
        <div class="fw-semibold text-primary"><i class="bi bi-building me-1"></i>${ct.company_name}</div>
        <div class="small text-muted font-monospace">${ct.customer_code}</div>
      </td>
      <td>
        ${ct.email ? `<a href="mailto:${ct.email}" class="text-decoration-none text-dark"><i class="bi bi-envelope me-1 text-primary"></i>${ct.email}</a>` : '<span class="text-muted small">Chưa có</span>'}
      </td>
      <td>
        ${ct.phone ? `<a href="tel:${ct.phone}" class="text-decoration-none text-dark fw-semibold font-monospace"><i class="bi bi-telephone me-1 text-success"></i>${ct.phone}</a>` : '<span class="text-muted small">Chưa có</span>'}
      </td>
      <td>
        ${ct.is_primary ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"><i class="bi bi-star-fill text-warning me-1"></i>Chính</span>' : '<span class="badge bg-light text-muted border px-2 py-1">Phụ</span>'}
      </td>
      <td class="small text-muted text-truncate" style="max-width: 180px;" title="${ct.notes || ''}">${ct.notes || '-'}</td>
      <td class="text-center">
        ${canDelete ? `
          <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${ct.id}, '${ct.name}')" title="Xóa người liên hệ">
            <i class="bi bi-trash"></i>
          </button>
        ` : `
          <button class="btn btn-sm btn-outline-secondary" disabled title="Khóa: Chỉ Admin/Manager mới có quyền xóa"><i class="bi bi-lock-fill"></i></button>
        `}
      </td>
    </tr>
  `).join('');
}

function prepareAddContactModal() {
  loadCustomersDropdown();
}

// Xóa người liên hệ
async function deleteContact(id, name) {
  const user = getCurrentUser();
  if (!user || user.role === 'staff') {
    showToast('Từ chối! Nhân viên (Staff) không có quyền xóa liên hệ.', 'danger');
    return;
  }

  if (!confirm(`Bạn có chắc muốn xóa người liên hệ "${name}" không?`)) return;

  try {
    const res = await apiFetch(`/api/contacts/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    loadContacts();
  } catch (error) {
    showToast(error.message || 'Lỗi khi xóa người liên hệ', 'danger');
  }
}

// Form submit thêm liên hệ
document.getElementById('formAddContact')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.is_primary = form.is_primary.checked;

  try {
    const res = await apiFetch('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAddContact'));
    if (modal) modal.hide();
    loadContacts();
  } catch (error) {
    showToast(error.message || 'Lỗi thêm liên hệ', 'danger');
  }
});

document.getElementById('btnSearchContact')?.addEventListener('click', loadContacts);
document.getElementById('filterCustomerSelect')?.addEventListener('change', loadContacts);
document.getElementById('searchContactInput')?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') loadContacts();
});
document.getElementById('btnResetContact')?.addEventListener('click', () => {
  document.getElementById('searchContactInput').value = '';
  document.getElementById('filterCustomerSelect').value = '';
  loadContacts();
});

document.addEventListener('DOMContentLoaded', () => {
  loadCustomersDropdown();
  loadContacts();
});
