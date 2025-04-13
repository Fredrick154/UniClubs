import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ClubDashboard.css';
import DiscussionBoard from '../components/DiscussionBoard';

const ClubDashboard = () => {
  const { clubId } = useParams();
  const [clubData, setClubData] = useState({
    announcements: [],
    events: [],
    members: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcements, events, members] = await Promise.all([
          axios.get(`/api/clubs/${clubId}/announcements`),
          axios.get(`/api/clubs/${clubId}/events`),
          axios.get(`/api/clubs/${clubId}/members`)
        ]);
        
        setClubData({
          announcements: announcements.data,
          events: events.data,
          members: members.data
        });
      } catch (error) {
        console.error('Error fetching club data:', error);
      }
    };
    
    fetchData();
  }, [clubId]);

  return (
    <div className="club-dashboard">
      {/* Navigation Link */}
      <Link to={`/club-events/${clubId}`} className="view-events-link">
        View All Events
      </Link>

      {/* Announcements Section */}
      <section className="announcements">
        <h2>Announcements</h2>
        {clubData.announcements.map(ann => (
          <div key={ann.id} className="announcement-card">
            <h3>{ann.title}</h3>
            <p>{ann.content}</p>
            <small>{new Date(ann.date).toLocaleDateString()}</small>
          </div>
        ))}
      </section>

      {/* Upcoming Events Section */}
      <section className="upcoming-events">
        <h2>Upcoming Events</h2>
        {clubData.events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>{event.location} - {new Date(event.date).toLocaleString()}</p>
          </div>
        ))}
      </section>

      {/* Discussion Board Section */}
      <section className="discussion-section">
        <h2>Discussion Board</h2>
        <DiscussionBoard clubId={clubId} />
      </section>
    </div>
  );
};

export default ClubDashboard;