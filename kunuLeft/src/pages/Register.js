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
      alert("Passwords do not match! / මුරපද එකිනෙකට නොගැලපේ!");
      return;
    }
    alert("Account Created Successfully! / ගිණුම සාර්ථකව නිර්මාණය විය!");
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="landing-wrapper">
      <div className="hero-eco login-card-adjust animate-fade-in" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div className="login-header">
          <h2 className="logo-text">KUNU<span>LINK</span></h2>
          <p className="headline-eng">Join Today</p>
          <p className="headline-sin">අලුත් ගිණුමක් ආරම්භ කරන්න</p>
        </div>

        <form onSubmit={handleRegister} className="eco-form">
          <div className="eco-input-group">
            <label className="si-desc">Full Name / සම්පූර්ණ නම</label>
            <input 
              name="name"
              className="eco-field"
              type="text" 
              placeholder="Enter your name" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="eco-input-group">
            <label className="si-desc">Email Address / විද්‍යුත් තැපෑල</label>
            <input 
              name="email"
              className="eco-field"
              type="email" 
              placeholder="example@mail.com" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="eco-input-group">
            <label className="si-desc">Password / මුරපදය</label>
            <input 
              name="password"
              className="eco-field"
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="eco-input-group">
            <label className="si-desc">Confirm Password / මුරපදය තහවුරු කරන්න</label>
            <input 
              name="confirmPassword"
              className="eco-field"
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="primary-eco-btn login-btn-wide">Create Account</button>
        </form>

        <div className="eco-auth-footer">
          <p className="description-box" style={{fontSize: '0.95rem', margin: '20px 0'}}>
            Already have an account? <strong style={{color: '#16a34a', cursor: 'pointer'}} onClick={() => navigate('/login')}>Login Here</strong>
          </p>
          <button className="service-pill back-btn-pill" onClick={() => navigate('/')} style={{cursor: 'pointer', margin: '0 auto'}}>
             <strong>← Back to Home Page</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;