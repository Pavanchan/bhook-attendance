// backend/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { "username": "...", "password": "..." }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return res
      .status(500)
      .json({ message: 'Admin credentials not configured on server' });
  }

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { username, role: 'manager' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({ token });
});

module.exports = router;
