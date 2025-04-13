const db = require('../config/database');

class Event {
  static create({ club_id, name, description, date, location }) {
    return db.execute(
      `INSERT INTO events 
       (club_id, name, description, date, location)
       VALUES (?, ?, ?, ?, ?)`,
      [club_id, name, description, date, location]
    );
  }

  static getByClub(club_id) {
    return db.execute(
      `SELECT 
         id,
         name,
         description,
         date,
         location
       FROM events 
       WHERE club_id = ? 
       ORDER BY date DESC`,
      [club_id]
    );
  }
}

module.exports = Event;