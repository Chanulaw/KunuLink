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
    } else if (username === 'user' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      navigate('/request');
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="auth-container full-height">
      <div className="login-card shadow-premium animate-slide-up">
        <h2 className="login-title">Member Login</h2>
        <p className="login-subtitle">ඔබේ ගිණුමට ඇතුළු වන්න</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-submit-btn">Login</button>
        </form>

        {/* Register Page එකට යාමට ඇති ලින්ක් එක */}
        <div className="auth-footer-text">
          <span>ගිණුමක් නොමැතිද? </span>
          <button className="link-btn" onClick={() => navigate('/register')}>
            Register Now
          </button>
        </div>

        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  );
}

export default Home;