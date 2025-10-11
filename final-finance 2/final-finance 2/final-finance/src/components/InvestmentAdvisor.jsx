import { motion } from 'framer-motion';
import { useState } from 'react';

const InvestmentAdvisor = () => {
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('5');

  const recommendations = {
    conservative: [
      { name: 'Government Bonds', allocation: '60%', risk: 'Low', returns: '4-6%' },
      { name: 'Fixed Deposits', allocation: '30%', risk: 'Low', returns: '5-7%' },
      { name: 'Blue Chip Stocks', allocation: '10%', risk: 'Medium', returns: '8-12%' }
    ],
    moderate: [
      { name: 'Index Funds', allocation: '40%', risk: 'Medium', returns: '10-15%' },
      { name: 'Corporate Bonds', allocation: '30%', risk: 'Low-Medium', returns: '6-9%' },
      { name: 'Dividend Stocks', allocation: '20%', risk: 'Medium', returns: '8-14%' },
      { name: 'REITs', allocation: '10%', risk: 'Medium', returns: '7-12%' }
    ],
    aggressive: [
      { name: 'Growth Stocks', allocation: '50%', risk: 'High', returns: '15-25%' },
      { name: 'Tech Sector ETFs', allocation: '25%', risk: 'High', returns: '12-20%' },
      { name: 'Emerging Markets', allocation: '15%', risk: 'High', returns: '10-18%' },
      { name: 'Cryptocurrency', allocation: '10%', risk: 'Very High', returns: '20-50%' }
    ]
  };

  const currentRecommendations = recommendations[riskProfile];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-4xl">📈</span>
          <h2 className="text-3xl font-bold">Personalized Investment Advisor</h2>
        </div>
        <p className="text-zinc-400">Get AI-powered investment recommendations tailored to your risk profile</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <motion.div 
          className="lg:col-span-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Your Profile</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Investment Amount ($)
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="10000"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Time Horizon (years)
              </label>
              <select
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="1">1 year</option>
                <option value="3">3 years</option>
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="20">20+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Risk Profile
              </label>
              <div className="space-y-2">
                {['conservative', 'moderate', 'aggressive'].map((profile) => (
                  <label key={profile} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="riskProfile"
                      value={profile}
                      checked={riskProfile === profile}
                      onChange={(e) => setRiskProfile(e.target.value)}
                      className="w-4 h-4 text-brand-600 bg-zinc-800 border-zinc-700 focus:ring-brand-500"
                    />
                    <span className="text-zinc-300 capitalize">{profile}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-brand-500 hover:to-brand-600 transition-all transform hover:scale-105 shadow-lg">
                Generate Portfolio
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recommendations Section */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recommended Portfolio - <span className="text-brand-400 capitalize">{riskProfile}</span>
            </h3>
            
            <div className="space-y-4">
              {currentRecommendations.map((investment, index) => (
                <motion.div
                  key={index}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-semibold">{investment.name}</h4>
                      <p className="text-sm text-zinc-400">Expected Returns: {investment.returns}</p>
                    </div>
                    <span className="text-2xl font-bold text-brand-400">{investment.allocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      investment.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                      investment.risk === 'Medium' || investment.risk === 'Low-Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Risk: {investment.risk}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Projected Returns */}
          <motion.div 
            className="bg-gradient-to-br from-brand-600 to-purple-600 rounded-2xl p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-xl font-semibold mb-4">💰 Projected Returns</h3>
            {investmentAmount && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Initial Investment:</span>
                  <span className="font-bold">${Number(investmentAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Value ({timeHorizon} years):</span>
                  <span className="font-bold text-2xl">
                    ${(Number(investmentAmount) * (1 + (riskProfile === 'conservative' ? 0.05 : riskProfile === 'moderate' ? 0.12 : 0.18) * Number(timeHorizon))).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </span>
                </div>
                <p className="text-sm text-white/80 mt-3">
                  * Projections are estimates based on historical data and market conditions
                </p>
              </div>
            )}
          </motion.div>

          {/* AI Insights */}
          <motion.div 
            className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">🤖 AI Insights</h3>
            <div className="space-y-3 text-zinc-300 text-sm">
              <p>✓ Your {riskProfile} profile is well-suited for a {timeHorizon}-year investment horizon.</p>
              <p>✓ Diversification across {currentRecommendations.length} asset classes reduces overall risk.</p>
              <p>✓ Consider rebalancing your portfolio annually to maintain target allocations.</p>
              <p>✓ {riskProfile === 'aggressive' ? 'High-risk investments require regular monitoring and strong risk tolerance.' : riskProfile === 'moderate' ? 'Balanced approach provides steady growth with manageable risk.' : 'Conservative strategy prioritizes capital preservation over high returns.'}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestmentAdvisor;
