const Application = require('../models/Application');
const Drive = require('../models/Drive');
const StudentProfile = require('../models/StudentProfile');
const { checkEligibility } = require('../services/eligibilityService');

const applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (drive.status !== 'open') {
      return res.status(400).json({ message: 'This drive is no longer accepting applications' });
    }

    if (new Date() > new Date(drive.applicationDeadline)) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    const profile = await StudentProfile.findOne({ user: req.user._id });

    // The real server-side gate — re-check eligibility regardless of what the frontend showed
    const { eligible, reasons } = checkEligibility(drive, profile);
    if (!eligible) {
      return res.status(403).json({
        message: 'You are not eligible for this drive',
        reasons,
      });
    }

    // Check for existing application (friendlier error than relying on the DB's unique index alone)
    const existing = await Application.findOne({ drive: driveId, student: req.user._id });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied to this drive' });
    }

    const application = await Application.create({
      drive: driveId,
      student: req.user._id,
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    // Handles the rare race-condition case where two duplicate requests slip past the check above
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already applied to this drive' });
    }
    console.error('Apply to drive error:', error);
    res.status(500).json({ message: 'Server error applying to drive' });
  }
};

module.exports = { applyToDrive };