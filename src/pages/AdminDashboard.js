import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Import CSS file for styling

const AdminDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pending-approvals");
        setPendingApprovals(response.data);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
      }
    };

    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchPendingApprovals();
    fetchReports();
    setLoading(false);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>ADMIN DASHBOARD</h1>
        <p>Manage club memberships, reports, and more!</p>
      </header>

      {/* Dashboard Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Pending Approvals</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((item, index) => <li key={index}>{item.club_name}</li>)
              ) : (
                <p>No pending approvals.</p>
              )}
            </ul>
          )}
        </div>

        <div className="stat-card">
          <h2>Recent Reports</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {reports.length > 0 ? (
                reports.map((report, index) => <li key={index}>{report.report_title}</li>)
              ) : (
                <p>No reports available.</p>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Admin Actions Section */}
      <div className="action-buttons">
        <Link to="/admin/manage-clubs" className="action-btn manage-clubs-btn">
          Manage Clubs
        </Link>
        <Link to="/admin/manage-events" className="action-btn review-events-btn">
          Review Event Requests
        </Link>
        <Link to="/admin/view-reports" className="action-btn generate-reports-btn">
          Generate Reports
        </Link>
        <Link to="/admin/approve-memberships" className="action-btn manage-roles-btn">
          Manage User Roles
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
