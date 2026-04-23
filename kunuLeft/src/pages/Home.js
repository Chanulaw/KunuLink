import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // සරල Login Logic එකක් (මෙය පසුව Database සමඟ සම්බන්ධ කළ හැක)
    if (username === 'admin' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } else if (username === 'user' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      navigate('/request');
    } else {
      alert("වැරදි පරිශීලක නාමයක් හෝ මුරපදයක්!");
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="login-card">
        <div className="brand-header">
          <h1 className="brand-logo">KUNULINK</h1>
          <p className="brand-tagline">Smart Waste Management Portal</p>
        </div>

        <h2 className="login-title">Login (ඇතුළු වන්න)</h2>
        <p className="login-subtitle">පද්ධතියට ඇතුළු වීමට ඔබේ විස්තර ලබා දෙන්න</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-submit-btn">
            Secure Login
          </button>
        </form>

        <div className="auth-footer">
          <span>ගිණුමක් නොමැතිද? </span>
          <button onClick={() => navigate('/register')} className="register-link">
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;