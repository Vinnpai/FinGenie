import React, { useState } from 'react';

interface Goal {
  _id: string;
  goal: string;
  plan: {
    monthly_saving: number;
  };
  progress?: {
    weeklyUpdates: Array<{
      week: number;
      amount: number;
      date: string;
    }>;
    lastUpdated: string;
  };
}

interface WeeklySavingsTrackerProps {
  goal: Goal;
  onUpdate: (amount: number) => void;
}

const WeeklySavingsTracker: React.FC<WeeklySavingsTrackerProps> = ({ goal, onUpdate }) => {
  const [amount, setAmount] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const weeklyTarget = Math.round(goal.plan.monthly_saving / 4.33); // Average weeks per month
  const lastUpdate = goal.progress?.lastUpdated 
    ? new Date(goal.progress.lastUpdated)
    : new Date(0);
  const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  const needsUpdate = daysSinceUpdate >= 7;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onUpdate(numAmount);
      setAmount('');
      setShowForm(false);
    }
  };

  return (
    <div className="mt-6 bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-md font-semibold text-white">Weekly Savings Update</h4>
          <p className="text-xs text-zinc-400">Target: ₹{weeklyTarget.toLocaleString()}/week</p>
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
              placeholder={`₹${weeklyTarget}`}
              className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              min="0"
              step="100"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand-600 to-brand-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-brand-500 hover:to-brand-600 transition-colors"
            >
              ✅ Update Progress
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setAmount('');
              }}
              className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:bg-zinc-700/50 transition-colors"
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
            className="w-full bg-zinc-800/50 border border-zinc-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-zinc-700/50 hover:border-brand-500/50 transition-colors"
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
                <span className="font-semibold text-white">
                  ₹{update.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySavingsTracker;
