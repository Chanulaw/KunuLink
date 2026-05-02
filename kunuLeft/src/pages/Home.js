import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Admin Login (Username: admin, Password: 123)
    if (username === 'admin' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } 
    // User Login (Username: user, Password: 123)
    else if (username === 'user' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      navigate('/dashboard'); // කෙලින්ම Map + Form එකට යවයි
    } 
    else {
      alert("Invalid Username or Password! / දත්ත වැරදියි!");
    }
  };

  return (
    <div className="eco-auth-container">
      <div className="login-glass-card animate-fade-in">
        <div className="login-header">
          <h2 className="eco-logo">KUNU<span>LINK</span></h2>
          <p className="login-desc-eng">Login to your account</p>
          <p className="login-desc-sin">ඔබේ ගිණුමට ඇතුළු වන්න</p>
        </div>

        <form onSubmit={handleLogin} className="eco-form">
          <div className="eco-input-group">
            <label>Username / පරිශීලක නාමය</label>
            <input 
              type="text" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="eco-input-group">
            <label>Password / මුරපදය</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="eco-login-btn">Login Now</button>
        </form>

        <div className="eco-auth-footer">
          <p>Don't have an account? <span onClick={() => navigate('/register')}>Register Here</span></p>
          <button className="eco-back-link" onClick={() => navigate('/')}>← Back to Home Page</button>
        </div>
      </div>
    </div>
  );
}

export default Home;