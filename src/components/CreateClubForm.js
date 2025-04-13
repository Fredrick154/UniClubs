import React, { useState } from 'react';
import axios from 'axios';

const CreateClubForm = ({ onClubCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/clubs', {
        name,
        description,
      });

      setMessage(`✅ Club "${response.data.name}" created successfully!`);
      setName('');
      setDescription('');

      // Optional: trigger callback to refresh club list
      if (onClubCreated) {
        onClubCreated();
      }

    } catch (error) {
      console.error('Error creating club:', error);
      setMessage('❌ Failed to create club.');
    }
  };

  return (
    <div>
      <h2>Create a New Club</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Club Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Club Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <button type="submit">Create Club</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateClubForm;
