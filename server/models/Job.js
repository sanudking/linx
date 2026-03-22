const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [3000, 'Description cannot exceed 3000 characters'],
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  skills: [String],
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
  },
  deadline: Date,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applications: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending',
      },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'research'],
    required: true,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
