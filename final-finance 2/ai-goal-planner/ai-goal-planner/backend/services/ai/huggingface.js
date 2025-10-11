const config = require('../../config/env');

/**
 * Hugging Face Inference API Provider
 * Free tier available for many models
 */
class HuggingFaceProvider {
  constructor() {
    this.apiKey = config.HF_API_KEY;
    this.baseURL = 'https://api-inference.huggingface.co/models';
    this.model = 'mistralai/Mistral-7B-Instruct-v0.2'; // Free inference
  }

  async generatePlan(data) {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const { goal, amount, duration, income, savings } = data;
    
    const prompt = `<s>[INST] You are a financial advisor. Create a savings plan in JSON format.

Goal: ${goal}
Target: ₹${amount.toLocaleString()}
Duration: ${duration} months
Income: ₹${income.toLocaleString()}/month
Savings: ₹${savings.toLocaleString()}

Respond with JSON only:
{"monthly_saving": number, "investment_strategy": "string", "summary": "string"} [/INST]`;

    try {
      const response = await fetch(`${this.baseURL}/${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result[0]?.generated_text || result.generated_text;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Hugging Face error:', error.message);
      throw error;
    }
  }
}

module.exports = new HuggingFaceProvider();
