const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const { customerGauge, interactionGauge } = require('../metrics');

router.get('/overview', async (req, res) => {
  try {
    // 1. Tổng quan số lượng
    const countsPromise = db.query(`
      SELECT 
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM contacts) AS total_contacts,
        (SELECT COUNT(*) FROM interactions) AS total_interactions,
        (SELECT COALESCE(SUM(total_spent), 0) FROM customers) AS total_spent
    `, [], 'stats_counts');

    // 2. Khách hàng theo trạng thái
    const statusPromise = db.query(`
      SELECT status, COUNT(*) AS count
      FROM customers
      GROUP BY status
      ORDER BY count DESC
    `, [], 'stats_by_status');

    // 3. Khách hàng theo lĩnh vực kinh doanh
    const industryPromise = db.query(`
      SELECT industry, COUNT(*) AS count
      FROM customers
      GROUP BY industry
      ORDER BY count DESC
    `, [], 'stats_by_industry');

    // 4. Tương tác theo hình thức
    const typePromise = db.query(`
      SELECT type, COUNT(*) AS count
      FROM interactions
      GROUP BY type
      ORDER BY count DESC
    `, [], 'stats_by_type');

    // 5. Tương tác theo kết quả
    const outcomePromise = db.query(`
      SELECT outcome, COUNT(*) AS count
      FROM interactions
      GROUP BY outcome
      ORDER BY count DESC
    `, [], 'stats_by_outcome');

    // 6. Hoạt động tương tác mới nhất (5 bản ghi)
    const recentInteractionsPromise = db.query(`
      SELECT it.*, c.company_name, c.customer_code, ct.name as contact_person
      FROM interactions it
      JOIN customers c ON it.customer_id = c.id
      LEFT JOIN contacts ct ON it.contact_id = ct.id
      ORDER BY it.interaction_date DESC
      LIMIT 5
    `, [], 'stats_recent_interactions');

    // 7. Nhắc hẹn tiếp theo gần nhất
    const upcomingFollowUpsPromise = db.query(`
      SELECT it.*, c.company_name, ct.name as contact_person, ct.phone as contact_phone
      FROM interactions it
      JOIN customers c ON it.customer_id = c.id
      LEFT JOIN contacts ct ON it.contact_id = ct.id
      WHERE it.next_follow_up IS NOT NULL AND it.next_follow_up >= CURRENT_TIMESTAMP - INTERVAL '1 day'
      ORDER BY it.next_follow_up ASC
      LIMIT 5
    `, [], 'stats_upcoming');

    const [
      countsRes,
      statusRes,
      industryRes,
      typeRes,
      outcomeRes,
      recentRes,
      upcomingRes
    ] = await Promise.all([
      countsPromise,
      statusPromise,
      industryPromise,
      typePromise,
      outcomeResPromise = outcomePromise,
      recentInteractionsPromise,
      upcomingFollowUpsPromise
    ]);

    // Đồng bộ metric cho Prometheus
    statusRes.rows.forEach(r => {
      customerGauge.set({ status: r.status }, parseInt(r.count, 10));
    });

    res.json({
      success: true,
      summary: countsRes.rows[0],
      byStatus: statusRes.rows,
      byIndustry: industryRes.rows,
      byType: typeRes.rows,
      byOutcome: outcomeRes.rows,
      recentInteractions: recentRes.rows,
      upcomingFollowUps: upcomingRes.rows
    });
  } catch (error) {
    logger.error('Lỗi khi tổng hợp thống kê CRM:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu thống kê' });
  }
});

module.exports = router;

