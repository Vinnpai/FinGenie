import { motion } from 'framer-motion';

const FinancialAlerts = () => {
  const alerts = [
    {
      type: 'warning',
      icon: '⚠',
      color: 'yellow',
      message: "High Spending Alert: 'Dining Out' is 40% over budget this month."
    },
    {
      type: 'info',
      icon: 'ℹ',
      color: 'blue',
      message: 'Bill Reminder: Netflix payment of $15.99 is due in 3 days.'
    },
    {
      type: 'success',
      icon: '✅',
      color: 'green',
      message: "You're on track to meet your 'Vacation Fund' savings goal!"
    },
    {
      type: 'warning',
      icon: '📊',
      color: 'orange',
      message: 'Your credit card utilization is at 75%. Consider paying down the balance.'
    },
    {
      type: 'info',
      icon: '💡',
      color: 'purple',
      message: 'Tip: You could save $120/month by reducing shopping expenses by 20%.'
    }
  ];

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
