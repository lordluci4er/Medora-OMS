// src/controllers/auth.controller.js
const admin = require('../config/firebase');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // 1. Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 2. Check if user exists in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email,
        name,
        firebaseUid: uid,
        profilePicture: picture,
      });
    }

    // 3. Generate our own JWT for session management
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};