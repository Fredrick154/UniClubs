// backend/models/Post.js
const db = require('../config/database');

class Post {
  static create(club_id, user_id, content) {
    return db.execute(
      'INSERT INTO posts (club_id, user_id, content) VALUES (?, ?, ?)',
      [club_id, user_id, content]
    );
  }

  static getByClub(club_id) {
    return db.execute(
      `SELECT posts.*, users.username 
       FROM posts 
       JOIN users ON posts.user_id = users.id
       WHERE club_id = ? 
       ORDER BY created_at DESC`,
      [club_id]
    );
  }
}