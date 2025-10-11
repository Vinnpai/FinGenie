require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-goal-planner',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret_key',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // AI Provider Configuration
  AI_PROVIDER: process.env.AI_PROVIDER || 'openrouter',
  
  // API Keys
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  HF_API_KEY: process.env.HF_API_KEY,
};
