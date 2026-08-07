const express = require('express');
const router = express.Router();
const { createDrive, listDrives } = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tpo'), createDrive);
router.get('/', protect, listDrives);
module.exports = router;