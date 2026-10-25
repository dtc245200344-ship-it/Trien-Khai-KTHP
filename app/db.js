const { Pool } = require('pg');
const logger = require('./logger');
const { dbQueryDuration } = require('./metrics');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'crm_db',
  user: process.env.DB_USER || 'crm_user',
  password: process.env.DB_PASSWORD || 'crm_secret_pass_2026',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  logger.info('Kết nối thành công tới cơ sở dữ liệu PostgreSQL');
});

pool.on('error', (err) => {
  logger.error('Lỗi kết nối cơ sở dữ liệu PostgreSQL:', { error: err.message, stack: err.stack });
});

// Hàm helper thực thi truy vấn kèm đo thời gian cho Prometheus
async function query(text, params = [], operation = 'query') {
  const start = process.hrtime();
  try {
    const res = await pool.query(text, params);
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    dbQueryDuration.observe({ operation }, durationInSeconds);
    return res;
  } catch (error) {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    dbQueryDuration.observe({ operation: `${operation}_error` }, durationInSeconds);
    logger.error(`Lỗi thực thi SQL [${operation}]:`, {
      query: text,
      params,
      error: error.message
    });
    throw error;
  }
}

// Kiểm tra sức khỏe kết nối DB
async function checkHealth() {
  try {
    const result = await pool.query('SELECT 1 as healthy');
    return result.rows.length > 0 && result.rows[0].healthy === 1;
  } catch (error) {
    logger.error('Healthcheck DB thất bại:', { error: error.message });
    return false;
  }
}

module.exports = {
  pool,
  query,
  checkHealth
};
