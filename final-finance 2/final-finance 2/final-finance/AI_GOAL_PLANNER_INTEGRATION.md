# AI Goal Planner Integration Guide

## Overview
The AI Goal Planner component has been integrated into the Dashboard as a navigation option. It connects to a separate backend service that uses AI to generate personalized financial plans.

## What's Been Added

### Frontend Components
1. **AIGoalPlanner.jsx** - Main component for AI-powered goal planning
2. **SpendAnalyzer.jsx** - Spending analysis with pie charts
3. **FinancialAlerts.jsx** - Financial notifications and alerts
4. **InvestmentAdvisor.jsx** - Personalized investment recommendations

### Dashboard Navigation
The Dashboard now has 4 main sections accessible via the sidebar:
- 🔍 **Spend Analyzer** - View spending breakdown and budget
- 🎯 **AI Goal Planner** - Get AI-powered financial plans
- 🔔 **Financial Alerts** - See notifications and alerts
- 📈 **Investment Advisor** - Get personalized investment advice

## AI Goal Planner Backend Setup

The AI Goal Planner requires its own backend service (separate from the main finGenie backend).

### Location
The backend is in: `c:\Users\Manasa H N\OneDrive\Documents\final-finance 2\ai-goal-planner\ai-goal-planner\backend`

### Setup Steps

1. **Navigate to the AI Goal Planner backend:**
```bash
cd "c:\Users\Manasa H N\OneDrive\Documents\final-finance 2\ai-goal-planner\ai-goal-planner\backend"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
Create a `.env` file in the backend directory with:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ai-goal-planner
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

**Note:** The AI Goal Planner uses Groq API (free) for AI generation. Get your API key from: https://console.groq.com/

4. **Start the AI Goal Planner backend:**
```bash
npm start
```
or for development:
```bash
npm run dev
```

The backend will run on port 3001.

## Running the Complete Application

You need to run **THREE** servers:

### Terminal 1 - Main Backend (Port 5000)
```bash
cd backend
npm run dev
```

### Terminal 2 - AI Goal Planner Backend (Port 3001)
```bash
cd "c:\Users\Manasa H N\OneDrive\Documents\final-finance 2\ai-goal-planner\ai-goal-planner\backend"
npm run dev
```

### Terminal 3 - Frontend (Port 5173/5174)
```bash
npm run dev
```

## API Endpoints

### AI Goal Planner Backend (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/goals/create` | Create new financial goal with AI plan |
| GET | `/api/goals` | Get all user goals |
| GET | `/api/goals/:id` | Get specific goal |
| PUT | `/api/goals/:id/progress` | Update goal progress |
| DELETE | `/api/goals/:id` | Delete goal |

### Example Request
```javascript
POST http://localhost:3001/api/goals/create
Content-Type: application/json

{
  "goal": "Buy a laptop",
  "amount": 1500,
  "duration": 12,
  "income": 4000,
  "savings": 500
}
```

### Example Response
```javascript
{
  "success": true,
  "goal": {
    "_id": "...",
    "goal": "Buy a laptop",
    "amount": 1500,
    "duration": 12,
    "plan": {
      "monthly_saving": 125,
      "investment_strategy": "...",
      "summary": "..."
    }
  }
}
```

## Features

### AI Goal Planner
- Enter financial goals with target amount and timeline
- Get AI-generated savings plans
- Receive personalized investment strategies
- View monthly saving requirements
- Get AI insights and recommendations

### Investment Advisor
- Select risk profile (Conservative, Moderate, Aggressive)
- Get personalized portfolio recommendations
- View projected returns
- See asset allocation breakdown
- Receive AI-powered insights

## Troubleshooting

### AI Goal Planner not working?
1. Check if the AI Goal Planner backend is running on port 3001
2. Verify Groq API key is set in backend `.env`
3. Check browser console for API errors
4. Ensure MongoDB is running

### Port conflicts?
If port 3001 is in use, update:
- Backend: Change `PORT` in `.env`
- Frontend: Update API URL in `AIGoalPlanner.jsx` (line 30)

### No AI responses?
- Verify Groq API key is valid
- Check API rate limits
- Review backend logs for errors

## Optional: Standalone AI Goal Planner

The AI Goal Planner can also run as a standalone application:

```bash
cd "c:\Users\Manasa H N\OneDrive\Documents\final-finance 2\ai-goal-planner\ai-goal-planner"

# Install dependencies
npm install

# Start backend
cd backend
npm run dev

# In another terminal, start frontend
cd frontend
npm start
```

This will run the original AI Goal Planner interface on its own port.

## Architecture

```
finGenie Application
├── Main Backend (Port 5000)
│   ├── User Authentication
│   ├── Budget Management
│   └── Financial Goals
│
├── AI Goal Planner Backend (Port 3001)
│   ├── AI Plan Generation (Groq API)
│   ├── Goal Tracking
│   └── Progress Updates
│
└── Frontend (Port 5173)
    ├── Dashboard
    ├── Spend Analyzer
    ├── AI Goal Planner (calls Port 3001)
    ├── Financial Alerts
    └── Investment Advisor
```

## Next Steps

1. Install recharts: `npm install recharts`
2. Set up AI Goal Planner backend
3. Get Groq API key
4. Start all three servers
5. Test the complete flow

Enjoy your enhanced finGenie application! 🧞‍♂️✨
