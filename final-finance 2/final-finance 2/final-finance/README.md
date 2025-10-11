# finGenie - AI Financial Planning Application

A modern, full-stack financial planning application with AI-powered insights, built with React, Node.js, and MongoDB.

## Features

- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS and Framer Motion animations
- 🔐 **Authentication**: Secure JWT-based user authentication
- 💰 **Financial Goals**: Track and manage your financial goals
- 📊 **Budget Management**: Create and monitor budgets by category
- 📈 **Investment Hub**: Portfolio tracking and management
- 🎯 **Goal Tracker**: Set milestones and track progress
- 🤟 **Accessibility**: Sign language support for inclusive design
- 🤖 **AI Insights**: Smart financial recommendations

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Spline** - 3D graphics
- **Lottie** - Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd final-finance
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Environment Setup

#### Frontend (.env in root directory)
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env in backend directory)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fingenie
JWT_SECRET=your_secure_jwt_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### 5. Setup MongoDB

#### Option A: Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## Running the Application

### Development Mode

You'll need two terminal windows:

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend Dev Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
npm run build
```

#### Start Backend
```bash
cd backend
npm start
```

## Project Structure

```
final-finance/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── financeController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── financeRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── server.js
├── src/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── main.jsx
├── public/
├── .env.example
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Finance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/goals` | Get all goals (protected) |
| POST | `/api/finance/goals` | Create goal (protected) |
| PUT | `/api/finance/goals/:id` | Update goal (protected) |
| DELETE | `/api/finance/goals/:id` | Delete goal (protected) |
| GET | `/api/finance/budget` | Get budget (protected) |
| PUT | `/api/finance/budget` | Update budget (protected) |

## Usage

### 1. Register an Account
- Navigate to `/signup`
- Fill in your details
- Click "Create account"

### 2. Login
- Navigate to `/login`
- Enter your credentials
- You'll be redirected to the dashboard

### 3. Manage Financial Goals
Use the API endpoints to:
- Create new financial goals
- Track progress
- Update goal amounts
- Delete completed goals

### 4. Budget Management
- Set monthly income
- Create budget categories
- Track spending by category

## Features in Detail

### Smart Budgeting
- AI-powered budget recommendations
- Auto-categorization of expenses
- Spending alerts
- Monthly reports

### Investment Hub
- Portfolio tracking
- Risk analysis
- Rebalancing alerts
- Performance insights

### Goal Tracker
- Set financial goals
- Track progress with milestones
- Get success planning tips

### Smart Alerts
- Spending notifications
- Bill reminders
- Investment updates
- Goal milestone alerts

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication
- Protected API routes
- CORS enabled
- Environment variables for sensitive data

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### Port Already in Use
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` in frontend `.env`

### CORS Errors
- Ensure backend is running
- Check API URL configuration
- Verify CORS is enabled in `server.js`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

ISC

## Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ by the finGenie team
