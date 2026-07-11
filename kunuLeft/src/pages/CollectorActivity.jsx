import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function CollectorActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Collector ගේ ID එකට අදාළ requests පමණක් ලබාගැනීම
          const q = query(collection(db, "requests"), where("collectorId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setActivities(data);
        } catch (error) {
          console.error("Error fetching activities:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    };
    fetchActivities();
  }, [navigate]);

  if (loading) return <div className="loading-spinner">Loading Your Activities...</div>;

  return (
    <div className="activity-page-wrapper">
      <div className="activity-container">
        <h2>My Collection Activity</h2>
        
        {activities.length === 0 ? (
          <p className="no-activity">No recent activities found.</p>
        ) : (
          activities.map((act) => (
            <div className="activity-card" key={act.id}>
              <div className="activity-details">
                <p className="user-name"><strong>User:</strong> {act.userName || "N/A"}</p>
                
                {/* Location කොටස පමණක් ඉතිරි කරන ලදී */}
                <p className="location">
                  <strong>Location:</strong> {act.location && typeof act.location === 'object' 
                    ? `${act.location.lat.toFixed(4)}, ${act.location.lng.toFixed(4)}` 
                    : (act.location || "N/A")}
                </p>
              </div>
              <div className={`status-badge ${act.status}`}>
                {act.status || "Pending"}
              </div>
            </div>
          ))
        )}

        <button className="back-btn" onClick={() => navigate('/collector')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CollectorActivity;