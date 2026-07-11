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
    <div className="tracking-page-container">
      <h2 className="centered-title">Activity History</h2>
      
      <div className="activity-stats-row">
        <div className="stat-box-custom">
          <h3>{String(stats.total).padStart(2, '0')}</h3>
          <p>Total</p>
        </div>
        <div className="stat-box-custom">
          <h3>{String(stats.completed).padStart(2, '0')}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-box-custom">
          <h3>{String(stats.active).padStart(2, '0')}</h3>
          <p>In-Progress</p>
        </div>
      </div>

      <div className="activity-card">
        <table className="activity-table-new">
          <thead>
            <tr>
              <th>REQ ID</th>
              <th>DATE</th>
              <th>TYPE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((item) => {
                // Status එක lowercase කර class එකක් ලෙස භාවිතා කිරීම
                const statusClass = (item.status || 'pending').toLowerCase();
                return (
                  <tr key={item.id}>
                    <td><strong>#{item.id.substring(0, 5).toUpperCase()}</strong></td>
                    <td>{item.displayDate}</td>
                    <td>{item.wasteType || "General"}</td>
                    <td>
                      <span className={`status-pill ${statusClass}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activity;