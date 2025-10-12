import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to finGenie API" });

  // Helper to fetch a single quote from Yahoo
  async function fetchQuoteYahoo(symbol) {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
      symbol
    )}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("quote_fetch_failed");
    const data = await r.json();
    const item = data?.quoteResponse?.result?.[0];
    if (!item) throw new Error("symbol_not_found");
    return {
      symbol: item.symbol,
      shortName: item.shortName || item.longName || item.symbol,
      price: item.regularMarketPrice,
      change: item.regularMarketChange,
      changePercent: item.regularMarketChangePercent,
      previousClose: item.regularMarketPreviousClose,
      open: item.regularMarketOpen,
      dayLow: item.regularMarketDayLow,
      dayHigh: item.regularMarketDayHigh,
      currency: item.currency,
      exchange: item.fullExchangeName || item.exchange,
      time: item.regularMarketTime,
    };
  }

  // Top movers for a fixed NSE watchlist
  app.get("/api/market/top", async (req, res) => {
    try {
      const n = Math.max(1, Math.min(20, Number(req.query.n) || 5));
      const watchlist = [
        "RELIANCE.NS",
        "TCS.NS",
        "INFY.NS",
        "HDFCBANK.NS",
        "ICICIBANK.NS",
        "ITC.NS",
        "BHARTIARTL.NS",
        "MARUTI.NS",
        "TATAMOTORS.NS",
        "ASIANPAINT.NS",
        "LT.NS",
        "SBIN.NS",
        "AXISBANK.NS",
        "HINDUNILVR.NS",
        "SUNPHARMA.NS",
      ];
      const quotes = await Promise.allSettled(
        watchlist.map((s) => fetchQuoteYahoo(s))
      );
      const ok = quotes
        .filter((q) => q.status === "fulfilled")
        .map((q) => q.value);
      ok.sort((a, b) => (b.changePercent ?? -999) - (a.changePercent ?? -999));
      res.json({
        top: ok.slice(0, n),
        universe: watchlist.length,
        fetched: ok.length,
      });
    } catch (e) {
      res.status(500).json({ error: e.message || "top_movers_error" });
    }
  });
});

// Simple market/stock quote proxy (Yahoo Finance public quote)
app.get("/api/market", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim().toLowerCase();
    const mapSymbol = (s) => {
      if (!s) return "^NSEI"; // Nifty 50 index
      if (["nifty", "nifty50", "nifty 50", "^nsei"].includes(s)) return "^NSEI";
      if (["sensex", "^bsesn"].includes(s)) return "^BSESN";
      // common Indian tickers mapping to Yahoo symbols
      const dict = {
        reliance: "RELIANCE.NS",
        tcs: "TCS.NS",
        infosys: "INFY.NS",
        infy: "INFY.NS",
        hdfcbank: "HDFCBANK.NS",
        icicibank: "ICICIBANK.NS",
        itc: "ITC.NS",
        airtel: "BHARTIARTL.NS",
        maruti: "MARUTI.NS",
        tata: "TATAMOTORS.NS",
      };
      return dict[s] || s.toUpperCase();
    };
    const symbol = mapSymbol(q);
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
      symbol
    )}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({ error: "quote_fetch_failed" });
    const data = await r.json();
    const item = data?.quoteResponse?.result?.[0];
    if (!item)
      return res.status(404).json({ error: "symbol_not_found", symbol });
    const out = {
      symbol: item.symbol,
      shortName: item.shortName || item.longName || item.symbol,
      price: item.regularMarketPrice,
      change: item.regularMarketChange,
      changePercent: item.regularMarketChangePercent,
      previousClose: item.regularMarketPreviousClose,
      open: item.regularMarketOpen,
      dayLow: item.regularMarketDayLow,
      dayHigh: item.regularMarketDayHigh,
      currency: item.currency,
      exchange: item.fullExchangeName || item.exchange,
      time: item.regularMarketTime,
    };
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message || "market_error" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expense", expenseRoutes);

// Lightweight AI chat proxy (Groq)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context } = req.body || {};
    const system = `You are a financial assistant. Assume fixed user profile:\n- Monthly income: 50000 INR\n- Current savings: 100000 INR\nRules:\n- If goal_amount >= 10 * current_savings => NOT FEASIBLE\n- Else recommended_monthly = ceil(max(goal_amount - current_savings, 0) / max(duration_months,1))\n- effort_pct = round(100 * recommended_monthly / 50000)\n- difficulty: <=12 Easy, <=36 Moderate, <=60 Hard, else Very Hard\n- health: ratio goal_amount/income: <=3 Healthy, <=12 Stretch, else Aggressive\nRespond briefly with INR values prefixed by ₹.`;

    const user = `User: ${
      message || ""
    }\nContext JSON (optional): ${JSON.stringify(context || {})}`;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(502).json({ error: "groq_error", detail: err });
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? "Sorry, no response.";
    res.json({ reply: text });
  } catch (e) {
    res.status(500).json({ error: e.message || "chat_error" });
  }
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
