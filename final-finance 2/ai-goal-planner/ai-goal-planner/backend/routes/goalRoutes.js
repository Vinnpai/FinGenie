const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal
} = require('../controllers/goalController');
const { optionalAuth, protect } = require('../utils/auth');

// Public/Optional auth routes
router.post('/', optionalAuth, createGoal);
router.get('/', optionalAuth, getGoals);
router.get('/:id', getGoal);

// Progress update (public for now, can be protected)
router.post('/:id/progress', optionalAuth, updateGoalProgress);

// Protected routes (optionalAuth allows both logged in and anonymous users)
router.put('/:id', optionalAuth, updateGoal);
router.delete('/:id', optionalAuth, deleteGoal);

module.exports = router;
