import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, address, email, phone, password, confirmPassword } = formData;

    if (!name || !address || !email || !phone || !password) {
      setError('කרוණාකර සියලුම විස්තර ඇතුළත් කරන්න.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password එකිනෙකට ගැලපෙන්නේ නැත.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password එක සඳහා අවම වශයෙන් අකුරු/ඉලක්කම් 6ක්වත් තිබිය යුතුය.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        address: address,
        email: email,
        phone: phone,
        role: 'user',
        createdAt: new Date()
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('activeUserName', name);
      localStorage.setItem('uid', user.uid);

      navigate('/request');

    } catch (err) {
      console.error("Registration Error: ", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('මෙම Email ලිපිනය දැනටමත් ලියාපදිංචි කර ඇත.');
      } else {
        setError('ලියාපදිංචි වීමේදී දෝෂයක් සිදු විය: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      {/* 💎 Login එකට සමාන Premium Glass Card එක */}
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-tagline">Join KunuLink Smart Recycling Network</p>

        {error && (
          <div className="auth-error-box">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          {/* Inputs ටික ලස්සනට පෙළගස්වන Grid Wrapper එක */}
          <div className="form-grid">
            
            {/* 1. Full Name */}
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>

            {/* 2. Address */}
            <div className="input-group">
              <label>Address</label>
              <input type="text" name="address" placeholder="123, Galle Road, Colombo" value={formData.address} onChange={handleChange} required />
            </div>

            {/* 3. Phone Number */}
            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="0712345678" value={formData.phone} onChange={handleChange} required />
            </div>

            {/* 4. Email Address */}
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} required />
            </div>

            {/* 5. Password */}
            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>

            {/* 6. Confirm Password */}
            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

          </div>

          {/* Submit Button */}
          <button type="submit" className="register-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <p className="register-footer-text">
          Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;