import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // LocalStorage එකෙන් ලොග් වුණු කෙනාගේ තොරතුරු ගන්නවා
  const userRole = localStorage.getItem('userRole'); // 'admin' හෝ 'user'

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // දත්ත මකනවා
    navigate('/'); // මුල් පිටුවට යවනවා
    window.location.reload(); // පිටුව refresh කරනවා මෙනු එක අලුත් වෙන්න
  };

  return (
    <nav style={{ 
      backgroundColor: '#2e7d32', padding: '15px', color: 'white', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    }}>
      <h2 style={{ margin: 0 }}>Smart Waste Portal</h2>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0 }}>
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
        
        {/* සාමාන්‍ය පරිශීලකයෙක් නම් පමණක් පෙනෙන මෙනු */}
        {userRole === 'user' && (
          <>
            <li><Link to="/request" style={{ color: 'white', textDecoration: 'none' }}>New Request</Link></li>
            <li><Link to="/tracking" style={{ color: 'white', textDecoration: 'none' }}>Tracking</Link></li>
          </>
        )}

        {/* Admin කෙනෙක් නම් පමණක් පෙනෙන මෙනු */}
        {userRole === 'admin' && (
          <li><Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin Dashboard</Link></li>
        )}

        {/* ලොග් වී ඇත්නම් Logout button එක පෙන්වන්න */}
        {userRole && (
          <li>
            <button onClick={handleLogout} style={{ 
              backgroundColor: '#d32f2f', color: 'white', border: 'none', 
              padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' 
            }}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;