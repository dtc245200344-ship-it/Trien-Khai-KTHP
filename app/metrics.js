const client = require('prom-client');

// Khởi tạo Registry để gom toàn bộ metrics
const register = new client.Registry();

// Bổ sung các thông tin nhãn mặc định cho metrics
register.setDefaultLabels({
  app: 'crm-system',
  version: '1.0.0'
});

// Kích hoạt thu thập các metrics hệ thống mặc định (CPU, Memory, Event Loop, v.v.)
client.collectDefaultMetrics({ register, prefix: 'node_' });

// 1. Metric: Tổng số lượt gọi HTTP request
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Tổng số lượt HTTP request gửi tới hệ thống CRM',
  labelNames: ['method', 'route', 'status_code']
});

// 2. Metric: Thời gian phản hồi request (Latency Histogram)
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Thời gian xử lý HTTP request tính bằng giây',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

// 3. Metric: Tổng số khách hàng trong hệ thống (Business Metric)
const customerGauge = new client.Gauge({
  name: 'crm_customers_total',
  help: 'Tổng số lượng khách hàng hiện có trong hệ thống CRM',
  labelNames: ['status']
});

// 4. Metric: Tổng số tương tác đã thực hiện
const interactionGauge = new client.Gauge({
  name: 'crm_interactions_total',
  help: 'Tổng số lượng tương tác đã ghi nhận trong hệ thống',
  labelNames: ['type', 'outcome']
});

// 5. Metric: Thời gian thực thi truy vấn PostgreSQL
const dbQueryDuration = new client.Histogram({
  name: 'crm_db_query_duration_seconds',
  help: 'Thời gian thực thi câu lệnh SQL với PostgreSQL',
  labelNames: ['operation'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1]
});

// Đăng ký các custom metrics vào registry
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(customerGauge);
register.registerMetric(interactionGauge);
register.registerMetric(dbQueryDuration);

module.exports = {
  register,
  httpRequestCounter,
  httpRequestDuration,
  customerGauge,
  interactionGauge,
  dbQueryDuration
};

