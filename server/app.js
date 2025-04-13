const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'UniClubs!2025',
  database: 'club-project',
});

// Route Imports
const authRoutes = require('./routes/auth');
const membershipRoutes = require('./routes/memberships');
const eventRoutes = require('./routes/events');
const discussionRoutes = require('./routes/discussions');
const userRoutes = require('./routes/users');

// Route Usage
app.use('/api/auth', authRoutes(pool));        // 👈 NEW: Signup/Login
app.use('/api/memberships', membershipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
