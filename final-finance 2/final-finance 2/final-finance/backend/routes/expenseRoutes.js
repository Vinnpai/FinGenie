import express from "express";
import { ExpenseAnalyzer } from "../services/expenseAnalyzer.js";

const router = express.Router();
const expenseAnalyzer = new ExpenseAnalyzer();

// Start the simulation
expenseAnalyzer.startSimulation();

// Get real-time transaction data
router.get("/messages", (req, res) => {
  try {
    const transactions = expenseAnalyzer.getTransactions();
    res.json({
      success: true,
      data: transactions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get piggybank data (actual vs estimated)
router.get("/piggybank", (req, res) => {
  try {
    const piggyBankData = expenseAnalyzer.getPiggyBankData();
    res.json({
      success: true,
      data: piggyBankData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get category-wise spending data
router.get("/spending/categories", (req, res) => {
  try {
    const categoryData = expenseAnalyzer.getCategorySpending();
    res.json({
      success: true,
      data: categoryData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get spending heatmap data
router.get("/spending/heatmap", (req, res) => {
  try {
    const heatmapData = expenseAnalyzer.getHeatmapData();
    res.json({
      success: true,
      data: heatmapData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update salary
router.post("/salary", (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid salary amount is required",
      });
    }

    expenseAnalyzer.updateSalary(amount);

    res.json({
      success: true,
      message: "Salary updated successfully",
      data: { amount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update budget
router.post("/budget", (req, res) => {
  try {
    const { categories } = req.body;
    if (!categories || typeof categories !== "object") {
      return res.status(400).json({
        success: false,
        error: "Valid budget categories are required",
      });
    }

    expenseAnalyzer.updateBudget(categories);

    res.json({
      success: true,
      message: "Budget updated successfully",
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get current settings
router.get("/settings", (req, res) => {
  try {
    const settings = {
      salary: expenseAnalyzer.getSalary(),
      budget: expenseAnalyzer.getBudget(),
      piggyBank: expenseAnalyzer.getPiggyBankData(),
    };

    res.json({
      success: true,
      data: settings,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get expense statistics
router.get("/stats", (req, res) => {
  try {
    const stats = expenseAnalyzer.getStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
