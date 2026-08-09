const express = require('express');
const router = express.Router();
const { triggerMatchBatch, getMatchResults } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/drives/:driveId/match', protect, authorize('tpo'), triggerMatchBatch);
router.get('/drives/:driveId/results', protect, authorize('tpo'), getMatchResults);

module.exports = router;