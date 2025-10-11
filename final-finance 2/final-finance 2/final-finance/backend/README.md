# finGenie Backend API

Node.js backend with MongoDB for the finGenie financial planning application.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Registration, login, profile management
- **Financial Goals**: Create, read, update, and delete financial goals
- **Budget Management**: Track income and expenses by category
- **RESTful API**: Clean and organized API endpoints

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fingenie
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

### Finance Routes (`/api/finance`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/goals` | Get all financial goals | Yes |
| POST | `/goals` | Create new goal | Yes |
| PUT | `/goals/:id` | Update goal | Yes |
| DELETE | `/goals/:id` | Delete goal | Yes |
| GET | `/budget` | Get budget | Yes |
| PUT | `/budget` | Update budget | Yes |

## API Request Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Add Financial Goal
```bash
POST /api/finance/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Emergency Fund",
  "targetAmount": 10000,
  "currentAmount": 2000,
  "deadline": "2025-12-31"
}
```

### Update Budget
```bash
PUT /api/finance/budget
Authorization: Bearer <token>
Content-Type: application/json

{
  "monthlyIncome": 5000,
  "categories": [
    {
      "name": "Housing",
      "allocatedAmount": 1500,
      "spentAmount": 1200
    },
    {
      "name": "Food",
      "allocatedAmount": 500,
      "spentAmount": 350
    }
  ]
}
```

## Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  financialGoals: [{
    title: String,
    targetAmount: Number,
    currentAmount: Number,
    deadline: Date
  }],
  budget: {
    monthlyIncome: Number,
    categories: [{
      name: String,
      allocatedAmount: Number,
      spentAmount: Number
    }]
  },
  timestamps: true
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation
- CORS enabled

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/fingenie |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| NODE_ENV | Environment mode | development |

## MongoDB Setup

### Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/fingenie`

### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Development

### Project Structure
```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js  # Auth logic
│   └── financeController.js # Finance logic
├── middleware/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Error handling
├── models/
│   └── User.js            # User schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── financeRoutes.js   # Finance endpoints
├── utils/
│   └── generateToken.js   # JWT generation
├── .env.example           # Environment template
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## License

ISC
