# 📁 Project Structure

```
FinGenx-team-6/
├── README.md                    # Main project documentation
├── LICENSE                      # MIT License
├── CONTRIBUTING.md              # Contribution guidelines
├── .gitignore                   # Git ignore rules
│
├── final-finance 2/
│   └── final-finance 2/
│       └── final-finance/       # Main application directory
│           │
│           ├── backend/        # Node.js/Express backend
│           │   ├── config/      # Database configuration
│           │   ├── controllers/ # Route controllers
│           │   ├── middleware/  # Auth & error middleware
│           │   ├── models/      # Mongoose models
│           │   ├── routes/      # API routes
│           │   ├── services/    # Business logic (expenseAnalyzer, stockService)
│           │   ├── utils/       # Utility functions
│           │   ├── server.js    # Main server file
│           │   └── package.json
│           │
│           ├── src/            # React frontend
│           │   ├── components/  # React components
│           │   ├── context/    # React context (Auth)
│           │   ├── services/   # API service layer
│           │   ├── App.jsx     # Main app component
│           │   ├── Dashboard.jsx
│           │   ├── Login.jsx
│           │   ├── Signup.jsx
│           │   └── main.jsx    # Entry point
│           │
│           ├── public/         # Static assets
│           ├── package.json    # Frontend dependencies
│           └── vite.config.js  # Vite configuration
│
├── INTEGRATION_SETUP.md        # Integration guide
├── VIDEO_SCRIPT.md             # Demo video script
├── VIDEO_DEMO_GUIDE.md         # Video recording guide
└── SCRIPT_SIMPLE.txt           # Simple script for video

```

## Key Directories

### Backend (`backend/`)
- **server.js**: Main Express server
- **routes/**: API endpoints (auth, finance, expense, user)
- **services/**: Core business logic
  - `expenseAnalyzer.js`: Real-time transaction simulation
  - `stockService.js`: Investment data and recommendations
- **controllers/**: Request handlers
- **models/**: Database schemas (User model)

### Frontend (`src/`)
- **components/**: All React components
  - `AIGoalPlanner.jsx`: AI-powered goal planning
  - `Chatbot.jsx`: AI financial advisor
  - `ExpenseAnalyzer.jsx`: Real-time expense dashboard
  - `SpendAnalyzer.jsx`: Spending analysis charts
  - `InvestmentAdvisor.jsx`: Investment recommendations
  - `FinancialAlerts.jsx`: Budget alerts
  - `UserProfileSetup.jsx`: Profile onboarding
- **services/api.js**: Centralized API calls
- **context/AuthContext.jsx**: Authentication state management

## Important Files

- **README.md**: Complete project documentation
- **INTEGRATION_SETUP.md**: Step-by-step setup guide
- **VIDEO_SCRIPT.md**: Demo video script
- **.gitignore**: Git ignore patterns (includes node_modules, .env, etc.)
