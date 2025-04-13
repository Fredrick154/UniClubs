import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaDownload } from "react-icons/fa";
import "../styles/ViewReports.css";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [membershipStats, setMembershipStats] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, membersRes, eventsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/reports"),
          axios.get("/api/reports/membership-stats"),
          axios.get("/api/reports/event-stats")
        ]);
        
        setReports(reportsRes.data);
        setMembershipStats(membersRes.data);
        setEventStats(eventsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="view-reports-container">
      <h1 className="page-title">📊 Club Analytics & Reports</h1>

      {/* Membership Statistics Section */}
      <section className="analytics-section">
        <h2>📌 Membership Statistics</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={membershipStats} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="club_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active_members" fill="#4CAF50" name="Active Members" />
              <Bar dataKey="pending_members" fill="#FFC107" name="Pending Members" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Event Participation Section */}
      <section className="analytics-section">
        <h2>🎟 Event Participation</h2>
        <div className="event-stats-table">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Attendees</th>
              </tr>
            </thead>
            <tbody>
              {eventStats.length > 0 ? (
                eventStats.map(event => (
                  <tr key={event.event_name}>
                    <td>{event.event_name}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.location}</td>
                    <td>{event.attendees}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No event data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reports List Section */}
      <section className="reports-list-section">
        <h2>📂 Generated Reports</h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>
                    <button className="download-btn">
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="no-data">No reports available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ViewReports;
