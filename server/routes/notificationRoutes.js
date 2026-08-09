const express = require('express');
const router = express.Router();
const { listNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, listNotifications);
router.patch('/:id/read', protect, markAsRead);

module.exports = router;