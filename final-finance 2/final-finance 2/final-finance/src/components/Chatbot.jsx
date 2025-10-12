import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your finGenie AI assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Get personalized AI response
      const botResponse = await getPersonalizedResponse(input);
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);

      // Save conversation to backend
      try {
        await userAPI.addConversation({
          userMessage: input,
          aiResponse: botResponse,
          context: {
            section: determineContextSection(input),
            sentiment: "neutral",
          },
        });
      } catch (error) {
        console.error("Error saving conversation:", error);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages([
        ...newMessages,
        {
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get personalized AI response based on user data
  const getPersonalizedResponse = async (userInput) => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const input = userInput.toLowerCase();
    const userContext = createUserContext();

    // Constants
    const INCOME = 50000;
    const SAVINGS = 100000;

    // Helper: fetch latest saved goal from AI Goal Planner backend
    const getLatestGoal = async () => {
      try {
        const r = await fetch('http://localhost:3002/api/goals');
        if (!r.ok) return null;
        const data = await r.json();
        const arr = Array.isArray(data.goals) ? data.goals : [];
        if (arr.length === 0) return null;
        // assume latest is last
        const g = arr[arr.length - 1];
        return {
          goal: g.goal || g.title || 'Goal',
          amount: Number(g.amount) || 0,
          duration: Number(g.duration) || 12,
        };
      } catch (_) { return null; }
    };

    // Helper: parse amount and months from free text
    const parseNumber = (s) => {
      const m = s.replace(/[,₹$]/g, '').match(/\d+(?:\.\d+)?/);
      return m ? Math.round(Number(m[0])) : null;
    };
    const findAmount = () => parseNumber(input);
    const findMonths = () => {
      const mm = input.match(/(\d+)\s*(months|month|m)/);
      return mm ? Number(mm[1]) : null;
    };

    // Local calculators
    const feasibility = (amount) => (amount >= SAVINGS * 10 ? 'NOT FEASIBLE' : 'Feasible');
    const monthlyRequired = (amount, months) => {
      const remaining = Math.max(amount - SAVINGS, 0);
      const m = Math.max(1, months || 12);
      return Math.ceil(remaining / m);
    };

    // 1) Income question
    if (/(what|whats|tell).*income/.test(input)) {
      return `Your monthly income is ₹${INCOME.toLocaleString()}.`;
    }
    // 2) Savings question
    if (/(what|whats|tell).*saving/.test(input)) {
      return `Your current savings are ₹${SAVINGS.toLocaleString()}.`;
    }

    // 2.5) Market queries
    if (/what'?s the market today|market today|nifty today|sensex today/.test(input)) {
      try {
        const r = await fetch(`${API_BASE}/api/market?q=nifty`);
        const d = await r.json();
        if (d?.price != null) {
          const sign = d.change >= 0 ? '+' : '';
          return `Nifty50: ${d.price} (${sign}${d.change.toFixed(2)}, ${sign}${d.changePercent.toFixed(2)}%). High ${d.dayHigh}, Low ${d.dayLow}.`;
        }
      } catch (_) {}
      return 'Market data is temporarily unavailable.';
    }
    if (/price of |quote |stock /.test(input)) {
      // try to extract a token symbol or company name
      const m = input.match(/price of ([a-z0-9_.-]+)/) || input.match(/stock ([a-z0-9_.-]+)/) || input.match(/quote ([a-z0-9_.-]+)/);
      const q = m ? m[1] : 'nifty';
      try {
        const r = await fetch(`${API_BASE}/api/market?q=${encodeURIComponent(q)}`);
        const d = await r.json();
        if (d?.price != null) {
          const sign = d.change >= 0 ? '+' : '';
          return `${d.shortName} (${d.symbol}): ${d.price} ${d.currency || ''} (${sign}${d.change.toFixed(2)}, ${sign}${d.changePercent.toFixed(2)}%).`;
        }
      } catch (_) {}
      return `Couldn't fetch ${q} right now.`;
    }

    // 2.6) Simple stock recommendations based on savings (hard-coded)
    if (
      /(recommend|suggest).*stock/.test(input) ||
      /(stock|investment) options/.test(input) ||
      /(based on).*savings/.test(input) ||
      /my savings.*invest/.test(input)
    ) {
      const base = 100000; // current savings constant
      const alloc = [
        { label: 'Emergency/Liquid fund', pct: 0.30 },
        { label: 'Debt/Short-duration fund', pct: 0.20 },
        { label: 'Nifty 50 Index fund/ETF', pct: 0.30 },
        { label: 'Large-cap equities', pct: 0.15 },
        { label: 'Cash buffer', pct: 0.05 },
      ];
      const lines = alloc.map(a => `- ${a.label}: ₹${Math.round(base * a.pct).toLocaleString()} (${Math.round(a.pct*100)}%)`).join('\n');
      return `Based on savings of ₹${base.toLocaleString()}, here is a simple allocation:\n${lines}\nNote: move monthly contributions to the index fund first; keep 6 months expenses in emergency.`;
    }
    // 3) “Can I buy X” / feasibility
    if (/can i (buy|get|afford)/.test(input)) {
      const amt = findAmount();
      if (!amt) return `Give me the amount and optional duration. Example: "Can I buy a car for ₹500000 in 18 months?"`;
      const feas = feasibility(amt);
      if (feas === 'NOT FEASIBLE') return `NOT FEASIBLE: ₹${amt.toLocaleString()} is ≥ 10× your savings (₹${SAVINGS.toLocaleString()}).`;
      const months = findMonths() || 12;
      const need = monthlyRequired(amt, months);
      const effort = Math.round((need / INCOME) * 100);
      return `Feasible with disciplined saving. Goal ₹${amt.toLocaleString()} in ${months} months → Save about ₹${need.toLocaleString()}/month (${effort}% of income).`;
    }
    // 4) “How much should I save” for goal
    if (/how much.*save/.test(input)) {
      let amt = findAmount();
      let months = findMonths();
      if (!amt) {
        const last = await getLatestGoal();
        if (last) { amt = last.amount; months = months || last.duration; }
      }
      if (!amt) return `Tell me the target amount (and optional months). Example: "How much should I save for ₹300000 in 10 months?"`;
      const feas = feasibility(amt);
      if (feas === 'NOT FEASIBLE') return `NOT FEASIBLE: target ₹${amt.toLocaleString()} is ≥ 10× your savings.`;
      const m = months || 12;
      const need = monthlyRequired(amt, m);
      const effort = Math.round((need / INCOME) * 100);
      const remaining = Math.max(amt - SAVINGS, 0).toLocaleString();
      return `To reach ₹${amt.toLocaleString()} in ${m} months, save about ₹${need.toLocaleString()}/month (${effort}% of income). Remaining needed after savings: ₹${remaining}.`;
    }

    // Try backend AI first (Groq proxy)
    try {
      const resp = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          context: {
            ...userContext,
            monthly_income: 50000,
            current_savings: 100000,
          },
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data?.reply) return data.reply;
      }
    } catch (_) {
      // fall through to local heuristics
    }

    // Fallback: local rules
    if (
      input.includes("budget") ||
      input.includes("spending") ||
      input.includes("expense")
    ) {
      return getBudgetAdvice(input, userContext);
    } else if (
      input.includes("goal") ||
      input.includes("save") ||
      input.includes("target")
    ) {
      return getGoalAdvice(input, userContext);
    } else if (
      input.includes("invest") ||
      input.includes("stock") ||
      input.includes("portfolio")
    ) {
      return getInvestmentAdvice(input, userContext);
    } else if (
      input.includes("debt") ||
      input.includes("loan") ||
      input.includes("credit")
    ) {
      return getDebtAdvice(input, userContext);
    } else if (input.includes("emergency") || input.includes("fund")) {
      return getEmergencyFundAdvice(input, userContext);
    } else if (input.includes("retirement") || input.includes("pension")) {
      return getRetirementAdvice(input, userContext);
    } else {
      return getGeneralAdvice(input, userContext);
    }
  };

  // Create user context for AI responses
  const createUserContext = () => {
    const profile = user?.profile || {};
    const budget = user?.budget || {};
    const goals = user?.financialGoals || [];

    return {
      name: user?.firstName || "User",
      age: profile.age,
      occupation: profile.occupation,
      monthlyIncome: budget.monthlyIncome || 50000, // default fixed income
      monthlyExpenses: profile.monthlyExpenses || 0,
      riskTolerance: profile.riskTolerance || "moderate",
      investmentExperience: profile.investmentExperience || "beginner",
      financialPriorities: profile.financialPriorities || [],
      emergencyFund: profile.emergencyFund || 0,
      debtAmount: profile.debtAmount || 0,
      investmentGoals: profile.investmentGoals || [],
      financialGoals: goals,
      budgetCategories: budget.categories || [],
      currentSavings: 100000,
    };
  };

  // Budget and spending advice
  const getBudgetAdvice = (input, context) => {
    const { monthlyIncome, monthlyExpenses, budgetCategories } = context;
    const savingsRate =
      monthlyIncome > 0
        ? (((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100).toFixed(1)
        : 0;

    if (input.includes("analyze") || input.includes("analysis")) {
      return `Based on your profile, you have a ${savingsRate}% savings rate. ${
        savingsRate < 20
          ? "I recommend increasing your savings rate to at least 20% for better financial security."
          : "Great job on your savings rate!"
      } Your monthly income is $${monthlyIncome.toLocaleString()} with expenses of $${monthlyExpenses.toLocaleString()}.`;
    }

    return `I can help you optimize your budget. With your current income of $${monthlyIncome.toLocaleString()} and expenses of $${monthlyExpenses.toLocaleString()}, you have $${(
      monthlyIncome - monthlyExpenses
    ).toLocaleString()} available for savings and investments. Would you like specific recommendations?`;
  };

  // Goal-related advice
  const getGoalAdvice = (input, context) => {
    const { financialGoals, investmentGoals } = context;
    const allGoals = [...financialGoals, ...investmentGoals];

    if (allGoals.length === 0) {
      return `I notice you don't have any financial goals set up yet. Based on your ${
        context.age ? `age of ${context.age}` : "profile"
      }, I recommend setting up goals for emergency fund, retirement, and other priorities. Would you like help creating a goal plan?`;
    }

    const highPriorityGoals = allGoals.filter(
      (goal) => goal.priority === "high"
    );
    if (highPriorityGoals.length > 0) {
      return `Your high-priority goals include: ${highPriorityGoals
        .map((g) => g.title || g.name)
        .join(
          ", "
        )}. I can help you create a strategy to achieve these goals faster. What specific goal would you like to focus on?`;
    }

    return `You have ${allGoals.length} financial goals set up. I can help you prioritize them and create actionable plans. Which goal would you like to work on first?`;
  };

  // Investment advice
  const getInvestmentAdvice = (input, context) => {
    const {
      riskTolerance,
      investmentExperience,
      age,
      monthlyIncome,
      monthlyExpenses,
    } = context;
    const availableForInvestment = monthlyIncome - monthlyExpenses;

    if (input.includes("stock") || input.includes("market")) {
      return `Based on your ${riskTolerance} risk tolerance and ${investmentExperience} experience level, I recommend a diversified portfolio. With $${availableForInvestment.toLocaleString()} available monthly, you could start with index funds and gradually add individual stocks. Would you like specific stock recommendations?`;
    }

    if (input.includes("portfolio") || input.includes("allocation")) {
      const allocation =
        riskTolerance === "conservative"
          ? "60% bonds, 40% stocks"
          : riskTolerance === "moderate"
          ? "40% bonds, 60% stocks"
          : "20% bonds, 80% stocks";
      return `For your ${riskTolerance} risk profile, I recommend a ${allocation} allocation. This balances growth potential with risk management based on your age and experience.`;
    }

    return `I can help you with investment strategies based on your ${riskTolerance} risk tolerance and ${investmentExperience} experience level. What type of investment advice are you looking for?`;
  };

  // Debt advice
  const getDebtAdvice = (input, context) => {
    const { debtAmount, monthlyIncome, monthlyExpenses } = context;

    if (debtAmount === 0) {
      return `Great news! You don't have any debt. This puts you in an excellent position to focus on building wealth through investments and savings.`;
    }

    const debtToIncomeRatio =
      monthlyIncome > 0
        ? ((debtAmount / (monthlyIncome * 12)) * 100).toFixed(1)
        : 0;
    return `You have $${debtAmount.toLocaleString()} in debt, which is ${debtToIncomeRatio}% of your annual income. ${
      debtToIncomeRatio > 20
        ? "I recommend prioritizing debt payoff before major investments."
        : "Your debt level is manageable. You can balance debt payoff with investing."
    } Would you like a debt payoff strategy?`;
  };

  // Emergency fund advice
  const getEmergencyFundAdvice = (input, context) => {
    const { emergencyFund, monthlyExpenses, age } = context;
    const recommendedEmergencyFund = monthlyExpenses * 6;
    const monthsCovered =
      monthlyExpenses > 0 ? (emergencyFund / monthlyExpenses).toFixed(1) : 0;

    if (emergencyFund >= recommendedEmergencyFund) {
      return `Excellent! Your emergency fund of $${emergencyFund.toLocaleString()} covers ${monthsCovered} months of expenses, which is above the recommended 6 months. You're well-prepared for unexpected situations.`;
    }

    return `Your current emergency fund is $${emergencyFund.toLocaleString()}, covering ${monthsCovered} months of expenses. I recommend building it to $${recommendedEmergencyFund.toLocaleString()} (6 months of expenses) for better financial security. Would you like a plan to reach this goal?`;
  };

  // Retirement advice
  const getRetirementAdvice = (input, context) => {
    const { age, monthlyIncome, riskTolerance } = context;
    const yearsToRetirement = 65 - (age || 30);
    const recommendedMonthlyContribution = monthlyIncome * 0.15; // 15% rule

    return `Based on your age of ${
      age || "unknown"
    }, you have approximately ${yearsToRetirement} years until retirement. I recommend contributing at least $${recommendedMonthlyContribution.toLocaleString()} monthly (15% of income) to retirement accounts. With your ${riskTolerance} risk tolerance, I can suggest specific investment strategies. Would you like retirement planning guidance?`;
  };

  // General advice
  const getGeneralAdvice = (input, context) => {
    const { name, financialPriorities, age } = context;

    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("help")
    ) {
      return `Hello ${name}! I'm your personalized financial assistant. I can help you with budgeting, investment strategies, goal planning, debt management, and more. What would you like to discuss today?`;
    }

    if (input.includes("advice") || input.includes("recommend")) {
      const priorities =
        financialPriorities.length > 0
          ? financialPriorities.join(", ")
          : "general financial health";
      return `Based on your priorities (${priorities}), I can provide personalized advice. What specific area would you like guidance on - budgeting, investing, debt management, or goal setting?`;
    }

    return `I'm here to help with your financial journey! I can assist with budgeting, investments, goal planning, debt management, and retirement planning. What specific topic would you like to explore?`;
  };

  // Determine context section for conversation tracking
  const determineContextSection = (input) => {
    const text = input.toLowerCase();
    if (
      text.includes("budget") ||
      text.includes("spending") ||
      text.includes("expense")
    )
      return "budget";
    if (
      text.includes("goal") ||
      text.includes("save") ||
      text.includes("target")
    )
      return "goals";
    if (
      text.includes("invest") ||
      text.includes("stock") ||
      text.includes("portfolio")
    )
      return "investment";
    if (
      text.includes("debt") ||
      text.includes("loan") ||
      text.includes("credit")
    )
      return "debt";
    if (text.includes("emergency") || text.includes("fund")) return "emergency";
    if (text.includes("retirement") || text.includes("pension"))
      return "retirement";
    return "general";
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-brand-600 to-brand-700 text-white p-4 rounded-full shadow-2xl hover:shadow-brand-500/50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                finGenie AI Assistant
              </h3>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-zinc-800 text-zinc-100"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-zinc-800 text-zinc-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-zinc-400">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button
                  onClick={handleSend}
                  className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
