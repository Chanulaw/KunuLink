import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // ඔබේ firebase configuration එක නිවැරදිදැයි බලන්න
import '../App.css';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Firebase Auth හරහා ලොග් වීම
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore එකෙන් අදාළ User Role එක (Admin ද නැද්ද යන්න) ලබා ගැනීම
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // Session එක Local Storage එකේ තබා ගැනීම
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('uid', user.uid);
        localStorage.setItem('username', userData.username || userData.fullName);

        // Role එක අනුව Navigate කිරීම
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard'); // හෝ ඔබ කැමති User Page එකක්
        }
      } else {
        setError('User profile not found! / පරිශීලක තොරතුරු සොයාගත නොහැක.');
      }
    } catch (err) {
      // වැරදි විස්තර ඇතුළත් කළහොත් පෙන්වන පණිවිඩ
      setError('Invalid email or password! / දත්ත වැරදියි!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-wrapper"> 
      <div className="hero-eco login-card-adjust animate-fade-in">
        <div className="login-header">
          <h2 className="logo-text">KUNU<span>LINK</span></h2>
          <p className="headline-eng">Welcome Back!</p>
          <p className="headline-sin">ඔබේ ගිණුමට ඇතුළු වන්න</p>
        </div>

        {/* Error එකක් තිබේ නම් පෙන්වීමට */}
        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.8rem' }}>{error}</p>}

        <form onSubmit={handleLogin} className="eco-form">
          <div className="eco-input-group">
            <label className="si-desc">Email Address / විද්‍යුත් තැපෑල</label>
            <input 
              className="eco-field"
              type="email" 
              placeholder="Enter email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="eco-input-group">
            <label className="si-desc">Password / මුරපදය</label>
            <input 
              className="eco-field"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="primary-eco-btn login-btn-wide" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Login Now'}
          </button>
        </form>

        <div className="eco-auth-footer">
          <p className="description-box" style={{fontSize: '0.95rem', margin: '20px 0'}}>
            Don't have an account? <strong style={{color: '#16a34a', cursor: 'pointer'}} onClick={() => navigate('/register')}>Register Here</strong>
          </p>
          <button className="service-pill back-btn-pill" onClick={() => navigate('/')} style={{cursor: 'pointer', margin: '0 auto'}}>
              <strong>← Back to Home Page</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;