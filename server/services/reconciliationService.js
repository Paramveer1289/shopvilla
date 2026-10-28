// Payment Reconciliation and Auto-Expiry Cron Service
const cron = require('node-cron');
const Order = require('../models/Order');
const razorpayService = require('./razorpayService');
const { sendOrderConfirmationEmail } = require('./emailService');
const { cancelOrderService, restoreInventoryStock } = require('./orderService');

// Reconcile pending online orders and expire unpaid orders older than 30 minutes
const reconcilePendingOrders = async () => {
  try {
    const now = Date.now();
    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
    const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000);

    // Find all pending online orders older than 15 minutes
    const pendingOrders = await Order.find({
      paymentMethod: 'ONLINE',
      paymentStatus: 'PENDING',
      createdAt: { $lt: fifteenMinutesAgo },
    }).populate('user', 'name email');

    for (const order of pendingOrders) {
      // 1. ALWAYS query live payment status from Razorpay before making any cancellation decision
      let paymentState = { isPaid: false, isFailed: false };
      if (order.razorpayOrderId) {
        try {
          paymentState = await razorpayService.fetchPaymentState(order.razorpayOrderId);
        } catch (fetchErr) {
          console.warn(`[Reconciliation Fetch Warning] Order ${order._id}:`, fetchErr.message);
        }
      }

      // If Razorpay captured payment exists, mark PAID and CONFIRMED (never cancel!)
      if (paymentState.isPaid) {
        order.paymentStatus = 'PAID';
        order.orderStatus = 'CONFIRMED';
        order.razorpayPaymentId = paymentState.paymentId || order.razorpayPaymentId || `recon_pay_${Date.now()}`;
        order.statusHistory.push({
          status: 'CONFIRMED',
          note: 'Payment reconciled and confirmed via Razorpay API automated poll',
        });
        await order.save();

        // Dispatch confirmation email to customer
        if (order.user?.email) {
          try {
            await sendOrderConfirmationEmail(order, order.user.email);
          } catch (err) {
            console.warn('[Reconciliation Email Warning]:', err.message);
          }
        }
        console.log(`[Reconciliation] Order ${order._id} reconciled to PAID via Razorpay check.`);
        continue;
      }

      // 2. Only cancel when Razorpay confirms no captured payment AND order is older than 30 minutes
      if (order.createdAt < thirtyMinutesAgo) {
        await cancelOrderService(
          order,
          null,
          'Payment expired: order auto-cancelled after 30 minutes of inactivity. Stock restored.'
        );
        console.log(`[Reconciliation] Order ${order._id} expired after 30m. Inventory restored.`);
        continue;
      }

      // 3. If between 15 and 30 minutes old and gateway explicitly marked failed
      if (paymentState.isFailed) {
        order.paymentStatus = 'FAILED';
        order.statusHistory.push({
          status: 'FAILED',
          note: 'Payment marked failed following automated Razorpay status check',
        });
        await order.save();
      }
    }
  } catch (err) {
    console.error('[Reconciliation Job Error]:', err.message);
  }
};

// Initialize background cron job running every 10 minutes
const initReconciliationCron = () => {
  // Only start cron in non-test environments
  if (process.env.NODE_ENV === 'test') return null;

  // Run every 10 minutes: */10 * * * *
  const task = cron.schedule('*/10 * * * *', async () => {
    console.log('[Cron] Running 10-minute payment reconciliation and expiry check...');
    await reconcilePendingOrders();
  });

  console.log('[Cron] Payment reconciliation scheduled (every 10 minutes).');
  return task;
};

module.exports = {
  reconcilePendingOrders,
  initReconciliationCron,
  restoreInventoryStock,
};
