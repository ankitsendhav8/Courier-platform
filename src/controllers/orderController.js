const orderService = require('../services/orderService');

async function createOrder(req, res, next) {
    try {
        const result = await orderService.createOrder(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
async function trackOrder(req, res, next) {
    try {
        const result = await orderService.trackOrder(req.params.orderId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
async function cancelOrder(req, res, next) {
    try {
        const result = await orderService.cancelOrder(req.params.awb_number);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
async function bulkCreateOrders(req, res, next) {
    try {
        const result = await orderService.createBulkOrders(req.body.orders);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
module.exports = { createOrder, trackOrder, cancelOrder, bulkCreateOrders };