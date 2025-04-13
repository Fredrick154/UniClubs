// backend/models/Comment.js
const db = require('../config/database');

class Comment {
  static create(post_id, user_id, content) {
    return db.execute(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [post_id, user_id, content]
    );
  }

  static getByPost(post_id) {
    return db.execute(
      `SELECT comments.*, users.username 
       FROM comments 
       JOIN users ON comments.user_id = users.id
       WHERE post_id = ? 
       ORDER BY created_at ASC`,
      [post_id]
    );
  }
}