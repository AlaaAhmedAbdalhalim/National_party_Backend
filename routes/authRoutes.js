const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

/**
 * POST /api/auth/login
 * Body:
 * {
 *   "email": "admin@test.com",
 *   "password": "123456"
 * }
 */
router.post('/login', async (req, res) => {
  try {
    console.log('LOGIN BODY =>', req.body);

    // ⬅️ نستقبل lowercase من الفرونت
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Get user from DB
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE Email = ?',
      [email]
    );

    if (rows.length === 0) {
      console.log('LOGIN FAIL: EMAIL NOT FOUND');
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = rows[0];

    if (!user.Password) {
      console.log('LOGIN FAIL: PASSWORD NULL');
      return res.status(500).json({
        message: 'Password not set for this user'
      });
    }

    let isMatch = false;

    // 🔐 لو الباسورد متخزن bcrypt
    if (user.Password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.Password);
    } else {
      // ⚠️ plain text (للتجربة فقط)
      isMatch = password === user.Password;
    }

    if (!isMatch) {
      console.log('LOGIN FAIL: WRONG PASSWORD');
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET NOT DEFINED');
      return res.status(500).json({
        message: 'Server configuration error'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.Role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Success
    res.status(200).json({
      message: 'Login success',
      token,
      user: {
        id: user.id,
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });

  } catch (error) {
    console.error('LOGIN SERVER ERROR:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.toString()
    });
  }
});

module.exports = router;
