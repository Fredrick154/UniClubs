import React from 'react';
import axios from 'axios';
import '../styles/ClubCard.css';

const ClubCard = ({ club, isMember, onMembershipChange }) => {
  // Log the club data to ensure it's passed correctly
  console.log("Rendering club:", club);

  const handleJoinLeave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;
  
      if (!userId) {
        alert('Please login to join clubs');
        return;
      }
  //Delete
  if (isMember) {
    await axios.delete(`http://localhost:5000/api/memberships/${userId}/leave/${club.id}`);
    onMembershipChange(club.id, 'leave');
  } else {
    await axios.post(`http://localhost:5000/api/memberships/${userId}/join/${club.id}`);
    onMembershipChange(club.id, 'join');
  }
  
      
    } catch (error) {
      console.error('Error updating membership:', error);
      alert(error.response?.data?.message || 'Failed to update membership');
    }
  };
  

  return (
    <div className="club-card">
      

      <div className="club-info">
        {/* Ensure club.name and club.description are present before rendering */}
        <h3>{club.name || 'Unnamed Club'}</h3>
        <p className="club-description">{club.description || 'No description available'}</p>
        <div className="club-meta">
          <span>Meets: {club.meeting_schedule || 'TBA'}</span>
        </div>
        <button
          onClick={handleJoinLeave}
          className={isMember ? 'leave-btn' : 'join-btn'}
        >
          {isMember ? 'Leave Club' : 'Join Club'}
        </button>
      </div>
    </div>
  );
};

export default ClubCard;
