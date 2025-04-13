import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import ClubCard from "../components/ClubCard"; 
import ClubActivity from "../components/ClubActivity"; // Make sure path is correct
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const [allClubs, setAllClubs] = useState([]); 
  const [myClubs, setMyClubs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")); 
  const userId = user?.userId || user?.id || user?.studentId;

  // Fetch all clubs + membership data
  const fetchData = async () => {
    if (!userId) return;

    try {
      setError(null);

      const [allClubsRes, myClubsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/clubs?nocache=${Date.now()}`),
        axios.get(`http://localhost:5000/api/memberships/${userId}`)
      ]);

      const clubsWithMembership = allClubsRes.data.map(club => ({
        ...club,
        isMember: myClubsRes.data.some(m => m.club_id === club.id)
      }));

      setAllClubs(clubsWithMembership);
      setMyClubs(clubsWithMembership.filter(club => club.isMember));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load clubs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(true);
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const pageReloadInterval = setInterval(() => {
      window.location.reload();
    }, 1800000);

    return () => clearInterval(pageReloadInterval);
  }, []);

  const handleManualRefresh = () => {
    window.location.reload(); 
  };

  const handleMembershipChange = async (clubId, action) => {
    if (!userId) return;
  
    if (action === 'join') {
      try {
        await axios.post(`http://localhost:5000/api/memberships/${userId}/join/${clubId}`);
        setError(null);
        fetchData(); 
      } catch (error) {
        if (error.response?.status === 409) {
          console.warn("User already a member, ignoring.");
          setError("You are already a member of this club.");
        } else {
          console.error("Failed to join club", error);
          setError("Failed to join club. Please try again.");
        }
      }
    } else {
      try {
        await axios.delete(`http://localhost:5000/api/memberships/${userId}/leave/${clubId}`);
        fetchData(); 
      } catch (error) {
        console.error("Failed to leave club", error);
        setError("Failed to leave club. Please try again.");
      }
    }
  };

  const handleViewActivity = (clubId) => {
    setSelectedClubId(clubId);
    setShowActivityModal(true);
  };

  const handleCloseModal = () => {
    setShowActivityModal(false);
    setSelectedClubId(null);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="student-info-header">
          <h1>Welcome, {user?.first_name || "Student"}</h1>
          <div className="student-details">
            <p>Email: {user?.email}</p>
            <p>Admission No: {user?.registration_no}</p>
          </div>
        </div>
        <h2>ZETECH UNIVERSITY CLUBS & SOCIETIES</h2>
        <p>Explore and join clubs to enhance your university experience!</p>
      </header>

      {/* My Clubs Section */}
      <section className="my-clubs-section">
        <h2>My Joined Clubs</h2>
        {loading ? (
          <div className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : myClubs.length > 0 ? (
          <div className="clubs-grid">
            {myClubs.map(club => (
              <div key={club.id}>
                <ClubCard 
                  club={club} 
                  isMember={true}
                  onMembershipChange={handleMembershipChange}
                />
                <button 
                  onClick={() => handleViewActivity(club.id)} 
                  style={{
                    backgroundColor: '#2ecc71',
                    color: '#fff',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    border: 'none',
                    borderRadius: '5px'
                  }}
                >
                  View Club Activities
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't joined any clubs yet.</p>
        )}
      </section>

      {/* All Clubs Section */}
      <section className="all-clubs-section">
        <h2>Available Clubs ({allClubs.length})</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="loading-skeleton">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        ) : allClubs.length > 0 ? (
          <div className="clubs-grid">
            {allClubs.map(club => (
              <ClubCard 
                key={club.id} 
                club={club} 
                isMember={club.isMember}
                onMembershipChange={handleMembershipChange}
              />
            ))}
          </div>
        ) : (
          <p>No clubs available.</p>
        )}
      </section>

      {/* Manual Refresh Button */}
      <div className="refresh-button-container">
        <button
          className="refresh-button"
          onClick={handleManualRefresh}
          style={{
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '16px',
            borderRadius: '5px'
          }}
        >
          Refresh Page
        </button>
      </div>

      {/* Club Activity Modal */}
      {showActivityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={handleCloseModal} className="modal-close-btn">Close</button>
            <ClubActivity clubId={selectedClubId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
