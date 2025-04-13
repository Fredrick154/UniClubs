const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        admissionNo: formData.admissionNo,
        password: formData.password
      });
  
      if (response.data.message) {
        navigate('/login', { 
          state: { 
            successMessage: response.data.message 
          }
        });
      }
      
    } catch (err) {
      setErrors({
        server: err.response?.data?.error || 'Registration failed. Please try again.'
      });
      console.error('Registration error:', err.response?.data);
    }
  };