import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="kunulink-navbar">
      <div className="nav-wrapper">
        <Link to="/" className="nav-brand">KUNU<span>LINK</span></Link>
        <div className="nav-links">
          {!isLoggedIn ? (
            <>
              <Link to="/" className="nav-item">About</Link>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="nav-reg-btn">Register</Link>
            </>
          ) : (
            <div className="nav-user-actions">
              <Link to="/dashboard" className="nav-icon-link">📊 Activity</Link>
              <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;