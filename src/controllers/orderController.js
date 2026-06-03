const orderService = require('../services/orderService');

// Controller to create a new order
async function createOrder(req, res, next) {
    try {
        const result = await orderService.createOrder(req.body);
        if (result) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                errorCode: 'FAILED',
                message: 'Failed to create order'
            });
        }
    } catch (error) {
        next(error);
    }
}

// Controller to track a order by order id
async function trackOrder(req, res, next) {
    try {
        const result = await orderService.trackOrder(req.params.orderId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// Controller to cancel a order by awb number
async function cancelOrder(req, res, next) {
    try {
        const result = await orderService.cancelOrder(req.params.awb_number);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// Controller to create a bulk orders
async function bulkCreateOrders(req, res, next) {
    try {
        const result = await orderService.createBulkOrders(req.body.orders);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
module.exports = { createOrder, trackOrder, cancelOrder, bulkCreateOrders };