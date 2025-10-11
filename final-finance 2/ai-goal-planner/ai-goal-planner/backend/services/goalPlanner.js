const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI-powered financial plan
 * @param {Object} data - User financial data
 * @returns {Object} - Generated financial plan
 */
async function generatePlan(data) {
  const { goal, amount, duration, income, savings } = data;

  // Calculate basic metrics
  const totalNeeded = amount - savings;
  const basicMonthlySaving = totalNeeded / duration;
  const savingsPercentage = (basicMonthlySaving / income) * 100;

  // Create AI prompt
  const prompt = `Act as a certified financial advisor. Create a personalized savings and investment plan based on this data:

Goal: ${goal}
Target Amount: ₹${amount.toLocaleString()}
Duration: ${duration} months
Monthly Income: ₹${income.toLocaleString()}
Current Savings: ₹${savings.toLocaleString()}

Requirements:
1. Calculate monthly saving amount needed
2. Suggest appropriate investment strategy (Low/Medium/High risk)
3. Consider the person's income level and risk capacity
4. Provide realistic and achievable recommendations
5. Include potential investment returns (6-12% annually)
6. Keep response concise and actionable

Respond in JSON format:
{
  "monthly_saving": number,
  "investment_strategy": "string",
  "summary": "string"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a certified financial advisor. Provide practical, actionable financial advice. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    
    // Parse JSON response
    let plan;
    try {
      plan = JSON.parse(response);
    } catch (parseError) {
      console.warn('Failed to parse AI response, using fallback calculation');
      plan = generateFallbackPlan(data);
    }

    // Validate and enhance the response
    if (!plan.monthly_saving || !plan.investment_strategy || !plan.summary) {
      plan = generateFallbackPlan(data);
    }

    return plan;
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to rule-based calculation if AI fails
    return generateFallbackPlan(data);
  }
}

/**
 * Generate fallback plan using rule-based logic
 * @param {Object} data - User financial data
 * @returns {Object} - Fallback financial plan
 */
function generateFallbackPlan(data) {
  const { goal, amount, duration, income, savings } = data;
  
  const totalNeeded = amount - savings;
  const monthlySaving = totalNeeded / duration;
  const savingsPercentage = (monthlySaving / income) * 100;

  // Determine investment strategy based on income and savings percentage
  let investmentStrategy;
  let expectedReturn;

  if (savingsPercentage <= 20) {
    investmentStrategy = "Low-risk SIP (6-8% annual return) - Balanced mutual funds";
    expectedReturn = 0.07; // 7% annual
  } else if (savingsPercentage <= 40) {
    investmentStrategy = "Medium-risk SIP (8-10% annual return) - Equity-debt hybrid funds";
    expectedReturn = 0.09; // 9% annual
  } else {
    investmentStrategy = "High-risk SIP (10-12% annual return) - Equity-focused funds";
    expectedReturn = 0.11; // 11% annual
  }

  // Calculate future value with compound interest
  const monthlyReturn = expectedReturn / 12;
  const futureValue = monthlySaving * (((1 + monthlyReturn) ** duration - 1) / monthlyReturn);

  const summary = `To achieve your goal of ${goal} worth ₹${amount.toLocaleString()} in ${duration} months, save ₹${Math.round(monthlySaving).toLocaleString()} monthly. ${investmentStrategy} will help you reach approximately ₹${Math.round(futureValue).toLocaleString()}.`;

  return {
    monthly_saving: Math.round(monthlySaving),
    investment_strategy: investmentStrategy,
    summary: summary
  };
}

module.exports = {
  generatePlan
};
