import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../App.css';

function CollectorProfile() {
  const [profile, setProfile] = useState({ name: '', email: '', vehicle: '', area: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "collectors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
        setLoading(false);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "collectors", user.uid);
      await updateDoc(docRef, {
        name: profile.name,
        vehicle: profile.vehicle,
        area: profile.area,
        phone: profile.phone
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading-spinner">Loading Profile...</div>;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <h2>{isEditing ? "Edit Profile" : "My Profile"}</h2>
        
        {/* Name Field (Position 1) */}
        <div className="profile-field">
          <label>Full Name</label>
          {isEditing ? (
            <input 
              type="text" 
              name="name" 
              value={profile.name || ''} 
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', background: 'white', border: '1px solid #bae6fd', borderRadius: '8px', marginTop: '5px' }}
            />
          ) : (
            <p>{profile.name || "N/A"}</p>
          )}
        </div>

        {/* Email Field (Position 2) */}
        <div className="profile-field">
          <label>Email (Account)</label>
          <p style={{ color: '#64748b' }}>{profile.email || "N/A"}</p>
        </div>

        {/* Remaining Editable Fields */}
        {['vehicle', 'area', 'phone'].map((field) => (
          <div className="profile-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {isEditing ? (
              <input 
                type="text" 
                name={field} 
                value={profile[field] || ''} 
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', background: 'white', border: '1px solid #bae6fd', borderRadius: '8px', marginTop: '5px' }}
              />
            ) : (
              <p>{profile[field] || "N/A"}</p>
            )}
          </div>
        ))}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {isEditing ? (
            <>
              <button className="back-btn" onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="back-btn" style={{background: '#94a3b8', border: 'none'}} onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="back-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        {!isEditing && (
          <button className="back-btn" style={{marginTop: '15px', background: 'transparent', color: '#64748b', border: 'none'}} onClick={() => navigate('/collector')}>
            ← Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default CollectorProfile;