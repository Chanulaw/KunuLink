
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaMapMarkerAlt, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
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
    <nav className="navbar">

      <div className="logo">
        <Link to="/">
          <h2>KUNU<span>LINK</span></h2>
        </Link>
      </div>

      <div className="right-section">

        <ul className="nav-links">
          {isLoggedIn && userRole === 'user' && (
            <>
              <li>
                <Link to="/request">
                  <FaPlusCircle className="icon" />
                  New Request
                </Link>
              </li>
              <li>
                <Link to="/tracking">
                  <FaMapMarkerAlt className="icon" />
                  Tracking
                </Link>
              </li>
            </>
          )}

          {isLoggedIn && userRole === 'admin' && (
            <li>
              <Link to="/admin" className="admin">
                <FaUserShield className="icon" />
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>

        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className="icon" />
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;