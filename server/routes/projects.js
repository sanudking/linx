const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
  getProjectsBySkillMatch,
  searchProjects,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createProject);
router.get('/', getProjects);
router.get('/match', protect, getProjectsBySkillMatch);
router.get('/search', searchProjects);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/collaborators', protect, addCollaborator);
router.delete('/:id/collaborators/:userId', protect, removeCollaborator);

module.exports = router;
