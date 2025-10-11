# ⚡ Quick Start Guide

Get your AI Goal Planner running in 5 minutes!

## 🎯 Prerequisites
- Node.js installed
- MongoDB running (local or Atlas)
- One free AI API key

## 🚀 Setup Steps

### 1. Get Free API Key (Choose One)

**OpenRouter** (Recommended):
- Visit: https://openrouter.ai/
- Sign up → Get API key
- Free Llama models available

**Groq** (Fast):
- Visit: https://console.groq.com/
- Sign up → Get API key

**Gemini** (Google):
- Visit: https://makersuite.google.com/app/apikey
- Get free API key

### 2. Install Dependencies

```bash
cd ai-goal-planner

# Install all dependencies
npm run install-all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/ai-goal-planner
JWT_SECRET=change_this_to_random_string
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_actual_key_here
```

### 4. Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Open Browser

Visit: **http://localhost:3000**

## ✅ Test It

1. Fill the form:
   - Goal: "Buy a laptop"
   - Amount: 60000
   - Duration: 12
   - Income: 50000
   - Savings: 10000

2. Click "✨ Generate AI Plan"

3. See your personalized financial plan!

## 🎨 Your Color Palette

- **Black**: `#000000` (Primary)
- **Pink**: `#fa255e` (Secondary)
- **Rose**: `#c39ea0` (Accent)
- **Cream**: `#f8e5e5` (Light)

## 🔧 Switch AI Provider

Edit `backend/.env`:
```env
AI_PROVIDER=groq  # or openrouter, gemini, openai, huggingface
GROQ_API_KEY=your_key
```

Restart backend.

## ❓ Issues?

**MongoDB error**: Check MongoDB is running
**AI error**: Verify API key is correct
**Port in use**: Change PORT in `.env`

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed help.

---

**That's it! 🎉** Your AI Goal Planner is ready!
