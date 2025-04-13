// middleware/auth.js

const jwt = require('jsonwebtoken');
const db = require('../db'); // Ensure this exists and exports a MySQL pool/connection

// Auth middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based middleware
const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: `Requires ${role} privileges` });
  }
  next();
};

// Admin check
const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Check if student is in a club
const checkClubMembership = async (req, res, next) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM club_memberships 
       WHERE user_id = ? AND club_id = ? AND status = 'approved'`,
      [req.user.id, req.params.clubId]
    );

    if (results.length === 0) {
      return res.status(403).json({ error: 'Access denied. Join club first' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Another version (optional)
const memberCheck = async (req, res, next) => {
  const [membership] = await db.execute(
    'SELECT * FROM club_memberships WHERE user_id = ? AND club_id = ? AND status = "approved"',
    [req.user.id, req.params.clubId]
  );

  if (membership.length === 0) {
    return res.status(403).json({ error: 'Club membership required' });
  }
  next();
};

module.exports = {
  auth,
  requireRole,
  adminCheck,
  checkClubMembership,
  memberCheck,
};
