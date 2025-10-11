import React from 'react';
import ProgressBar from './ProgressBar';

interface Goal {
  _id: string;
  goal: string;
  amount: number;
  duration: number;
  income: number;
  savings: number;
  plan: {
    monthly_saving: number;
    investment_strategy: string;
    summary: string;
  };
  progress?: {
    currentSaved: number;
    weeklyUpdates: Array<{
      week: number;
      amount: number;
      date: string;
    }>;
    lastUpdated: string;
  };
  status?: string;
  createdAt: string;
}

interface GoalCardProps {
  goal: Goal;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onUpdate }) => {
  const monthsElapsed = Math.floor(
    (Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  const currentSaved = goal.progress?.currentSaved || goal.savings;
  const estimatedSaved = goal.savings + (monthsElapsed * goal.plan.monthly_saving);

  return (
    <div className="bg-zinc-800/30 rounded-xl shadow-lg p-6 hover:shadow-xl hover:shadow-brand-500/10 transition-shadow border border-zinc-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{goal.goal}</h3>
          <p className="text-sm text-zinc-400">
            Created {new Date(goal.createdAt).toLocaleDateString()}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(goal._id)}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Delete goal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4">
        <ProgressBar
          current={currentSaved}
          target={goal.amount}
          label="Progress"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-1">Monthly Saving</p>
          <p className="text-lg font-bold text-brand-400">
            ₹{goal.plan.monthly_saving.toLocaleString()}
          </p>
        </div>
        <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-1">Duration</p>
          <p className="text-lg font-bold text-white">
            {goal.duration} months
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
        <p className="text-xs font-semibold text-brand-300 mb-2">Investment Strategy</p>
        <p className="text-sm text-zinc-300">{goal.plan.investment_strategy}</p>
      </div>
    </div>
  );
};

export default GoalCard;
