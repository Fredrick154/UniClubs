import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EventForm from '../components/EventForm';
import '../styles/ClubEvents.css';

const ClubEvents = () => {
  const { clubId } = useParams();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/events/club/${clubId}`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [clubId]);

  return (
    <div className="club-events">
      <div className="header">
        <h2>Club Events</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Event'}
        </button>
      </div>

      {showForm && <EventForm clubId={clubId} />}

      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <div className="event-details">
              <p className="date">
                📅 {new Date(event.date).toLocaleDateString()} 
                🕒 {new Date(event.date).toLocaleTimeString()}
              </p>
              <p className="location">📍 {event.location}</p>
              <p className="description">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};