const config = require('../../config/env');

/**
 * Google Gemini AI Provider
 * Free tier available with generous limits
 */
class GeminiProvider {
  constructor() {
    this.apiKey = config.GOOGLE_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-1.5-flash'; // Fast and free
  }

  async generatePlan(data) {
    if (!this.apiKey) {
      throw new Error('Google API key not configured');
    }

    const { goal, amount, duration, income, savings } = data;
    
    const prompt = `As a financial advisor, create a savings plan in JSON format:

Goal: ${goal}
Target Amount: ₹${amount.toLocaleString()}
Duration: ${duration} months
Monthly Income: ₹${income.toLocaleString()}
Current Savings: ₹${savings.toLocaleString()}

Respond with JSON only:
{
  "monthly_saving": <number>,
  "investment_strategy": "<strategy>",
  "summary": "<plan summary>"
}`;

    try {
      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.candidates[0].content.parts[0].text;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Gemini error:', error.message);
      throw error;
    }
  }
}

module.exports = new GeminiProvider();
