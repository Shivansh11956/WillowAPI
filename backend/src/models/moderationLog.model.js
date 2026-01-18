const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  userId: { type: String },
  apiKeyId: { type: String },
  originalMessage: { type: String, required: true },
  action: { type: String, enum: ['blocked', 'flagged', 'allowed'], required: true },
  reason: { type: String },
  suggestedAlternative: { type: String },
  model: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ModerationLog', moderationLogSchema);