// Dashboard Charts & Data Handling
let chartStatusInstance = null;
let chartTypeInstance = null;
let chartIndustryInstance = null;

async function loadDashboardData() {
  const user = getCurrentUser();
  if (user && document.getElementById('heroUserName')) {
    document.getElementById('heroUserName').innerText = user.full_name;
  }

  try {
    const res = await apiFetch('/api/stats/overview');
    if (!res.ok) throw new Error('Không thể tải dữ liệu thống kê');
    const data = await res.json();

    // 1. Cập nhật thẻ KPI
    document.getElementById('statTotalCustomers').innerText = data.summary.total_customers || 0;
    document.getElementById('statTotalContacts').innerText = data.summary.total_contacts || 0;
    document.getElementById('statTotalInteractions').innerText = data.summary.total_interactions || 0;
    document.getElementById('statTotalSpent').innerText = formatMoney(data.summary.total_spent || 0);

    // 2. Render Biểu đồ Trạng thái (Doughnut)
    renderStatusChart(data.byStatus);

    // 3. Render Biểu đồ Hình thức Tương tác (Bar)
    renderTypeChart(data.byType);

    // 4. Render Biểu đồ Ngành nghề (Bar ngang)
    renderIndustryChart(data.byIndustry);

    // 5. Render Bảng Hoạt động Gần nhất
    renderRecentInteractions(data.recentInteractions);

    // 6. Render Danh sách Lịch hẹn
    renderUpcomingFollowUps(data.upcomingFollowUps);

  } catch (error) {
    console.error('Lỗi load dashboard:', error);
    showToast('Lỗi khi tải dữ liệu bảng điều khiển', 'danger');
  }
}

function renderStatusChart(statusData) {
  const ctx = document.getElementById('chartStatus');
  if (!ctx) return;

  const labels = statusData.map(d => d.status);
  const counts = statusData.map(d => parseInt(d.count, 10));

  const colors = [
    '#3b82f6', // Tiềm năng
    '#10b981', // Khách hàng thân thiết
    '#8b5cf6', // Đang tư vấn
    '#06b6d4', // Mới tiếp cận
    '#ef4444'  // Ngừng chăm sóc
  ];

  if (chartStatusInstance) chartStatusInstance.destroy();
  chartStatusInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
      }
    }
  });
}

function renderTypeChart(typeData) {
  const ctx = document.getElementById('chartType');
  if (!ctx) return;

  const labels = typeData.map(d => d.type);
  const counts = typeData.map(d => parseInt(d.count, 10));

  if (chartTypeInstance) chartTypeInstance.destroy();
  chartTypeInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Số lượt',
        data: counts,
        backgroundColor: '#10b981',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
        x: { ticks: { font: { size: 10 } } }
      }
    }
  });
}

function renderIndustryChart(industryData) {
  const ctx = document.getElementById('chartIndustry');
  if (!ctx) return;

  const labels = industryData.map(d => d.industry);
  const counts = industryData.map(d => parseInt(d.count, 10));

  if (chartIndustryInstance) chartIndustryInstance.destroy();
  chartIndustryInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Khách hàng',
        data: counts,
        backgroundColor: '#8b5cf6',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

function renderRecentInteractions(items) {
  const tbody = document.getElementById('recentInteractionsTable');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Chưa có tương tác nào</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(it => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          ${getCompanyAvatar(it.company_name)}
          <div>
            <div class="fw-bold text-dark">${it.company_name}</div>
            <div class="small text-muted"><i class="bi bi-person me-1"></i>${it.contact_person || 'N/A'}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge bg-light text-dark border px-2 py-1">
          <i class="bi ${getTypeIcon(it.type)} me-1"></i>${it.type}
        </span>
      </td>
      <td>
        <div class="fw-semibold text-dark text-truncate" style="max-width: 220px;">${it.title}</div>
        <div class="small text-muted text-truncate" style="max-width: 220px;" title="${it.summary || ''}">${it.summary || '-'}</div>
      </td>
      <td>${getOutcomeBadge(it.outcome)}</td>
      <td class="small text-muted font-monospace">${formatDate(it.interaction_date)}</td>
    </tr>
  `).join('');
}

function renderUpcomingFollowUps(items) {
  const container = document.getElementById('upcomingFollowUpsList');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = '<div class="text-center text-muted py-4"><i class="bi bi-calendar-check fs-2 d-block mb-2 text-success"></i>Không có lịch hẹn cần xử lý ngay</div>';
    return;
  }

  container.innerHTML = items.map(it => `
    <div class="d-flex align-items-center gap-3 p-3 mb-2 rounded-3 bg-white border shadow-sm">
      <div class="stat-icon amber flex-shrink-0" style="width: 44px; height: 44px; font-size: 1.2rem;">
        <i class="bi bi-calendar-event"></i>
      </div>
      <div class="flex-grow-1 overflow-hidden">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <div class="fw-bold text-dark text-truncate">${it.company_name}</div>
          <span class="badge bg-warning-subtle text-warning border border-warning-subtle small font-monospace">${formatDate(it.next_follow_up)}</span>
        </div>
        <div class="small text-muted text-truncate fw-medium">${it.title}</div>
        <div class="small text-primary mt-1">
          <i class="bi bi-person-fill me-1"></i>${it.contact_person || 'Liên hệ'} 
          ${it.contact_phone ? `<span class="text-muted">(${it.contact_phone})</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
});

