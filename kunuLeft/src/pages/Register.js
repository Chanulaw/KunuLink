import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      alert("මුරපද එකිනෙකට නොගැලපේ!");
      return;
    }
    alert("සාර්ථකව ලියාපදිංචි විය!");
    navigate('/login'); // රෙජිස්ටර් වූ පසු ලොගින් පේජ් එකට යවයි
  };

  return (
    <div className="auth-container full-height">
      <div className="login-card shadow-premium animate-slide-up">
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">අලුත් ගිණුමක් ආරම්භ කරන්න</p>
        
        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="email@example.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="login-submit-btn">Register</button>
        </form>

        <div className="auth-footer-text">
          <span>දැනටමත් ගිණුමක් තිබේද? </span>
          <button className="link-btn" onClick={() => navigate('/login')}>
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;