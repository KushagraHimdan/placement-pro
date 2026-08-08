const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, // e.g. 'APPLICATION_STATUS_CHANGED'
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String, // e.g. 'Application'
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // flexible field to store action-specific context
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);