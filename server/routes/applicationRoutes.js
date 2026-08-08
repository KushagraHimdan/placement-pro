const express = require('express');
const router = express.Router();
const { updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.patch('/:applicationId/status', protect, authorize('tpo'), updateApplicationStatus);

module.exports = router;