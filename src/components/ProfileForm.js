import { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileForm({ user }) {
  const [profile, setProfile] = useState({
    first_name: '',
    email: '',
    registration_no: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name,
        email: user.email,
        registration_no: user.registration_no
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // In a real app, you would send this to the backend to update
      // For now, we'll simulate the update
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="profile-form-container">
      <h2>My Profile</h2>
      
      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Profile updated successfully!
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={profile.first_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="registration_no">Registration Number</label>
          <input
            type="text"
            id="registration_no"
            name="registration_no"
            value={profile.registration_no}
            onChange={handleChange}
            disabled
          />
        </div>
        
        <button type="submit" className="update-button">
          Update Profile
        </button>
      </form>

      <style jsx>{`
        .profile-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 25px;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        input:disabled {
          background-color: #f5f5f5;
          color: #666;
        }
        .update-button {
          background-color: #2196F3;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }
        .update-button:hover {
          background-color: #0b7dda;
        }
        .error-message {
          color: #d32f2f;
          background-color: #fde0e0;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .success-message {
          color: #388e3c;
          background-color: #e8f5e9;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default ProfileForm;