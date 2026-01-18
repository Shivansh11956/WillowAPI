const express = require('express');
const { moderateContent } = require('../controllers/moderation.controller');
const { authenticateApiKey } = require('../middleware/apiKey.middleware');

const router = express.Router();

router.post('/moderate', authenticateApiKey, moderateContent);

module.exports = router;