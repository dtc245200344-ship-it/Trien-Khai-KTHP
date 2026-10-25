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

  console.log('🎉 Toàn bộ kiểm thử cơ bản đã hoàn thành xuất sắc!');
  process.exit(0);
} catch (error) {
  console.error('❌ Kiểm thử thất bại:', error);
  process.exit(1);
}
