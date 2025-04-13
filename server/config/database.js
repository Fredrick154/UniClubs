const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool;

pool.getConnection((err, connection) => {
  if(err) console.error("DB Connection Error:", err);
  else console.log("Successfully connected to DB");
  connection.release();
});

