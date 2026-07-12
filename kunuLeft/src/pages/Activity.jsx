import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../App.css';

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const currentUserId = user?.uid || localStorage.getItem('uid');
      if (!currentUserId) { setLoading(false); return; }

      const allQ = query(collection(db, 'requests'), where('userId', '==', currentUserId));
      const unsubscribeSnapshot = onSnapshot(allQ, (snapshot) => {
        const userRequests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          _sortTime: doc.data().createdAt ? doc.data().createdAt.toMillis() : Date.now(),
          displayDate: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleDateString() : 'N/A'
        }));
        userRequests.sort((a, b) => b._sortTime - a._sortTime);
        setActivities(userRequests);
        setLoading(false);
      });
      return () => unsubscribeSnapshot();
    });
    return () => unsubscribeAuth();
  }, []);

  const stats = {
    total: activities.length,
    completed: activities.filter(a => (a.status || '').toLowerCase() === 'completed').length,
    active: activities.filter(a => (a.status || '').toLowerCase() !== 'completed').length
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-topic-section">
        <h2 className="admin-topic-title">Activity History</h2>
        <p className="admin-topic-subtitle">ඔබගේ ඉල්ලීම් වල තත්ත්වය පරීක්ෂා කරන්න</p>
      </div>

      {/* Stats Section with increased gap */}
      <div className="activity-stats-row" style={{ gap: '60px', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <div className="stat-box-custom"><h3>{String(stats.total).padStart(2, '0')}</h3><p>Total</p></div>
        <div className="stat-box-custom"><h3>{String(stats.completed).padStart(2, '0')}</h3><p>Completed</p></div>
        <div className="stat-box-custom"><h3>{String(stats.active).padStart(2, '0')}</h3><p>In-Progress</p></div>
      </div>

      {/* Table Section with Collector column after Status */}
      <div className="activity-card admin-width-fix" style={{ padding: '20px' }}>
        <div className="main-table-wrapper">
          <table className="admin-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 15px' }}>REQ ID</th>
                <th style={{ padding: '12px 15px' }}>DATE</th>
                <th style={{ padding: '12px 15px' }}>TYPE</th>
                <th style={{ padding: '12px 15px' }}>STATUS</th>
                <th style={{ padding: '12px 15px' }}>COLLECTOR</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '12px 15px' }}><strong>#{item.id.substring(0, 5).toUpperCase()}</strong></td>
                    <td style={{ padding: '12px 15px' }}>{item.displayDate}</td>
                    <td style={{ padding: '12px 15px' }}>{item.wasteType || "General"}</td>
                    <td style={{ padding: '12px 15px' }}>
                      <span className={`status-pill ${(item.status || 'pending').toLowerCase()}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 15px', fontWeight: '500' }}>
                      {item.collectorName || "Not Assigned"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activity;