// Rate Limiting Middleware
const rateLimit = require('express-rate-limit');

// General API limiter: 300 requests per 15 minutes
const baseApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Stricter limiter for authentication & OTP verification: 30 attempts per 15 minutes
const baseAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes',
  },
});

// Dedicated limiter for payment creation, verification and retries: 40 requests per 15 minutes
const basePaymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many payment requests from this IP. Please try again after 15 minutes',
  },
});

// Wrap limiters dynamically so test suites are never throttled
const apiLimiter = (req, res, next) => (process.env.NODE_ENV === 'test' ? next() : baseApiLimiter(req, res, next));
const authLimiter = (req, res, next) => (process.env.NODE_ENV === 'test' ? next() : baseAuthLimiter(req, res, next));
const paymentLimiter = (req, res, next) => (process.env.NODE_ENV === 'test' ? next() : basePaymentLimiter(req, res, next));

module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter,
};
