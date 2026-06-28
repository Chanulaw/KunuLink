import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

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
            <button className="nav-btn nav-active" onClick={() => navigate('/')}>Home</button>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn nav-primary" onClick={() => navigate('/register')}>Register</button>
          </>
        )}

        {/* 2 & 3. Login / Register Pages */}
        {(currentPath === '/login' || currentPath === '/register') && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/')}>Home</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 4 & 5. User Dashboard / Activity / Notifications */}
        {(currentPath === '/request' || currentPath === '/activity' || currentPath === '/notifications') && isLoggedIn && userRole === 'user' && (
          <>
            {currentPath !== '/request' && <button className="nav-btn nav-secondary" onClick={() => navigate('/request')}>Dashboard</button>}
            {currentPath !== '/activity' && <button className="nav-btn nav-secondary" onClick={() => navigate('/activity')}>Activity</button>}
            {currentPath !== '/notifications' && <button className="nav-btn nav-secondary" onClick={() => navigate('/notifications')}>Notifications</button>}
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 6. Admin Dashboard */}
        {currentPath === '/admin' && isLoggedIn && userRole === 'admin' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/collectors/add')}>Add Collectors</button>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/collectors')}>Active Collectors</button>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/admin/users')}>Users Details</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 7. Admin Users Page */}
        {currentPath === '/admin/users' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/admin')}>Back</button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 8. EcoGuide Page */}
        {currentPath === '/eco-guide' && (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/')}>Home</button>
            <button className="nav-btn nav-primary" onClick={() => navigate('/register')}>Get Started</button>          
          </>
        )}

        
        
         {/* 10.Collectors Page */}
        {currentPath === '/collectors' &&  (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate("/admin")}>Back to Admin</button>



          </>
        )}
        
         {/* 10.Collectors Page */}
        {currentPath === '/collectors' &&  (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate("/admin")}>Back to Admin</button>

          </>
        )}

        {/* 11.Add Collectors Page */}
        {currentPath === '/collectors/add' &&  (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate("/admin")}>Back to Admin</button>

          </>
        )}




        {/* 11.Add Collectors Page */}
        {currentPath === '/collectors/add' &&  (
          <>
            <button className="nav-btn nav-secondary" onClick={() => navigate("/admin")}>Back to Admin</button>

          </>
        )}





      </div>
    </nav>
  );
}

export default Navbar;