// ClubActivity.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ClubActivity.css";

const ClubActivity = ({ clubId }) => { // Accept clubId as a prop
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/my-clubs/${clubId}/activities`);
        setActivities(res.data);
      } catch (err) {
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [clubId]); 

  return (
    <div className="club-activity-container">
      <h1>Club Activities</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div>
          <h2>Activities of Club {clubId}</h2>
          <ul>
            {activities.map(activity => (
              <li key={activity.id}>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClubActivity;
