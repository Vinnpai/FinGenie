import moment from "moment";

export class PiggyBankService {
  constructor() {
    this.salary = 5000;
    this.budget = {
      food: 800,
      shopping: 600,
      entertainment: 400,
      bills: 1200,
      transport: 300,
      other: 500,
    };
    this.actualSavings = 0;
    this.estimatedSavings = 0;
    this.savingsHistory = [];

    // Initialize with some historical savings data
    this.initializeSavingsHistory();
  }

  initializeSavingsHistory() {
    const now = moment();

    // Generate 5 months of savings history
    for (let month = 4; month >= 0; month--) {
      const monthDate = now.clone().subtract(month, "months");
      this.generateMonthSavings(monthDate);
    }
  }

  generateMonthSavings(monthDate) {
    const monthStr = monthDate.format("YYYY-MM");
    const totalBudget = Object.values(this.budget).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const estimatedMonthlySavings = this.salary - totalBudget;

    // Add some randomness to actual savings (±20%)
    const variance = (Math.random() - 0.5) * 0.4; // -20% to +20%
    const actualMonthlySavings = Math.max(
      0,
      estimatedMonthlySavings * (1 + variance)
    );

    this.estimatedSavings += estimatedMonthlySavings;
    this.actualSavings += actualMonthlySavings;

    this.savingsHistory.push({
      month: monthStr,
      estimated: estimatedMonthlySavings,
      actual: actualMonthlySavings,
      cumulativeEstimated: this.estimatedSavings,
      cumulativeActual: this.actualSavings,
    });
  }

  updateSalary(newSalary) {
    this.salary = newSalary;
    this.recalculateSavings();
    console.log(`💰 PiggyBank: Salary updated to $${newSalary}`);
  }

  updateBudget(newBudget) {
    this.budget = { ...this.budget, ...newBudget };
    this.recalculateSavings();
    console.log("📊 PiggyBank: Budget updated, recalculating savings");
  }

  recalculateSavings() {
    const totalBudget = Object.values(this.budget).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const estimatedMonthlySavings = this.salary - totalBudget;

    // Recalculate estimated savings for all months
    this.estimatedSavings = 0;
    this.actualSavings = 0;

    this.savingsHistory.forEach((entry) => {
      this.estimatedSavings += estimatedMonthlySavings;
      this.actualSavings += entry.actual; // Keep actual savings as they were
      entry.cumulativeEstimated = this.estimatedSavings;
      entry.cumulativeActual = this.actualSavings;
    });
  }

  getPiggyBankData() {
    const currentMonth = moment().format("YYYY-MM");
    const totalBudget = Object.values(this.budget).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const estimatedMonthlySavings = this.salary - totalBudget;

    // Calculate current month's actual savings (simulate real-time updates)
    const currentMonthActual = this.calculateCurrentMonthSavings();

    return {
      currentMonth,
      salary: this.salary,
      totalBudget,
      estimatedMonthlySavings,
      currentMonthActual,
      cumulative: {
        estimated: this.estimatedSavings,
        actual: this.actualSavings + currentMonthActual,
      },
      history: this.savingsHistory,
      performance: {
        onTrack: this.actualSavings >= this.estimatedSavings * 0.9, // Within 90% of estimated
        percentage:
          this.estimatedSavings > 0
            ? (this.actualSavings / this.estimatedSavings) * 100
            : 0,
        difference: this.actualSavings - this.estimatedSavings,
      },
    };
  }

  calculateCurrentMonthSavings() {
    const currentMonth = moment().format("YYYY-MM");
    const currentDay = moment().date();
    const daysInMonth = moment().daysInMonth();

    // Simulate current month savings based on day of month
    const progress = currentDay / daysInMonth;
    const totalBudget = Object.values(this.budget).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const estimatedMonthlySavings = this.salary - totalBudget;

    // Add some randomness for realistic simulation
    const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
    const currentSavings = Math.max(
      0,
      estimatedMonthlySavings * progress * (1 + variance)
    );

    return currentSavings;
  }

  addSavings(amount, description = "Manual Savings") {
    this.actualSavings += amount;

    // Add to current month's savings
    const currentMonth = moment().format("YYYY-MM");
    const lastEntry = this.savingsHistory[this.savingsHistory.length - 1];

    if (lastEntry && lastEntry.month === currentMonth) {
      lastEntry.actual += amount;
      lastEntry.cumulativeActual = this.actualSavings;
    }

    console.log(`💰 Added $${amount} to piggybank: ${description}`);
    return this.getPiggyBankData();
  }

  withdrawSavings(amount, description = "Withdrawal") {
    if (amount > this.actualSavings) {
      throw new Error("Insufficient savings");
    }

    this.actualSavings -= amount;

    // Update current month's savings
    const currentMonth = moment().format("YYYY-MM");
    const lastEntry = this.savingsHistory[this.savingsHistory.length - 1];

    if (lastEntry && lastEntry.month === currentMonth) {
      lastEntry.actual -= amount;
      lastEntry.cumulativeActual = this.actualSavings;
    }

    console.log(`💸 Withdrew $${amount} from piggybank: ${description}`);
    return this.getPiggyBankData();
  }

  getSavingsProjection(months = 12) {
    const totalBudget = Object.values(this.budget).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const estimatedMonthlySavings = this.salary - totalBudget;

    const projection = [];
    let cumulativeEstimated = this.estimatedSavings;
    let cumulativeActual = this.actualSavings;

    for (let i = 1; i <= months; i++) {
      const futureMonth = moment().add(i, "months").format("YYYY-MM");
      cumulativeEstimated += estimatedMonthlySavings;

      // Simulate actual savings with some variance
      const variance = (Math.random() - 0.5) * 0.4; // ±20% variance
      const monthlyActual = Math.max(
        0,
        estimatedMonthlySavings * (1 + variance)
      );
      cumulativeActual += monthlyActual;

      projection.push({
        month: futureMonth,
        estimated: cumulativeEstimated,
        actual: cumulativeActual,
        difference: cumulativeActual - cumulativeEstimated,
      });
    }

    return projection;
  }

  getSavingsTrend() {
    if (this.savingsHistory.length < 2) {
      return { trend: "stable", change: 0 };
    }

    const recent = this.savingsHistory.slice(-3); // Last 3 months
    const older = this.savingsHistory.slice(-6, -3); // Previous 3 months

    const recentAvg =
      recent.reduce((sum, entry) => sum + entry.actual, 0) / recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((sum, entry) => sum + entry.actual, 0) / older.length
        : recentAvg;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    let trend = "stable";
    if (change > 10) trend = "increasing";
    else if (change < -10) trend = "decreasing";

    return { trend, change: Math.round(change * 100) / 100 };
  }
}
