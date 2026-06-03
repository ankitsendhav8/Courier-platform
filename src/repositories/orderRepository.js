const pool = require('../config/database');

async function createOrder(order) {
    const sql = `INSERT INTO orders( order_id, courier_partner, courier_order_id, awb_number, status, courier_request, courier_response) VALUES (?,?,?,?,?,?,?)`;
    await pool.execute(sql, [order.orderNumber, order.courier_partner, order.courier_order_id, order.awb_number, order.status, JSON.stringify(order.courier_request), JSON.stringify(order.courier_response)]);
}

async function getOrderByOrderId(orderId) {
    const sql = `SELECT * FROM orders WHERE courier_order_id = ?`;
    const [rows] = await pool.execute(sql, [orderId]);
    return rows[0];
}

async function getOrderByAwbNumber(awbNumber) {
    const sql = `SELECT * FROM orders WHERE awb_number = ?`;
    const [rows] = await pool.execute(sql, [awbNumber]);
    return rows[0];
}
async function updateOrderStatus(orderId, status) {
    const sql = ` UPDATE orders SET status = ? WHERE courier_order_id = ?`;
    await pool.execute(sql, [status, orderId]);
}

async function orderExists(orderId) {
    const sql = `SELECT id FROM orders WHERE courier_order_id = ?`;
    const [rows] = await pool.execute(sql, [orderId]);
    return rows.length > 0;
}

module.exports = { createOrder, getOrderByOrderId, updateOrderStatus, orderExists, getOrderByAwbNumber };