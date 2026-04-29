import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Hero Section: Eco-Friendly Colors */}
      <section className="hero-eco">
        <div className="hero-content animate-fade-in">
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
              Get Started / ආරම්භ කරන්න
            </button>
          </div>
        </div>
      </section>

      {/* Modern Services Bar */}
      <section className="services-bar">
        <div className="service-pill">
          <span className="icon-circle">📍</span>
          <div>
            <strong>Live Mapping</strong>
            <p>සිතියම හරහා ස්ථානය දැක්වීම</p>
          </div>
        </div>
        <div className="service-pill">
          <span className="icon-circle">♻️</span>
          <div>
            <strong>Eco Sorting</strong>
            <p>වර්ගීකරණය කළ බැහැර කිරීම්</p>
          </div>
        </div>
        <div className="service-pill">
          <span className="icon-circle">🔔</span>
          <div>
            <strong>Quick Alerts</strong>
            <p>ඉක්මන් දැනුම්දීම්</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;