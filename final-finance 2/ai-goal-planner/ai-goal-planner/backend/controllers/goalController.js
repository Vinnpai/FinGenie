const Goal = require('../models/Goal');
const User = require('../models/User');
const aiService = require('../services/ai');

/**
 * @desc    Create new goal with AI plan
 * @route   POST /api/goals
 * @access  Public (or Private if auth is enabled)
 */
exports.createGoal = async (req, res) => {
  try {
    const { goal, amount, duration, income, savings } = req.body;

    // Validation
    if (!goal || !amount || !duration || !income) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (amount <= 0 || duration <= 0 || income <= 0) {
      return res.status(400).json({ error: 'Amount, duration, and income must be positive numbers' });
    }

    // Generate AI plan
    const plan = await aiService.generateGoalPlan({
      goal,
      amount,
      duration,
      income,
      savings: savings || 0
    });

    // Save goal to database
    const newGoal = await Goal.create({
      goal,
      amount,
      duration,
      income,
      savings: savings || 0,
      plan
    });

    // If user is authenticated, link goal to user
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { goals: newGoal._id }
      });
    }

    res.status(201).json({
      success: true,
      ...plan,
      goalId: newGoal._id
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ 
      error: 'Failed to create goal', 
      message: error.message 
    });
  }
};

/**
 * @desc    Get all goals
 * @route   GET /api/goals
 * @access  Public (or Private)
 */
exports.getGoals = async (req, res) => {
  try {
    let query = {};
    
    // If user is authenticated, get only their goals
    if (req.user) {
      const user = await User.findById(req.user.id).populate('goals');
      return res.json({
        success: true,
        goals: user.goals
      });
    }

    // Otherwise get all goals (for demo purposes)
    const goals = await Goal.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: goals.length,
      goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals', message: error.message });
  }
};

/**
 * @desc    Get single goal
 * @route   GET /api/goals/:id
 * @access  Public
 */
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Failed to fetch goal', message: error.message });
  }
};

/**
 * @desc    Update goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal', message: error.message });
  }
};

/**
 * @desc    Update goal progress (weekly savings)
 * @route   POST /api/goals/:id/progress
 * @access  Public/Private
 */
exports.updateGoalProgress = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Please provide a valid amount' });
    }

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Initialize progress if not exists
    if (!goal.progress) {
      goal.progress = {
        currentSaved: goal.savings,
        weeklyUpdates: [],
        lastUpdated: new Date()
      };
    }

    // Calculate week number
    const weekNumber = goal.progress.weeklyUpdates.length + 1;

    // Add weekly update
    goal.progress.weeklyUpdates.push({
      week: weekNumber,
      amount: amount,
      date: new Date()
    });

    // Update current saved amount
    goal.progress.currentSaved = (goal.progress.currentSaved || goal.savings) + amount;
    goal.progress.lastUpdated = new Date();

    // Check if goal is completed
    if (goal.progress.currentSaved >= goal.amount) {
      goal.status = 'completed';
    }

    await goal.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress', message: error.message });
  }
};

/**
 * @desc    Delete goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Remove from user's goals array if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { goals: req.params.id }
      });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal', message: error.message });
  }
};
