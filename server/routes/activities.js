const express = require('express');
const router = express.Router();
const {
  createActivity,
  getFeedActivities,
  getUserActivities,
  filterByType,
  deleteActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createActivity);
router.get('/feed', getFeedActivities);
router.get('/user/:userId', getUserActivities);
router.get('/filter', filterByType);
router.delete('/:id', protect, deleteActivity);

module.exports = router;
