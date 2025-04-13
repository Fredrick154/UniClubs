import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ClubDetails = () => {
    const { clubId } = useParams();  // Assuming you're using React Router and the club ID is in the URL
    const [club, setClub] = useState(null);

    useEffect(() => {
        // Fetch club details using clubId
        axios.get(`http://localhost:5000/api/clubs/${clubId}`)
            .then(response => {
                setClub(response.data);
            })
            .catch(error => {
                console.error("Error fetching club details", error);
            });
    }, [clubId]);

    // Function to handle joining a club
    const handleJoinClub = async () => {
        const studentId = 1;  // Replace with actual student ID (e.g., from local storage or context)

        try {
            await axios.post("http://localhost:5000/api/memberships", { studentId, clubId });
            alert("You have successfully joined the club!");
        } catch (err) {
            alert("Error joining the club: " + err.response.data.message);
        }
    };

    if (!club) {
        return <p>Loading club details...</p>;
    }

    return (
        <div className="club-details-container">
            <h3>{club.name}</h3>
            <p>{club.description}</p>
            <button onClick={handleJoinClub}>Join Club</button>
        </div>
    );
};

export default ClubDetails;
