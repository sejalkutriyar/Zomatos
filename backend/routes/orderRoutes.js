const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Order routes
router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.put('/:orderId/assign', orderController.assignOrder);
router.put('/:orderId/status', orderController.updateOrderStatus);
router.get('/partner/:partnerId/order', orderController.getPartnerOrder);

module.exports = router; 