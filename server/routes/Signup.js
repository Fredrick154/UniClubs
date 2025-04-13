const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const router = express.Router();
const db = require("../db"); // Your DB connection
const validateSignup = require('../middleware/validateSignUp');

router.post("/signup", validateSignup, async (req, res) => {
  console.log("📩 Received signup:", req.body); // Add this

  const { first_name, registration_no, email, password } = req.body;

  if (!first_name || !registration_no || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (first_name, registration_no, email, password, role)
                 VALUES (?, ?, ?, ?, 'student')`;

    db.query(sql, [first_name, registration_no, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("❌ MySQL Error:", err);
        return res.status(500).json({ message: "Registration failed", error: err.message });
      }

      console.log("✅ New student registered:", result.insertId);
      res.status(200).json({ message: "Registration successful" });
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
