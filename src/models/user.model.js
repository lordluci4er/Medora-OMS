// src/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  firebaseUid: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  // Future email login ke liye password field (optional for now)
  password: { type: String, select: false } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);