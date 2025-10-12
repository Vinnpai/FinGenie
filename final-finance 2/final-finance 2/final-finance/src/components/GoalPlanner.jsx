import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

function randPercent() {
  const min = 10;
  const max = 15;
  const p = Math.floor(Math.random() * (max - min + 1)) + min;
  return p / 100;
}

export default function GoalPlanner() {
  const [monthlyIncome] = useState(50000);
  const [currentSavings] = useState(100000);
  const [savingsPercent, setSavingsPercent] = useState(0.12);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [targetMonths, setTargetMonths] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [plans, setPlans] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const p = randPercent();
    setSavingsPercent(p);
    setLastUpdated(new Date());
  }, []);

  const monthlySavings = useMemo(
    () => Math.round(monthlyIncome * savingsPercent),
    [monthlyIncome, savingsPercent]
  );

  function evaluate(goalAmount, desiredMonths) {
    const amt = Number(goalAmount) || 0;
    // Remaining after current savings
    const remaining = Math.max(amt - currentSavings, 0);
    const monthsToGoal = Math.ceil(remaining / Math.max(monthlySavings, 1));
    const ratio = amt / Math.max(monthlyIncome, 1);
    let feasible = false;
    let health = { score: 40, label: "Aggressive" };
    if (ratio <= 3) {
      feasible = true;
      health = { score: 85, label: "Healthy" };
    } else if (ratio <= 12) {
      feasible = true;
      health = { score: 65, label: "Stretch" };
    }
    // If user provides desired months, compute recommended monthly saving
    const desired = Number(desiredMonths) || 0;
    const recommendedMonthly = desired > 0 ? Math.ceil(remaining / desired) : Math.ceil(remaining / Math.max(monthsToGoal, 1));
    const monthlyGap = Math.max(recommendedMonthly - monthlySavings, 0);
    const effortPct = Math.min(100, Math.round((recommendedMonthly / monthlyIncome) * 100));
    // Difficulty based on target horizon (prefer desired if provided)
    const horizon = desired > 0 ? desired : monthsToGoal;
    let difficulty = "Very Hard";
    if (horizon <= 12) difficulty = "Easy";
    else if (horizon <= 36) difficulty = "Moderate";
    else if (horizon <= 60) difficulty = "Hard";
    const suggestedSIP = Math.min(Math.round(monthlyIncome * 0.2), monthlySavings);
    const analysis = `Remaining ₹${remaining.toLocaleString()} • ${horizon} months target • Need ₹${recommendedMonthly.toLocaleString()}/mo (${effortPct}% of income). Gap vs auto-savings: ₹${monthlyGap.toLocaleString()}/mo.`;
    return { remaining, monthsToGoal, feasible, health, difficulty, suggestedSIP, recommendedMonthly, monthlyGap, effortPct, analysis, horizon };
  }

  function onAddGoal(e) {
    e.preventDefault();
    const amt = Number(amount);
    if (!desc || !Number.isFinite(amt) || amt <= 0) return;
    const res = evaluate(amt, targetMonths);
    const item = {
      id: Date.now(),
      description: desc,
      targetAmount: amt,
      currentSavings,
      horizon: res.horizon,
      priority,
      monthlyIncome,
      monthlySavings,
      ...res,
    };
    setPlans((prev) => {
      const next = [...prev, item];
      return next.sort((a, b) => {
        const rank = { High: 0, Medium: 1, Low: 2 };
        if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
        return a.monthsToGoal - b.monthsToGoal;
      });
    });
    setDesc("");
    setAmount("");
    setPriority("Medium");
    setTargetMonths("");
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl font-bold mb-2">AI Goal Planner</h2>
        <p className="text-zinc-400">Estimated Monthly Income detected: ₹{monthlyIncome} • Savings rate {Math.round(savingsPercent * 100)}%</p>
        <p className="text-zinc-500 text-xs">Updated {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}</p>
      </motion.div>

      <motion.div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
            <p className="text-zinc-400 text-sm">Monthly Savings</p>
            <p className="text-2xl font-bold text-emerald-400">₹{monthlySavings}</p>
          </div>
          <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
            <p className="text-zinc-400 text-sm">Savings Rate</p>
            <p className="text-2xl font-bold text-white">{Math.round((monthlySavings / monthlyIncome) * 100)}%</p>
          </div>
          <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
            <p className="text-zinc-400 text-sm">Monthly Income (auto)</p>
            <p className="text-2xl font-bold text-white">₹{monthlyIncome}</p>
          </div>
          <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-4">
            <p className="text-zinc-400 text-sm">Current Savings (auto)</p>
            <p className="text-2xl font-bold text-white">₹{currentSavings}</p>
          </div>
        </div>
      </motion.div>

      <motion.form onSubmit={onAddGoal} className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Goal description" className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3 text-white outline-none" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Target amount (₹)" type="number" min="1" className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3 text-white outline-none" />
          <input value={targetMonths} onChange={(e) => setTargetMonths(e.target.value)} placeholder="Target months (optional)" type="number" min="1" className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3 text-white outline-none" />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3 text-white outline-none">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 font-medium hover:bg-brand-500">Add Goal</button>
        </div>
      </motion.form>

      <motion.div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-xl font-semibold text-white mb-4">Planned Goals</h3>
        {plans.length === 0 ? (
          <p className="text-zinc-400 text-sm">No goals yet. Add one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-zinc-400">
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Goal</th>
                  <th className="text-right p-2">Target (₹)</th>
                  <th className="text-right p-2">Current (₹)</th>
                  <th className="text-right p-2">Months</th>
                  <th className="text-right p-2">Need/Month (₹)</th>
                  <th className="text-right p-2">Gap (₹)</th>
                  <th className="text-left p-2">Effort</th>
                  <th className="text-left p-2">Feasible</th>
                  <th className="text-left p-2">Health</th>
                  <th className="text-left p-2">Difficulty</th>
                  <th className="text-right p-2">SIP (₹)</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((g) => (
                  <tr key={g.id} className="border-t border-zinc-800 text-white">
                    <td className="p-2">{g.priority}</td>
                    <td className="p-2">{g.description}</td>
                    <td className="p-2 text-right">{g.targetAmount}</td>
                    <td className="p-2 text-right">{g.currentSavings}</td>
                    <td className="p-2 text-right">{g.horizon}</td>
                    <td className="p-2 text-right">{g.recommendedMonthly}</td>
                    <td className="p-2 text-right">{g.monthlyGap}</td>
                    <td className="p-2">{g.effortPct}% of income</td>
                    <td className="p-2">{g.feasible ? "Feasible" : "Not feasible"}</td>
                    <td className="p-2">{g.health.label}</td>
                    <td className="p-2">{g.difficulty}</td>
                    <td className="p-2 text-right">{g.suggestedSIP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <motion.div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="text-xl font-semibold text-white mb-3">Detailed Analysis</h3>
        {plans.length === 0 ? (
          <p className="text-zinc-400 text-sm">Add a goal to see the breakdown.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-2 text-sm text-zinc-300">
            {plans.map((g) => (
              <li key={`a-${g.id}`}>{g.description}: {g.analysis}</li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
