const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, admissionNo, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      `INSERT INTO users 
       (name, email, admission_no, password) 
       VALUES (?, ?, ?, ?)`,
      [name, email, admissionNo, hashedPassword]
    );
    
    return result;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }
}

module.exports = User;