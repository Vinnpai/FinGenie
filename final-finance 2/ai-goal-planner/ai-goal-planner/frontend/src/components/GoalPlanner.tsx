import React, { useState } from 'react';
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

const GoalPlanner: React.FC = () => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <span className="text-5xl">🎯</span>
              <h1 className="text-4xl font-bold text-primary">
                AI Goal Planner
              </h1>
            </div>
            <p className="text-primary text-lg">
              Get personalized financial plans powered by AI
            </p>
            <p className="text-accent text-sm mt-2">
              Using free AI models for smart goal planning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent border-opacity-30">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Your Financial Goal
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Description
                  </label>
                  <input
                    type="text"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="e.g., Buy a laptop, Vacation, House down payment"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="60000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Duration (months)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="12"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                    min="1"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    placeholder="50000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Savings (₹) - Optional
                  </label>
                  <input
                    type="number"
                    name="savings"
                    value={formData.savings}
                    onChange={handleInputChange}
                    placeholder="10000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    min="0"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
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
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent border-opacity-30">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Your AI-Generated Plan
              </h2>

              {error && (
                <div className="bg-secondary bg-opacity-10 border-2 border-secondary text-primary px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">⚠️ {error}</p>
                </div>
              )}

              {plan ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-r from-secondary to-pink-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">💰 Monthly Saving Required</h3>
                    <p className="text-4xl font-bold">₹{plan.monthly_saving.toLocaleString()}</p>
                  </div>

                  <div className="bg-accent bg-opacity-20 p-6 rounded-lg border-2 border-accent border-opacity-30">
                    <h3 className="text-lg font-semibold text-primary mb-2">📈 Investment Strategy</h3>
                    <p className="text-primary leading-relaxed">{plan.investment_strategy}</p>
                  </div>

                  <div className="bg-light p-6 rounded-lg border-2 border-accent border-opacity-20">
                    <h3 className="text-lg font-semibold text-primary mb-2">🤖 AI Summary</h3>
                    <p className="text-primary leading-relaxed">{plan.summary}</p>
                  </div>

                  <div className="bg-primary text-light p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-3">✨ Key Insights</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-secondary mr-2">•</span>
                        <span>Save ₹{plan.monthly_saving.toLocaleString()} every month</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-secondary mr-2">•</span>
                        <span>Total savings: ₹{(plan.monthly_saving * formData.duration).toLocaleString()}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-secondary mr-2">•</span>
                        <span>Investment growth potential included</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-secondary mr-2">•</span>
                        <span>Personalized to your income level</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-accent py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-lg text-primary">Enter your financial goal above to get your personalized AI plan</p>
                  <p className="text-sm text-accent mt-2">Powered by free AI models</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;
