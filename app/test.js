// Test script đơn giản kiểm tra cú pháp và cấu trúc các module
const assert = require('assert');

console.log('🧪 Bắt đầu kiểm tra cấu hình mã nguồn CRM App...');

try {
  const logger = require('./logger');
  assert.ok(logger, 'Logger module load thành công');
  console.log('✅ Logger module OK');

  const metrics = require('./metrics');
  assert.ok(metrics.register, 'Metrics registry OK');
  assert.ok(metrics.httpRequestCounter, 'Metrics httpRequestCounter OK');
  console.log('✅ Prometheus Metrics OK');

  const auth = require('./auth');
  const hash = auth.hashPassword('testpassword');
  assert.strictEqual(auth.comparePassword('testpassword', hash), true, 'Password compare matching');
  assert.strictEqual(auth.comparePassword('wrongpassword', hash), false, 'Password compare non-matching');
  const token = auth.generateToken({ id: 1, username: 'admin', role: 'admin' });
  const decoded = auth.verifyToken(token);
  assert.strictEqual(decoded.username, 'admin', 'Token verification OK');
  assert.strictEqual(decoded.role, 'admin', 'Token role OK');
  console.log('✅ Auth & RBAC Token module OK');

  console.log('🎉 Toàn bộ kiểm thử cơ bản đã hoàn thành xuất sắc!');
  process.exit(0);
} catch (error) {
  console.error('❌ Kiểm thử thất bại:', error);
  process.exit(1);
}

