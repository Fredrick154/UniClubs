const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'UniClubs!2025',  
  database: 'clubs_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Make pool accessible to routes that need it
module.exports.pool = pool;

// Load routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth');

// For function-exporting routes, pass the pool
const clubRoutes = require('./routes/clubs')(pool);
const membershipRoutes = require('./routes/memberships')(pool);
const myClubsRoutes = require('./routes/myClubs')(pool);

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/my-clubs', myClubsRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
