const User = require('../models/User');
const { getGitHubRepos, extractSkills, getGitHubProfile } = require('../utils/githubIntegration');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verificationToken -resetPasswordToken');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'bio', 'avatar', 'skills', 'role'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const getUserByGithub = async (req, res, next) => {
  try {
    const user = await User.findOne({ 'github.username': req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const linkGitHub = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: 'GitHub username is required' });
    }

    let profile;
    try {
      profile = await getGitHubProfile(username);
    } catch {
      return res.status(400).json({ success: false, message: 'GitHub user not found' });
    }

    let skills = [];
    try {
      const repos = await getGitHubRepos(username);
      skills = extractSkills(repos).map((s) => s.language);
    } catch {
      // skills remain empty if fetch fails
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'github.username': username,
        'github.profileUrl': profile.html_url,
        skills: [...new Set([...req.user.skills, ...skills])],
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const getVerifiedStatus = async (req, res) => {
  res.json({ success: true, verified: req.user.verified });
};

const getUserSkills = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.github || !user.github.username) {
      return res.json({ success: true, skills: user.skills, source: 'profile' });
    }

    const repos = await getGitHubRepos(user.github.username);
    const skillsWithCount = extractSkills(repos);
    res.json({ success: true, skills: skillsWithCount, source: 'github' });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { query, skills, role } = req.query;
    const filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
      ];
    }
    if (skills) {
      const skillArr = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillArr };
    }
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('name email role avatar skills bio github verified')
      .limit(50);

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserByGithub,
  linkGitHub,
  getVerifiedStatus,
  getUserSkills,
  searchUsers,
};
