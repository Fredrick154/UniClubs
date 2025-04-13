const db = require('../config/database');

// Check membership status (for feature 1 & 5)
exports.checkMembership = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT club_id, status 
      FROM club_memberships 
      WHERE user_id = ? AND status = 'approved'
    `, [req.user.id]);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Join club (for feature 3 & 5)
exports.joinClub = async (req, res) => {
  try {
    // Prevent duplicates
    const [existing] = await db.query(
      'SELECT * FROM club_memberships WHERE user_id = ? AND club_id = ?',
      [req.user.id, req.body.clubId]
    );
    
    if (existing.length > 0) return res.status(400).send('Already joined');

    await db.query(
      'INSERT INTO club_memberships (user_id, club_id) VALUES (?, ?)',
      [req.user.id, req.body.clubId]
    );

    // Send notification (feature 6)
    await db.query(
      'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
      [req.user.id, `Welcome to ${req.body.clubName}! Stay updated with activities.`]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
};