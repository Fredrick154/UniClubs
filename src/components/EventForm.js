import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ clubId }) => {
  const [event, setEvent] = useState({
    name: '',
    description: '',
    date: '',
    location: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/events', {
        clubId: clubId,
        ...event
      });
      setEvent({ name: '', description: '', date: '', location: '' });
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  return (
    <div className="event-form">
      <h3>Create New Event</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          value={event.name}
          onChange={(e) => setEvent({...event, name: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={event.description}
          onChange={(e) => setEvent({...event, description: e.target.value})}
          required
        />
        <input
          type="datetime-local"
          value={event.date}
          onChange={(e) => setEvent({...event, date: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={event.location}
          onChange={(e) => setEvent({...event, location: e.target.value})}
          required
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};