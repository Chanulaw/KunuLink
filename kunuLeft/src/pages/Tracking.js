import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import '../App.css';

function Tracking() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the current user's ID
    const currentUserId = auth.currentUser?.uid || localStorage.getItem('uid');

    if (!currentUserId) {
      console.log("No user ID found, waiting for login...");
      setLoading(false);
      return;
    }

    // 2. Setup the Query (Ensure your Firebase index is created for this!)
    const q = query(
      collection(db, 'requests'),
      where('userId', '==', currentUserId),
      orderBy('createdAt', 'desc')
    );

    // 3. Listen for changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userRequests = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firebase Timestamp to a readable string safely
          displayDate: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Just now'
        };
      });
      
      setActivities(userRequests);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate stats based on current database records
  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'Completed').length,
    active: activities.filter(a => a.status !== 'Completed').length
  };

  if (loading) return <div className="loading-spinner">Loading your history...</div>;

  return (
    <div className="tracking-page-container">
      <div className="activity-card">
        <h2 style={{ color: '#16a34a', margin: '10px 0' }}>Activity History</h2>
        <p style={{ color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
          Real-time updates on your recycling requests.
        </p>

        {/* Dynamic Stats Section */}
        <div className="activity-stats-row">
          <div className="stat-box-custom">
            <h3>{String(stats.total).padStart(2, '0')}</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Total</p>
          </div>
          <div className="stat-box-custom">
            <h3 style={{ color: '#10b981' }}>{String(stats.completed).padStart(2, '0')}</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed</p>
          </div>
          <div className="stat-box-custom">
            <h3 style={{ color: '#ca8a04' }}>{String(stats.active).padStart(2, '0')}</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>In-Progress</p>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ overflowX: 'auto' }}>
          <table className="activity-table-new">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((item) => (
                  <tr key={item.id}>
                    <td><strong>#{item.id.substring(0, 5)}</strong></td>
                    <td>{item.displayDate}</td>
                    <td>{item.wasteType || "General"}</td>
                    <td>
                      <span className={`status-pill ${item.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    No requests found. Start by submitting a new request from the Dashboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tracking;