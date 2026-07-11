import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function AdminUsers() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="admin-page-container">
      {/* Topic Section */}
      <div className="admin-topic-section">
        <h2 className="admin-topic-title">Registered Users</h2>
        <p className="admin-topic-subtitle">පද්ධතියේ ලියාපදිංචි වී සිටින සියලුම පරිශීලකයන්ගේ විස්තර</p>
      </div>

      {/* Main Card */}
      <div className="activity-card admin-width-fix">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
         
        </div>

        {loading ? (
          <div className="loading-spinner">Loading Users...</div>
        ) : (
          <div className="main-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id.substring(0, 5).toUpperCase()}</td>
                    <td style={{ fontWeight: "600" }}>{user.name || "N/A"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>
                      <span className={`status-pill ${user.role === 'admin' ? 'admin' : user.role === 'collector' ? 'collector' : 'user'}`}>
                        {user.role || 'user'}
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