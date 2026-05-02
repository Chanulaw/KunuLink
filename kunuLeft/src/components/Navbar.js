import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Navbar() {
  const navigate = useNavigate();
  
  // ලොග් වී ඇත්දැයි පරීක්ෂා කිරීම
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear(); // සියලු දත්ත මකා දැමීම
    navigate('/login');   // නැවත Login වෙත යැවීම
  };

  return (
    <nav className="kunulink-navbar">
      <div className="nav-wrapper">
        {/* ලෝගෝ එක - ඕනෑම වෙලාවක මුල් පිටුවට යාමට */}
        <Link to="/" className="nav-brand">
          KUNU<span>LINK</span>
        </Link>

        <div className="nav-links">
          {!isLoggedIn ? (
            // ලොග් වී නැති විට පෙනෙන දේ
            <>
              <Link to="/" className="nav-link-item">About</Link>
              <Link to="/login" className="nav-link-item">Login</Link>
              <Link to="/register" className="nav-reg-btn">Register</Link>
            </>
          ) : (
            // ලොග් වී ඇති විට පෙනෙන දේ
            <div className="nav-user-actions">
              {/* සාමාන්‍ය User කෙනෙක් නම් පමණක් Dashboard සහ Activity පෙන්වන්න */}
              {userRole === 'user' && (
                <>
                  <Link to="/dashboard" className="nav-icon-link">🏠 Dashboard</Link>
                  <Link to="/tracking" className="nav-icon-link">📊 Activity</Link>
                </>
              )}
              
              {/* Admin කෙනෙක් නම් Admin පැනලය පෙන්වන්න */}
              {userRole === 'admin' && (
                <Link to="/admin" className="nav-icon-link">⚙️ Admin Panel</Link>
              )}

              <button className="nav-logout-btn" onClick={handleLogout}>
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