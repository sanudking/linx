const Project = require('../models/Project');
const Activity = require('../models/Activity');
const { validateProjectInput } = require('../utils/validators');

const createProject = async (req, res, next) => {
  try {
    const errors = validateProjectInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    const { title, description, skills, tags, github } = req.body;
    const project = await Project.create({
      title,
      description,
      skills: skills || [],
      tags: tags || [],
      github: github || {},
      creator: req.user._id,
    });

    await Activity.create({
      user: req.user._id,
      type: 'project',
      action: `created project "${title}"`,
      metadata: { projectId: project._id },
    });

    await project.populate('creator', 'name avatar email role');
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const { status, skills, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (skills) {
      const skillArr = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillArr };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('creator', 'name avatar email role')
        .populate('collaborators.user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    res.json({ success: true, projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name avatar email role github')
      .populate('collaborators.user', 'name avatar email role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const allowedFields = ['title', 'description', 'skills', 'tags', 'github', 'status'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    await project.save();
    await project.populate('creator', 'name avatar email role');
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

const addCollaborator = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const alreadyCollab = project.collaborators.some((c) => c.user.toString() === userId);
    if (alreadyCollab) {
      return res.status(400).json({ success: false, message: 'User is already a collaborator' });
    }

    project.collaborators.push({ user: userId, role: role || 'member' });
    await project.save();
    await project.populate('collaborators.user', 'name avatar email');
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const removeCollaborator = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    project.collaborators = project.collaborators.filter(
      (c) => c.user.toString() !== req.params.userId
    );
    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const getProjectsBySkillMatch = async (req, res, next) => {
  try {
    const userSkills = req.user.skills || [];
    if (userSkills.length === 0) {
      return res.json({ success: true, projects: [] });
    }

    const projects = await Project.find({
      skills: { $in: userSkills },
      status: 'open',
    })
      .populate('creator', 'name avatar email role')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

const searchProjects = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const projects = await Project.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    })
      .populate('creator', 'name avatar email')
      .limit(20);

    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
  getProjectsBySkillMatch,
  searchProjects,
};
