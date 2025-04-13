module.exports = (req, res, next) => {
    console.log('🔍 Validating signup data:', req.body);
    const { full_name, admission_number, password } = req.body;
    
    if (!full_name || !admission_number || !password) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 8) {
      console.error('❌ Weak password');
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    next();
  };