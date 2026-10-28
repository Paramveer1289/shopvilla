// Address Controller
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get All Addresses of Current User
const getAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('addresses');
  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

// Add New Delivery Address
const addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const {
    fullName,
    phone,
    line1,
    line2,
    landmark,
    city,
    state,
    pincode,
    isDefault,
  } = req.body;

  // If this is the first address, automatically make it default
  const shouldBeDefault = isDefault || user.addresses.length === 0;

  if (shouldBeDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push({
    fullName,
    phone,
    line1,
    line2,
    landmark,
    city,
    state,
    pincode,
    isDefault: shouldBeDefault,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    addresses: user.addresses,
  });
});

// Update Address
const updateAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  Object.assign(address, req.body);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    addresses: user.addresses,
  });
});

// Delete Address
const deleteAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  const wasDefault = address.isDefault;
  user.addresses.pull({ _id: req.params.addressId });

  // If the deleted address was the default, appoint the next one if available
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address removed successfully',
    addresses: user.addresses,
  });
});

// Set Address as Default
const setDefaultAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === req.params.addressId;
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Default address updated',
    addresses: user.addresses,
  });
});

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
