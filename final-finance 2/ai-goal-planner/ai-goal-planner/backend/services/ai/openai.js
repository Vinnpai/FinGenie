const config = require('../../config/env');

/**
 * OpenAI Provider (Paid)
 * Most capable but requires paid API key
 */
class OpenAIProvider {
  constructor() {
    this.apiKey = config.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4o-mini'; // Cost-effective model
  }

  async generatePlan(data) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { goal, amount, duration, income, savings } = data;
    
    const prompt = `Create a financial plan for:
Goal: ${goal}
Target: ₹${amount.toLocaleString()}
Duration: ${duration} months
Income: ₹${income.toLocaleString()}/month
Savings: ₹${savings.toLocaleString()}

Return JSON:
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'Financial advisor. JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('OpenAI error:', error.message);
      throw error;
    }
  }
}

module.exports = new OpenAIProvider();
