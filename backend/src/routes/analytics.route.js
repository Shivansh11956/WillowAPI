const express = require('express');
const { getStats, getUsage } = require('../controllers/analytics.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/stats', authenticateUser, getStats);
router.get('/usage', authenticateUser, getUsage);

module.exports = router;