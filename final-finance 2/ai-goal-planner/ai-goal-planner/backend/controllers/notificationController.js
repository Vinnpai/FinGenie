const Goal = require('../models/Goal');
const { getAllGoalsNotifications } = require('../utils/notifications');

/**
 * @desc    Get all notifications for user's goals
 * @route   GET /api/notifications
 * @access  Public/Private
 */
exports.getNotifications = async (req, res) => {
  try {
    // Get all goals (user's goals if authenticated, or all for demo)
    let goals;
    
    if (req.user) {
      const User = require('../models/User');
      const user = await User.findById(req.user.id).populate('goals');
      goals = user.goals;
    } else {
      // For demo/testing, get recent goals
      goals = await Goal.find().sort({ createdAt: -1 }).limit(10);
    }
    
    console.log(`📊 Checking notifications for ${goals.length} goals`);
    
    // Generate notifications for all goals
    const notifications = getAllGoalsNotifications(goals);
    
    console.log(`🔔 Generated ${notifications.length} notifications`);
    
    res.json({
      success: true,
      count: notifications.length,
      notifications,
      debug: {
        totalGoals: goals.length,
        goalsChecked: goals.map(g => ({
          id: g._id,
          name: g.goal,
          lastUpdated: g.progress?.lastUpdated || g.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notifications', 
      message: error.message 
    });
  }
};

/**
 * @desc    Get notifications for a specific goal
 * @route   GET /api/notifications/:goalId
 * @access  Public
 */
exports.getGoalNotifications = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const { getAllNotifications } = require('../utils/notifications');
    const notifications = getAllNotifications(goal);
    
    res.json({
      success: true,
      goalId: goal._id,
      goalName: goal.goal,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get goal notifications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notifications', 
      message: error.message 
    });
  }
};
