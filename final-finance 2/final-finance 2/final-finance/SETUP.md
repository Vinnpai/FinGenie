# Quick Setup Guide

## ✅ What's Been Created

1. **Dashboard Page** - Beautiful financial dashboard with:
   - Spend Analyzer (Pie Chart)
   - AI Goal Planner
   - Financial Alerts
   - Interactive Chatbot

2. **Backend Integration** - Complete Node.js + MongoDB backend
3. **Authentication Flow** - Login/Signup now redirects to Dashboard

## 🚀 Steps to Run

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Setup Backend Environment
Create `backend\.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fingenie
JWT_SECRET=your_secure_random_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Setup Frontend Environment (Optional)
Create `.env` file in root with:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start MongoDB
- **Windows**: MongoDB should auto-start as a service
- **Or use MongoDB Atlas** (cloud) - update MONGODB_URI in backend\.env

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: http://localhost:5173 (or 5174)

## 🎯 Testing the Flow

1. Go to http://localhost:5173
2. Click "Sign up" or "Get started"
3. Create an account
4. You'll be automatically redirected to the Dashboard
5. Explore the features:
   - View spending breakdown
   - Check financial goals
   - See alerts
   - Chat with AI assistant (bottom right)

## 📦 New Dependencies Added

- `recharts` - For beautiful charts and graphs

## 🔧 Troubleshooting

### Backend won't start?
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify `.env` file exists in backend folder

### Frontend errors?
- Run `npm install` to install recharts
- Clear browser cache
- Check console for specific errors

### Can't login?
- Make sure backend is running
- Check MongoDB connection
- Verify API_URL in frontend .env

## 📁 New Files Created

```
src/
├── Dashboard.jsx          # Main dashboard page
├── components/
│   └── Chatbot.jsx       # AI chatbot component
backend/
├── server.js             # Express server
├── config/
│   └── db.js            # MongoDB connection
├── models/
│   └── User.js          # User schema
├── controllers/
│   ├── authController.js
│   └── financeController.js
├── routes/
│   ├── authRoutes.js
│   └── financeRoutes.js
└── middleware/
    ├── auth.js
    └── errorHandler.js
```

## 🎨 Features

- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion animations
- **Real-time Chat** - AI-powered chatbot
- **Data Visualization** - Interactive charts
- **Secure Auth** - JWT-based authentication

Enjoy your finGenie application! 🧞‍♂️✨
