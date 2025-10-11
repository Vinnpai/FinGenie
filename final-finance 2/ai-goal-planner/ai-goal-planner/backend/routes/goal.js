const express = require('express');
const router = express.Router();
const goalPlanner = require('../services/goalPlanner');
const Goal = require('../models/Goal');

// POST /api/goal - Generate AI financial plan
router.post('/', async (req, res) => {
  try {
    const { goal, amount, duration, income, savings } = req.body;

    // Validate input
    if (!goal || !amount || !duration || !income) {
      return res.status(400).json({
        error: 'Missing required fields: goal, amount, duration, income'
      });
    }

    if (amount <= 0 || duration <= 0 || income <= 0) {
      return res.status(400).json({
        error: 'Amount, duration, and income must be positive numbers'
      });
    }

    // Generate AI plan
    const plan = await goalPlanner.generatePlan({
      goal,
      amount: Number(amount),
      duration: Number(duration),
      income: Number(income),
      savings: Number(savings) || 0
    });

    // Save to database (optional)
    try {
      const savedGoal = new Goal({
        goal,
        amount,
        duration,
        income,
        savings: savings || 0,
        plan,
        createdAt: new Date()
      });
      await savedGoal.save();
    } catch (dbError) {
      console.warn('Failed to save to database:', dbError.message);
      // Continue without saving if DB fails
    }

    res.json(plan);
  } catch (error) {
    console.error('Goal planning error:', error);
    res.status(500).json({
      error: 'Failed to generate financial plan',
      message: error.message
    });
  }
});

// GET /api/goal - Get all saved goals (optional)
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 }).limit(10);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({
      error: 'Failed to fetch goals',
      message: error.message
    });
  }
});

module.exports = router;
