import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';

function ClubDetails({ clubId, user }) {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/clubs/${clubId}?userId=${user.id}`
        );
        setClub(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch club details');
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId, user.id]);

  const handleJoinClub = async () => {
    try {
      await axios.post(`http://localhost:5000/api/clubs/${clubId}/join`, { 
        userId: user.id 
      });
      setJoinSuccess(true);
      // Refresh club data to update membership status
      const response = await axios.get(
        `http://localhost:5000/api/clubs/${clubId}?userId=${user.id}`
      );
      setClub(response.data);
      setTimeout(() => setJoinSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join club');
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/register`, { 
        userId: user.id 
      });
      // Refresh club data to update event registration status
      const response = await axios.get(
        `http://localhost:5000/api/clubs/${clubId}?userId=${user.id}`
      );
      setClub(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register for event');
    }
  };

  if (loading) return <div className="loading">Loading club details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!club) return <div>Club not found</div>;

  return (
    <div className="club-details">
      <div className="club-header">
        <h2>{club.name}</h2>
        <p className="club-description">{club.description}</p>
        <div className="club-meta">
          <span>Members: {club.memberCount}</span>
        </div>

        {!club.isMember && (
          <button 
            onClick={handleJoinClub} 
            className="join-button"
            disabled={joinSuccess}
          >
            {joinSuccess ? 'Joined!' : 'Join Club'}
          </button>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Information
        </button>
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="club-info">
            <h3>About {club.name}</h3>
            <p>{club.description}</p>
            
            <h3>Meeting Schedule</h3>
            <p>Every Wednesday at 4:00 PM in the Student Center</p>
            
            <h3>Contact Information</h3>
            <p>Email: {club.name.replace(/\s+/g, '').toLowerCase()}@school.edu</p>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="club-events">
            <h3>Upcoming Events</h3>
            {club.events && club.events.length > 0 ? (
              <div className="events-list">
                {club.events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={() => handleRegisterEvent(event.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="no-events">No upcoming events scheduled</p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .club-details {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .club-header {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .club-description {
          color: #555;
          margin-bottom: 15px;
        }
        .club-meta {
          margin: 10px 0;
          font-size: 0.9em;
          color: #666;
        }
        .join-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1em;
        }
        .join-button:disabled {
          background-color: #cccccc;
        }
        .tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1em;
          border-bottom: 3px solid transparent;
        }
        .tab.active {
          border-bottom: 3px solid #4CAF50;
          font-weight: bold;
        }
        .tab-content {
          padding: 10px 0;
        }
        .events-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .no-events {
          color: #666;
          font-style: italic;
        }
        .loading, .error {
          text-align: center;
          padding: 20px;
          font-size: 1.2em;
        }
        .error {
          color: #d32f2f;
        }
      `}</style>
    </div>
  );
}

export default ClubDetails;