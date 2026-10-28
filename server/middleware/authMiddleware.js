// Authentication Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Extract Bearer Token from Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please provide a Bearer token to gain access.', 401)
    );
  }

  // 2. Verify Token Authenticity & Expiry
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid authentication token.', 401));
  }

  // 3. Verify User still exists in database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4. Reject deactivated accounts even with valid signed JWT token
  if (currentUser.isActive === false) {
    return next(
      new AppError('Your account has been deactivated. Please contact support.', 403)
    );
  }

  // 5. Grant access: attach user to req object
  req.user = currentUser;
  next();
});

module.exports = { protect };
