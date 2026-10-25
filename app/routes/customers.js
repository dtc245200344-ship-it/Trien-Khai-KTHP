const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const { customerGauge } = require('../metrics');
const { authMiddleware, requireRole } = require('../auth');

// Cập nhật lại số liệu cho Prometheus Gauge
async function syncCustomerMetrics() {
  try {
    const res = await db.query('SELECT status, COUNT(*) as count FROM customers GROUP BY status', [], 'metrics_sync');
    res.rows.forEach(row => {
      customerGauge.set({ status: row.status }, parseInt(row.count, 10));
    });
  } catch (err) {
    // Bỏ qua nếu lỗi metric
  }
}

// 1. Lấy danh sách khách hàng (hỗ trợ tìm kiếm và lọc trạng thái)
router.get('/', async (req, res) => {
  try {
    const { search, status, industry } = req.query;
    let sql = `
      SELECT c.*, 
             COUNT(DISTINCT ct.id) AS total_contacts,
             COUNT(DISTINCT it.id) AS total_interactions
      FROM customers c
      LEFT JOIN contacts ct ON c.id = ct.customer_id
      LEFT JOIN interactions it ON c.id = it.customer_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (c.company_name ILIKE $${params.length} OR c.contact_name ILIKE $${params.length} OR c.customer_code ILIKE $${params.length} OR c.email ILIKE $${params.length} OR c.phone ILIKE $${params.length})`;
    }

    if (status) {
      params.push(status);
      sql += ` AND c.status = $${params.length}`;
    }

    if (industry) {
      params.push(industry);
      sql += ` AND c.industry = $${params.length}`;
    }

    sql += ` GROUP BY c.id ORDER BY c.created_at DESC`;

    const result = await db.query(sql, params, 'customers_list');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    logger.error('Lỗi khi lấy danh sách khách hàng:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu khách hàng' });
  }
});

// 2. Lấy thông tin chi tiết một khách hàng kèm người liên hệ và lịch sử tương tác
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customerRes = await db.query('SELECT * FROM customers WHERE id = $1', [id], 'customer_detail');
    if (customerRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
    }

    const contactsRes = await db.query(
      'SELECT * FROM contacts WHERE customer_id = $1 ORDER BY is_primary DESC, id ASC',
      [id],
      'customer_contacts'
    );

    const interactionsRes = await db.query(
      `SELECT it.*, ct.name AS contact_person_name 
       FROM interactions it
       LEFT JOIN contacts ct ON it.contact_id = ct.id
       WHERE it.customer_id = $1 
       ORDER BY it.interaction_date DESC`,
      [id],
      'customer_interactions'
    );

    res.json({
      success: true,
      data: {
        ...customerRes.rows[0],
        contacts: contactsRes.rows,
        interactions: interactionsRes.rows
      }
    });
  } catch (error) {
    logger.error(`Lỗi khi lấy chi tiết khách hàng #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 3. Thêm mới khách hàng (Admin, Manager, Staff)
router.post('/', authMiddleware, requireRole('admin', 'manager', 'staff'), async (req, res) => {
  try {
    let {
      customer_code,
      company_name,
      contact_name,
      email,
      phone,
      address,
      industry,
      status,
      notes,
      total_spent
    } = req.body;

    if (!contact_name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Tên người liên hệ, Email và Số điện thoại là bắt buộc'
      });
    }

    // Tự sinh mã khách hàng nếu không truyền
    if (!customer_code || customer_code.trim() === '') {
      const countRes = await db.query('SELECT COUNT(*) FROM customers', [], 'customer_count');
      const nextNum = parseInt(countRes.rows[0].count, 10) + 1;
      customer_code = `KH-2026-${String(nextNum).padStart(3, '0')}`;
    }

    const sql = `
      INSERT INTO customers 
      (customer_code, company_name, contact_name, email, phone, address, industry, status, notes, total_spent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      customer_code,
      company_name || contact_name,
      contact_name,
      email,
      phone,
      address || '',
      industry || 'Khác',
      status || 'Tiềm năng',
      notes || '',
      total_spent || 0
    ];

    const result = await db.query(sql, values, 'customer_create');
    const newCustomer = result.rows[0];

    // Tạo luôn liên hệ chính
    await db.query(
      `INSERT INTO contacts (customer_id, name, role, email, phone, is_primary, notes)
       VALUES ($1, $2, 'Liên hệ chính', $3, $4, TRUE, 'Tự động tạo từ thông tin khách hàng')`,
      [newCustomer.id, contact_name, email, phone],
      'contact_create_primary'
    );

    logger.info(`Đã tạo mới khách hàng: ${customer_code} - ${company_name}`, {
      customerId: newCustomer.id,
      customer_code
    });

    syncCustomerMetrics();

    res.status(201).json({
      success: true,
      message: 'Tạo khách hàng mới thành công',
      data: newCustomer
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Mã khách hàng hoặc Email đã tồn tại' });
    }
    logger.error('Lỗi khi thêm mới khách hàng:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo khách hàng' });
  }
});

// 4. Cập nhật khách hàng (Admin & Manager)
router.put('/:id', authMiddleware, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_name,
      contact_name,
      email,
      phone,
      address,
      industry,
      status,
      notes,
      total_spent
    } = req.body;

    const sql = `
      UPDATE customers
      SET company_name = COALESCE($1, company_name),
          contact_name = COALESCE($2, contact_name),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          address = COALESCE($5, address),
          industry = COALESCE($6, industry),
          status = COALESCE($7, status),
          notes = COALESCE($8, notes),
          total_spent = COALESCE($9, total_spent)
      WHERE id = $10
      RETURNING *
    `;

    const values = [
      company_name,
      contact_name,
      email,
      phone,
      address,
      industry,
      status,
      notes,
      total_spent,
      id
    ];

    const result = await db.query(sql, values, 'customer_update');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để cập nhật' });
    }

    logger.info(`Đã cập nhật khách hàng ID: ${id}`);
    syncCustomerMetrics();

    res.json({
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error(`Lỗi khi cập nhật khách hàng #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật khách hàng' });
  }
});

// 5. Xóa khách hàng (Chỉ Admin mới có quyền thực hiện)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM customers WHERE id = $1 RETURNING customer_code, company_name', [id], 'customer_delete');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để xóa' });
    }

    logger.warn(`Đã xóa khách hàng: ${result.rows[0].customer_code} (${result.rows[0].company_name})`, { customerId: id });
    syncCustomerMetrics();

    res.json({
      success: true,
      message: `Đã xóa khách hàng ${result.rows[0].company_name} thành công`
    });
  } catch (error) {
    logger.error(`Lỗi khi xóa khách hàng #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa khách hàng' });
  }
});

module.exports = router;

