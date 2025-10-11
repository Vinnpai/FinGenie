import User from '../models/User.js';

// @desc    Add financial goal
// @route   POST /api/finance/goals
// @access  Private
export const addFinancialGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      const goal = {
        title,
        targetAmount,
        currentAmount: currentAmount || 0,
        deadline,
      };

      user.financialGoals.push(goal);
      await user.save();

      res.status(201).json(user.financialGoals);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all financial goals
// @route   GET /api/finance/goals
// @access  Private
export const getFinancialGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json(user.financialGoals);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update financial goal
// @route   PUT /api/finance/goals/:id
// @access  Private
export const updateFinancialGoal = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const goal = user.financialGoals.id(req.params.id);

      if (goal) {
        goal.title = req.body.title || goal.title;
        goal.targetAmount = req.body.targetAmount || goal.targetAmount;
        goal.currentAmount = req.body.currentAmount !== undefined 
          ? req.body.currentAmount 
          : goal.currentAmount;
        goal.deadline = req.body.deadline || goal.deadline;

        await user.save();
        res.json(user.financialGoals);
      } else {
        res.status(404);
        throw new Error('Goal not found');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete financial goal
// @route   DELETE /api/finance/goals/:id
// @access  Private
export const deleteFinancialGoal = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.financialGoals = user.financialGoals.filter(
        (goal) => goal._id.toString() !== req.params.id
      );

      await user.save();
      res.json({ message: 'Goal removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/finance/budget
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.budget = {
        monthlyIncome: req.body.monthlyIncome || user.budget.monthlyIncome,
        categories: req.body.categories || user.budget.categories,
      };

      await user.save();
      res.json(user.budget);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get budget
// @route   GET /api/finance/budget
// @access  Private
export const getBudget = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json(user.budget);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
