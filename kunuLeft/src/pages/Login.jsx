import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Firebase Auth හරහා ඇතුළත් කළ Email සහ Password සත්‍යාපනය කිරීම
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Firestore එකේ 'users' collection එකේ අදාළ User ID (UID) එකට අදාළ Document එක කියවීම
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role; // මෙතනින් තමයි 'admin' ද 'user' ද කියලා හඳුනා ගන්නේ

        // 3. Local Storage එකේ දත්ත තැන්පත් කිරීම (App.js එකේ Protected Routes වලට අවශ්‍ය වේ)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role || 'user');
        localStorage.setItem('activeUserName', userData.name || 'User');
        
        // 4. Role එක අනුව අදාළ Dashboard එකට යොමු කිරීම (Redirect)
        if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/request', { replace: true });
        }

      } else {
        setError("පරිශීලක ගිණුමේ දත්ත (Role) සොයාගත නොහැක. කරුණාකර Firestore පරික්ෂා කරන්න.");
      }
    } catch (err) {
      console.error(err);
      // Firebase වල එන විවිධ බලාපොරොත්තු නොවන errors හැසිරවීම
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("වැරදි ඊමේල් ලිපිනයක් හෝ මුරපදයක්! කරුණාකර නැවත උත්සාහ කරන්න.");
      } else {
        setError("පිවිසීමේදී දෝෂයක් සිදු විය: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="login-card">
        <div className="brand-header">
          <h1 className="brand-logo">KUNULINK</h1>
          <p className="brand-tagline">Smart Waste Management Portal</p>
        </div>

        <h2 className="login-title">Login (ඇතුල් වන්න)</h2>
        
        {/* Error පණිවිඩ පෙන්වන කොටස */}
        {error && (
          <p style={{ 
            color: '#ef4444', 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '15px',
            background: '#fef2f2',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #fee2e2'
          }}>
            ⚠️ {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="user@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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

          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={loading}
          >
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>ගිණුමක් නොමැතිද? </span>
          <button 
            onClick={() => navigate('/register')} 
            className="register-link"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;