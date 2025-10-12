import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FinancialAlerts = () => {
  // Constants used across the app
  const INCOME = 50000;
  const SAVINGS = 100000;

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const next = [];
    // Pull latest goal stored by AIGoalPlanner
    let latestGoal = null;
    try {
      const raw = localStorage.getItem('latest_goal');
      latestGoal = raw ? JSON.parse(raw) : null;
    } catch {}

    if (latestGoal && latestGoal.amount && latestGoal.duration) {
      const remaining = Math.max(Number(latestGoal.amount) - SAVINGS, 0);
      const months = Math.max(1, Number(latestGoal.duration));
      const monthly = Math.ceil(remaining / months);
      const effort = Math.round((monthly / INCOME) * 100); // % of income

      // Bucketed guidance based on effort percentage
      // <=15% Nice, 16-25% Good, 26-35% Stretch, 36-50% Tough, >50% Critical
      if (effort <= 15) {
        next.push({
          type: 'success', icon: '🎉', color: 'green',
          message: `All good! You’re on track. Saving about ₹${monthly.toLocaleString()}/mo keeps “${latestGoal.goal}” comfy. Nice!`
        });
      } else if (effort <= 25) {
        next.push({
          type: 'info', icon: '💪', color: 'blue',
          message: `Solid plan. Save ~₹${monthly.toLocaleString()}/mo (${effort}% of income) to hit “${latestGoal.goal}”. Keep it rolling!`
        });
      } else if (effort <= 35) {
        next.push({
          type: 'warning', icon: '⚖️', color: 'yellow',
          message: `Stretch zone: ₹${monthly.toLocaleString()}/mo (${effort}%). Trim a few extras or add 3 months for breathing room.`
        });
      } else if (effort <= 50) {
        next.push({
          type: 'warning', icon: '🔥', color: 'orange',
          message: `Tough but doable: ₹${monthly.toLocaleString()}/mo (${effort}%). Consider extending by 6 months or boosting income.`
        });
      } else {
        next.push({
          type: 'error', icon: '⛔', color: 'red',
          message: `Critical: Needs ₹${monthly.toLocaleString()}/mo (${effort}%). Try a longer duration or lower target before proceeding.`
        });
      }

      // Not feasible flag (10x savings rule)
      if (Number(latestGoal.amount) >= SAVINGS * 10) {
        next.unshift({
          type: 'error', icon: '🚧', color: 'red',
          message: `Not feasible right now: goal is ≥ 10× current savings. Reduce target or extend duration.`
        });
      }

      // Fun “if this then that” nudge when effort > 25%
      if (effort > 25) {
        next.push({
          type: 'info', icon: '🧠', color: 'purple',
          message: `If you order takeout twice less this week, “${latestGoal.goal}” gets there faster by ₹1,000+.`
        });
      }
    } else {
      // No goal yet: friendly prompt
      next.push({
        type: 'info', icon: '✨', color: 'blue',
        message: 'Set a goal in AI Goal Planner to unlock smart alerts tailored to you.'
      });
    }

    setAlerts(next);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl font-bold mb-2">Financial Alerts</h2>
        <p className="text-zinc-400">Stay on top of your finances with smart notifications</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={index}
            className={`p-5 bg-${alert.color}-500/10 rounded-lg flex items-start space-x-4 border border-${alert.color}-500/30`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <span className={`text-${alert.color}-400 text-2xl mt-1`}>{alert.icon}</span>
            <div className="flex-1">
              <p className="text-zinc-200 text-sm leading-relaxed">{alert.message}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alert Settings */}
      <motion.div 
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Alert Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-zinc-300">Budget overspending alerts</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-600 bg-zinc-800 border-zinc-700 rounded focus:ring-brand-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-zinc-300">Bill payment reminders</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-600 bg-zinc-800 border-zinc-700 rounded focus:ring-brand-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-zinc-300">Goal milestone notifications</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-600 bg-zinc-800 border-zinc-700 rounded focus:ring-brand-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-zinc-300">Investment opportunities</span>
            <input type="checkbox" className="w-5 h-5 text-brand-600 bg-zinc-800 border-zinc-700 rounded focus:ring-brand-500" />
          </label>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialAlerts;
