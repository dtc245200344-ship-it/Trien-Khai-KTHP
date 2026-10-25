const crypto = require('crypto');
const logger = require('./logger');

const JWT_SECRET = process.env.JWT_SECRET || 'crm_jwt_super_secret_key_kthp_2026';
const PASSWORD_SALT = process.env.PASSWORD_SALT || 'crm_secret_salt_2026';

// 1. Mã hóa mật khẩu an toàn bằng HMAC-SHA256
function hashPassword(password) {
  return crypto.createHmac('sha256', PASSWORD_SALT).update(password).digest('hex');
}

// 2. So sánh mật khẩu
function comparePassword(password, storedHash) {
  const hash = hashPassword(password);
  return hash === storedHash;
}

// 3. Tạo Token xác thực (Stateless HMAC-SHA256 JWT Token)
function generateToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    role: user.role, // 'admin', 'manager', 'staff'
    department: user.department,
    exp: Date.now() + (24 * 60 * 60 * 1000) // Hết hạn sau 24 giờ
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

// 4. Xác thực và giải mã Token
function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSig) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && Date.now() > decoded.exp) {
      return null; // Đã hết hạn
    }
    return decoded;
  } catch (err) {
    return null;
  }
}

// 5. Middleware xác thực đăng nhập bắt buộc
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-access-token'];
  let token = null;

  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  // Hỗ trợ đọc token từ query param nếu gọi trực tiếp (ví dụ download file/export)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Yêu cầu đăng nhập. Vui lòng cung cấp mã xác thực truy cập.'
    });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc mã xác thực không hợp lệ. Vui lòng đăng nhập lại.'
    });
  }

  req.user = user;
  next();
}

// 6. Middleware phân quyền (Role-Based Access Control - RBAC)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập vào hệ thống.'
      });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : 'staff';
    const hasRole = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

    if (!hasRole) {
      logger.warn(`Truy cập bị từ chối (403): User '${req.user.username}' (vai trò: '${userRole}') cố gắng thực hiện hành động yêu cầu quyền: [${allowedRoles.join(', ')}]`);
      return res.status(403).json({
        success: false,
        message: `Từ chối truy cập! Thao tác này yêu cầu quyền [${allowedRoles.join(', ')}], nhưng tài khoản của bạn đang là [${userRole}].`
      });
    }

    next();
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authMiddleware,
  requireRole
};

