// src/controller/health.controller.js
// src/controllers/health.controller.js

exports.checkHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Medora OMS Backend is up and running smoothly! 🚀',
    timestamp: new Date().toISOString(),
  });
};