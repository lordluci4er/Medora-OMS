// src/config/firebase.js
const admin = require('firebase-admin');
require('dotenv').config();

// Service Account file ko safely require karein with error handling
let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
} catch (error) {
  console.error('❌ FATAL ERROR: firebase-service-account.json file is missing in src/config/');
  process.exit(1);
}

// Firebase Admin SDK ko initialize karein (Singleton Pattern check ke sath)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.cert(serviceAccount),
    });
    console.log('🔥 Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    process.exit(1);
  }
}

module.exports = admin;