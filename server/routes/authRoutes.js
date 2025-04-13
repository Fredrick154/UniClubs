const express = require('express');
const bcrypt = require('bcrypt');
//const pool = require('../db');

module.exports = (pool) => {
  const router = express.Router();

  // ✅ Signup Route
  router.post('/signup', async (req, res) => {
    console.log('📨 Signup request received:', req.body);
    try {
      const first_name = req.body.name;
const email = req.body.email;
const registration_no = req.body.admissionNo;
const password = req.body.password;
const role = req.body.role;

      // Validate admission number
      if (!/^[A-Za-z0-9-/]{8,20}$/.test(registration_no)) {
        return res.status(400).json({ error: 'Invalid admission number format' });
      }

      const [existing] = await pool.query(
        `SELECT * FROM users WHERE email = ? OR registration_no = ?`,
        [email, registration_no]
      );

      if (existing.length > 0) {
        const error = existing.some(u => u.email === email)
          ? 'Email already registered'
          : 'Admission number already exists';
        return res.status(400).json({ error });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `INSERT INTO users (first_name, email, registration_no, password, role)
         VALUES (?, ?, ?, ?, ?)`,
        [first_name, email, registration_no, hashedPassword]
      );

      res.status(201).json({ message: 'Registration successful' });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  });

  // ✅ Login Route
  router.post('/login', async (req, res) => {
    console.log('🔐 Login attempt:', req.body.registration_no);
    try {
      const { registration_no, password } = req.body;
  
      const [results] = await pool.query('SELECT * FROM users WHERE registration_no = ?', [registration_no]);
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid registration_no or password' });
      }
  
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid registration_no or password' });
      }
  
      // Optionally generate token here if you're using JWT (for now we'll just return user role)
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          full_name: user.full_name,
          registration_no: user.registration_no,
          email: user.email,
          role: user.role
        }
      });
  
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  });  

  return router;
};
