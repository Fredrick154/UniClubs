const express = require('express');
const router = express.Router(); // Initialize the router here
const { auth, memberCheck } = require('../middleware/auth'); // Import your middleware
const clubController = require('../controllers/clubController'); // Import your controller

// Define your routes
router.get('/:clubId/announcements', auth, memberCheck, (req, res) => {
  // Your logic for the announcements route
  res.send('Announcements for the club');
});

module.exports = router; // Export the router to use in other parts of the app
