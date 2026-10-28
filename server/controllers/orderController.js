// Order Controller
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const razorpayService = require('../services/razorpayService');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../services/emailService');
const { cancelOrderService, restoreInventoryStock } = require('../services/orderService');

// Atomically deduct inventory with stock condition check and automatic compensating rollback
const deductInventoryStock = async (items) => {
  const deductedItems = [];
  try {
    for (const item of items) {
      // Atomic query condition guarantees stock is never reduced below zero
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error(`Insufficient stock available for ${item.name}`);
      }
      deductedItems.push(item);
    }
  } catch (err) {
    // Compensating rollback for previously deducted items
    for (const item of deductedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
    throw new AppError(err.message, 400);
  }
};

// Create Order (recalculates total strictly from DB prices)
const createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress) {
    return next(new AppError('Shipping address is required for checkout', 400));
  }

  if (!['ONLINE', 'COD'].includes(paymentMethod)) {
    return next(new AppError('Invalid payment method. Choose ONLINE or COD.', 400));
  }

  // Block unverified users from placing orders
  if (!req.user.isVerified) {
    return next(new AppError('Please verify your email address via OTP before placing an order.', 403));
  }

  // Retrieve user cart and verify populated products
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty. Add items to checkout.', 400));
  }

  // Verify product existence and available inventory stock
  for (const item of cart.items) {
    if (!item.product) {
      return next(new AppError('One or more products in your cart no longer exist.', 400));
    }
    if (item.product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for "${item.product.name}". Only ${item.product.stock} available.`, 400));
    }
  }

  // Build immutable snapshot of line items using database prices
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price, // Trust ONLY database price
    deliveryCharge: item.product.deliveryCharge || 0,
    quantity: item.quantity,
    image: item.product.images[0] || '',
  }));

  // Recalculate total strictly on backend
  const itemsTotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemDeliveryCharges = orderItems.reduce(
    (acc, item) => acc + (item.deliveryCharge || 0) * item.quantity,
    0
  );
  const shippingFee = itemsTotal === 0
    ? 0
    : itemDeliveryCharges > 0
      ? itemDeliveryCharges
      : itemsTotal >= 500
        ? 0
        : 50;
  const totalAmount = itemsTotal + shippingFee;

  // Initialize new order document
  const order = new Order({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsTotal,
    shippingFee,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'COD_PENDING' : 'PENDING',
    orderStatus: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
    statusHistory: [
      {
        status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
        updatedBy: req.user._id,
        note: paymentMethod === 'COD' ? 'Order placed via Cash on Delivery' : 'Order initialized for Razorpay payment',
      },
    ],
  });

  // Atomically deduct inventory with condition check (reserves stock)
  await deductInventoryStock(orderItems);

  // Clear customer cart now that line items are committed to order
  cart.items = [];
  await cart.save();

  // Handle Online Payment via Razorpay
  if (paymentMethod === 'ONLINE') {
    let razorpayOrder;
    try {
      razorpayOrder = await razorpayService.createOrder(totalAmount, order._id);
    } catch (err) {
      // Compensating rollback: restore reserved stock if Razorpay creation fails
      await restoreInventoryStock(orderItems);
      return next(new AppError(`Payment gateway initialization failed: ${err.message}. Stock was restored.`, 502));
    }

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(201).json({
      success: true,
      message: 'Razorpay order generated',
      order,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      razorpayKey:
        process.env.RAZORPAY_KEY_ID?.includes('shopvilla') ||
        razorpayOrder.id?.startsWith('order_mock_')
          ? 'rzp_test_mock'
          : (process.env.RAZORPAY_KEY_ID || 'rzp_test_mock'),
    });
  }

  // Cash On Delivery Flow
  await order.save();

  try {
    await sendOrderConfirmationEmail(order, req.user.email);
  } catch (err) {
    console.warn('[Email Warning] Order confirmation dispatch failed:', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully (Cash on Delivery)',
    order,
  });
});

// Verify Razorpay Online Payment Signature (Idempotent)
const verifyRazorpayPayment = catchAsync(async (req, res, next) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Idempotency: if webhook or previous verify call already confirmed payment
  if (order.paymentStatus === 'PAID') {
    return res.status(200).json({
      success: true,
      message: 'Payment already verified and confirmed',
      order,
    });
  }

  // Verify cryptographic HMAC-SHA256 signature
  const isValid = razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!isValid) {
    order.paymentStatus = 'FAILED';
    order.statusHistory.push({
      status: 'FAILED',
      updatedBy: req.user._id,
      note: 'Razorpay signature verification failed',
    });
    await order.save();
    return next(new AppError('Invalid payment signature verification', 400));
  }

  // Update order status to PAID and CONFIRMED (stock was already reserved at order creation)
  order.paymentStatus = 'PAID';
  order.orderStatus = 'CONFIRMED';
  order.razorpayOrderId = razorpayOrderId;
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.statusHistory.push({
    status: 'CONFIRMED',
    updatedBy: req.user._id,
    note: `Payment verified successfully. Payment ID: ${razorpayPaymentId}`,
  });

  await order.save();

  try {
    await sendOrderConfirmationEmail(order, req.user.email);
  } catch (err) {
    console.warn('[Email Warning] Order confirmation dispatch failed:', err.message);
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified and order confirmed!',
    order,
  });
});

// Query and Reconcile Payment Status (GET /api/v1/orders/:id/payment-status)
const getPaymentStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this order', 403));
  }

  // If already confirmed or terminal, return current state immediately
  if (order.paymentStatus === 'PAID') {
    return res.status(200).json({
      success: true,
      paymentStatus: 'PAID',
      orderStatus: order.orderStatus,
      order,
    });
  }

  if (order.orderStatus === 'CANCELLED') {
    return res.status(200).json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderStatus: 'CANCELLED',
      order,
    });
  }

  // Check 30-minute payment expiry for unpaid online orders
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
  if (order.paymentMethod === 'ONLINE' && order.createdAt.getTime() < thirtyMinutesAgo) {
    order.paymentStatus = 'FAILED';
    order.orderStatus = 'CANCELLED';
    order.statusHistory.push({
      status: 'CANCELLED',
      note: 'Payment expired: auto-cancelled after 30 minutes of inactivity. Stock released.',
    });

    // Atomically release reserved stock
    await restoreInventoryStock(order.items);
    await order.save();

    return res.status(200).json({
      success: true,
      paymentStatus: 'FAILED',
      orderStatus: 'CANCELLED',
      expired: true,
      message: 'Payment window has expired. Reserved stock has been released.',
      order,
    });
  }

  // If still PENDING, query Razorpay API directly
  if (order.paymentStatus === 'PENDING' && order.razorpayOrderId) {
    const paymentState = await razorpayService.fetchPaymentState(order.razorpayOrderId);

    if (paymentState.isPaid) {
      order.paymentStatus = 'PAID';
      order.orderStatus = 'CONFIRMED';
      order.razorpayPaymentId = paymentState.paymentId || order.razorpayPaymentId || `check_pay_${Date.now()}`;
      order.statusHistory.push({
        status: 'CONFIRMED',
        note: 'Payment verified via Razorpay API direct status poll',
      });
      await order.save();

      if (order.user?.email) {
        try {
          await sendOrderConfirmationEmail(order, order.user.email);
        } catch (err) {
          console.warn('[Email Warning]:', err.message);
        }
      }

      return res.status(200).json({
        success: true,
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        order,
      });
    }

    if (paymentState.isFailed) {
      order.paymentStatus = 'FAILED';
      order.statusHistory.push({
        status: 'FAILED',
        note: 'Payment marked failed from Razorpay status check',
      });
      await order.save();

      return res.status(200).json({
        success: true,
        paymentStatus: 'FAILED',
        orderStatus: order.orderStatus,
        order,
      });
    }
  }

  res.status(200).json({
    success: true,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    order,
  });
});

// Retry Online Payment on the existing order
const retryPayment = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this order', 403));
  }

  // Prevent double payment
  if (order.paymentStatus === 'PAID') {
    return next(new AppError('This order is already paid.', 400));
  }

  // If order was auto-cancelled (e.g. 30m expiry), verify stock and reserve again
  if (order.orderStatus === 'CANCELLED') {
    try {
      await deductInventoryStock(order.items);
      order.orderStatus = 'PENDING';
    } catch (err) {
      return next(new AppError(`Cannot retry payment: ${err.message}`, 400));
    }
  }

  // Generate fresh Razorpay order
  const razorpayOrder = await razorpayService.createOrder(order.totalAmount, order._id);
  order.razorpayOrderId = razorpayOrder.id;
  order.paymentStatus = 'PENDING';
  order.statusHistory.push({
    status: 'PENDING',
    updatedBy: req.user._id,
    note: 'Payment retry initiated by customer',
  });
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment retry order generated',
    order,
    razorpayOrder: {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    },
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  });
});

// Razorpay Webhook Handler (Idempotent source of truth for payment.captured and payment.failed)
const handleRazorpayWebhook = catchAsync(async (req, res, next) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

  const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
  const isValid = razorpayService.verifyWebhookSignature(rawBody, signature, secret);

  if (!isValid && !process.env.RAZORPAY_KEY_ID?.includes('placeholder')) {
    return next(new AppError('Invalid webhook signature', 400));
  }

  const event = req.body.event;
  const payload = req.body.payload;
  // Capture event ID for idempotency deduplication
  const eventId = req.body.id || req.headers['x-razorpay-event-id'] || `evt_${Date.now()}`;

  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = payload.payment?.entity;
    const rzpOrderId = payment?.order_id || payload.order?.entity?.id;

    if (rzpOrderId) {
      const order = await Order.findOne({ razorpayOrderId: rzpOrderId }).populate('user', 'email name');
      if (order) {
        // Idempotency: if order is already PAID or this event ID was already processed, do nothing
        if (order.paymentStatus === 'PAID' || order.processedWebhookEventIds.includes(eventId)) {
          return res.status(200).json({ status: 'ok', message: 'Event already processed' });
        }

        order.paymentStatus = 'PAID';
        order.orderStatus = 'CONFIRMED';
        order.razorpayPaymentId = payment?.id || order.razorpayPaymentId || `webhook_pay_${Date.now()}`;
        order.processedWebhookEventIds.push(eventId);
        order.statusHistory.push({
          status: 'CONFIRMED',
          note: `Payment confirmed via Razorpay Webhook (Event: ${eventId})`,
        });
        await order.save();

        // Dispatch confirmation email (handles user who closed browser tab before frontend verify)
        const recipientEmail = order.user?.email || order.shippingAddress?.phone;
        if (recipientEmail && recipientEmail.includes('@')) {
          try {
            await sendOrderConfirmationEmail(order, recipientEmail);
          } catch (err) {
            console.warn('[Webhook Email Warning]:', err.message);
          }
        }
      }
    }
  } else if (event === 'payment.failed') {
    const payment = payload.payment?.entity;
    if (payment?.order_id) {
      const order = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order && order.paymentStatus === 'PENDING') {
        if (!order.processedWebhookEventIds.includes(eventId)) {
          order.processedWebhookEventIds.push(eventId);
        }
        order.paymentStatus = 'FAILED';
        order.statusHistory.push({
          status: 'FAILED',
          note: `Payment failed: ${payment.error_description || 'Gateway declined'} (Event: ${eventId})`,
        });
        await order.save();
      }
    }
  } else if (event === 'refund.processed') {
    const refund = payload.refund?.entity;
    const payment = payload.payment?.entity;
    const paymentId = refund?.payment_id || payment?.id;
    const rzpOrderId = payment?.order_id;

    // Locate order by Razorpay Order ID or Payment ID
    const query = rzpOrderId ? { razorpayOrderId: rzpOrderId } : { razorpayPaymentId: paymentId };
    const order = await Order.findOne(query);

    if (order) {
      if (!order.processedWebhookEventIds.includes(eventId)) {
        order.processedWebhookEventIds.push(eventId);
      }
      order.paymentStatus = 'REFUNDED';
      order.statusHistory.push({
        status: 'REFUNDED',
        note: `Refund processed successfully via Razorpay (Refund ID: ${refund?.id || 'N/A'}, Event: ${eventId})`,
      });
      await order.save();
    }
  }

  res.status(200).json({ status: 'ok' });
});

// Get My Orders (with Pagination)
const getMyOrders = catchAsync(async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
  const skip = (page - 1) * limit;

  const totalOrders = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
    orders,
  });
});

// Get Single Order By ID
const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Cancel Order
const cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to cancel this order', 403));
  }

  // Regular users can only cancel PENDING or CONFIRMED; Admins may also cancel from SHIPPED
  const allowedStatuses = req.user.role === 'admin'
    ? ['PENDING', 'CONFIRMED', 'SHIPPED']
    : ['PENDING', 'CONFIRMED'];

  if (!allowedStatuses.includes(order.orderStatus)) {
    return next(new AppError(`Cannot cancel an order that is already ${order.orderStatus.toLowerCase()}`, 400));
  }

  // Execute cancellation through shared, idempotent service function
  await cancelOrderService(order, req.user._id, req.body.reason || 'Cancelled by customer');

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully and inventory restored',
    order,
  });
});

module.exports = {
  createOrder,
  verifyRazorpayPayment,
  getPaymentStatus,
  retryPayment,
  handleRazorpayWebhook,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
