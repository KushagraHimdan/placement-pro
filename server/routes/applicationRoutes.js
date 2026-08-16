const express = require('express');
const router = express.Router();
const { updateApplicationStatus, getMyApplications, getApplicationsForDrive } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.patch('/:applicationId/status', protect, authorize('tpo', 'recruiter'), updateApplicationStatus);
router.get('/mine', protect, authorize('student'), getMyApplications);
router.get('/drive/:driveId', protect, authorize('tpo', 'recruiter'), getApplicationsForDrive);

module.exports = router;