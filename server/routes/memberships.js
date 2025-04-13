const express = require('express');

module.exports = function(pool) {
  const router = express.Router();

  // ✅ Health check
  router.get('/', (req, res) => {
    res.send('✅ Memberships endpoint working');
  });

  // ✅ Get user's memberships
  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const [rows] = await pool.query(
        'SELECT club_id FROM memberships WHERE user_id = ?',
        [userId]
      );
      res.json(rows);
    } catch (err) {
      console.error("❌ Error fetching memberships:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Join a club using params (used in frontend with /:userId/join/:clubId)
  router.post('/:userId/join/:clubId', async (req, res) => {
    const { userId, clubId } = req.params;
    try {
      await pool.query(
        'INSERT INTO memberships (user_id, club_id) VALUES (?, ?)',
        [userId, clubId]
      );
      res.status(201).json({ message: 'Successfully joined club' });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Already joined this club' });
      }
      console.error("❌ Join club error:", err);
      res.status(500).json({ error: 'Failed to join club' });
    }
  });

  // ✅ Join a club using body (general POST request for flexibility)
  router.post('/join', async (req, res) => {
    const { user_id, club_id } = req.body;
    try {
      await pool.query(
        "INSERT INTO memberships (user_id, club_id, role, joined_at) VALUES (?, ?, 'member', NOW())",
        [user_id, club_id]
      );
      res.status(201).json({ message: "Joined club successfully!" });
    } catch (err) {
      console.error("❌ Join club error:", err);
      res.status(500).json({ error: "Failed to join club" });
    }
  });

  // ✅ Leave a club
  router.delete('/:userId/leave/:clubId', async (req, res) => {
    const { userId, clubId } = req.params;
    try {
      await pool.query(
        'DELETE FROM memberships WHERE user_id = ? AND club_id = ?',
        [userId, clubId]
      );
      res.status(200).json({ message: 'Successfully left club' });
    } catch (err) {
      console.error("❌ Leave club error:", err);
      res.status(500).json({ error: 'Failed to leave club' });
    }
  });

  return router;
};
