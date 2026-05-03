import React, { useState } from 'react';
import '../App.css';

function UserDashboard() {
  const [wasteType, setWasteType] = useState('Plastic');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ඔබේ ඉල්ලීම සාර්ථකව යොමු කරන ලදී!");
  };

  return (
    <div className="landing-wrapper dashboard-padding">
      <div className="welcome-banner animate-fade-in">
        <h1 className="logo-text">Hello, User! 👋</h1>
        <p className="headline-sin">ඔබේ අපද්‍රව්‍ය කළමනාකරණ කටයුතු මෙතැනින් ආරම්භ කරන්න.</p>
      </div>

      <div className="dash-single-container">
        <div className="hero-eco dash-card-full">
          <div className="flex-container">
            {/* Map Section */}
            <div className="map-holder">
              <iframe 
                title="Colombo Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58272147321!2d79.808332!3d6.921837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x3964c841d7e19ed2!2sColombo!5e0!3m2!1sen!2slk!4v1714000000000!5m2!1sen!2slk" 
                width="100%" height="400" style={{border:0, borderRadius:'20px'}} allowFullScreen="" loading="lazy">
              </iframe>
            </div>

            {/* Form Section */}
            <div className="form-holder">
              <h2 className="headline-eng">New Request</h2>
              <form onSubmit={handleSubmit} className="eco-form">
                <div className="eco-input-group">
                  <label className="si-desc">Waste Type</label>
                  <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="eco-field">
                    <option value="Plastic">Plastic</option>
                    <option value="Glass">Glass</option>
                    <option value="Paper">Paper</option>
                    <option value="Electronic">Electronic</option>
                  </select>
                </div>
                <div className="eco-input-group">
                  <label className="si-desc">Upload Photo</label>
                  <input type="file" className="eco-field" />
                </div>
                <button type="submit" className="primary-eco-btn" style={{width: '100%'}}>
                  Submit Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;