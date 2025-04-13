import React, { useState, useEffect } from "react";
import axios from "axios";

const MyClubs = () => {
  const [myClubs, setMyClubs] = useState([]);

  const fetchMyClubs = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/clubmemberships/${userId}`);
      setMyClubs(res.data); // assuming res.data contains full club details (not just IDs)
    } catch (error) {
      console.error("Failed to fetch joined clubs:", error);
    }
  };

  useEffect(() => {
    fetchMyClubs();

    // ⏱ Periodic refresh every 10 seconds
    const interval = setInterval(() => {
      fetchMyClubs();
    }, 10000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  // ✅ Leave club handler
  const handleLeaveClub = async (clubId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    try {
      await axios.delete(`http://localhost:5000/api/memberships`, {
        data: { studentId: userId, clubId },
      });
      fetchMyClubs(); // refresh after leaving
    } catch (error) {
      console.error("Failed to leave club:", error);
      alert("Error leaving club.");
    }
  };

  return (
    <div className="my-clubs-container">
      <h3>My Clubs</h3>
      <button className="btn" onClick={fetchMyClubs}>Refresh Clubs</button>
      <ul>
        {myClubs.length > 0 ? (
          myClubs.map((club) => (
            <li key={club.id}>
              {club.name}
              <button
                onClick={() => handleLeaveClub(club.id)}
                style={{
                  marginLeft: "10px",
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Leave
              </button>
            </li>
          ))
        ) : (
          <p>No clubs joined yet. Join some clubs to get started!</p>
        )}
      </ul>
    </div>
  );
};

export default MyClubs;
