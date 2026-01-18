const crypto = require('crypto');
const ApiKey = require('../models/apiKey.model');

const listKeys = async (req, res) => {
  try {
    const userId = req.user?.id;
    const keys = await ApiKey.find({ isActive: true, userId }).select('-hashedKey');
    res.json(keys);
  } catch (error) {
    console.error('List keys error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
};

const createKey = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Key name is required' });
    }

    // Generate API key
    const apiKey = 'mk_' + crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyId = crypto.randomBytes(8).toString('hex');

    const keyRecord = await ApiKey.create({
      keyId,
      hashedKey,
      fullKey: apiKey,
      name,
      userId: req.user?.id || 'dashboard-user',
      isActive: true
    });

    res.json({
      keyId: keyRecord.keyId,
      name: keyRecord.name,
      key: apiKey,
      createdAt: keyRecord.createdAt
    });
  } catch (error) {
    console.error('Create key error:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
};

const deleteKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    
    await ApiKey.findOneAndUpdate(
      { keyId },
      { isActive: false }
    );

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Delete key error:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
};

module.exports = { listKeys, createKey, deleteKey };