// Product Routes
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validateProduct, validateProductUpdate } = require('../middleware/validators');

// Public catalog routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Admin restricted routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validateProduct,
  productController.createProduct
);

router.put('/:id', protect, restrictTo('admin'), validateProductUpdate, productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);

module.exports = router;
