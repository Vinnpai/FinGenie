# 🚀 AI Goal Planner - Complete Setup Guide

This guide will walk you through setting up the AI Goal Planner from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)
3. **Git** (optional) - [Download](https://git-scm.com/)
4. **Code Editor** - VS Code recommended

## 🔑 Step 1: Get a Free AI API Key

You need at least ONE of these (OpenRouter recommended):

### Option A: OpenRouter (Recommended)
1. Visit https://openrouter.ai/
2. Click "Sign Up" (can use Google/GitHub)
3. Go to "Keys" section
4. Click "Create Key"
5. Copy your API key
6. **Free models available**: Llama 3.1, Mistral, Qwen

### Option B: Groq
1. Visit https://console.groq.com/
2. Sign up for free account
3. Navigate to API Keys
4. Create new API key
5. Copy your key
6. **Very fast inference**, great for quick responses

### Option C: Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your key
5. **Generous free tier**: 60 requests/minute

### Option D: Hugging Face
1. Visit https://huggingface.co/settings/tokens
2. Create free account
3. Generate new token
4. Copy your token
5. **Free inference** for many models

## 💾 Step 2: Setup MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free M0 cluster (512MB)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: `mongodb+srv://...`)
6. Replace `<password>` with your database password
7. Save this connection string for later

### Option B: Local MongoDB
1. Download and install MongoDB Community Edition
2. Start MongoDB service:
   - Windows: MongoDB runs as service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. Your connection string: `mongodb://localhost:27017/ai-goal-planner`

## 📦 Step 3: Install the Application

### 3.1 Navigate to Project Directory
```bash
cd ai-goal-planner
```

### 3.2 Install Dependencies

**Option A: Install all at once (recommended)**
```bash
npm run install-all
```

**Option B: Install manually**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Create Backend .env File
```bash
cd backend
cp .env.example .env
```

### 4.2 Edit the .env File
Open `backend/.env` in your code editor and update:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Use YOUR MongoDB connection string
MONGO_URI=mongodb://localhost:27017/ai-goal-planner
# OR for Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-goal-planner

# JWT Secret - Change this to any random string
JWT_SECRET=my_super_secret_random_string_12345

# Frontend URL
FRONTEND_URL=http://localhost:3000

# AI Provider - Choose one: openrouter, groq, gemini, openai, huggingface
AI_PROVIDER=openrouter

# Add YOUR API key here (only need the one you're using)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
# GROQ_API_KEY=gsk_xxxxxxxxxxxxx
# GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxx
# OPENAI_API_KEY=sk-xxxxxxxxxxxxx
# HF_API_KEY=hf_xxxxxxxxxxxxx
```

**Important**: 
- Replace `MONGO_URI` with your actual MongoDB connection string
- Replace `JWT_SECRET` with a random string
- Add your AI API key for the provider you chose

## 🚀 Step 5: Start the Application

### 5.1 Start Backend Server
Open a terminal/command prompt:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
🤖 AI Provider: openrouter
```

### 5.2 Start Frontend (New Terminal)
Open a **NEW** terminal/command prompt:
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## ✅ Step 6: Test the Application

1. **Open browser**: Navigate to `http://localhost:3000`
2. **Fill the form**:
   - Goal: "Buy a laptop"
   - Amount: 60000
   - Duration: 12 months
   - Income: 50000
   - Savings: 10000
3. **Click "Generate AI Plan"**
4. **See results**: AI-generated financial plan appears

## 🎯 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution**:
- Ensure MongoDB is running (if local)
- Check your `MONGO_URI` is correct
- For Atlas: Check IP whitelist (add `0.0.0.0/0` for testing)

### Issue: "AI Provider error" or "Failed to generate plan"
**Solution**:
- Verify your API key is correct
- Check you have credits/quota remaining
- Try switching to a different provider in `.env`
- Fallback calculation will be used if AI fails

### Issue: "Port 5000 already in use"
**Solution**:
- Change `PORT=5001` in backend `.env`
- Restart backend server

### Issue: Frontend can't connect to backend
**Solution**:
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify `FRONTEND_URL` in backend `.env`

### Issue: "Module not found" errors
**Solution**:
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Switching AI Providers

To switch providers:

1. Open `backend/.env`
2. Change `AI_PROVIDER` to: `openrouter`, `groq`, `gemini`, `openai`, or `huggingface`
3. Ensure the corresponding API key is set
4. Restart backend server (Ctrl+C, then `npm run dev`)

Example:
```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your_actual_key_here
```

## 📱 Using the Application

### Without Authentication
- Just fill the form and generate plans
- Plans are not saved

### With Authentication (Optional)
1. Click "Sign Up" (if you implement auth UI)
2. Create account
3. Login
4. Your goals will be saved to MongoDB
5. View all your goals in dashboard

## 🎨 Customization

### Change Color Palette
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#000000',    // Black
  secondary: '#fa255e',  // Pink
  accent: '#c39ea0',     // Rose
  light: '#f8e5e5',      // Cream
}
```

### Change AI Model
Edit provider file in `backend/services/ai/`:
- OpenRouter: Change `model` in `openrouter.js`
- Groq: Change `model` in `groq.js`
- etc.

## 🚢 Deployment (Optional)

### Deploy Backend to Render
1. Push code to GitHub
2. Create account on Render.com
3. New Web Service → Connect GitHub repo
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`
6. Add environment variables from `.env`

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Create account on Vercel.com
3. Import GitHub repository
4. Root directory: `frontend`
5. Build command: `npm run build`
6. Deploy

## 📚 Next Steps

- Add more goals and track progress
- Implement user dashboard
- Add goal categories
- Email notifications for milestones
- Export reports as PDF

## 🆘 Need Help?

- Check the main [README.md](README.md) for API documentation
- Open an issue on GitHub
- Review error messages in terminal

---

**Congratulations! 🎉** Your AI Goal Planner is now running!

Visit: http://localhost:3000
