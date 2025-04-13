import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageClubs.css"; // Ensure you have styles

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [newClub, setNewClub] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clubs"); // This is correct

      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const handleCreateClub = async () => {
    if (!newClub.name.trim() || !newClub.description.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/clubs', newClub);
      setClubs([...clubs, response.data]);
      setNewClub({ name: '', description: '' });
      setMessage("Club created successfully! 🎉");
    } catch (error) {
      setMessage("Error creating club. Try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleStatusUpdate = async (clubId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/clubs/${clubId}`, { status: newStatus });
      setClubs(clubs.map(club => 
        club.id === clubId ? { ...club, status: newStatus } : club
      ));
      setMessage(`Club status updated to "${newStatus}" ✅`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="manage-clubs-container">
      <h2 className="page-title">📌 Manage Clubs</h2>

      {/* Success Message */}
      {message && <p className="success-message">{message}</p>}

      {/* Club Creation Form */}
      <div className="creation-section">
        <h3>Create a New Club</h3>
        <div className="create-club-form">
          <input
            type="text"
            placeholder="Club Name"
            value={newClub.name}
            onChange={(e) => setNewClub({...newClub, name: e.target.value})}
          />
          <textarea
            placeholder="Description"
            value={newClub.description}
            onChange={(e) => setNewClub({...newClub, description: e.target.value})}
          />
          <button 
            onClick={handleCreateClub}
            disabled={loading || !newClub.name.trim()}
            className={loading ? "disabled-btn" : ""}
          >
            {loading ? 'Creating...' : '🚀 Create Club'}
          </button>
        </div>
      </div>

      {/* Clubs Management Table */}
      <div className="management-section">
        <h3>📋 Existing Clubs</h3>
        <table className="clubs-table">
          <thead>
            <tr>
              <th>Club Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.length > 0 ? (
              clubs.map((club) => (
                <tr key={club.id}>
                  <td>{club.name}</td>
                  <td>{club.description}</td>
                  <td className={`status-cell ${club.status}`}>
                    {club.status}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="approve-btn"
                      onClick={() => handleStatusUpdate(club.id, 'approved')}
                      disabled={club.status === 'approved'}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(club.id, 'rejected')}
                      disabled={club.status === 'rejected'}
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  🚫 No clubs available to manage.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClubs;
