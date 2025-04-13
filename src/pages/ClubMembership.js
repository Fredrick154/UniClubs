import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ClubMembership = () => {
  const { clubId } = useParams(); // Get the clubId from the URL parameter
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the members of the club based on the clubId
    axios
      .get(`http://localhost:5000/api/clubs/${clubId}/members`)
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching club members:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clubId]);

  return (
    <div className="club-membership-container">
      <h2>Club Membership</h2>
      {loading ? (
        <p>Loading members...</p>
      ) : members.length > 0 ? (
        <ul>
          {members.map((member) => (
            <li key={member.id}>{member.name}</li> // Assuming member has an `id` and `name` field
          ))}
        </ul>
      ) : (
        <p>No members found for this club.</p>
      )}
    </div>
  );
};

export default ClubMembership;
