const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const { authMiddleware, requireRole, hashPassword } = require('../auth');

// Áp dụng middleware kiểm tra đăng nhập và bắt buộc quyền ADMIN cho toàn bộ route quản lý người dùng
router.use(authMiddleware);
router.use(requireRole('admin'));

// 1. Danh sách toàn bộ tài khoản người dùng & phân quyền
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, full_name, email, role, department, phone, is_active, created_at, updated_at
       FROM users 
       ORDER BY id ASC`,
      [],
      'users_list'
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    logger.error('Lỗi khi lấy danh sách người dùng:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 2. Thêm mới tài khoản người dùng và gán quyền
router.post('/', async (req, res) => {
  try {
    const { username, password, full_name, email, role, department, phone } = req.body;

    if (!username || !password || !full_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập, mật khẩu, họ tên và email là bắt buộc.'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanRole = (role || 'staff').toLowerCase();

    if (!['admin', 'manager', 'staff'].includes(cleanRole)) {
      return res.status(400).json({
        success: false,
        message: 'Vai trò không hợp lệ. Chỉ chấp nhận: admin, manager, staff.'
      });
    }

    const passwordHash = hashPassword(password);

    const sql = `
      INSERT INTO users (username, password_hash, full_name, email, role, department, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, full_name, email, role, department, phone, is_active, created_at
    `;

    const result = await db.query(
      sql,
      [cleanUsername, passwordHash, full_name, email, cleanRole, department || 'Kinh doanh', phone || ''],
      'user_create'
    );

    logger.info(`Admin '${req.user.username}' đã tạo tài khoản mới: '${cleanUsername}' với quyền '${cleanRole}'`);

    res.status(201).json({
      success: true,
      message: `Đã tạo tài khoản '${cleanUsername}' với vai trò [${cleanRole.toUpperCase()}] thành công!`,
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Tên đăng nhập hoặc email đã tồn tại trên hệ thống.' });
    }
    logger.error('Lỗi khi tạo tài khoản người dùng:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo người dùng' });
  }
});

// 3. Cập nhật phân quyền và thông tin người dùng
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role, department, phone, is_active, password } = req.body;

    // Kiểm tra tồn tại
    const checkUser = await db.query('SELECT * FROM users WHERE id = $1', [id], 'check_user');
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng để cập nhật.' });
    }

    let updatePasswordSql = '';
    const params = [
      full_name || checkUser.rows[0].full_name,
      email || checkUser.rows[0].email,
      role ? role.toLowerCase() : checkUser.rows[0].role,
      department !== undefined ? department : checkUser.rows[0].department,
      phone !== undefined ? phone : checkUser.rows[0].phone,
      is_active !== undefined ? is_active : checkUser.rows[0].is_active,
      id
    ];

    if (password && password.trim().length >= 6) {
      params.push(hashPassword(password.trim()));
      updatePasswordSql = `, password_hash = $${params.length}`;
    }

    const sql = `
      UPDATE users 
      SET full_name = $1,
          email = $2,
          role = $3,
          department = $4,
          phone = $5,
          is_active = $6
          ${updatePasswordSql}
      WHERE id = $7
      RETURNING id, username, full_name, email, role, department, phone, is_active, updated_at
    `;

    const result = await db.query(sql, params, 'user_update');
    logger.info(`Admin '${req.user.username}' đã cập nhật thông tin/quyền cho user #${id} (${result.rows[0].username})`);

    res.json({
      success: true,
      message: `Cập nhật thông tin và quyền hạn người dùng thành công!`,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật người dùng #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật thông tin người dùng' });
  }
});

// 4. Xóa người dùng (Không cho phép tự xóa chính mình)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === parseInt(req.user.id, 10)) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể tự xóa tài khoản của chính mình!'
      });
    }

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING username, full_name', [id], 'user_delete');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    logger.warn(`Admin '${req.user.username}' đã xóa tài khoản '${result.rows[0].username}'`);
    res.json({
      success: true,
      message: `Đã xóa tài khoản '${result.rows[0].username}' thành công!`
    });
  } catch (error) {
    logger.error(`Lỗi khi xóa người dùng #${req.params.id}:`, { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa người dùng' });
  }
});

module.exports = router;

