// Logic Quản Lý Người Dùng & Phân Quyền (RBAC)
let allUsers = [];

async function loadUsers() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Từ chối truy cập! Trang này chỉ dành riêng cho Quản trị viên (Admin).', 'danger');
    setTimeout(() => { window.location.href = '/'; }, 1500);
    return;
  }

  try {
    const res = await apiFetch('/api/users');
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    allUsers = result.data;
    document.getElementById('userCount').innerText = allUsers.length;
    renderUsersTable(allUsers);
  } catch (error) {
    console.error('Lỗi load danh sách người dùng:', error);
    showToast(error.message || 'Lỗi khi tải danh sách người dùng', 'danger');
  }
}

function getRoleBadge(role) {
  switch (role) {
    case 'admin':
      return '<span class="badge bg-danger shadow-sm"><i class="bi bi-shield-shaded me-1"></i>ADMIN</span>';
    case 'manager':
      return '<span class="badge text-white shadow-sm" style="background-color: #9333ea;"><i class="bi bi-person-gear me-1"></i>MANAGER</span>';
    case 'staff':
    default:
      return '<span class="badge bg-primary shadow-sm"><i class="bi bi-person me-1"></i>STAFF</span>';
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-4">Chưa có người dùng nào</td></tr>';
    return;
  }

  const currentUser = getCurrentUser();

  tbody.innerHTML = users.map(u => `
    <tr>
      <td class="text-muted fw-bold font-monospace">#${u.id}</td>
      <td>
        <div class="fw-bold text-dark font-monospace">${u.username}</div>
      </td>
      <td>
        <div class="d-flex align-items-center gap-3">
          ${getPersonAvatar(u.full_name)}
          <div>
            <div class="fw-bold text-dark">${u.full_name}</div>
            <div class="small text-muted font-monospace">${u.email}</div>
          </div>
        </div>
      </td>
      <td>
        ${u.phone ? `<div class="text-dark"><i class="bi bi-telephone me-1 text-success"></i>${u.phone}</div>` : '<span class="text-muted small">Chưa có SĐT</span>'}
      </td>
      <td>
        <span class="badge bg-light text-dark border px-2 py-1"><i class="bi bi-building me-1"></i>${u.department || 'Chưa phân bổ'}</span>
      </td>
      <td>
        ${getRoleBadge(u.role)}
      </td>
      <td>
        ${u.is_active ? 
          '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="bi bi-check-circle-fill me-1"></i>Hoạt động</span>' : 
          '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"><i class="bi bi-slash-circle me-1"></i>Bị khóa</span>'
        }
      </td>
      <td class="small text-muted font-monospace">${formatDate(u.created_at)}</td>
      <td class="text-center">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="openEditUserModal(${u.id})" title="Chỉnh sửa quyền & thông tin">
            <i class="bi bi-pencil-square"></i> Sửa
          </button>
          ${currentUser && currentUser.id === u.id ? 
            `<button class="btn btn-outline-secondary" disabled title="Không thể xóa chính mình"><i class="bi bi-shield-lock"></i></button>` : 
            `<button class="btn btn-outline-danger" onclick="deleteUser(${u.id}, '${u.username}')" title="Xóa tài khoản"><i class="bi bi-trash"></i></button>`
          }
        </div>
      </td>
    </tr>
  `).join('');
}

function openEditUserModal(id) {
  const user = allUsers.find(u => u.id === id);
  if (!user) return;

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUsername').value = user.username;
  document.getElementById('editFullName').value = user.full_name;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editRole').value = user.role;
  document.getElementById('editDepartment').value = user.department || '';
  document.getElementById('editPhone').value = user.phone || '';
  document.getElementById('editIsActive').value = user.is_active ? 'true' : 'false';

  const modal = new bootstrap.Modal(document.getElementById('modalEditUser'));
  modal.show();
}

async function deleteUser(id, username) {
  if (!confirm(`Bạn có chắc muốn xóa tài khoản "${username}" không?`)) return;

  try {
    const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    loadUsers();
  } catch (error) {
    showToast(error.message || 'Lỗi khi xóa người dùng', 'danger');
  }
}

// Form Thêm Người Dùng
document.getElementById('formAddUser')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await apiFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAddUser'));
    if (modal) modal.hide();
    loadUsers();
  } catch (error) {
    showToast(error.message || 'Lỗi thêm người dùng', 'danger');
  }
});

// Form Sửa Người Dùng
document.getElementById('formEditUser')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.is_active = (data.is_active === 'true');

  const id = data.id;

  try {
    const res = await apiFetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditUser'));
    if (modal) modal.hide();
    loadUsers();
  } catch (error) {
    showToast(error.message || 'Lỗi cập nhật người dùng', 'danger');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});

