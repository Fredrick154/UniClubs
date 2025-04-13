
// ClubList.js
import React, { useState } from "react";
import Modal from "./Modal"; 
import ClubActivity from "../components/ClubActivity"; 

const ClubList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubId, setClubId] = useState(null); 

  // Open modal with the given club ID
  const openModal = (id) => {
    setClubId(id); 
    setIsModalOpen(true); 
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false); 
  };

  return (
    <div>
      <button onClick={() => openModal(1)}>View Club Activity</button> 
      
      {/* Modal for Club Activity */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {clubId && <ClubActivity clubId={clubId} />} 
      </Modal>
    </div>
  );
};

export default ClubList;
