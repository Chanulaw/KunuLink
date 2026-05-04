import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; 
import '../App.css';

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match! / මුරපද එකිනෙකට නොගැලපේ!");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Firebase Auth හරහා User කෙනෙක් සෑදීම
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Firestore එකේ විස්තර Save කිරීම
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: formData.name,
        email: formData.email,
        role: 'user', 
        createdAt: new Date().toISOString()
      });

      // 3. Session එක දැනටමත් පවත්වාගෙන යාමට LocalStorage එකට දත්ත දැමීම
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('uid', user.uid);
      localStorage.setItem('username', formData.name);

      alert("Account Created Successfully! / ගිණුම සාර්ථකව නිර්මාණය විය!");
      
      navigate('/'); 

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already exists! / මෙම ඊමේල් ලිපිනය දැනටමත් භාවිතයේ ඇත.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak! / මුරපදය ප්‍රමාණවත් තරම් ශක්තිමත් නැත.');
      } else {
        setError('Registration failed! / ලියාපදිංචි වීම අසාර්ථකයි.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="hero-eco login-card-adjust animate-fade-in" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div className="login-header">
          <h2 className="logo-text">KUNU<span>LINK</span></h2>
          <p className="headline-eng">Join Today</p>
          <p className="headline-sin">අලුත් ගිණුමක් ආරම්භ කරන්න</p>
        </div>

        {error && (
          <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

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

          <button 
            type="submit" 
            className="primary-eco-btn login-btn-wide"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
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