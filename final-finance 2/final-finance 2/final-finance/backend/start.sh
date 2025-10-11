#!/bin/bash
export MONGODB_URI=mongodb://localhost:27017/fingenie
export JWT_SECRET=your_secure_jwt_secret_key_here
export PORT=5000
export NODE_ENV=development
node server.js
