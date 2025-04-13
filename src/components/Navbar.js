import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-links">
        {user.role === 'admin' ? (
          <Link to="/admin">Admin Dashboard</Link>
        ) : (
          <Link to="/clubs">Clubs</Link>
        )}
        <Link to="/profile">Profile</Link>
      </div>
      <div className="user-info">
        <span>Welcome, {user.first_name}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;