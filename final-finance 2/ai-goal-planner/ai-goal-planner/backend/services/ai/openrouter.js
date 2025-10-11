const config = require('../../config/env');

/**
 * OpenRouter AI Provider (Free Gateway)
 * Supports multiple free models: Llama, Mistral, Qwen, etc.
 */
class OpenRouterProvider {
  constructor() {
    this.apiKey = config.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    // Free models available on OpenRouter
    this.model = 'meta-llama/llama-3.2-3b-instruct:free'; // Free Llama 3.2 model
  }

  async generatePlan(data) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const { goal, amount, duration, income, savings } = data;
    
    const prompt = `You are a certified financial advisor. Create a personalized savings and investment plan.

Goal: ${goal}
Target Amount: ₹${amount.toLocaleString()}
Duration: ${duration} months
Monthly Income: ₹${income.toLocaleString()}
Current Savings: ₹${savings.toLocaleString()}

Provide a JSON response with:
1. monthly_saving: exact monthly amount needed
2. investment_strategy: appropriate strategy (Low/Medium/High risk with returns)
3. summary: concise actionable plan

Respond ONLY with valid JSON in this format:
{
  "monthly_saving": number,
  "investment_strategy": "string",
  "summary": "string"
}`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-goal-planner.app',
          'X-Title': 'AI Goal Planner'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a financial advisor. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON in AI response');
      }

      const plan = JSON.parse(jsonMatch[0]);
      
      // Validate response
      if (!plan.monthly_saving || !plan.investment_strategy || !plan.summary) {
        throw new Error('Incomplete AI response');
      }

      return plan;
    } catch (error) {
      console.error('OpenRouter error:', error.message);
      throw error;
    }
  }
}

module.exports = new OpenRouterProvider();
