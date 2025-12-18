const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // connection mysql

const router = express.Router();

router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE Email = ?',
      [Email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.Role
      },
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
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
