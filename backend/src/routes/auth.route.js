const express = require('express');
const { signup, verifySignup, login, logout } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-signup', verifySignup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;