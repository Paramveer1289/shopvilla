// Review Routes
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { validateReview } = require('../middleware/validators');

// Public: view reviews for a product
router.get('/:productId', reviewController.getProductReviews);

// Protected: create review or delete review
router.post('/:productId', protect, validateReview, reviewController.createReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
