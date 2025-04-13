import React, { useState, useEffect } from "react";
import axios from "axios";

const AvailableClubs = () => {
  const [clubs, setClubs] = useState([]);

  const fetchClubs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clubs", {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      console.log("Clubs response:", response.data); // Optional debug
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs", error);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleJoinClub = async (clubId) => {
    const studentId = 1; // TODO: Replace with real student ID from auth context or localStorage

    try {
      await axios.post("http://localhost:5000/api/memberships", { studentId, clubId });
      alert("✅ You have successfully joined the club!");
      // Optional: refresh clubs or trigger membership status
    } catch (err) {
      console.error("Error joining the club:", err);
      alert("❌ Error joining the club: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="available-clubs-container">
      <h3>Available Clubs</h3>
      <ul>
        {clubs.length > 0 ? (
          clubs.map((club) => (
            <li key={club.id} className="club-item">
              <h4>{club.name}</h4>
              <p>{club.description}</p>
              <button onClick={() => handleJoinClub(club.id)}>Join Club</button>
            </li>
          ))
        ) : (
          <p>No clubs available at the moment.</p>
        )}
      </ul>
    </div>
  );
};

export default AvailableClubs;
