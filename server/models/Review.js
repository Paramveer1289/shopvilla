// Review Model
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment cannot be empty'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

// Compound Unique Index: prevents duplicate reviews from the same user on the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to recalculate average ratings and total count for a product
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        ratingCount: { $sum: 1 },
        ratingAverage: { $avg: '$rating' },
      },
    },
  ]);

  const Product = mongoose.model('Product');

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingCount: stats[0].ratingCount,
      ratingAverage: stats[0].ratingAverage,
    });
  } else {
    // Reset if all reviews were deleted
    await Product.findByIdAndUpdate(productId, {
      ratingCount: 0,
      ratingAverage: 0,
    });
  }
};

// Post-save hook to recalculate stats
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

// Post-remove / findOneAndDelete hook
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
