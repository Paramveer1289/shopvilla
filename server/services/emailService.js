// Email dispatch service using Nodemailer
const transporter = require('../config/nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'ShopVilla Support <no-reply@shopvilla.com>',
    to,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ''),
    html,
  };

  return await transporter.sendMail(mailOptions);
};

// Send verification OTP email
const sendVerificationOtpEmail = async (email, otp, name = 'Valued Customer') => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 8px;">
      <h2 style="color: #ea580c; text-align: center;">Welcome to ShopVilla!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for signing up. Please use the One-Time Password (OTP) below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1c1917; background: #fff7ed; padding: 12px 24px; border-radius: 6px; border: 1px dashed #f97316;">
          ${otp}
        </span>
      </div>
      <p style="color: #78716c; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
      <hr style="border: none; border-top: 1px solid #fed7aa; margin: 20px 0;" />
      <p style="font-size: 12px; color: #a8a29e; text-align: center;">&copy; ${new Date().getFullYear()} ShopVilla E-Commerce Inc. All rights reserved.</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: 'ShopVilla - Verify Your Email Address',
    html,
  });
};

// Send password reset OTP email
const sendPasswordResetEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 8px;">
      <h2 style="color: #ea580c; text-align: center;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your ShopVilla account. Use the OTP below to proceed:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ea580c; background: #fff7ed; padding: 12px 24px; border-radius: 6px; border: 1px dashed #f97316;">
          ${otp}
        </span>
      </div>
      <p style="color: #78716c; font-size: 14px;">This OTP expires in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #fed7aa; margin: 20px 0;" />
      <p style="font-size: 12px; color: #a8a29e; text-align: center;">&copy; ${new Date().getFullYear()} ShopVilla E-Commerce Inc.</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: 'ShopVilla - Password Reset OTP',
    html,
  });
};

// Send order confirmation receipt email
const sendOrderConfirmationEmail = async (order, customerEmail) => {
  const itemsList = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e7e5e4;">${item.name || 'Product'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e7e5e4; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e7e5e4; text-align: right;">₹${(item.price || 0).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  const shippingAddr = order.shippingAddress || {};

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #ea580c; margin: 0;">ShopVilla</h1>
        <p style="color: #10b981; font-weight: bold; margin-top: 5px;">Order Placed Successfully!</p>
      </div>
      <p>Thank you for shopping with us! Your order ID is <strong>#${order._id}</strong>.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #fff7ed; text-align: left;">
            <th style="padding: 8px; border-bottom: 2px solid #fed7aa;">Item</th>
            <th style="padding: 8px; border-bottom: 2px solid #fed7aa; text-align: center;">Qty</th>
            <th style="padding: 8px; border-bottom: 2px solid #fed7aa; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 15px;">
        <p style="margin: 4px 0;">Subtotal: <strong>₹${(order.itemsTotal || 0).toFixed(2)}</strong></p>
        <p style="margin: 4px 0;">Delivery: <strong>₹${(order.shippingFee || 0).toFixed(2)}</strong></p>
        <h3 style="color: #1c1917; margin: 8px 0;">Total: ₹${(order.totalAmount || 0).toFixed(2)}</h3>
        <p style="color: #78716c; font-size: 13px;">Payment Method: ${order.paymentMethod || 'ONLINE'} (${order.paymentStatus || 'PAID'})</p>
      </div>

      <div style="margin-top: 25px; padding: 15px; background: #fff7ed; border-radius: 6px;">
        <h4 style="margin: 0 0 8px 0; color: #431407;">Delivery Address</h4>
        <p style="margin: 2px 0; font-size: 14px;"><strong>${shippingAddr.fullName || 'Customer'}</strong> (${shippingAddr.phone || 'N/A'})</p>
        <p style="margin: 2px 0; font-size: 14px;">${shippingAddr.line1 || ''}, ${shippingAddr.line2 || ''}</p>
        <p style="margin: 2px 0; font-size: 14px;">${shippingAddr.city || ''}, ${shippingAddr.state || ''} - ${shippingAddr.pincode || ''}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #fed7aa; margin: 25px 0;" />
      <p style="font-size: 12px; color: #a8a29e; text-align: center;">We will notify you when your package is dispatched. &copy; ${new Date().getFullYear()} ShopVilla Inc.</p>
    </div>
  `;

  return await sendEmail({
    to: customerEmail,
    subject: `ShopVilla - Order Confirmation #${order._id}`,
    html,
  });
};

// Send order lifecycle status update email
const sendOrderStatusUpdateEmail = async (order, customerEmail, newStatus, note = '') => {
  const statusColors = {
    CONFIRMED: '#2563eb',
    SHIPPED: '#0891b2',
    DELIVERED: '#16a34a',
    CANCELLED: '#dc2626',
  };

  const statusColor = statusColors[newStatus] || '#ea580c';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 8px;">
      <h2 style="color: #ea580c; text-align: center; margin-bottom: 5px;">ShopVilla</h2>
      <h3 style="color: ${statusColor}; text-align: center; margin-top: 0;">Order Status Updated: ${newStatus}</h3>
      <p>Hello,</p>
      <p>Your order <strong>#${order._id}</strong> has been updated to status: <strong style="color: ${statusColor};">${newStatus}</strong>.</p>
      ${note ? `<div style="background: #fff7ed; padding: 12px; border-left: 4px solid #f97316; margin: 15px 0; font-size: 14px;"><strong>Tracking Note:</strong> ${note}</div>` : ''}
      <div style="margin: 20px 0; padding: 15px; background: #f5f5f4; border-radius: 6px; font-size: 14px;">
        <p style="margin: 4px 0;"><strong>Order Total:</strong> ₹${order.totalAmount.toFixed(2)}</p>
        <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
        <p style="margin: 4px 0;"><strong>Shipping Destination:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
      </div>
      <p style="font-size: 13px; color: #78716c;">You can track real-time delivery progress directly inside your ShopVilla dashboard.</p>
      <hr style="border: none; border-top: 1px solid #fed7aa; margin: 20px 0;" />
      <p style="font-size: 12px; color: #a8a29e; text-align: center;">&copy; ${new Date().getFullYear()} ShopVilla E-Commerce Inc.</p>
    </div>
  `;

  return await sendEmail({
    to: customerEmail,
    subject: `ShopVilla - Order #${order._id} is now ${newStatus}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendVerificationOtpEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
