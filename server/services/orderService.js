// Shared Order Fulfillment and Cancellation Service
const Product = require('../models/Product');
const razorpayService = require('./razorpayService');
const { sendOrderStatusUpdateEmail } = require('./emailService');

// Restore inventory stock back to catalog
const restoreInventoryStock = async (items) => {
  for (const item of items) {
    if (item.product) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }
};

// Shared cancellation function used by cancelOrder, admin updateOrderStatus, and reconciliation
// Strictly idempotent: restores stock exactly once, sets REFUND_INITIATED for paid orders
const cancelOrderService = async (order, updatedBy = null, reason = 'Order cancelled') => {
  // If order is already cancelled, safely return without double stock restoration
  if (order.orderStatus === 'CANCELLED') {
    return order;
  }

  // Handle refund initiation for captured online orders
  if (order.paymentStatus === 'PAID') {
    order.paymentStatus = 'REFUND_INITIATED';
    if (order.razorpayPaymentId) {
      try {
        await razorpayService.initiateRefund(order.razorpayPaymentId, order.totalAmount, { reason });
      } catch (err) {
        console.warn(`[Refund Initiation Warning] Order ${order._id}:`, err.message);
      }
    }
  } else if (order.paymentStatus === 'PENDING' || order.paymentStatus === 'COD_PENDING') {
    order.paymentStatus = 'FAILED';
  }

  order.orderStatus = 'CANCELLED';
  order.statusHistory.push({
    status: 'CANCELLED',
    updatedBy: updatedBy || order.user,
    note: reason,
  });

  // Restore inventory stock back to products collection
  await restoreInventoryStock(order.items);

  await order.save();

  // Send status update notification email if recipient exists
  try {
    const recipientEmail = order.user?.email || (order.shippingAddress?.phone?.includes('@') ? order.shippingAddress.phone : null);
    if (recipientEmail) {
      await sendOrderStatusUpdateEmail(order, recipientEmail, 'CANCELLED', reason);
    }
  } catch (e) {
    console.warn('[Email Warning] Cancellation email failed:', e.message);
  }

  return order;
};

module.exports = {
  restoreInventoryStock,
  cancelOrderService,
};
