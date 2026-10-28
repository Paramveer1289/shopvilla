// Customer Order Routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { validateOrderCreation } = require('../middleware/validators');

// Razorpay Webhook callback endpoint (publicly reachable for Razorpay servers)
router.post('/webhook', orderController.handleRazorpayWebhook);

// Protected customer order routes
router.use(protect);

router.post('/create', paymentLimiter, validateOrderCreation, orderController.createOrder);
router.post('/verify-payment', paymentLimiter, orderController.verifyRazorpayPayment);
router.get('/:id/payment-status', orderController.getPaymentStatus);
router.post('/:id/retry', paymentLimiter, orderController.retryPayment);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;
