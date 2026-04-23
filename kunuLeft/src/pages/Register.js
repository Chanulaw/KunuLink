import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("මුරපද එකිනෙකට නොගැලපේ!");
      return;
    }
    
    setIsLoading(true);
    // දත්ත ගබඩා කිරීමේ ක්‍රියාවලිය අනුකරණය කිරීම (Simulation)
    setTimeout(() => {
      alert("ගිණුම සාර්ථකව සාදන ලදී! දැන් ලොග් වන්න.");
      navigate('/'); // සාර්ථක වූ පසු ලොගින් පේජ් එකට යැවීම
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="login-card registration-card">
        <div className="brand-header">
          <h1 className="brand-logo">KUNU<span>LINK</span></h1>
          <p className="brand-tagline">Create Your New Account</p>
        </div>

        <h2 className="login-title">Register</h2>
        
        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="Enter your full name" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="e.g. name@example.com" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username"
              placeholder="Choose a username" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Create a password" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm your password" 
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '20px' }}>
          දැනටමත් ගිණුමක් තිබේද? 
          <span className="register-link" onClick={() => navigate('/')}>
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;