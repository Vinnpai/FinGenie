const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  goal: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 120 // 10 years max
  },
  income: {
    type: Number,
    required: true,
    min: 0
  },
  savings: {
    type: Number,
    default: 0,
    min: 0
  },
  plan: {
    monthly_saving: Number,
    investment_strategy: String,
    summary: String
  },
  progress: {
    currentSaved: {
      type: Number,
      default: 0
    },
    weeklyUpdates: [{
      week: Number,
      amount: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
goalSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Goal', goalSchema);
