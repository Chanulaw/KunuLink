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
      
      // 1. Get the current user's ID (try auth, then localStorage 'user' object, then legacy 'uid')
      let storedUserUid = null;
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) storedUserUid = JSON.parse(storedUser).uid;
      } catch (e) {
        storedUserUid = null;
      }
      const currentUserId = user?.uid || storedUserUid || localStorage.getItem('uid');

      if (!currentUserId) {
        console.log("No user ID found, waiting for login...");
        setLoading(false);
        return;
      }

      // 2. Listen to the user's requests collection
      // We remove orderBy from the Firestore query to avoid needing a composite index,
      // and instead sort the results in JavaScript.
      const allQ = query(
        collection(db, 'requests'), 
        where('userId', '==', currentUserId)
      );

      const unsubscribeSnapshot = onSnapshot(allQ, (snapshot) => {
        let userRequests = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((d) => {
            const data = d || {};
            return (
              data.userId === currentUserId ||
              data.uid === currentUserId ||
              (data.user && data.user.uid === currentUserId) ||
              (data.createdBy === currentUserId)
            );
          })
          .map((data) => ({
            ...data,
            // Add a sortable timestamp field to handle missing/pending timestamps safely
            _sortTime: data.createdAt ? (data.createdAt.toMillis ? data.createdAt.toMillis() : new Date(data.createdAt).getTime()) : Date.now(),
            displayDate: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toLocaleDateString() : new Date(data.createdAt).toLocaleDateString()) : 'Just now'
          }));

        // Sort descending by time
        userRequests.sort((a, b) => b._sortTime - a._sortTime);

        setActivities(userRequests);
        setLoading(false);
      }, (error) => {
        console.error('Firestore Error:', error);
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
                activities.map((item) => {
                  const normalizedStatus = (item.status || 'pending').toLowerCase().trim();
                  const isPending = normalizedStatus === 'pending';
                  const isAssignedOrAccepted = normalizedStatus === 'assigned' || normalizedStatus === 'accepted';
                  const isCompleted = normalizedStatus === 'completed';

                  const statusBg =
                    isPending ? '#e0f2fe' :
                    isAssignedOrAccepted ? '#fef3c7' :
                    isCompleted ? '#d1fae5' : '#e0e7ff';

                  const statusColor =
                    isPending ? '#0369a1' :
                    isAssignedOrAccepted ? '#b45309' :
                    isCompleted ? '#047857' : '#4338ca';

                  return (
                    <tr key={item.id}>
                      <td><strong>#{item.id.substring(0, 5).toUpperCase()}</strong></td>
                      <td>{item.displayDate}</td>
                      <td><span style={{ fontWeight: '600' }}>{item.wasteType || "General"}</span></td>
                      <td>
                        <span className={`status-pill ${normalizedStatus.replace(' ', '-')}`} style={{
                          background: statusBg,
                          color: statusColor,
                        }}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })
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