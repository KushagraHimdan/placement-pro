const StudentProfile = require('../models/StudentProfile');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // At this stage, just confirm the file landed on Cloudinary correctly
    const { path: url, filename: publicId } = req.file;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          resume: {
            url,
            publicId,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Resume uploaded successfully (text extraction not yet added)',
      resume: profile.resume,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Server error uploading resume' });
  }
};

module.exports = { uploadResume };