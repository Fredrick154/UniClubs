const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Signup Endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, admissionNo, password } = req.body;
    
    // Check if user exists
    const [existing] = await db.query(
      `SELECT * FROM users 
       WHERE email = ? OR admission_no = ?`,
      [email, admissionNo]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        error: 'Email or admission number already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      `INSERT INTO users 
       (name, email, admission_no, password) 
       VALUES (?, ?, ?, ?)`,
      [name, email, admissionNo, hashedPassword]
    );

    res.status(201).json({
      message: 'Registration successful',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, admissionNo, password } = req.body;

    // Find user
    const [users] = await db.query(
      `SELECT * FROM users 
       WHERE email = ? AND admission_no = ?`,
      [email, admissionNo]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user data without password
    const { password: _, ...userData } = user;

    res.json({
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;