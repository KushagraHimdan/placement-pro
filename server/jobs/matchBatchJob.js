const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const Drive = require('../models/Drive');
const { scoreResume } = require('../services/aiService');

// Scores every application for a given drive against that drive's role/description
const runMatchBatchForDrive = async (driveId) => {
  const drive = await Drive.findById(driveId);
  if (!drive) {
    throw new Error('Drive not found');
  }

  const applications = await Application.find({ drive: driveId });

  const results = {
    total: applications.length,
    scored: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  // Process applications one at a time — deliberately sequential, not parallel
  for (const application of applications) {
    try {
      const profile = await StudentProfile.findOne({ user: application.student });

      if (!profile || !profile.resume || !profile.resume.extractedText) {
        results.skipped += 1;
        continue; // no resume text to score against — skip, don't fail the whole batch
      }

      const aiResult = await scoreResume(profile.resume.extractedText, drive);

      application.aiMatch = {
        matchScore: aiResult.matchScore,
        strengths: aiResult.strengths,
        concerns: aiResult.concerns,
        summary: aiResult.summary,
        scoredAt: new Date(),
      };
      await application.save();

      results.scored += 1;
    } catch (error) {
      results.failed += 1;
      results.errors.push({ applicationId: application._id, message: error.message });
      // Deliberately don't throw — one failed resume shouldn't stop the whole batch
    }
  }

  return results;
};

module.exports = { runMatchBatchForDrive };