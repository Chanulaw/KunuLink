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

  return (
    <div className="eco-auth-container">
      <div className="login-glass-card animate-fade-in">
        <div className="login-header">
          <h2 className="eco-logo">KUNU<span>LINK</span></h2>
          <p className="login-desc-eng">Create your account</p>
          <p className="login-desc-sin">අලුත් ගිණුමක් ආරම්භ කරන්න</p>
        </div>

        <form onSubmit={handleRegister} className="eco-form">
          <div className="eco-input-group">
            <label>Full Name / සම්පූර්ණ නම</label>
            <input type="text" placeholder="Enter your name" required />
          </div>

          <div className="eco-input-group">
            <label>Email Address / විද්‍යුත් තැපෑල</label>
            <input type="email" placeholder="example@mail.com" required />
          </div>

          <div className="eco-input-group">
            <label>Password / මුරපදය</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <div className="eco-input-group">
            <label>Confirm Password / මුරපදය තහවුරු කරන්න</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="eco-login-btn">Create Account</button>
        </form>

        <div className="eco-auth-footer">
          <p>Already have an account? <span onClick={() => navigate('/login')}>Login Here</span></p>
          <button className="eco-back-link" onClick={() => navigate('/')}>← Back to Home Page</button>
        </div>
      </div>
    </div>
  );
}

export default Register;