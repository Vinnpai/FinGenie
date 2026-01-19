import { motion } from 'framer-motion';

const ProgressBar = ({ current, target, label }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white font-semibold">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-3">
        <motion.div
          className="bg-gradient-to-r from-brand-600 to-brand-500 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-zinc-500">${current?.toLocaleString()}</span>
        <span className="text-zinc-500">${target?.toLocaleString()}</span>
      </div>
    </div>
  );
};

const GoalCard = ({ goal, onDelete, onUpdateProgress }) => {
  // Handle both old format (goal.goal) and new format (goal.title)
  const goalTitle = goal.goal || goal.title || 'Untitled Goal';
  const goalAmount = goal.amount || goal.targetAmount || 0;
  const currentSaved = goal.progress?.currentSaved || goal.savings || goal.currentAmount || 0;
  const createdAt = goal.createdAt || new Date().toISOString();
  
  // Calculate duration from deadline if available
  let duration = goal.duration;
  if (!duration && goal.deadline) {
    const deadlineDate = new Date(goal.deadline);
    const now = new Date();
    const monthsDiff = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24 * 30));
    duration = Math.max(1, monthsDiff);
  }
  duration = duration || 12;
  
  const monthsElapsed = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  
  return (
    <motion.div
      className="bg-zinc-900/50 rounded-xl shadow-lg p-6 hover:shadow-xl hover:shadow-brand-500/10 transition-all border border-zinc-800 hover:border-brand-500/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{goalTitle}</h3>
          <p className="text-sm text-zinc-400">
            Created {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(goal._id)}
            className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
            title="Delete goal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4">
        <ProgressBar
          current={currentSaved}
          target={goalAmount}
          label="Progress"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-1">Monthly Saving</p>
          <p className="text-lg font-bold text-brand-400">
            ${goal.plan?.monthly_saving?.toLocaleString()}
          </p>
        </div>
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-1">Duration</p>
          <p className="text-lg font-bold text-white">
            {duration} months
          </p>
        </div>
      </div>

      {goal.plan?.investment_strategy && (
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 mb-4">
          <p className="text-xs font-semibold text-brand-300 mb-2">📈 Investment Strategy</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{goal.plan.investment_strategy}</p>
        </div>
      )}

      {goal.plan?.summary && (
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 mb-4">
          <p className="text-xs font-semibold text-brand-300 mb-2">🤖 AI Summary</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{goal.plan.summary}</p>
        </div>
      )}

      {/* Weekly Savings Tracker */}
      {onUpdateProgress && (
        <WeeklySavingsTracker goal={goal} onUpdate={onUpdateProgress} />
      )}
    </motion.div>
  );
};

const WeeklySavingsTracker = ({ goal, onUpdate }) => {
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(false);

  const weeklyTarget = Math.round((goal.plan?.monthly_saving || 0) / 4.33);
  const lastUpdate = goal.progress?.lastUpdated 
    ? new Date(goal.progress.lastUpdated)
    : new Date(0);
  const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  const needsUpdate = daysSinceUpdate >= 7;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onUpdate(goal._id, numAmount);
      setAmount('');
      setShowForm(false);
    }
  };

  return (
    <div className="mt-4 bg-zinc-800/30 p-4 rounded-lg border border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">Weekly Savings Update</h4>
          <p className="text-xs text-zinc-400">Target: ${weeklyTarget.toLocaleString()}/week</p>
        </div>
        {needsUpdate && (
          <span className="px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full animate-pulse">
            Update Due!
          </span>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              How much did you save this week?
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`$${weeklyTarget}`}
              className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              min="0"
              step="10"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand-600 to-brand-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-brand-500 hover:to-brand-600 transition-colors text-sm"
            >
              ✅ Update Progress
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setAmount('');
              }}
              className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:bg-zinc-700/50 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {goal.progress?.lastUpdated && (
            <p className="text-sm text-zinc-400">
              Last updated: {new Date(goal.progress.lastUpdated).toLocaleDateString()}
              {' '}({daysSinceUpdate} days ago)
            </p>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-zinc-800/50 border border-zinc-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-zinc-700/50 hover:border-brand-500/50 transition-colors text-sm"
          >
            💰 Update This Week's Savings
          </button>
        </div>
      )}

      {/* Recent Updates */}
      {goal.progress?.weeklyUpdates && goal.progress.weeklyUpdates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <h5 className="text-sm font-semibold text-white mb-2">Recent Updates</h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {goal.progress.weeklyUpdates.slice(-5).reverse().map((update, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Week {update.week}</span>
                <span className="font-semibold text-brand-400">
                  ${update.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';

export default GoalCard;
