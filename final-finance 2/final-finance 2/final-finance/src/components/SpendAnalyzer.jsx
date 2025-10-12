import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const CATEGORY_COLORS = {
  Food: '#8b5cf6',
  Bills: '#a855f7',
  Transport: '#d946ef',
  Shopping: '#f43f5e',
  Entertainment: '#ec4899',
};

const SANDBOX_URL = 'http://localhost:8000/messages';
const SALARY_STORAGE_KEY = 'monthlySalary';
const DEFAULT_SALARY = 50000; // fallback if not provided after login

const SpendAnalyzer = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [monthlySalary, setMonthlySalary] = useState(DEFAULT_SALARY);
  const [monthlySavings, setMonthlySavings] = useState(Math.round(DEFAULT_SALARY * 0.3));

  const fetchMessages = async () => {
    try {
      const res = await fetch(SANDBOX_URL);
      const data = await res.json();
      setTransactions(data || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError('Failed to load spend data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const id = setInterval(fetchMessages, 5000);
    return () => clearInterval(id);
  }, []);

  // Load monthly salary from localStorage (set during/after login) and compute constant savings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SALARY_STORAGE_KEY);
      const salary = raw ? Number(raw) : DEFAULT_SALARY;
      const validSalary = Number.isFinite(salary) && salary > 0 ? salary : DEFAULT_SALARY;
      setMonthlySalary(validSalary);
      // Constant savings approximation (e.g., 30% of salary)
      setMonthlySavings(Math.round(validSalary * 0.3));
    } catch (_) {
      setMonthlySalary(DEFAULT_SALARY);
      setMonthlySavings(Math.round(DEFAULT_SALARY * 0.3));
    }
  }, []);

  // Aggregate category totals for pie chart
  const pieData = useMemo(() => {
    const totals = {};
    for (const tx of transactions) {
      const cat = tx.category || 'Other';
      totals[cat] = (totals[cat] || 0) + (tx.amount || 0);
    }
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#8884d8',
    }));
  }, [transactions]);

  // Basic time series (sum per day)
  const lineData = useMemo(() => {
    const byDay = new Map();
    for (const tx of transactions) {
      const day = (tx.timestamp || '').slice(0, 10);
      if (!day) continue;
      byDay.set(day, (byDay.get(day) || 0) + (tx.amount || 0));
    }
    return Array.from(byDay.entries())
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([date, total]) => ({ date, total }));
  }, [transactions]);

  const totalSpent = useMemo(
    () => transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
    [transactions]
  );

  // Savings rate intentionally hidden for demo simplicity

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl font-bold mb-2">Monthly Overview</h2>
        <p className="text-zinc-400">
          {error ? error : loading ? 'Loading your financial summary...' : 'Live spending from SMS Sandbox'}
        </p>
      </motion.div>

      {/* Spend Analyzer Pie */}
      <motion.div
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Spend Analyzer</h3>
          <span className="text-xs text-zinc-400">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : '—'}
          </span>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} className="focus:outline-none" />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-zinc-300">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Time Series */}
      <motion.div
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Daily Spending</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`₹${value}`, 'Total']} />
              <Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
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
          <h4 className="text-zinc-400 text-sm mb-2">Total Spent (sample)</h4>
          <p className="text-3xl font-bold text-white">₹{totalSpent}</p>
          <p className="text-sm text-zinc-400 mt-2">Sandbox simulated data</p>
        </motion.div>

        <motion.div
          className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-zinc-400 text-sm mb-2">Categories</h4>
          <p className="text-3xl font-bold text-white">{pieData.length}</p>
          <p className="text-sm text-zinc-400 mt-2">Active this period</p>
        </motion.div>

        <motion.div
          className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-zinc-400 text-sm mb-2">Transactions</h4>
          <p className="text-3xl font-bold text-white">{transactions.length}</p>
          <p className="text-sm text-zinc-400 mt-2">Pulled from sandbox</p>
        </motion.div>
      </div>

      {/* Savings Snapshot (constant based on salary) */}
      <motion.div
        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Monthly Savings (constant)</h3>
          <span className="text-xs text-zinc-400">from salary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
            <p className="text-zinc-400 text-sm">Monthly Salary</p>
            <p className="text-2xl font-bold text-white">₹{monthlySalary}</p>
          </div>
          <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
            <p className="text-zinc-400 text-sm">Monthly Savings</p>
            <p className="text-2xl font-bold text-emerald-400">₹{monthlySavings}</p>
          </div>
          {/* Savings Rate hidden */}
        </div>
        <p className="text-xs text-zinc-500 mt-3">Tip: You can set your salary during/after login; it is read from localStorage key '{SALARY_STORAGE_KEY}'.</p>
      </motion.div>
    </div>
  );
};

export default SpendAnalyzer;
