// Logic Quản lý Lịch Sử Tương Tác
let currentInteractions = [];

async function loadInteractionsDropdowns() {
  try {
    const res = await fetch('/api/customers');
    const result = await res.json();
    if (result.success) {
      const select = document.getElementById('modalCustomerSelect');
      if (select) {
        select.innerHTML = '<option value="">-- Chọn khách hàng * --</option>' +
          result.data.map(c => `<option value="${c.id}">${c.company_name} (${c.customer_code})</option>`).join('');
      }
    }
  } catch (err) {
    console.error('Lỗi dropdown khách hàng:', err);
  }
}

async function loadContactsForSelectedCustomer(customerId) {
  const contactSelect = document.getElementById('modalContactSelect');
  if (!contactSelect) return;

  if (!customerId) {
    contactSelect.innerHTML = '<option value="">-- Chung (không chỉ định) --</option>';
    return;
  }

  try {
    const res = await fetch(`/api/contacts?customer_id=${customerId}`);
    const result = await res.json();
    if (result.success) {
      contactSelect.innerHTML = '<option value="">-- Chung (không chỉ định) --</option>' +
        result.data.map(ct => `<option value="${ct.id}">${ct.name} (${ct.role || 'Liên hệ'})</option>`).join('');
    }
  } catch (err) {
    console.error('Lỗi load contacts theo customer:', err);
  }
}

async function loadInteractions() {
  try {
    const search = document.getElementById('searchInteractionInput')?.value.trim();
    const type = document.getElementById('filterTypeSelect')?.value;
    const outcome = document.getElementById('filterOutcomeSelect')?.value;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (outcome) params.append('outcome', outcome);

    const res = await fetch(`/api/interactions?${params.toString()}`);
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    currentInteractions = result.data;
    document.getElementById('interactionCount').innerText = currentInteractions.length;
    renderInteractionsTable(currentInteractions);
  } catch (error) {
    console.error('Lỗi load tương tác:', error);
    showToast('Lỗi khi tải nhật ký tương tác', 'danger');
  }
}

function renderInteractionsTable(items) {
  const tbody = document.getElementById('interactionsTableBody');
  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4"><i class="bi bi-chat-square-dots fs-3 d-block mb-2"></i>Không tìm thấy lịch sử tương tác nào</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(it => `
    <tr>
      <td class="small text-muted font-monospace">${formatDate(it.interaction_date)}</td>
      <td>
        <div class="fw-bold text-primary">${it.company_name}</div>
        <div class="small text-muted">${it.contact_name ? `<i class="bi bi-person me-1"></i>${it.contact_name}` : 'Liên hệ chung'}</div>
      </td>
      <td>
        <span class="badge bg-light text-dark border">
          <i class="bi ${getTypeIcon(it.type)} me-1"></i>${it.type}
        </span>
        <div class="small text-muted">${it.direction || ''}</div>
      </td>
      <td>
        <div class="fw-semibold text-dark">${it.title}</div>
        <div class="small text-muted text-truncate" style="max-width: 280px;" title="${it.summary || ''}">${it.summary || '-'}</div>
      </td>
      <td>${getOutcomeBadge(it.outcome)}</td>
      <td>
        ${it.next_follow_up ? `
          <span class="badge bg-warning-subtle text-warning border border-warning-subtle">
            <i class="bi bi-calendar2-check me-1"></i>${formatDate(it.next_follow_up)}
          </span>
        ` : '<span class="text-muted small">Không</span>'}
      </td>
      <td class="small fw-medium">${it.staff_name || 'Admin'}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-danger" onclick="deleteInteraction(${it.id}, '${it.title}')" title="Xóa">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function prepareAddInteractionModal() {
  loadInteractionsDropdowns();
}

async function deleteInteraction(id, title) {
  if (!confirm(`Bạn có chắc muốn xóa bản ghi tương tác "${title}" không?`)) return;

  try {
    const res = await fetch(`/api/interactions/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    loadInteractions();
  } catch (error) {
    showToast(error.message || 'Lỗi khi xóa tương tác', 'danger');
  }
}

document.getElementById('formAddInteraction')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAddInteraction'));
    if (modal) modal.hide();
    loadInteractions();
  } catch (error) {
    showToast(error.message || 'Lỗi khi lưu tương tác', 'danger');
  }
});

document.getElementById('btnFilterInteractions')?.addEventListener('click', loadInteractions);
document.getElementById('filterTypeSelect')?.addEventListener('change', loadInteractions);
document.getElementById('filterOutcomeSelect')?.addEventListener('change', loadInteractions);
document.getElementById('searchInteractionInput')?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') loadInteractions();
});
document.getElementById('btnResetInteractions')?.addEventListener('click', () => {
  document.getElementById('searchInteractionInput').value = '';
  document.getElementById('filterTypeSelect').value = '';
  document.getElementById('filterOutcomeSelect').value = '';
  loadInteractions();
});

document.addEventListener('DOMContentLoaded', () => {
  loadInteractionsDropdowns();
  loadInteractions();
});
