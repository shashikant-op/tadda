const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const loginWindowMinutes = Number.parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MINUTES, 10) || 5;
const loginAttemptLimit = Number.parseInt(process.env.LOGIN_RATE_LIMIT_MAX, 10) || 50;

const loginLimiter = rateLimit({
  windowMs: loginWindowMinutes * 60 * 1000,
  max: loginAttemptLimit,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: `Too many failed sign-in attempts. Please try again in ${loginWindowMinutes} minutes.` }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many account creation attempts. Please try again later.' }
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
