const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { uploadResume } = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/upload', protect, authorize('student'), upload.single('resume'), uploadResume);

module.exports = router;