import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../App.css';

function SmartNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { setLoading(false); return; }
      
      const q = query(collection(db, "requests"), where("userId", "==", user.uid));
      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // නවතම දේ උඩින් පෙන්වීමට sort කිරීම
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setNotifications(data);
        setLoading(false);
      });
      return () => unsubscribeSnapshot();
    });
    return () => unsubscribeAuth();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { background: '#f0fdf4', borderColor: '#22c55e', color: '#166534' };
      case 'accepted': return { background: '#eff6ff', borderColor: '#3b82f6', color: '#1e40af' };
      default: return { background: '#fffbeb', borderColor: '#f59e0b', color: '#92400e' };
    }
  };

  return (
    <div className="notifications-page-container" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2 className="section-title">🔔 Smart Notifications</h2>
      {loading ? <div className="loading-spinner">Loading...</div> : (
        <div className="notifications-list">
          {notifications.map((n) => {
            const style = getStatusStyle(n.status);
            return (
              <div key={n.id} style={{ border: `1px solid ${style.borderColor}`, padding: '15px', borderRadius: '12px', marginBottom: '15px', background: style.background, color: style.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>Request #{n.id.substring(0, 6).toUpperCase()}</h4>
                  <span style={{ fontWeight: 'bold', fontSize: '0.8em', textTransform: 'uppercase' }}>{n.status}</span>
                </div>
                <p style={{ margin: '5px 0' }}>අපද්‍රව්‍ය: <strong>{n.wasteType || 'General'}</strong></p>
                
                {n.status?.toLowerCase() !== 'pending' && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '3px 0' }}>👤 Collector: <strong>{n.collectorName || 'N/A'}</strong></p>
                    <p style={{ margin: '3px 0' }}>📞 Phone: <strong>{n.collectorPhone || 'N/A'}</strong></p>
                    <p style={{ margin: '3px 0' }}>🚛 Vehicle: <strong>{n.vehicle || 'N/A'}</strong></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SmartNotifications;