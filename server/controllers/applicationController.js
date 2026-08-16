const Application = require("../models/Application");
const Drive = require("../models/Drive");
const StudentProfile = require("../models/StudentProfile");
const { checkEligibility } = require("../services/eligibilityService");
const AuditLog = require('../models/AuditLog');
const { isValidTransition, buildStatusHistoryEntry } = require('../services/applicationStatusService');

const applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    if (drive.status !== "open") {
      return res
        .status(400)
        .json({ message: "This drive is no longer accepting applications" });
    }

    if (new Date() > new Date(drive.applicationDeadline)) {
      return res
        .status(400)
        .json({ message: "Application deadline has passed" });
    }

    const profile = await StudentProfile.findOne({ user: req.user._id });

    // The real server-side gate — re-check eligibility regardless of what the frontend showed
    const { eligible, reasons } = checkEligibility(drive, profile);
    if (!eligible) {
      return res.status(403).json({
        message: "You are not eligible for this drive",
        reasons,
      });
    }

    // Check for existing application (friendlier error than relying on the DB's unique index alone)
    const existing = await Application.findOne({
      drive: driveId,
      student: req.user._id,
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already applied to this drive" });
    }

    const application = await Application.create({
      drive: driveId,
      student: req.user._id,
      statusHistory: [
        {
          status: "applied",
          changedAt: new Date(),
          changedBy: req.user._id,
          note: "Application submitted",
        },
      ],
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    // Handles the rare race-condition case where two duplicate requests slip past the check above
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You have already applied to this drive" });
    }
    console.error("Apply to drive error:", error);
    res.status(500).json({ message: "Server error applying to drive" });
  }
};

// PATCH /api/applications/:applicationId/status — TPO updates an application's status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status: newStatus, note } = req.body;

    if (!newStatus) {
      return res.status(400).json({ message: 'New status is required' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const currentStatus = application.status;

    if (!isValidTransition(currentStatus, newStatus)) {
      return res.status(400).json({
        message: `Cannot move application from '${currentStatus}' to '${newStatus}'`,
      });
    }

    const historyEntry = buildStatusHistoryEntry(newStatus, req.user._id, note);

    application.status = newStatus;
    application.statusHistory.push(historyEntry);
    await application.save();

    // Record this action in the audit trail
    await AuditLog.create({
      action: 'APPLICATION_STATUS_CHANGED',
      performedBy: req.user._id,
      targetType: 'Application',
      targetId: application._id,
      details: { from: currentStatus, to: newStatus, note: note || '' },
    });

    res.status(200).json({
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
};

// GET /api/applications/mine — student views their own applications, across all drives
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('drive', 'company role package applicationDeadline')
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// GET /api/applications/drive/:driveId — TPO/recruiter views all applicants for a specific drive
const getApplicationsForDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const applications = await Application.find({ drive: driveId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get applications for drive error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

module.exports = { applyToDrive, updateApplicationStatus, getMyApplications, getApplicationsForDrive };
