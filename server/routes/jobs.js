const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getApplications,
  recommendJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createJob);
router.get('/', getJobs);
router.get('/recommend', protect, recommendJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.post('/:id/apply', protect, applyToJob);
router.get('/:id/applications', protect, getApplications);

module.exports = router;
