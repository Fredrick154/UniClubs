// src/components/DiscussionBoard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscussionBoard = ({ clubId }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = async () => {
    const res = await axios.get(`/api/discussions/club/${clubId}/posts`);
    setPosts(res.data);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/discussions/posts', { clubId, content: newPost });
    setNewPost('');
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [clubId]);

  return (
    <div className="discussion-board">
      <form onSubmit={handlePostSubmit} className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Start a discussion..."
        />
        <button type="submit">Post</button>
      </form>

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h4>{post.username}</h4>
              <span>{new Date(post.created_at).toLocaleString()}</span>
            </div>
            <p className="post-content">{post.content}</p>
            <CommentsSection postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
};