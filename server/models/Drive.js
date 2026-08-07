const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    package: {
      type: String, // e.g. "12 LPA" — kept as a string since packages are often ranges or have text like "CTC"
      trim: true,
    },
    driveDate: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    eligibility: {
      minCgpa: { type: Number, min: 0, max: 10, default: 0 },
      maxBacklogs: { type: Number, min: 0, default: 0 },
      allowedBranches: {
        type: [String], // empty array = all branches allowed
        default: [],
      },
      minTenthPercentage: { type: Number, min: 0, max: 100, default: 0 },
      minTwelfthPercentage: { type: Number, min: 0, max: 100, default: 0 },
      graduationYears: {
        type: [Number], // empty array = all graduation years allowed
        default: [],
      },
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Drive', driveSchema);