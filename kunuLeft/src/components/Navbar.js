import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole'); 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar-modern">
      <div className="nav-logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 className="logo-text">KUNU<span>LINK</span></h2>
        </Link>
      </div>

      <ul className="nav-links">
        {/* User ලොග් වී සිටින විට පමණක් පෙන්වන දේ */}
        {isLoggedIn && userRole === 'user' && (
          <>
            <li><Link to="/request" className="nav-item">New Request</Link></li>
            <li><Link to="/tracking" className="nav-item">Tracking</Link></li>
          </>
        )}

        {/* Admin ලොග් වී සිටින විට පෙන්වන දේ */}
        {isLoggedIn && userRole === 'admin' && (
          <li><Link to="/admin" className="nav-item admin-highlight">Admin Dashboard</Link></li>
        )}
      </ul>

      <div className="nav-actions">
        {isLoggedIn && (
          <button onClick={handleLogout} className="btn-premium logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;