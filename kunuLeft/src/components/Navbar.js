import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <nav className="main-navbar animate-fade-in">
      <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        KUNU<span>LINK</span>
      </div>
      <div className="nav-links">
        
        {/* 1. Home Page */}
        {currentPath === '/' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn nav-primary" onClick={() => navigate('/register')}>Register</button>
          </>
        )}

        {/* 2. Login Page */}
        {currentPath === '/login' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/register')}>Register</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 3. Register Page */}
        {currentPath === '/register' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 4. User Dashboard / Map Page */}
        {currentPath === '/request' && isLoggedIn && userRole === 'user' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/activity')}>Activity</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 5. Activity Page (යාවත්කාලීන කරන ලදී) */}
        {currentPath === '/activity' && isLoggedIn && userRole === 'user' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/request')}>Dashboard</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 6. Admin Dashboard */}
        {currentPath === '/admin' && isLoggedIn && userRole === 'admin' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/admin/users')}>Users Details</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 7. Admin Users Page */}
        {currentPath === '/admin/users' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/admin')}>Back to View</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;