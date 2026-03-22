const Job = require('../models/Job');
const { validateJobInput } = require('../utils/validators');

const createJob = async (req, res, next) => {
  try {
    const errors = validateJobInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    await job.populate('postedBy', 'name avatar email role');
    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const { type, skills, remote, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (remote !== undefined) filter.remote = remote === 'true';
    if (skills) {
      const skillArr = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillArr };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('postedBy', 'name avatar email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({ success: true, jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name avatar email role');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const allowedFields = ['title', 'description', 'company', 'skills', 'salary', 'deadline', 'type', 'remote'];
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const alreadyApplied = job.applications.some(
      (a) => a.user.toString() === req.user._id.toString()
    );
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    job.applications.push({ user: req.user._id });
    await job.save();
    res.json({ success: true, message: 'Application submitted' });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('applications.user', 'name email avatar skills');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, applications: job.applications });
  } catch (error) {
    next(error);
  }
};

const recommendJobs = async (req, res, next) => {
  try {
    const userSkills = req.user.skills || [];
    if (userSkills.length === 0) {
      const recent = await Job.find().populate('postedBy', 'name role').sort({ createdAt: -1 }).limit(5);
      return res.json({ success: true, jobs: recent });
    }

    const jobs = await Job.find({ skills: { $in: userSkills } })
      .populate('postedBy', 'name avatar email role')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, applyToJob, getApplications, recommendJobs };
