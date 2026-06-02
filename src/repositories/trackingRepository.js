const pool = require('../config/database');
async function createTrackingHistory(data) {
    const sql = `INSERT INTO tracking_history (order_id,status,raw_payload) VALUES (?, ?, ?)`;
    await pool.execute(sql, [data.order_id, data.status, JSON.stringify(data.raw_payload)]);
}

module.exports = { createTrackingHistory };