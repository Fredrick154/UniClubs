const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Membership Statistics
router.get('/membership-stats', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        c.name AS club_name,
        COUNT(cm.user_id) AS total_members,
        SUM(cm.status = 'approved') AS active_members,
        SUM(cm.status = 'pending') AS pending_members
      FROM clubs c
      LEFT JOIN club_memberships cm ON c.id = cm.club_id
      GROUP BY c.id
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Event Participation
router.get('/event-stats', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        e.name AS event_name,
        COUNT(a.user_id) AS attendees,
        e.date,
        e.location
      FROM events e
      LEFT JOIN event_attendance a ON e.id = a.event_id
      GROUP BY e.id
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});