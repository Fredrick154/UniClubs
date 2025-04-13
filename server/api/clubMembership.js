// routes/memberships.js
const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Join club
  router.post('/', async (req, res) => {
    const { studentId, clubId } = req.body;

    try {
      const [existing] = await pool.query(
        'SELECT * FROM memberships WHERE user_id = ? AND club_id = ?',
        [studentId, clubId]
      );

      if (existing.length > 0) {
        return res.status(409).json({ message: 'Already a member of this club.' });
      }

      await pool.query(
        'INSERT INTO memberships (user_id, club_id, status) VALUES (?, ?, ?)',
        [studentId, clubId, 'pending'] // default to pending
      );

      res.status(200).json({ message: 'Successfully joined the club!' });
    } catch (error) {
      console.error('Error joining club:', error);
      res.status(500).json({ message: 'Failed to join the club.' });
    }
  });

  // Leave club
  router.delete('/', async (req, res) => {
    const { studentId, clubId } = req.body;

    try {
      await pool.query(
        'DELETE FROM memberships WHERE user_id = ? AND club_id = ?',
        [studentId, clubId]
      );

      res.status(200).json({ message: 'Successfully left the club!' });
    } catch (error) {
      console.error('Error leaving club:', error);
      res.status(500).json({ message: 'Failed to leave the club.' });
    }
  });

  // Get all clubs a student has joined
  router.get('/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
      const [rows] = await pool.query(
        `SELECT c.* FROM clubs c 
         JOIN memberships m ON c.id = m.club_id 
         WHERE m.user_id = ? AND m.status = 'approved'`,
        [studentId]
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching joined clubs:', error);
      res.status(500).json({ message: 'Failed to fetch joined clubs.' });
    }
  });

  // Get all pending membership requests
  router.get('/admin/pending', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT memberships.id, users.full_name AS student_name, clubs.name AS club_name
        FROM memberships
        JOIN users ON memberships.user_id = users.id
        JOIN clubs ON memberships.club_id = clubs.id
        WHERE memberships.status = 'pending'
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch pending requests' });
    }
  });

  // Update status of a membership
  router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      await pool.query(
        'UPDATE memberships SET status = ? WHERE id = ?',
        [status, id]
      );

      const [[details]] = await pool.query(`
        SELECT users.email AS studentEmail, clubs.name AS clubName
        FROM memberships
        JOIN users ON memberships.user_id = users.id
        JOIN clubs ON memberships.club_id = clubs.id
        WHERE memberships.id = ?
      `, [id]);

      res.json(details); // For email
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update status' });
    }
  });

  return router;
};
