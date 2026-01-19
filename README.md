# 💰 finGenie - AI-Powered Financial Management Platform

<div align="center">

![finGenie Logo](final-finance%202/final-finance%202/final-finance/public/fin-logo.jpg)

**An intelligent financial management platform with real-time expense analysis, AI-powered goal planning, and personalized investment advice.**

[![Built at Udgama Hackathon](https://img.shields.io/badge/Built%20at-Udgama%20Hackathon-blue)](https://udgama.com)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)

**[🎥 Watch Demo Video](---

[![FinGenie Quick Demo](https://img.youtube.com/vi/jt-z1ugr1FA/0.jpg)](https://youtu.be/jt-z1ugr1FA)


---)** | **[🚀 Quick Start](#-quick-start)** | **[📖 Documentation](#-documentation)**

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Demo Video](#-demo-video)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**finGenie** is a comprehensive financial management platform built during the **Udgama Hackathon**. It combines intelligent expense tracking, AI-powered financial planning, and real-time analytics to help users achieve their financial goals.

### Key Highlights

- 🤖 **AI-Powered Chatbot**: Personalized financial advice based on user profile and goals
- 📊 **Real-time Expense Analyzer**: Live transaction simulation with interactive dashboards
- 🎯 **Smart Goal Planning**: AI-driven financial goal planning with actionable insights
- 💰 **PiggyBank Tracking**: Monitor actual vs estimated savings in real-time
- 📈 **Investment Advisor**: Personalized investment recommendations based on risk profile
- 🔔 **Financial Alerts**: Proactive notifications for budget overspending and bill reminders

---

## 🎥 Demo Preview
[![FinGenie Quick Demo](https://img.youtube.com/vi/jt-z1ugr1FA/0.jpg)](https://youtu.be/jt-z1ugr1FA)


The demo video showcases:
- User registration and profile setup
- Real-time expense analyzer with live transactions
- AI chatbot interactions
- Goal planning and tracking
- Investment advisor recommendations
- Interactive charts and visualizations


---

## ✨ Features

### 🎨 Core Features

#### 1. **User Authentication & Profile Management**
- Secure JWT-based authentication
- Comprehensive user profile setup (age, occupation, risk tolerance, financial priorities)
- Multi-step onboarding process
- Profile-based personalization

#### 2. **Real-time Expense Analyzer**
- **Live Transaction Simulation**: Generates realistic transactions every 5-15 seconds
- **Category-wise Analysis**: Food, shopping, entertainment, bills, transport, other
- **Interactive Charts**: Bar charts, line charts, and heatmaps
- **5 Months Historical Data**: Complete transaction history
- **Real-time Updates**: Frontend polls backend every 5 seconds

#### 3. **AI-Powered Financial Chatbot**
- Personalized responses based on user's financial data
- Context-aware conversations
- Advice on budgeting, investing, debt management, and retirement planning
- Conversation history tracking
- Stock market integration

#### 4. **Smart Goal Planning**
- AI-driven financial goal creation
- Priority-based goal management
- Monthly saving requirements calculation
- Investment strategy recommendations
- Progress tracking with visual indicators

#### 5. **PiggyBank Tracking**
- **Actual Savings**: Calculated from real transactions
- **Estimated Savings**: Based on salary minus budget
- **Performance Metrics**: On-track percentage and variance
- **Real-time Updates**: Updates as transactions are generated
- **Trend Analysis**: Savings trend over time

#### 6. **Investment Advisor**
- Risk profile assessment (Conservative, Moderate, Aggressive)
- Personalized portfolio recommendations
- Stock market data integration
- Retirement planning with projections
- Market trends and insights

#### 7. **Financial Alerts**
- Budget overspending notifications
- Bill payment reminders
- Goal milestone updates
- Customizable alert preferences

#### 8. **Spend Analyzer**
- Interactive pie charts for spending by category
- Budget vs actual spending comparison
- Highest spending category identification
- Visual breakdown of expenses

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Charting library
- **React Router** - Routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication (optional)

### Services & APIs
- **Expense Analyzer Service** - Transaction simulation engine
- **Stock Service** - Investment data and recommendations
- **AI Chatbot Service** - Personalized financial advice
- **PiggyBank Service** - Savings tracking and analysis

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart for development
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
FinGenx-team-6/
├── final-finance 2/
│   └── final-finance 2/
│       └── final-finance/
│           ├── backend/                    # Backend API Server
│           │   ├── config/
│           │   │   └── db.js              # Database configuration
│           │   ├── controllers/
│           │   │   ├── authController.js   # Authentication logic
│           │   │   ├── financeController.js
│           │   │   └── userController.js   # User profile management
│           │   ├── middleware/
│           │   │   ├── auth.js            # JWT authentication
│           │   │   └── errorHandler.js    # Error handling
│           │   ├── models/
│           │   │   └── User.js            # User schema
│           │   ├── routes/
│           │   │   ├── authRoutes.js      # Auth endpoints
│           │   │   ├── expenseRoutes.js   # Expense analyzer APIs
│           │   │   ├── financeRoutes.js   # Finance endpoints
│           │   │   └── userRoutes.js      # User endpoints
│           │   ├── services/
│           │   │   ├── expenseAnalyzer.js # Transaction simulation
│           │   │   └── stockService.js    # Stock market data
│           │   ├── utils/
│           │   │   └── generateToken.js   # JWT token generation
│           │   └── server.js              # Main server file
│           │
│           └── src/                        # Frontend React App
│               ├── components/
│               │   ├── AIGoalPlanner.jsx  # AI goal planning
│               │   ├── Chatbot.jsx        # AI chatbot
│               │   ├── DashboardOverview.jsx
│               │   ├── ExpenseAnalyzer.jsx # Real-time expense dashboard
│               │   ├── FinancialAlerts.jsx
│               │   ├── InvestmentAdvisor.jsx
│               │   ├── SpendAnalyzer.jsx
│               │   └── UserProfileSetup.jsx
│               ├── context/
│               │   └── AuthContext.jsx    # Authentication context
│               ├── services/
│               │   ├── api.js            # API service layer
│               │   └── stockService.js   # Stock data service
│               ├── Dashboard.jsx         # Main dashboard
│               ├── Login.jsx
│               ├── Signup.jsx
│               └── App.jsx
│
├── INTEGRATION_SETUP.md                   # Integration guide
└── README.md                               # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18.0 or higher)
- **MongoDB** (v7.0 or higher) - [Install MongoDB](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/FinGenx-team-6.git
cd FinGenx-team-6
```

### Step 2: Install Backend Dependencies

```bash
cd "final-finance 2/final-finance 2/final-finance/backend"
npm install
npm install uuid moment  # Additional dependencies for expense analyzer
```

### Step 3: Install Frontend Dependencies

```bash
cd "../.."  # Go back to frontend root
npm install
npm install recharts  # Chart library for visualizations
```

### Step 4: Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cd backend
touch .env
```

Add the following to `.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/fingenie
JWT_SECRET=your_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 5: Start MongoDB

**macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

---

## 💻 Usage

### Starting the Application

#### Terminal 1: Start Backend Server

```bash
cd "final-finance 2/final-finance 2/final-finance/backend"
MONGODB_URI=mongodb://localhost:27017/fingenie \
JWT_SECRET=your_secure_jwt_secret_key_here \
PORT=5001 \
NODE_ENV=development \
node server.js
```

**Expected Output:**
```
🎲 Expense Analyzer simulation started
MongoDB Connected: localhost
Server running in development mode on port 5001
```

#### Terminal 2: Start Frontend Server

```bash
cd "final-finance 2/final-finance 2/final-finance"
npm run dev
```

**Expected Output:**
```
VITE v5.4.20  ready in 341 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Accessing the Application

1. **Open your browser** and navigate to: `http://localhost:5173`
2. **Create an account** or **login** with existing credentials
3. **Complete the profile setup** (4-step process):
   - Basic information (age, occupation, expenses)
   - Financial priorities
   - Investment profile (risk tolerance, experience)
   - Investment goals
4. **Explore the dashboard**:
   - **Dashboard Overview**: Financial summary
   - **Expense Analyzer**: Real-time transaction analysis
   - **Spend Analyzer**: Category-wise spending breakdown
   - **AI Goal Planner**: Create and track financial goals
   - **Investment Advisor**: Personalized investment recommendations
   - **Financial Alerts**: Budget and bill notifications
5. **Interact with the AI Chatbot** for personalized financial advice

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/register` | POST | Register new user | No |
| `/auth/login` | POST | Login user | No |
| `/auth/profile` | GET | Get user profile | Yes |
| `/auth/profile` | PUT | Update user profile | Yes |

### Expense Analyzer Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/expense/messages` | GET | Get real-time transaction data | No |
| `/expense/piggybank` | GET | Get actual vs estimated savings | No |
| `/expense/spending/categories` | GET | Get category-wise spending | No |
| `/expense/spending/heatmap` | GET | Get monthly spending heatmap | No |
| `/expense/salary` | POST | Update monthly salary | No |
| `/expense/budget` | POST | Update budget categories | No |
| `/expense/settings` | GET | Get current settings | No |
| `/expense/stats` | GET | Get expense statistics | No |

### Finance Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/finance/goals` | GET | Get all financial goals | Yes |
| `/finance/goals` | POST | Create new goal | Yes |
| `/finance/goals/:id` | PUT | Update goal | Yes |
| `/finance/goals/:id` | DELETE | Delete goal | Yes |
| `/finance/budget` | GET | Get budget | Yes |
| `/finance/budget` | PUT | Update budget | Yes |

### User Profile Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/user/profile` | GET | Get user profile | Yes |
| `/user/profile` | PUT | Update user profile | Yes |
| `/user/conversation` | POST | Add AI conversation | Yes |
| `/user/conversations` | GET | Get conversation history | Yes |

### Example API Calls

#### Get Real-time Transactions
```bash
curl http://localhost:5001/api/expense/messages
```

#### Get PiggyBank Data
```bash
curl http://localhost:5001/api/expense/piggybank
```

#### Update Salary
```bash
curl -X POST http://localhost:5001/api/expense/salary \
  -H "Content-Type: application/json" \
  -d '{"amount": 6000}'
```

#### Update Budget
```bash
curl -X POST http://localhost:5001/api/expense/budget \
  -H "Content-Type: application/json" \
  -d '{
    "categories": {
      "food": 1000,
      "shopping": 800,
      "entertainment": 500,
      "bills": 1200,
      "transport": 300,
      "other": 500
    }
  }'
```


Built at Udgama Hackathon


---

## 🏆 Hackathon Information

**Event**: Udgama Hackathon  
**Project**: finGenie - AI-Powered Financial Management Platform  
**Category**: FinTech / Personal Finance  
**Duration**: [Hackathon Duration]  
**Date**: [Hackathon Date]

### Problem Statement
[Describe the problem you solved]

### Solution
[Describe your solution and how it addresses the problem]

### Key Achievements
- ✅ Real-time expense tracking and analysis
- ✅ AI-powered financial advice
- ✅ Personalized investment recommendations
- ✅ Interactive data visualizations
- ✅ Complete user profile management
- ✅ Goal planning and tracking

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

---

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use:**
```bash
# Find process using port 5001
lsof -i :5001
# Kill the process
kill -9 <PID>
```

**MongoDB Connection Error:**
```bash
# Start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

**Module Not Found:**
```bash
# Install missing dependencies
cd backend
npm install uuid moment
```

### Frontend Issues

**Charts Not Rendering:**
```bash
# Install Recharts
npm install recharts
```

**API Connection Failed:**
- Ensure backend is running on port 5001
- Check CORS configuration in backend
- Verify API URL in frontend code

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Performance

### Optimizations Implemented

- **Backend**: Efficient data structures, automatic cleanup, optimized queries
- **Frontend**: Code splitting, lazy loading, memoization
- **Real-time Updates**: Smart polling with error handling
- **Charts**: Efficient rendering with Recharts
- **Database**: Indexed queries, connection pooling

---

## 🔒 Security

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Configuration**: Restricted origins
- **Environment Variables**: Sensitive data in .env

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Udgama** for organizing the hackathon
- **Open Source Community** for amazing libraries
- **MongoDB** for database solutions
- **React Team** for the amazing framework
- **All Contributors** who helped build this project

---

## 📞 Contact & Support

- **GitHub Issues**: [Open an issue](https://github.com/your-username/FinGenx-team-6/issues)
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **Discord**: [Join our server](https://discord.gg/your-server)

---

<div align="center">

**Made with ❤️ by Team 6 at Udgama Hackathon**

[⬆ Back to Top](#-fingenie---ai-powered-financial-management-platform)

</div>
