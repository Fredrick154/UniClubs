const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const [rows] = await pool.query(`
        SELECT c.id, c.name, c.description 
        FROM clubs c
        JOIN club_members cm ON c.id = cm.club_id
        WHERE cm.user_id = ?
      `, [userId]);

      res.json(rows);
    } catch (err) {
      console.error("Error fetching user's clubs:", err);
      res.status(500).json({ error: "Server error fetching clubs" });
    }
  });

  router.get("/:clubId/activities", async (req, res) => {
    const { clubId } = req.params;
    try {
      const [activities] = await pool.query(
        "SELECT * FROM club_activities WHERE club_id = ? ORDER BY date DESC",
        [clubId]
      );
      res.json(activities);
    } catch (err) {
      console.error("Failed to fetch club activities:", err);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  return router;
};
