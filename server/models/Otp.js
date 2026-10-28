// OTP (One-Time Password) Model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['VERIFICATION', 'RESET_PASSWORD', 'LOGIN_2FA'],
      default: 'VERIFICATION',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: MongoDB auto-deletes expired documents
    },
  },
  { timestamps: true }
);

// Method: Compare candidate plaintext OTP with stored hash
otpSchema.methods.verifyOtp = async function (candidateOtp) {
  return await bcrypt.compare(candidateOtp, this.otp);
};

module.exports = mongoose.model('Otp', otpSchema);
