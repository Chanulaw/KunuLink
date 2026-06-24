import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../App.css';

function UserDashboard() {
  const [wasteType, setWasteType] = useState('Plastic');
  const [userName, setUserName] = useState('User');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // LocalStorage එකේ නම පරීක්ෂා කිරීම
    const storedName = localStorage.getItem('activeUserName') || localStorage.getItem('username');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestsRef = collection(db, 'requests');
      await addDoc(requestsRef, {
        userId: auth.currentUser?.uid || localStorage.getItem('uid'),
        userName: userName,
        wasteType: wasteType,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      alert("ඔබේ ඉල්ලීම සාර්ථකව Firestore වෙත යොමු කරන ලදී!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      {/* 🌟 Welcome Top Banner */}
      <div className="welcome-banner">
        <h1 className="dash-welcome-text">Hello, <span>{userName}!</span> 👋</h1>
        <p className="dash-subtitle">ඔබේ අපද්‍රව්‍ය කළමනාකරණ කටයුතු මෙතැනින් ආරම්භ කරන්න.</p>
      </div>

      {/* 📊 Main Layout Grid */}
      <div className="dash-grid-layout">
        
        {/* 🗺️ Map Container (Left Side) */}
        <div className="dash-glass-card map-holder">
          <h2 className="dash-section-title">Live Waste Collection Map</h2>
          <div className="map-wrapper">
            <iframe 
              title="Colombo Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8037326252973!2d79.85244567484462!3d6.913506593077797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596312061033%3A0x1d4791e3e7f41c30!2sColombo!5e0!3m2!1sen!2slk!4v1687584000000!5m2!1sen!2slk" 
              width="100%" 
              height="400" 
              style={{ border: 0 }}
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* 📝 Form Container (Right Side) */}
        <div className="dash-glass-card form-holder">
          <h2 className="dash-section-title">New Collection Request</h2>
          <form onSubmit={handleSubmit} className="eco-form">
            
            <div className="input-group">
              <label>Waste Type</label>
              <select 
                value={wasteType} 
                onChange={(e) => setWasteType(e.target.value)} 
                className="eco-select-field"
                disabled={isLoading}
              >
                <option value="Plastic">Plastic (ප්ලාස්ටික්)</option>
                <option value="Glass">Glass (වීදුරු)</option>
                <option value="Paper">Paper (කඩදාසි)</option>
                <option value="Electronic">Electronic (විද්‍යුත් අපද්‍රව්‍ය)</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Upload Photo (Optional)</label>
              <input type="file" className="eco-file-field" disabled={isLoading} />
            </div>

            <button 
              type="submit" 
              className="dash-submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting Request...' : 'Submit Disposal Request'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;