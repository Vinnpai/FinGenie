import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const spendData = [
  { name: 'Groceries', value: 400, color: '#8b5cf6' },
  { name: 'Utilities', value: 300, color: '#a855f7' },
  { name: 'Transport', value: 300, color: '#d946ef' },
  { name: 'Dining Out', value: 200, color: '#ec4899' },
  { name: 'Shopping', value: 500, color: '#f43f5e' },
];

const SpendAnalyzer = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl font-bold mb-2">Monthly Overview</h2>
        <p className="text-zinc-400">Here's your financial summary for October 2025.</p>
      </motion.div>

      {/* Spend Analyzer Chart */}
      <motion.div 
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6" 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Spend Analyzer</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={spendData} 
                cx="50%" 
                cy="50%" 
                innerRadius={70} 
                outerRadius={90} 
                fill="#8884d8" 
                paddingAngle={5} 
                dataKey="value"
              >
                {spendData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} className="focus:outline-none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {spendData.map(item => (
            <div key={item.name} className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
              <span className="text-zinc-300">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-zinc-400 text-sm mb-2">Total Spent</h4>
          <p className="text-3xl font-bold text-white">$1,700</p>
          <p className="text-sm text-red-400 mt-2">+12% from last month</p>
        </motion.div>

        <motion.div 
          className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-zinc-400 text-sm mb-2">Budget Remaining</h4>
          <p className="text-3xl font-bold text-white">$800</p>
          <p className="text-sm text-green-400 mt-2">32% of monthly budget</p>
        </motion.div>

        <motion.div 
          className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-zinc-400 text-sm mb-2">Highest Category</h4>
          <p className="text-3xl font-bold text-white">Shopping</p>
          <p className="text-sm text-zinc-400 mt-2">$500 this month</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SpendAnalyzer;
