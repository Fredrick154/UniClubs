// src/components/CommentsSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    const res = await axios.get(`/api/discussions/posts/${postId}/comments`);
    setComments(res.data);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/discussions/comments', { postId, content: newComment });
    setNewComment('');
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="comments-section">
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Comment</button>
      </form>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <span className="comment-author">{comment.username}</span>
              <span className="comment-time">
                {new Date(comment.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};