import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    registration_no: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        registration_no: formData.admissionNo,
        password: formData.password
      });
      
      
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/clubs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>University Clubs Portal</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">School Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="yourname@school.edu"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="registration_no">Registration Number</label>
          <input
            type="text"
            id="registration_no"
            name="registration_no"
            value={formData.registration_no}
            onChange={handleChange}
            required
            placeholder="e.g. ST001 or AD001"
          />
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <style jsx>{`
        .login-form-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 30px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 25px;
        }
        .login-form {
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
        .login-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }
        .login-button:disabled {
          background-color: #a5d6a7;
          cursor: not-allowed;
        }
        .error-message {
          color: #d32f2f;
          background-color: #fde0e0;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default LoginForm;