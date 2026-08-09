const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected'],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false } // these are sub-documents purely for history — no need for their own separate _id
);

const applicationSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected'],
      default: 'applied',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    aiMatch: {
      matchScore: { type: Number },
      strengths: { type: [String], default: [] },
      concerns: { type: [String], default: [] },
      summary: { type: String },
      scoredAt: { type: Date },
    },
  },
  { timestamps: true }
);

applicationSchema.index({ drive: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);