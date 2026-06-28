import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function SmartNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const q = query(
        collection(db, "requests"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(data);
        setLoading(false);
      });
      return () => unsubscribeSnapshot();
    });
    return () => unsubscribeAuth();
  }, []);

  // Status එක අනුව වර්ණ තීරණය කිරීම
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { background: '#f0fdf4', borderColor: '#22c55e', color: '#166534' }; // Green
      case 'assigned': return { background: '#eff6ff', borderColor: '#3b82f6', color: '#1e40af' };  // Blue
      default: return { background: '#fffbeb', borderColor: '#f59e0b', color: '#92400e' };         // Orange
    }
  };

  return (
    <div className="notifications-page-container" style={{ padding: '20px', maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
      
      

      <h2 className="section-title" style={{ marginBottom: '10px' }}>🔔 Smart Notifications</h2>
      <p className="section-subtitle" style={{ marginBottom: '20px', color: '#666' }}>ඔබගේ ඉල්ලීම්වල නවතම යාවත්කාලීන කිරීම්.</p>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const style = getStatusStyle(n.status);
              return (
                <div key={n.id} style={{ 
                  border: `1px solid ${style.borderColor}`, 
                  padding: '15px', 
                  borderRadius: '12px', 
                  marginBottom: '15px', 
                  background: style.background,
                  color: style.color
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Request #{n.id.substring(0, 6).toUpperCase()}</h4>
                    <span style={{ fontWeight: 'bold', fontSize: '0.8em', textTransform: 'uppercase' }}>{n.status}</span>
                  </div>
                  <p style={{ margin: '10px 0' }}>අපද්‍රව්‍ය වර්ගය: <strong>{n.wasteType || 'General Waste'}</strong></p>
                  <small style={{ opacity: 0.8 }}>
                    {n.createdAt ? n.createdAt.toDate().toLocaleString() : 'Date unavailable'}
                  </small>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>No new notifications.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SmartNotifications;