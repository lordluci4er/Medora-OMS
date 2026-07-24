// src/server.js
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is not defined in .env file.');
  process.exit(1);
}

let server;

// Database Connection & Server Startup
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('📦 Connected to MongoDB successfully.');
    
    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });

// --- PRODUCTION BEST PRACTICES & GRACEFUL SHUTDOWN ---

const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);
  
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

// Render, Heroku ya Docker ke restart/stop signals handle karne ke liye
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Uncaught exceptions aur unhandled promises ko handle karne ke liye
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...', err.name, err.message);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...', err.name, err.message);
  process.exit(1);
});