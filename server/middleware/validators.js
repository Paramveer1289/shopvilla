// Request Validation Middleware (Express-Validator)
const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// Reusable result checker
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(`Validation failed: ${errorMessages}`, 400));
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 60 })
    .withMessage('Name cannot exceed 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateResult,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateResult,
];

const validateOtpVerification = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email is required'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be a 6-digit code'),
  validateResult,
];

const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('deliveryCharge')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Delivery charge must be a non-negative number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stock')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be zero or a positive integer'),
  validateResult,
];

const validateProductUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Product description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('deliveryCharge').optional().isFloat({ min: 0 }).withMessage('Delivery charge must be a non-negative number'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be zero or a positive integer'),
  validateResult,
];

const validateReview = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5 stars'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ max: 1000 })
    .withMessage('Review comment cannot exceed 1000 characters'),
  validateResult,
];

// Address validation enforcing 10-digit Indian phone and 6-digit pincode
const validateAddress = [
  body('fullName').trim().notEmpty().withMessage('Recipient full name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian phone number (starting with 6-9)'),
  body('line1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please enter a valid 6-digit Indian postal pincode'),
  validateResult,
];

const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  validateResult,
];

// Checkout Order creation validation
const validateOrderCreation = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Recipient full name is required'),
  body('shippingAddress.phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit Indian mobile number is required'),
  body('shippingAddress.line1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode')
    .trim()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Valid 6-digit postal pincode is required'),
  body('paymentMethod')
    .isIn(['ONLINE', 'COD'])
    .withMessage('Payment method must be ONLINE or COD'),
  validateResult,
];

const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  validateResult,
];

const validateResetPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be a 6-digit code'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  validateResult,
];

const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 60 })
    .withMessage('Name cannot exceed 60 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  validateResult,
];

const validateOrderStatus = [
  body('orderStatus')
    .trim()
    .notEmpty()
    .withMessage('Order status is required')
    .isIn(['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status value'),
  validateResult,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateOtpVerification,
  validateProduct,
  validateProductUpdate,
  validateReview,
  validateAddress,
  validateChangePassword,
  validateOrderCreation,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateOrderStatus,
};
