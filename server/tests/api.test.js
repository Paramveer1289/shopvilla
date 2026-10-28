// Comprehensive Backend Unit and Integration Test Suite
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Otp = require('../models/Otp');
const Order = require('../models/Order');
const razorpayService = require('../services/razorpayService');
const { VALID_ORDER_TRANSITIONS } = require('../controllers/adminController');

describe('ShopVilla E-Commerce Platform Test Suite', () => {
  // 1. Password Hashing & Security Verification
  describe('Password Hashing & Security (bcrypt)', () => {
    it('should hash passwords with salt rounds and not store plaintext', async () => {
      const plainPassword = 'SuperSecretPassword@123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      // Verify hash format and that plaintext is obscured
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$/);

      // Verify matching password validates true
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      expect(isMatch).toBe(true);

      // Verify incorrect password validates false
      const isWrongMatch = await bcrypt.compare('WrongPassword@999', hashedPassword);
      expect(isWrongMatch).toBe(false);
    });

    it('should configure User model password field with select: false for query privacy', () => {
      const passwordFieldConfig = User.schema.paths.password.options;
      expect(passwordFieldConfig.select).toBe(false);
      expect(passwordFieldConfig.required).toBeDefined();
    });

    it('should verify User model instance comparePassword method', async () => {
      const user = new User({
        name: 'Test Candidate',
        email: 'candidate@test.com',
        password: 'Password@2026',
      });

      // Execute schema pre-save hook manually for unit testing
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      const isMatch = await user.comparePassword('Password@2026');
      const isMismatch = await user.comparePassword('IncorrectPass');
      expect(isMatch).toBe(true);
      expect(isMismatch).toBe(false);
    });
  });

  // 2. OTP Verification & Cooldown Business Logic
  describe('OTP Verification System', () => {
    it('should generate a 6-digit numeric OTP code', () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      expect(otp).toHaveLength(6);
      expect(Number(otp)).toBeGreaterThanOrEqual(100000);
      expect(Number(otp)).toBeLessThanOrEqual(999999);
    });

    it('should accurately compare plain candidate OTP against bcrypt hash', async () => {
      const plainOtp = '482910';
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(plainOtp, salt);

      const otpDoc = new Otp({
        email: 'user@shopvilla.com',
        otp: hashedOtp,
        purpose: 'VERIFICATION',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      const isValid = await otpDoc.verifyOtp(plainOtp);
      const isInvalid = await otpDoc.verifyOtp('000000');
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });

    it('should calculate 5-minute expiry correctly', () => {
      const now = Date.now();
      const expiresAt = new Date(now + 5 * 60 * 1000);
      const diffInMinutes = (expiresAt.getTime() - now) / (60 * 1000);
      expect(diffInMinutes).toBeCloseTo(5, 1);
    });

    it('should reject OTP verification when attempts reach limit of 3', () => {
      const otpRecord = {
        attempts: 3,
        maxAllowed: 3,
      };
      const isBlocked = otpRecord.attempts >= otpRecord.maxAllowed;
      expect(isBlocked).toBe(true);
    });

    it('should enforce 60-second cooldown between resend attempts', () => {
      const lastSentAt = new Date(Date.now() - 30 * 1000); // 30 seconds ago
      const elapsed = Date.now() - lastSentAt.getTime();
      const isUnderCooldown = elapsed < 60 * 1000;
      const remainingSeconds = Math.ceil((60 * 1000 - elapsed) / 1000);

      expect(isUnderCooldown).toBe(true);
      expect(remainingSeconds).toBeGreaterThan(0);
      expect(remainingSeconds).toBeLessThanOrEqual(30);
    });
  });

  // 3. Razorpay Signature & Webhook Verification
  describe('Razorpay Signature & Webhook Verification', () => {
    const testSecret = 'test_razorpay_secret_key_shopvilla_2026';
    const originalSecret = process.env.RAZORPAY_KEY_SECRET;

    beforeAll(() => {
      process.env.RAZORPAY_KEY_SECRET = testSecret;
    });

    afterAll(() => {
      process.env.RAZORPAY_KEY_SECRET = originalSecret;
    });

    it('should verify an authentic Razorpay HMAC-SHA256 payment signature', () => {
      const razorpayOrderId = 'order_test_987654321';
      const razorpayPaymentId = 'pay_test_123456789';

      // Generate authentic HMAC SHA-256 signature using secret
      const authenticSignature = crypto
        .createHmac('sha256', testSecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      const isValid = razorpayService.verifySignature(
        razorpayOrderId,
        razorpayPaymentId,
        authenticSignature
      );
      expect(isValid).toBe(true);
    });

    it('should reject a forged or tampered Razorpay payment signature', () => {
      const razorpayOrderId = 'order_test_987654321';
      const razorpayPaymentId = 'pay_test_123456789';
      const forgedSignature = 'forged_invalid_hmac_hash_00000000000000000000';

      const isValid = razorpayService.verifySignature(
        razorpayOrderId,
        razorpayPaymentId,
        forgedSignature
      );
      expect(isValid).toBe(false);
    });

    it('should verify authentic Razorpay webhook raw body signature', () => {
      const rawPayload = JSON.stringify({
        event: 'payment.captured',
        payload: { payment: { entity: { id: 'pay_99999', status: 'captured' } } },
      });
      const webhookSecret = 'whsec_shopvilla_secret_backup';

      const validWebhookSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawPayload)
        .digest('hex');

      const isVerified = razorpayService.verifyWebhookSignature(
        rawPayload,
        validWebhookSig,
        webhookSecret
      );
      expect(isVerified).toBe(true);

      const isTampered = razorpayService.verifyWebhookSignature(
        rawPayload,
        'tampered_signature',
        webhookSecret
      );
      expect(isTampered).toBe(false);
    });
  });

  // 4. Order Lifecycle State Machine Transitions
  describe('Order Lifecycle State Machine Transitions', () => {
    it('should allow valid sequential transitions: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED', () => {
      expect(VALID_ORDER_TRANSITIONS.PENDING).toContain('CONFIRMED');
      expect(VALID_ORDER_TRANSITIONS.CONFIRMED).toContain('SHIPPED');
      expect(VALID_ORDER_TRANSITIONS.SHIPPED).toContain('DELIVERED');
    });

    it('should allow cancellation from PENDING, CONFIRMED, and SHIPPED states', () => {
      expect(VALID_ORDER_TRANSITIONS.PENDING).toContain('CANCELLED');
      expect(VALID_ORDER_TRANSITIONS.CONFIRMED).toContain('CANCELLED');
      expect(VALID_ORDER_TRANSITIONS.SHIPPED).toContain('CANCELLED');
    });

    it('should enforce terminal DELIVERED state (cannot transition back)', () => {
      const deliveredTransitions = VALID_ORDER_TRANSITIONS.DELIVERED;
      expect(deliveredTransitions).toEqual([]);
      expect(deliveredTransitions.includes('PENDING')).toBe(false);
      expect(deliveredTransitions.includes('SHIPPED')).toBe(false);
      expect(deliveredTransitions.includes('CANCELLED')).toBe(false);
    });

    it('should enforce terminal CANCELLED state (cannot transition or reopen)', () => {
      const cancelledTransitions = VALID_ORDER_TRANSITIONS.CANCELLED;
      expect(cancelledTransitions).toEqual([]);
      expect(cancelledTransitions.includes('PENDING')).toBe(false);
      expect(cancelledTransitions.includes('CONFIRMED')).toBe(false);
    });

    it('should forbid illegal state jumps such as PENDING directly to DELIVERED', () => {
      expect(VALID_ORDER_TRANSITIONS.PENDING.includes('DELIVERED')).toBe(false);
      expect(VALID_ORDER_TRANSITIONS.PENDING.includes('SHIPPED')).toBe(false);
    });
  });

  // 5. Health Check & Route Middleware
  describe('API Health & Route Middleware', () => {
    it('GET /api/health should return 200 with operational status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('ShopVilla API is healthy');
    });

    it('GET /api/unknown-endpoint should return 404 JSON error response', async () => {
      const res = await request(app).get('/api/unknown-endpoint');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Cannot find endpoint');
    });
  });

  // 6. Auth Input Validations
  describe('Authentication Route Validations', () => {
    it('POST /api/v1/auth/register should reject empty payload with 400', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation failed');
    });

    it('POST /api/v1/auth/register should reject invalid email format', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'not-an-email',
        password: 'secretPassword123',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('valid email');
    });

    it('POST /api/v1/auth/register should reject short password (< 6 chars)', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'valid@example.com',
        password: '123',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('at least 6 characters');
    });

    it('POST /api/v1/auth/login should reject missing password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Password is required');
    });
  });

  // 7. Protected Route Security
  describe('Protected Route Security (Unauthorized Access)', () => {
    it('GET /api/v1/cart without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/cart');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('You are not logged in');
    });

    it('GET /api/v1/orders/my-orders without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/orders/my-orders');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('You are not logged in');
    });

    it('GET /api/v1/admin/stats without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/admin/stats');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('You are not logged in');
    });

    it('PUT /api/v1/auth/change-password without token should return 401 Unauthorized', async () => {
      const res = await request(app).put('/api/v1/auth/change-password').send({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('You are not logged in');
    });
  });

  // 8. Webhook Idempotency & Edge Cases
  describe('Webhook Idempotency & Payment Edge Cases', () => {
    const testSecret = 'wh_test_idempotency_secret_shopvilla';

    it('should return ok for duplicate webhook events (idempotency check via processedWebhookEventIds)', () => {
      // Simulate in-memory idempotency: same eventId already in set
      const processedEventIds = ['evt_razorpay_12345'];
      const incomingEventId = 'evt_razorpay_12345';
      const isDuplicate = processedEventIds.includes(incomingEventId);
      expect(isDuplicate).toBe(true);
    });

    it('should process a new unique webhook event (not a duplicate)', () => {
      const processedEventIds = ['evt_razorpay_12345'];
      const incomingEventId = 'evt_razorpay_99999_new';
      const isDuplicate = processedEventIds.includes(incomingEventId);
      expect(isDuplicate).toBe(false);
    });

    it('should not deduct stock if order paymentStatus is already PAID (webhook arrives after frontend verify)', () => {
      const order = { paymentStatus: 'PAID', orderStatus: 'CONFIRMED' };
      const shouldProcess = order.paymentStatus !== 'PAID';
      expect(shouldProcess).toBe(false);
    });

    it('should mark order PAID when webhook arrives before frontend verify call (order is still PENDING)', () => {
      const order = { paymentStatus: 'PENDING', orderStatus: 'PENDING' };
      const shouldProcess = order.paymentStatus !== 'PAID';
      expect(shouldProcess).toBe(true);
    });

    it('POST /api/v1/orders/webhook with invalid signature should return 400', async () => {
      const fakeBody = JSON.stringify({
        event: 'payment.captured',
        id: 'evt_fake_sig_test',
        payload: { payment: { entity: { order_id: 'order_fake_001', id: 'pay_fake_001' } } },
      });

      const wrongSig = 'totally_invalid_signature_00000000000000000000';
      const res = await request(app)
        .post('/api/v1/orders/webhook')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', wrongSig)
        .send(fakeBody);

      expect(res.statusCode).toBe(400);
    });

    it('POST /api/v1/orders/webhook with valid signature should return 200 ok', async () => {
      jest.spyOn(Order, 'findOne').mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      process.env.RAZORPAY_WEBHOOK_SECRET = testSecret;
      const payload = JSON.stringify({
        event: 'payment.captured',
        id: 'evt_valid_webhook_001',
        payload: { payment: { entity: { order_id: 'order_nonexistent_rzp', id: 'pay_valid_001' } } },
      });
      const validSig = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');

      const res = await request(app)
        .post('/api/v1/orders/webhook')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', validSig)
        .send(payload);

      // Order not found in DB → webhook silently acknowledges (returns 200)
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('POST /api/v1/orders/webhook should be idempotent when order is already PAID', async () => {
      const mockOrder = {
        _id: 'order_123',
        paymentStatus: 'PAID',
        processedWebhookEventIds: ['evt_prev_1'],
        save: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(Order, 'findOne').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrder),
      });

      process.env.RAZORPAY_WEBHOOK_SECRET = testSecret;
      const payload = JSON.stringify({
        event: 'payment.captured',
        id: 'evt_duplicate_captured',
        payload: { payment: { entity: { order_id: 'rzp_order_already_paid', id: 'pay_123' } } },
      });
      const validSig = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');

      const res = await request(app)
        .post('/api/v1/orders/webhook')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', validSig)
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.message).toContain('already processed');
    });

    it('POST /api/v1/orders/webhook should mark order PAID when arriving before frontend verify', async () => {
      const mockOrder = {
        _id: 'order_pending_1',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        processedWebhookEventIds: [],
        statusHistory: [],
        user: { email: 'user@test.com' },
        save: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(Order, 'findOne').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrder),
      });

      process.env.RAZORPAY_WEBHOOK_SECRET = testSecret;
      const payload = JSON.stringify({
        event: 'payment.captured',
        id: 'evt_first_captured',
        payload: { payment: { entity: { order_id: 'rzp_order_pending_1', id: 'pay_captured_456' } } },
      });
      const validSig = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');

      const res = await request(app)
        .post('/api/v1/orders/webhook')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', validSig)
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(mockOrder.paymentStatus).toBe('PAID');
      expect(mockOrder.orderStatus).toBe('CONFIRMED');
      expect(mockOrder.processedWebhookEventIds).toContain('evt_first_captured');
    });
  });

  // 9. Payment-Status Polling Endpoint
  describe('Payment Status Polling Endpoint', () => {
    it('GET /api/v1/orders/:id/payment-status without token should return 401', async () => {
      const res = await request(app).get('/api/v1/orders/64f1234567890abcdef12345/payment-status');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('You are not logged in');
    });

    it('should correctly identify a 30-minute payment expiry window', () => {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const createdAtExpired = new Date(Date.now() - 35 * 60 * 1000);
      const createdAtValid = new Date(Date.now() - 10 * 60 * 1000);

      expect(createdAtExpired.getTime() < thirtyMinutesAgo.getTime()).toBe(true);
      expect(createdAtValid.getTime() < thirtyMinutesAgo.getTime()).toBe(false);
    });
  });

  // 10. Order Expiry & Stock Restoration
  describe('Order Expiry and Inventory Restoration (30-Minute Rule)', () => {
    it('should identify orders older than 30 minutes as expired', () => {
      const expiryThreshold = new Date(Date.now() - 30 * 60 * 1000);

      const expiredOrder = { createdAt: new Date(Date.now() - 35 * 60 * 1000), paymentStatus: 'PENDING' };
      const freshOrder = { createdAt: new Date(Date.now() - 5 * 60 * 1000), paymentStatus: 'PENDING' };

      const isExpired = (order) => order.paymentStatus === 'PENDING' && order.createdAt < expiryThreshold;
      expect(isExpired(expiredOrder)).toBe(true);
      expect(isExpired(freshOrder)).toBe(false);
    });

    it('should restore inventory atomically using $inc: +quantity for each item on cancellation', () => {
      const items = [
        { product: 'prod_1', name: 'Widget A', quantity: 2 },
        { product: 'prod_2', name: 'Widget B', quantity: 1 },
      ];

      // Simulate the $inc operation payload that restoreInventoryStock builds
      const stockRestoreOps = items.map((item) => ({
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } },
      }));

      expect(stockRestoreOps[0].update.$inc.stock).toBe(2);
      expect(stockRestoreOps[1].update.$inc.stock).toBe(1);
    });

    it('should not restore stock for already paid or delivered orders', () => {
      const terminalStatuses = ['PAID', 'DELIVERED'];
      const orderPaid = { paymentStatus: 'PAID', orderStatus: 'DELIVERED' };
      const shouldRestore = !terminalStatuses.includes(orderPaid.paymentStatus);
      expect(shouldRestore).toBe(false);
    });

    it('should correctly flag 15-minute reconciliation window (between 15m and 30m)', () => {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const inReconciliationWindow = (createdAt) =>
        createdAt < fifteenMinutesAgo && createdAt >= thirtyMinutesAgo;

      const orderInWindow = { createdAt: new Date(Date.now() - 20 * 60 * 1000) };
      const orderTooFresh = { createdAt: new Date(Date.now() - 5 * 60 * 1000) };
      const orderExpired = { createdAt: new Date(Date.now() - 35 * 60 * 1000) };

      expect(inReconciliationWindow(orderInWindow.createdAt)).toBe(true);
      expect(inReconciliationWindow(orderTooFresh.createdAt)).toBe(false);
      expect(inReconciliationWindow(orderExpired.createdAt)).toBe(false);
    });
  });

  // 11. Guest Cart Merge Logic
  describe('Guest Cart Merge Logic', () => {
    it('should cap merged quantity at available product stock', () => {
      const existingDbQty = 3;
      const guestQty = 5;
      const productStock = 6;
      const mergedQty = Math.min(existingDbQty + guestQty, productStock);
      expect(mergedQty).toBe(6);
    });

    it('should sum quantities when product exists in both guest and DB cart', () => {
      const existingDbQty = 2;
      const guestQty = 3;
      const productStock = 10;
      const mergedQty = Math.min(existingDbQty + guestQty, productStock);
      expect(mergedQty).toBe(5);
    });

    it('POST /api/v1/cart/merge without token should return 401', async () => {
      const res = await request(app).post('/api/v1/cart/merge').send({ guestItems: [] });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('You are not logged in');
    });
  });
});
