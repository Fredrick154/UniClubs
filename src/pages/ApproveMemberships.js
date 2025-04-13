import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ApproveMemberships.css";
import { FaCheck, FaTimes } from "react-icons/fa";

const ApproveMemberships = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("/api/memberships/pending");
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Error fetching membership requests", error);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (membershipId, status) => {
    try {
      const response = await axios.patch(`/api/memberships/${membershipId}/status`, { status });
      
      if (status === 'approved') {
        // Send welcome email
        const { studentEmail, clubName } = response.data;
        await axios.post('/api/send-email', {
          email: studentEmail,
          type: 'membership-approved',
          clubName
        });
      }
      
      setPendingRequests(prev => prev.filter(req => req.id !== membershipId));
    } catch (error) {
      console.error("Error updating membership:", error);
    }
  };

  return (
    <div className="approve-memberships-container">
      <h2 className="page-title">Approve Membership Requests</h2>
      
      {pendingRequests.length === 0 ? (
        <div className="no-requests-message">
          🎉 No pending membership requests at the moment.
        </div>
      ) : (
        <div className="table-container">
          <table className="membership-requests-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Club Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.student_name}</td>
                  <td>{request.club_name}</td>
                  <td className="actions-cell">
                    <button 
                      className="approve-btn"
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    >
                      <FaTimes /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApproveMemberships;
