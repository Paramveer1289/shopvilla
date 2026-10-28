// Database Seed Script
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Otp = require('./models/Otp');

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description:
      'Industry-leading noise cancellation optimized with two processors and 8 microphones. Exceptional sound quality engineered with high-resolution audio. Up to 30-hour battery life with ultra-fast charging.',
    price: 19990,
    deliveryCharge: 0,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 25,
    ratingAverage: 4.8,
    ratingCount: 12,
  },
  {
    name: 'Apple MacBook Air M3 (13.6-inch, 16GB RAM, 512GB SSD)',
    description:
      'Supercharged by the next-generation M3 chip, this ultra-thin MacBook Air delivers incredible power efficiency, stunning Liquid Retina display, MagSafe 3 charging, and 18-hour battery life.',
    price: 114900,
    deliveryCharge: 0,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 14,
    ratingAverage: 4.9,
    ratingCount: 18,
  },
  {
    name: 'Logitech MX Master 3S Ergonomic Wireless Mouse',
    description:
      'Quiet clicks with 8000 DPI track-on-glass sensor. MagSpeed electromagnetic scrolling that scrolls 1,000 lines per second. Multi-device pairing with cross-computer flow.',
    price: 7995,
    deliveryCharge: 0,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 40,
    ratingAverage: 4.7,
    ratingCount: 9,
  },
  {
    name: 'Keychron K2 Pro Wireless Mechanical Keyboard',
    description:
      'QMK/VIA wireless custom mechanical keyboard with hot-swappable switches, south-facing RGB backlighting, and acoustic sound dampening foam. Mac and Windows compatible.',
    price: 6999,
    deliveryCharge: 0,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 18,
    ratingAverage: 4.6,
    ratingCount: 7,
  },
  {
    name: 'Classic Vintage Leather Bomber Jacket',
    description:
      'Crafted from 100% genuine full-grain lambskin leather. Features ribbed cuffs and hem, premium YKK antique brass zippers, and smooth satin interior lining.',
    price: 4499,
    deliveryCharge: 0,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 20,
    ratingAverage: 4.5,
    ratingCount: 14,
  },
  {
    name: 'Nike Air Max 270 React Running Shoes',
    description:
      'Lightweight multi-layered breathable mesh upper with vibrant modern aesthetics. Features Nike largest heel Air unit yet for an ultra-plush, bounce-back stride.',
    price: 8995,
    deliveryCharge: 0,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 35,
    ratingAverage: 4.7,
    ratingCount: 22,
  },
  {
    name: 'Minimalist Titanium Chronograph Watch',
    description:
      '40mm matte titanium case with scratch-resistant sapphire crystal. Japanese quartz movement with dual sub-dials, date aperture, and 50m water resistance.',
    price: 8999,
    deliveryCharge: 0,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 12,
    ratingAverage: 4.8,
    ratingCount: 11,
  },
  {
    name: 'AeroPress Original Coffee Maker Chamber & Plunger',
    description:
      'Patented 3-in-1 brew technology combines the best of immersion, aeration, and espresso-style pressure. Brews exceptionally smooth, rich, grit-free coffee in 1 minute.',
    price: 2499,
    deliveryCharge: 0,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 50,
    ratingAverage: 4.9,
    ratingCount: 35,
  },
  {
    name: 'Fellow Stagg EKG Electric Gooseneck Kettle',
    description:
      'Precision pour spout with ergonomic balanced handle. Variable temperature control from 135°F to 212°F with high-resolution LCD screen and 60-minute heat hold mode.',
    price: 11999,
    deliveryCharge: 0,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 15,
    ratingAverage: 4.9,
    ratingCount: 8,
  },
  {
    name: 'Cast Iron Dutch Oven 5.5 Quart with Enamel Coating',
    description:
      'Heavy-duty cast iron delivers even heat distribution and superior heat retention. Dual side loop handles and stainless steel knob on tight-fitting lid.',
    price: 4299,
    deliveryCharge: 120,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 22,
    ratingAverage: 4.6,
    ratingCount: 16,
  },
  {
    name: 'Bowflex SelectTech 552 Adjustable Dumbbells (Pair)',
    description:
      'Adjusts from 5 to 52.5 lbs in 2.5 lb increments up to the first 25 lbs. Replaces 15 pairs of weights with an intuitive dial system for rapid resistance transitions.',
    price: 26900,
    deliveryCharge: 350,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 8,
    ratingAverage: 4.8,
    ratingCount: 19,
  },
  {
    name: 'Manduka PRO Yoga & Pilates Mat (6mm High Density)',
    description:
      'Ultra-dense cushioning protects joints while providing stable footing on any surface. Closed-cell surface prevents moisture and bacteria from absorbing into the mat.',
    price: 5999,
    deliveryCharge: 0,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 30,
    ratingAverage: 4.7,
    ratingCount: 15,
  },
  {
    name: 'Sony PlayStation 5 Slim Console (1TB SSD)',
    description:
      'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio technology.',
    price: 44990,
    deliveryCharge: 0,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 10,
    ratingAverage: 4.9,
    ratingCount: 42,
  },
  {
    name: 'Ray-Ban Classic Aviator Polarized Sunglasses',
    description:
      'Timeless teardrop aviator frame in polished gold with crystal green polarized lenses offering 100% UV400 protection and glare reduction.',
    price: 7990,
    deliveryCharge: 0,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 25,
    ratingAverage: 4.6,
    ratingCount: 18,
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    description:
      'Laser illuminates invisible dust on hard floors. Piezo sensor continuously sizes and counts dust particles, automatically ramping suction power.',
    price: 52900,
    deliveryCharge: 150,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 8,
    ratingAverage: 4.8,
    ratingCount: 14,
  },
  {
    name: 'Garmin Forerunner 265 GPS Running Smartwatch',
    description:
      'Brilliant AMOLED touchscreen display with wrist-based running dynamics, training readiness score, morning report, and multi-band GNSS tracking.',
    price: 39990,
    deliveryCharge: 0,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 12,
    ratingAverage: 4.8,
    ratingCount: 19,
  },
  {
    name: 'Hydro Flask Wide Mouth 32 oz Vacuum Water Bottle',
    description:
      'TempShield double-wall vacuum insulation keeps drinks cold for up to 24 hours or hot for 12 hours. BPA-free, 18/8 pro-grade stainless steel.',
    price: 2299,
    deliveryCharge: 45,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 45,
    ratingAverage: 4.7,
    ratingCount: 31,
  },
  {
    name: 'Designing Data-Intensive Applications by Martin Kleppmann',
    description:
      'The definitive guide to architecture, distributed systems, replication, partitioning, transactions, and stream processing for modern software engineers.',
    price: 1199,
    deliveryCharge: 40,
    category: 'Books',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 50,
    ratingAverage: 4.9,
    ratingCount: 65,
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description:
      'Robert C. Martin legendary handbook on writing readable, maintainable, and refactorable code with meaningful names, solid functions, and clean architecture.',
    price: 799,
    deliveryCharge: 40,
    category: 'Books',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 40,
    ratingAverage: 4.8,
    ratingCount: 54,
  },
  {
    name: 'CeraVe Hydrating Facial Cleanser (473ml)',
    description:
      'Developed with dermatologists. Cleanses and refreshes the skin without over-stripping or leaving it tight and dry. Contains 3 essential ceramides and hyaluronic acid.',
    price: 699,
    deliveryCharge: 40,
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 60,
    ratingAverage: 4.7,
    ratingCount: 29,
  },
  {
    name: 'Samsung 65-inch Crystal 4K UHD Smart TV',
    description:
      'Dynamic Crystal Color with realistic vibrant picture quality. Crystal Processor 4K upscaling, Motion Xcelerator, and built-in voice assistants.',
    price: 56990,
    deliveryCharge: 299,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 15,
    ratingAverage: 4.8,
    ratingCount: 26,
  },
  {
    name: 'Apple AirPods Pro (2nd Generation, USB-C)',
    description:
      'Up to 2x more Active Noise Cancellation. Adaptive Audio dynamically blends Transparency and Noise Cancellation. Personalized Spatial Audio with dynamic head tracking.',
    price: 21900,
    deliveryCharge: 0,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 22,
    ratingAverage: 4.9,
    ratingCount: 38,
  },
  {
    name: 'Levi\'s Men\'s 511 Slim Fit Stretch Denim Jeans',
    description:
      'A modern slim with room to move. Added stretch for all-day comfort and mobility. Classic 5-pocket styling crafted with sustainable Water<Less techniques.',
    price: 3199,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 35,
    ratingAverage: 4.6,
    ratingCount: 20,
  },
  {
    name: 'Nike Sportswear Club Fleece Pullover Hoodie',
    description:
      'Brushed-back fleece is soft and smooth against the skin. Hood with a drawstring offers adjustable coverage. Ribbed hem and cuffs keep the fit secure.',
    price: 2495,
    deliveryCharge: 0,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 28,
    ratingAverage: 4.7,
    ratingCount: 33,
  },
  {
    name: 'KitchenAid Artisan Series 5-Quart Tilt-Head Stand Mixer',
    description:
      'Durable metal construction with 10 speeds to gently knead, thoroughly mix, and whip ingredients. Includes 5-quart stainless steel bowl, flat beater, dough hook, and wire whip.',
    price: 32990,
    deliveryCharge: 250,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 10,
    ratingAverage: 4.9,
    ratingCount: 17,
  },
  {
    name: 'Ninja Professional Plus Blender with Auto-iQ (1400 Peak Watts)',
    description:
      'Total Crushing Blades crush ice to snow in seconds for smoothies and frozen drinks. 3 preset Auto-iQ programs take the guesswork out of drink making.',
    price: 8999,
    deliveryCharge: 90,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 18,
    ratingAverage: 4.7,
    ratingCount: 24,
  },
  {
    name: 'Fitbit Charge 6 Advanced Health & Fitness Tracker',
    description:
      'Built-in GPS, YouTube Music controls, Google Maps navigation, and 40+ exercise modes. 24/7 heart rate tracking and 7-day battery life.',
    price: 11999,
    deliveryCharge: 0,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 16,
    ratingAverage: 4.6,
    ratingCount: 15,
  },
  {
    name: 'Spalding NBA Official Performance Indoor Basketball',
    description:
      'Top-tier composite leather cover for exceptional grip and handling. Deep channel design provides superior control for drills and regulation tournament play.',
    price: 1799,
    deliveryCharge: 60,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 25,
    ratingAverage: 4.8,
    ratingCount: 19,
  },
  {
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear',
    description:
      'The #1 New York Times bestseller with over 15 million copies sold. A framework for improving every day with practical strategies for transforming micro-behaviors into extraordinary results.',
    price: 399,
    deliveryCharge: 35,
    category: 'Books',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 55,
    ratingAverage: 4.9,
    ratingCount: 88,
  },
  {
    name: 'The Pragmatic Programmer: Your Journey to Mastery (20th Anniversary Edition)',
    description:
      'Written by David Thomas and Andrew Hunt. One of the most significant books on software engineering, covering career development, architectural best practices, and code craftsmanship.',
    price: 1399,
    deliveryCharge: 40,
    category: 'Books',
    images: [
      'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 35,
    ratingAverage: 4.9,
    ratingCount: 47,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB database...');

    // Clear existing collections
    console.log('[Seed] Clearing previous data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Otp.deleteMany({}),
    ]);

    // 1. Create Default Users
    console.log('[Seed] Creating demo users...');
    const adminUser = await User.create({
      name: 'ShopVilla Administrator',
      email: 'admin@shopvilla.com',
      phone: '+91 9876543210',
      password: 'Admin@123456',
      role: 'admin',
      isVerified: true,
      addresses: [
        {
          fullName: 'ShopVilla HQ',
          phone: '+91 9876543210',
          line1: 'Tower 4, Cyber City, Phase 2',
          line2: 'Sector 24',
          landmark: 'Near Rapid Metro',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122002',
          isDefault: true,
        },
      ],
    });

    const demoUser = await User.create({
      name: 'Rohan Sharma',
      email: 'user@shopvilla.com',
      phone: '+91 9123456789',
      password: 'User@123456',
      role: 'user',
      isVerified: true,
      addresses: [
        {
          fullName: 'Rohan Sharma',
          phone: '+91 9123456789',
          line1: 'Flat 402, Sunshine Apartments',
          line2: '14th Main Road, Indiranagar',
          landmark: 'Opposite Metro Station',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true,
        },
        {
          fullName: 'Rohan Sharma (Office)',
          phone: '+91 9123456789',
          line1: 'Prestige Tech Park, Outer Ring Road',
          line2: 'Kadubeesanahalli',
          landmark: 'Near Marathahalli',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
          isDefault: false,
        },
      ],
    });

    // 2. Insert Products
    console.log('[Seed] Inserting catalog products...');
    const createdProducts = await Product.insertMany(sampleProducts);

    // 3. Add Sample Reviews
    console.log('[Seed] Generating sample product reviews...');
    await Review.create({
      user: demoUser._id,
      product: createdProducts[0]._id,
      rating: 5,
      comment:
        'The sound stage and noise cancelling on the WH-1000XM5 are mind-blowing! Battery easily lasts 3 full days of work.',
    });

    await Review.create({
      user: demoUser._id,
      product: createdProducts[1]._id,
      rating: 5,
      comment:
        'The M3 chip handles my programming workloads and Docker containers effortlessly. Silent fanless design is a dream.',
    });

    // 4. Create an Initial Sample Order for demo user
    console.log('[Seed] Creating demo historical order...');
    await Order.create({
      user: demoUser._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 1,
          image: createdProducts[0].images[0],
        },
      ],
      shippingAddress: demoUser.addresses[0],
      itemsTotal: createdProducts[0].price,
      shippingFee: 0,
      totalAmount: createdProducts[0].price,
      paymentMethod: 'ONLINE',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      razorpayOrderId: 'order_seed_demo_101',
      razorpayPaymentId: 'pay_seed_demo_202',
      statusHistory: [
        {
          status: 'CONFIRMED',
          note: 'Payment verified successfully via Razorpay',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'SHIPPED',
          note: 'Package handed over to BlueDart courier (AWB: 98127391)',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'DELIVERED',
          note: 'Package received by customer',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    console.log('\n=================================================');
    console.log('  Database Seeding Completed Successfully! ');
    console.log('-------------------------------------------------');
    console.log('  Admin Account:');
    console.log('    Email:    admin@shopvilla.com');
    console.log('    Password: Admin@123456');
    console.log('-------------------------------------------------');
    console.log('  Customer Account:');
    console.log('    Email:    user@shopvilla.com');
    console.log('    Password: User@123456');
    console.log('-------------------------------------------------');
    console.log(`  Products Seeded: ${createdProducts.length}`);
    console.log('=================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
