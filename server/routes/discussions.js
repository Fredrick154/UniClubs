// backend/routes/discussions.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Get all posts for a club
router.get('/club/:clubId/posts', async (req, res) => {
  try {
    const [posts] = await Post.getByClub(req.params.clubId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new post
router.post('/posts', auth, async (req, res) => {
  try {
    await Post.create(req.body.clubId, req.user.id, req.body.content);
    res.status(201).json({ message: 'Post created' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const [comments] = await Comment.getByPost(req.params.postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Add comment
router.post('/comments', auth, async (req, res) => {
  try {
    await Comment.create(req.body.postId, req.user.id, req.body.content);
    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});