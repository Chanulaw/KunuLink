import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../App.css';

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth එක සජීවීව නිරීක්ෂණය කිරීම
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      
      // 1. Get the current user's ID (ඔයා එවපු විදිහටම ආරක්ෂිතව UID එක ගැනීම)
      const currentUserId = user?.uid || localStorage.getItem('uid');

      if (!currentUserId) {
        console.log("No user ID found, waiting for login...");
        setLoading(false);
        return;
      }

      // 2. Setup the Query (ඔයාගේ Database එකේ තියෙන 'userId' field එකෙන්ම සොයයි)
      const q = query(
        collection(db, 'requests'),
        where('userId', '==', currentUserId), // 👈 ඔයාගේ කේතයේ තිබූ පරිදිම 'userId' ලෙස සකස් කළා
        orderBy('createdAt', 'desc')
      );

      // 3. Listen for changes
      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
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

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  // Calculate stats based on current database records
  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'Completed').length,
    active: activities.filter(a => a.status !== 'Completed').length
  };

  if (loading) return <div className="loading-spinner">Loading your history...</div>;

  return (
    <div className="tracking-page-container animate-fade-in">
      <div className="activity-card">
        <h2 style={{ color: '#16a34a', margin: '10px 0', textAlign: 'center' }}>Activity History</h2>
        <p style={{ color: '#475569', maxWidth: '600px', margin: '0 auto 25px auto', textAlign: 'center' }}>
          Real-time updates on your recycling requests.
        </p>

        {/* Dynamic Stats Section */}
        <div className="activity-stats-row" style={{ marginBottom: '30px' }}>
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
                    <td><strong>#{item.id.substring(0, 5).toUpperCase()}</strong></td>
                    <td>{item.displayDate}</td>
                    <td><span style={{ fontWeight: '600' }}>{item.wasteType || "General"}</span></td>
                    <td>
                      <span className={`status-pill ${item.status?.toLowerCase().replace(' ', '-') || 'pending'}`} style={{
                        background: item.status === 'Pending' ? '#e0f2fe' : item.status === 'Assigned' ? '#fef3c7' : '#d1fae5',
                        color: item.status === 'Pending' ? '#0369a1' : item.status === 'Assigned' ? '#b45309' : '#047857',
                      }}>
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

export default Activity;