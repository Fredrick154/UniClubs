import React, { useEffect, useState } from 'react';

const ClubDashboard = ({ clubId }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch club-specific data
    const fetchData = async () => {
      const res = await fetch(`/api/clubs/${clubId}/announcements`);
      const data = await res.json();
      setAnnouncements(data);
    };
    fetchData();
  }, [clubId]);

  return (
    <div className="club-dashboard">
      <h2>Announcements</h2>
      {announcements.map(announcement => (
        <div key={announcement.id} className="announcement-card">
          {announcement.content}
        </div>
      ))}
    </div>
  );
};