import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper animate-fade-in">
      <section className="hero-eco">
        <div className="hero-glass-card"> 
          <h1 className="logo-text">KUNU<span>LINK</span></h1>
          
          <div className="main-headlines">
            <h2 className="headline-eng">Connecting Communities for a Cleaner Future</h2>
            <h2 className="headline-sin">පිරිසිදු හෙටක් වෙනුවෙන් ඔබව අප හා සම්බන්ධ කරයි</h2>
          </div>

          <p className="description-box">
            KUNULINK is your digital partner in responsible waste management. 
            Join us to make Sri Lanka greener, one request at a time.
            <br />
            <span className="si-desc">
              KUNULINK යනු වගකීම් සහගත අපද්‍රව්‍ය කළමනාකරණය සඳහා ඔබගේ ඩිජිටල් සහකරු වේ. 
              පිරිසිදු ශ්‍රී ලංකාවක් උදෙසා අදම අප හා එක්වන්න.
            </span>
          </p>

          <div className="button-group">
            <button className="primary-eco-btn" onClick={() => navigate('/login')}>
              Get Started / ආරම්භ කරන්න →
            </button>
          </div>
        </div>
      </section>
    <section className="services-section" id="services">
     <div className="services-grid">

      
      <div className="service-card">
        <div className="service-icon">📍</div>
        <h4>Live Mapping | සජීවී සිතියම්කරණය</h4>
        <p>Real-time location tracking for waste collection.</p>
      </div>

      
      <div className="service-card clickable" onClick={() => navigate("/eco-guide")}>
        <div className="service-icon">♻️</div>
        <h4>Eco Guide | Waste Sorting Help</h4>
        <p>
          Learn how to separate waste correctly before submitting a request.
        </p>
        <span className="eco-badge">
          Open Guide →
        </span>
      </div>

      
      <div className="service-card">
        <div className="service-icon">🔔</div>
        <h4>Quick Alerts | ක්ෂණික දැනුම්දීම්</h4>
        <p>Instant notifications for updates and pickups. </p>
      </div>

    </div>
    </section>

    
    </div>
  );
}

export default Home;