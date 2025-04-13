const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    await Event.create({
      club_id: req.body.clubId,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location
    });
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/club/:clubId', async (req, res) => {
  try {
    const [events] = await Event.getByClub(req.params.clubId);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});