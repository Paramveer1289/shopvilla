// Shopping Cart Routes
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart operations require authentication
router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/merge', cartController.mergeGuestCart);
router.put('/update', cartController.updateCartItemQuantity);
router.delete('/item/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
