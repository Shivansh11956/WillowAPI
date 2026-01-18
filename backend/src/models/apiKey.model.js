const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  keyId: { type: String, required: true, unique: true },
  hashedKey: { type: String, required: true },
  fullKey: { type: String, required: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  requestCount: { type: Number, default: 0 },
  lastUsed: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ApiKey', apiKeySchema);