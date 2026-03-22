const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserByGithub,
  linkGitHub,
  getVerifiedStatus,
  getUserSkills,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/search', searchUsers);
router.get('/profile/:id', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/github/:username', getUserByGithub);
router.post('/link-github', protect, linkGitHub);
router.get('/verified-status', protect, getVerifiedStatus);
router.get('/skills', protect, getUserSkills);

module.exports = router;
