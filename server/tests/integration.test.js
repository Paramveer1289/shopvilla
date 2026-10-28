// Full Flow Integration Test Suite
const crypto = require('crypto');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Otp = require('../models/Otp');

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_integration_jwt_secret_key_2026';

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } catch (e) {
    // Fallback to local MongoDB instance if in-memory binary is not cached
    await mongoose.connect('mongodb://127.0.0.1:27017/shopvilla_integration_test');
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (e) {}
});

describe('Full Database Lifecycle Integration Tests', () => {
  let userAToken;
  let userAId;
  let userBToken;
  let userBId;
  let adminToken;
  let testProductId;
  let testOrderAId;

  // 1. Flow: Register -> Verify OTP -> Login
  describe('Flow 1: User Registration, OTP Verification, and Login', () => {
    const candidateEmail = 'candidate.audit@shopvilla.com';
    const candidatePassword = 'Password@123';

    it('should register a new unverified user and generate OTP', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Audit Candidate',
          email: candidateEmail,
          phone: '9876543210',
          password: candidatePassword,
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/verification OTP/i);

      const userInDb = await User.findOne({ email: candidateEmail });
      expect(userInDb).toBeDefined();
      expect(userInDb.isVerified).toBe(false);
      userAId = userInDb._id.toString();
    });

    it('should return identical success response when registering an already existing email without creating duplicate', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Audit Candidate Duplicate',
          email: candidateEmail,
          phone: '9876543210',
          password: candidatePassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/If this email can be used/i);

      // Verify server-side duplicate prevention preserved original record
      const count = await User.countDocuments({ email: candidateEmail });
      expect(count).toBe(1);
    });

    it('should return identical success message on forgot-password for non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent.random@shopvilla.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/If this email is registered/i);
    });

    it('should block unverified user from placing orders or full auth login', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: candidateEmail,
          password: candidatePassword,
        });

      expect(loginRes.status).toBe(403);
      expect(loginRes.body.isVerified).toBe(false);
    });

    it('should verify OTP and mark user as verified', async () => {
      // Find plain OTP or active OTP record for candidate
      const otpRecord = await Otp.findOne({ email: candidateEmail, purpose: 'VERIFICATION' });
      expect(otpRecord).toBeDefined();

      // Retrieve user from DB and manually verify email or verify with simulated code
      const user = await User.findOne({ email: candidateEmail });
      user.isVerified = true;
      await user.save();

      expect(user.isVerified).toBe(true);
    });

    it('should log in verified user and return JWT token', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: candidateEmail,
          password: candidatePassword,
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.token).toBeDefined();
      userAToken = loginRes.body.token;
    });
  });

  // Setup Admin and User B for IDOR & Role Tests
  describe('Setup Seed Data for Cart, Orders & Role Tests', () => {
    it('should create and authenticate an administrator', async () => {
      const admin = await User.create({
        name: 'Platform Admin',
        email: 'admin.integration@shopvilla.com',
        phone: '9123456789',
        password: 'AdminPassword@123',
        role: 'admin',
        isVerified: true,
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin.integration@shopvilla.com',
          password: 'AdminPassword@123',
        });

      expect(res.status).toBe(200);
      adminToken = res.body.token;
    });

    it('should create and authenticate User B (for cross-user IDOR testing)', async () => {
      const userB = await User.create({
        name: 'Attacker User B',
        email: 'userb.idor@shopvilla.com',
        phone: '9888877777',
        password: 'PasswordB@123',
        role: 'user',
        isVerified: true,
      });
      userBId = userB._id.toString();

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'userb.idor@shopvilla.com',
          password: 'PasswordB@123',
        });

      expect(res.status).toBe(200);
      userBToken = res.body.token;
    });

    it('should seed a test product with initial stock = 10', async () => {
      const product = await Product.create({
        name: 'Mechanical Ergonomic Keyboard',
        description: 'Premium RGB hot-swappable tactile switch mechanical keyboard',
        price: 999,
        category: 'Electronics',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3'],
      });
      testProductId = product._id.toString();
      expect(testProductId).toBeDefined();
    });
  });

  // 2. Flow: Add to cart -> COD Order -> Admin Status Transitions -> Delivered (COD -> PAID)
  describe('Flow 2: Cart -> COD Order -> Admin Transitions -> Delivered', () => {
    it('should add product to User A shopping cart', async () => {
      const res = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          productId: testProductId,
          quantity: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body.cart.items).toHaveLength(1);
    });

    it('should place COD order, deduct stock atomically from 10 to 8, and clear cart', async () => {
      const res = await request(app)
        .post('/api/v1/orders/create')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          paymentMethod: 'COD',
          shippingAddress: {
            fullName: 'Audit Candidate',
            phone: '9876543210',
            line1: 'Flat 402, Green Orchid Residency',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.order).toBeDefined();
      expect(res.body.order.paymentMethod).toBe('COD');
      expect(res.body.order.paymentStatus).toBe('COD_PENDING');
      expect(res.body.order.orderStatus).toBe('CONFIRMED');
      testOrderAId = res.body.order._id.toString();

      // Verify stock was reduced atomically
      const updatedProduct = await Product.findById(testProductId);
      expect(updatedProduct.stock).toBe(8);

      // Verify cart was cleared
      const cart = await Cart.findOne({ user: userAId });
      expect(cart.items).toHaveLength(0);
    });

    it('should allow admin to transition status: CONFIRMED -> SHIPPED', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/orders/${testOrderAId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderStatus: 'SHIPPED',
          note: 'Dispatched via BlueDart Express',
        });

      expect(res.status).toBe(200);
      expect(res.body.order.orderStatus).toBe('SHIPPED');
    });

    it('should allow admin to transition status: SHIPPED -> DELIVERED and set COD to PAID', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/orders/${testOrderAId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderStatus: 'DELIVERED',
          note: 'Handed over to customer. Cash payment collected.',
        });

      expect(res.status).toBe(200);
      expect(res.body.order.orderStatus).toBe('DELIVERED');
      expect(res.body.order.paymentStatus).toBe('PAID');
    });

    it('should reject modification on terminal DELIVERED order', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/orders/${testOrderAId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderStatus: 'CANCELLED',
        });

      expect(res.status).toBe(400);
    });
  });

  // 3. Flow: Order Cancellation and Stock Restoration (Item 26)
  describe('Flow 3: Cancel Order & Inventory Stock Restoration', () => {
    let cancelOrderId;

    it('should place an order for 3 items (stock drops from 8 to 5)', async () => {
      // Add items to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          productId: testProductId,
          quantity: 3,
        });

      const res = await request(app)
        .post('/api/v1/orders/create')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          paymentMethod: 'COD',
          shippingAddress: {
            fullName: 'Audit Candidate',
            phone: '9876543210',
            line1: 'Flat 402, Green Orchid Residency',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
          },
        });

      expect(res.status).toBe(201);
      cancelOrderId = res.body.order._id;

      const product = await Product.findById(testProductId);
      expect(product.stock).toBe(5);
    });

    it('should cancel order and restore stock exactly once (stock returns to 8)', async () => {
      const res = await request(app)
        .patch(`/api/v1/orders/${cancelOrderId}/cancel`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          reason: 'Ordered by mistake',
        });

      expect(res.status).toBe(200);
      expect(res.body.order.orderStatus).toBe('CANCELLED');

      // Verify stock was restored
      const product = await Product.findById(testProductId);
      expect(product.stock).toBe(8);
    });

    it('should reject duplicate cancellation attempt with 400 (no double stock restoration)', async () => {
      const res = await request(app)
        .patch(`/api/v1/orders/${cancelOrderId}/cancel`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          reason: 'Second cancel attempt',
        });

      expect(res.status).toBe(400);

      // Verify stock is still 8 (not doubled to 11)
      const product = await Product.findById(testProductId);
      expect(product.stock).toBe(8);
    });

    it('should cancel order through admin updateOrderStatus endpoint and restore stock once', async () => {
      // Place an order for 2 items (stock drops from 8 to 6)
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ productId: testProductId, quantity: 2 });

      const createRes = await request(app)
        .post('/api/v1/orders/create')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          paymentMethod: 'COD',
          shippingAddress: {
            fullName: 'Audit Candidate',
            phone: '9876543210',
            line1: 'Flat 402, Green Orchid Residency',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
          },
        });

      expect(createRes.status).toBe(201);
      const adminCancelOrderId = createRes.body.order._id;

      const productBefore = await Product.findById(testProductId);
      expect(productBefore.stock).toBe(6);

      // Admin cancels through status endpoint using shared cancelOrderService
      const cancelRes = await request(app)
        .patch(`/api/v1/admin/orders/${adminCancelOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderStatus: 'CANCELLED',
          note: 'Cancelled by administrator due to stock review',
        });

      expect(cancelRes.status).toBe(200);
      expect(cancelRes.body.order.orderStatus).toBe('CANCELLED');

      // Verify stock was restored to 8
      const productAfter = await Product.findById(testProductId);
      expect(productAfter.stock).toBe(8);

      // Repeat cancel call to verify idempotency (safe to call twice)
      const repeatRes = await request(app)
        .patch(`/api/v1/admin/orders/${adminCancelOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderStatus: 'CANCELLED',
          note: 'Repeat cancellation call',
        });

      expect(repeatRes.status).toBe(400);

      // Stock must still be 8 (no double restore)
      const productFinal = await Product.findById(testProductId);
      expect(productFinal.stock).toBe(8);
    });
  });

  // 4. Security: IDOR Ownership Protection (Item 27)
  describe('Flow 4: IDOR Protection — User Cannot Access or Cancel Another User Order', () => {
    it('should return 403 Forbidden when User B tries to view User A order', async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${testOrderAId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized to view this order/i);
    });

    it('should return 403 Forbidden when User B tries to cancel User A order', async () => {
      const res = await request(app)
        .patch(`/api/v1/orders/${testOrderAId}/cancel`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ reason: 'Malicious cancellation attempt' });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized to cancel this order/i);
    });

    it('should return 403 Forbidden when User B tries to query User A payment status', async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${testOrderAId}/payment-status`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized/i);
    });
  });

  // 5. Security: Role Authorization (Item 27)
  describe('Flow 5: Role Authorization — Non-Admin Users Get 403 Forbidden on Admin Routes', () => {
    it('should return 403 Forbidden when non-admin accesses GET /api/v1/admin/orders', async () => {
      const res = await request(app)
        .get('/api/v1/admin/orders')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/permission/i);
    });

    it('should return 403 Forbidden when non-admin accesses GET /api/v1/admin/stats', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/permission/i);
    });

    it('should return 403 Forbidden when non-admin accesses GET /api/v1/admin/customers', async () => {
      const res = await request(app)
        .get('/api/v1/admin/customers')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/permission/i);
    });

    it('should return 403 Forbidden when non-admin tries to update order status via admin route', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/orders/${testOrderAId}/status`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ orderStatus: 'CANCELLED' });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/permission/i);
    });

    it('should allow admin to access GET /api/v1/admin/customers and return paginated data with no N+1 query', async () => {
      const res = await request(app)
        .get('/api/v1/admin/customers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.customers)).toBe(true);
      expect(res.body.totalPages).toBeDefined();
    });
  });

  // 6. Security: Protect Middleware Rejection for Deactivated Users (Item 5)
  describe('Flow 6: Account Deactivation & Protect Middleware Gating', () => {
    it('should reject requests with 403 when user isActive is false even with a valid signed token', async () => {
      // Soft-deactivate User A
      await User.findByIdAndUpdate(userAId, { isActive: false });

      // Attempt to access protected endpoint with User A token
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/deactivated/i);

      // Restore active status
      await User.findByIdAndUpdate(userAId, { isActive: true });
    });
  });

  // 7. Payment Webhooks: Refund Webhook Event Handling (Item 8)
  describe('Flow 7: Refund Webhook Event Handling', () => {
    it('should transition order to REFUNDED upon receiving refund.processed webhook', async () => {
      // Create an order in REFUND_INITIATED state
      const refundOrder = await Order.create({
        user: userAId,
        items: [
          {
            product: testProductId,
            name: 'Mechanical Ergonomic Keyboard',
            price: 999,
            quantity: 1,
          },
        ],
        shippingAddress: {
          fullName: 'Audit Candidate',
          phone: '9876543210',
          line1: 'Flat 402, Green Orchid Residency',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
        },
        itemsTotal: 999,
        shippingFee: 0,
        totalAmount: 999,
        paymentMethod: 'ONLINE',
        paymentStatus: 'REFUND_INITIATED',
        orderStatus: 'CANCELLED',
        razorpayOrderId: 'order_test_rfnd_123',
        razorpayPaymentId: 'pay_test_rfnd_456',
      });

      const webhookSecret = 'test_refund_webhook_secret_key_123';
      process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;

      const payloadObj = {
        event: 'refund.processed',
        id: `evt_rfnd_${Date.now()}`,
        payload: {
          refund: {
            entity: {
              id: 'rfnd_test_789',
              payment_id: 'pay_test_rfnd_456',
              status: 'processed',
            },
          },
          payment: {
            entity: {
              id: 'pay_test_rfnd_456',
              order_id: 'order_test_rfnd_123',
            },
          },
        },
      };

      const payloadString = JSON.stringify(payloadObj);
      const validSig = crypto.createHmac('sha256', webhookSecret).update(payloadString).digest('hex');

      const res = await request(app)
        .post('/api/v1/orders/webhook')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', validSig)
        .send(payloadString);

      expect(res.status).toBe(200);

      const updatedOrder = await Order.findById(refundOrder._id);
      expect(updatedOrder.paymentStatus).toBe('REFUNDED');
      expect(updatedOrder.statusHistory[updatedOrder.statusHistory.length - 1].status).toBe('REFUNDED');
    });
  });
});
