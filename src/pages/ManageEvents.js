import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageEvents.css"; // Importing the CSS

const ManageEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events data
    axios
      .get("http://localhost:5000/api/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events", error);
      });
  }, []);

  return (
    <div className="manage-events-container">
      <h2 className="page-title">Manage Events</h2>
      <table className="events-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="remove-btn">Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">
                No events available to manage.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEvents;
