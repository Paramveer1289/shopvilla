// Express Application Configuration
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// 1. Security HTTP Headers (Helmet)
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      // Clean trailing slash for robust comparison
      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed =
        allowedOrigins.some((o) => o.replace(/\/$/, '') === cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production';

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 4. Dedicated Raw Body Webhook Route (registered strictly BEFORE express.json)
const orderController = require('./controllers/orderController');
app.post(
  '/api/v1/orders/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Preserve binary raw buffer for HMAC verification and parse payload
    req.rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
    try {
      req.body = req.rawBody.length > 0 ? JSON.parse(req.rawBody.toString('utf8')) : {};
    } catch (e) {
      req.body = {};
    }
    next();
  },
  orderController.handleRazorpayWebhook
);

// 5. Global Body & Cookie Parsing for standard application endpoints
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 5. Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// 6. Rate Limiting for all /api routes
app.use('/api', apiLimiter);

// 7. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ShopVilla API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

// 8. Mount Feature Routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

// 9. Unhandled Route Handler (404)
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Cannot find endpoint ${req.method} ${req.originalUrl} on this server!`,
      404
    )
  );
});

// 10. Global Centralized Error Middleware
app.use(globalErrorHandler);

module.exports = app;
