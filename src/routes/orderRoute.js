const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const validateRequest = require('../middlewares/validateRequest');
const { createOrderSchema, bulkOrderSchema } = require('../validations/validation');

router.post('/', validateRequest(createOrderSchema), orderController.createOrder);
router.post('/bulk', validateRequest(bulkOrderSchema), orderController.bulkCreateOrders);
router.get('/:orderId/track', orderController.trackOrder);
router.post('/:awb_number/cancel', orderController.cancelOrder);

module.exports = router;