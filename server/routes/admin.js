// routes/admin.js
const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');

router.get('/reports', auth, requireRole('admin'), (req, res) => {
  // Admin-only report data
});

router.patch('/memberships/:id', auth, requireRole('admin'), (req, res) => {
  // Handle membership approvals
});