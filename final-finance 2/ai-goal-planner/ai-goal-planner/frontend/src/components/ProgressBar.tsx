import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, label }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-white">{label}</span>
          <span className="text-zinc-400">
            ₹{current.toLocaleString()} / ₹{target.toLocaleString()}
          </span>
        </div>
      )}
      <div className="w-full bg-zinc-900/50 rounded-full h-4 overflow-hidden border border-zinc-700">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-700 transition-all duration-500 ease-out flex items-center justify-end pr-2"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="text-xs font-bold text-white">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
