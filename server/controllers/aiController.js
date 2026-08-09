const { runMatchBatchForDrive } = require('../jobs/matchBatchJob');
const Application = require('../models/Application');

// POST /api/ai/drives/:driveId/match — TPO triggers AI scoring for all applications on a drive
const triggerMatchBatch = async (req, res) => {
  try {
    const { driveId } = req.params;
    const result = await runMatchBatchForDrive(driveId);

    res.status(200).json({
      message: 'AI matching batch completed',
      result,
    });
  } catch (error) {
    console.error('Trigger match batch error:', error);
    res.status(500).json({ message: error.message || 'Server error running AI match batch' });
  }
};

// GET /api/ai/drives/:driveId/results — TPO polls/views AI match results for a drive's applications
const getMatchResults = async (req, res) => {
  try {
    const { driveId } = req.params;

    const applications = await Application.find({ drive: driveId })
      .populate('student', 'name email')
      .select('student status aiMatch');

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get match results error:', error);
    res.status(500).json({ message: 'Server error fetching match results' });
  }
};

module.exports = { triggerMatchBatch, getMatchResults };