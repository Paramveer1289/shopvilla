// Authentication & Account Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateOtpVerification,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
} = require('../middleware/validators');

// Public auth endpoints
router.post('/register', authLimiter, validateRegister, authController.register);
router.post(
  '/verify-otp',
  authLimiter,
  validateOtpVerification,
  authController.verifyEmailOTP
);
router.post('/resend-otp', authLimiter, authController.resendVerificationOTP);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authLimiter, validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, authController.resetPassword);

// Protected account endpoints
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, validateUpdateProfile, authController.updateProfile);
router.put('/change-password', protect, validateChangePassword, authController.changePassword);
router.patch('/deactivate', protect, authController.deactivateMyAccount);

module.exports = router;
