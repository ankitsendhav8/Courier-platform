const orderRepository = require('../repositories/orderRepository');
const trackingRepository = require('../repositories/trackingRepository');
const logger = require('../utils/logger');
const CourierFactory = require('../factories/courierFactory');
const AppError = require('../utils/AppError');

// Service to create a new order
// Checked idempotancy by checking if the order already exists in the database if exists then throw an error
// Added core logic for creating a new order as per courier adapter

async function createOrder(formData) {
    const existingOrder = await orderRepository.getOrderByOrderId(formData.order_id);
    if (existingOrder) {
        throw new AppError(400, 'DUPLICATE_ORDER', `Order ${formData.order_id} already exists`);
    }

    formData.orderNumber = formData.order_id;
    logger.info({
        order_id: formData.order_id,
        courier_partner: formData.courier_partner,
        message: 'Creating shipment'
    });
    const courier = CourierFactory.getAdapter(formData.courier_partner);
    const shipment = await courier.createShipment(formData);
    if (shipment) {
        await orderRepository.createOrder({
            ...formData,
            courier_partner: formData.courier_partner,
            courier_order_id: shipment.orderNumber,
            awb_number: shipment.awbNumber,
            status: 'CREATED',
            courier_request: formData,
            courier_response: shipment
        });
        logger.info({
            order_id: formData.order_id,
            status: 'CREATED',
            awb: shipment.awbNumber
        });
    }

    return shipment;
}

// Service to track a order by order id
// Get the order from the database by order id
// Get the courier adapter from the factory based on the courier partner
// Track the shipment by awb number
// Create a tracking history in the database
// Update the order status in the database
// Return the tracking data

async function trackOrder(orderId) {
    const order = await orderRepository.getOrderByOrderId(orderId);
    if (!order) {
        throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    const courier = CourierFactory.getAdapter(order.courier_partner);
    const tracking = await courier.trackShipment(order.awb_number);
    logger.info({
        order_id: order.order_id,
        status: tracking.status,
        message: 'Tracking updated'
    });
    await trackingRepository.createTrackingHistory({
        order_id: order.order_id,
        status: tracking.status,
        raw_payload: tracking
    });
    await orderRepository.updateOrderStatus(order.order_id, tracking.status);
    return tracking;
}


// Service to cancel a order by awb number
// Get the order from the database by awb number
// Check if the order is already delivered or cancelled then throw an error
// Get the courier adapter from the factory based on the courier partner
// Cancel the shipment by awb number
// Create a tracking history in the database
// Update the order status in the database
// Return the cancellation data
async function cancelOrder(awb_number) {
    const order = await orderRepository.getOrderByAwbNumber(awb_number);
    if (!order) {
        throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
        let message = order.status === 'DELIVERED' ? 'Delivered shipment cannot be cancelled' : 'Shipment Already cancelled';
        throw new AppError(400, 'INVALID_OPERATION', message);
    }

    logger.info({
        order_id: order.order_id,
        status: 'CANCELLED',
        message: 'Shipment cancelled'
    });

    const courier = CourierFactory.getAdapter(order.courier_partner);
    const response = await courier.cancelShipment(order.awb_number);

    await orderRepository.updateOrderStatus(order.order_id, 'CANCELLED');
    await trackingRepository.createTrackingHistory({
        order_id: order.order_id,
        status: 'CANCELLED',
        raw_payload: response
    });
    return response;
}

// Service to create a bulk orders
// Create a bulk orders by iterating through the orders array
// Create a new order for each order in the array
// Return the bulk order data

async function createBulkOrders(orders) {
    const results = await Promise.allSettled(orders.map(order => createOrder(order)));

    let successCount = 0;
    let failureCount = 0;
    const response = [];

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            successCount++;
            response.push({
                order_id: orders[index].order_id,
                success: true,
                data: result.value
            });
        } else {
            failureCount++;
            response.push({
                order_id: orders[index].order_id,
                success: false,
                error: result.reason.message
            });
        }
    });
    return { successCount, failureCount, results: response };
}

module.exports = { createOrder, trackOrder, cancelOrder, createBulkOrders };