const crypto = require('crypto');
const ApiKey = require('../models/apiKey.model');

const authenticateApiKey = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'API key required' });
    }

    const apiKey = authHeader.substring(7);
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    const keyRecord = await ApiKey.findOne({ hashedKey, isActive: true });
    
    if (!keyRecord) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Update usage stats
    keyRecord.requestCount += 1;
    keyRecord.lastUsed = new Date();
    await keyRecord.save();

    req.apiKey = keyRecord;
    next();
  } catch (error) {
    console.error('API key auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = { authenticateApiKey };