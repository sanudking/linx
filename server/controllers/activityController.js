const Activity = require('../models/Activity');

const createActivity = async (req, res, next) => {
  try {
    const { type, action, metadata } = req.body;
    if (!type || !action) {
      return res.status(400).json({ success: false, message: 'Type and action are required' });
    }

    const activity = await Activity.create({
      user: req.user._id,
      type,
      action,
      metadata: metadata || {},
    });

    await activity.populate('user', 'name avatar role');
    res.status(201).json({ success: true, activity });
  } catch (error) {
    next(error);
  }
};

const getFeedActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Activity.find()
      .populate('user', 'name avatar role verified')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Activity.countDocuments();
    res.json({ success: true, activities, total, page: Number(page) });
  } catch (error) {
    next(error);
  }
};

const getUserActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Activity.find({ user: req.params.userId })
      .populate('user', 'name avatar role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
};

const filterByType = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = type ? { type } : {};

    const activities = await Activity.find(filter)
      .populate('user', 'name avatar role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await activity.deleteOne();
    res.json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createActivity, getFeedActivities, getUserActivities, filterByType, deleteActivity };
