// src/routes/health.routes.js
// src/routes/health.routes.js

const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/health.controller');

// GET /api/health
router.get('/', checkHealth);

module.exports = router;