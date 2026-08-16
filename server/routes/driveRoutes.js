const express = require('express');
const router = express.Router();
const { createDrive, listDrives, getEligibleStudents, getDriveById } = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { applyToDrive } = require('../controllers/applicationController');

router.post('/', protect, authorize('tpo'), createDrive);
router.get('/', protect, listDrives);
router.get('/:driveId', protect, getDriveById);
router.post('/:driveId/apply', protect, authorize('student'), applyToDrive);
router.get('/:driveId/eligible-students', protect, authorize('tpo'), getEligibleStudents);

module.exports = router;