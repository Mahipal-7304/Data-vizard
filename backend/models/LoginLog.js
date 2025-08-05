const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for failed login attempts
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  loginStatus: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String,
    default: 'unknown'
  },
  failureReason: {
    type: String,
    default: null // e.g., 'invalid_credentials', 'user_not_found'
  },
  sessionId: {
    type: String,
    default: null // for successful logins
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: {
    type: Date,
    default: null
  }
});

// Index for efficient queries
loginLogSchema.index({ email: 1, loginTime: -1 });
loginLogSchema.index({ userId: 1, loginTime: -1 });
loginLogSchema.index({ loginStatus: 1, loginTime: -1 });

module.exports = mongoose.model('LoginLog', loginLogSchema);
