# FinGenD + Fin-GenX Integration Setup Guide

## 🎯 Overview

This guide will help you run the fully integrated FinGenD backend with Fin-GenX frontend, providing real-time expense analysis, piggybank tracking, and interactive dashboards.

## 🏗️ Architecture

- **Backend**: Node.js/Express with expense analyzer sandbox
- **Frontend**: React/Vite with real-time charts and dashboards
- **Database**: MongoDB for user data and authentication
- **Real-time**: Polling-based updates every 5 seconds

## 📁 Project Structure

```
FinGenx-team-6/
├── final-finance 2/
│   └── final-finance 2/
│       └── final-finance/
│           ├── backend/                 # FinGenD Backend
│           │   ├── services/
│           │   │   └── expenseAnalyzer.js  # Expense simulation engine
│           │   ├── routes/
│           │   │   └── expenseRoutes.js    # API endpoints
│           │   └── server.js               # Main server
│           └── src/                    # Fin-GenX Frontend
│               ├── components/
│               │   └── ExpenseAnalyzer.jsx # Real-time dashboard
│               └── Dashboard.jsx           # Main dashboard
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend Dependencies:**

```bash
cd "/Users/vin/Desktop/FinGenx-team-6/final-finance 2/final-finance 2/final-finance/backend"
npm install uuid moment
```

**Frontend Dependencies:**

```bash
cd "/Users/vin/Desktop/FinGenx-team-6/final-finance 2/final-finance 2/final-finance"
npm install recharts
```

### 2. Start Backend Server

```bash
cd "/Users/vin/Desktop/FinGenx-team-6/final-finance 2/final-finance 2/final-finance/backend"
MONGODB_URI=mongodb://localhost:27017/fingenie JWT_SECRET=your_secure_jwt_secret_key_here PORT=5001 NODE_ENV=development node server.js
```

### 3. Start Frontend Server

```bash
cd "/Users/vin/Desktop/FinGenx-team-6/final-finance 2/final-finance 2/final-finance"
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api

## 🔌 API Endpoints

### Expense Analyzer APIs

| Endpoint                           | Method | Description                 |
| ---------------------------------- | ------ | --------------------------- |
| `/api/expense/messages`            | GET    | Real-time transaction data  |
| `/api/expense/piggybank`           | GET    | Actual vs estimated savings |
| `/api/expense/spending/categories` | GET    | Category-wise spending      |
| `/api/expense/spending/heatmap`    | GET    | Monthly spending heatmap    |
| `/api/expense/salary`              | POST   | Update monthly salary       |
| `/api/expense/budget`              | POST   | Update budget categories    |
| `/api/expense/settings`            | GET    | Current settings            |

### Example API Calls

```bash
# Get transactions
curl http://localhost:5001/api/expense/messages

# Get piggybank data
curl http://localhost:5001/api/expense/piggybank

# Update salary
curl -X POST http://localhost:5001/api/expense/salary \
  -H "Content-Type: application/json" \
  -d '{"amount": 6000}'

# Update budget
curl -X POST http://localhost:5001/api/expense/budget \
  -H "Content-Type: application/json" \
  -d '{"categories": {"food": 1000, "shopping": 800}}'
```

## 📊 Features

### Real-time Expense Analyzer

- **Transaction Simulation**: Generates realistic transactions every 5-15 seconds
- **Category Analysis**: Food, shopping, entertainment, bills, transport, other
- **Historical Data**: 5 months of transaction history
- **Live Updates**: Frontend polls backend every 5 seconds

### PiggyBank Tracking

- **Actual Savings**: Calculated from real transactions
- **Estimated Savings**: Based on salary minus budget
- **Performance Metrics**: On-track percentage and variance
- **Real-time Updates**: Updates as transactions are generated

### Interactive Dashboards

- **Bar Charts**: Category-wise spending visualization
- **Line Charts**: Monthly spending trends
- **Heatmaps**: Spending intensity across months
- **Real-time Tables**: Live transaction feed

### Data Visualization

- **Category Spending**: Bar chart with budget comparison
- **Monthly Trends**: Line chart showing spending patterns
- **PiggyBank Status**: Actual vs estimated savings
- **Recent Transactions**: Live transaction table

## 🎨 Frontend Components

### ExpenseAnalyzer.jsx

- Real-time data fetching every 5 seconds
- Interactive charts using Recharts
- Responsive design with Tailwind CSS
- Live transaction table
- PiggyBank status cards

### Dashboard Integration

- Added "Expense Analyzer" to navigation
- Seamless integration with existing components
- Consistent styling and animations

## 🔧 Configuration

### Backend Configuration

- **Port**: 5001 (configurable via PORT env var)
- **Database**: MongoDB (configurable via MONGODB_URI)
- **Simulation**: Auto-starts when server starts
- **CORS**: Enabled for frontend communication

### Frontend Configuration

- **API URL**: http://localhost:5001/api (configurable)
- **Polling Interval**: 5 seconds
- **Charts**: Recharts library for visualizations
- **Styling**: Tailwind CSS with custom animations

## 🐛 Troubleshooting

### Backend Issues

1. **Port already in use**: Kill process on port 5001

   ```bash
   lsof -i :5001
   kill -9 <PID>
   ```

2. **MongoDB connection error**: Ensure MongoDB is running

   ```bash
   brew services start mongodb-community
   ```

3. **Module not found**: Install missing dependencies
   ```bash
   npm install uuid moment
   ```

### Frontend Issues

1. **Charts not rendering**: Install Recharts

   ```bash
   npm install recharts
   ```

2. **API connection failed**: Check backend is running on port 5001

3. **CORS errors**: Ensure backend CORS is configured

## 📈 Performance

### Backend Optimization

- **Efficient Data Structures**: Optimized transaction storage
- **Memory Management**: Automatic cleanup of old transactions
- **API Caching**: Reduced database queries
- **Real-time Updates**: Minimal overhead polling

### Frontend Optimization

- **Chart Rendering**: Efficient Recharts implementation
- **Data Polling**: Smart polling with error handling
- **Component Updates**: Minimal re-renders
- **Responsive Design**: Mobile-friendly layouts

## 🚀 Production Deployment

### Backend Deployment

1. Set production environment variables
2. Use PM2 for process management
3. Configure reverse proxy (Nginx)
4. Set up MongoDB Atlas for database

### Frontend Deployment

1. Build production bundle
2. Deploy to CDN or static hosting
3. Configure API endpoints
4. Set up monitoring and analytics

## 📝 Development Notes

### Adding New Features

1. **New API Endpoints**: Add to `expenseRoutes.js`
2. **New Charts**: Add to `ExpenseAnalyzer.jsx`
3. **New Data Sources**: Extend `expenseAnalyzer.js`
4. **New Visualizations**: Use Recharts components

### Testing

- **API Testing**: Use curl or Postman
- **Frontend Testing**: Browser developer tools
- **Integration Testing**: Full stack testing
- **Performance Testing**: Load testing with multiple clients

## 🎯 Next Steps

1. **WebSocket Integration**: Replace polling with WebSockets
2. **Advanced Analytics**: Machine learning insights
3. **Export Features**: PDF/Excel export functionality
4. **Mobile App**: React Native implementation
5. **Real-time Notifications**: Push notifications for spending alerts

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Test individual components
4. Check browser console for errors
5. Verify backend logs for errors

---

**🎉 Your integrated FinGenD + Fin-GenX application is now ready!**

Access it at: http://localhost:5173
