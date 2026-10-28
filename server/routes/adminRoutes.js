// Administrator Management Routes
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validateOrderStatus } = require('../middleware/validators');

// Restrict entire router to authenticated administrators
router.use(protect, restrictTo('admin'));

router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', validateOrderStatus, adminController.updateOrderStatus);
router.get('/stats', adminController.getDashboardStats);
router.get('/customers', adminController.getCustomers);
router.patch('/customers/:id/toggle-active', adminController.toggleCustomerStatus);

module.exports = router;
