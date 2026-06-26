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

    <section id="services" className="services-section">

    <div className="section-header">
        <h3>Our Services | අපගේ සේවාවන්</h3>
        <p>
          Smart waste management solutions designed for cleaner and greener communities.
          <br />
          පිරිසිදු හා හරිත ප්‍රජාවන් සඳහා නිර්මාණය කළ නවීන අපද්‍රව්‍ය කළමනාකරණ විසඳුම්.
        </p>
    </div>


     <div className="services-grid">
      
      <div className="service-card">
          <div className="service-icon">📍</div>

          <h4>Live Collection Tracking | සජීවී එකතු කිරීමේ නිරීක්ෂණය</h4>

          <p>
            Follow your waste collection request from pickup confirmation to successful collection with real-time location updates.
            <br />
            එකතු කිරීම තහවුරු වූ මොහොතේ සිට අපද්‍රව්‍ය එකතු කරන තෙක් සජීවී ස්ථාන යාවත්කාලීන සමඟ ඔබගේ ඉල්ලීම නිරීක්ෂණය කරන්න.
          </p>
      </div>

      
      <div
      className="service-card clickable"
      onClick={() => navigate("/eco-guide")}>
      <div className="service-icon">♻️</div>

      <h4>
        Eco Guide | අපද්‍රව්‍ය වර්ගීකරණ මාර්ගෝපදේශය
      </h4>

      <p><br />
        Learn how to identify and separate recyclable waste before submitting
        your collection request.
        <br />
        අපද්‍රව්‍ය එකතු කිරීමේ ඉල්ලීමක් යොමු කිරීමට පෙර
        ප්‍රතිචක්‍රීකරණය කළ හැකි අපද්‍රව්‍ය නිවැරදිව වර්ග කිරීම
        ඉගෙන ගන්න.
      </p>
      <br />
      <span className="eco-badge">
         📖 Open Guide →
      </span>
    </div>

      
      <div className="service-card">
        <div className="service-icon">🔔</div>

          <h4>
            Smart Notifications | ක්ෂණික දැනුම්දීම්
          </h4>

          <p><br />
            Receive instant updates when your waste collection request is accepted,
            scheduled, or completed.
            <br />
            ඔබගේ අපද්‍රව්‍ය එකතු කිරීමේ ඉල්ලීම පිළිගත් විට,
            සැලසුම් කළ විට සහ සාර්ථකව අවසන් කළ විට
            ක්ෂණික දැනුම්දීම් ලබාගන්න.
          </p>
        </div>

    </div>

    </section>

    
    </div>
  );
}

export default Home;