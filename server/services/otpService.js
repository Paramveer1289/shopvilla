// OTP Service
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Otp = require('../models/Otp');
const AppError = require('../utils/appError');

// Generate 6-digit numeric OTP and store hashed version in MongoDB with 5-minute expiry and 60-second cooldown check
const generateAndSaveOtp = async (email, purpose = 'VERIFICATION', userId = null, isResend = false) => {
  const existing = await Otp.findOne({ email, purpose });

  // Enforce 60-second cooldown on resends
  if (existing && existing.lastSentAt) {
    const elapsed = Date.now() - new Date(existing.lastSentAt).getTime();
    if (elapsed < 60 * 1000) {
      const waitSeconds = Math.ceil((60 * 1000 - elapsed) / 1000);
      throw new AppError(`Please wait ${waitSeconds} seconds before requesting a new OTP.`, 429);
    }
  }

  // Generate random 6-digit number string
  const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP with bcrypt (10 salt rounds) before persisting
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(plainOtp, salt);

  // Set 5-minute expiry timestamp
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Upsert: replace any existing unverified OTP for this email and purpose
  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      user: userId,
      email,
      otp: hashedOtp,
      purpose,
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return plainOtp;
};

// Verify candidate OTP against stored hash with max 3 attempts
const verifyOtp = async (email, candidateOtp, purpose = 'VERIFICATION') => {
  const record = await Otp.findOne({ email, purpose });

  if (!record) {
    throw new AppError('OTP has expired or is invalid. Please request a new code.', 400);
  }

  // Enforce max 3 attempts
  if (record.attempts >= 3) {
    await Otp.deleteOne({ _id: record._id });
    throw new AppError('Maximum attempts exceeded. This OTP has been invalidated. Please request a new code.', 429);
  }

  const isMatch = await record.verifyOtp(candidateOtp);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();

    const remaining = 3 - record.attempts;
    if (remaining <= 0) {
      await Otp.deleteOne({ _id: record._id });
      throw new AppError('Maximum attempts exceeded. This OTP has been invalidated.', 429);
    }

    throw new AppError(`Incorrect OTP. You have ${remaining} attempt(s) remaining.`, 400);
  }

  // OTP verified successfully: cleanup record
  await Otp.deleteOne({ _id: record._id });
  return true;
};

module.exports = {
  generateAndSaveOtp,
  verifyOtp,
};
