import React, { useState } from 'react';
import '../App.css';

function UserDashboard() {
  const [wasteType, setWasteType] = useState('Plastic');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Request Submitted Successfully!");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="welcome-msg">
        <h2>Hello, User! 👋</h2>
        <p>අපද්‍රව්‍ය එකතු කිරීමේ නව ඉල්ලීමක් (New Request) සිදු කිරීමට පහත පෝරමය පුරවන්න.</p>
      </div>

      <div className="dash-card">
        <div className="flex-container">
          
          {/* වම් පැත්ත: Map එක */}
          <div className="map-box">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58272147321!2d79.808332!3d6.921837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x3964c841d7e19ed2!2sColombo!5e0!3m2!1sen!2slk!4v1714000000000!5m2!1sen!2slk" 
              width="100%" height="400" style={{border:0, borderRadius:'15px'}} allowFullScreen="" loading="lazy">
            </iframe>
            <p className="map-info">📍 සිතියම මත ඔබේ ස්ථානය නිවැරදිදැයි පරීක්ෂා කරන්න.</p>
          </div>

          {/* දකුණු පැත්ත: Request Form එක */}
          <div className="form-box">
            <h3 className="form-head">New Collection Request</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Waste Type</label>
                <select className="input-field" value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
                  <option>Plastic</option>
                  <option>Glass</option>
                  <option>Paper</option>
                  <option>Electronic</option>
                </select>
              </div>

              <div className="input-group">
                <label>Upload Photo</label>
                <input type="file" className="input-field" />
              </div>

              <div className="coords-display">
                <small>📍 CURRENT LOCATION</small>
                <p>සිතියම මත ක්ලික් කරන්න...</p>
              </div>

              <button type="submit" className="submit-btn">Submit Request</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDashboard;