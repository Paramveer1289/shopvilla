// Product Controller
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Get All Products with Search, Filtering, Sorting, and Pagination
const getProducts = catchAsync(async (req, res, next) => {
  // Count total matching documents before pagination for UI pagination bars
  const countFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();
  const totalProducts = await countFeatures.query.countDocuments();

  // Execute query with sorting and pagination
  const features = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .paginate();

  const products = await features.query;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    totalPages,
    currentPage: page,
    products,
  });
});

// Get Featured / Top Rated Products for Homepage Banner & Showcase
const getFeaturedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find()
    .sort('-ratingAverage -createdAt')
    .limit(8);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// Get Distinct Product Categories with Counts
const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    categories: categories.map((c) => ({ name: c._id, count: c.count })),
  });
});

// Get Single Product Details with Populated Reviews
const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name' },
  });

  if (!product) {
    return next(new AppError('Product not found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Admin: Create New Product
const createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Admin: Update Existing Product
const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('Product not found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Admin: Delete Product
const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Product not found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
