import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function AddCollector() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collectorForm, setCollectorForm] = useState({
    name: "", email: "", phone: "", vehicle: "", area: "", password: ""
  });

  const saveCollector = async () => {
    try {
      setLoading(true);
      if(!collectorForm.email ||!collectorForm.password ||!collectorForm.name){ 
        alert("Name, Email and Password required"); 
        setLoading(false);
        return; 
      }
      if(collectorForm.password.length < 6){ 
        alert("Password should be at least 6 characters"); 
        setLoading(false);
        return; 
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, collectorForm.email, collectorForm.password);
      const uid = userCredential.user.uid;
      
      await updateProfile(userCredential.user, { displayName: collectorForm.name });
      await setDoc(doc(db, "users", uid), { 
        name: collectorForm.name, 
        email: collectorForm.email, 
        role: "collector", 
        createdAt: serverTimestamp(), 
      });
      await setDoc(doc(db, "collectors", uid), { 
        name: collectorForm.name, 
        email: collectorForm.email, 
        phone: collectorForm.phone, 
        vehicle: collectorForm.vehicle, 
        area: collectorForm.area, 
        role: "collector", 
        activeJobs: 0, 
        createdAt: serverTimestamp(), 
      });
      
      alert("Collector Added Successfully");
      navigate('/admin/collectors'); 
      
    } catch (error) {
      console.error("Save Collector Error:", error);
      if (error.code === 'auth/email-already-in-use') { alert("⚠️ This email is already registered."); }
      else if (error.code === 'auth/weak-password') { alert("⚠️ Password is too weak."); }
      else { alert("Error: " + error.message); }
      setLoading(false);
    }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/login'); };

  return (
    <div className="admin-page-container">
      <div className="modern-admin-card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 style={{ color: '#065f46' }}>➕ Add New Collector</h2>
        </div>

        

        {/* ===== FORM ===== */}
        <div className="form-grid-2col" style={{marginTop: '30px'}}>
          <div className="input-group">
            <label>Full Name *</label>
            <input placeholder="John Doe" value={collectorForm.name} onChange={(e) => setCollectorForm({...collectorForm, name: e.target.value})}/>
          </div>
          <div className="input-group">
            <label>Email Address *</label>
            <input placeholder="email@example.com" type="email" value={collectorForm.email} onChange={(e) => setCollectorForm({...collectorForm, email: e.target.value})}/>
          </div>
          <div className="input-group">
            <label>Password *</label>
            <input placeholder="Min 6 characters" type="password" value={collectorForm.password} onChange={(e) => setCollectorForm({...collectorForm, password: e.target.value})}/>
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input placeholder="07x xxx xxxx" value={collectorForm.phone} onChange={(e) => setCollectorForm({...collectorForm, phone: e.target.value})}/>
          </div>
          <div className="input-group">
            <label>Vehicle Number</label>
            <input placeholder="CA-1234" value={collectorForm.vehicle} onChange={(e) => setCollectorForm({...collectorForm, vehicle: e.target.value})}/>
          </div>
          <div className="input-group">
            <label>Assigned Area</label>
            <input placeholder="Colombo 05" value={collectorForm.area} onChange={(e) => setCollectorForm({...collectorForm, area: e.target.value})}/>
          </div>
        </div>

        <div className="modal-actions" style={{marginTop: '30px'}}>
          <button className="btn-premium btn-cancel" onClick={() => navigate('/admin/collectors')}>Cancel</button>
          <button className="btn-premium btn-assign" onClick={saveCollector} disabled={loading}>
            {loading ? "Saving..." : "Save Collector"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCollector;