# AI Goal Planner 🎯

A full-stack web application that uses **free AI models** to generate personalized financial plans for achieving your goals.

## ✨ Features

- **🤖 Multiple Free AI Providers**: OpenRouter, Groq, Gemini, Hugging Face (configurable)
- **💰 Smart Financial Planning**: AI-powered savings and investment strategies
- **📊 Progress Tracking**: Visual progress bars and goal management
- **🔐 Optional Authentication**: Use without login or sign up to save goals
- **🎨 Beautiful UI**: Modern design with custom color palette
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **💾 Data Persistence**: MongoDB integration for saving user goals

## 🎨 Color Palette

- **Primary (Black)**: `#000000`
- **Secondary (Pink)**: `#fa255e`
- **Accent (Rose)**: `#c39ea0`
- **Light (Cream)**: `#f8e5e5`

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Modern component architecture
- Responsive design

### Backend
- Node.js with Express.js
- **Multiple AI Provider Support**:
  - OpenRouter (Free Llama models)
  - Groq (Fast inference)
  - Google Gemini (Free tier)
  - OpenAI (Paid)
  - Hugging Face (Free inference)
- MongoDB for data storage
- JWT authentication
- bcrypt for password hashing
- CORS enabled

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- API key for at least one AI provider (see below)

### Getting Free API Keys

1. **OpenRouter** (Recommended - Free models available)
   - Visit: https://openrouter.ai/
   - Sign up and get API key
   - Free models: Llama 3.1, Mistral, Qwen

2. **Groq** (Fast & Free)
   - Visit: https://console.groq.com/
   - Sign up for free API key
   - Very fast inference

3. **Google Gemini** (Generous free tier)
   - Visit: https://makersuite.google.com/app/apikey
   - Get free API key
   - Good for complex queries

4. **Hugging Face** (Free inference)
   - Visit: https://huggingface.co/settings/tokens
   - Create free account and token

### Installation

1. **Clone and setup**
   ```bash
   cd ai-goal-planner
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   Or manually:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm start
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ai-goal-planner
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-goal-planner

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AI Provider (choose one: openrouter, groq, gemini, openai, huggingface)
AI_PROVIDER=openrouter

# API Keys (only need the one you're using)
OPENROUTER_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
HF_API_KEY=your_key_here
```

## Usage

1. **Open the application**: Navigate to `http://localhost:3000`
2. **Enter your goal**: Fill in the form with your financial goal details
3. **Get AI plan**: Click "Generate AI Plan" to get personalized recommendations
4. **Review results**: See monthly savings, investment strategy, and summary

## Example Input

- **Goal**: "Buy a laptop"
- **Target Amount**: ₹60,000
- **Duration**: 12 months
- **Monthly Income**: ₹50,000
- **Current Savings**: ₹10,000

## Example Output

```json
{
  "monthly_saving": 5000,
  "investment_strategy": "Low-risk SIP (6-8% annual return) - Balanced mutual funds",
  "summary": "To achieve your goal of Buy a laptop worth ₹60,000 in 12 months, save ₹5,000 monthly. Low-risk SIP will help you reach approximately ₹64,800."
}
```

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/register`
Register new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user (requires authentication)

### Goals

#### POST `/api/goals`
Create new goal and generate AI plan
```json
{
  "goal": "Buy a laptop",
  "amount": 60000,
  "duration": 12,
  "income": 50000,
  "savings": 10000
}
```

**Response:**
```json
{
  "success": true,
  "monthly_saving": 5000,
  "investment_strategy": "Low-risk SIP (6-8% annual return)",
  "summary": "Save ₹5,000 monthly...",
  "goalId": "..."
}
```

#### GET `/api/goals`
Get all goals (user's goals if authenticated)

#### GET `/api/goals/:id`
Get single goal by ID

#### PUT `/api/goals/:id`
Update goal (requires authentication)

#### DELETE `/api/goals/:id`
Delete goal (requires authentication)

### Health Check

#### GET `/health`
Check API status and AI provider
```json
{
  "status": "OK",
  "message": "AI Goal Planner API is running",
  "aiProvider": "openrouter",
  "timestamp": "2025-01-10T..."
}
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy automatically on push

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

### MongoDB Atlas
1. Create a free MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Starts development server
```

## 📁 Project Structure

```
ai-goal-planner/
│
├── backend/                    # Server-side code
│   ├── config/                 # Configuration files
│   │   ├── database.js         # MongoDB connection
│   │   └── env.js              # Environment variables
│   ├── controllers/            # API logic
│   │   ├── authController.js   # Authentication logic
│   │   └── goalController.js   # Goal CRUD operations
│   ├── models/                 # Database schemas
│   │   ├── User.js             # User model
│   │   └── Goal.js             # Goal model
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── goalRoutes.js       # Goal endpoints
│   ├── services/               # Business logic
│   │   └── ai/                 # AI provider integrations
│   │       ├── index.js        # AI service factory
│   │       ├── openrouter.js   # OpenRouter provider
│   │       ├── groq.js         # Groq provider
│   │       ├── gemini.js       # Gemini provider
│   │       ├── openai.js       # OpenAI provider
│   │       └── huggingface.js  # Hugging Face provider
│   ├── utils/                  # Utility functions
│   │   └── auth.js             # JWT middleware
│   ├── server.js               # Entry point
│   └── package.json
│
├── frontend/                   # Client-side code
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── GoalPlanner.tsx # Main planner form
│   │   │   ├── GoalCard.tsx    # Goal display card
│   │   │   ├── ProgressBar.tsx # Progress visualization
│   │   │   └── Navbar.tsx      # Navigation bar
│   │   ├── services/           # API integration
│   │   │   └── api.ts          # API service
│   │   ├── App.tsx             # Main app component
│   │   └── index.css           # Global styles
│   ├── tailwind.config.js      # Tailwind configuration
│   └── package.json
│
├── .env.example                # Environment template
├── .gitignore
├── package.json                # Root package (monorepo)
└── README.md
```

## 🔧 Switching AI Providers

To switch between AI providers, simply change the `AI_PROVIDER` in your `.env` file:

```env
# Use OpenRouter (free Llama models)
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_key

# Or use Groq (fast inference)
AI_PROVIDER=groq
GROQ_API_KEY=your_key

# Or use Gemini (Google's free tier)
AI_PROVIDER=gemini
GOOGLE_API_KEY=your_key

# Or use OpenAI (paid, most capable)
AI_PROVIDER=openai
OPENAI_API_KEY=your_key

# Or use Hugging Face (free inference)
AI_PROVIDER=huggingface
HF_API_KEY=your_key
```

Restart the backend server after changing providers.

## 🎯 Usage Tips

1. **Without Authentication**: Just fill the form and generate plans instantly
2. **With Authentication**: Sign up to save and track multiple goals
3. **Best Results**: Provide realistic income and savings amounts
4. **Duration**: Keep duration between 1-120 months for optimal plans

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists with correct values
- Ensure at least one AI provider API key is set

### AI plan generation fails
- Verify your AI provider API key is valid
- Check you have credits/quota remaining
- Try switching to a different provider
- Fallback calculation will be used if AI fails

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `FRONTEND_URL` in backend `.env`

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenRouter for free AI model access
- Groq for fast inference
- Google Gemini for generous free tier
- MongoDB for database
- React and Tailwind CSS for UI

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and Free AI Models (OpenRouter/Groq/Gemini)**

**Color Palette**: #000000 • #fa255e • #c39ea0 • #f8e5e5
