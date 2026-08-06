const axios = require('axios');
const { PDFParse } = require('pdf-parse');
const StudentProfile = require('../models/StudentProfile');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path: url, filename: publicId } = req.file;

    // Download the uploaded PDF's bytes from Cloudinary so we can extract text from it
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data);

    // Extract plain text from the PDF using pdf-parse v2's class-based API
    const parser = new PDFParse({ data: pdfBuffer });
    const result = await parser.getText();
    await parser.destroy(); // releases internal resources — good practice per-parse
    const extractedText = result.text.trim();

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          resume: {
            url,
            publicId,
            extractedText,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        url: profile.resume.url,
        publicId: profile.resume.publicId,
        uploadedAt: profile.resume.uploadedAt,
        extractedTextPreview: profile.resume.extractedText.slice(0, 200),
      },
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Server error uploading resume' });
  }
};

module.exports = { uploadResume };