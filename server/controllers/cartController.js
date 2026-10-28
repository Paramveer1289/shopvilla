// Cart Controller
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get Current User's Cart (with DB price & stock re-validation)
const getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images stock category',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const changes = [];
  let cartModified = false;

  // Filter and re-validate products against real-time DB inventory
  const validatedItems = [];
  for (const item of cart.items) {
    if (!item.product) {
      changes.push('An item in your cart is no longer available and was removed.');
      cartModified = true;
      continue;
    }

    if (item.product.stock <= 0) {
      changes.push(`"${item.product.name}" is currently out of stock and was removed from your bag.`);
      cartModified = true;
      continue;
    }

    if (item.quantity > item.product.stock) {
      changes.push(`Quantity for "${item.product.name}" was adjusted from ${item.quantity} to available stock (${item.product.stock}).`);
      item.quantity = item.product.stock;
      cartModified = true;
    }

    validatedItems.push(item);
  }

  if (cartModified) {
    cart.items = validatedItems;
    await cart.save();
  }

  // Compute calculated subtotal strictly from DB product prices
  const subtotal = cart.items.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  res.status(200).json({
    success: true,
    cart,
    subtotal,
    itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    changes,
  });
});

// Add Item to Cart
const addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.stock < quantity) {
    return next(
      new AppError(
        `Insufficient stock. Only ${product.stock} item(s) available in inventory.`,
        400
      )
    );
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + Number(quantity);
    if (newQty > product.stock) {
      return next(
        new AppError(
          `Cannot add more. You already have ${cart.items[existingItemIndex].quantity} in cart, and available stock is ${product.stock}.`,
          400
        )
      );
    }
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock category',
  });

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    cart,
  });
});

// Update Cart Item Quantity
const updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const qty = parseInt(quantity, 10);
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Item is not in your cart', 404));
  }

  if (qty <= 0) {
    // Remove if quantity reduced to 0 or less
    cart.items.splice(itemIndex, 1);
  } else {
    const product = await Product.findById(productId);
    if (product && qty > product.stock) {
      return next(
        new AppError(
          `Requested quantity (${qty}) exceeds available stock (${product.stock})`,
          400
        )
      );
    }
    cart.items[itemIndex].quantity = qty;
  }

  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock category',
  });

  res.status(200).json({
    success: true,
    cart,
  });
});

// Remove Item from Cart
const removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock category',
  });

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    cart,
  });
});

// Clear Entire Cart
const clearCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    cart,
  });
});

// Merge Guest Cart (from localStorage) into DB Cart upon Login
const mergeGuestCart = catchAsync(async (req, res, next) => {
  const { guestItems = [] } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  for (const guestItem of guestItems) {
    const productId = guestItem.productId || guestItem.product?._id || guestItem.product;
    const requestedQty = Number(guestItem.quantity) || 1;

    const product = await Product.findById(productId);
    if (!product || product.stock <= 0) continue;

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      // Sum quantities and cap at available stock
      const summedQty = cart.items[existingIndex].quantity + requestedQty;
      cart.items[existingIndex].quantity = Math.min(summedQty, product.stock);
    } else {
      cart.items.push({
        product: productId,
        quantity: Math.min(requestedQty, product.stock),
      });
    }
  }

  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock category',
  });

  const subtotal = cart.items.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  res.status(200).json({
    success: true,
    message: 'Guest cart merged successfully',
    cart,
    subtotal,
    itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  mergeGuestCart,
};
