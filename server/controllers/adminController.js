// Admin Controller
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const razorpayService = require('../services/razorpayService');
const { sendOrderStatusUpdateEmail } = require('../services/emailService');
const { cancelOrderService } = require('../services/orderService');

// State Machine defining valid sequential transitions for the order lifecycle
const VALID_ORDER_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [], // Terminal state: cannot go back
  CANCELLED: [], // Terminal state: final
};

// Get All Orders Across Platform (with Filtering & Pagination)
const getAllOrders = catchAsync(async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status && req.query.status !== 'all') {
    filter.orderStatus = req.query.status;
  }

  const totalOrders = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email phone')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully',
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
    data: { orders },
    orders,
  });
});

// Update Order Fulfillment Status using the State Machine
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus, note } = req.body;

  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // 1. Enforce State Machine Transitions
  const currentStatus = order.orderStatus;
  const allowedNextStatuses = VALID_ORDER_TRANSITIONS[currentStatus] || [];

  if (currentStatus === 'DELIVERED') {
    return next(new AppError('DELIVERED is a terminal state. Completed orders cannot be modified.', 400));
  }

  if (currentStatus === 'CANCELLED') {
    return next(new AppError('CANCELLED is a terminal state. Cancelled orders cannot be modified.', 400));
  }

  if (!allowedNextStatuses.includes(orderStatus)) {
    return next(
      new AppError(
        `Invalid status transition from ${currentStatus} to ${orderStatus}. Allowed transitions: ${allowedNextStatuses.join(', ') || 'None'}`,
        400
      )
    );
  }

  // 2. Handle cancellation transition by admin via shared cancellation service
  if (orderStatus === 'CANCELLED') {
    await cancelOrderService(order, req.user._id, note || 'Cancelled by Administrator');
    return res.status(200).json({
      success: true,
      message: 'Order status successfully transitioned to CANCELLED',
      data: { order },
      order,
    });
  }

  // 3. Mark COD orders as PAID when delivered
  if (orderStatus === 'DELIVERED' && order.paymentMethod === 'COD') {
    order.paymentStatus = 'PAID';
  }

  order.orderStatus = orderStatus;
  order.statusHistory.push({
    status: orderStatus,
    updatedBy: req.user._id,
    note: note || `Status updated to ${orderStatus} by Administrator`,
  });

  await order.save();

  // 4. Send email notification on status change
  try {
    if (order.user?.email) {
      await sendOrderStatusUpdateEmail(order, order.user.email, orderStatus, note);
    }
  } catch (err) {
    console.warn('[Email Warning] Status update email failed:', err.message);
  }

  res.status(200).json({
    success: true,
    message: `Order status successfully transitioned to ${orderStatus}`,
    data: { order },
    order,
  });
});

// Get Admin Dashboard Analytics & Metrics
const getDashboardStats = catchAsync(async (req, res, next) => {
  // 1. Total revenue
  const revenueResult = await Order.aggregate([
    {
      $match: {
        orderStatus: { $ne: 'CANCELLED' },
        paymentStatus: { $in: ['PAID', 'COD_PENDING'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;
  const totalCompletedOrders = revenueResult[0]?.count || 0;

  // 2. Order counts breakdown
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'PENDING' });
  const confirmedOrders = await Order.countDocuments({ orderStatus: 'CONFIRMED' });
  const shippedOrders = await Order.countDocuments({ orderStatus: 'SHIPPED' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'DELIVERED' });
  const cancelledOrders = await Order.countDocuments({ orderStatus: 'CANCELLED' });

  // 3. Total customers & products
  const totalCustomers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments();

  // 4. Low stock products (stock <= 5)
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .select('name stock category price')
    .limit(10);

  // 5. Recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(6);

  // 6. Category breakdown
  const categoryStats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    success: true,
    message: 'Analytics stats retrieved successfully',
    data: {
      totalRevenue,
      totalOrders,
      totalCompletedOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders,
      categoryStats,
    },
    stats: {
      totalRevenue,
      totalOrders,
      totalCompletedOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders,
      categoryStats,
    },
  });
});

// Get Customers List with Pagination and Aggregated Orders Count (No N+1 queries)
const getCustomers = catchAsync(async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
  const skip = (page - 1) * limit;

  const totalCustomers = await User.countDocuments({ role: 'user' });

  const customers = await User.aggregate([
    { $match: { role: 'user' } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'orders',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
          { $count: 'total' },
        ],
        as: 'orderCountData',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        isVerified: 1,
        isActive: 1,
        createdAt: 1,
        addressCount: { $size: { $ifNull: ['$addresses', []] } },
        orderCount: { $ifNull: [{ $arrayElemAt: ['$orderCountData.total', 0] }, 0] },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: 'Customer accounts retrieved successfully',
    totalCustomers,
    totalPages: Math.ceil(totalCustomers / limit),
    currentPage: page,
    customers,
    data: { customers },
  });
});

// Toggle Customer Active Status (Soft Deactivate / Reactivate preserving orders)
const toggleCustomerStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Customer not found', 404));
  }
  if (user.role === 'admin') {
    return next(new AppError('Cannot deactivate administrator accounts via this endpoint', 400));
  }

  user.isActive = user.isActive === false ? true : false;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Customer account successfully ${user.isActive ? 'activated' : 'deactivated'}`,
    user,
  });
});

module.exports = {
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getCustomers,
  toggleCustomerStatus,
  VALID_ORDER_TRANSITIONS,
};
