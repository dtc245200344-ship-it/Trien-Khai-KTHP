const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const { interactionGauge } = require('../metrics');
const { authMiddleware, requireRole } = require('../auth');

// Đồng bộ metric tương tác sang Prometheus
async function syncInteractionMetrics() {
  try {
    const res = await db.query(
      'SELECT type, outcome, COUNT(*) as count FROM interactions GROUP BY type, outcome',
      [],
      'sync_interactions_metrics'
    );
    res.rows.forEach(r => {
      interactionGauge.set({ type: r.type, outcome: r.outcome }, parseInt(r.count, 10));
    });
  } catch (err) {
    // Bỏ qua nếu lỗi sync
  }
}

// 1. Danh sách lịch sử tương tác kèm tên khách hàng và người liên hệ
router.get('/', async (req, res) => {
  try {
    const { customer_id, type, outcome, search, limit } = req.query;
    let sql = `
      SELECT it.*, 
             c.company_name, c.customer_code,
             ct.name AS contact_name, ct.phone AS contact_phone
      FROM interactions it
      JOIN customers c ON it.customer_id = c.id
      LEFT JOIN contacts ct ON it.contact_id = ct.id
      WHERE 1=1
    `;
    const params = [];

    if (customer_id) {
      params.push(customer_id);
      sql += ` AND it.customer_id = $${params.length}`;
    }

    if (type) {
      params.push(type);
      sql += ` AND it.type = $${params.length}`;
    }

    if (outcome) {
      params.push(outcome);
      sql += ` AND it.outcome = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (it.title ILIKE $${params.length} OR it.summary ILIKE $${params.length} OR c.company_name ILIKE $${params.length} OR it.staff_name ILIKE $${params.length})`;
    }

    sql += ` ORDER BY it.interaction_date DESC`;

    if (limit) {
      params.push(parseInt(limit, 10));
      sql += ` LIMIT $${params.length}`;
    }

    const result = await db.query(sql, params, 'interactions_list');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    logger.error('Lỗi khi lấy lịch sử tương tác:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 2. Thêm mới bản ghi tương tác chăm sóc khách hàng (Admin, Manager, Staff)
router.post('/', authMiddleware, requireRole('admin', 'manager', 'staff'), async (req, res) => {
  try {
    const {
      customer_id,
      contact_id,
      type,
      direction,
      title,
      summary,
      outcome,
      interaction_date,
      next_follow_up,
      staff_name
    } = req.body;

    if (!customer_id || !title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Khách hàng, Tiêu đề và Hình thức tương tác là bắt buộc'
      });
    }

    const sql = `
      INSERT INTO interactions 
      (customer_id, contact_id, type, direction, title, summary, outcome, interaction_date, next_follow_up, staff_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, CURRENT_TIMESTAMP), $9, $10)
      RETURNING *
    `;

    const values = [
      customer_id,
      contact_id || null,
      type,
      direction || 'Chiều đi',
      title,
      summary || '',
      outcome || 'Đang xử lý',
      interaction_date || null,
      next_follow_up || null,
      staff_name || 'Quản trị viên'
    ];

    const result = await db.query(sql, values, 'interaction_create');

    logger.info(`Đã lưu tương tác mới [${type}]: ${title} cho khách hàng #${customer_id}`);
    syncInteractionMetrics();

    res.status(201).json({
      success: true,
      message: 'Ghi nhận lịch sử tương tác thành công',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Lỗi khi thêm mới tương tác:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo tương tác' });
  }
});

// 3. Cập nhật tương tác (Admin, Manager, Staff)
router.put('/:id', authMiddleware, requireRole('admin', 'manager', 'staff'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      direction,
      title,
      summary,
      outcome,
      interaction_date,
      next_follow_up,
      staff_name
    } = req.body;

    const sql = `
      UPDATE interactions
      SET type = COALESCE($1, type),
          direction = COALESCE($2, direction),
          title = COALESCE($3, title),
          summary = COALESCE($4, summary),
          outcome = COALESCE($5, outcome),
          interaction_date = COALESCE($6, interaction_date),
          next_follow_up = $7,
          staff_name = COALESCE($8, staff_name)
      WHERE id = $9
      RETURNING *
    `;

    const result = await db.query(
      sql,
      [type, direction, title, summary, outcome, interaction_date, next_follow_up, staff_name, id],
      'interaction_update'
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi tương tác' });
    }

    syncInteractionMetrics();
    res.json({ success: true, message: 'Cập nhật tương tác thành công', data: result.rows[0] });
  } catch (error) {
    logger.error(`Lỗi cập nhật tương tác #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 4. Xóa tương tác (Chỉ Admin & Manager)
router.delete('/:id', authMiddleware, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM interactions WHERE id = $1 RETURNING title', [id], 'interaction_delete');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi tương tác' });
    }

    logger.info(`Đã xóa tương tác: ${result.rows[0].title}`);
    syncInteractionMetrics();
    res.json({ success: true, message: 'Xóa lịch sử tương tác thành công' });
  } catch (error) {
    logger.error(`Lỗi khi xóa tương tác #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;

