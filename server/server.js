// ShopVilla Server Entrypoint
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Fail-fast startup validation for mandatory environment variables
const validateStartupEnv = () => {
  const isProd = process.env.NODE_ENV === 'production';

  // Core mandatory variables across all environments
  const coreVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
  const missingCore = coreVars.filter((varName) => !process.env[varName]);

  if (missingCore.length > 0) {
    console.error(`\n❌ [FATAL CONFIG ERROR]: Missing required environment variable(s): ${missingCore.join(', ')}`);
    console.error(`Please ensure these variables are defined in server/.env before starting the server.\n`);
    process.exit(1);
  }

  // Gateway and communication variables (fail in production, warn in development)
  const integrationVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'CLIENT_URL',
  ];
  const missingIntegration = integrationVars.filter((varName) => !process.env[varName]);

  if (missingIntegration.length > 0) {
    if (isProd) {
      console.error(`\n❌ [FATAL PRODUCTION CONFIG ERROR]: Missing production variable(s): ${missingIntegration.join(', ')}`);
      console.error(`Production deployments require valid Razorpay keys, Webhook secrets, Email credentials, and CLIENT_URL.\n`);
      process.exit(1);
    } else {
      console.warn(`\n⚠️  [CONFIG WARNING]: Missing development variable(s): ${missingIntegration.join(', ')}`);
      console.warn(`Running in mock/fallback mode for payments and email notifications.\n`);
    }
  }
};

// Validate environment before initializing server or database
validateStartupEnv();

const app = require('./app');
const connectDB = require('./config/db');
const { initReconciliationCron } = require('./services/reconciliationService');

// Handle uncaught synchronous exceptions
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION!]:', err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Connect Database
connectDB();

// Initialize automated payment reconciliation and expiry cron job
initReconciliationCron();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`  🛒 ShopVilla API Server running on port ${PORT}`);
  console.log(`  🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
});

// Handle unhandled Promise rejections (e.g. database drop)
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION!]:', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
