const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  sendVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.post('/send-verification', protect, sendVerification);
router.post('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuth);
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
