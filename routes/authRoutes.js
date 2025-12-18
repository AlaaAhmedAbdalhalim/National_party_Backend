const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // connection mysql

const router = express.Router();

router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    console.log('Login body:', req.body);

    if (!Email || !Password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    // جلب المستخدم من DB
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE Email = ?',
      [Email]
    );

    console.log('DB rows:', rows);

    if (rows.length === 0) {
      console.log(`Login failed: Email not found -> ${Email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    if (!user.Password) {
      console.log('Password is null in DB for this user');
      return res.status(500).json({ message: 'Password not set for this user' });
    }

    let isMatch = false;

    // لو Password مخزن hashed
    if (user.Password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(Password, user.Password);
    } else {
      // Password plain text لتجربة سريعة
      isMatch = Password === user.Password;
    }

    if (!isMatch) {
      console.log(`Login failed: Wrong password for ${Email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      console.log('JWT_SECRET not defined in env');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login success',
      token,
      user: {
        id: user.id,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = router;
