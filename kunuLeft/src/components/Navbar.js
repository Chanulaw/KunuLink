import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // LocalStorage එකෙන් දත්ත ලබා ගැනීම
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  const path = location.pathname;

  const handleLogout = () => {
    localStorage.clear(); // සියලු දත්ත මකා දැමීම
    navigate('/'); // Logout වූ පසු කෙලින්ම About පිටුවට (/) යවයි
  };

  return (
    <nav className="kunulink-navbar">
      <div className="nav-wrapper">
        <Link to="/" className="nav-brand">
          KUNU<span>LINK</span>
        </Link>

        <div className="nav-links">
          
          {/* About, Login, Register පිටුවලදී පෙන්වන දේ */}
          {!isLoggedIn || path === '/' || path === '/login' || path === '/register' ? (
            <>
              <Link to="/" className="nav-link-item">Home</Link>
              <Link to="/login" className="nav-link-item">Login</Link>
              <Link to="/register" className="nav-reg-btn">Register</Link>
            </>
          ) : (
            <div className="nav-user-actions">
              
              {/* සාමාන්‍ය User කෙනෙක් නම් */}
              {userRole === 'user' && (
                <>
                  <Link to="/dashboard" className="nav-link-item">Dashboard</Link>
                  <Link to="/tracking" className="nav-icon-link">Activity</Link>
                </>
              )}
              
              {/* Admin කෙනෙක් නම් */}
              {userRole === 'admin' && (
                <Link to="/" className="nav-link-item">Home</Link>
              )}

              <button className="nav-logout-btn" onClick={handleLogout} style={{ marginLeft: '15px' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;