// Create a new LandingPage.js
const LandingPage = () => (
    <div className="landing">
      <h1>Welcome to Zetech Clubs</h1>
      <div className="cta-buttons">
        <Link to="/signup" className="cta-primary">Get Started</Link>
        <Link to="/login" className="cta-secondary">Existing User? Login</Link>
      </div>
    </div>
  );