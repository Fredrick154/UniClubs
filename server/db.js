const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'UniClubs!2025',
  database: process.env.DB_NAME || 'clubs_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Add connection logging
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  });

module.exports = pool;