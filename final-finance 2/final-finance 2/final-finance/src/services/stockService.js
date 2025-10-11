// Frontend stock service for investment data
const STOCK_DATA = {
  AAPL: {
    name: "Apple Inc.",
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    sector: "Technology",
  },
  MSFT: {
    name: "Microsoft Corporation",
    price: 378.85,
    change: -1.23,
    changePercent: -0.32,
    sector: "Technology",
  },
  GOOGL: {
    name: "Alphabet Inc.",
    price: 142.56,
    change: 0.89,
    changePercent: 0.63,
    sector: "Technology",
  },
  AMZN: {
    name: "Amazon.com Inc.",
    price: 155.12,
    change: -0.45,
    changePercent: -0.29,
    sector: "Consumer Discretionary",
  },
  TSLA: {
    name: "Tesla Inc.",
    price: 248.5,
    change: 5.67,
    changePercent: 2.33,
    sector: "Automotive",
  },
  NVDA: {
    name: "NVIDIA Corporation",
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    sector: "Technology",
  },
  META: {
    name: "Meta Platforms Inc.",
    price: 485.2,
    change: -2.1,
    changePercent: -0.43,
    sector: "Technology",
  },
  JPM: {
    name: "JPMorgan Chase & Co.",
    price: 195.67,
    change: 1.23,
    changePercent: 0.63,
    sector: "Financial Services",
  },
  JNJ: {
    name: "Johnson & Johnson",
    price: 158.9,
    change: -0.34,
    changePercent: -0.21,
    sector: "Healthcare",
  },
  V: {
    name: "Visa Inc.",
    price: 275.45,
    change: 2.78,
    changePercent: 1.02,
    sector: "Financial Services",
  },
};

const RISK_PROFILES = {
  conservative: {
    stockAllocation: 30,
    bondAllocation: 70,
    recommendedStocks: ["JNJ", "JPM", "V"],
    recommendedETFs: ["VTI", "BND", "VXUS"],
    description: "Focus on stable, dividend-paying stocks and bonds",
  },
  moderate: {
    stockAllocation: 60,
    bondAllocation: 40,
    recommendedStocks: ["AAPL", "MSFT", "GOOGL", "JPM"],
    recommendedETFs: ["VTI", "VXUS", "BND"],
    description: "Balanced approach with mix of growth and value stocks",
  },
  aggressive: {
    stockAllocation: 80,
    bondAllocation: 20,
    recommendedStocks: ["TSLA", "NVDA", "META", "AMZN"],
    recommendedETFs: ["QQQ", "VGT", "ARKK"],
    description: "Growth-focused with higher risk, higher reward potential",
  },
};

// Get stock information
export const getStockInfo = (symbol) => {
  const stock = STOCK_DATA[symbol.toUpperCase()];
  if (!stock) {
    throw new Error(`Stock symbol ${symbol} not found`);
  }
  return stock;
};

// Get multiple stocks
export const getMultipleStocks = (symbols) => {
  return symbols.map((symbol) => {
    try {
      return { symbol: symbol.toUpperCase(), ...getStockInfo(symbol) };
    } catch (error) {
      return { symbol: symbol.toUpperCase(), error: error.message };
    }
  });
};

// Get investment recommendations based on user profile
export const getInvestmentRecommendations = (userProfile) => {
  const { riskTolerance, monthlyIncome, monthlyExpenses } = userProfile;

  const availableForInvestment = monthlyIncome - monthlyExpenses;
  const riskProfile = RISK_PROFILES[riskTolerance] || RISK_PROFILES.moderate;

  // Calculate recommended allocation
  const stockAmount =
    (availableForInvestment * riskProfile.stockAllocation) / 100;
  const bondAmount =
    (availableForInvestment * riskProfile.bondAllocation) / 100;

  // Get stock recommendations
  const stockRecommendations = riskProfile.recommendedStocks.map((symbol) => ({
    symbol,
    ...getStockInfo(symbol),
    recommendedAmount: stockAmount / riskProfile.recommendedStocks.length,
  }));

  // Get ETF recommendations
  const etfRecommendations = riskProfile.recommendedETFs.map((symbol) => ({
    symbol,
    name: getETFName(symbol),
    recommendedAmount: bondAmount / riskProfile.recommendedETFs.length,
  }));

  return {
    riskProfile: riskProfile.description,
    allocation: {
      stocks: riskProfile.stockAllocation,
      bonds: riskProfile.bondAllocation,
    },
    monthlyInvestment: availableForInvestment,
    stockRecommendations,
    etfRecommendations,
    totalRecommended: stockAmount + bondAmount,
  };
};

// Get market trends (mock data)
export const getMarketTrends = () => {
  return {
    marketStatus: "Open",
    sp500: { price: 4567.89, change: 12.34, changePercent: 0.27 },
    nasdaq: { price: 14234.56, change: -23.45, changePercent: -0.16 },
    dow: { price: 34567.89, change: 45.67, changePercent: 0.13 },
    trendingStocks: ["NVDA", "TSLA", "AAPL"],
    topGainers: ["NVDA", "TSLA", "META"],
    topLosers: ["AMZN", "GOOGL", "MSFT"],
  };
};

// Get retirement planning recommendations
export const getRetirementRecommendations = (userProfile) => {
  const { age, monthlyIncome, riskTolerance } = userProfile;
  const yearsToRetirement = 65 - age;
  const riskProfile = RISK_PROFILES[riskTolerance] || RISK_PROFILES.moderate;

  // Calculate recommended monthly contribution (15% rule)
  const recommendedMonthlyContribution = monthlyIncome * 0.15;

  // Calculate projected retirement fund
  const annualReturn =
    riskTolerance === "conservative"
      ? 0.06
      : riskTolerance === "moderate"
      ? 0.08
      : 0.1;

  const monthlyReturn = annualReturn / 12;
  const totalMonths = yearsToRetirement * 12;

  const projectedFund =
    recommendedMonthlyContribution *
    ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);

  return {
    yearsToRetirement,
    recommendedMonthlyContribution,
    projectedRetirementFund: Math.round(projectedFund),
    riskProfile: riskProfile.description,
    recommendedAllocation: {
      stocks: riskProfile.stockAllocation,
      bonds: riskProfile.bondAllocation,
    },
  };
};

// Helper function to get ETF names
const getETFName = (symbol) => {
  const etfNames = {
    VTI: "Vanguard Total Stock Market ETF",
    VXUS: "Vanguard Total International Stock ETF",
    BND: "Vanguard Total Bond Market ETF",
    QQQ: "Invesco QQQ Trust",
    VGT: "Vanguard Information Technology ETF",
    ARKK: "ARK Innovation ETF",
  };

  return etfNames[symbol] || `${symbol} ETF`;
};

export default {
  getStockInfo,
  getMultipleStocks,
  getInvestmentRecommendations,
  getMarketTrends,
  getRetirementRecommendations,
};
