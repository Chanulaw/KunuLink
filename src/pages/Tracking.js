import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state එක
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true); // Loading ආරම්භ කිරීම

    // තත්පර 1.5 කින් පසු ක්‍රියාත්මක වීමට (Simulation)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        navigate('/admin');
        window.location.reload();
      } else if (username === 'user' && password === 'user123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'user');
        navigate('/request');
        window.location.reload();
      } else {
        alert("වැරදි පරිශීලක නාමයක් හෝ මුරපදයක්!");
        setIsLoading(false);
      }
    }, 1500); 
  };

  return (
    <div className="auth-container">
      <div className="login-card">
        <h2 className="login-title">KUNULINK</h2>
        <p className="login-subtitle">පද්ධතියට ඇතුළු වීමට ඔබේ විස්තර ලබා දෙන්න</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="e.g. admin" 
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
          
          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '25px', color: '#94a3b8' }}>
          ගිණුමක් නොමැතිද? <span style={{ color: '#10b981', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register Here</span>
        </p>
      </div>
    </div>
  );
}

export default Home;