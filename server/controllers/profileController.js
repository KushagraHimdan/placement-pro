const StudentProfile = require('../models/StudentProfile');

// GET /api/profile — fetch the logged-in student's profile
const getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email role'
    );

    // If no profile exists yet (e.g. first login after registering), create an empty one
    if (!profile) {
      profile = await StudentProfile.create({ user: req.user._id });
      profile = await profile.populate('user', 'name email role');
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// PUT /api/profile — update the logged-in student's profile fields
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'rollNumber',
      'branch',
      'graduationYear',
      'cgpa',
      'tenthPercentage',
      'twelfthPercentage',
      'backlogs',
      'skills',
    ];

    // Only pick fields that are actually allowed to be updated this way
    // (resume is deliberately excluded — that's handled by a separate upload endpoint in Task 13)
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email role');

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };