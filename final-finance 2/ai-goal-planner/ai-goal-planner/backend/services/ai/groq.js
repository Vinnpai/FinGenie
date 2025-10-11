const config = require('../../config/env');

/**
 * Groq AI Provider (Free & Fast)
 * Supports Llama and Mixtral models with fast inference
 */
class GroqProvider {
  constructor() {
    this.apiKey = config.GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.model = 'llama-3.1-8b-instant'; // Fast and free
  }

  async generatePlan(data) {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured');
    }

    const { goal, amount, duration, income, savings } = data;
    
    const prompt = `Create a financial plan in JSON format:

Goal: ${goal}
Target: ₹${amount.toLocaleString()}
Duration: ${duration} months
Income: ₹${income.toLocaleString()}/month
Savings: ₹${savings.toLocaleString()}

Return JSON only:
{
  "monthly_saving": number,
  "investment_strategy": "strategy description",
  "summary": "brief plan"
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
            { role: 'system', content: 'You are a financial advisor. Respond with JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 400
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Groq error:', error.message);
      throw error;
    }
  }
}

module.exports = new GroqProvider();
