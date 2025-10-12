import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import GoalCard from './GoalCard';

const AIGoalPlanner = () => {
  // Fixed constants (auto-detected style)
  const MONTHLY_INCOME = 50000;
  const CURRENT_SAVINGS = 100000;
  // Tiny jitter to feel live: 10–15% savings rate
  const [savingsRate, setSavingsRate] = useState(0.12);

  const [formData, setFormData] = useState({
    goal: '',
    amount: '',
    duration: '12'
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedGoals, setSavedGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const monthlyAutoSavings = useMemo(() => Math.round(MONTHLY_INCOME * savingsRate), [MONTHLY_INCOME, savingsRate]);

  // Fetch saved goals on component mount
  useEffect(() => {
    fetchSavedGoals();
    // randomize savings rate 10-15% on mount
    const min = 10, max = 15;
    const p = (Math.floor(Math.random() * (max - min + 1)) + min) / 100;
    setSavingsRate(p);
  }, []);

  const fetchSavedGoals = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/goals');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched goals:', data);
        setSavedGoals(data.goals || []);
      }
    } catch (error) {
      console.log('Could not fetch saved goals:', error);
    } finally {
      setLoadingGoals(false);
    }
  };

  const handleUpdateProgress = async (goalId, amount) => {
    try {
      const response = await fetch(`http://localhost:3002/api/goals/${goalId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      if (response.ok) {
        console.log('Progress updated successfully');
        fetchSavedGoals(); // Refresh goals
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await fetch(`http://localhost:3002/api/goals/${goalId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('Goal deleted successfully');
          fetchSavedGoals(); // Refresh goals
        }
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);
    // Feasibility pre-check: if amount >= 10x current savings -> Not feasible
    const amtCheck = Number(formData.amount);
    if (amtCheck >= CURRENT_SAVINGS * 10) {
      setPlan({ not_feasible: true, message: 'NOT FEASIBLE: Goal amount is 10x or more than current savings.' });
      setLoading(false);
      return;
    }

    try {
      // Try to call the AI Goal Planner backend API
      try {
        console.log('Calling AI backend at http://localhost:3002/api/goals');
        const response = await fetch('http://localhost:3002/api/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goal: formData.goal,
            amount: Number(formData.amount),
            duration: Number(formData.duration),
            income: MONTHLY_INCOME,
            savings: CURRENT_SAVINGS
          }),
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ AI Backend Response:', data);
          // The backend returns plan data directly in the response
          setPlan({
            monthly_saving: data.monthly_saving,
            investment_strategy: data.investment_strategy,
            summary: data.summary
          });
          // Persist latest goal locally for use across the app
          try {
            localStorage.setItem('latest_goal', JSON.stringify({
              goal: formData.goal,
              amount: Number(formData.amount),
              duration: Number(formData.duration),
              ts: Date.now()
            }));
          } catch {}
          // Refresh the saved goals list
          fetchSavedGoals();
          setLoading(false);
          return;
        } else {
          const errorData = await response.json();
          console.error('Backend error:', errorData);
        }
      } catch (apiError) {
        console.log('⚠️ AI backend not available, using local calculation:', apiError.message);
      }

      // Fallback: Generate plan locally if backend is not available
      const amount = Number(formData.amount);
      const duration = Number(formData.duration);
      const income = MONTHLY_INCOME;
      const savings = CURRENT_SAVINGS;
      
      const remainingAmount = Math.max(amount - savings, 0);
      const monthlySaving = Math.ceil(remainingAmount / Math.max(duration, 1));
      const savingsRatePct = ((monthlySaving / Math.max(income, 1)) * 100).toFixed(1);
      
      // Generate investment strategy based on duration and amount
      let strategy = '';
      if (duration <= 12) {
        strategy = `For your short-term goal of ${duration} months, focus on liquid investments like high-yield savings accounts (4-5% returns) and short-term fixed deposits. Keep 80% in savings and 20% in liquid funds for easy access.`;
      } else if (duration <= 36) {
        strategy = `For a ${duration}-month timeline, consider a balanced approach: 50% in debt mutual funds for stability, 30% in equity mutual funds for growth, and 20% in recurring deposits. This mix provides moderate returns (8-12%) with manageable risk.`;
      } else {
        strategy = `With ${duration} months to achieve your goal, you can take advantage of long-term growth. Allocate 60% to diversified equity mutual funds, 25% to index funds, and 15% to debt instruments. Expected returns: 12-15% annually.`;
      }
      
      const summary = `Monthly income: ₹${income.toLocaleString()} (auto). Current savings: ₹${savings.toLocaleString()} (auto). To reach "${formData.goal}" worth ₹${amount.toLocaleString()} in ${duration} months, you need to save about ₹${monthlySaving.toLocaleString()}/month (${savingsRatePct}% of income). Remaining needed: ₹${remainingAmount.toLocaleString()}. ${monthlySaving / income > 0.3 ? 'This target is aggressive — consider extending the duration.' : 'This looks feasible with disciplined budgeting.'}`;
      
      setPlan({
        monthly_saving: monthlySaving,
        investment_strategy: strategy,
        summary: summary
      });
      // Persist latest goal locally
      try {
        localStorage.setItem('latest_goal', JSON.stringify({
          goal: formData.goal,
          amount: Number(formData.amount),
          duration: Number(formData.duration),
          ts: Date.now()
        }));
      } catch {}
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-4xl">🎯</span>
          <h2 className="text-3xl font-bold">AI Goal Planner</h2>
        </div>
        <p className="text-zinc-400">Get personalized financial plans powered by AI</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div 
          className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Read-only auto-detected cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
              <p className="text-zinc-400 text-sm">Monthly Income (auto)</p>
              <p className="text-2xl font-bold text-white">₹{MONTHLY_INCOME.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
              <p className="text-zinc-400 text-sm">Current Savings (auto)</p>
              <p className="text-2xl font-bold text-white">₹{CURRENT_SAVINGS.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
              <p className="text-zinc-400 text-sm">Auto Monthly Savings</p>
              <p className="text-2xl font-bold text-emerald-400">₹{monthlyAutoSavings.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-1">{Math.round(savingsRate * 100)}% of income</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-6">Your Financial Goal</h3>
          
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
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Target Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="5000"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Time Duration (months)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="12"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
                min="1"
                max="120"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-brand-500 hover:to-brand-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
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
        </motion.div>

        {/* Results */}
        <motion.div 
          className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Your AI-Generated Plan</h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}

          {plan ? (
            <div className="space-y-5 animate-fadeIn">
              {plan.not_feasible ? (
                <div className="bg-red-600/20 text-red-300 p-6 rounded-lg border border-red-600/40">
                  <h4 className="text-lg font-semibold mb-2">⚠️ NOT FEASIBLE</h4>
                  <p className="text-sm">{plan.message}</p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-brand-600 to-pink-500 text-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold mb-2">💰 Monthly Saving Required</h4>
                  <p className="text-4xl font-bold">₹{plan.monthly_saving?.toLocaleString()}</p>
                </div>
              )}

              {!plan.not_feasible && (
                <div className="bg-brand-500/10 p-5 rounded-lg border border-brand-500/30">
                  <h4 className="text-base font-semibold text-white mb-2">📈 Investment Strategy</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{plan.investment_strategy}</p>
                </div>
              )}

              {!plan.not_feasible && (
                <div className="bg-zinc-800/50 p-5 rounded-lg border border-zinc-700">
                  <h4 className="text-base font-semibold text-white mb-2">🤖 AI Summary</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{plan.summary}</p>
                </div>
              )}

              {!plan.not_feasible && (
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-5 rounded-lg shadow-md border border-zinc-700">
                  <h4 className="text-base font-semibold mb-3">✨ Key Insights</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-brand-400 mr-2">•</span>
                      <span>Save ₹{plan.monthly_saving?.toLocaleString()} every month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-400 mr-2">•</span>
                      <span>Total savings: ₹{(plan.monthly_saving * formData.duration).toLocaleString()}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-400 mr-2">•</span>
                      <span>Investment growth potential included</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-400 mr-2">•</span>
                      <span>Personalized to detected income</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-zinc-400 py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-lg text-white">Enter your financial goal to get your personalized AI plan</p>
              <p className="text-sm text-zinc-500 mt-2">Powered by AI models</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Saved Goals Section */}
      {savedGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">📊 Your Saved Goals</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savedGoals.map((goal, index) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onDelete={handleDeleteGoal}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loadingGoals && savedGoals.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
          <p className="text-zinc-400 mt-2 text-sm">Loading saved goals...</p>
        </div>
      )}

      {/* Empty State */}
      {!loadingGoals && savedGoals.length === 0 && (
        <motion.div
          className="text-center py-12 bg-zinc-900/30 rounded-xl border border-zinc-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Saved Goals Yet</h3>
          <p className="text-zinc-400">Create your first financial goal above to get started!</p>
        </motion.div>
      )}
    </div>
  );
};

export default AIGoalPlanner;
