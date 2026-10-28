// Review Controller
const Review = require('../models/Review');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Add Review for a Product (One review per customer per product)
const createReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if review already exists for this user and product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (existingReview) {
    return next(
      new AppError(
        'You have already submitted a review for this product. You can update or delete your existing review.',
        400
      )
    );
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
  });

  await review.populate('user', 'name');

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    review,
  });
});

// Get All Reviews for a Product
const getProductReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// Delete Review (Author or Admin)
const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Only author or admin can delete
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You are not authorized to delete this review', 403)
    );
  }

  const productId = review.product;
  await Review.findByIdAndDelete(req.params.id);

  // Recalculate stats
  await Review.calcAverageRatings(productId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};
