const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['project', 'job', 'connection', 'achievement'],
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ timestamp: -1 });
activitySchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('Activity', activitySchema);
