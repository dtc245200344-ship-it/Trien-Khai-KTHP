const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const logger = require('./logger');
const db = require('./db');
const {
  register,
  httpRequestCounter,
  httpRequestDuration
} = require('./metrics');

const customerRoutes = require('./routes/customers');
const contactRoutes = require('./routes/contacts');
const interactionRoutes = require('./routes/interactions');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3000;

// ====================================================================
// 1. CẤU HÌNH BẢO MẬT & MIDDLEWARES
// ====================================================================
app.use(
  helmet({
    contentSecurityPolicy: false, // Để CDN Bootstrap, Icons, Chart.js hoạt động trơn tru
    crossOriginEmbedderPolicy: false
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware theo dõi metrics & logging cho từng HTTP request
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    const route = req.baseUrl || req.path || 'unknown';

    // Bỏ qua log và metric của endpoint nội bộ để tránh nhiễu
    if (req.path !== '/metrics' && req.path !== '/health') {
      httpRequestCounter.inc({
        method: req.method,
        route: route,
        status_code: res.statusCode
      });

      httpRequestDuration.observe(
        {
          method: req.method,
          route: route,
          status_code: res.statusCode
        },
        durationInSeconds
      );

      logger.info('HTTP Request', {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration_ms: Math.round(durationInSeconds * 1000),
        ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });
    }
  });
  next();
});

// Phục vụ giao diện người dùng tĩnh (Static Web UI)
app.use(express.static(path.join(__dirname, 'public')));

// ====================================================================
// 2. ENDPOINTS GIÁM SÁT (OBSERVABILITY & HEALTHCHECK)
// ====================================================================

// Endpoint dành riêng cho Prometheus Scrape
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    logger.error('Lỗi khi xuất Prometheus metrics:', { error: err.message });
    res.status(500).end(err);
  }
});

// Endpoint kiểm tra sức khỏe hệ thống (Container Healthcheck)
app.get('/health', async (req, res) => {
  const isDbHealthy = await db.checkHealth();
  const healthData = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: isDbHealthy ? 'UP' : 'DEGRADED',
    services: {
      app: 'UP',
      database: isDbHealthy ? 'UP' : 'DOWN'
    }
  };

  const statusCode = isDbHealthy ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// ====================================================================
// 3. API ROUTING
// ====================================================================
app.use('/api/customers', customerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/stats', statsRoutes);

// Fallback routing cho giao diện SPA hoặc 404
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    return;
  }
  res.status(404).json({ success: false, message: 'API Endpoint không tồn tại' });
});

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  logger.error('Lỗi hệ thống chưa bắt (Unhandled Error):', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi nội bộ máy chủ',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ====================================================================
// 4. KHỞI ĐỘNG MÁY CHỦ
// ====================================================================
const server = app.listen(PORT, () => {
  logger.info(`🚀 Hệ thống CRM đang hoạt động trên cổng ${PORT}`);
  logger.info(`📊 Prometheus Metrics sẵn sàng tại: http://localhost:${PORT}/metrics`);
  logger.info(`💓 Healthcheck sẵn sàng tại: http://localhost:${PORT}/health`);
});

// Graceful Shutdown bảo toàn kết nối
const gracefulShutdown = () => {
  logger.info('Nhận tín hiệu dừng, đang đóng các kết nối an toàn...');
  server.close(() => {
    logger.info('Đã dừng HTTP Server.');
    db.pool.end(() => {
      logger.info('Đã đóng kết nối cơ sở dữ liệu PostgreSQL.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
