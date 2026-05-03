import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } 
    else if (username === 'user' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      navigate('/dashboard');
    } 
    else {
      alert("Invalid Username or Password! / දත්ත වැරදියි!");
    }
  };

  return (
    /* About එකට සමාන පෙනුමක් ලබා දීමට landing-wrapper භාවිතා කර ඇත */
    <div className="landing-wrapper"> 
      <div className="hero-eco login-card-adjust animate-fade-in">
        <div className="login-header">
          <h2 className="logo-text">KUNU<span>LINK</span></h2>
          <p className="headline-eng">Welcome Back!</p>
          <p className="headline-sin">ඔබේ ගිණුමට ඇතුළු වන්න</p>
        </div>

        <form onSubmit={handleLogin} className="eco-form">
          <div className="eco-input-group">
            <label className="si-desc">Username / පරිශීලක නාමය</label>
            <input 
              className="eco-field"
              type="text" 
              placeholder="Enter username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="eco-input-group">
            <label className="si-desc">Password / මුරපදය</label>
            <input 
              className="eco-field"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="primary-eco-btn login-btn-wide">Login Now</button>
        </form>

        <div className="eco-auth-footer">
          <p className="description-box" style={{fontSize: '0.95rem', margin: '20px 0'}}>
            Don't have an account? <strong style={{color: '#16a34a', cursor: 'pointer'}} onClick={() => navigate('/register')}>Register Here</strong>
          </p>
          <button className="service-pill back-btn-pill" onClick={() => navigate('/')} style={{cursor: 'pointer', margin: '0 auto'}}>
             <strong>← Back to Home Page</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;