const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db");

// SIGNUP
router.post("/signup", async (req, res) => {
  const { first_name, registration_no, email, password,role } = req.body;
  console.log(req.body);

  if (!first_name || !registration_no || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const sql = `
      INSERT INTO users (first_name, registration_no, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    // Using the promise-based query method
    const [result] = await db.query(sql, [first_name, registration_no, email, hashedPassword,role]);
  
    console.log("✅ User registered:", result.insertId);
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    console.log(result)
    res.status(500).json({ message: "Server error", error: error.message });
  }
});  

// LOGIN
router.post("/login", async (req, res) => {
  const { registration_no, password } = req.body;
  console.time("LoginProcess");

  if (!registration_no || !password) {
    console.timeEnd("LoginProcess");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    console.time("DB Query");
    const [results] = await db.query(`SELECT * FROM users WHERE registration_no = ?`, [registration_no]);
    console.timeEnd("DB Query");

    if (results.length === 0) {
      console.timeEnd("LoginProcess");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    console.time("Password Compare");
    const match = await bcrypt.compare(password, user.password);
    console.timeEnd("Password Compare");

    if (!match) {
      console.timeEnd("LoginProcess");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.timeEnd("LoginProcess");

    const { id, first_name, email, role } = user;
    return res.status(200).json({
      message: "Login successful",
      user: { id, first_name, email, registration_no, role },
    });
  } catch (err) {
    console.timeEnd("LoginProcess");
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
