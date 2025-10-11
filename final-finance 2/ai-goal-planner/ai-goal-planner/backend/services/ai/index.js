const config = require('../../config/env');
const openrouterProvider = require('./openrouter');
const groqProvider = require('./groq');
const geminiProvider = require('./gemini');
const openaiProvider = require('./openai');
const hfProvider = require('./huggingface');

/**
 * AI Provider Factory
 * Dynamically selects AI provider based on configuration
 */
class AIService {
  constructor() {
    this.provider = this.getProvider();
  }

  getProvider() {
    const providerName = config.AI_PROVIDER.toLowerCase();
    
    switch (providerName) {
      case 'openrouter':
        return openrouterProvider;
      case 'groq':
        return groqProvider;
      case 'gemini':
        return geminiProvider;
      case 'openai':
        return openaiProvider;
      case 'huggingface':
      case 'hf':
        return hfProvider;
      default:
        console.warn(`Unknown AI provider: ${providerName}, falling back to OpenRouter`);
        return openrouterProvider;
    }
  }

  /**
   * Generate AI-powered goal plan
   * @param {Object} data - Goal data
   * @returns {Promise<Object>} - Generated plan
   */
  async generateGoalPlan(data) {
    try {
      return await this.provider.generatePlan(data);
    } catch (error) {
      console.error(`AI Service Error (${config.AI_PROVIDER}):`, error.message);
      // Fallback to rule-based calculation
      return this.generateFallbackPlan(data);
    }
  }

  /**
   * Fallback plan using rule-based logic
   */
  generateFallbackPlan(data) {
    const { goal, amount, duration, income, savings } = data;
    
    const totalNeeded = amount - savings;
    const monthlySaving = Math.max(0, totalNeeded / duration);
    const savingsPercentage = (monthlySaving / income) * 100;

    let investmentStrategy;
    let expectedReturn;

    if (savingsPercentage <= 20) {
      investmentStrategy = "Low-risk investment (6-8% annual return) - Balanced mutual funds or fixed deposits";
      expectedReturn = 0.07;
    } else if (savingsPercentage <= 40) {
      investmentStrategy = "Medium-risk investment (8-10% annual return) - Equity-debt hybrid funds";
      expectedReturn = 0.09;
    } else {
      investmentStrategy = "High-risk investment (10-12% annual return) - Equity-focused funds (requires discipline)";
      expectedReturn = 0.11;
    }

    // Calculate future value with compound interest
    const monthlyReturn = expectedReturn / 12;
    const futureValue = monthlySaving * (((1 + monthlyReturn) ** duration - 1) / monthlyReturn);

    const summary = `To achieve your goal of "${goal}" worth ₹${amount.toLocaleString()} in ${duration} months, you need to save ₹${Math.round(monthlySaving).toLocaleString()} monthly. With ${investmentStrategy.split('-')[0].trim()}, you can potentially reach ₹${Math.round(futureValue).toLocaleString()}.`;

    return {
      monthly_saving: Math.round(monthlySaving),
      investment_strategy: investmentStrategy,
      summary: summary
    };
  }
}

module.exports = new AIService();
