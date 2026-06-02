const orderRepository = require('../repositories/orderRepository');
const trackingRepository = require('../repositories/trackingRepository');
const logger = require('../utils/logger');
const CourierFactory = require('../factories/courierFactory');
const AppError = require('../utils/AppError');

async function createOrder(formData) {
    formData.order_id = new Date().getTime();
    formData.orderNumber = new Date().getTime();
    logger.info({
        order_id: formData.order_id,
        courier_partner: formData.courier_partner,
        message: 'Creating shipment'
    });
    console.log('formData-createOrder', JSON.stringify(formData));

    const courier = CourierFactory.getAdapter(formData.courier_partner);
    const shipment = await courier.createShipment(formData);
    if (shipment) {
        await orderRepository.createOrder({
            ...formData,
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
    }
    );

    return { successCount, failureCount, results: response };
}

module.exports = { createOrder, trackOrder, cancelOrder, createBulkOrders };