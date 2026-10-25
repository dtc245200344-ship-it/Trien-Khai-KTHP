const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const { hashPassword, comparePassword, generateToken, authMiddleware } = require('../auth');

// 1. Đăng nhập hệ thống CRM
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập và mật khẩu không được để trống.'
      });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 AND is_active = TRUE',
      [username.trim().toLowerCase()],
      'auth_login'
    );

    if (result.rows.length === 0) {
      logger.warn(`Đăng nhập thất bại: Tài khoản '${username}' không tồn tại hoặc đã bị khóa.`);
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
      });
    }

    const user = result.rows[0];
    const isPasswordValid = comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      logger.warn(`Đăng nhập thất bại: Sai mật khẩu cho tài khoản '${username}'.`);
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
      });
    }

    const token = generateToken(user);
    logger.info(`Đăng nhập thành công: User '${user.username}' (Vai trò: ${user.role})`);

    res.json({
      success: true,
      message: `Chào mừng ${user.full_name} (${user.role.toUpperCase()}) đăng nhập thành công!`,
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone
      }
    });
  } catch (error) {
    logger.error('Lỗi khi thực hiện đăng nhập:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xác thực đăng nhập' });
  }
});

// 2. Lấy thông tin tài khoản đang đăng nhập hiện tại
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, full_name, email, role, department, phone, created_at FROM users WHERE id = $1',
      [req.user.id],
      'auth_me'
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    logger.error('Lỗi khi lấy thông tin người dùng me:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// 3. Đổi mật khẩu cá nhân
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password || new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.'
      });
    }

    const userRes = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id], 'get_pwd');
    if (!comparePassword(old_password, userRes.rows[0].password_hash)) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
    }

    const newHash = hashPassword(new_password);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id], 'update_pwd');

    logger.info(`Người dùng '${req.user.username}' đã đổi mật khẩu thành công.`);
    res.json({ success: true, message: 'Đổi mật khẩu thành công.' });
  } catch (error) {
    logger.error('Lỗi khi đổi mật khẩu:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;

