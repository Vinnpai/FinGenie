import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const DashboardOverview = () => {
  const [savedGoals, setSavedGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);

  // Fetch saved goals for statistics
  useEffect(() => {
    fetchSavedGoals();
  }, []);

  const fetchSavedGoals = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/goals');
      if (response.ok) {
        const data = await response.json();
        setSavedGoals(data.goals || []);
      }
    } catch (error) {
      console.log('Could not fetch saved goals:', error);
    } finally {
      setLoadingGoals(false);
    }
  };

  // Calculate statistics
  const totalGoals = savedGoals.length;
  const totalTargetAmount = savedGoals.reduce((sum, goal) => sum + (goal.amount || 0), 0);
  const totalSaved = savedGoals.reduce((sum, goal) => sum + (goal.progress?.currentSaved || goal.savings || 0), 0);
  const totalMonthlyRequired = savedGoals.reduce((sum, goal) => sum + (goal.plan?.monthly_saving || 0), 0);
  const completionPercentage = totalTargetAmount > 0 ? ((totalSaved / totalTargetAmount) * 100).toFixed(1) : 0;

  // Spend Analyzer Data
  const spendData = [
    { name: 'Groceries', value: 400, color: '#8b5cf6' },
    { name: 'Utilities', value: 300, color: '#a855f7' },
    { name: 'Transport', value: 300, color: '#d946ef' },
    { name: 'Dining Out', value: 200, color: '#ec4899' },
    { name: 'Shopping', value: 500, color: '#f43f5e' },
  ];

  const totalSpent = spendData.reduce((sum, item) => sum + item.value, 0);

  // Monthly comparison data for bar chart
  const monthlyData = [
    { month: 'Jan', spent: 1200, budget: 1500 },
    { month: 'Feb', spent: 1400, budget: 1500 },
    { month: 'Mar', spent: 1600, budget: 1500 },
    { month: 'Apr', spent: 1300, budget: 1500 },
    { month: 'May', spent: 1700, budget: 1500 },
    { month: 'Jun', spent: 1500, budget: 1500 },
  ];

  // Heatmap data (activity tracker)
  const generateHeatmapData = () => {
    const weeks = 12;
    const daysPerWeek = 7;
    const data = [];
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < daysPerWeek; day++) {
        data.push({
          week,
          day,
          value: Math.floor(Math.random() * 5), // 0-4 intensity
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const getHeatmapColor = (value) => {
    const colors = ['#18181b', '#3f3f46', '#8b5cf6', '#a855f7', '#d946ef'];
    return colors[value] || colors[0];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-zinc-400">Your complete financial snapshot</p>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">📊 Financial Activity Heatmap</h3>
        <p className="text-sm text-zinc-400 mb-4">Your savings and spending activity over the past 12 weeks</p>
        
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {Array.from({ length: 12 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dataPoint = heatmapData.find(d => d.week === weekIndex && d.day === dayIndex);
                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className="w-4 h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-brand-500"
                      style={{ backgroundColor: getHeatmapColor(dataPoint?.value || 0) }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                      title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}: ${dataPoint?.value || 0} activities`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(val => (
              <div key={val} className="w-4 h-4 rounded-sm" style={{ backgroundColor: getHeatmapColor(val) }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </motion.div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Total Spent</span>
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-2">This month</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Active Goals</span>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold">{totalGoals}</p>
          <p className="text-xs opacity-75 mt-2">{completionPercentage}% complete</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Total Saved</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold">${totalSaved.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-2">Across all goals</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Monthly Target</span>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold">${totalMonthlyRequired.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-2">Required savings</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spend Analyzer */}
        <motion.div
          className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">💳 Spending Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {spendData.map(item => (
              <div key={item.name} className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-zinc-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">${item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">📊 Monthly Spending Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="spent" fill="#8b5cf6" name="Spent" radius={[8, 8, 0, 0]} />
                <Bar dataKey="budget" fill="#3f3f46" name="Budget" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* AI Goal Planner Stats */}
      <motion.div
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6">🎯 Goal Planner Statistics</h3>
        
        {loadingGoals ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="text-zinc-400 mt-2 text-sm">Loading goals...</p>
          </div>
        ) : savedGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedGoals.slice(0, 3).map((goal, index) => {
              const currentSaved = goal.progress?.currentSaved || goal.savings || 0;
              const percentage = ((currentSaved / goal.amount) * 100).toFixed(1);
              
              return (
                <motion.div
                  key={goal._id}
                  className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 + index * 0.1 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-3">{goal.goal}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-brand-400 font-semibold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-brand-600 to-brand-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Saved</span>
                      <span className="text-white font-semibold">${currentSaved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Target</span>
                      <span className="text-white font-semibold">${goal.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400">
            <p>No goals created yet. Start planning your financial future!</p>
          </div>
        )}
      </motion.div>

      {/* Investment Advisor Stats */}
      <motion.div
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6">📈 Investment Portfolio Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-600/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-300">Conservative</span>
              <span className="text-2xl">🛡️</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">$12,500</p>
            <p className="text-sm text-green-400">+4.2% this month</p>
            <div className="mt-3 pt-3 border-t border-green-600/30">
              <p className="text-xs text-zinc-400">Low risk, stable returns</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border border-yellow-600/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-300">Moderate</span>
              <span className="text-2xl">⚖️</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">$8,750</p>
            <p className="text-sm text-yellow-400">+8.7% this month</p>
            <div className="mt-3 pt-3 border-t border-yellow-600/30">
              <p className="text-xs text-zinc-400">Balanced growth strategy</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-600/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-300">Aggressive</span>
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">$5,200</p>
            <p className="text-sm text-red-400">+15.3% this month</p>
            <div className="mt-3 pt-3 border-t border-red-600/30">
              <p className="text-xs text-zinc-400">High risk, high returns</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-white">$26,450</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400 mb-1">Overall Growth</p>
              <p className="text-2xl font-bold text-green-400">+9.1%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="bg-gradient-to-r from-brand-600/10 to-purple-600/10 rounded-2xl border border-brand-600/30 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-brand-500/50 rounded-xl p-4 transition-all text-left">
            <span className="text-2xl mb-2 block">💰</span>
            <p className="text-sm font-semibold text-white">Add Transaction</p>
          </button>
          <button className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-brand-500/50 rounded-xl p-4 transition-all text-left">
            <span className="text-2xl mb-2 block">🎯</span>
            <p className="text-sm font-semibold text-white">Create Goal</p>
          </button>
          <button className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-brand-500/50 rounded-xl p-4 transition-all text-left">
            <span className="text-2xl mb-2 block">📊</span>
            <p className="text-sm font-semibold text-white">View Reports</p>
          </button>
          <button className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-brand-500/50 rounded-xl p-4 transition-all text-left">
            <span className="text-2xl mb-2 block">⚙️</span>
            <p className="text-sm font-semibold text-white">Settings</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
