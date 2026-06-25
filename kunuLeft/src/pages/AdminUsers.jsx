import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function AdminUsers() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Firestore හි 'users' collection එකෙන් සජීවීව දත්ත ලබා ගැනීම
    const q = query(collection(db, 'users'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsersList(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔴 Logout වීමේ ක්‍රියාවලිය
  const handleLogout = () => {
    localStorage.clear(); // Login දත්ත මකා දැමීම
    navigate('/', { replace: true }); // Home පිටුවට හරවා යැවීම
  };

  return (
    <div className="tracking-page-container animate-fade-in">
      <div className="activity-card" style={{ maxWidth: '1000px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ color: '#10b981', margin: '0 0 5px 0', fontSize: '24px', fontWeight: '800' }}>Registered Users Details</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>පද්ධතියේ ලියාපදිංචි වී සිටින සියලුම පරිශීලකයන් සහ ඔවුන්ගේ විස්තර</p>
          </div>
          
          {/* Action Buttons (Back to Requests සහ Logout) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="nav-btn nav-secondary" onClick={() => navigate('/admin')}>
              ← Back to Requests
            </button>
            <button className="nav-btn nav-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            පරිශීලක දත්ත පූරණය වෙමින් පවතී...
          </div>
        ) : usersList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            📭 පද්ධතියේ කිසිදු පරිශීලකයෙකු ලියාපදිංචි වී නොමැත.
          </div>
        ) : (
          /* 📋 Registered Users Table */
          <div style={{ overflowX: 'auto' }}>
            <table className="activity-table-new">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role (තත්ත්වය)</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((userItem) => (
                  <tr key={userItem.id}>
                    <td><strong>#{userItem.id.substring(0, 6).toUpperCase()}</strong></td>
                    <td style={{ fontWeight: '600', color: '#0f172a' }}>{userItem.name || 'N/A'}</td>
                    <td style={{ color: '#475569' }}>{userItem.email || 'N/A'}</td>
                    <td>
                      <span className={`status-pill ${userItem.role === 'admin' ? 'completed' : 'pending'}`} style={{
                        background: userItem.role === 'admin' ? '#d1fae5' : '#f1f5f9',
                        color: userItem.role === 'admin' ? '#047857' : '#475569',
                      }}>
                        {userItem.role || 'user'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminUsers;