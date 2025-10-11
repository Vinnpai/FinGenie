import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ExpenseAnalyzer = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [heatmapData, setHeatmapData] = useState({});
  const [piggyBank, setPiggyBank] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Colors for different categories
  const categoryColors = {
    food: "#FF6B6B",
    shopping: "#4ECDC4",
    entertainment: "#45B7D1",
    bills: "#96CEB4",
    transport: "#FFEAA7",
    other: "#DDA0DD",
  };

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [transactionsRes, categoryRes, heatmapRes, piggyRes] =
        await Promise.all([
          fetch("http://localhost:5001/api/expense/messages"),
          fetch("http://localhost:5001/api/expense/spending/categories"),
          fetch("http://localhost:5001/api/expense/spending/heatmap"),
          fetch("http://localhost:5001/api/expense/piggybank"),
        ]);

      const [transactionsData, categoryData, heatmapData, piggyData] =
        await Promise.all([
          transactionsRes.json(),
          categoryRes.json(),
          heatmapRes.json(),
          piggyRes.json(),
        ]);

      if (transactionsData.success) setTransactions(transactionsData.data);
      if (categoryData.success) setCategoryData(categoryData.data);
      if (heatmapData.success) setHeatmapData(heatmapData.data);
      if (piggyData.success) setPiggyBank(piggyData.data);

      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Prepare data for charts
  const prepareCategoryChartData = () => {
    if (!categoryData.categories) return [];

    return Object.entries(categoryData.categories).map(
      ([category, amount]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount,
        budget: categoryData.budget[category] || 0,
        color: categoryColors[category] || "#8884d8",
      })
    );
  };

  const prepareHeatmapData = () => {
    if (!heatmapData.data) return [];

    return heatmapData.data.map((monthData) => ({
      month: monthData.month,
      ...monthData.categories,
    }));
  };

  const preparePiggyBankData = () => {
    if (!piggyBank) return [];

    return [
      {
        name: "Actual Savings",
        value: piggyBank.actualSavings || 0,
        color: "#4ECDC4",
      },
      {
        name: "Estimated Savings",
        value: piggyBank.estimatedMonthlySavings || 0,
        color: "#FF6B6B",
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Expense Analyzer
            </h2>
            <p className="text-gray-600">
              Real-time financial data and insights
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* PiggyBank Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold mb-4">PiggyBank Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Actual Savings</p>
            <p className="text-2xl font-bold text-green-600">
              ${piggyBank.actualSavings || 0}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Estimated Savings</p>
            <p className="text-2xl font-bold text-blue-600">
              ${piggyBank.estimatedMonthlySavings || 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Performance</p>
            <p className="text-2xl font-bold text-purple-600">
              {piggyBank.performance?.percentage?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Category-wise Spending</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prepareCategoryChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`$${value}`, name]}
                labelStyle={{ color: "#374151" }}
              />
              <Bar dataKey="amount" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Spending Heatmap</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prepareHeatmapData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`$${value}`, name]}
                labelStyle={{ color: "#374151" }}
              />
              <Line
                type="monotone"
                dataKey="food"
                stroke="#FF6B6B"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="shopping"
                stroke="#4ECDC4"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="entertainment"
                stroke="#45B7D1"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="bills"
                stroke="#96CEB4"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="transport"
                stroke="#FFEAA7"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="other"
                stroke="#DDA0DD"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor:
                          categoryColors[transaction.category] + "20",
                        color: categoryColors[transaction.category],
                      }}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseAnalyzer;
