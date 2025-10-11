import React from 'react';

interface Goal {
  _id: string;
  goal: string;
  amount: number;
  duration: number;
  savings: number;
  plan: {
    monthly_saving: number;
  };
  progress?: {
    currentSaved: number;
    weeklyUpdates: Array<{
      week: number;
      amount: number;
      date: string;
    }>;
  };
  createdAt: string;
}

interface ProgressChartProps {
  goal: Goal;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ goal }) => {
  const currentSaved = goal.progress?.currentSaved || goal.savings;
  const targetAmount = goal.amount;
  const progressPercentage = Math.min((currentSaved / targetAmount) * 100, 100);

  // Calculate expected progress
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const monthsElapsed = daysSinceCreation / 30;
  const expectedSaved = goal.savings + (monthsElapsed * goal.plan.monthly_saving);
  const expectedPercentage = Math.min((expectedSaved / targetAmount) * 100, 100);

  // Calculate weekly progress
  const weeklyUpdates = goal.progress?.weeklyUpdates || [];
  const maxWeeks = Math.ceil(goal.duration * 4.33); // weeks in duration
  const weeksData = Array.from({ length: Math.min(maxWeeks, 12) }, (_, i) => {
    const weekUpdate = weeklyUpdates.find(w => w.week === i + 1);
    return {
      week: i + 1,
      amount: weekUpdate?.amount || 0,
      cumulative: weeklyUpdates
        .filter(w => w.week <= i + 1)
        .reduce((sum, w) => sum + w.amount, goal.savings)
    };
  });

  const maxAmount = Math.max(...weeksData.map(w => w.cumulative), targetAmount);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">Progress Overview</h3>
          <span className="text-2xl font-bold text-brand-400">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>

        {/* Main Progress Bar */}
        <div className="relative h-8 bg-zinc-900/50 rounded-full overflow-hidden border border-zinc-700">
          {/* Expected Progress (lighter) */}
          <div
            className="absolute h-full bg-zinc-700/40 transition-all duration-500"
            style={{ width: `${expectedPercentage}%` }}
          />
          {/* Actual Progress */}
          <div
            className="absolute h-full bg-gradient-to-r from-brand-600 to-brand-700 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              ₹{currentSaved.toLocaleString()} / ₹{targetAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-zinc-400 mt-2">
          <span>Started: {new Date(goal.createdAt).toLocaleDateString()}</span>
          <span>Target: {goal.duration} months</span>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div>
        <h4 className="text-md font-semibold text-white mb-3">Weekly Savings Trend</h4>
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
          <div className="flex items-end justify-between h-40 space-x-2">
            {weeksData.map((week, index) => {
              const height = (week.cumulative / maxAmount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-32">
                    <div
                      className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%` }}
                      title={`Week ${week.week}: ₹${week.cumulative.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 mt-1">W{week.week}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-zinc-700">
            <span>₹0</span>
            <span>₹{(maxAmount / 2).toLocaleString()}</span>
            <span>₹{maxAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        {progressPercentage >= expectedPercentage ? (
          <>
            <span className="text-2xl">🎉</span>
            <span className="text-sm text-white font-semibold">
              You're on track! Keep it up!
            </span>
          </>
        ) : (
          <>
            <span className="text-2xl">⚠️</span>
            <span className="text-sm text-brand-400 font-semibold">
              Behind schedule. Save ₹{Math.round(expectedSaved - currentSaved).toLocaleString()} to catch up.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
