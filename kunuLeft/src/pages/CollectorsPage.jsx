import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function CollectorsPage() {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const qCol = query(collection(db, "collectors"));
    const unsubCol = onSnapshot(qCol, (snapshot) => {
      if (snapshot.empty) { setCollectors([]); } 
      else { setCollectors(snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }))); }
      setLoading(false);
    }, (error) => { console.error(error); setLoading(false); });
    return () => unsubCol();
  }, []);

  const handleLogout = async () => { await signOut(auth); navigate('/login'); };
  if (loading) return <div className="loading-spinner">Loading Collectors...</div>;

  return (
    <div className="admin-page-container">
      <div className="modern-admin-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 style={{ color: '#065f46' }}>Collectors Management</h2>
        </div>

       

        

        <h3 style={{ marginBottom: '15px', color: '#0f172a' }}>All Collectors ({collectors.length})</h3>
        <div style={{ overflowX: 'auto', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Vehicle</th><th>Area</th><th>Phone</th><th>Active Jobs</th><th>Status</th></tr></thead>
            <tbody>
              {collectors.map(c => (
                <tr key={c.id}>
                  <td style={{fontWeight:"600"}}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.vehicle || "N/A"}</td>
                  <td>{c.area || "N/A"}</td>
                  <td>{c.phone || "N/A"}</td>
                  <td><span className="status-pill">{c.activeJobs || 0}</span></td>
                  <td>{(c.activeJobs || 0) > 0 ? <span style={{color: '#f59e0b', fontWeight: '700'}}>Busy</span> : <span style={{color: '#10b981', fontWeight: '700'}}>Available</span>}</td>
                </tr>
              ))}
              {collectors.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No collectors added yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CollectorsPage;