import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export class ExpenseAnalyzer {
  constructor() {
    this.salary = 5000; // Default monthly salary
    this.budget = {
      food: 800,
      shopping: 600,
      entertainment: 400,
      bills: 1200,
      transport: 300,
      other: 500,
    };

    this.transactions = [];
    this.categories = [
      "food",
      "shopping",
      "entertainment",
      "bills",
      "transport",
      "other",
    ];
    this.simulationInterval = null;
    this.connectedClients = new Set();

    // Initialize with 5 months of historical data
    this.initializeHistoricalData();
  }

  initializeHistoricalData() {
    const now = moment();

    // Generate 5 months of historical transactions
    for (let month = 4; month >= 0; month--) {
      const monthDate = now.clone().subtract(month, "months");
      this.generateMonthTransactions(monthDate);
    }
  }

  generateMonthTransactions(monthDate) {
    const daysInMonth = monthDate.daysInMonth();

    // Generate 15-25 transactions per month
    const numTransactions = Math.floor(Math.random() * 11) + 15;

    for (let i = 0; i < numTransactions; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const transactionDate = monthDate.clone().date(day);

      const category =
        this.categories[Math.floor(Math.random() * this.categories.length)];
      const amount = this.generateTransactionAmount(category);

      this.transactions.push({
        id: uuidv4(),
        date: transactionDate.format("YYYY-MM-DD"),
        time: transactionDate.format("HH:mm:ss"),
        category,
        amount,
        description: this.generateDescription(category),
        type: "expense",
      });
    }

    // Add salary credit at the beginning of each month
    this.transactions.push({
      id: uuidv4(),
      date: monthDate.clone().startOf("month").format("YYYY-MM-DD"),
      time: "09:00:00",
      category: "salary",
      amount: this.salary,
      description: "Monthly Salary Credit",
      type: "income",
    });
  }

  generateTransactionAmount(category) {
    const baseAmounts = {
      food: { min: 15, max: 80 },
      shopping: { min: 25, max: 200 },
      entertainment: { min: 20, max: 150 },
      bills: { min: 50, max: 300 },
      transport: { min: 5, max: 50 },
      other: { min: 10, max: 100 },
    };

    const range = baseAmounts[category] || { min: 10, max: 100 };
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  generateDescription(category) {
    const descriptions = {
      food: [
        "Restaurant",
        "Grocery Store",
        "Coffee Shop",
        "Food Delivery",
        "Fast Food",
      ],
      shopping: [
        "Online Store",
        "Department Store",
        "Clothing Store",
        "Electronics",
        "Bookstore",
      ],
      entertainment: [
        "Movie Theater",
        "Concert",
        "Gaming",
        "Streaming Service",
        "Sports Event",
      ],
      bills: [
        "Electricity Bill",
        "Water Bill",
        "Internet Bill",
        "Phone Bill",
        "Insurance Payment",
      ],
      transport: [
        "Gas Station",
        "Public Transport",
        "Taxi",
        "Parking",
        "Car Maintenance",
      ],
      other: [
        "ATM Withdrawal",
        "Bank Transfer",
        "Cash Withdrawal",
        "Miscellaneous",
        "Service Fee",
      ],
    };

    const categoryDescriptions = descriptions[category] || ["Transaction"];
    return categoryDescriptions[
      Math.floor(Math.random() * categoryDescriptions.length)
    ];
  }

  startSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    // Generate new transactions every 5-15 seconds
    this.simulationInterval = setInterval(() => {
      this.generateNewTransaction();
    }, Math.floor(Math.random() * 10000) + 5000);

    console.log("🎲 Expense Analyzer simulation started");
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    console.log("⏹️ Expense Analyzer simulation stopped");
  }

  generateNewTransaction() {
    const category =
      this.categories[Math.floor(Math.random() * this.categories.length)];
    const amount = this.generateTransactionAmount(category);
    const now = moment();

    const newTransaction = {
      id: uuidv4(),
      date: now.format("YYYY-MM-DD"),
      time: now.format("HH:mm:ss"),
      category,
      amount,
      description: this.generateDescription(category),
      type: "expense",
    };

    this.transactions.push(newTransaction);

    // Keep only last 5 months of data
    this.cleanupOldTransactions();

    console.log(`💳 New transaction: ${category} - $${amount}`);
  }

  cleanupOldTransactions() {
    const fiveMonthsAgo = moment().subtract(5, "months");
    this.transactions = this.transactions.filter((transaction) =>
      moment(transaction.date).isAfter(fiveMonthsAgo)
    );
  }

  getTransactions() {
    return this.transactions.sort((a, b) => {
      const dateA = moment(`${a.date} ${a.time}`);
      const dateB = moment(`${b.date} ${b.time}`);
      return dateB.diff(dateA);
    });
  }

  getCategorySpending() {
    const categoryTotals = {};
    const currentMonth = moment().format("YYYY-MM");

    // Initialize categories
    this.categories.forEach((cat) => {
      categoryTotals[cat] = 0;
    });

    // Calculate spending for current month
    this.transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .forEach((transaction) => {
        if (categoryTotals.hasOwnProperty(transaction.category)) {
          categoryTotals[transaction.category] += transaction.amount;
        }
      });

    return {
      currentMonth,
      categories: categoryTotals,
      total: Object.values(categoryTotals).reduce(
        (sum, amount) => sum + amount,
        0
      ),
      budget: this.budget,
    };
  }

  getHeatmapData() {
    const heatmapData = [];
    const months = [];

    // Generate data for last 5 months
    for (let i = 4; i >= 0; i--) {
      const month = moment().subtract(i, "months");
      const monthStr = month.format("YYYY-MM");
      months.push(monthStr);

      const monthData = {
        month: monthStr,
        categories: {},
      };

      // Calculate spending for each category in this month
      this.categories.forEach((category) => {
        const categorySpending = this.transactions
          .filter(
            (t) =>
              t.type === "expense" &&
              t.date.startsWith(monthStr) &&
              t.category === category
          )
          .reduce((sum, t) => sum + t.amount, 0);

        monthData.categories[category] = categorySpending;
      });

      heatmapData.push(monthData);
    }

    return {
      months,
      data: heatmapData,
      maxSpending: Math.max(
        ...heatmapData.flatMap((m) => Object.values(m.categories))
      ),
    };
  }

  getPiggyBankData() {
    const currentMonth = moment().format("YYYY-MM");
    const totalBudget = Object.values(this.budget).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const estimatedMonthlySavings = this.salary - totalBudget;

    // Calculate actual savings from transactions
    const currentMonthTransactions = this.transactions.filter((t) =>
      t.date.startsWith(currentMonth)
    );

    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const actualSavings = totalIncome - totalExpenses;

    return {
      currentMonth,
      salary: this.salary,
      totalBudget,
      estimatedMonthlySavings,
      actualSavings: Math.max(0, actualSavings),
      totalIncome,
      totalExpenses,
      performance: {
        onTrack: actualSavings >= estimatedMonthlySavings * 0.9,
        percentage:
          estimatedMonthlySavings > 0
            ? (actualSavings / estimatedMonthlySavings) * 100
            : 0,
        difference: actualSavings - estimatedMonthlySavings,
      },
    };
  }

  updateSalary(newSalary) {
    this.salary = newSalary;
    console.log(`💰 Salary updated to $${newSalary}`);
  }

  updateBudget(newBudget) {
    this.budget = { ...this.budget, ...newBudget };
    console.log("📊 Budget updated:", this.budget);
  }

  getSalary() {
    return this.salary;
  }

  getBudget() {
    return this.budget;
  }

  getStats() {
    const currentMonth = moment().format("YYYY-MM");
    const currentMonthTransactions = this.transactions.filter(
      (t) => t.date.startsWith(currentMonth) && t.type === "expense"
    );

    const totalSpent = currentMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalBudget = Object.values(this.budget).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return {
      currentMonth,
      totalSpent,
      totalBudget,
      remaining: totalBudget - totalSpent,
      transactionCount: currentMonthTransactions.length,
      averageTransaction:
        currentMonthTransactions.length > 0
          ? totalSpent / currentMonthTransactions.length
          : 0,
    };
  }
}
