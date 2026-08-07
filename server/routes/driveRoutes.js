const express = require('express');
const router = express.Router();
const { createDrive, listDrives } = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { applyToDrive } = require('../controllers/applicationController');

router.post('/', protect, authorize('tpo'), createDrive);
router.get('/', protect, listDrives);
router.post('/:driveId/apply', protect, authorize('student'), applyToDrive);
module.exports = router;