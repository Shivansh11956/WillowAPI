const express = require('express');
const { listKeys, createKey, deleteKey } = require('../controllers/keys.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticateUser, listKeys);
router.post('/', authenticateUser, createKey);
router.delete('/:keyId', authenticateUser, deleteKey);

module.exports = router;