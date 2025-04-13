const express = require('express');

module.exports = function(pool) {
  const router = express.Router();

  // Get all clubs
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM clubs");
      res.json(rows);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      res.status(500).json({ error: "Error fetching clubs" });
    }
  });

  // Get a single club by ID
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM clubs WHERE id = ?", [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Club not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error("Error fetching club by ID:", err);
      res.status(500).json({ message: "Error fetching club" });
    }
  });

  // Create a new club
  router.post('/', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Missing club name or description' });
    }
  
    try {
      const [result] = await pool.query(
        'INSERT INTO clubs (name, description, status) VALUES (?, ?, ?)',
        [name, description, 'pending']
      );
      res.status(201).json({ id: result.insertId, name, description, status: 'pending' });
    } catch (error) {
      console.error('Error inserting club:', error);
      res.status(500).json({ error: 'Failed to create club' });
    }
  });

  // Update club 
router.patch('/:id', async (req, res) => {
  const { status, name, description } = req.body;

  try {
    // Build dynamic SQL query
    const fields = [];
    const values = [];

    if (status) {
      fields.push('status = ?');
      values.push(status);
    }
    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (description) {
      fields.push('description = ?');
      values.push(description);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided to update.' });
    }

    values.push(req.params.id); 

    const query = `UPDATE clubs SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    res.json({ message: 'Club updated successfully.' });
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ message: 'Error updating club.' });
  }
});


   

  return router;
};
