const express = require('express');
const router = express.Router();
const { updateApplicationStatus, getMyApplications } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.patch('/:applicationId/status', protect, authorize('tpo'), updateApplicationStatus);
router.get('/mine', protect, authorize('student'), getMyApplications);

module.exports = router;