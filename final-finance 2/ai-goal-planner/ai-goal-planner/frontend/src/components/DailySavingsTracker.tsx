import React, { useState } from 'react';

interface Goal {
  _id: string;
  goal: string;
  plan: {
    monthly_saving: number;
  };
  progress?: {
    dailyUpdates?: Array<{
      day: number;
      amount: number;
      date: string;
    }>;
    lastUpdated: string;
  };
}

interface DailySavingsTrackerProps {
  goal: Goal;
  onUpdate: (amount: number) => void;
}

const DailySavingsTracker: React.FC<DailySavingsTrackerProps> = ({ goal, onUpdate }) => {
  const [amount, setAmount] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const dailyTarget = Math.round(goal.plan.monthly_saving / 30); // Daily target
  const lastUpdate = goal.progress?.lastUpdated 
    ? new Date(goal.progress.lastUpdated)
    : new Date(0);
  const hoursSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60));
  const needsUpdate = hoursSinceUpdate >= 24;

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
    <div className="mt-6 bg-light p-4 rounded-lg border-2 border-accent border-opacity-30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-md font-semibold text-primary">Daily Savings Update</h4>
          <p className="text-xs text-accent">Target: ₹{dailyTarget.toLocaleString()}/day</p>
        </div>
        {needsUpdate && (
          <span className="px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full animate-pulse">
            Update Today!
          </span>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              How much did you save today?
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`₹${dailyTarget}`}
              className="w-full px-4 py-2 border-2 border-accent border-opacity-30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              min="0"
              step="10"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              ✅ Update Today's Savings
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setAmount('');
              }}
              className="px-4 py-2 bg-accent bg-opacity-20 text-primary rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {goal.progress?.lastUpdated && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-accent">Last updated:</span>
              <span className="font-semibold text-primary">
                {new Date(goal.progress.lastUpdated).toLocaleDateString()} 
                {' '}({hoursSinceUpdate}h ago)
              </span>
            </div>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-primary text-light py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            💰 Update Today's Savings
          </button>
        </div>
      )}
    </div>
  );
};

export default DailySavingsTracker;
