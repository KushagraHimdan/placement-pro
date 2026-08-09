const Notification = require('../models/Notification');

// GET /api/notifications — list the logged-in user's notifications, newest first
const listNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error('List notifications error:', error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
};

// PATCH /api/notifications/:id/read — mark a single notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({ _id: id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error updating notification' });
  }
};

module.exports = { listNotifications, markAsRead };