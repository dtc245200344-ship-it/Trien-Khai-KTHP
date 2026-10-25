const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');

// 1. Danh sách người liên hệ kèm tên công ty
router.get('/', async (req, res) => {
  try {
    const { customer_id, search } = req.query;
    let sql = `
      SELECT ct.*, c.company_name, c.customer_code
      FROM contacts ct
      JOIN customers c ON ct.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (customer_id) {
      params.push(customer_id);
      sql += ` AND ct.customer_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (ct.name ILIKE $${params.length} OR ct.email ILIKE $${params.length} OR ct.phone ILIKE $${params.length} OR ct.role ILIKE $${params.length} OR c.company_name ILIKE $${params.length})`;
    }

    sql += ` ORDER BY ct.is_primary DESC, ct.created_at DESC`;

    const result = await db.query(sql, params, 'contacts_list');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    logger.error('Lỗi khi lấy danh bạ người liên hệ:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 2. Thêm mới người liên hệ
router.post('/', async (req, res) => {
  try {
    const { customer_id, name, role, email, phone, is_primary, notes } = req.body;

    if (!customer_id || !name) {
      return res.status(400).json({ success: false, message: 'Khách hàng và Tên người liên hệ là bắt buộc' });
    }

    // Nếu người này là primary, hạ primary của người khác trong cùng khách hàng
    if (is_primary) {
      await db.query('UPDATE contacts SET is_primary = FALSE WHERE customer_id = $1', [customer_id], 'unset_primary');
    }

    const sql = `
      INSERT INTO contacts (customer_id, name, role, email, phone, is_primary, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [customer_id, name, role || 'Nhân viên', email || '', phone || '', is_primary || false, notes || ''];
    const result = await db.query(sql, values, 'contact_create');

    logger.info(`Đã thêm người liên hệ: ${name} cho khách hàng #${customer_id}`);
    res.status(201).json({ success: true, message: 'Thêm người liên hệ thành công', data: result.rows[0] });
  } catch (error) {
    logger.error('Lỗi khi thêm người liên hệ:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm liên hệ' });
  }
});

// 3. Cập nhật người liên hệ
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone, is_primary, notes } = req.body;

    if (is_primary) {
      const cur = await db.query('SELECT customer_id FROM contacts WHERE id = $1', [id], 'get_contact_customer');
      if (cur.rows.length > 0) {
        await db.query('UPDATE contacts SET is_primary = FALSE WHERE customer_id = $1', [cur.rows[0].customer_id], 'unset_primary');
      }
    }

    const sql = `
      UPDATE contacts
      SET name = COALESCE($1, name),
          role = COALESCE($2, role),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          is_primary = COALESCE($5, is_primary),
          notes = COALESCE($6, notes)
      WHERE id = $7
      RETURNING *
    `;
    const result = await db.query(sql, [name, role, email, phone, is_primary, notes, id], 'contact_update');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người liên hệ' });
    }

    res.json({ success: true, message: 'Cập nhật thông tin liên hệ thành công', data: result.rows[0] });
  } catch (error) {
    logger.error(`Lỗi khi cập nhật liên hệ #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 4. Xóa người liên hệ
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM contacts WHERE id = $1 RETURNING name', [id], 'contact_delete');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người liên hệ để xóa' });
    }
    logger.info(`Đã xóa liên hệ: ${result.rows[0].name}`);
    res.json({ success: true, message: 'Xóa người liên hệ thành công' });
  } catch (error) {
    logger.error(`Lỗi khi xóa liên hệ #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;
