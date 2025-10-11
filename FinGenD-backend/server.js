import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { ExpenseSandbox } from "./services/ExpenseSandbox.js";
import { PiggyBankService } from "./services/PiggyBankService.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
    ],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const expenseSandbox = new ExpenseSandbox();
const piggyBankService = new PiggyBankService();

// Store connected clients
const connectedClients = new Set();

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  connectedClients.add(socket);

  // Send initial data to newly connected client
  socket.emit("initialData", {
    transactions: expenseSandbox.getTransactions(),
    piggyBank: piggyBankService.getPiggyBankData(),
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    connectedClients.delete(socket);
  });
});

// API Routes

// Get real-time transaction data
app.get("/api/messages", (req, res) => {
  try {
    const transactions = expenseSandbox.getTransactions();
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
app.get("/api/piggybank", (req, res) => {
  try {
    const piggyBankData = piggyBankService.getPiggyBankData();
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
app.get("/api/spending/categories", (req, res) => {
  try {
    const categoryData = expenseSandbox.getCategorySpending();
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
app.get("/api/spending/heatmap", (req, res) => {
  try {
    const heatmapData = expenseSandbox.getHeatmapData();
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
app.post("/api/salary", (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid salary amount is required",
      });
    }

    expenseSandbox.updateSalary(amount);
    piggyBankService.updateSalary(amount);

    // Notify all connected clients
    io.emit("salaryUpdated", { amount });

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
app.post("/api/budget", (req, res) => {
  try {
    const { categories } = req.body;
    if (!categories || typeof categories !== "object") {
      return res.status(400).json({
        success: false,
        error: "Valid budget categories are required",
      });
    }

    expenseSandbox.updateBudget(categories);
    piggyBankService.updateBudget(categories);

    // Notify all connected clients
    io.emit("budgetUpdated", { categories });

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
app.get("/api/settings", (req, res) => {
  try {
    const settings = {
      salary: expenseSandbox.getSalary(),
      budget: expenseSandbox.getBudget(),
      piggyBank: piggyBankService.getPiggyBankData(),
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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FinGenD Backend is running",
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size,
  });
});

// Start the sandbox simulation
expenseSandbox.startSimulation();

// Broadcast updates to all connected clients every 5 seconds
setInterval(() => {
  if (connectedClients.size > 0) {
    const transactions = expenseSandbox.getTransactions();
    const piggyBank = piggyBankService.getPiggyBankData();
    const categoryData = expenseSandbox.getCategorySpending();
    const heatmapData = expenseSandbox.getHeatmapData();

    io.emit("dataUpdate", {
      transactions,
      piggyBank,
      categoryData,
      heatmapData,
      timestamp: new Date().toISOString(),
    });
  }
}, 5000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 FinGenD Backend running on port ${PORT}`);
  console.log(`📊 Expense Sandbox initialized`);
  console.log(`💰 PiggyBank Service started`);
  console.log(`🔌 WebSocket server ready`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
