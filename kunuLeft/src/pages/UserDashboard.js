import React, { useState } from 'react';
import '../App.css';

function UserDashboard() {
  const [wasteType, setWasteType] = useState('Plastic');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ඔබේ ඉල්ලීම සාර්ථකව යොමු කරන ලදී! (Request Submitted Successfully)");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Welcome Section */}
      <div className="welcome-banner">
        <h1>Hello, User! 👋</h1>
        <p>ඔබේ අපද්‍රව්‍ය කළමනාකරණ කටයුතු සහ ඉතිහාසය මෙතැනින් පාලනය කරන්න.</p>
      </div>

      <div className="dash-main-grid">
        
        {/* Left Section: Map and Request Form */}
        <div className="request-card glass-effect">
          <div className="flex-container">
            
            {/* Map Placeholder */}
            <div className="map-holder">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58272147321!2d79.808332!3d6.921837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x3964c841d7e19ed2!2sColombo!5e0!3m2!1sen!2slk!4v1714000000000!5m2!1sen!2slk" 
                width="100%" height="380" style={{border:0, borderRadius:'15px'}} allowFullScreen="" loading="lazy">
              </iframe>
              <div className="map-hint">📍 සිතියම මත ඔබේ ස්ථානය නිවැරදිව තෝරන්න</div>
            </div>

            {/* Form Part */}
            <div className="form-holder">
              <h2 className="form-title">New Collection Request</h2>
              <p className="form-subtitle">අපද්‍රව්‍ය ඉවත් කිරීමට අවශ්‍ය තොරතුරු ලබා දෙන්න</p>
              
              <form onSubmit={handleSubmit} className="dash-inner-form">
                <div className="form-group">
                  <label>Waste Type / වර්ගය</label>
                  <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="dash-select">
                    <option value="Plastic">Plastic / ප්ලාස්ටික්</option>
                    <option value="Glass">Glass / වීදුරු</option>
                    <option value="Paper">Paper / කඩදාසි</option>
                    <option value="Electronic">Electronic / විද්‍යුත්</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Upload Photo / පින්තූරයක්</label>
                  <input type="file" className="file-input" />
                </div>

                <div className="coord-box">
                   <strong>SELECTED COORDINATES:</strong>
                   <p>සිතියම මත ක්ලික් කරන්න...</p>
                </div>

                <button type="submit" className="submit-btn-green">
                  Submit Collection Request
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Right Section: Recent Activity */}
        <div className="activity-card glass-effect">
          <h3>Your Activity 📈</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="status-dot green"></div>
              <div className="act-info">
                <strong>Plastic Request</strong>
                <span>Completed - Today</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="status-dot orange"></div>
              <div className="act-info">
                <strong>Electronic Waste</strong>
                <span>Pending Confirmation</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="status-dot green"></div>
              <div className="act-info">
                <strong>Paper Waste</strong>
                <span>Completed - Yesterday</span>
              </div>
            </div>
          </div>
          <button className="view-history-btn">View All History</button>
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;