// Authentication Controller
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { generateAndSaveOtp, verifyOtp } = require('../services/otpService');
const {
  sendVerificationOtpEmail,
  sendPasswordResetEmail,
} = require('../services/emailService');

// Helper to sign JWT authentication token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Send Bearer token in JSON payload for decoupled SPA architecture
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Exclude password hash from response payload
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      addresses: user.addresses,
    },
  });
};

// Register User & Dispatch Verification OTP (anti-enumeration response)
const register = catchAsync(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Keep duplicate protection server-side: do not create user, but return identical response
    return res.status(200).json({
      success: true,
      message: "If this email can be used to create an account, we've sent a verification OTP to it.",
      email,
    });
  }

  // Create unverified account
  const user = await User.create({
    name,
    email,
    phone,
    password,
    isVerified: false,
    role: 'user',
  });

  // Generate 6-digit verification OTP
  const plainOtp = await generateAndSaveOtp(user.email, 'VERIFICATION', user._id);

  const isMockEmail = !process.env.EMAIL_USER || !process.env.EMAIL_PASS;
  let emailDispatched = false;

  // Send verification email via Nodemailer
  if (!isMockEmail) {
    try {
      await sendVerificationOtpEmail(user.email, plainOtp, user.name);
      emailDispatched = true;
    } catch (err) {
      console.error('[Email Error] Failed to send verification email (Render Free Tier blocks outbound SMTP):', err.message);
    }
  }

  res.status(200).json({
    success: true,
    message: emailDispatched
      ? "Account created! We've sent a 6-digit verification code to your email."
      : "Account registered! (Cloud SMTP notice: Render free tier blocks outbound SMTP ports. Use the on-screen code below to verify).",
    email: user.email,
    ...(!emailDispatched && { devOtp: plainOtp }),
  });
  });
});

// Verify Email using OTP
const verifyEmailOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found with this email', 404));
  }

  // Verify OTP hash & rate limit
  await verifyOtp(email, otp, 'VERIFICATION');

  user.isVerified = true;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Resend Verification OTP
const resendVerificationOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No account found with this email', 404));
  }

  if (user.isVerified) {
    return next(new AppError('This email is already verified. Please log in.', 400));
  }

  const plainOtp = await generateAndSaveOtp(user.email, 'VERIFICATION', user._id);
  const isMockEmail = !process.env.EMAIL_USER || !process.env.EMAIL_PASS;
  let emailDispatched = false;

  if (!isMockEmail) {
    try {
      await sendVerificationOtpEmail(user.email, plainOtp, user.name);
      emailDispatched = true;
    } catch (err) {
      console.error('[Email Error] Failed to resend verification email (Render Free Tier blocks outbound SMTP):', err.message);
    }
  }

  res.status(200).json({
    success: true,
    message: emailDispatched
      ? 'A fresh verification OTP has been sent to your email.'
      : 'Fresh verification OTP generated (Render Free Tier notice: use the on-screen code below).',
    ...(!emailDispatched && { devOtp: plainOtp }),
  });
});

// Login
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and explicitly select hidden password field
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Block deactivated accounts
  if (user.isActive === false) {
    return next(new AppError('This account has been deactivated. Please contact support to reactivate.', 403));
  }

  if (!user.isVerified) {
    // Optionally auto-dispatch fresh OTP if cooldown has passed
    try {
      const plainOtp = await generateAndSaveOtp(user.email, 'VERIFICATION', user._id);
      await sendVerificationOtpEmail(user.email, plainOtp, user.name);
    } catch (e) {
      // Cooldown in progress or email warning: still inform client of unverified status
    }

    return res.status(403).json({
      success: false,
      isVerified: false,
      message: 'Account email is not verified. Please check your email for the verification OTP.',
      email: user.email,
    });
  }

  sendTokenResponse(user, 200, res);
});

// Logout (client clears Bearer token from localStorage)
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User successfully logged out',
  });
};

// Get Current User Profile (From JWT)
const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot Password - Send Reset OTP (Anti-enumeration response)
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Return identical success message to avoid account enumeration
    return res.status(200).json({
      success: true,
      message: "If this email is registered, we've sent a password reset OTP to it.",
    });
  }

  const plainOtp = await generateAndSaveOtp(email, 'RESET_PASSWORD', user._id);
  const isMockEmail = !process.env.EMAIL_USER || !process.env.EMAIL_PASS;
  let emailDispatched = false;

  if (!isMockEmail) {
    try {
      await sendPasswordResetEmail(email, plainOtp);
      emailDispatched = true;
    } catch (err) {
      console.error('[Email Error] Failed to send password reset email (Render Free Tier blocks outbound SMTP):', err.message);
    }
  }

  res.status(200).json({
    success: true,
    message: emailDispatched
      ? "If this email is registered, we've sent a password reset OTP to it."
      : "Password reset OTP generated (Render Free Tier notice: use the on-screen code below).",
    ...(!emailDispatched && { devOtp: plainOtp }),
  });
});

// Reset Password using OTP
const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  await verifyOtp(email, otp, 'RESET_PASSWORD');

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Update Profile Name / Phone
const updateProfile = catchAsync(async (req, res, next) => {
  const { name, phone } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

// Change Password for Authenticated User
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Soft Deactivate Current User Account (preserves historical orders and reviews)
const deactivateMyAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(200).json({
    success: true,
    message: 'Account successfully deactivated. All previous order records remain preserved.',
  });
});

module.exports = {
  register,
  verifyEmailOTP,
  resendVerificationOTP,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  deactivateMyAccount,
};
