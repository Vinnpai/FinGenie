const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getGoalNotifications
} = require('../controllers/notificationController');
const { optionalAuth } = require('../utils/auth');

// Get all notifications
router.get('/', optionalAuth, getNotifications);

// Get notifications for specific goal
router.get('/:goalId', getGoalNotifications);

module.exports = router;
