const Drive = require('../models/Drive');
const StudentProfile = require('../models/StudentProfile');
const { checkEligibility } = require('../services/eligibilityService');
const User = require('../models/User');

const createDrive = async (req, res) => {
  try {
    const {
      company,
      role,
      description,
      package: packageInfo, // 'package' is a reserved-ish word in some contexts, alias it for clarity
      driveDate,
      applicationDeadline,
      eligibility,
    } = req.body;

    if (!company || !role || !applicationDeadline) {
      return res.status(400).json({
        message: 'Company, role, and applicationDeadline are required',
      });
    }

    const drive = await Drive.create({
      company,
      role,
      description,
      package: packageInfo,
      driveDate,
      applicationDeadline,
      eligibility, // if omitted, schema defaults apply (0 minimums, empty arrays = unrestricted)
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: 'Drive created successfully',
      drive,
    });
  } catch (error) {
    console.error('Create drive error:', error);
    res.status(500).json({ message: 'Server error creating drive' });
  }
};

// GET /api/drives — list all drives, annotated with eligibility if the requester is a student
const listDrives = async (req, res) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });

    // Only students get eligibility annotations — TPO/Recruiter views don't need it
    if (req.user.role !== 'student') {
      return res.status(200).json({ drives });
    }

    const profile = await StudentProfile.findOne({ user: req.user._id });

    const annotatedDrives = drives.map((drive) => {
      const { eligible, reasons } = checkEligibility(drive, profile);
      return {
        ...drive.toObject(),
        eligible,
        eligibilityReasons: eligible ? [] : reasons,
      };
    });

    res.status(200).json({ drives: annotatedDrives });
  } catch (error) {
    console.error('List drives error:', error);
    res.status(500).json({ message: 'Server error listing drives' });
  }
};

// GET /api/drives/:driveId/eligible-students — TPO view of who qualifies for a drive
const getEligibleStudents = async (req, res) => {
  try {
    const { driveId } = req.params;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Get every student profile, along with their linked user info (name, email)
    const profiles = await StudentProfile.find().populate('user', 'name email');

    const eligibleStudents = profiles
      .map((profile) => {
        const { eligible, reasons } = checkEligibility(drive, profile);
        return {
          studentId: profile.user._id,
          name: profile.user.name,
          email: profile.user.email,
          branch: profile.branch,
          cgpa: profile.cgpa,
          eligible,
          reasons,
        };
      })
      .filter((s) => s.eligible); // only return students who actually qualify

    res.status(200).json({
      count: eligibleStudents.length,
      students: eligibleStudents,
    });
  } catch (error) {
    console.error('Get eligible students error:', error);
    res.status(500).json({ message: 'Server error fetching eligible students' });
  }
};

module.exports = { createDrive, listDrives, getEligibleStudents };