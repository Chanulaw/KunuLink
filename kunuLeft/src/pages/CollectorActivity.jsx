import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function CollectorActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, "requests"), where("collectorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="loading-spinner">Loading Your Activities...</div>;

  return (
    <div className="collector-page-container">
      
      {/* Topic Section - අලුතින් එක් කරන ලදී */}
      <div className="admin-topic-section">
        <h2 className="admin-topic-title">My Collection Activity</h2>
        <p className="admin-topic-subtitle">ඔබට පවරා ඇති සියලුම අපද්‍රව්‍ය එකතු කිරීමේ කාර්යයන්</p>
      </div>

      <div className="activity-card collector-width-fix">
        
        {activities.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>📭 No recent activities found.</p>
        ) : (
          <div className="collector-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id}>
                    <td>#{act.id.substring(0, 5).toUpperCase()}</td>
                    <td style={{ fontWeight: "600" }}>{act.userName || "N/A"}</td>
                    <td>{act.location && typeof act.location === 'object' 
                      ? `${act.location.lat.toFixed(4)}, ${act.location.lng.toFixed(4)}` 
                      : (act.location || "N/A")}</td>
                    <td>
                      <span className={`status-pill ${act.status?.toLowerCase()}`}>
                        {act.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          
        </div>
      </div>
    </div>
  );
}

export default CollectorActivity;