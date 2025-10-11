import React, { useState, useEffect } from 'react';
import GoalCard from '../components/GoalCard';
import ProgressChart from '../components/ProgressChart';
import WeeklySavingsTracker from '../components/WeeklySavingsTracker';
import NotificationPanel from '../components/NotificationPanel';
import apiService from '../services/api';

interface GoalData {
  goal: string;
  amount: number;
  duration: number;
  income: number;
  savings: number;
}

interface PlanResponse {
  monthly_saving: number;
  investment_strategy: string;
  summary: string;
}

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
  createdAt: string;
}

const HomePage: React.FC = () => {
  // Goal Creation State
  const [formData, setFormData] = useState<GoalData>({
    goal: '',
    amount: 0,
    duration: 12,
    income: 0,
    savings: 0
  });
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadGoals();
    loadNotifications();
  }, []);

  const loadGoals = async () => {
    try {
      setLoadingGoals(true);
      const response = await apiService.getGoals();
      setGoals(response.goals || []);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoadingGoals(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiService.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'goal' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const data = await apiService.createGoal(formData);
      setPlan(data);
      // Reload goals after creating a new one
      await loadGoals();
      await loadNotifications();
      // Reset form
      setFormData({
        goal: '',
        amount: 0,
        duration: 12,
        income: 0,
        savings: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (goalId: string, amount: number) => {
    try {
      await apiService.updateGoalProgress(goalId, amount);
      await loadGoals();
      await loadNotifications();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await apiService.deleteGoal(goalId);
        await loadGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-violet-950 to-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <span className="text-5xl">🎯</span>
            <h1 className="text-4xl font-bold text-white">
              AI Goal Planner
            </h1>
          </div>
          <p className="text-zinc-300 text-lg">
            Create and track your financial goals powered by AI
          </p>
        </div>

        {/* Create Goal Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl shadow-lg shadow-brand-500/25 p-8 border border-zinc-800">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">✨</span>
              Create New Goal
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Goal Description
                    </label>
                    <input
                      type="text"
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      placeholder="e.g., Buy a laptop, Vacation, House down payment"
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Target Amount (₹)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="60000"
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Duration (months)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="12"
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        required
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Monthly Income (₹)
                      </label>
                      <input
                        type="number"
                        name="income"
                        value={formData.income}
                        onChange={handleInputChange}
                        placeholder="50000"
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Current Savings (₹)
                      </label>
                      <input
                        type="number"
                        name="savings"
                        value={formData.savings}
                        onChange={handleInputChange}
                        placeholder="10000"
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-brand-500 hover:to-brand-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-brand-500/25"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Plan...
                      </span>
                    ) : (
                      '✨ Generate AI Plan'
                    )}
                  </button>
                </form>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Your AI-Generated Plan
                </h3>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4">
                    <p className="font-semibold">⚠️ {error}</p>
                  </div>
                )}

                {plan ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white p-5 rounded-lg shadow-md shadow-brand-500/25">
                      <h4 className="text-lg font-semibold mb-1">💰 Monthly Saving Required</h4>
                      <p className="text-3xl font-bold">₹{plan.monthly_saving.toLocaleString()}</p>
                    </div>

                    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                      <h4 className="text-md font-semibold text-brand-300 mb-2">📈 Investment Strategy</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{plan.investment_strategy}</p>
                    </div>

                    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                      <h4 className="text-md font-semibold text-brand-300 mb-2">🤖 AI Summary</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{plan.summary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-zinc-400 py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-md text-zinc-300">Enter your financial goal to get your personalized AI plan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
              <span className="text-4xl mr-3">📊</span>
              My Goals Dashboard
            </h2>
            <p className="text-zinc-300">Track your financial goals and progress</p>
          </div>

          {/* Notifications */}
          <NotificationPanel 
            notifications={notifications}
            onDismiss={(id: string) => setNotifications(notifications.filter(n => n.goalId !== id))}
          />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl shadow-lg shadow-brand-500/10 p-6 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Total Goals</p>
                  <p className="text-3xl font-bold text-white">{goals.length}</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl shadow-lg shadow-brand-500/10 p-6 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Total Target</p>
                  <p className="text-3xl font-bold text-brand-400">
                    ₹{goals.reduce((sum, g) => sum + g.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl shadow-lg shadow-brand-500/10 p-6 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Total Saved</p>
                  <p className="text-3xl font-bold text-white">
                    ₹{goals.reduce((sum, g) => sum + (g.progress?.currentSaved || g.savings), 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Goals Grid */}
          {loadingGoals ? (
            <div className="text-center py-12">
              <div className="animate-spin text-6xl mb-4">⏳</div>
              <p className="text-zinc-400">Loading your goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl shadow-lg shadow-brand-500/10 p-12 text-center border border-zinc-800">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Goals Yet</h3>
              <p className="text-zinc-400 mb-6">Create your first financial goal above to get started!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {goals.map(goal => (
                <div key={goal._id} className="bg-zinc-900/40 backdrop-blur-sm rounded-xl shadow-lg shadow-brand-500/10 p-6 border border-zinc-800">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Goal Details */}
                    <div>
                      <GoalCard 
                        goal={goal} 
                        onDelete={handleDeleteGoal}
                        onUpdate={() => {}}
                      />
                    </div>

                    {/* Progress Chart */}
                    <div>
                      <ProgressChart goal={goal} />
                      <WeeklySavingsTracker 
                        goal={goal}
                        onUpdate={(amount) => handleUpdateProgress(goal._id, amount)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
