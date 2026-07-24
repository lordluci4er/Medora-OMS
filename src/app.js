// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// 1. Security & Core Middlewares
app.use(helmet()); // Secure HTTP headers set karta hai
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body parser with payload limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2. Request Logging Middleware (Development vs Production)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Production ke liye detailed logs
} else {
  app.use(morgan('dev')); // Development ke liye colorized short logs
}

// 3. API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Medora OMS API 🏥',
    version: '1.0.0',
  });
});

// 4. 404 Fallback Handler (Route Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.originalUrl}`,
  });
});

// 5. Global Error Handling Middleware (Sabhi errors ko yahan catch kiya jayega)
app.use((err, req, res, next) => {
  console.error('❌ Global Error Caught:', err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Development mode me stack trace show karega, production me nahi
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

module.exports = app;