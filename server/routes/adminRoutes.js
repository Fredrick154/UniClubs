const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise'); // Assuming you're using the same database pool
const router = express.Router();

// Assuming you already have the pool from server.js
const pool = require('../server').pool;

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log(req.body);  // This will log the incoming data

    // Destructure the incoming request body
    const { name, email, admissionNo, password } = req.body;

    // Validate admission number format (ensure it's alphanumeric and between 8 and 20 characters)
    if (!/^[A-Za-z0-9-/]{8,20}$/.test(admissionNo)) {
      return res.status(400).json({ error: 'Invalid admission number format' });
    }

    // Check if the email or admission number already exists in the database
    const [existing] = await pool.query(
      `SELECT * FROM users WHERE email = ? OR admission_no = ?`,
      [email, admissionNo]
    );

    if (existing.length > 0) {
      const error = existing.some(u => u.email === email)
        ? 'Email already registered'
        : 'Admission number already exists';
      return res.status(400).json({ error });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query(
      `INSERT INTO users (name, email, admission_no, password) VALUES (?, ?, ?, ?)`,
      [name, email, admissionNo, hashedPassword]
    );

    // Return a success message after successful registration
    res.status(201).json({ message: 'Registration successful' });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists in the database
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return success response
    res.json({ success: true, message: 'Login successful', user });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

module.exports = router;
